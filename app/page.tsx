import type { Metadata } from "next";
import { CategoryRail } from "@/components/CategoryRail";
import { OpenList, RankedBoard } from "@/components/Board";
import { EmptyState } from "@/components/EmptyState";
import { Masthead } from "@/components/SiteChrome";
import { pageMetadata } from "@/lib/seo";
import { SITE_TAGLINE } from "@/lib/site";
import { safeBoard } from "@/lib/listings";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  description: SITE_TAGLINE,
  path: "/",
});

export default async function HomePage() {
  const { ranked, open, all, counts, dbError } = await safeBoard();

  return (
    <>
      <Masthead>
        <div className="strip">
          <span className="stat">
            Ranked<b>{ranked.length}</b>
          </span>
          <span className="stat">
            Open listings<b>{open.length}</b>
          </span>
          <span className="stat">
            On the board<b>{all.length}</b>
          </span>
          <span className="stat">
            Burn rate<b>10% / 24h</b>
          </span>
        </div>
        <CategoryRail counts={counts} total={all.length} />
      </Masthead>

      {dbError ? (
        <EmptyState variant="error" title="Board temporarily unavailable">
          We can&apos;t load listings right now. Try again in a few minutes.
        </EmptyState>
      ) : (
        <main className="anim-main">
          <div className="section-head">
            <span>Priority · ranked</span>
            <span>Live value</span>
          </div>
          <RankedBoard listings={ranked} />

          {!(ranked.length === 0 && open.length === 0) ? (
            <>
              <div className="section-head">
                <span>Open listings</span>
                <span>Most recent first</span>
              </div>
              <OpenList listings={open} rankedCount={ranked.length} />
            </>
          ) : null}
        </main>
      )}
    </>
  );
}
