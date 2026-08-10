import type { createAdminClient } from "@/lib/supabase/admin";

type AdminClient = ReturnType<typeof createAdminClient>;

// Shared by closeJobNotHired (session-authenticated, from the homeowner
// dashboard) and the job-followup-email confirm flow (token-authenticated,
// no login) — same mutation, two different ways of proving the caller is
// allowed to do it. Caller is responsible for the ownership/status checks
// before calling this.
export async function closeJobRecord(admin: AdminClient, jobId: string) {
  const { error } = await admin.from("jobs").update({ status: "closed" }).eq("id", jobId);

  if (error) {
    return { error };
  }

  // Paid tradies still mid-pipeline won't hear from this homeowner again —
  // flag them not_progressing so their own dashboard reflects that. Their
  // lead_purchases payment row (status, amount_cents, etc.) is untouched.
  await admin
    .from("lead_purchases")
    .update({ engagement_status: "not_progressing" })
    .eq("job_id", jobId)
    .eq("status", "paid")
    .in("engagement_status", ["pending_response", "quoted"]);

  return { error: null };
}
