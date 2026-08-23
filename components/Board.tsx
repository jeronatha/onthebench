import Link from "next/link";
import type { PublicListing } from "@/lib/listings";
import { displayLink } from "@/lib/normalize";
import { Avatar } from "./Avatar";
import { BurnValue } from "./BurnValue";

function gate(n: number) {
  return String(n).padStart(2, "0");
}

export function RankedBoard({ listings }: { listings: PublicListing[] }) {
  if (listings.length === 0) {
    return (
      <p className="empty">
        Nobody on the ranked board yet.{" "}
        <Link href="/list">Pay $3 to take gate 01.</Link>
      </p>
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

export function OpenList({ listings }: { listings: PublicListing[] }) {
  if (listings.length === 0) {
    return (
      <p className="empty">
        The open list is empty. Listings land here only after live value burns to zéro.
      </p>
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
