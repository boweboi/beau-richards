-- Tracks whether a job's one-time "still looking?" follow-up email (see
-- src/app/api/cron/send-job-followups/route.ts) has already been sent, so
-- the daily cron doesn't resend it, and a failed send naturally retries the
-- next day (only set once the email actually goes out). Run in the
-- Supabase SQL editor.

alter table public.jobs
  add column followup_email_sent_at timestamptz;
