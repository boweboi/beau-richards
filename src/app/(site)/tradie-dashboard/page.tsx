import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTradieMatchCriteria } from "@/lib/tradieJobMatch";
import WatchlistSection, { type WatchlistRow } from "./WatchlistSection";
import PurchasedLeadsList, { type PurchaseRow } from "./PurchasedLeadsList";
import PortfolioSection, { type PortfolioPhotoRow } from "./PortfolioSection";
import ResourceLinksSection from "./ResourceLinksSection";
import CompleteProfileSection from "./CompleteProfileSection";

export default async function TradieDashboardPage() {
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

  const [criteria, { data: watchlistRows }, { data: purchaseRows }, { data: photoRows }] =
    await Promise.all([
      getTradieMatchCriteria(supabase, user.id),
      supabase
        .from("tradie_watchlist")
        .select("id, job_id, created_at, jobs(title, description, category, region, town, timeframe, created_at)")
        .eq("tradie_id", user.id)
        .order("created_at", { ascending: false }),
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

  const { categories, areas, hasSetup } = criteria;
  const watchlist = (watchlistRows ?? []) as unknown as WatchlistRow[];
  const purchases = (purchaseRows ?? []) as unknown as PurchaseRow[];
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
          {hasSetup ? (
            <div className="rounded-2xl border border-line bg-white p-6">
              <h2 className="font-display text-xl font-semibold text-navy-950">
                Browse jobs
              </h2>
              <p className="mt-2 text-sm text-ink-700">
                See jobs matching your trade categories and service areas, or browse every open
                job site-wide.
              </p>
              <Link
                href="/jobs"
                className="mt-4 inline-block rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
              >
                Browse matching jobs →
              </Link>
            </div>
          ) : (
            <CompleteProfileSection
              defaultCategories={categories}
              defaultAreas={areas.map((area) => `${area.region}|${area.town}`)}
            />
          )}
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <WatchlistSection watchlist={watchlist} />
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
