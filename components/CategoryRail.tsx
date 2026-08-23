"use client";

import Link from "next/link";
import { useState } from "react";
import { sortCategoriesByCount } from "@/lib/categories";

type Props = {
  active?: string;
  counts: Record<string, number>;
  total: number;
};

const RAIL_VISIBLE = 6;

export function CategoryRail({ active, counts, total }: Props) {
  const [open, setOpen] = useState(false);
  const sorted = sortCategoriesByCount(counts);
  const withListings = sorted.filter((c) => c.count > 0);
  const visible = withListings.slice(0, RAIL_VISIBLE);
  const activeCategory = active ? sorted.find((c) => c.slug === active) : undefined;
  const showActive =
    activeCategory && !visible.some((c) => c.slug === active) ? activeCategory : null;

  return (
    <div className="rail-wrap">
      <nav className="rail" aria-label="Categories">
        <Link className={`cat${!active ? " on" : ""}`} href="/">
          All
        </Link>
        {showActive ? (
          <Link className="cat on" href={`/c/${showActive.slug}`}>
            {showActive.label}
          </Link>
        ) : null}
        {visible.map((c) => (
          <Link
            key={c.slug}
            className={`cat${active === c.slug ? " on" : ""}`}
            href={`/c/${c.slug}`}
          >
            {c.label}
          </Link>
        ))}
        <button
          type="button"
          className={`cat cat-more-btn${open ? " on" : ""}`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Less" : "More"}
        </button>
        {withListings.length === 0 && total === 0 ? (
          <span className="cat">No listings yet</span>
        ) : null}
      </nav>

      {open ? (
        <div className="cat-more-panel anim-rise" role="region" aria-label="All categories">
          {sorted.map((c) => (
            <Link
              key={c.slug}
              className={`cat-more-item${active === c.slug ? " on" : ""}`}
              href={`/c/${c.slug}`}
              onClick={() => setOpen(false)}
            >
              <span>{c.label}</span>
              <b>{c.count}</b>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
