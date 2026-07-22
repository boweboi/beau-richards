-- Repo-parity record only — this policy was already run directly in the
-- Supabase SQL editor and is live. Not a step to re-run.
--
-- lead_purchases_select_own (step4) only lets the tradie SELECT their own
-- rows. The homeowner-hire flow (step9's
-- lead_purchases_update_homeowner_hire UPDATE policy, used by
-- src/app/(site)/homeowner-dashboard/leads/[leadId]/actions.ts's
-- markAsHired) had no matching SELECT policy for the homeowner. Postgres
-- RLS uses SELECT-policy visibility to resolve which existing rows an
-- UPDATE's WHERE clause can even see — without this, the homeowner's
-- update matched zero visible rows and silently no-opped (empty result,
-- no error) instead of actually marking the lead hired.
create policy "lead_purchases_select_homeowner_hired"
on lead_purchases
for select
to authenticated
using (
  EXISTS (
    SELECT 1 FROM jobs j
    WHERE j.id = lead_purchases.job_id
    AND j.homeowner_id = auth.uid()
  )
);
