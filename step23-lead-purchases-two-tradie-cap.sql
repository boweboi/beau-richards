-- Hard cap: at most 2 tradies can ever hold a 'paid' lead_purchases row for
-- the same job. The application already soft-checks this before creating a
-- pending row and charging Stripe (src/app/(site)/jobs/[id]/actions.ts), but
-- that check-then-act is racy under concurrent purchases — two tradies
-- could both pass the check when only one slot is free, both pay, and both
-- webhooks would try to mark their row paid. This function is the real
-- guarantee: the webhook (src/app/api/stripe/webhook/route.ts) calls it
-- instead of updating lead_purchases directly.
--
-- Stripe delivers webhooks at-least-once and will redeliver an event the
-- endpoint already handled — this function treats "already paid" and
-- "already refunded" (same purchase_id + session_id) as idempotent
-- successes, not errors, so a replayed event doesn't get treated as a
-- failure and retried forever, and never re-runs the cap check for a row
-- that's already past it.
--
-- Run in the Supabase SQL editor.

create or replace function public.mark_lead_purchase_paid(
  p_purchase_id uuid,
  p_session_id text,
  p_payment_intent_id text
)
returns table (
  outcome text, -- 'paid' | 'cap_reached' | 'already_refunded' | 'not_found'
  id uuid,
  job_id uuid,
  tradie_id uuid,
  amount_cents integer
)
language plpgsql
security definer set search_path = public
as $$
declare
  v_current_status text;
  v_job_id uuid;
  v_paid_count integer;
begin
  select lp.status, lp.job_id into v_current_status, v_job_id
  from public.lead_purchases lp
  where lp.id = p_purchase_id
    and lp.stripe_checkout_session_id = p_session_id;

  if v_job_id is null then
    return query select 'not_found'::text, null::uuid, null::uuid, null::uuid, null::integer;
    return;
  end if;

  -- Idempotent replay of an event we already fully processed.
  if v_current_status = 'paid' then
    return query
      select 'paid'::text, lp.id, lp.job_id, lp.tradie_id, lp.amount_cents
      from public.lead_purchases lp
      where lp.id = p_purchase_id;
    return;
  end if;

  if v_current_status = 'refunded' then
    return query select 'already_refunded'::text, null::uuid, null::uuid, null::uuid, null::integer;
    return;
  end if;

  if v_current_status <> 'pending' then
    -- e.g. 'failed' — set by checkout.session.expired, shouldn't normally
    -- coincide with a completed-checkout webhook, but don't resurrect it.
    return query select 'not_found'::text, null::uuid, null::uuid, null::uuid, null::integer;
    return;
  end if;

  -- Lock the job row so two concurrent calls for the same job's leads
  -- serialize here — whichever gets the lock first sees an accurate paid
  -- count and commits before the other proceeds. Without this, both could
  -- read "1 paid" at the same instant and both mark themselves paid.
  perform 1 from public.jobs where id = v_job_id for update;

  select count(*) into v_paid_count
  from public.lead_purchases
  where job_id = v_job_id and status = 'paid';

  if v_paid_count >= 2 then
    return query select 'cap_reached'::text, null::uuid, null::uuid, null::uuid, null::integer;
    return;
  end if;

  update public.lead_purchases
  set status = 'paid',
      paid_at = now(),
      stripe_payment_intent_id = p_payment_intent_id
  where id = p_purchase_id
    and status = 'pending';

  return query
    select 'paid'::text, lp.id, lp.job_id, lp.tradie_id, lp.amount_cents
    from public.lead_purchases lp
    where lp.id = p_purchase_id;
end;
$$;
