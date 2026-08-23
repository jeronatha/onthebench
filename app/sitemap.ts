import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";
import { getSitemapProfiles } from "@/lib/board-cache";
import { siteUrl } from "@/lib/stripe";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/list`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/rules`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/c/${c.slug}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: 0.7,
  }));

  const listings = await getSitemapProfiles();
  const profileRoutes: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${base}/f/${l.handle}`,
    lastModified: l.lastPaidAt,
    changeFrequency: "daily" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...profileRoutes];
}
