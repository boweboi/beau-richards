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

// A regulated trade's qualifications/LBP claim only counts once an admin
// has checked it — an unverified self-report shouldn't be enough to
// unlock Bronze, or the "verification" system wouldn't verify anything.
function meetsQualificationRequirement(profile: TradieVerification): boolean {
  const claimsQualification =
    profile.hasLevel4Qualification || Boolean(profile.lbpNumber);
  return claimsQualification && profile.qualificationsChecked;
}

export function getVerificationTier(
  profile: TradieVerification
): VerificationTier {
  const meetsBronze = profile.regulated
    ? profile.emailVerified &&
      profile.phoneVerified &&
      meetsQualificationRequirement(profile)
    : profile.emailVerified && profile.phoneVerified;

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
