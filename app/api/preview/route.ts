import { NextResponse } from "next/server";
import { previewRank } from "@/lib/listings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const amount = Math.max(0, Math.round(Number(url.searchParams.get("amount") || 0)));
  try {
    const rank = await previewRank(amount);
    return NextResponse.json({ rank });
  } catch {
    return NextResponse.json({ rank: 1 });
  }
}
