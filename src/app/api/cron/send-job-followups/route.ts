import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createSignedJobToken } from "@/lib/session-crypto";

const FOLLOWUP_DELAY_DAYS = 3;
const FOLLOWUP_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

type CandidateJob = {
  id: string;
  title: string;
  job_contacts: { contact_name: string; contact_email: string } | null;
};

// Triggered daily by Vercel Cron (see vercel.json) — not user-facing, so
// it's gated on a shared secret rather than a Supabase session. Vercel
// automatically sends this bearer token on cron-triggered requests once
// CRON_SECRET is set as a project env var.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const cutoff = new Date(Date.now() - FOLLOWUP_DELAY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data: jobs, error: jobsError } = await admin
    .from("jobs")
    .select("id, title, job_contacts(contact_name, contact_email)")
    .eq("status", "open")
    .is("followup_email_sent_at", null)
    .lte("created_at", cutoff);

  if (jobsError) {
    console.error("[send-job-followups] Failed to query candidate jobs:", jobsError.message);
    return NextResponse.json({ error: jobsError.message }, { status: 500 });
  }

  const candidates = (jobs ?? []) as unknown as CandidateJob[];
  let sent = 0;
  let skipped = 0;

  await Promise.all(
    candidates.map(async (job) => {
      if (!job.job_contacts) {
        skipped++;
        return;
      }

      const { contact_name: contactName, contact_email: contactEmail } = job.job_contacts;

      // Respect the same global opt-out list the tradie job-alert flow
      // already checks (step12-email-unsubscribes.sql) — still mark as
      // followed-up so an unsubscribed contact isn't rechecked every day.
      const { data: unsubscribed } = await admin
        .from("email_unsubscribes")
        .select("email")
        .eq("email", contactEmail)
        .maybeSingle();

      if (unsubscribed) {
        skipped++;
        await admin
          .from("jobs")
          .update({ followup_email_sent_at: new Date().toISOString() })
          .eq("id", job.id);
        return;
      }

      try {
        const token = await createSignedJobToken(job.id, FOLLOWUP_TOKEN_TTL_SECONDS);
        const allSortedUrl = `${siteUrl}/job-followup?token=${token}`;
        const stillLookingUrl = `${siteUrl}/homeowner-dashboard?followupAck=1`;

        const res = await fetch(`${siteUrl}/api/emails/send-job-followup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: contactEmail,
            contactName,
            jobTitle: job.title,
            stillLookingUrl,
            allSortedUrl,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          console.error(
            `[send-job-followups] Failed to send follow-up for job ${job.id}:`,
            body.error ?? res.statusText
          );
          return;
        }

        await admin
          .from("jobs")
          .update({ followup_email_sent_at: new Date().toISOString() })
          .eq("id", job.id);
        sent++;
      } catch (err) {
        console.error(`[send-job-followups] Failed to send follow-up for job ${job.id}:`, err);
      }
    })
  );

  console.log(`[send-job-followups] Sent ${sent}, skipped ${skipped}, candidates ${candidates.length}`);
  return NextResponse.json({ sent, skipped, candidates: candidates.length });
}
