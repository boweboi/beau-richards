"use server";

import { verifySignedEmailToken } from "@/lib/session-crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export type UnsubscribeState = { success: boolean; error: string | null };

export async function unsubscribe(
  token: string,
  _prevState: UnsubscribeState,
  formData: FormData
): Promise<UnsubscribeState> {
  if (!formData.get("confirm")) {
    return { success: false, error: "Please confirm you'd like to unsubscribe." };
  }

  // Re-verify on submit, not just on page load — the token may have
  // expired in the time between the two, and a stale email prop from the
  // client should never be trusted over the signed token anyway.
  const email = await verifySignedEmailToken(token);

  if (!email) {
    return {
      success: false,
      error: "This unsubscribe link has expired. Contact support@tradiematch.co.nz.",
    };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("email_unsubscribes")
    .upsert({ email, unsubscribed_at: new Date().toISOString() }, { onConflict: "email" });

  if (error) {
    return {
      success: false,
      error: "Something went wrong. Please try again or contact support@tradiematch.co.nz.",
    };
  }

  return { success: true, error: null };
}
