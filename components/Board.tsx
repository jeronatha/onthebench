import Link from "next/link";
import type { PublicListing } from "@/lib/listings";
import { MIN_PAYMENT } from "@/lib/decay";
import { displayLink } from "@/lib/normalize";
import { Avatar } from "./Avatar";
import { BurnValue } from "./BurnValue";
import { EmptyState } from "./EmptyState";

function gate(n: number) {
  return String(n).padStart(2, "0");
}

export function RankedBoard({
  listings,
  categoryLabel,
}: {
  listings: PublicListing[];
  categoryLabel?: string;
}) {
  if (listings.length === 0) {
    const scoped = Boolean(categoryLabel);
    return (
      <EmptyState
        title={scoped ? `Nobody ranked in ${categoryLabel} yet` : "Nobody on the ranked board yet"}
        action={{
          href: "/list",
          label: scoped ? `List in ${categoryLabel} →` : `Claim the top spot →`,
        }}
      >
        {scoped
          ? `Be the first. Pay $${MIN_PAYMENT} or more — live value burns 10% a day.`
          : `Pay $${MIN_PAYMENT} or more to claim the top spot. Higher payment, higher rank. Live value burns 10% a day.`}
      </EmptyState>
    );
  }

  return (
    <div className="board-ranked">
      {listings.map((listing, i) => (
        <Link
          key={listing.id}
          href={`/f/${listing.handle}`}
          className={`row anim-row${i === 0 ? " top anim-top" : ""}${listing.state === "fading" ? " fading" : ""}`}
          style={{ animationDelay: `${Math.min(i * 55, 440)}ms` }}
        >
          <div className="rank">
            <span className="gate">GATE</span>
            {gate(i + 1)}
          </div>
          <div className="who">
            <Avatar name={listing.name} iconUrl={listing.iconUrl} />
            <div>
              <div className="name">{listing.name}</div>
              <div className="line">{listing.oneLine}</div>
              <div className="meta">
                <span className="url">{displayLink(listing.link)}</span> · {listing.categoryLabel} ·{" "}
                <span className={listing.availableNow ? "now" : undefined}>
                  {listing.availableLabel}
                </span>{" "}
                · {listing.capacityLabel}
              </div>
            </div>
          </div>
          <BurnValue
            lastValue={listing.lastValue}
            lastPaidAt={listing.lastPaidAt}
            low={listing.state === "fading"}
          />
        </Link>
      ))}
    </div>
  );
}

export function OpenList({
  listings,
  categoryLabel,
  rankedCount = 0,
}: {
  listings: PublicListing[];
  categoryLabel?: string;
  rankedCount?: number;
}) {
  if (listings.length === 0) {
    if (rankedCount === 0) return null;

    const scoped = Boolean(categoryLabel);
    return (
      <EmptyState
        title={scoped ? `No open listings in ${categoryLabel}` : "The open list is empty"}
      >
        {scoped
          ? "When live value hits zéro, listings move here. The profile stays live."
          : "Listings move here when live value hits zéro. The profile stays live — payment bought rank, not the URL."}
      </EmptyState>
    );
  }

  return (
    <div className="open-list">
      {listings.map((listing, i) => (
        <Link
          key={listing.id}
          href={`/f/${listing.handle}`}
          className="anim-open"
          style={{ animationDelay: `${Math.min(i * 40, 320)}ms` }}
        >
          <b>{listing.name}</b>
          <span>
            {displayLink(listing.link)} · {listing.categoryLabel} ·{" "}
            {listing.availableLabel.toLowerCase()}
          </span>
        </Link>
      ))}
    </div>
  );
}
