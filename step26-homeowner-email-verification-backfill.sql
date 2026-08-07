-- Homeowners now must verify their email (see
-- src/app/(site)/signup/actions.ts, homeowner-dashboard/page.tsx,
-- post-a-job/page.tsx) before posting a job. Existing homeowner accounts
-- were never asked to verify anything, so backfill them as already
-- verified — the new gate only applies to accounts created after this
-- migration runs. Run in the Supabase SQL editor.

update public.profiles
set email_verified = true
where role = 'homeowner'
  and email_verified = false;
