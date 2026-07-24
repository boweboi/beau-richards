import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type TradieMatchCriteria = {
  categories: string[];
  areas: { region: string; town: string }[];
  regions: string[];
  hasSetup: boolean;
};

// Shared by /jobs and the tradie dashboard so a tradie's "which jobs can I
// see" filter (their selected trade categories + service areas) is defined
// once — tradies must never be shown jobs outside either.
export async function getTradieMatchCriteria(
  supabase: SupabaseServerClient,
  tradieId: string
): Promise<TradieMatchCriteria> {
  const [{ data: categoryRows }, { data: areaRows }] = await Promise.all([
    supabase.from("tradie_trade_categories").select("category").eq("tradie_id", tradieId),
    supabase.from("tradie_service_areas").select("region, town").eq("tradie_id", tradieId),
  ]);

  const categories = (categoryRows ?? []).map((row) => row.category);
  const areas = (areaRows ?? []).map((row) => ({ region: row.region, town: row.town }));
  const regions = [...new Set(areas.map((area) => area.region))];
  const hasSetup = categories.length > 0 && regions.length > 0;

  return { categories, areas, regions, hasSetup };
}
