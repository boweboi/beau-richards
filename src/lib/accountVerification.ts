import { createAdminClient } from "@/lib/supabase/admin";
import type { VerifyEmailProps } from "@/emails/VerifyEmail";

// Shared by signup() (both roles) and the homeowner "resend" action so the
// generateLink + send-verify-email call only lives in one place. Never
// throws — a failure here must never block signup or surface to the caller,
// same as the welcome email.
export async function sendAccountVerificationEmail({
  email,
  firstName,
  origin,
  next,
  context,
}: {
  email: string;
  firstName: string;
  origin: string;
  next: string;
  context: VerifyEmailProps["context"];
}): Promise<void> {
  try {
    const admin = createAdminClient();
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${origin}/auth/confirm?next=${next}` },
    });

    if (linkError || !linkData) {
      console.error("Failed to generate verification link:", linkError?.message);
      return;
    }

    const verifyUrl = `${origin}/auth/confirm?token_hash=${linkData.properties.hashed_token}&type=${linkData.properties.verification_type}&next=${next}`;

    const res = await fetch(`${origin}/api/emails/send-verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, firstName, verifyUrl, context }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error("Failed to send verification email:", body.error ?? res.statusText);
    }
  } catch (err) {
    console.error("Failed to send verification email:", err);
  }
}
