import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/components";
import WelcomeEmail, { type WelcomeEmailProps } from "@/emails/WelcomeEmail";
import { sendEmail } from "@/lib/email";

// Kept outside the try/catch below: constructing JSX inside a try block
// doesn't actually let the try/catch catch rendering errors (React defers
// rendering), so the project's lint config flags it.
function buildElement(props: WelcomeEmailProps) {
  return <WelcomeEmail {...props} siteUrl={process.env.NEXT_PUBLIC_SITE_URL} />;
}

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, role } = await request.json();

    if (!email || !firstName || (role !== "tradie" && role !== "homeowner")) {
      return NextResponse.json(
        {
          success: false,
          error: "email, firstName, and role ('tradie' | 'homeowner') are required.",
        },
        { status: 400 }
      );
    }

    const html = await render(buildElement({ firstName, role }));

    await sendEmail({
      to: email,
      subject: `Welcome to TradieMatch, ${firstName}`,
      html,
    });

    console.log(`[send-welcome] Sent welcome email to ${email}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[send-welcome] Failed to send welcome email:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
