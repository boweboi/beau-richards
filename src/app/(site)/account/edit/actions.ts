"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TRADE_CATEGORIES } from "@/lib/tradeCategories";
import { parseAreaPairs, isValidAreaPair } from "@/lib/serviceAreas";

export type UpdateContactDetailsState = { error: string | null };

export async function updateContactDetails(
  _prevState: UpdateContactDetailsState,
  formData: FormData
): Promise<UpdateContactDetailsState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Email is deliberately not part of this form — it's the Supabase Auth
  // login identifier, and profiles.email is just a denormalized copy with
  // no uniqueness constraint of its own. Changing it here would silently
  // desync it from the real login email. Display-only until that's built.
  const fullName = (formData.get("full_name") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";

  if (!fullName) {
    return { error: "Please enter your name." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone: phone || null })
    .eq("id", user.id);

  if (error) {
    return { error: "Something went wrong saving your details. Please try again." };
  }

  redirect("/account/edit?savedContact=1");
}

export type UpdateLocationState = { error: string | null };

export async function updateLocation(
  _prevState: UpdateLocationState,
  formData: FormData
): Promise<UpdateLocationState> {
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

  const address = (formData.get("address") as string | null)?.trim() ?? "";
  const region = formData.get("region") as string | null;
  const town = formData.get("town") as string | null;

  if (profile?.role === "homeowner") {
    // Required — post-a-job's profile-completeness check depends on all
    // three being set for homeowners.
    if (!address) {
      return { error: "Please enter your address." };
    }
    if (!region || !town || !isValidAreaPair({ region, town })) {
      return { error: "Please select a valid region and town." };
    }
  } else {
    // Optional for tradies — nothing tradie-facing reads a tradie's own
    // address today (tradie_service_areas covers where they work). But a
    // half-filled value (e.g. a region with no town) still gets rejected
    // rather than silently saved wrong.
    const anyProvided = Boolean(address || region || town);
    if (anyProvided && (!region || !town || !isValidAreaPair({ region, town }))) {
      return { error: "Please select a valid region and town, or leave both blank." };
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      address: address || null,
      region: region || null,
      town: town || null,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Something went wrong saving your location. Please try again." };
  }

  redirect("/account/edit?savedLocation=1");
}

export type UpdateTradeCategoriesState = { error: string | null };

export async function updateTradeCategories(
  _prevState: UpdateTradeCategoriesState,
  formData: FormData
): Promise<UpdateTradeCategoriesState> {
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
    return { error: "Only tradie accounts can select trades." };
  }

  const categories = formData.getAll("categories") as string[];
  if (categories.length === 0) {
    return { error: "Please select at least one trade." };
  }
  if (categories.some((category) => !TRADE_CATEGORIES.includes(category))) {
    return { error: "One of the selected trades isn't valid." };
  }

  // Own-session client, not the admin client — RLS's owner-scoped
  // policies are what allow this. Simple replace rather than a diff:
  // selection sets are small (max 15), so delete-then-insert is fine.
  const { error: deleteError } = await supabase
    .from("tradie_trade_categories")
    .delete()
    .eq("tradie_id", user.id);

  if (deleteError) {
    return { error: "Something went wrong saving your trades. Please try again." };
  }

  const { error: insertError } = await supabase
    .from("tradie_trade_categories")
    .insert(categories.map((category) => ({ tradie_id: user.id, category })));

  if (insertError) {
    return { error: "Something went wrong saving your trades. Please try again." };
  }

  // trade_type is the tradie's "primary" trade — the first category
  // they selected — kept in sync so the admin editor, public tradie
  // profile, and verification-tier checklist keep working unchanged.
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ trade_type: categories[0] })
    .eq("id", user.id);

  if (profileError) {
    return { error: "Something went wrong saving your trades. Please try again." };
  }

  redirect("/account/edit?saved=1");
}

export type UpdateServiceAreasState = { error: string | null };

export async function updateServiceAreas(
  _prevState: UpdateServiceAreasState,
  formData: FormData
): Promise<UpdateServiceAreasState> {
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
    return { error: "Only tradie accounts can select service areas." };
  }

  const areas = parseAreaPairs(formData.getAll("areas") as string[]);
  if (areas.length === 0) {
    return { error: "Please select at least one area you cover." };
  }
  if (areas.some((area) => !isValidAreaPair(area))) {
    return { error: "One of the selected areas isn't valid." };
  }

  // Own-session client, not the admin client — RLS's owner-scoped
  // policies are what allow this. Simple replace rather than a diff:
  // selection sets are small, so delete-then-insert is fine.
  const { error: deleteError } = await supabase
    .from("tradie_service_areas")
    .delete()
    .eq("tradie_id", user.id);

  if (deleteError) {
    return { error: "Something went wrong saving your service areas. Please try again." };
  }

  const { error: insertError } = await supabase
    .from("tradie_service_areas")
    .insert(
      areas.map((area) => ({ tradie_id: user.id, region: area.region, town: area.town }))
    );

  if (insertError) {
    return { error: "Something went wrong saving your service areas. Please try again." };
  }

  // service_region is the tradie's "primary" region — the first one
  // they selected — kept in sync so the admin editor and public tradie
  // profile keep working unchanged.
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ service_region: areas[0].region })
    .eq("id", user.id);

  if (profileError) {
    return { error: "Something went wrong saving your service areas. Please try again." };
  }

  redirect("/account/edit?savedAreas=1");
}
