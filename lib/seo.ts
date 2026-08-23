import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_DOMAIN, SITE_NAME, SITE_TITLE } from "./site";
import { siteUrl } from "./stripe";

type PageMeta = {
  title?: string;
  description?: string;
  path?: string;
};

export function siteMetadataBase(): URL {
  return new URL(siteUrl());
}

export function pageMetadata({ title, description, path = "/" }: PageMeta = {}): Metadata {
  const base = siteMetadataBase();
  const pathname = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(pathname, base);
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_TITLE;
  const desc = description ?? SITE_DESCRIPTION;

  return {
    metadataBase: base,
    title: fullTitle,
    description: desc,
    alternates: { canonical: pathname },
    openGraph: {
      type: "website",
      siteName: SITE_DOMAIN,
      title: fullTitle,
      description: desc,
      url: url.toString(),
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_TITLE }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: ["/opengraph-image"],
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      shortcut: "/icon.svg",
      apple: [{ url: "/apple-icon.svg", type: "image/svg+xml", sizes: "180x180" }],
    },
  };
}
