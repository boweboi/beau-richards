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
      await admin
        .from("lead_purchases")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          stripe_payment_intent_id:
            typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
        })
        .eq("id", purchaseId)
        .eq("stripe_checkout_session_id", session.id);
    }
  }

  return NextResponse.json({ received: true });
}
