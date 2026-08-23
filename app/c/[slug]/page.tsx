import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryRail } from "@/components/CategoryRail";
import { OpenList, RankedBoard } from "@/components/Board";
import { Masthead } from "@/components/SiteChrome";
import { categoryBySlug } from "@/lib/categories";
import { pageMetadata } from "@/lib/seo";
import { safeBoard } from "@/lib/listings";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) return pageMetadata({ title: "Category not found" });

  return pageMetadata({
    title: `${category.label} freelancers & agencies`,
    description: `Freelancers and agencies in ${category.label}, ranked by live value on onthebench.lol. Burns 10% a day — the top is whoever's actually free.`,
    path: `/c/${slug}`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) notFound();

  const { ranked, open, all, counts } = await safeBoard(slug);

  return (
    <>
      <Masthead
        kicker={`Category · ${category.label}`}
        tag={`${category.label} on the ranked board. Same rules — live value, 10% burn per day.`}
      >
        <div className="strip">
          <span className="stat">
            Ranked<b>{ranked.length}</b>
          </span>
          <span className="stat">
            Open<b>{open.length}</b>
          </span>
          <span className="stat">
            In {category.label}<b>{all.length}</b>
          </span>
        </div>
        <CategoryRail active={slug} counts={counts} total={all.length} />
      </Masthead>

      <main className="anim-main">
        <div className="section-head">
          <span>Priority · {category.label}</span>
          <span>Live value</span>
        </div>
        <RankedBoard listings={ranked} />

        <div className="section-head">
          <span>Open listings</span>
          <span>Most recent first</span>
        </div>
        <OpenList listings={open} />
      </main>
    </>
  );
}
