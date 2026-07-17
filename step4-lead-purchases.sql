-- Pay-per-lead system, Phase 1: database only.
-- Run each numbered block separately in the Supabase SQL editor, in
-- order, top to bottom — don't paste the whole file at once. Blocks 3-4
-- are destructive (drop columns), so blocks 1-2 let you verify the data
-- moved correctly before you commit to that.

-- ============================================================
-- STEP 1 — create job_contacts, the locked-down contact-info table.
-- No RLS policies are added for it anywhere in this file — that's
-- deliberate. Once RLS is enabled with zero policies, only the
-- service-role client (src/lib/supabase/admin.ts) can read or write
-- this table, from either direction. The app code (Phase 1 also
-- updates post-a-job/actions.ts) already goes through that client for
-- this table.
-- ============================================================
create table public.job_contacts (
  job_id uuid primary key references public.jobs(id) on delete cascade,
  contact_name text not null,
  contact_email text not null,
  contact_phone text
);

-- ============================================================
-- STEP 2 — backfill job_contacts from the existing jobs rows.
-- ============================================================
insert into public.job_contacts (job_id, contact_name, contact_email, contact_phone)
select id, contact_name, contact_email, contact_phone from public.jobs;

-- Before moving on to Step 3, run this as a sanity check — the two
-- counts should match:
--   select count(*) from public.jobs;
--   select count(*) from public.job_contacts;

-- ============================================================
-- STEP 3 — drop the now-duplicated contact columns from jobs.
-- Destructive. Only run this after confirming Step 2's row counts match.
-- ============================================================
alter table public.jobs
  drop column contact_name,
  drop column contact_email,
  drop column contact_phone;

-- ============================================================
-- STEP 4 — lock job_contacts down with RLS (no policies = service-role
-- only, from any client).
-- ============================================================
alter table public.job_contacts enable row level security;

-- ============================================================
-- STEP 5 — create lead_purchases.
-- ============================================================
create table public.lead_purchases (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  tradie_id uuid not null references public.profiles(id) on delete cascade,
  amount_cents integer not null default 2000,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'refunded')),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

-- ============================================================
-- STEP 6 — a tradie can only ever hold one *paid* row per job. Guards
-- against double-charging on a retry or race, at the database level.
-- ============================================================
create unique index lead_purchases_paid_unique
  on public.lead_purchases (job_id, tradie_id)
  where status = 'paid';

-- ============================================================
-- STEP 7 — RLS on lead_purchases: tradies can see and create their own
-- rows, but there is deliberately no UPDATE policy for anyone but
-- service-role. Only the Stripe webhook (Phase 4, not built yet) will
-- ever be able to flip a row to 'paid' — otherwise any signed-in tradie
-- could mark their own row paid via the REST API without paying.
-- ============================================================
alter table public.lead_purchases enable row level security;

create policy "lead_purchases_select_own"
  on public.lead_purchases for select
  using (auth.uid() = tradie_id);

create policy "lead_purchases_insert_own"
  on public.lead_purchases for insert
  with check (auth.uid() = tradie_id);
