-- Removes the "Average Time to First Quote" stat — dropped from the site
-- stats editor (admin/site-stats/page.tsx) and the homepage trust strip
-- (TrustStrip.tsx), leaving only Verified Tradies and Jobs Completed.
-- Run in the Supabase SQL editor.
alter table public.site_stats
  drop column average_quote_hours;
