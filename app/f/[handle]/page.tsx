import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { BurnValue } from "@/components/BurnValue";
import { Masthead } from "@/components/SiteChrome";
import { prisma } from "@/lib/db";
import { displayLink } from "@/lib/normalize";
import { toPublicListing } from "@/lib/listings";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  try {
    const row = await prisma.listing.findUnique({ where: { handle } });
    if (!row) return pageMetadata({ title: "Profile not found" });

    return pageMetadata({
      title: `${row.name} — ${displayLink(row.link)}`,
      description: row.oneLine,
      path: `/f/${handle}`,
    });
  } catch {
    return pageMetadata({ title: "Profile" });
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const row = await prisma.listing.findUnique({ where: { handle } });
  if (!row) notFound();

  const listing = toPublicListing(row);
  const mailto = `mailto:${row.contactEmail}?subject=onthebench — ${listing.name}`;

  return (
    <>
      <Masthead
        kicker={displayLink(listing.link)}
        tag={listing.oneLine}
        actionHref="/list"
        actionLabel="Top up"
      />

      <main className="anim-main" style={{ marginTop: 28 }}>
        <div className="profile-head">
          <Avatar name={listing.name} iconUrl={listing.iconUrl} className="profile-icon" />
          <div>
            <h2 className="page-title">{listing.name}</h2>
            <p className="profile-url">{displayLink(listing.link)}</p>
            <p className="tag" style={{ color: "var(--ink-soft)", maxWidth: "46ch" }}>
              {listing.oneLine}
            </p>
            <p className="profile-meta">
              {listing.categoryLabel} ·{" "}
              <span className={listing.availableNow ? "now" : undefined}>{listing.availableLabel}</span>{" "}
              · {listing.capacityLabel}
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 220, marginTop: 28 }}>
          <div className="section-head" style={{ paddingTop: 0 }}>
            <span>Live value</span>
            <span>{listing.state}</span>
          </div>
          <BurnValue lastValue={listing.lastValue} lastPaidAt={listing.lastPaidAt} />
        </div>

        <div className="profile-actions">
          <a className="btn" href={mailto}>
            Inquire
          </a>
          <a
            className="btn btn-ghost"
            href={listing.href}
            rel="noopener noreferrer"
            style={{ color: "var(--navy)", borderColor: "var(--navy)" }}
          >
            Visit site
          </a>
          <Link
            className="btn btn-ghost"
            href={`/c/${listing.categorySlug}`}
            style={{ color: "var(--navy)", borderColor: "var(--navy)" }}
          >
            {listing.categoryLabel}
          </Link>
        </div>
      </main>
    </>
  );
}
