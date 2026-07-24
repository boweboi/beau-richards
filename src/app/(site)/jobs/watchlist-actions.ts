"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addToWatchlist(jobId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("tradie_watchlist")
    .insert({
      tradie_id: user.id,
      job_id: jobId,
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/jobs");
  revalidatePath("/tradie-dashboard");
  return { success: true };
}

export async function removeFromWatchlist(jobId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("tradie_watchlist")
    .delete()
    .eq("job_id", jobId)
    .eq("tradie_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/jobs");
  revalidatePath("/tradie-dashboard");
  return { success: true };
}
