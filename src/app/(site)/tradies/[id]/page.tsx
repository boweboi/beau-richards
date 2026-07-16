import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRegulatedTrade } from "@/lib/tradeCategories";
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

  const regulated = isRegulatedTrade(profile.trade_type);

  const verification: TradieVerification = {
    tradeType: profile.trade_type,
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
      ? [{ label: "Level 4 qualification or LBP confirmed", met: qualified }]
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
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
            {profile.trade_type ?? "Tradie"}
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
            {profile.full_name}
          </h1>
          {profile.service_region && (
            <p className="mt-1 text-sm text-ink-500">{profile.service_region}</p>
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
