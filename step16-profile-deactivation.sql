-- Adds a soft-delete/deactivate flag for admin-managed accounts (both
-- roles). Deactivating blocks sign-in (see login/actions.ts) without
-- touching any of the account's data — jobs, reviews, lead_purchases,
-- etc. all stay exactly as they were. Run in the Supabase SQL editor.
alter table public.profiles
  add column deactivated boolean not null default false;
