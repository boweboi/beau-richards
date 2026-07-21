import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TIMEFRAMES } from "@/lib/timeframes";
import AvailableJobsList, { type Job, type SortOption } from "./AvailableJobsList";
import PurchasedLeadsList, { type PurchaseRow } from "./PurchasedLeadsList";
import PortfolioSection, { type PortfolioPhotoRow } from "./PortfolioSection";
import ResourceLinksSection from "./ResourceLinksSection";

function sortJobs(jobs: Job[], sort: SortOption, areaKeys: Set<string>): Job[] {
  const sorted = [...jobs];

  if (sort === "urgent") {
    sorted.sort((a, b) => {
      const rankA = TIMEFRAMES.indexOf(a.timeframe);
      const rankB = TIMEFRAMES.indexOf(b.timeframe);
      const normA = rankA === -1 ? TIMEFRAMES.length : rankA;
      const normB = rankB === -1 ? TIMEFRAMES.length : rankB;
      if (normA !== normB) return normA - normB;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  } else if (sort === "closest") {
    sorted.sort((a, b) => {
      const tierA = areaKeys.has(`${a.region}|${a.town}`) ? 0 : 1;
      const tierB = areaKeys.has(`${b.region}|${b.town}`) ? 0 : 1;
      if (tierA !== tierB) return tierA - tierB;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  } else {
    sorted.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  return sorted;
}

export default async function TradieDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort: sortParam } = await searchParams;
  const sort: SortOption =
    sortParam === "closest" || sortParam === "urgent" ? sortParam : "newest";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "tradie") {
    redirect("/account");
  }

  const [{ data: categoryRows }, { data: areaRows }, { data: purchaseRows }, { data: photoRows }] =
    await Promise.all([
      supabase
        .from("tradie_trade_categories")
        .select("category")
        .eq("tradie_id", user.id),
      supabase
        .from("tradie_service_areas")
        .select("region, town")
        .eq("tradie_id", user.id),
      supabase
        .from("lead_purchases")
        .select("id, job_id, amount_cents, engagement_status, paid_at, jobs(title, region, town)")
        .eq("tradie_id", user.id)
        .eq("status", "paid")
        .order("paid_at", { ascending: false }),
      supabase
        .from("tradie_portfolio_photos")
        .select("id, storage_path, caption, photo_type, created_at")
        .eq("tradie_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  const categories = (categoryRows ?? []).map((row) => row.category);
  const areas = (areaRows ?? []).map((row) => ({ region: row.region, town: row.town }));
  const regions = [...new Set(areas.map((area) => area.region))];
  const areaKeys = new Set(areas.map((area) => `${area.region}|${area.town}`));
  const hasSetup = categories.length > 0 && regions.length > 0;

  let jobs: Job[] = [];
  if (hasSetup) {
    const { data } = await supabase
      .from("jobs")
      .select("id, title, description, category, region, town, timeframe, created_at")
      .eq("status", "open")
      .in("category", categories)
      .in("region", regions)
      .order("created_at", { ascending: false })
      .limit(200);
    jobs = (data ?? []) as Job[];
  }

  const sortedJobs = sortJobs(jobs, sort, areaKeys);
  const purchases = (purchaseRows ?? []) as unknown as PurchaseRow[];
  const purchasedJobIds = new Set(purchases.map((purchase) => purchase.job_id));
  const photos = (photoRows ?? []) as PortfolioPhotoRow[];

  return (
    <main className="min-h-screen bg-paper-0 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Tradie dashboard
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Your dashboard
        </h1>

        <section className="mt-10">
          <AvailableJobsList
            jobs={sortedJobs}
            sort={sort}
            hasSetup={hasSetup}
            purchasedJobIds={purchasedJobIds}
          />
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <PurchasedLeadsList purchases={purchases} />
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <PortfolioSection photos={photos} />
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <ResourceLinksSection />
        </section>
      </div>
    </main>
  );
}
