import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_TRADIE_COLUMNS =
  "id, full_name, email, trade_type, service_region, phone, phone_verified, email_verified, nzbn, nzbn_verified, lbp_number, has_level4_qualification, qualifications_checked, created_at, deactivated";

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

  // "Leads purchased" counts only paid purchases — pending/failed checkout
  // attempts aren't a lead the tradie actually unlocked.
  const { data: purchaseRows } = await supabase
    .from("lead_purchases")
    .select("tradie_id")
    .eq("status", "paid");

  const purchaseCountByTradie = new Map<string, number>();
  for (const row of purchaseRows ?? []) {
    purchaseCountByTradie.set(row.tradie_id, (purchaseCountByTradie.get(row.tradie_id) ?? 0) + 1);
  }

  // Qualification documents live in a private bucket (step17 migration) —
  // the admin client bypasses RLS and can sign a URL for any tradie's
  // object regardless of owner, unlike the tradie's own session client.
  const { data: documentRows } = await supabase
    .from("tradie_qualification_documents")
    .select("id, tradie_id, storage_path, file_name, created_at");

  const documentsByTradie = new Map<
    string,
    { id: string; file_name: string; created_at: string; url: string | null }[]
  >();
  for (const row of documentRows ?? []) {
    const { data: signedUrlData } = await supabase.storage
      .from("tradie-qualifications")
      .createSignedUrl(row.storage_path, 60 * 10);

    const existing = documentsByTradie.get(row.tradie_id) ?? [];
    existing.push({
      id: row.id,
      file_name: row.file_name,
      created_at: row.created_at,
      url: signedUrlData?.signedUrl ?? null,
    });
    documentsByTradie.set(row.tradie_id, existing);
  }

  const tradies = data.map((tradie) => {
    const stats = reviewStatsByTradie.get(tradie.id);
    return {
      ...tradie,
      review_count: stats?.count ?? 0,
      average_rating: stats ? stats.ratingSum / stats.count : null,
      service_areas: areasByTradie.get(tradie.id) ?? [],
      leads_purchased_count: purchaseCountByTradie.get(tradie.id) ?? 0,
      qualification_documents: documentsByTradie.get(tradie.id) ?? [],
    };
  });

  const [{ count: tradieCount }, { count: homeownerCount }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "tradie")
      .eq("deactivated", false),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "homeowner")
      .eq("deactivated", false),
  ]);

  return NextResponse.json({
    tradies,
    counts: { tradies: tradieCount ?? 0, homeowners: homeownerCount ?? 0 },
  });
}
