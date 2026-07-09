import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent, type SiteContent } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const updated = (await request.json()) as SiteContent;
  await saveContent(updated);
  return NextResponse.json({ ok: true });
}
