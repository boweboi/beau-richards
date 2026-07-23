import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/components";
import LeadPurchaseReceipt, {
  type LeadPurchaseReceiptProps,
} from "@/emails/LeadPurchaseReceipt";
import { sendEmail } from "@/lib/email";

// Kept outside the try/catch below: constructing JSX inside a try block
// doesn't actually let the try/catch catch rendering errors (React defers
// rendering), so the project's lint config flags it.
function buildElement(props: LeadPurchaseReceiptProps) {
  return <LeadPurchaseReceipt {...props} siteUrl={process.env.NEXT_PUBLIC_SITE_URL} />;
}

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      tradieName,
      receiptNumber,
      jobTitle,
      category,
      location,
      price,
      estimatedResponseTime,
    } = await request.json();

    if (!email || !tradieName || !receiptNumber || !jobTitle || !category || !location) {
      return NextResponse.json(
        {
          success: false,
          error:
            "email, tradieName, receiptNumber, jobTitle, category, and location are required.",
        },
        { status: 400 }
      );
    }

    const html = await render(
      buildElement({
        tradieName,
        receiptNumber,
        jobTitle,
        category,
        location,
        price,
        estimatedResponseTime,
      })
    );

    await sendEmail({
      to: email,
      subject: `Receipt ${receiptNumber}: you unlocked "${jobTitle}"`,
      html,
    });

    console.log(`[send-lead-receipt] Sent lead receipt ${receiptNumber} to ${email}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[send-lead-receipt] Failed to send lead receipt:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
