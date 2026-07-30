import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

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
    .select("id, full_name, email, created_at, deactivated")
    .eq("id", id)
    .eq("role", "homeowner")
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: "Homeowner not found." }, { status: 404 });
  }

  const { data: jobRows } = await supabase
    .from("jobs")
    .select("id, title, category, region, town, status, created_at")
    .eq("homeowner_id", id)
    .order("created_at", { ascending: false });

  const { data: reviewRows } = await supabase
    .from("reviews")
    .select(
      "id, job_id, tradie_id, created_at, communication_rating, quality_rating, timeliness_rating, value_rating, professionalism_rating, jobs(title)"
    )
    .eq("homeowner_id", id)
    .order("created_at", { ascending: false });

  // reviews.tradie_id and reviews.homeowner_id both FK to profiles, which
  // makes a nested `profiles(...)` select on tradie_id ambiguous — fetch
  // tradie names separately instead.
  const tradieIds = Array.from(new Set((reviewRows ?? []).map((row) => row.tradie_id)));
  const { data: tradieRows } = tradieIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", tradieIds)
    : { data: [] as { id: string; full_name: string }[] };

  const tradieNameById = new Map((tradieRows ?? []).map((row) => [row.id, row.full_name]));

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
      tradie_name: tradieNameById.get(row.tradie_id) ?? "Tradie",
      job_title: (row.jobs as unknown as { title: string } | null)?.title ?? null,
      communication_rating: row.communication_rating,
      quality_rating: row.quality_rating,
      timeliness_rating: row.timeliness_rating,
      value_rating: row.value_rating,
      professionalism_rating: row.professionalism_rating,
      overall_rating: overall,
    };
  });

  return NextResponse.json({
    homeowner: {
      ...profile,
      jobs: jobRows ?? [],
      reviews,
    },
  });
}

// Only "deactivated" can be written through this endpoint — mirrors the
// tradie endpoint's allowlist pattern, keeps the admin panel from being
// able to overwrite unrelated profile fields via a crafted request body.
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;

  if (!("deactivated" in body)) {
    return NextResponse.json({ error: "No editable fields provided." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({ deactivated: body.deactivated })
    .eq("id", id)
    .eq("role", "homeowner");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
