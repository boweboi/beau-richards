import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_TRADIE_COLUMNS =
  "id, full_name, email, trade_type, service_region, phone, phone_verified, email_verified, nzbn, nzbn_verified, lbp_number, has_level4_qualification, qualifications_checked";

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

  // review_count/average_rating are live-computed from actual reviews, not
  // stored columns — verification tiers must never drift out of sync with
  // real review data. Each review has five category ratings; the "overall"
  // score per review is their average, then averaged again across reviews.
  const { data: reviewRows } = await supabase
    .from("reviews")
    .select(
      "tradie_id, communication_rating, quality_rating, timeliness_rating, value_rating, professionalism_rating"
    );

  const reviewStatsByTradie = new Map<string, { count: number; ratingSum: number }>();
  for (const row of reviewRows ?? []) {
    const existing = reviewStatsByTradie.get(row.tradie_id) ?? { count: 0, ratingSum: 0 };
    const overall =
      (row.communication_rating +
        row.quality_rating +
        row.timeliness_rating +
        row.value_rating +
        row.professionalism_rating) /
      5;
    existing.count += 1;
    existing.ratingSum += overall;
    reviewStatsByTradie.set(row.tradie_id, existing);
  }

  const tradies = data.map((tradie) => {
    const stats = reviewStatsByTradie.get(tradie.id);
    return {
      ...tradie,
      review_count: stats?.count ?? 0,
      average_rating: stats ? stats.ratingSum / stats.count : null,
      service_areas: areasByTradie.get(tradie.id) ?? [],
    };
  });

  return NextResponse.json({ tradies });
}
