-- Email unsubscribe list. Run this whole file in the Supabase SQL editor.
--
-- No RLS policies are added for it below — that's deliberate. Once RLS is
-- enabled with zero policies, only the service-role client
-- (src/lib/supabase/admin.ts) can read or write this table, from either
-- direction. It holds real email addresses with no owning user_id to scope
-- a policy to, so there's no "select own" shape that would make sense here
-- the way it does for profiles/lead_purchases/tradie_trade_categories —
-- every read and write goes through the service-role client
-- (src/app/(site)/unsubscribe/actions.ts writes it, the job-alert send
-- path in src/app/(site)/post-a-job/actions.ts reads it).
create table public.email_unsubscribes (
  email text primary key,
  unsubscribed_at timestamptz not null default now()
);

alter table public.email_unsubscribes enable row level security;
