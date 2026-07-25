import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const EDITABLE_FIELDS = ["verified_tradies", "jobs_completed", "average_quote_hours"] as const;

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_stats")
    .select("verified_tradies, jobs_completed, average_quote_hours")
    .eq("id", 1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ stats: data });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;

  const updates: Partial<Record<(typeof EDITABLE_FIELDS)[number], number>> = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in body) {
      const value = Number(body[field]);
      if (!Number.isFinite(value) || value < 0) {
        return NextResponse.json({ error: `${field} must be a non-negative number.` }, { status: 400 });
      }
      updates[field] = value;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No editable fields provided." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_stats")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
