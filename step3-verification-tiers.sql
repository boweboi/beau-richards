-- Adds the fields needed to compute a tradie's Bronze/Silver/Gold
-- verification tier. See src/lib/verificationTier.ts for the tier rules
-- that read these columns. Tier itself is never stored — it's always
-- computed live from these flags.

alter table public.profiles
  add column phone text,
  add column phone_verified boolean not null default false,
  add column email_verified boolean not null default false,
  add column nzbn text,
  add column nzbn_verified boolean not null default false,
  add column lbp_number text,
  add column has_level4_qualification boolean not null default false,
  add column qualifications_checked boolean not null default false,
  add column review_count integer not null default 0;
