-- Site-wide trust stats shown on the home page (TrustStrip.tsx), editable
-- from /admin/site-stats. Single row (id = 1) — this isn't a per-entity
-- table, just a small settings record.
create table public.site_stats (
  id integer primary key,
  verified_tradies integer not null default 0,
  jobs_completed integer not null default 0,
  average_quote_hours numeric not null default 0,
  updated_at timestamptz not null default now()
);

insert into public.site_stats (id, verified_tradies, jobs_completed, average_quote_hours)
values (1, 4800, 12400, 3)
on conflict (id) do nothing;

-- Rendered on the public, unauthenticated home page, so it needs a public
-- read policy — the first genuinely public-read table in this schema.
-- No insert/update/delete policy for anyone: writes only ever go through
-- the admin API route's service-role client, which bypasses RLS.
alter table public.site_stats enable row level security;

create policy "site_stats_public_select"
  on public.site_stats for select
  using (true);
