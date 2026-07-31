// In-memory login rate limiter, keyed by email. Module-scoped, so it
// survives across requests within the same server process (same pattern as
// the maintenance-mode cache in proxy.ts) — but on serverless (Vercel),
// each function instance has its own memory, so this throttles a given
// instance, not the account globally: a burst spread across multiple
// cold-started instances won't share state. Good enough to blunt casual
// brute-forcing; not a substitute for a shared store (Redis/Upstash) if a
// hard per-account guarantee is ever required.

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

const failedAttemptsByEmail = new Map<string, number[]>();

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function pruneToWindow(timestamps: number[], now: number): number[] {
  return timestamps.filter((ts) => now - ts < WINDOW_MS);
}

// Call before attempting authentication. True means this email has already
// hit MAX_ATTEMPTS failures within the rolling window — the caller should
// reject the request outright, without ever checking the password (a
// correct password must not bypass an active lockout, or the limit would
// be pointless).
export function isLoginRateLimited(email: string): boolean {
  const key = normalizeEmail(email);
  const now = Date.now();
  const existing = failedAttemptsByEmail.get(key);
  if (!existing) return false;

  const recent = pruneToWindow(existing, now);
  if (recent.length === 0) {
    failedAttemptsByEmail.delete(key);
    return false;
  }
  failedAttemptsByEmail.set(key, recent);
  return recent.length >= MAX_ATTEMPTS;
}

// Call after a failed login attempt (wrong credentials, deactivated
// account, etc).
export function recordFailedLoginAttempt(email: string): void {
  const key = normalizeEmail(email);
  const now = Date.now();
  const recent = pruneToWindow(failedAttemptsByEmail.get(key) ?? [], now);
  recent.push(now);
  failedAttemptsByEmail.set(key, recent);
}

// Call after a successful login.
export function clearLoginAttempts(email: string): void {
  failedAttemptsByEmail.delete(normalizeEmail(email));
}
