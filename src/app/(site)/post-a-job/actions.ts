"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createSignedEmailToken } from "@/lib/session-crypto";

const UNSUBSCRIBE_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export type JobPayload = {
  title: string;
  category: string;
  region: string;
  town: string;
  description: string;
  budget: string;
  timeframe: string;
  name: string;
  email: string;
  phone: string;
};

export type CreateJobState = { error: string | null };

export async function createJob(payload: JobPayload): Promise<CreateJobState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to post a job." };
  }

  const { data: job, error } = await supabase
    .from("jobs")
    .insert({
      homeowner_id: user.id,
      title: payload.title,
      category: payload.category,
      region: payload.region,
      town: payload.town,
      description: payload.description,
      budget: payload.budget || null,
      timeframe: payload.timeframe,
    })
    .select("id")
    .single();

  if (error || !job) {
    // RLS rejects the insert if the signed-in user isn't a homeowner.
    if (error?.code === "42501") {
      return { error: "Only homeowner accounts can post jobs." };
    }
    return { error: "Something went wrong posting your job. Please try again." };
  }

  // job_contacts has no RLS policies for the authenticated role — only
  // the service-role client can read or write it, from either direction.
  const admin = createAdminClient();
  const { error: contactError } = await admin.from("job_contacts").insert({
    job_id: job.id,
    contact_name: payload.name,
    contact_email: payload.email,
    contact_phone: payload.phone || null,
  });

  if (contactError) {
    return {
      error:
        "Your job was posted, but we couldn't save your contact details. Please contact support.",
    };
  }

  // Job alert emails are a nice-to-have, not part of posting a job — the
  // job is already committed above, so any failure in this block (a
  // lookup miss, a Resend error) must never surface to the homeowner or
  // undo the post.
  try {
    const { data: categoryMatches } = await admin
      .from("tradie_trade_categories")
      .select("tradie_id")
      .eq("category", payload.category);

    const { data: areaMatches } = await admin
      .from("tradie_service_areas")
      .select("tradie_id")
      .eq("region", payload.region);

    const categoryTradieIds = new Set((categoryMatches ?? []).map((row) => row.tradie_id));
    const matchingTradieIds = Array.from(
      new Set((areaMatches ?? []).map((row) => row.tradie_id))
    ).filter((id) => categoryTradieIds.has(id));

    if (matchingTradieIds.length > 0) {
      const { data: tradieProfiles } = await admin
        .from("profiles")
        .select("full_name, email")
        .in("id", matchingTradieIds);

      const candidateEmails = (tradieProfiles ?? []).map((tradie) => tradie.email);

      // email_unsubscribes has no RLS policies for anyone but service-role
      // (step12-email-unsubscribes.sql) — admin is already that client.
      const { data: unsubscribedRows } =
        candidateEmails.length > 0
          ? await admin.from("email_unsubscribes").select("email").in("email", candidateEmails)
          : { data: [] as { email: string }[] };

      const unsubscribedEmails = new Set((unsubscribedRows ?? []).map((row) => row.email));
      const recipients = (tradieProfiles ?? []).filter(
        (tradie) => !unsubscribedEmails.has(tradie.email)
      );

      const requestHeaders = await headers();
      const host = requestHeaders.get("host");
      const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
      const origin = `${protocol}://${host}`;

      // Unlike the job-view link below, the unsubscribe link is clicked
      // from an email days or weeks later — it needs the stable public
      // site URL, not whatever origin happened to serve this request
      // (localhost in dev).
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

      const jobForAlert = {
        title: payload.title,
        location: `${payload.town}, ${payload.region}`,
        description: payload.description,
        postedAt: "Just now",
        url: `${origin}/jobs/${job.id}`,
      };

      await Promise.all(
        recipients.map(async (tradie) => {
          try {
            const token = await createSignedEmailToken(
              tradie.email,
              UNSUBSCRIBE_TOKEN_TTL_SECONDS
            );
            const preferencesUrl = `${siteUrl}/unsubscribe?token=${token}`;

            const res = await fetch(`${origin}/api/emails/send-job-alert`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: tradie.email,
                tradieName: tradie.full_name,
                jobs: [jobForAlert],
                preferencesUrl,
              }),
            });

            if (!res.ok) {
              const body = await res.json().catch(() => ({}));
              console.error("Failed to send job alert email:", body.error ?? res.statusText);
            }
          } catch (err) {
            console.error("Failed to send job alert email:", err);
          }
        })
      );
    }
  } catch (err) {
    console.error("Failed to notify matching tradies of new job:", err);
  }

  revalidatePath("/jobs");
  return { error: null };
}
