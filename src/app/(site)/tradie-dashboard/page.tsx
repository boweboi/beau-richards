import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTradieMatchCriteria } from "@/lib/tradieJobMatch";
import { getVerificationTier } from "@/lib/verificationTier";
import WatchlistSection, { type WatchlistRow } from "./WatchlistSection";
import PurchasedLeadsList, { type PurchaseRow } from "./PurchasedLeadsList";
import BusinessDetailsSection from "./BusinessDetailsSection";
import PortfolioSection, { type PortfolioPhotoRow } from "./PortfolioSection";
import QualificationDocumentsSection, {
  type QualificationDocumentRow,
} from "./QualificationDocumentsSection";
import ResourceLinksSection from "./ResourceLinksSection";
import CompleteProfileSection from "./CompleteProfileSection";
import ReviewsSection, { type ReviewRow } from "./ReviewsSection";
import VerificationTierSection from "./VerificationTierSection";
import { isAnyRegulatedTrade } from "@/lib/tradeCategories";

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
    .select(
      "role, email, business_name, nzbn, phone, email_verified, phone_verified, nzbn_verified, qualifications_checked, has_level4_qualification, lbp_number"
    )
    .eq("id", user.id)
    .single();

  if (profile?.role !== "tradie") {
    redirect("/account");
  }

  const [
    criteria,
    { data: watchlistRows },
    { data: purchaseRows },
    { data: photoRows },
    { data: documentRows },
    { data: reviewRows },
  ] = await Promise.all([
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
    supabase
      .from("tradie_qualification_documents")
      .select("id, storage_path, file_name, created_at")
      .eq("tradie_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("reviews")
      .select(
        "id, job_id, homeowner_id, created_at, communication_rating, quality_rating, timeliness_rating, value_rating, professionalism_rating, jobs(title)"
      )
      .eq("tradie_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const { categories, areas, hasSetup } = criteria;
  const watchlist = (watchlistRows ?? []) as unknown as WatchlistRow[];
  const purchases = (purchaseRows ?? []) as unknown as PurchaseRow[];
  const photos = (photoRows ?? []) as PortfolioPhotoRow[];
  const documents = (documentRows ?? []) as QualificationDocumentRow[];

  // reviews.homeowner_id and reviews.tradie_id both FK to profiles, which
  // makes a nested `profiles(...)` select on homeowner_id ambiguous (same
  // issue as the admin tradie detail API) — fetch homeowner names
  // separately instead.
  const homeownerIds = Array.from(
    new Set((reviewRows ?? []).map((row) => row.homeowner_id))
  );
  const { data: homeownerRows } =
    homeownerIds.length > 0
      ? await supabase.from("profiles").select("id, full_name").in("id", homeownerIds)
      : { data: [] as { id: string; full_name: string }[] };

  const homeownerNameById = new Map(
    (homeownerRows ?? []).map((row) => [row.id, row.full_name])
  );

  const reviews: ReviewRow[] = (reviewRows ?? []).map((row) => ({
    id: row.id,
    created_at: row.created_at,
    homeowner_name: homeownerNameById.get(row.homeowner_id) ?? "Homeowner",
    job_title: (row.jobs as unknown as { title: string } | null)?.title ?? null,
    communication_rating: row.communication_rating,
    quality_rating: row.quality_rating,
    timeliness_rating: row.timeliness_rating,
    value_rating: row.value_rating,
    professionalism_rating: row.professionalism_rating,
    overall_rating:
      (row.communication_rating +
        row.quality_rating +
        row.timeliness_rating +
        row.value_rating +
        row.professionalism_rating) /
      5,
  }));

  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? reviews.reduce((sum, review) => sum + review.overall_rating, 0) / reviewCount
      : null;

  const tier = getVerificationTier({
    regulated: isAnyRegulatedTrade(categories),
    emailVerified: profile.email_verified,
    phoneVerified: profile.phone_verified,
    nzbnVerified: profile.nzbn_verified,
    qualificationsChecked: profile.qualifications_checked,
    hasLevel4Qualification: profile.has_level4_qualification,
    lbpNumber: profile.lbp_number,
    reviewCount,
    averageRating,
  });

  return (
    <main className="min-h-screen bg-paper-0 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Tradie dashboard
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Your dashboard
        </h1>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/account/edit" className="text-sm font-medium text-navy-950 hover:underline">
            Edit profile →
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-navy-950 hover:underline">
            Pricing →
          </Link>
        </p>

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
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/jobs?tab=matching"
                  className="flex-1 rounded-md border border-line bg-white px-4 py-2 text-center text-sm font-semibold text-navy-950 transition hover:bg-navy-950/5"
                >
                  Browse matching jobs →
                </Link>
                <Link
                  href="/jobs?tab=all"
                  className="flex-1 rounded-md bg-hivis-500 px-4 py-2 text-center text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
                >
                  All jobs →
                </Link>
              </div>
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
          <BusinessDetailsSection
            email={profile.email}
            defaultBusinessName={profile.business_name ?? ""}
            defaultNzbn={profile.nzbn ?? ""}
            defaultPhone={profile.phone ?? ""}
          />
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <PortfolioSection photos={photos} />
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <QualificationDocumentsSection documents={documents} />
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <VerificationTierSection
            tier={tier}
            nzbnVerified={profile.nzbn_verified}
            reviewCount={reviewCount}
            averageRating={averageRating}
          />
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <ReviewsSection reviews={reviews} />
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <ResourceLinksSection />
        </section>
      </div>
    </main>
  );
}
