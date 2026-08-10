"use server";

import { verifySignedJobToken } from "@/lib/session-crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { closeJobRecord } from "@/lib/jobClosing";

export type ConfirmJobFollowUpState = { success: boolean; error: string | null };

export async function confirmJobFollowUp(
  token: string,
  _prevState: ConfirmJobFollowUpState,
  _formData: FormData
): Promise<ConfirmJobFollowUpState> {
  // Re-verify on submit, not just on page load — the token may have
  // expired in the time between the two, and the job's status may have
  // changed (e.g. already closed from another tab) since the page loaded.
  const jobId = await verifySignedJobToken(token);

  if (!jobId) {
    return {
      success: false,
      error: "This link has expired. Contact support@tradiematch.co.nz.",
    };
  }

  const admin = createAdminClient();
  const { data: job } = await admin.from("jobs").select("status").eq("id", jobId).single();

  if (!job || job.status !== "open") {
    return {
      success: false,
      error: "This job isn't open any more, so there's nothing to close.",
    };
  }

  const { error } = await closeJobRecord(admin, jobId);

  if (error) {
    return {
      success: false,
      error: "Something went wrong. Please try again or contact support@tradiematch.co.nz.",
    };
  }

  return { success: true, error: null };
}
