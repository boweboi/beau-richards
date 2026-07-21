"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TRADE_CATEGORIES } from "@/lib/tradeCategories";
import { parseAreaPairs, isValidAreaPair } from "@/lib/serviceAreas";

export type SignupState = { error: string | null };

export async function signup(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as string;

  if (!email || !password || !fullName || !role) {
    return { error: "Please fill in every field." };
  }
  if (role !== "tradie" && role !== "homeowner") {
    return { error: "Please choose whether you're a tradie or a homeowner." };
  }

  if (!formData.get("agree_terms")) {
    return { error: "Please agree to the Terms and Conditions to continue." };
  }

  const categories = formData.getAll("categories") as string[];
  if (role === "tradie") {
    if (categories.length === 0) {
      return { error: "Please select at least one trade." };
    }
    if (categories.some((category) => !TRADE_CATEGORIES.includes(category))) {
      return { error: "One of the selected trades isn't valid." };
    }
  }

  const areas = parseAreaPairs(formData.getAll("areas") as string[]);
  if (role === "tradie") {
    if (areas.length === 0) {
      return { error: "Please select at least one area you cover." };
    }
    if (areas.some((area) => !isValidAreaPair(area))) {
      return { error: "One of the selected areas isn't valid." };
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return {
      error: "Something went wrong creating your account. Please try again.",
    };
  }

  const userId = data.user.id;

  // No DB trigger creates this row (see step2-rls-trigger.sql) — insert it
  // directly while we're still authenticated as the just-created user.
  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    role,
    full_name: fullName,
    email,
    // trade_type/service_region are the tradie's "primary" trade and
    // region — the first of each they selected — kept in sync so the
    // admin editor, public tradie profile, and verification-tier
    // checklist keep working unchanged.
    ...(role === "tradie"
      ? { trade_type: categories[0], service_region: areas[0].region }
      : {}),
  });

  if (profileError) {
    return {
      error:
        "Your account was created, but we couldn't set up your profile. Please contact support.",
    };
  }

  if (role === "tradie") {
    // Own-session client, not the admin client — RLS's insert_own policy
    // is what allows this (mirrors the lead_purchases insert pattern).
    const { error: categoriesError } = await supabase
      .from("tradie_trade_categories")
      .insert(categories.map((category) => ({ tradie_id: userId, category })));

    if (categoriesError) {
      return {
        error:
          "Your account was created, but we couldn't save your trades. Please contact support.",
      };
    }

    const { error: areasError } = await supabase
      .from("tradie_service_areas")
      .insert(
        areas.map((area) => ({ tradie_id: userId, region: area.region, town: area.town }))
      );

    if (areasError) {
      return {
        error:
          "Your account was created, but we couldn't save your service areas. Please contact support.",
      };
    }
  }

  if (role === "tradie") {
    redirect("/tradie-dashboard");
  }

  redirect("/homeowner-dashboard");
}
