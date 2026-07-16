import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_TRADIE_COLUMNS =
  "id, full_name, email, trade_type, service_region, phone, phone_verified, email_verified, nzbn, nzbn_verified, lbp_number, has_level4_qualification, qualifications_checked, review_count";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(ADMIN_TRADIE_COLUMNS)
    .eq("role", "tradie")
    .order("full_name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tradies: data });
}
