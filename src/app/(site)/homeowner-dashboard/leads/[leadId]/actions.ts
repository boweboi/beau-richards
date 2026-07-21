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

  // TEMPORARY: verbose logging + error surfacing to diagnose a live 503 on
  // this action. Remove once root-caused.
  let errorMessage: string | null = null;

  try {
    console.log("[markAsHired] start", { leadId, userId: user.id });

    const lead = await getOwnedPaidLead(leadId, user.id);
    console.log("[markAsHired] getOwnedPaidLead result", lead);

    if (!lead) {
      errorMessage = "Lead not found, not paid, or not owned by you.";
    } else {
      // Own-session client, not the admin client — the
      // lead_purchases_update_homeowner_hire RLS policy (step9 migration)
      // is what authorizes this.
      const { error: hireError, data: hireData } = await supabase
        .from("lead_purchases")
        .update({ engagement_status: "hired" })
        .eq("id", leadId)
        .select();

      console.log("[markAsHired] hire update result", { hireError, hireData });

      if (hireError) {
        errorMessage = `Hire update failed: ${hireError.message}`;
      } else {
        // If a second tradie also purchased this lead and hasn't been
        // engaged past the tradie's own pipeline yet, auto-decline them —
        // the job's filled.
        const { error: declineError, data: declineData } = await supabase
          .from("lead_purchases")
          .update({ engagement_status: "not_progressing" })
          .eq("job_id", lead.job_id)
          .eq("status", "paid")
          .neq("tradie_id", lead.tradie_id)
          .in("engagement_status", ["pending_response", "quoted"])
          .select();

        console.log("[markAsHired] decline-sibling result", { declineError, declineData });
      }
    }
  } catch (err) {
    console.error("[markAsHired] unexpected error", err);
    errorMessage = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  }

  if (errorMessage) {
    redirect(`/homeowner-dashboard/leads/${leadId}?hireError=${encodeURIComponent(errorMessage)}`);
  }

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

  const RATING_FIELDS = [
    "communication_rating",
    "quality_rating",
    "timeliness_rating",
    "value_rating",
    "professionalism_rating",
  ] as const;

  const ratings: Record<(typeof RATING_FIELDS)[number], number> = {
    communication_rating: 0,
    quality_rating: 0,
    timeliness_rating: 0,
    value_rating: 0,
    professionalism_rating: 0,
  };

  for (const field of RATING_FIELDS) {
    const value = Number(formData.get(field));
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return { error: "Please choose a star rating (1 to 5) for every category." };
    }
    ratings[field] = value;
  }

  // Own-session client — the reviews_insert_homeowner_hired RLS policy
  // (step9 migration) re-checks all of this same ownership/hired/paid
  // logic at the database level.
  const { error } = await supabase.from("reviews").insert({
    lead_purchase_id: leadId,
    job_id: lead.job_id,
    tradie_id: lead.tradie_id,
    homeowner_id: user.id,
    ...ratings,
  });

  if (error) {
    return { error: "Something went wrong submitting your review. Please try again." };
  }

  revalidatePath(`/homeowner-dashboard/leads/${leadId}`);
  return { error: null };
}
