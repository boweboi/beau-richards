"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error: string | null };

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please fill in every field." };
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const origin = `${protocol}://${host}`;

  // The credential check — including rate limiting, the deactivated-account
  // check, and the role-based redirect target — now lives in
  // /api/auth/login, not here. This action's own job is just to turn that
  // endpoint's result into a real browser session: a server-to-server
  // fetch() can't itself set cookies on this request, so on success we
  // take the returned tokens and call setSession() using this action's own
  // Supabase client, then redirect (which only works from inside a Server
  // Action, not from the route handler).
  let result: {
    error?: string;
    redirectTo?: string;
    access_token?: string;
    refresh_token?: string;
  };
  try {
    const response = await fetch(`${origin}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    result = await response.json();

    if (!response.ok) {
      return { error: result.error ?? "Something went wrong. Please try again." };
    }
  } catch {
    return { error: "Something went wrong. Please try again." };
  }

  if (!result.access_token || !result.refresh_token) {
    return { error: "Something went wrong logging you in. Please try again." };
  }

  const supabase = await createClient();
  const { error: setSessionError } = await supabase.auth.setSession({
    access_token: result.access_token,
    refresh_token: result.refresh_token,
  });

  if (setSessionError) {
    return { error: "Something went wrong logging you in. Please try again." };
  }

  redirect(result.redirectTo ?? "/account");
}
