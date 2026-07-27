import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Landing point for the "Verify my email" link sent by
// /api/emails/send-verify-email. The token is verified here rather than
// relying on Supabase's own confirmation gate, so a tradie's session/login
// is never blocked by this — clicking the link only unlocks Bronze tier.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/tradie-dashboard";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error && data.user) {
      const admin = createAdminClient();
      await admin
        .from("profiles")
        .update({ email_verified: true })
        .eq("id", data.user.id)
        .eq("role", "tradie");

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/tradie-dashboard?verify=error`);
}
