import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { createSignedSessionValue, verifySignedSessionValue } from "@/lib/session-crypto";

// A random, signed token is used to mark a logged-in browser (see
// session-crypto.ts). No external auth service or database is used, so the
// admin panel still works out of the box with zero setup — but the cookie
// itself can no longer be guessed or copied from the source code.

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "changeme";
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySignedSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  const value = await createSignedSessionValue();
  cookieStore.set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
