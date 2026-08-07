"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidAreaPair } from "@/lib/serviceAreas";

export type CompleteHomeownerProfileState = { error: string | null };

export async function completeHomeownerProfile(
  _prevState: CompleteHomeownerProfileState,
  formData: FormData
): Promise<CompleteHomeownerProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "homeowner") {
    return { error: "Only homeowner accounts can set this up." };
  }

  const address = (formData.get("address") as string | null)?.trim() ?? "";
  const region = formData.get("region") as string | null;
  const town = formData.get("town") as string | null;

  if (!address) {
    return { error: "Please enter your address." };
  }
  if (!region || !town || !isValidAreaPair({ region, town })) {
    return { error: "Please select a valid region and town." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ address, region, town })
    .eq("id", user.id);

  if (error) {
    return { error: "Something went wrong saving your profile. Please try again." };
  }

  redirect("/homeowner-dashboard");
}

export async function closeJobNotHired(jobId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: job } = await supabase
    .from("jobs")
    .select("id, homeowner_id, status")
    .eq("id", jobId)
    .single();

  if (!job || job.homeowner_id !== user.id) {
    redirect(
      `/homeowner-dashboard?closeError=${encodeURIComponent("Job not found or not owned by you.")}`
    );
  }

  if (job.status !== "open") {
    redirect(
      `/homeowner-dashboard?closeError=${encodeURIComponent(
        "This job isn't open, so it can't be closed this way."
      )}`
    );
  }

  const admin = createAdminClient();

  const { error: jobStatusError } = await admin
    .from("jobs")
    .update({ status: "closed" })
    .eq("id", jobId);

  if (jobStatusError) {
    redirect(
      `/homeowner-dashboard?closeError=${encodeURIComponent(
        "Something went wrong closing this job. Please try again."
      )}`
    );
  }

  // Paid tradies still mid-pipeline won't hear from this homeowner again —
  // flag them not_progressing so their own dashboard reflects that, same
  // value markAsHired already uses for auto-declined sibling leads. Their
  // lead_purchases payment row (status, amount_cents, etc.) is untouched.
  await admin
    .from("lead_purchases")
    .update({ engagement_status: "not_progressing" })
    .eq("job_id", jobId)
    .eq("status", "paid")
    .in("engagement_status", ["pending_response", "quoted"]);

  revalidatePath("/homeowner-dashboard");
}
