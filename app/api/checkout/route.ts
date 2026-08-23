import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { emailsMatch, OwnerEmailMismatchError, assertListingOwner } from "@/lib/email";
import { listingInputSchema } from "@/lib/listing-fields";
import { applyPayment } from "@/lib/listings";
import { normalizeLink } from "@/lib/normalize";
import { SITE_DOMAIN } from "@/lib/site";
import { allowFreeList, getStripe, paymentsConfigured, siteUrl } from "@/lib/stripe";

export const runtime = "nodejs";

async function assertOwnerEmail(linkKey: string, email: string) {
  const existing = await prisma.listing.findUnique({ where: { linkKey } });
  if (existing) assertListingOwner(existing.contactEmail, email);
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = listingInputSchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid listing";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  const data = parsed.data;
  const linkKey = normalizeLink(data.link);
  if (!linkKey) {
    return NextResponse.json({ error: "Link is required" }, { status: 400 });
  }

  try {
    await assertOwnerEmail(linkKey, data.contactEmail);
  } catch (error) {
    if (error instanceof OwnerEmailMismatchError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }

  if (!paymentsConfigured()) {
    if (!allowFreeList()) {
      return NextResponse.json(
        { error: "Payments are not configured yet. Set STRIPE_SECRET_KEY, or ALLOW_FREE_LIST=1 for a demo." },
        { status: 503 },
      );
    }

    try {
      const result = await applyPayment({
        stripeId: `free_${Date.now()}_${linkKey}`.slice(0, 80),
        amount: data.amount,
        name: data.name,
        oneLine: data.oneLine,
        link: data.link.trim(),
        linkKey,
        iconUrl: data.iconUrl,
        categorySlug: data.categorySlug,
        contactEmail: data.contactEmail,
        availableFrom: data.availableFrom,
        capacity: data.capacity,
      });
      return NextResponse.json({ url: `${siteUrl()}/f/${result.listing.handle}` });
    } catch (error) {
      if (error instanceof OwnerEmailMismatchError) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      throw error;
    }
  }

  const stripe = getStripe();
  const origin = siteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/list`,
    customer_email: data.contactEmail,
    custom_text: {
      submit: {
        message: `Board rules: ${origin}/rules`,
      },
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: data.amount * 100,
          product_data: {
            name: `${SITE_DOMAIN} · ${data.name}`,
            description: "Live value on the board. Burns 10% a day.",
          },
        },
      },
    ],
    metadata: {
      name: data.name,
      oneLine: data.oneLine,
      link: data.link.trim(),
      linkKey,
      iconUrl: data.iconUrl ?? "",
      categorySlug: data.categorySlug,
      contactEmail: data.contactEmail,
      availableFrom: data.availableFrom,
      capacity: data.capacity,
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "Stripe did not return a checkout URL" }, { status: 502 });
  }

  return NextResponse.json({ url: session.url });
}
