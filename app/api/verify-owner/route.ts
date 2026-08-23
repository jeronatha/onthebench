import { NextResponse } from "next/server";
import { verifyListingOwner } from "@/lib/listings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { link?: string; contactEmail?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const link = body.link?.trim() ?? "";
  const contactEmail = body.contactEmail?.trim() ?? "";
  if (!link || !contactEmail) {
    return NextResponse.json({ error: "Link and email are required" }, { status: 400 });
  }

  try {
    const result = await verifyListingOwner(link, contactEmail);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ ok: false, reason: "error" });
  }
}
