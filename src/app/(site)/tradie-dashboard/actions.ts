"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { TRADE_CATEGORIES } from "@/lib/tradeCategories";
import { parseAreaPairs, isValidAreaPair } from "@/lib/serviceAreas";

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

export type CompleteProfileSetupState = { error: string | null };

export async function completeProfileSetup(
  _prevState: CompleteProfileSetupState,
  formData: FormData
): Promise<CompleteProfileSetupState> {
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

  if (profile?.role !== "tradie") {
    return { error: "Only tradie accounts can set this up." };
  }

  const categories = formData.getAll("categories") as string[];
  if (categories.length === 0) {
    return { error: "Please select at least one trade." };
  }
  if (categories.some((category) => !TRADE_CATEGORIES.includes(category))) {
    return { error: "One of the selected trades isn't valid." };
  }

  const areas = parseAreaPairs(formData.getAll("areas") as string[]);
  if (areas.length === 0) {
    return { error: "Please select at least one area you cover." };
  }
  if (areas.some((area) => !isValidAreaPair(area))) {
    return { error: "One of the selected areas isn't valid." };
  }

  // Own-session client, not the admin client — RLS's owner-scoped
  // policies are what allow this, same as account/edit/actions.ts.
  const { error: categoryDeleteError } = await supabase
    .from("tradie_trade_categories")
    .delete()
    .eq("tradie_id", user.id);

  if (categoryDeleteError) {
    return { error: "Something went wrong saving your profile. Please try again." };
  }

  const { error: categoryInsertError } = await supabase
    .from("tradie_trade_categories")
    .insert(categories.map((category) => ({ tradie_id: user.id, category })));

  if (categoryInsertError) {
    return { error: "Something went wrong saving your profile. Please try again." };
  }

  const { error: areaDeleteError } = await supabase
    .from("tradie_service_areas")
    .delete()
    .eq("tradie_id", user.id);

  if (areaDeleteError) {
    return { error: "Something went wrong saving your profile. Please try again." };
  }

  const { error: areaInsertError } = await supabase
    .from("tradie_service_areas")
    .insert(
      areas.map((area) => ({ tradie_id: user.id, region: area.region, town: area.town }))
    );

  if (areaInsertError) {
    return { error: "Something went wrong saving your profile. Please try again." };
  }

  // trade_type/service_region are the tradie's "primary" trade and
  // region — the first of each they selected — kept in sync so the
  // admin editor, public tradie profile, and verification-tier
  // checklist keep working unchanged (same convention as signup and
  // account/edit).
  await supabase
    .from("profiles")
    .update({ trade_type: categories[0], service_region: areas[0].region })
    .eq("id", user.id);

  redirect("/tradie-dashboard");
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
