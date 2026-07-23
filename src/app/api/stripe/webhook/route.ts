import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Needs the raw request body to verify the Stripe signature, so this must
// stay on the Node runtime (not edge) and must never run request.json()
// before constructEventAsync sees the untouched text.
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(
      body,
      signature,
      getStripeWebhookSecret()
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const purchaseId = session.metadata?.purchase_id;

    if (purchaseId) {
      const admin = createAdminClient();
      const { data: updatedPurchase } = await admin
        .from("lead_purchases")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          stripe_payment_intent_id:
            typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
        })
        .eq("id", purchaseId)
        .eq("stripe_checkout_session_id", session.id)
        .select("id, job_id, tradie_id, amount_cents")
        .single();

      // Receipt email is a nice-to-have, not part of the payment flow — the
      // purchase is already marked paid above, so any failure here (a
      // lookup miss, a Resend error) must never affect the webhook's
      // response to Stripe.
      if (updatedPurchase) {
        try {
          const [{ data: job }, { data: tradieProfile }] = await Promise.all([
            admin
              .from("jobs")
              .select("title, category, region, town")
              .eq("id", updatedPurchase.job_id)
              .single(),
            admin
              .from("profiles")
              .select("full_name, email")
              .eq("id", updatedPurchase.tradie_id)
              .single(),
          ]);

          if (job && tradieProfile) {
            const receiptNumber = `TM-${updatedPurchase.id.slice(0, 8).toUpperCase()}`;

            const res = await fetch(`${request.nextUrl.origin}/api/emails/send-lead-receipt`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: tradieProfile.email,
                tradieName: tradieProfile.full_name,
                receiptNumber,
                jobTitle: job.title,
                category: job.category,
                location: `${job.town}, ${job.region}`,
                price: updatedPurchase.amount_cents / 100,
              }),
            });

            if (!res.ok) {
              const body = await res.json().catch(() => ({}));
              console.error("Failed to send lead receipt email:", body.error ?? res.statusText);
            }
          }
        } catch (err) {
          console.error("Failed to send lead receipt email:", err);
        }
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const purchaseId = session.metadata?.purchase_id;

    if (purchaseId) {
      const admin = createAdminClient();
      await admin
        .from("lead_purchases")
        .update({ status: "failed" })
        .eq("id", purchaseId)
        .eq("stripe_checkout_session_id", session.id)
        .eq("status", "pending");
    }
  }

  return NextResponse.json({ received: true });
}
