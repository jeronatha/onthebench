import type { PublicListing } from "./listings";
import { toPublicListing } from "./listings";

const H = 3_600_000;
const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * H);
const day = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

const rows = [
  {
    id: "mock-alex",
    handle: "alex-mercer",
    name: "Alex Mercer",
    oneLine: "Ships production Next.js apps in two-week sprints.",
    link: "alexmercer.dev",
    iconUrl: null,
    categorySlug: "react-next",
    availableFrom: day("2026-08-20"),
    capacity: "4-5",
    lastValue: 26,
    lastPaidAt: hoursAgo(11),
    createdAt: hoursAgo(240),
  },
  {
    id: "mock-priya",
    handle: "priya-anand",
    name: "Priya Anand",
    oneLine: "LLM agent pipelines, evals, and the boring glue between.",
    link: "priya.anand.dev",
    iconUrl: null,
    categorySlug: "ai-agents",
    availableFrom: day("2026-09-15"),
    capacity: "2-3",
    lastValue: 15,
    lastPaidAt: hoursAgo(62),
    createdAt: hoursAgo(500),
  },
  {
    id: "mock-vernet",
    handle: "studio-vernet",
    name: "Studio Vernet",
    oneLine: "Webflow builds for B2B SaaS. Design and dev in one pass.",
    link: "studiovernet.com",
    iconUrl: null,
    categorySlug: "webflow",
    availableFrom: day("2026-09-02"),
    capacity: "2-3",
    lastValue: 14,
    lastPaidAt: hoursAgo(9),
    createdAt: hoursAgo(300),
  },
  {
    id: "mock-nadia",
    handle: "nadia-roche",
    name: "Nadia Roche",
    oneLine: "Technical SEO audits and migrations. Ex-Algolia.",
    link: "nadia.roche.work",
    iconUrl: null,
    categorySlug: "technical-seo",
    availableFrom: day("2026-08-01"),
    capacity: "1",
    lastValue: 12,
    lastPaidAt: hoursAgo(26),
    createdAt: hoursAgo(800),
  },
  {
    id: "mock-tobias",
    handle: "tobias-lund",
    name: "Tobias Lund",
    oneLine: "Framer sites for launch weeks. Turnaround under 5 days.",
    link: "lund.work",
    iconUrl: null,
    categorySlug: "framer",
    availableFrom: day("2026-08-20"),
    capacity: "4-5",
    lastValue: 9,
    lastPaidAt: hoursAgo(20),
    createdAt: hoursAgo(600),
  },
  {
    id: "mock-marc",
    handle: "marc-oyelaran",
    name: "Marc Oyelaran",
    oneLine: "React and TypeScript. Takes over half-finished codebases.",
    link: "oyelaran.dev",
    iconUrl: null,
    categorySlug: "react-next",
    availableFrom: day("2026-08-10"),
    capacity: "4-5",
    lastValue: 6,
    lastPaidAt: hoursAgo(38),
    createdAt: hoursAgo(900),
  },
  {
    id: "mock-jo",
    handle: "jo-bergstrom",
    name: "Jo Bergström",
    oneLine: "Brand identity for small software companies.",
    link: "bergstrom.studio",
    iconUrl: null,
    categorySlug: "brand-identity",
    availableFrom: day("2026-08-18"),
    capacity: "2-3",
    lastValue: 5,
    lastPaidAt: hoursAgo(74),
    createdAt: hoursAgo(1000),
  },
  {
    id: "mock-kit",
    handle: "kit-vasquez",
    name: "Kit Vasquez",
    oneLine: "Shopify themes and headless storefronts.",
    link: "kitvasquez.com",
    iconUrl: null,
    categorySlug: "shopify",
    availableFrom: day("2026-09-08"),
    capacity: "1",
    lastValue: 4,
    lastPaidAt: hoursAgo(96),
    createdAt: hoursAgo(1100),
  },
  {
    id: "mock-sam",
    handle: "sam-aldridge",
    name: "Sam Aldridge",
    oneLine: "Product video and launch edits for SaaS teams.",
    link: "samaldridge.co",
    iconUrl: null,
    categorySlug: "video-motion",
    availableFrom: day("2026-08-20"),
    capacity: "2-3",
    lastValue: 0.42,
    lastPaidAt: hoursAgo(320),
    createdAt: hoursAgo(1400),
  },
  {
    id: "mock-renata",
    handle: "renata-silva",
    name: "Renata Silva",
    oneLine: "Launch copy and product pages for B2B tools.",
    link: "renatasilva.me",
    iconUrl: null,
    categorySlug: "copywriting",
    availableFrom: day("2026-08-20"),
    capacity: "2-3",
    lastValue: 0.3,
    lastPaidAt: hoursAgo(400),
    createdAt: hoursAgo(1500),
  },
  {
    id: "mock-hugo",
    handle: "hugo-ferreira",
    name: "Hugo Ferreira",
    oneLine: "Native iOS, Swift, and the App Store grind.",
    link: "hugoferreira.app",
    iconUrl: null,
    categorySlug: "ios-android",
    availableFrom: day("2026-09-22"),
    capacity: "4-5",
    lastValue: 0.2,
    lastPaidAt: hoursAgo(500),
    createdAt: hoursAgo(1600),
  },
  {
    id: "mock-dana",
    handle: "dana-whitlock",
    name: "Dana Whitlock",
    oneLine: "dbt, Snowflake, and the pipelines nobody wants to own.",
    link: "danawhitlock.dev",
    iconUrl: null,
    categorySlug: "data-engineering",
    availableFrom: day("2026-08-20"),
    capacity: "2-3",
    lastValue: 0.004,
    lastPaidAt: hoursAgo(720),
    createdAt: hoursAgo(1800),
  },
  {
    id: "mock-oskar",
    handle: "oskar-nowak",
    name: "Oskar Nowak",
    oneLine: "n8n and Make automations for ops-heavy startups.",
    link: "oskarnowak.pl",
    iconUrl: null,
    categorySlug: "automation",
    availableFrom: day("2026-08-20"),
    capacity: "1",
    lastValue: 0.003,
    lastPaidAt: hoursAgo(800),
    createdAt: hoursAgo(1900),
  },
  {
    id: "mock-leah",
    handle: "leah-mbeki",
    name: "Leah Mbeki",
    oneLine: "Landing pages in Webflow and Framer for seed rounds.",
    link: "leahmbeki.com",
    iconUrl: null,
    categorySlug: "landing-pages",
    availableFrom: day("2026-10-01"),
    capacity: "2-3",
    lastValue: 0.002,
    lastPaidAt: hoursAgo(900),
    createdAt: hoursAgo(2000),
  },
  {
    id: "mock-theo",
    handle: "theo-lacroix",
    name: "Théo Lacroix",
    oneLine: "React Native and Expo for v1 mobile apps.",
    link: "theolacroix.fr",
    iconUrl: null,
    categorySlug: "ios-android",
    availableFrom: day("2026-08-20"),
    capacity: "4-5",
    lastValue: 0.001,
    lastPaidAt: hoursAgo(1000),
    createdAt: hoursAgo(2100),
  },
  {
    id: "mock-yuki",
    handle: "yuki-tanaka",
    name: "Yuki Tanaka",
    oneLine: "Framer sites with motion for product launches.",
    link: "yukitanaka.design",
    iconUrl: null,
    categorySlug: "framer",
    availableFrom: day("2026-09-05"),
    capacity: "1",
    lastValue: 0.001,
    lastPaidAt: hoursAgo(1100),
    createdAt: hoursAgo(2200),
  },
];

function splitBoard(listings: PublicListing[]) {
  const ranked = listings
    .filter((l) => l.state === "ranked" || l.state === "fading")
    .sort((a, b) => {
      if (b.liveValue !== a.liveValue) return b.liveValue - a.liveValue;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const open = listings
    .filter((l) => l.state === "open")
    .sort((a, b) => new Date(b.lastPaidAt).getTime() - new Date(a.lastPaidAt).getTime());

  return { ranked, open, all: listings };
}

export function mockBoard(categorySlug?: string) {
  const listings = rows
    .filter((row) => !categorySlug || row.categorySlug === categorySlug)
    .map((row) => toPublicListing(row, now));

  const board = splitBoard(listings);
  const counts = Object.fromEntries(
    rows.reduce<Map<string, number>>((acc, row) => {
      acc.set(row.categorySlug, (acc.get(row.categorySlug) ?? 0) + 1);
      return acc;
    }, new Map()),
  );

  return { ...board, counts };
}
