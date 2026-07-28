import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ToolkitDonation } from "@/lib/toolkitFund";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_stats")
    .select("toolkit_fund_amount, toolkit_donations")
    .eq("id", 1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Records a funded toolkit and resets the running total — this is the
// "we hit $2,000 and bought the toolkit" action, not a generic field
// edit, which is why it's a dedicated route rather than a PATCH.
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const body = (await request.json()) as { photo_url?: unknown; caption?: unknown };

  if (typeof body.photo_url !== "string" || !body.photo_url) {
    return NextResponse.json({ error: "photo_url is required." }, { status: 400 });
  }
  if (typeof body.caption !== "string" || !body.caption.trim()) {
    return NextResponse.json({ error: "caption is required." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: current, error: fetchError } = await supabase
    .from("site_stats")
    .select("toolkit_donations")
    .eq("id", 1)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const existingDonations: ToolkitDonation[] = Array.isArray(current?.toolkit_donations)
    ? current.toolkit_donations
    : [];

  const newDonation: ToolkitDonation = {
    photo_url: body.photo_url,
    caption: body.caption.trim(),
    funded_at: new Date().toISOString(),
  };

  const { error: updateError } = await supabase
    .from("site_stats")
    .update({
      toolkit_fund_amount: 0,
      toolkit_donations: [newDonation, ...existingDonations],
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
