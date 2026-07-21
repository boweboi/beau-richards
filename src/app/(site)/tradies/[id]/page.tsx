import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAnyRegulatedTrade, qualificationBoardSuffix } from "@/lib/tradeCategories";
import { groupAreasByRegion } from "@/lib/serviceAreas";
import { getVerificationTier, type TradieVerification } from "@/lib/verificationTier";
import VerificationBadge from "@/components/VerificationBadge";

// Only ever select the columns a visitor is allowed to see — this table
// also holds `email` and raw `phone`, which stay admin-only.
const PUBLIC_PROFILE_COLUMNS =
  "id, full_name, role, trade_type, service_region, nzbn, lbp_number, has_level4_qualification, email_verified, phone_verified, nzbn_verified, qualifications_checked, review_count";

export default async function TradieProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select(PUBLIC_PROFILE_COLUMNS)
    .eq("id", id)
    .eq("role", "tradie")
    .single();

  if (!profile) {
    notFound();
  }

  const { data: categoryRows } = await supabase
    .from("tradie_trade_categories")
    .select("category")
    .eq("tradie_id", id);

  const displayCategories =
    categoryRows && categoryRows.length > 0
      ? categoryRows.map((row) => row.category)
      : profile.trade_type
        ? [profile.trade_type]
        : ["Tradie"];

  const regulated = isAnyRegulatedTrade(displayCategories);

  const { data: areaRows } = await supabase
    .from("tradie_service_areas")
    .select("region, town")
    .eq("tradie_id", id);

  const groupedAreas = groupAreasByRegion(areaRows ?? []);

  const verification: TradieVerification = {
    regulated,
    emailVerified: profile.email_verified,
    phoneVerified: profile.phone_verified,
    nzbnVerified: profile.nzbn_verified,
    qualificationsChecked: profile.qualifications_checked,
    hasLevel4Qualification: profile.has_level4_qualification,
    lbpNumber: profile.lbp_number,
    reviewCount: profile.review_count,
  };

  const tier = getVerificationTier(verification);
  const qualified =
    (profile.has_level4_qualification || Boolean(profile.lbp_number)) &&
    profile.qualifications_checked;

  const checklist = [
    { label: "Email verified", met: profile.email_verified },
    { label: "Phone verified", met: profile.phone_verified },
    ...(regulated
      ? [
          {
            label: `Relevant qualifications and/or LBP${qualificationBoardSuffix(displayCategories)} confirmed`,
            met: qualified,
          },
        ]
      : []),
    { label: "NZBN verified", met: profile.nzbn_verified },
    {
      label: `${profile.review_count} customer review${profile.review_count === 1 ? "" : "s"}`,
      met: profile.review_count >= 3,
    },
  ];

  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
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

          <dl className="mt-6 space-y-3 border-t border-line pt-6">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <span
                  aria-hidden="true"
                  className={item.met ? "text-iron-600" : "text-ink-500"}
                >
                  {item.met ? "✓" : "—"}
                </span>
                <span className={item.met ? "text-navy-950" : "text-ink-500"}>
                  {item.label}
                </span>
              </div>
            ))}
            {profile.nzbn && (
              <div className="text-xs text-ink-500">NZBN {profile.nzbn}</div>
            )}
            {profile.lbp_number && (
              <div className="text-xs text-ink-500">LBP {profile.lbp_number}</div>
            )}
          </dl>

          <Link
            href="/trust"
            className="mt-6 inline-block text-sm font-medium text-navy-950 hover:underline"
          >
            How verification works →
          </Link>
        </div>
      </div>
    </main>
  );
}
