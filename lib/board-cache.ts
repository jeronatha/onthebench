import type { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { prisma } from "./db";

export const BOARD_REVALIDATE_SECONDS = 60;
export const SITEMAP_REVALIDATE_SECONDS = 3600;
export const BOARD_CACHE_TAG = "board";

export const listingBoardSelect = {
  id: true,
  handle: true,
  name: true,
  oneLine: true,
  link: true,
  iconUrl: true,
  categorySlug: true,
  availableFrom: true,
  capacity: true,
  lastValue: true,
  lastPaidAt: true,
  createdAt: true,
} satisfies Prisma.ListingSelect;

export type ListingBoardRow = Prisma.ListingGetPayload<{ select: typeof listingBoardSelect }>;

async function queryListingRows(): Promise<ListingBoardRow[]> {
  return prisma.listing.findMany({
    select: listingBoardSelect,
    orderBy: { createdAt: "asc" },
  });
}

async function querySitemapProfiles() {
  return prisma.listing.findMany({
    select: { handle: true, lastPaidAt: true },
    orderBy: { lastPaidAt: "desc" },
  });
}

export const getListingRows = unstable_cache(
  queryListingRows,
  ["listing-board-rows"],
  { revalidate: BOARD_REVALIDATE_SECONDS, tags: [BOARD_CACHE_TAG] },
);

export const getSitemapProfiles = unstable_cache(
  async () => {
    try {
      return await querySitemapProfiles();
    } catch {
      return [];
    }
  },
  ["sitemap-profiles"],
  { revalidate: SITEMAP_REVALIDATE_SECONDS, tags: [BOARD_CACHE_TAG] },
);

export function revalidateBoardCache(handle?: string, categorySlug?: string) {
  revalidateTag(BOARD_CACHE_TAG);
  revalidatePath("/");
  revalidatePath("/list");
  revalidatePath("/c", "layout");
  if (categorySlug) revalidatePath(`/c/${categorySlug}`);
  if (handle) revalidatePath(`/f/${handle}`);
}
