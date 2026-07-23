import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/components";
import JobAlertEmail, { type JobAlertEmailProps } from "@/emails/JobAlertEmail";
import { sendEmail } from "@/lib/email";

// Kept outside the try/catch below: constructing JSX inside a try block
// doesn't actually let the try/catch catch rendering errors (React defers
// rendering), so the project's lint config flags it.
function buildElement(props: JobAlertEmailProps) {
  return <JobAlertEmail {...props} siteUrl={process.env.NEXT_PUBLIC_SITE_URL} />;
}

export async function POST(request: NextRequest) {
  try {
    const { email, tradieName, jobs, preferencesUrl } = await request.json();

    if (!email || !tradieName || !jobs || jobs.length === 0) {
      return NextResponse.json(
        { success: false, error: "email, tradieName, and a non-empty jobs array are required." },
        { status: 400 }
      );
    }

    const html = await render(buildElement({ tradieName, jobs, preferencesUrl }));

    const subject =
      jobs.length === 1
        ? `New job for you: ${jobs[0].title}`
        : `${jobs.length} new jobs matching your trade`;

    await sendEmail({ to: email, subject, html });

    console.log(`[send-job-alert] Sent job alert (${jobs.length} job(s)) to ${email}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[send-job-alert] Failed to send job alert:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
