import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAnyRegulatedTrade, qualificationBoardSuffix } from "@/lib/tradeCategories";
import { groupAreasByRegion } from "@/lib/serviceAreas";
import { getVerificationTier, type TradieVerification } from "@/lib/verificationTier";
import VerificationBadge from "@/components/VerificationBadge";
import ReviewForm from "./ReviewForm";
import { markAsHired } from "./actions";

const REVIEW_CATEGORIES = [
  { key: "communication_rating", label: "Communication" },
  { key: "quality_rating", label: "Quality of Work" },
  { key: "timeliness_rating", label: "Timeliness" },
  { key: "value_rating", label: "Value for Money" },
  { key: "professionalism_rating", label: "Professionalism" },
] as const;

type ReviewRatings = Record<(typeof REVIEW_CATEGORIES)[number]["key"], number>;

function reviewAverage(review: ReviewRatings) {
  const sum = REVIEW_CATEGORIES.reduce((total, category) => total + review[category.key], 0);
  return sum / REVIEW_CATEGORIES.length;
}

function ReviewStars({ review }: { review: ReviewRatings }) {
  return (
    <dl className="space-y-0.5">
      {REVIEW_CATEGORIES.map((category) => (
        <div key={category.key} className="flex items-center gap-2 text-xs">
          <dt className="w-32 shrink-0 text-ink-500">{category.label}</dt>
          <dd className="text-navy-950">
            {"★".repeat(review[category.key])}
            {"☆".repeat(5 - review[category.key])}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default async function LeadTradieProfilePage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;

  const session = await createClient();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: viewerProfile } = await session
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (viewerProfile?.role !== "homeowner") {
    redirect("/account");
  }

  const admin = createAdminClient();
  const { data: lead } = await admin
    .from("lead_purchases")
    .select("id, job_id, tradie_id, amount_cents, paid_at, engagement_status")
    .eq("id", leadId)
    .eq("status", "paid")
    .single();

  if (!lead) {
    notFound();
  }

  const { data: job } = await session
    .from("jobs")
    .select("id, title, region, town, homeowner_id")
    .eq("id", lead.job_id)
    .single();

  if (!job || job.homeowner_id !== user.id) {
    notFound();
  }

  const { data: profile } = await admin
    .from("profiles")
    .select(
      "full_name, phone, email, trade_type, service_region, nzbn, lbp_number, has_level4_qualification, email_verified, phone_verified, nzbn_verified, qualifications_checked"
    )
    .eq("id", lead.tradie_id)
    .single();

  if (!profile) {
    notFound();
  }

  const { data: categoryRows } = await admin
    .from("tradie_trade_categories")
    .select("category")
    .eq("tradie_id", lead.tradie_id);

  const displayCategories =
    categoryRows && categoryRows.length > 0
      ? categoryRows.map((row) => row.category)
      : profile.trade_type
        ? [profile.trade_type]
        : ["Tradie"];

  const regulated = isAnyRegulatedTrade(displayCategories);

  const { data: areaRows } = await admin
    .from("tradie_service_areas")
    .select("region, town")
    .eq("tradie_id", lead.tradie_id);

  const groupedAreas = groupAreasByRegion(areaRows ?? []);

  const { data: photoRows } = await admin
    .from("tradie_portfolio_photos")
    .select("id, storage_path, caption, photo_type")
    .eq("tradie_id", lead.tradie_id)
    .order("created_at", { ascending: false });

  const photos = (photoRows ?? []).map((photo) => ({
    ...photo,
    url: admin.storage.from("tradie-portfolios").getPublicUrl(photo.storage_path).data.publicUrl,
  }));

  const { data: reviewRows } = await admin
    .from("reviews")
    .select(
      "id, lead_purchase_id, communication_rating, quality_rating, timeliness_rating, value_rating, professionalism_rating, created_at, homeowner_id"
    )
    .eq("tradie_id", lead.tradie_id)
    .order("created_at", { ascending: false });

  const reviews = reviewRows ?? [];
  const homeownerIds = [...new Set(reviews.map((review) => review.homeowner_id))];

  let reviewerNames = new Map<string, string>();
  if (homeownerIds.length > 0) {
    const { data: reviewerProfiles } = await admin
      .from("profiles")
      .select("id, full_name")
      .in("id", homeownerIds);
    reviewerNames = new Map((reviewerProfiles ?? []).map((p) => [p.id, p.full_name]));
  }

  const myReview = reviews.find((review) => review.lead_purchase_id === leadId);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + reviewAverage(review), 0) / reviews.length
      : null;

  const verification: TradieVerification = {
    regulated,
    emailVerified: profile.email_verified,
    phoneVerified: profile.phone_verified,
    nzbnVerified: profile.nzbn_verified,
    qualificationsChecked: profile.qualifications_checked,
    hasLevel4Qualification: profile.has_level4_qualification,
    lbpNumber: profile.lbp_number,
    reviewCount: reviews.length,
    averageRating,
  };
  const tier = getVerificationTier(verification);

  const isHired = lead.engagement_status === "hired";

  return (
    <main className="min-h-screen bg-paper-0 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/homeowner-dashboard"
          className="text-sm font-medium text-ink-700 hover:text-navy-950"
        >
          ← Back to your dashboard
        </Link>

        <p className="mt-6 text-sm text-ink-500">
          For &quot;{job.title}&quot; — {job.town}, {job.region}
        </p>

        <div className="mt-3 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap gap-2">
            {displayCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center rounded-full bg-navy-900/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-navy-700"
              >
                {category}
              </span>
            ))}
          </div>
          <h1 className="mt-2 font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
            {profile.full_name}
          </h1>
          {groupedAreas.length > 0 ? (
            <p className="mt-1 text-sm text-ink-500">
              {groupedAreas
                .map(({ region, towns }) => `${region}: ${towns.join(", ")}`)
                .join(" · ")}
            </p>
          ) : (
            profile.service_region && (
              <p className="mt-1 text-sm text-ink-500">{profile.service_region}</p>
            )
          )}

          <div className="mt-4">
            {tier === "none" ? (
              <span className="text-sm text-ink-500">Not yet verified</span>
            ) : (
              <VerificationBadge tier={tier} />
            )}
          </div>

          <dl className="mt-6 space-y-1 border-t border-line pt-6 text-sm">
            <div>
              <dt className="inline font-semibold text-navy-950">Phone: </dt>
              <dd className="inline text-ink-700">{profile.phone || "Not provided"}</dd>
            </div>
            <div>
              <dt className="inline font-semibold text-navy-950">Email: </dt>
              <dd className="inline text-ink-700">{profile.email}</dd>
            </div>
            {regulated && profile.lbp_number && (
              <div>
                <dt className="inline font-semibold text-navy-950">LBP: </dt>
                <dd className="inline text-ink-700">{profile.lbp_number}</dd>
              </div>
            )}
            {regulated && (
              <div className="text-xs text-ink-500">
                Relevant qualifications and/or LBP
                {qualificationBoardSuffix(displayCategories)}:{" "}
                {profile.has_level4_qualification || profile.lbp_number
                  ? "Claimed"
                  : "Not on file"}
                {profile.qualifications_checked ? ", confirmed by our team" : ", not yet confirmed"}
              </div>
            )}
          </dl>

          {photos.length > 0 && (
            <div className="mt-6 border-t border-line pt-6">
              <h2 className="font-display text-base font-semibold text-navy-950">
                Portfolio
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-lg border border-line bg-white"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.caption || "Portfolio photo"}
                      className="aspect-square w-full object-cover"
                    />
                    {photo.caption && (
                      <p className="p-2 text-xs text-ink-700">{photo.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-line pt-6">
            <h2 className="font-display text-base font-semibold text-navy-950">
              Reviews ({reviews.length}
              {averageRating !== null ? `, ${averageRating.toFixed(1)} avg` : ""})
            </h2>
            {reviews.length === 0 ? (
              <p className="mt-2 text-sm text-ink-500">No reviews yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {reviews.map((review) => (
                  <li key={review.id} className="rounded-lg border border-line p-3">
                    <p className="text-xs font-semibold text-ink-500">
                      {reviewerNames.get(review.homeowner_id) ?? "Homeowner"}
                    </p>
                    <div className="mt-2">
                      <ReviewStars review={review} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 border-t border-line pt-6">
            {!isHired && (
              <form action={markAsHired.bind(null, leadId)}>
                <button
                  type="submit"
                  className="rounded-md bg-hivis-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
                >
                  Mark as hired
                </button>
              </form>
            )}

            {isHired && !myReview && (
              <>
                <p className="text-sm text-ink-700">
                  You&apos;ve hired this tradie for this job. Leave a review once
                  the work is done.
                </p>
                <ReviewForm leadId={leadId} />
              </>
            )}

            {isHired && myReview && (
              <div>
                <p className="text-sm font-semibold text-navy-950">
                  Your review
                </p>
                <div className="mt-2">
                  <ReviewStars review={myReview} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
