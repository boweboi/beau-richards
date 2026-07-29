import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/components";
import HiredNotificationEmail, {
  type HiredNotificationEmailProps,
} from "@/emails/HiredNotificationEmail";
import { sendEmail } from "@/lib/email";

// Kept outside the try/catch below: constructing JSX inside a try block
// doesn't actually let the try/catch catch rendering errors (React defers
// rendering), so the project's lint config flags it.
function buildElement(props: HiredNotificationEmailProps) {
  return <HiredNotificationEmail {...props} siteUrl={process.env.NEXT_PUBLIC_SITE_URL} />;
}

export async function POST(request: NextRequest) {
  try {
    const { email, tradieName, jobTitle, category, location, description } =
      await request.json();

    if (!email || !tradieName || !jobTitle || !category || !location) {
      return NextResponse.json(
        {
          success: false,
          error: "email, tradieName, jobTitle, category, and location are required.",
        },
        { status: 400 }
      );
    }

    const html = await render(
      buildElement({ tradieName, jobTitle, category, location, description })
    );

    await sendEmail({
      to: email,
      subject: `You've been hired for "${jobTitle}"`,
      html,
    });

    console.log(`[send-hired-notification] Sent hired notification to ${email}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[send-hired-notification] Failed to send hired notification:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
