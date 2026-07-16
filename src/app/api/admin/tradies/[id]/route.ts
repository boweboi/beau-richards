import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

// Only these columns can be written through this endpoint — keeps the
// admin panel from being able to overwrite unrelated profile fields
// (role, email, full_name, etc.) via a crafted request body.
const EDITABLE_FIELDS = [
  "trade_type",
  "phone",
  "phone_verified",
  "email_verified",
  "nzbn",
  "nzbn_verified",
  "lbp_number",
  "has_level4_qualification",
  "qualifications_checked",
  "review_count",
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
