import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SESSION_COOKIE } from "./lib/auth-constants";
import { verifySignedSessionValue } from "./lib/session-crypto";

export async function proxy(request: NextRequest) {
  // Admin area: unchanged hand-rolled cookie check.
  if (
    request.nextUrl.pathname.startsWith("/admin/dashboard") ||
    request.nextUrl.pathname.startsWith("/admin/media") ||
    request.nextUrl.pathname.startsWith("/admin/tradies")
  ) {
    const isLoggedIn = await verifySignedSessionValue(
      request.cookies.get(SESSION_COOKIE)?.value
    );

    if (!isLoggedIn) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Everyone else: refresh the Supabase session (tradie/homeowner login)
  // so it doesn't silently expire as someone browses the site.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/admin/dashboard",
    "/admin/media",
    "/admin/tradies",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
