create table tradie_watchlist (
  id uuid primary key default gen_random_uuid(),
  tradie_id uuid not null references profiles(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(tradie_id, job_id)
);

alter table tradie_watchlist enable row level security;

create policy "tradies can view their own watchlist"
on tradie_watchlist for select
using (auth.uid() = tradie_id);

create policy "tradies can add to their watchlist"
on tradie_watchlist for insert
with check (auth.uid() = tradie_id);

create policy "tradies can remove from their watchlist"
on tradie_watchlist for delete
using (auth.uid() = tradie_id);
