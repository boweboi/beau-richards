import VerificationBadge from "@/components/VerificationBadge";
import type { VerificationTier } from "@/lib/verificationTier";

const TIER_LABELS: Record<Exclude<VerificationTier, "none">, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
};

const TIER_DESCRIPTIONS: Record<VerificationTier, string> = {
  none: "Verify your email to unlock Bronze tier.",
  bronze: "Bronze: your email is verified.",
  silver: "Silver: NZBN verified, with 3+ customer reviews averaging 4.0★ or higher.",
  gold: "Gold: NZBN verified, with 10+ customer reviews averaging 4.5★ or higher.",
};

type Requirement = { label: string; met: boolean };

type NextTierInfo = {
  tier: Exclude<VerificationTier, "none">;
  requirements: Requirement[];
  progress: { current: number; target: number } | null;
};

function nextTierInfo(
  tier: VerificationTier,
  nzbnVerified: boolean,
  reviewCount: number,
  averageRating: number | null
): NextTierInfo | null {
  if (tier === "gold") return null;

  if (tier === "none") {
    return {
      tier: "bronze",
      requirements: [{ label: "Verify your email address", met: false }],
      progress: null,
    };
  }

  if (tier === "bronze") {
    return {
      tier: "silver",
      requirements: [
        { label: "NZBN verified", met: nzbnVerified },
        { label: "3 or more customer reviews", met: reviewCount >= 3 },
        {
          label: "4.0★+ average rating",
          met: averageRating !== null && averageRating >= 4.0,
        },
      ],
      progress: { current: Math.min(reviewCount, 3), target: 3 },
    };
  }

  // silver -> gold
  return {
    tier: "gold",
    requirements: [
      { label: "10 or more customer reviews", met: reviewCount >= 10 },
      {
        label: "4.5★+ average rating",
        met: averageRating !== null && averageRating >= 4.5,
      },
    ],
    progress: { current: Math.min(reviewCount, 10), target: 10 },
  };
}

export default function VerificationTierSection({
  tier,
  nzbnVerified,
  reviewCount,
  averageRating,
}: {
  tier: VerificationTier;
  nzbnVerified: boolean;
  reviewCount: number;
  averageRating: number | null;
}) {
  const next = nextTierInfo(tier, nzbnVerified, reviewCount, averageRating);

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-navy-950">
        Your verification tier
      </h2>

      <div className="mt-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        {tier === "none" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-50 px-3 py-1 text-xs font-semibold text-ink-500">
            Not yet verified
          </span>
        ) : (
          <VerificationBadge tier={tier} />
        )}

        <p className="mt-3 text-sm text-ink-700">{TIER_DESCRIPTIONS[tier]}</p>

        {tier === "none" && (
          <p className="mt-1 text-sm text-ink-500">
            Check your inbox for the verification link we sent when you signed up.
          </p>
        )}

        {next && (
          <div className="mt-5 border-t border-line pt-5">
            <p className="text-sm font-semibold text-navy-950">
              To reach {TIER_LABELS[next.tier]}:
            </p>

            {next.progress && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-ink-500">
                  <span>Reviews</span>
                  <span>
                    {next.progress.current} of {next.progress.target} completed
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-paper-100">
                  <div
                    className="h-full rounded-full bg-hivis-500"
                    style={{
                      width: `${Math.min(100, (next.progress.current / next.progress.target) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <ul className="mt-4 space-y-2 text-sm text-ink-700">
              {next.requirements.map((requirement) => (
                <li key={requirement.label} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={requirement.met ? "text-iron-600" : "text-ink-500"}
                  >
                    {requirement.met ? "✓" : "○"}
                  </span>
                  {requirement.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tier === "gold" && (
          <p className="mt-5 border-t border-line pt-5 text-sm text-ink-700">
            You&apos;ve reached our highest tier — fully verified.
          </p>
        )}
      </div>
    </div>
  );
}
