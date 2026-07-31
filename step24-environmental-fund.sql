-- Environmental fund: $1 from every paid lead purchase goes toward native
-- tree planting (see src/app/api/stripe/webhook/route.ts), shown as a live
-- tree counter at /environmental-impact. Mirrors the apprenticeship
-- toolkit fund's increment_toolkit_fund (step21-toolkit-fund.sql) — same
-- atomic-increment-via-RPC pattern, since a read-then-write from
-- application code would race under concurrent Stripe events and drop
-- increments. Unlike the toolkit fund, this one never resets to 0 for a
-- batch donation — it's a running tally, not a target-then-donate cycle.
-- Run in the Supabase SQL editor.

alter table public.site_stats
  add column environmental_fund_amount numeric not null default 0;

create or replace function public.increment_environmental_fund(amount numeric)
returns void
language sql
security definer set search_path = public
as $$
  update public.site_stats
  set environmental_fund_amount = environmental_fund_amount + amount
  where id = 1;
$$;
