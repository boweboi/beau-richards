import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  isLoginRateLimited,
  recordFailedLoginAttempt,
  clearLoginAttempts,
} from "@/lib/loginRateLimit";

const LOCKOUT_MESSAGE =
  "Too many failed login attempts. This account is temporarily locked — please try again in 15 minutes.";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Please fill in every field." }, { status: 400 });
  }

  // Checked before ever touching Supabase — a correct password submitted
  // while locked out must not slip through, or the limit would only ever
  // stop wrong guesses and do nothing against a slow, patient attacker.
  if (isLoginRateLimited(email)) {
    return NextResponse.json({ error: LOCKOUT_MESSAGE }, { status: 429 });
  }

  const supabase = await createClient();
  const {
    data: { user, session },
    error,
  } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !user) {
    recordFailedLoginAttempt(email);
    return NextResponse.json(
      { error: "That email or password isn't right. Try again." },
      { status: 401 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, deactivated")
    .eq("id", user.id)
    .single();

  if (profile?.deactivated) {
    await supabase.auth.signOut();
    recordFailedLoginAttempt(email);
    return NextResponse.json(
      { error: "This account has been deactivated. Contact support." },
      { status: 403 }
    );
  }

  clearLoginAttempts(email);

  const redirectTo =
    profile?.role === "tradie"
      ? "/tradie-dashboard"
      : profile?.role === "homeowner"
        ? "/homeowner-dashboard"
        : "/account";

  // access_token/refresh_token are included so a caller running in its own
  // request context (like the login server action) can establish the real
  // browser session via supabase.auth.setSession(...) — the cookies this
  // route's own createClient() sets only apply to this route's own
  // response, which a server-to-server fetch() never forwards to the
  // browser. When this endpoint is hit directly from a browser instead,
  // those cookies land normally and the tokens are simply unused.
  return NextResponse.json({
    role: profile?.role ?? null,
    redirectTo,
    access_token: session?.access_token,
    refresh_token: session?.refresh_token,
  });
}
