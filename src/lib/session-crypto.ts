// Signs and verifies the admin session cookie value using HMAC-SHA256.
//
// Instead of a fixed cookie value (which anyone reading the source could
// copy into their own browser to fake a login), each session gets a random
// nonce plus a signature computed with a server-only secret. Forging a
// valid cookie requires knowing SESSION_SECRET, which never leaves the
// server and isn't shipped to the browser.
//
// Uses the Web Crypto API (`crypto.subtle`) rather than Node's `crypto`
// module so this works in both normal server code and the Edge runtime
// that middleware runs in.

const encoder = new TextEncoder();

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // Falls back to a fixed string so the app still runs with zero setup,
    // but this means sessions are forgeable until you set a real
    // SESSION_SECRET in .env.local. A random one is generated for you
    // there by default.
    return "insecure-default-session-secret-set-SESSION_SECRET-in-env-local";
  }
  return secret;
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

function randomHex(byteLength: number): string {
  const arr = new Uint8Array(byteLength);
  crypto.getRandomValues(arr);
  return toHex(arr.buffer);
}

async function sign(nonce: string): Promise<string> {
  const key = await getKey();
  const sigBuf = await crypto.subtle.sign("HMAC", key, encoder.encode(nonce));
  return toHex(sigBuf);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Creates a new random, signed session token to store in the cookie. */
export async function createSignedSessionValue(): Promise<string> {
  const nonce = randomHex(16);
  const signature = await sign(nonce);
  return `${nonce}.${signature}`;
}

/** Verifies a session token from a cookie. Returns false for anything missing, malformed, or forged. */
export async function verifySignedSessionValue(value: string | undefined | null): Promise<boolean> {
  if (!value) return false;
  const [nonce, signature] = value.split(".");
  if (!nonce || !signature) return false;
  const expected = await sign(nonce);
  return timingSafeEqual(expected, signature);
}

// Same HMAC machinery as above, generalised to sign an arbitrary JSON
// payload (e.g. an email address) with an expiry, for one-off links like
// email unsubscribe tokens rather than cookie-backed sessions.

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

interface EmailTokenPayload {
  email: string;
  exp: number; // unix seconds
}

/** Creates a signed, time-limited token embedding an email address (e.g. for an unsubscribe link). */
export async function createSignedEmailToken(
  email: string,
  expiresInSeconds: number
): Promise<string> {
  const payload: EmailTokenPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  const encodedPayload = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies a signed email token. Returns the embedded email address if the
 * signature checks out and it hasn't expired, otherwise null.
 */
export async function verifySignedEmailToken(
  token: string | undefined | null
): Promise<string | null> {
  if (!token) return null;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = await sign(encodedPayload);
  if (!timingSafeEqual(expected, signature)) return null;

  let payload: EmailTokenPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload)));
  } catch {
    return null;
  }

  if (typeof payload.email !== "string" || typeof payload.exp !== "number") return null;
  if (Math.floor(Date.now() / 1000) > payload.exp) return null;

  return payload.email;
}
