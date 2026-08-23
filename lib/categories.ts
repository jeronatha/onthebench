export type Category = {
  slug: string;
  label: string;
};

export const CATEGORIES: Category[] = [
  { slug: "brand-identity", label: "Brand identity" },
  { slug: "product-design", label: "Product design" },
  { slug: "web-design", label: "Web design" },
  { slug: "webflow", label: "Webflow" },
  { slug: "framer", label: "Framer" },
  { slug: "shopify", label: "Shopify" },
  { slug: "react-next", label: "React / Next.js" },
  { slug: "landing-pages", label: "Landing pages" },
  { slug: "technical-seo", label: "Technical SEO" },
  { slug: "copywriting", label: "Copywriting" },
  { slug: "content", label: "Content & newsletters" },
  { slug: "ai-agents", label: "AI agents" },
  { slug: "automation", label: "Automation" },
  { slug: "video-motion", label: "Video & motion" },
  { slug: "illustration", label: "Illustration" },
  { slug: "ios-android", label: "iOS / Android" },
  { slug: "backend", label: "Backend & APIs" },
  { slug: "data-engineering", label: "Data engineering" },
  { slug: "growth", label: "Paid ads & growth" },
  { slug: "strategy", label: "Strategy / fractional" },
];

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function isCategorySlug(slug: string): boolean {
  return CATEGORIES.some((c) => c.slug === slug);
}

export function sortCategoriesByCount(
  counts: Record<string, number>,
): Array<Category & { count: number }> {
  return CATEGORIES.map((c) => ({ ...c, count: counts[c.slug] ?? 0 })).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.label.localeCompare(b.label);
  });
}
