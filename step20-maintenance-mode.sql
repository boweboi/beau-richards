-- Site-wide maintenance mode flag, toggled from the admin dashboard
-- (/admin/dashboard) and checked on every request in src/proxy.ts. Lives
-- on site_stats since that's already the single-row settings record.
-- Run in the Supabase SQL editor.
alter table public.site_stats
  add column maintenance_mode boolean not null default false;
