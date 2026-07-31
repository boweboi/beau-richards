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
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

      // mark_lead_purchase_paid (step23-lead-purchases-two-tradie-cap.sql)
      // is the real 2-tradies-per-lead guarantee — it locks the job row
      // and re-checks the paid count inside the same transaction, so two
      // near-simultaneous purchases of the same lead can't both slip past
      // a plain "count then update" race the way a direct .update() here
      // could.
      const { data: rpcRows, error: rpcError } = await admin.rpc("mark_lead_purchase_paid", {
        p_purchase_id: purchaseId,
        p_session_id: session.id,
        p_payment_intent_id: paymentIntentId,
      });
      const result = rpcRows?.[0];

      if (rpcError || !result) {
        console.error(
          `mark_lead_purchase_paid failed for purchase_id=${purchaseId}, session=${session.id}:`,
          rpcError?.message ?? "no result returned"
        );
        return NextResponse.json(
          { error: "Failed to record the paid purchase." },
          { status: 500 }
        );
      }

      if (result.outcome === "not_found") {
        console.error(
          `mark_lead_purchase_paid found no matching pending purchase for purchase_id=${purchaseId}, session=${session.id}`
        );
        return NextResponse.json(
          { error: "Failed to record the paid purchase." },
          { status: 500 }
        );
      }

      if (result.outcome === "already_refunded") {
        // Stripe redelivering an event we already fully handled (refund
        // included) — acknowledge without re-attempting the refund.
        console.log(
          `mark_lead_purchase_paid: purchase_id=${purchaseId} already refunded, acknowledging replay.`
        );
        return NextResponse.json({ received: true });
      }

      if (result.outcome === "cap_reached") {
        // This lead already had 2 paid tradies by the time this payment's
        // webhook landed — a genuine (rare) race between two near-
        // simultaneous purchases. The tradie was really charged for a
        // lead they can never access, so refund them rather than leave
        // them stuck paying for nothing.
        console.warn(
          `Lead purchase cap already reached for purchase_id=${purchaseId} — refunding payment_intent=${paymentIntentId}`
        );

        if (!paymentIntentId) {
          console.error(`No payment_intent to refund for purchase_id=${purchaseId} after cap_reached.`);
          return NextResponse.json({ error: "Missing payment intent to refund." }, { status: 500 });
        }

        try {
          await getStripe().refunds.create({ payment_intent: paymentIntentId });
        } catch (err) {
          console.error(`Failed to refund payment_intent=${paymentIntentId} after cap_reached:`, err);
          return NextResponse.json({ error: "Failed to refund an over-cap purchase." }, { status: 500 });
        }

        const { error: refundStatusError } = await admin
          .from("lead_purchases")
          .update({ status: "refunded", stripe_payment_intent_id: paymentIntentId })
          .eq("id", purchaseId)
          .eq("stripe_checkout_session_id", session.id)
          .eq("status", "pending");

        if (refundStatusError) {
          // The Stripe refund already succeeded — don't fail the webhook,
          // or Stripe will retry and attempt to refund an already-refunded
          // payment intent. Log loudly for manual follow-up instead.
          console.error(
            `Refunded payment_intent=${paymentIntentId} but failed to mark lead_purchases refunded for purchase_id=${purchaseId}:`,
            refundStatusError.message
          );
        }

        return NextResponse.json({ received: true });
      }

      // outcome === "paid"
      const updatedPurchase = result;
      console.log(
        `Marked lead_purchases paid: purchase_id=${updatedPurchase.id}, job_id=${updatedPurchase.job_id}, tradie_id=${updatedPurchase.tradie_id}`
      );

      // Toolkit fund increment — like the receipt email below, this is a
      // side effect of the purchase being marked paid above, not part of
      // the payment flow itself, so a failure here must never affect the
      // webhook's response to Stripe. Done via RPC (not a JS read/write)
      // because a read-then-write here would race under concurrent
      // Stripe events and silently drop increments.
      try {
        const { error: incrementError } = await admin.rpc("increment_toolkit_fund", {
          amount: 1,
        });
        if (incrementError) {
          console.error("Failed to increment toolkit fund:", incrementError.message);
        }
      } catch (err) {
        console.error("Failed to increment toolkit fund:", err);
      }

      // Environmental fund increment — same rationale and RPC pattern as
      // the toolkit fund above, kept as its own try/catch so a failure in
      // one fund's increment can never take out the other's.
      try {
        const { error: envIncrementError } = await admin.rpc("increment_environmental_fund", {
          amount: 1,
        });
        if (envIncrementError) {
          console.error("Failed to increment environmental fund:", envIncrementError.message);
        }
      } catch (err) {
        console.error("Failed to increment environmental fund:", err);
      }

      // Receipt email is a nice-to-have, not part of the payment flow — the
      // purchase is already marked paid above, so any failure here (a
      // lookup miss, a Resend error) must never affect the webhook's
      // response to Stripe.
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
