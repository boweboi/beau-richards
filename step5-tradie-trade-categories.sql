-- Tradie trade category selection: multi-select storage.
-- Run this whole file in the Supabase SQL editor.
--
-- profiles.trade_type stays as the tradie's "primary" trade (the first
-- category they select) so the admin editor, the public tradie profile
-- page, and the verification-tier "regulated trade" checklist keep
-- working unchanged. This table holds the full set they select, shaped
-- for future queries like "which tradies do Plumbing in Auckland".
--
-- NOTE: the category check constraint below duplicates the list in
-- src/lib/tradeCategories.ts (TRADE_CATEGORIES) — if that list ever
-- changes, this constraint needs updating to match, by hand.
create table public.tradie_trade_categories (
  tradie_id uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in (
    'Building & Construction', 'Plumbing', 'Electrical',
    'Painting & Decorating', 'Roofing', 'Plastering & Gib Stopping',
    'Tiling', 'Flooring', 'Landscaping & Gardening', 'Fencing',
    'Concreting', 'Bricklaying & Blocklaying', 'Glazing & Windows',
    'Handyman / General', 'Cleaning'
  )),
  created_at timestamptz not null default now(),
  primary key (tradie_id, category)
);

create index tradie_trade_categories_category_idx
  on public.tradie_trade_categories (category);

-- Owner-scoped RLS, same shape as profiles (step2-rls-trigger.sql) and
-- lead_purchases (step4-lead-purchases.sql). A future service-role
-- notification job reads this table via the admin client, which
-- bypasses RLS entirely, same as everywhere else in this app.
alter table public.tradie_trade_categories enable row level security;

create policy "tradie_trade_categories_select_own"
  on public.tradie_trade_categories for select
  using (auth.uid() = tradie_id);

create policy "tradie_trade_categories_insert_own"
  on public.tradie_trade_categories for insert
  with check (auth.uid() = tradie_id);

create policy "tradie_trade_categories_delete_own"
  on public.tradie_trade_categories for delete
  using (auth.uid() = tradie_id);
