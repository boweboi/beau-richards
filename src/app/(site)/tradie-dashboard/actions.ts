"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ENGAGEMENT_STATUSES = [
  "pending_response",
  "quoted",
  "hired",
  "not_progressing",
] as const;

export type UpdateLeadEngagementState = { error: string | null };

export async function updateLeadEngagementStatus(
  leadId: string,
  _prevState: UpdateLeadEngagementState,
  formData: FormData
): Promise<UpdateLeadEngagementState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const engagementStatus = formData.get("engagement_status");
  if (
    typeof engagementStatus !== "string" ||
    !ENGAGEMENT_STATUSES.includes(engagementStatus as (typeof ENGAGEMENT_STATUSES)[number])
  ) {
    return { error: "That status isn't valid." };
  }

  // Own-session client, not the admin client — the
  // lead_purchases_update_own_engagement RLS policy (step7 migration)
  // is what allows this, and only ever touches already-paid rows.
  const { error } = await supabase
    .from("lead_purchases")
    .update({ engagement_status: engagementStatus })
    .eq("id", leadId)
    .eq("tradie_id", user.id);

  if (error) {
    return { error: "Something went wrong saving that status. Please try again." };
  }

  revalidatePath("/tradie-dashboard");
  return { error: null };
}

export type AddPortfolioPhotoResult = { error: string | null };

export async function addPortfolioPhoto(
  storagePath: string,
  caption: string,
  photoType: "before" | "after" | "other"
): Promise<AddPortfolioPhotoResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("tradie_portfolio_photos").insert({
    tradie_id: user.id,
    storage_path: storagePath,
    caption: caption.trim() || null,
    photo_type: photoType,
  });

  if (error) {
    return { error: "Something went wrong saving that photo. Please try again." };
  }

  revalidatePath("/tradie-dashboard");
  return { error: null };
}

export async function deletePortfolioPhoto(photoId: string, storagePath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("tradie_portfolio_photos")
    .delete()
    .eq("id", photoId)
    .eq("tradie_id", user.id);

  // Storage delete-own RLS policy (step7 migration) scopes this to the
  // caller's own "{tradie_id}/..." folder — no admin client needed.
  await supabase.storage.from("tradie-portfolios").remove([storagePath]);

  revalidatePath("/tradie-dashboard");
}
