"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  // No DB trigger creates this row (see step2-rls-trigger.sql) — insert it
  // directly while we're still authenticated as the just-created user.
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    role,
    full_name: fullName,
    email,
  });

  if (profileError) {
    return {
      error:
        "Your account was created, but we couldn't set up your profile. Please contact support.",
    };
  }

  redirect("/account");
}
