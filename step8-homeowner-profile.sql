-- Homeowner dashboard: address + region/town on profiles.
-- Run in the Supabase SQL editor. Separate from trade_type/service_region
-- (step1-profiles.sql), which are explicitly tradie-only fields.
--
-- No new RLS policy needed — profiles_update_own (step2-rls-trigger.sql)
-- already lets a user update their own row with no column restrictions.

alter table public.profiles
  add column address text,
  add column region text
    check (region in (
      'Northland', 'Auckland', 'Waikato', 'Bay of Plenty', 'Gisborne',
      'Hawke''s Bay', 'Taranaki', 'Manawatū-Whanganui', 'Wellington',
      'Tasman', 'Nelson', 'Marlborough', 'West Coast', 'Canterbury',
      'Otago', 'Southland'
    )),
  add column town text;
