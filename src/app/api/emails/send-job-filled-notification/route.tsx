import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/components";
import JobFilledNotificationEmail, {
  type JobFilledNotificationEmailProps,
} from "@/emails/JobFilledNotificationEmail";
import { sendEmail } from "@/lib/email";

// Kept outside the try/catch below: constructing JSX inside a try block
// doesn't actually let the try/catch catch rendering errors (React defers
// rendering), so the project's lint config flags it.
function buildElement(props: JobFilledNotificationEmailProps) {
  return <JobFilledNotificationEmail {...props} siteUrl={process.env.NEXT_PUBLIC_SITE_URL} />;
}

export async function POST(request: NextRequest) {
  try {
    const { email, tradieName, jobTitle, category, location } = await request.json();

    if (!email || !tradieName || !jobTitle || !category || !location) {
      return NextResponse.json(
        {
          success: false,
          error: "email, tradieName, jobTitle, category, and location are required.",
        },
        { status: 400 }
      );
    }

    const html = await render(buildElement({ tradieName, jobTitle, category, location }));

    await sendEmail({
      to: email,
      subject: `Update on "${jobTitle}"`,
      html,
    });

    console.log(`[send-job-filled-notification] Sent job-filled notification to ${email}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(
      "[send-job-filled-notification] Failed to send job-filled notification:",
      message
    );
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
