import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "./site";
import { siteUrl } from "./stripe";

type PageMeta = {
  title?: string;
  description?: string;
  path?: string;
};

export function pageMetadata({ title, description, path = "" }: PageMeta = {}): Metadata {
  const url = `${siteUrl()}${path}`;
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_TITLE;
  const desc = description ?? SITE_DESCRIPTION;

  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical: path || "/" },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: fullTitle,
      description: desc,
      url,
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description: desc,
    },
  };
}
