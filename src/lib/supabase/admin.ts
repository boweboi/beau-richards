import { createClient } from "@supabase/supabase-js";

// Server-only client that bypasses Row Level Security using the Supabase
// service role key. Never import this from a Client Component, and never
// forward its results to the browser without an explicit column allowlist —
// it can read every row in every table.
//
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (Project Settings ->
// API -> service_role in the Supabase dashboard). Deliberately not prefixed
// with NEXT_PUBLIC_ so Next.js never bundles it into client code.
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client is missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
