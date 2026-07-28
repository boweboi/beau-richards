-- Toolkit fund: a running total that climbs $2 per paid lead purchase
-- (see src/app/api/stripe/webhook/route.ts) toward a $2,000 target for
-- buying a tradie's toolkit. Reaching the target and uploading a donation
-- photo from /admin/site-stats resets the fund to 0 and appends a record
-- to toolkit_donations, so past toolkits stay visible on the homepage.
-- Run in the Supabase SQL editor.
alter table public.site_stats
  add column toolkit_fund_amount numeric not null default 0,
  add column toolkit_donations jsonb not null default '[]'::jsonb;

-- Atomic increment for the webhook — a read-then-write from application
-- code would race under concurrent Stripe events and drop increments.
create or replace function public.increment_toolkit_fund(amount numeric)
returns void
language sql
security definer set search_path = public
as $$
  update public.site_stats
  set toolkit_fund_amount = toolkit_fund_amount + amount
  where id = 1;
$$;
