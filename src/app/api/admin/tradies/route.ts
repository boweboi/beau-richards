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

  const { data: areaRows } = await supabase
    .from("tradie_service_areas")
    .select("tradie_id, region, town");

  const areasByTradie = new Map<string, { region: string; town: string }[]>();
  for (const row of areaRows ?? []) {
    const existing = areasByTradie.get(row.tradie_id) ?? [];
    existing.push({ region: row.region, town: row.town });
    areasByTradie.set(row.tradie_id, existing);
  }

  const tradies = data.map((tradie) => ({
    ...tradie,
    service_areas: areasByTradie.get(tradie.id) ?? [],
  }));

  return NextResponse.json({ tradies });
}
