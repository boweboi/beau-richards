"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

  revalidatePath("/jobs");
  return { error: null };
}
