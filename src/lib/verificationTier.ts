export type VerificationTier = "none" | "bronze" | "silver" | "gold";

export type TradieVerification = {
  regulated: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  nzbnVerified: boolean;
  qualificationsChecked: boolean;
  hasLevel4Qualification: boolean;
  lbpNumber: string | null;
  reviewCount: number;
  averageRating: number | null;
};

export function getVerificationTier(
  profile: TradieVerification
): VerificationTier {
  // Bronze is granted automatically the moment a tradie confirms their
  // email via the link sent at signup (see src/app/auth/confirm/route.ts)
  // — phone/NZBN/qualifications no longer gate Bronze, they only affect
  // Silver/Gold below.
  const meetsBronze = profile.emailVerified;

  if (!meetsBronze) return "none";

  // Review count alone isn't enough — a tradie with plenty of reviews but
  // a poor average rating shouldn't be promoted on volume alone.
  const meetsSilver =
    profile.nzbnVerified &&
    profile.reviewCount >= 3 &&
    profile.averageRating !== null &&
    profile.averageRating >= 4.0;
  if (!meetsSilver) return "bronze";

  const meetsGold =
    profile.reviewCount >= 10 &&
    profile.averageRating !== null &&
    profile.averageRating >= 4.5;
  if (!meetsGold) return "silver";

  return "gold";
}
