import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: homeowners, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, created_at, deactivated")
    .eq("role", "homeowner")
    .order("full_name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

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
    homeowners,
    counts: { tradies: tradieCount ?? 0, homeowners: homeownerCount ?? 0 },
  });
}
