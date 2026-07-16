import type { VerificationTier } from "@/lib/verificationTier";

const TIER_STYLES: Record<Exclude<VerificationTier, "none">, string> = {
  bronze: "border-bronze-600/30 bg-bronze-600/10 text-bronze-600",
  silver: "border-silver-600/30 bg-silver-600/10 text-silver-600",
  gold: "border-gold-600/30 bg-gold-600/10 text-gold-600",
};

const TIER_LABELS: Record<Exclude<VerificationTier, "none">, string> = {
  bronze: "Bronze verified",
  silver: "Silver verified",
  gold: "Gold verified",
};

export default function VerificationBadge({
  tier,
}: {
  tier: VerificationTier;
}) {
  if (tier === "none") return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${TIER_STYLES[tier]}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {TIER_LABELS[tier]}
    </span>
  );
}
