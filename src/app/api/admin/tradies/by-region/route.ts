import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { TRADE_CATEGORIES } from "@/lib/tradeCategories";
import regionsData from "@/nz-regions.json";

const REGIONS = regionsData.regions.map((region) => region.name);

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Active tradies only — matches the "Active tradies" count shown
  // elsewhere in the admin panel (deactivated accounts excluded).
  const { data: activeRows, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "tradie")
    .eq("deactivated", false);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const activeTradieIds = new Set((activeRows ?? []).map((row) => row.id));

  const [{ data: categoryRows }, { data: areaRows }] = await Promise.all([
    supabase.from("tradie_trade_categories").select("tradie_id, category"),
    supabase.from("tradie_service_areas").select("tradie_id, region"),
  ]);

  const categoriesByTradie = new Map<string, Set<string>>();
  for (const row of categoryRows ?? []) {
    if (!activeTradieIds.has(row.tradie_id)) continue;
    const existing = categoriesByTradie.get(row.tradie_id) ?? new Set<string>();
    existing.add(row.category);
    categoriesByTradie.set(row.tradie_id, existing);
  }

  const regionsByTradie = new Map<string, Set<string>>();
  for (const row of areaRows ?? []) {
    if (!activeTradieIds.has(row.tradie_id)) continue;
    const existing = regionsByTradie.get(row.tradie_id) ?? new Set<string>();
    existing.add(row.region);
    regionsByTradie.set(row.tradie_id, existing);
  }

  // matrix[category][region] = count of distinct active tradies offering
  // that trade who also cover that region. A tradie covering N regions
  // contributes to N cells in their trade's row — see totalsByTrade below,
  // which counts each tradie once regardless of how many regions/cells
  // they appear in.
  const matrix: Record<string, Record<string, number>> = {};
  for (const category of TRADE_CATEGORIES) {
    matrix[category] = {};
    for (const region of REGIONS) {
      matrix[category][region] = 0;
    }
  }

  const totalsByTrade: Record<string, number> = Object.fromEntries(
    TRADE_CATEGORIES.map((category) => [category, 0])
  );
  const totalsByRegion: Record<string, number> = Object.fromEntries(
    REGIONS.map((region) => [region, 0])
  );

  for (const [tradieId, categories] of categoriesByTradie) {
    const regions = regionsByTradie.get(tradieId) ?? new Set<string>();

    for (const category of categories) {
      if (!(category in matrix)) continue; // stale/renamed category, skip
      totalsByTrade[category] += 1;
      for (const region of regions) {
        if (!(region in matrix[category])) continue;
        matrix[category][region] += 1;
      }
    }
  }

  for (const [tradieId, regions] of regionsByTradie) {
    // Only count a tradie against a region once, regardless of how many
    // trades they list, mirroring totalsByTrade's per-tradie counting.
    if (!categoriesByTradie.has(tradieId)) continue;
    for (const region of regions) {
      if (!(region in totalsByRegion)) continue;
      totalsByRegion[region] += 1;
    }
  }

  const trades = [...TRADE_CATEGORIES]
    .sort((a, b) => totalsByTrade[b] - totalsByTrade[a])
    .map((name) => ({ name, total: totalsByTrade[name], byRegion: matrix[name] }));

  const grandTotal = categoriesByTradie.size;

  return NextResponse.json({
    trades,
    regions: REGIONS,
    totalsByRegion,
    grandTotal,
  });
}
