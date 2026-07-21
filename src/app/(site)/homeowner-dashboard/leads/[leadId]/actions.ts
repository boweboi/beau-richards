"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function getOwnedPaidLead(leadId: string, userId: string) {
  const admin = createAdminClient();
  const { data: lead } = await admin
    .from("lead_purchases")
    .select("id, job_id, tradie_id, status, engagement_status")
    .eq("id", leadId)
    .eq("status", "paid")
    .single();

  if (!lead) return null;

  const session = await createClient();
  const { data: job } = await session
    .from("jobs")
    .select("id, homeowner_id")
    .eq("id", lead.job_id)
    .single();

  if (!job || job.homeowner_id !== userId) return null;

  return lead;
}

export async function markAsHired(leadId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const lead = await getOwnedPaidLead(leadId, user.id);
  if (!lead) {
    return;
  }

  // Own-session client, not the admin client — the
  // lead_purchases_update_homeowner_hire RLS policy (step9 migration) is
  // what authorizes this.
  await supabase
    .from("lead_purchases")
    .update({ engagement_status: "hired" })
    .eq("id", leadId);

  // If a second tradie also purchased this lead and hasn't been engaged
  // past the tradie's own pipeline yet, auto-decline them — the job's
  // filled.
  await supabase
    .from("lead_purchases")
    .update({ engagement_status: "not_progressing" })
    .eq("job_id", lead.job_id)
    .eq("status", "paid")
    .neq("tradie_id", lead.tradie_id)
    .in("engagement_status", ["pending_response", "quoted"]);

  revalidatePath(`/homeowner-dashboard/leads/${leadId}`);
  revalidatePath("/homeowner-dashboard");
}

export type SubmitReviewState = { error: string | null };

export async function submitReview(
  leadId: string,
  _prevState: SubmitReviewState,
  formData: FormData
): Promise<SubmitReviewState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const lead = await getOwnedPaidLead(leadId, user.id);
  if (!lead) {
    return { error: "You don't have access to this lead." };
  }

  if (lead.engagement_status !== "hired") {
    return { error: "Mark this tradie as hired before leaving a review." };
  }

  const rating = Number(formData.get("rating"));
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Please choose a rating from 1 to 5." };
  }

  const comment = (formData.get("comment") as string | null)?.trim() || null;

  // Own-session client — the reviews_insert_homeowner_hired RLS policy
  // (step9 migration) re-checks all of this same ownership/hired/paid
  // logic at the database level.
  const { error } = await supabase.from("reviews").insert({
    lead_purchase_id: leadId,
    job_id: lead.job_id,
    tradie_id: lead.tradie_id,
    homeowner_id: user.id,
    rating,
    comment,
  });

  if (error) {
    return { error: "Something went wrong submitting your review. Please try again." };
  }

  revalidatePath(`/homeowner-dashboard/leads/${leadId}`);
  return { error: null };
}
