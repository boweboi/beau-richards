import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SESSION_COOKIE } from "./lib/auth-constants";
import { verifySignedSessionValue } from "./lib/session-crypto";

// Module-scoped, so it survives across requests within the same server
// process — proxy defaults to the Node.js runtime in this Next.js version,
// not a fresh isolate per request. Flipping maintenance mode can therefore
// take up to MAINTENANCE_CACHE_TTL_MS to fully propagate; that's fine.
const MAINTENANCE_CACHE_TTL_MS = 30_000;
let maintenanceModeCache: { value: boolean; fetchedAt: number } | null = null;

async function getMaintenanceMode(supabase: SupabaseClient): Promise<boolean> {
  const now = Date.now();
  if (maintenanceModeCache && now - maintenanceModeCache.fetchedAt < MAINTENANCE_CACHE_TTL_MS) {
    return maintenanceModeCache.value;
  }

  const { data } = await supabase
    .from("site_stats")
    .select("maintenance_mode")
    .eq("id", 1)
    .single();

  const value = Boolean(data?.maintenance_mode);
  maintenanceModeCache = { value, fetchedAt: now };
  return value;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin area: unchanged hand-rolled cookie check.
  if (
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/admin/media") ||
    pathname.startsWith("/admin/tradies") ||
    pathname.startsWith("/admin/homeowners")
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDeactivationPage = pathname === "/account-deactivated";
  if (user && !isDeactivationPage && !pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("deactivated")
      .eq("id", user.id)
      .single();

    if (profile?.deactivated) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json(
          {
            error:
              "This account has been deactivated. Contact support if you think this is a mistake.",
          },
          { status: 403 }
        );
      }

      return NextResponse.redirect(new URL("/account-deactivated", request.url));
    }
  }

  // Maintenance mode: gate every page for regular visitors. Never the
  // admin panel or its API routes though — otherwise nobody could ever
  // turn it back off — and never /api routes in general, so webhooks and
  // other server-to-server calls keep working while the site is "down".
  const bypassesMaintenance =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname === "/maintenance" ||
    pathname === "/account-deactivated";

  if (!bypassesMaintenance) {
    const maintenanceMode = await getMaintenanceMode(supabase);

    if (maintenanceMode) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/dashboard",
    "/admin/media",
    "/admin/tradies",
    "/admin/homeowners",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
