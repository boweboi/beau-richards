-- Adds a "closed" status for jobs.status, used when a homeowner closes a
-- job out having hired a tradie outside TradieMatch (see
-- src/app/(site)/homeowner-dashboard/actions.ts, closeJobNotHired).
--
-- jobs.status has no committed CHECK constraint from an earlier migration,
-- so this is written defensively: drop-if-exists under the default
-- Postgres-assigned name for an inline column check, then (re)add it
-- explicitly covering all three known values. If the live constraint has a
-- different name, drop it manually first via:
--   select conname from pg_constraint where conrelid = 'public.jobs'::regclass and contype = 'c';
alter table public.jobs drop constraint if exists jobs_status_check;

alter table public.jobs
  add constraint jobs_status_check check (status in ('open', 'completed', 'closed'));
