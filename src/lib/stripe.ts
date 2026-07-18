import Stripe from "stripe";

// Server-only Stripe client. Never import this from a Client Component —
// STRIPE_SECRET_KEY is not prefixed with NEXT_PUBLIC_ so Next.js won't
// bundle it into client code, but importing this file from a "use client"
// component would still be a mistake to avoid.
let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeClient) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }

  stripeClient = new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" });
  return stripeClient;
}

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set.");
  }
  return secret;
}
