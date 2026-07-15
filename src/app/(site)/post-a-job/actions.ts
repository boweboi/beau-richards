"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

  const { error } = await supabase.from("jobs").insert({
    homeowner_id: user.id,
    title: payload.title,
    category: payload.category,
    region: payload.region,
    town: payload.town,
    description: payload.description,
    budget: payload.budget || null,
    timeframe: payload.timeframe,
    contact_name: payload.name,
    contact_email: payload.email,
    contact_phone: payload.phone || null,
  });

  if (error) {
    // RLS rejects the insert if the signed-in user isn't a homeowner.
    if (error.code === "42501") {
      return { error: "Only homeowner accounts can post jobs." };
    }
    return { error: "Something went wrong posting your job. Please try again." };
  }

  revalidatePath("/jobs");
  return { error: null };
}
