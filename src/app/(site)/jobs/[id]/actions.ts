"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { getLeadPriceCents } from "@/lib/leadPricing";

export type PurchaseLeadState = { error: string | null };

const MAX_TRADIES_PER_LEAD = 2;

export async function purchaseLead(
  jobId: string,
  _prevState: PurchaseLeadState,
  _formData: FormData
): Promise<PurchaseLeadState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "tradie") {
    return { error: "Only tradie accounts can purchase leads." };
  }

  const admin = createAdminClient();

  const { data: job } = await admin
    .from("jobs")
    .select("id, title, homeowner_id, status, timeframe")
    .eq("id", jobId)
    .single();

  if (!job) {
    return { error: "This job no longer exists." };
  }

  // Guards against a tradie paying for a job that's already been filled —
  // e.g. via an old job-alert email or a bookmarked link from before the
  // homeowner hired someone. Checked before any lead_purchases row is
  // created or Stripe is ever charged.
  if (job.status !== "open") {
    return { error: "This job has already been filled and is no longer accepting leads." };
  }

  // Server-derived from the job row just fetched from the database —
  // never from the client (this action only ever receives jobId; nothing
  // resembling a price crosses the wire from the browser) — so there's
  // nothing here a tradie could tamper with to pay less than the tier
  // actually costs.
  const priceCents = getLeadPriceCents(job.timeframe);

  if (job.homeowner_id === user.id) {
    return { error: "You can't purchase your own lead." };
  }

  const { data: ownPaidPurchase } = await admin
    .from("lead_purchases")
    .select("id")
    .eq("job_id", jobId)
    .eq("tradie_id", user.id)
    .eq("status", "paid")
    .maybeSingle();

  if (ownPaidPurchase) {
    return { error: "You've already purchased this lead." };
  }

  const { count: paidCount } = await admin
    .from("lead_purchases")
    .select("id", { count: "exact", head: true })
    .eq("job_id", jobId)
    .eq("status", "paid");

  if ((paidCount ?? 0) >= MAX_TRADIES_PER_LEAD) {
    return { error: "This lead has already been claimed by 2 tradies." };
  }

  // Own-session client, not the admin client — RLS's "insert_own" policy
  // is what allows this (a tradie may only ever insert a row for
  // themselves; nothing here can mark it 'paid' but the webhook).
  // amount_cents is set explicitly now that price varies by tier — the
  // column's DB default (2000) is only ever a fallback for rows inserted
  // outside this action, never the source of truth here.
  const { data: purchase, error: insertError } = await supabase
    .from("lead_purchases")
    .insert({ job_id: jobId, tradie_id: user.id, status: "pending", amount_cents: priceCents })
    .select("id")
    .single();

  if (insertError || !purchase) {
    return { error: "Something went wrong starting checkout. Please try again." };
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const origin = `${protocol}://${host}`;

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "nzd",
          product_data: { name: `Job lead: ${job.title}` },
          unit_amount: priceCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      purchase_id: purchase.id,
      job_id: jobId,
      tradie_id: user.id,
    },
    success_url: `${origin}/jobs/${jobId}?purchase=success`,
    cancel_url: `${origin}/jobs/${jobId}?purchase=cancelled`,
  });

  if (!session.url) {
    return { error: "Something went wrong starting checkout. Please try again." };
  }

  await admin
    .from("lead_purchases")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", purchase.id);

  redirect(session.url);
}
