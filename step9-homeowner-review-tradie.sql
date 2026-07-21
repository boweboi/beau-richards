-- Homeowner-side: see purchasing tradies, mark hired, leave a review.
-- Run in the Supabase SQL editor, top to bottom.

-- ============================================================
-- STEP 1 — reviews: one row per hired engagement, enforced via a unique
-- FK to lead_purchase_id (a homeowner can't review the same hired lead
-- twice).
-- ============================================================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  lead_purchase_id uuid not null unique references public.lead_purchases(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  tradie_id uuid not null references public.profiles(id) on delete cascade,
  homeowner_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create index reviews_tradie_id_idx on public.reviews (tradie_id);

alter table public.reviews enable row level security;

-- ============================================================
-- STEP 2 — RLS: signed-in read (not fully public) — reviews are shown on
-- the gated lead profile view and on /tradies/[id], both of which now
-- require a session; this keeps the underlying table consistent with
-- that even against a direct Supabase REST API call with the anon key.
-- ============================================================
create policy "reviews_select_signed_in"
  on public.reviews for select
  using (auth.uid() is not null);

-- ============================================================
-- STEP 3 — RLS: a homeowner may only insert a review for a lead_purchase
-- that is paid, marked hired, belongs to a job they own, and whose
-- tradie_id/job_id match the review row (stops spoofing a review against
-- a mismatched tradie/job pair). No update/delete policy — reviews are
-- immutable once posted.
-- ============================================================
create policy "reviews_insert_homeowner_hired"
  on public.reviews for insert
  with check (
    auth.uid() = homeowner_id
    and exists (
      select 1 from public.lead_purchases lp
      join public.jobs j on j.id = lp.job_id
      where lp.id = reviews.lead_purchase_id
        and lp.job_id = reviews.job_id
        and lp.tradie_id = reviews.tradie_id
        and lp.status = 'paid'
        and lp.engagement_status = 'hired'
        and j.homeowner_id = auth.uid()
    )
  );

-- ============================================================
-- STEP 4 — lead_purchases: new UPDATE policy letting the homeowner (not
-- just the tradie) move a paid lead to 'hired' or 'not_progressing' on
-- jobs they own. Coexists with lead_purchases_update_own_engagement
-- (step7) — Postgres OR's RLS policies together, so this only adds a
-- narrow homeowner capability, it doesn't touch the tradie's existing
-- one. The 'not_progressing' allowance (not just 'hired') is what lets
-- "Mark as hired" also auto-decline the other tradie if 2 bought the
-- same lead — the homeowner still can't set 'pending_response' or
-- 'quoted', which stay tradie-only pipeline states.
-- ============================================================
create policy "lead_purchases_update_homeowner_hire"
  on public.lead_purchases for update
  using (
    status = 'paid'
    and exists (select 1 from public.jobs j where j.id = lead_purchases.job_id and j.homeowner_id = auth.uid())
  )
  with check (
    status = 'paid'
    and engagement_status in ('hired', 'not_progressing')
    and exists (select 1 from public.jobs j where j.id = lead_purchases.job_id and j.homeowner_id = auth.uid())
  );
