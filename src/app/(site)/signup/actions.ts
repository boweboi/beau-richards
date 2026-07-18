"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TRADE_CATEGORIES } from "@/lib/tradeCategories";

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

  const categories = formData.getAll("categories") as string[];
  if (role === "tradie") {
    if (categories.length === 0) {
      return { error: "Please select at least one trade." };
    }
    if (categories.some((category) => !TRADE_CATEGORIES.includes(category))) {
      return { error: "One of the selected trades isn't valid." };
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
    // trade_type is the tradie's "primary" trade — the first category
    // they selected — kept in sync so the admin editor, public tradie
    // profile, and verification-tier checklist keep working unchanged.
    ...(role === "tradie" ? { trade_type: categories[0] } : {}),
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
  }

  redirect("/account");
}
