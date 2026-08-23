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
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description: desc,
    },
  };
}
