-- Tradie dashboard: portfolio photos, lead engagement status, storage.
-- Run each numbered block separately in the Supabase SQL editor, in
-- order, top to bottom.

-- ============================================================
-- STEP 1 — tradie_portfolio_photos: photo metadata, owner-scoped RLS.
-- Same shape as tradie_trade_categories (step5). The image bytes live
-- in Supabase Storage (see Step 4 below); this table just tracks the
-- storage path + caption + before/after tag per tradie.
-- ============================================================
create table public.tradie_portfolio_photos (
  id uuid primary key default gen_random_uuid(),
  tradie_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null unique,
  caption text,
  photo_type text not null default 'other'
    check (photo_type in ('before', 'after', 'other')),
  created_at timestamptz not null default now()
);

create index tradie_portfolio_photos_tradie_id_idx
  on public.tradie_portfolio_photos (tradie_id);

alter table public.tradie_portfolio_photos enable row level security;

create policy "tradie_portfolio_photos_select_own"
  on public.tradie_portfolio_photos for select
  using (auth.uid() = tradie_id);

create policy "tradie_portfolio_photos_insert_own"
  on public.tradie_portfolio_photos for insert
  with check (auth.uid() = tradie_id);

create policy "tradie_portfolio_photos_delete_own"
  on public.tradie_portfolio_photos for delete
  using (auth.uid() = tradie_id);

-- ============================================================
-- STEP 2 — lead_purchases.engagement_status: job-engagement state,
-- distinct from `status` (payment state, set only by the Stripe
-- webhook path). Defaults apply to existing paid rows too.
-- ============================================================
alter table public.lead_purchases
  add column engagement_status text not null default 'pending_response'
    check (engagement_status in ('pending_response', 'quoted', 'hired', 'not_progressing'));

-- ============================================================
-- STEP 3 — RLS: let a tradie update engagement_status on their OWN
-- rows, but only rows that are already `status = 'paid'`, and the row
-- must still be `status = 'paid'` after the write. USING gates which
-- rows the policy can even touch (a still-'pending' row never
-- qualifies), and WITH CHECK rejects any write that would leave the
-- row not-paid. Together, there is no path from 'pending' to 'paid'
-- through this policy — see step4-lead-purchases.sql Step 7 for why
-- there was deliberately no general UPDATE policy on this table
-- before now.
-- ============================================================
create policy "lead_purchases_update_own_engagement"
  on public.lead_purchases for update
  using (auth.uid() = tradie_id and status = 'paid')
  with check (auth.uid() = tradie_id and status = 'paid');

-- ============================================================
-- STEP 4 — storage bucket for portfolio photos: public read (so the
-- dashboard gallery can render via getPublicUrl, same as site-assets),
-- writes scoped to the uploader's own folder prefix "{tradie_id}/...".
-- storage.objects already has RLS enabled by default in every
-- Supabase project — do not try to ALTER it here.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('tradie-portfolios', 'tradie-portfolios', true)
on conflict (id) do nothing;

create policy "tradie_portfolio_objects_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'tradie-portfolios'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "tradie_portfolio_objects_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'tradie-portfolios'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "tradie_portfolio_objects_public_select"
  on storage.objects for select
  using (bucket_id = 'tradie-portfolios');
