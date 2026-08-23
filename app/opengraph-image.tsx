import { ImageResponse } from "next/og";
import { OG_COLORS, ogFonts } from "@/lib/og-brand";
import { OG_SUBTITLE, SITE_DOMAIN } from "@/lib/site";

export const alt = `ON THE BENCH — ${OG_SUBTITLE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const fonts = await ogFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: OG_COLORS.ink,
          color: OG_COLORS.paper,
          padding: "56px 64px 0",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div
              style={{
                fontFamily: "IBM Plex Mono",
                fontSize: 18,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: OG_COLORS.tan,
              }}
            >
              Standby · final call
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "Bebas Neue",
                fontSize: 148,
                lineHeight: 0.82,
                letterSpacing: "0.02em",
                marginTop: 12,
              }}
            >
              <span>ON THE</span>
              <span>BENCH</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "IBM Plex Sans",
                fontSize: 28,
                lineHeight: 1.35,
                color: OG_COLORS.paper,
                marginTop: 24,
                maxWidth: 680,
              }}
            >
              <span>{OG_SUBTITLE}</span>
            </div>
            <div
              style={{
                fontFamily: "IBM Plex Mono",
                fontSize: 18,
                color: OG_COLORS.muted,
                marginTop: 20,
                letterSpacing: "0.04em",
              }}
            >
              {SITE_DOMAIN}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              marginTop: 8,
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                background: OG_COLORS.red,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Bebas Neue",
                fontSize: 72,
                color: OG_COLORS.paper,
              }}
            >
              #01
            </div>
            <div
              style={{
                fontFamily: "IBM Plex Mono",
                fontSize: 14,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: OG_COLORS.tan,
              }}
            >
              Rank 01
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 40,
            fontFamily: "IBM Plex Mono",
            fontSize: 16,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: OG_COLORS.muted,
          }}
        >
          <span>Burns 10% / 24h</span>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 24,
            background: OG_COLORS.paper,
            clipPath:
              "polygon(0% 100%, 0% 50%, 2% 0%, 4% 50%, 6% 0%, 8% 50%, 10% 0%, 12% 50%, 14% 0%, 16% 50%, 18% 0%, 20% 50%, 22% 0%, 24% 50%, 26% 0%, 28% 50%, 30% 0%, 32% 50%, 34% 0%, 36% 50%, 38% 0%, 40% 50%, 42% 0%, 44% 50%, 46% 0%, 48% 50%, 50% 0%, 52% 50%, 54% 0%, 56% 50%, 58% 0%, 60% 50%, 62% 0%, 64% 50%, 66% 0%, 68% 50%, 70% 0%, 72% 50%, 74% 0%, 76% 50%, 78% 0%, 80% 50%, 82% 0%, 84% 50%, 86% 0%, 88% 50%, 90% 0%, 92% 50%, 94% 0%, 96% 50%, 98% 0%, 100% 50%, 100% 100%)",
          }}
        />
      </div>
    ),
    { ...size, fonts },
  );
}
