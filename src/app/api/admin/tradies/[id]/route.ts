import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_TRADIE_DETAIL_COLUMNS =
  "id, full_name, email, business_name, trade_type, service_region, phone, phone_verified, email_verified, nzbn, nzbn_verified, lbp_number, has_level4_qualification, qualifications_checked, created_at, deactivated";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = createAdminClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(ADMIN_TRADIE_DETAIL_COLUMNS)
    .eq("id", id)
    .eq("role", "tradie")
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: "Tradie not found." }, { status: 404 });
  }

  const { data: areaRows } = await supabase
    .from("tradie_service_areas")
    .select("region, town")
    .eq("tradie_id", id);

  // Qualification documents live in a private bucket (step17 migration) —
  // the admin client bypasses RLS and can sign a URL for any tradie's
  // object regardless of owner, unlike the tradie's own session client.
  const { data: documentRows } = await supabase
    .from("tradie_qualification_documents")
    .select("id, storage_path, file_name, created_at")
    .eq("tradie_id", id)
    .order("created_at", { ascending: false });

  const qualificationDocuments = await Promise.all(
    (documentRows ?? []).map(async (document) => {
      const { data: signedUrlData } = await supabase.storage
        .from("tradie-qualifications")
        .createSignedUrl(document.storage_path, 60 * 10);

      return {
        id: document.id,
        file_name: document.file_name,
        created_at: document.created_at,
        url: signedUrlData?.signedUrl ?? null,
      };
    })
  );

  // "Leads purchased" counts only paid purchases — pending/failed checkout
  // attempts aren't a lead the tradie actually unlocked.
  const { data: purchaseRows } = await supabase
    .from("lead_purchases")
    .select("id, job_id, amount_cents, engagement_status, paid_at, jobs(title, region, town)")
    .eq("tradie_id", id)
    .eq("status", "paid")
    .order("paid_at", { ascending: false });

  // review_count/average_rating are live-computed from actual reviews, not
  // stored columns — verification tiers must never drift out of sync with
  // real review data. Each review has five category ratings; the "overall"
  // score per review is their average, then averaged again across reviews.
  const { data: reviewRows } = await supabase
    .from("reviews")
    .select(
      "id, job_id, homeowner_id, created_at, communication_rating, quality_rating, timeliness_rating, value_rating, professionalism_rating, jobs(title)"
    )
    .eq("tradie_id", id)
    .order("created_at", { ascending: false });

  // reviews.homeowner_id and reviews.tradie_id both FK to profiles, which
  // makes a nested `profiles(...)` select on homeowner_id ambiguous — fetch
  // homeowner names separately instead.
  const homeownerIds = Array.from(
    new Set((reviewRows ?? []).map((row) => row.homeowner_id))
  );
  const { data: homeownerRows } = homeownerIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", homeownerIds)
    : { data: [] as { id: string; full_name: string }[] };

  const homeownerNameById = new Map(
    (homeownerRows ?? []).map((row) => [row.id, row.full_name])
  );

  const reviews = (reviewRows ?? []).map((row) => {
    const overall =
      (row.communication_rating +
        row.quality_rating +
        row.timeliness_rating +
        row.value_rating +
        row.professionalism_rating) /
      5;
    return {
      id: row.id,
      created_at: row.created_at,
      homeowner_name: homeownerNameById.get(row.homeowner_id) ?? "Homeowner",
      job_title: (row.jobs as unknown as { title: string } | null)?.title ?? null,
      communication_rating: row.communication_rating,
      quality_rating: row.quality_rating,
      timeliness_rating: row.timeliness_rating,
      value_rating: row.value_rating,
      professionalism_rating: row.professionalism_rating,
      overall_rating: overall,
    };
  });

  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? reviews.reduce((sum, review) => sum + review.overall_rating, 0) / reviewCount
      : null;

  return NextResponse.json({
    tradie: {
      ...profile,
      service_areas: areaRows ?? [],
      qualification_documents: qualificationDocuments,
      purchases: purchaseRows ?? [],
      reviews,
      review_count: reviewCount,
      average_rating: averageRating,
    },
  });
}

// Only these columns can be written through this endpoint — keeps the
// admin panel from being able to overwrite unrelated profile fields
// (role, email, full_name, etc.) via a crafted request body.
const EDITABLE_FIELDS = [
  "business_name",
  "trade_type",
  "phone",
  "phone_verified",
  "email_verified",
  "nzbn",
  "nzbn_verified",
  "lbp_number",
  "has_level4_qualification",
  "qualifications_checked",
  "deactivated",
] as const;

type EditableField = (typeof EDITABLE_FIELDS)[number];

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;

  const updates: Partial<Record<EditableField, unknown>> = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in body) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No editable fields provided." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .eq("role", "tradie");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
