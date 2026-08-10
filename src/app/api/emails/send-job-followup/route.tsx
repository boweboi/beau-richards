import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/components";
import JobFollowUpEmail, { type JobFollowUpEmailProps } from "@/emails/JobFollowUpEmail";
import { sendEmail } from "@/lib/email";

// Kept outside the try/catch below: constructing JSX inside a try block
// doesn't actually let the try/catch catch rendering errors (React defers
// rendering), so the project's lint config flags it.
function buildElement(props: JobFollowUpEmailProps) {
  return <JobFollowUpEmail {...props} siteUrl={process.env.NEXT_PUBLIC_SITE_URL} />;
}

export async function POST(request: NextRequest) {
  try {
    const { email, contactName, jobTitle, stillLookingUrl, allSortedUrl } = await request.json();

    if (!email || !contactName || !jobTitle || !stillLookingUrl || !allSortedUrl) {
      return NextResponse.json(
        {
          success: false,
          error:
            "email, contactName, jobTitle, stillLookingUrl, and allSortedUrl are required.",
        },
        { status: 400 }
      );
    }

    const html = await render(
      buildElement({ contactName, jobTitle, stillLookingUrl, allSortedUrl })
    );

    await sendEmail({
      to: email,
      subject: `Still looking for a tradie for "${jobTitle}"?`,
      html,
    });

    console.log(`[send-job-followup] Sent job follow-up email to ${email}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[send-job-followup] Failed to send job follow-up email:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
