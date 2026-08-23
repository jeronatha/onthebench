import { NextResponse } from "next/server";
import { lookupByLink } from "@/lib/listings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const link = url.searchParams.get("link") ?? "";
  try {
    const found = await lookupByLink(link);
    if (!found) return NextResponse.json({ exists: false });
    return NextResponse.json(found);
  } catch {
    return NextResponse.json({ exists: false });
  }
}
