import { NextRequest, NextResponse } from "next/server";
import { createSession, getAdminPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== getAdminPassword()) {
    return NextResponse.json(
      { error: "That password isn't right. Try again." },
      { status: 401 }
    );
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
