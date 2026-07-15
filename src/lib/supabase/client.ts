import { createBrowserClient } from "@supabase/ssr";

// Auth-aware Supabase client for use in Client Components.
// For Supabase Storage/image uploads, use ../supabaseClient.ts instead.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
