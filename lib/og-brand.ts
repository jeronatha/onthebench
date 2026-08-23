export const OG_COLORS = {
  paper: "#F5F0E6",
  ink: "#1B2A4A",
  tan: "#D4C4A0",
  red: "#C8102E",
  muted: "#C5CBD6",
} as const;

async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`,
    { next: { revalidate: 60 * 60 * 24 * 7 } },
  ).then((res) => res.text());

  const match = css.match(/src: url\((.+)\) format\('(?:opentype|truetype)'\)/);
  if (!match?.[1]) throw new Error(`Failed to load font: ${family}`);

  return fetch(match[1]).then((res) => res.arrayBuffer());
}

export async function ogFonts() {
  const [display, sans, mono] = await Promise.all([
    loadGoogleFont("Bebas+Neue", 400),
    loadGoogleFont("IBM+Plex+Sans", 400),
    loadGoogleFont("IBM+Plex+Mono", 500),
  ]);

  return [
    { name: "Bebas Neue", data: display, style: "normal" as const, weight: 400 as const },
    { name: "IBM Plex Sans", data: sans, style: "normal" as const, weight: 400 as const },
    { name: "IBM Plex Mono", data: mono, style: "normal" as const, weight: 500 as const },
  ];
}
