import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "./lib/auth-constants";
import { verifySignedSessionValue } from "./lib/session-crypto";

export async function middleware(request: NextRequest) {
  const isLoggedIn = await verifySignedSessionValue(
    request.cookies.get(SESSION_COOKIE)?.value
  );

  if (!isLoggedIn) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard", "/admin/media"],
};
