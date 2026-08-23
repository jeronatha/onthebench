import { Prisma } from "@prisma/client";
import { getListingRows, revalidateBoardCache, type ListingBoardRow } from "./board-cache";
import { prisma } from "./db";
import { liveValue, listingState } from "./decay";
import { categoryBySlug } from "./categories";
import { formatAvailable, formatCapacity } from "./dates";
import { emailsMatch, maskEmail, OwnerEmailMismatchError, assertListingOwner } from "./email";
import { handleFromLink, hrefFromLink, normalizeLink } from "./normalize";

export type PublicListing = {
  id: string;
  handle: string;
  name: string;
  oneLine: string;
  link: string;
  href: string;
  iconUrl: string | null;
  categorySlug: string;
  categoryLabel: string;
  availableLabel: string;
  availableNow: boolean;
  capacityLabel: string;
  lastValue: number;
  lastPaidAt: string;
  liveValue: number;
  state: "ranked" | "fading" | "open";
  createdAt: string;
};

function toNumber(value: Prisma.Decimal | number): number {
  return typeof value === "number" ? value : Number(value);
}

export function toPublicListing(
  row: {
    id: string;
    handle: string;
    name: string;
    oneLine: string;
    link: string;
    iconUrl: string | null;
    categorySlug: string;
    availableFrom: Date;
    capacity: string;
    lastValue: Prisma.Decimal | number;
    lastPaidAt: Date;
    createdAt: Date;
  },
  now = Date.now(),
): PublicListing {
  const last = toNumber(row.lastValue);
  const current = liveValue(last, row.lastPaidAt, now);
  return {
    id: row.id,
    handle: row.handle,
    name: row.name,
    oneLine: row.oneLine,
    link: row.link,
    href: hrefFromLink(row.link),
    iconUrl: row.iconUrl,
    categorySlug: row.categorySlug,
    categoryLabel: categoryBySlug(row.categorySlug)?.label ?? row.categorySlug,
    availableLabel: formatAvailable(row.availableFrom),
    availableNow: formatAvailable(row.availableFrom) === "Available now",
    capacityLabel: formatCapacity(row.capacity),
    lastValue: last,
    lastPaidAt: row.lastPaidAt.toISOString(),
    liveValue: current,
    state: listingState(current),
    createdAt: row.createdAt.toISOString(),
  };
}

export async function uniqueHandle(linkKey: string): Promise<string> {
  const base = handleFromLink(linkKey);
  let candidate = base;
  let n = 2;
  while (await prisma.listing.findUnique({ where: { handle: candidate } })) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

export type ApplyPayload = {
  stripeId: string;
  amount: number;
  name: string;
  oneLine: string;
  link: string;
  linkKey: string;
  iconUrl?: string;
  categorySlug: string;
  contactEmail: string;
  confirmedEmail?: string;
  availableFrom: string;
  capacity: string;
};

export async function applyPayment(payload: ApplyPayload) {
  const existingPayment = await prisma.payment.findUnique({
    where: { stripeId: payload.stripeId },
    include: { listing: true },
  });
  if (existingPayment) {
    return { listing: existingPayment.listing, created: false, toppedUp: false };
  }

  const existing = await prisma.listing.findUnique({
    where: { linkKey: payload.linkKey },
  });

  const amount = new Prisma.Decimal(payload.amount);
  const availableFrom = new Date(`${payload.availableFrom}T00:00:00.000Z`);

  if (existing) {
    assertListingOwner(existing.contactEmail, payload.contactEmail, payload.confirmedEmail);

    const current = liveValue(toNumber(existing.lastValue), existing.lastPaidAt);
    const next = current + payload.amount;

    const listing = await prisma.$transaction(async (tx) => {
      const updated = await tx.listing.update({
        where: { id: existing.id },
        data: {
          availableFrom,
          capacity: payload.capacity,
          lastValue: new Prisma.Decimal(next.toFixed(2)),
          lastPaidAt: new Date(),
        },
      });
      await tx.payment.create({
        data: {
          listingId: updated.id,
          amount,
          stripeId: payload.stripeId,
          valueBefore: new Prisma.Decimal(current.toFixed(2)),
          valueAfter: new Prisma.Decimal(next.toFixed(2)),
        },
      });
      return updated;
    });

    revalidateBoardCache(listing.handle, listing.categorySlug);
    return { listing, created: false, toppedUp: true };
  }

  const handle = await uniqueHandle(payload.linkKey);
  const listing = await prisma.$transaction(async (tx) => {
    const created = await tx.listing.create({
      data: {
        handle,
        name: payload.name,
        oneLine: payload.oneLine,
        link: payload.link,
        linkKey: payload.linkKey,
        iconUrl: payload.iconUrl || null,
        contactEmail: payload.contactEmail,
        categorySlug: payload.categorySlug,
        availableFrom,
        capacity: payload.capacity,
        lastValue: amount,
        lastPaidAt: new Date(),
      },
    });
    await tx.payment.create({
      data: {
        listingId: created.id,
        amount,
        stripeId: payload.stripeId,
        valueBefore: new Prisma.Decimal(0),
        valueAfter: amount,
      },
    });
    return created;
  });

  revalidateBoardCache(listing.handle, listing.categorySlug);
  return { listing, created: true, toppedUp: false };
}

export function gateForListingId(listingId: string, ranked: PublicListing[]): number | null {
  const gate = ranked.findIndex((l) => l.id === listingId) + 1;
  return gate > 0 ? gate : null;
}

function categoryCountsFromRows(rows: ListingBoardRow[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.categorySlug] = (counts[row.categorySlug] ?? 0) + 1;
  }
  return counts;
}

function buildBoardLists(rows: ListingBoardRow[], categorySlug?: string, now = Date.now()) {
  const scoped = categorySlug ? rows.filter((row) => row.categorySlug === categorySlug) : rows;
  const listings = scoped.map((row) => toPublicListing(row, now));

  const ranked = listings
    .filter((l) => l.state === "ranked" || l.state === "fading")
    .sort((a, b) => {
      if (b.liveValue !== a.liveValue) return b.liveValue - a.liveValue;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const open = listings
    .filter((l) => l.state === "open")
    .sort((a, b) => new Date(b.lastPaidAt).getTime() - new Date(a.lastPaidAt).getTime());

  return { ranked, open, all: listings };
}

export async function fetchBoard(categorySlug?: string) {
  const rows = await getListingRows();
  return buildBoardLists(rows, categorySlug);
}

export async function safeBoard(categorySlug?: string) {
  try {
    const rows = await getListingRows();
    const counts = categoryCountsFromRows(rows);
    const board = buildBoardLists(rows, categorySlug);
    return { ...board, counts, dbError: false };
  } catch (error) {
    console.error("Database unavailable", error);
    return {
      ranked: [],
      open: [],
      all: [],
      counts: {} as Record<string, number>,
      dbError: true,
    };
  }
}

export async function previewRank(amount: number, categorySlug?: string): Promise<number> {
  const rows = await getListingRows();
  const { ranked } = buildBoardLists(rows, categorySlug);
  return ranked.filter((l) => l.liveValue >= amount).length + 1;
}

export async function verifyListingOwner(link: string, contactEmail: string) {
  const linkKey = normalizeLink(link);
  if (!linkKey) return { ok: false as const, reason: "invalid" as const };

  const row = await prisma.listing.findUnique({ where: { linkKey } });
  if (!row) return { ok: true as const, newListing: true as const };

  if (!emailsMatch(row.contactEmail, contactEmail)) {
    return { ok: false as const, reason: "mismatch" as const, maskedEmail: maskEmail(row.contactEmail) };
  }

  return { ok: true as const, newListing: false as const };
}

export async function lookupByLink(link: string) {
  const linkKey = normalizeLink(link);
  if (!linkKey) return null;

  const row = await prisma.listing.findUnique({ where: { linkKey } });
  if (!row) return null;

  const publicListing = toPublicListing(row);
  const rows = await getListingRows();
  const { ranked } = buildBoardLists(rows);
  const gate = gateForListingId(row.id, ranked);

  return {
    exists: true as const,
    name: row.name,
    handle: row.handle,
    maskedEmail: maskEmail(row.contactEmail),
    liveValue: publicListing.liveValue,
    state: publicListing.state,
    gate,
  };
}
