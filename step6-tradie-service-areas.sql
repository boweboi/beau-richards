-- Tradie region + town (service area) selection: multi-select storage.
-- Run this whole file in the Supabase SQL editor.
--
-- profiles.service_region stays as the tradie's "primary" region (the
-- first one they select) — same treatment trade_type got in
-- step5-tradie-trade-categories.sql. This table holds the full set of
-- (region, town) pairs they cover, shaped for future queries like
-- "which tradies cover Manurewa".
--
-- NOTE: the region check constraint below duplicates the region names
-- in src/nz-regions.json — if that file's region list ever changes,
-- this constraint needs updating to match, by hand. town has no DB
-- check that it belongs to region (matching the existing precedent:
-- jobs.town has no DB validation either) — the app layer validates
-- the (region, town) pair against nz-regions.json before insert.
create table public.tradie_service_areas (
  tradie_id uuid not null references public.profiles(id) on delete cascade,
  region text not null check (region in (
    'Northland', 'Auckland', 'Waikato', 'Bay of Plenty', 'Gisborne',
    'Hawke''s Bay', 'Taranaki', 'Manawatū-Whanganui', 'Wellington',
    'Tasman', 'Nelson', 'Marlborough', 'West Coast', 'Canterbury',
    'Otago', 'Southland'
  )),
  town text not null,
  created_at timestamptz not null default now(),
  primary key (tradie_id, region, town)
);

-- Two single-column indexes rather than one composite — both "which
-- tradies cover this town" and "which tradies cover this region" are
-- real query shapes for the future notification system.
create index tradie_service_areas_town_idx on public.tradie_service_areas (town);
create index tradie_service_areas_region_idx on public.tradie_service_areas (region);

-- Owner-scoped RLS, same shape as tradie_trade_categories
-- (step5-tradie-trade-categories.sql). A future service-role
-- notification job reads this table via the admin client, which
-- bypasses RLS entirely, same as everywhere else in this app.
alter table public.tradie_service_areas enable row level security;

create policy "tradie_service_areas_select_own"
  on public.tradie_service_areas for select
  using (auth.uid() = tradie_id);

create policy "tradie_service_areas_insert_own"
  on public.tradie_service_areas for insert
  with check (auth.uid() = tradie_id);

create policy "tradie_service_areas_delete_own"
  on public.tradie_service_areas for delete
  using (auth.uid() = tradie_id);
