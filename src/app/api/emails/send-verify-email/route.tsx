import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/components";
import VerifyEmail, { type VerifyEmailProps } from "@/emails/VerifyEmail";
import { sendEmail } from "@/lib/email";

// Kept outside the try/catch below: constructing JSX inside a try block
// doesn't actually let the try/catch catch rendering errors (React defers
// rendering), so the project's lint config flags it.
function buildElement(props: VerifyEmailProps) {
  return <VerifyEmail {...props} siteUrl={process.env.NEXT_PUBLIC_SITE_URL} />;
}

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, verifyUrl } = await request.json();

    if (!email || !firstName || !verifyUrl) {
      return NextResponse.json(
        { success: false, error: "email, firstName, and verifyUrl are required." },
        { status: 400 }
      );
    }

    const html = await render(buildElement({ firstName, verifyUrl }));

    await sendEmail({
      to: email,
      subject: "Verify your email to unlock Bronze tier",
      html,
    });

    console.log(`[send-verify-email] Sent verification email to ${email}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[send-verify-email] Failed to send verification email:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
