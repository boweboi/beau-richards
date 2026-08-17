import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// API endpoint for email verification, called from the auth/confirm page.
// Verifies the token and updates the email_verified flag for the user.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenHash, type } = body;

    if (!tokenHash || !type) {
      return NextResponse.json(
        { error: "Missing tokenHash or type" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash: tokenHash,
    });

    if (error || !data.user) {
      console.error("[verify-email] Verification failed:", error?.message);
      return NextResponse.json(
        { error: error?.message || "Verification failed" },
        { status: 400 }
      );
    }

    // Update the email_verified flag for this user
    const admin = createAdminClient();
    const { error: updateError } = await admin
      .from("profiles")
      .update({ email_verified: true })
      .eq("id", data.user.id);

    if (updateError) {
      console.error("[verify-email] Failed to update email_verified:", updateError.message);
      // Don't fail the verification if the update fails — the token was valid
      // and the user is authenticated
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[verify-email] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verification failed" },
      { status: 500 }
    );
  }
}
