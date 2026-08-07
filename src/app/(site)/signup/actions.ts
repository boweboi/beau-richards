"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { TRADE_CATEGORIES } from "@/lib/tradeCategories";
import { parseAreaPairs, isValidAreaPair } from "@/lib/serviceAreas";
import { sendAccountVerificationEmail } from "@/lib/accountVerification";

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

  const address = (formData.get("address") as string | null)?.trim() ?? "";
  const region = formData.get("region") as string | null;
  const town = formData.get("town") as string | null;
  if (role === "homeowner") {
    if (!address) {
      return { error: "Please enter your property address." };
    }
    if (!region || !town || !isValidAreaPair({ region, town })) {
      return { error: "Please select a valid region and town." };
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
      : { address, region, town }),
  });

  if (profileError) {
    return {
      error:
        "Your account was created, but we couldn't set up your profile. Please contact support.",
    };
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const origin = `${protocol}://${host}`;

  // Welcome email is a nice-to-have, not a signup blocker — the account is
  // already created and committed above, so a failure here must never
  // surface to the user or stop the rest of signup.
  try {
    const res = await fetch(`${origin}/api/emails/send-welcome`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, firstName: fullName.trim().split(" ")[0], role }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error("Failed to send welcome email:", body.error ?? res.statusText);
    }
  } catch (err) {
    console.error("Failed to send welcome email:", err);
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

    // Verification email is what unlocks Bronze tier, but — like the
    // welcome email — must never block or fail signup itself. Sent via
    // the Admin API's generateLink rather than signUp's built-in
    // confirmation flow, so it doesn't touch Supabase's project-wide
    // "Confirm email" setting and never blocks the tradie's own login.
    await sendAccountVerificationEmail({
      email,
      firstName: fullName.trim().split(" ")[0],
      origin,
      next: "/tradie-dashboard",
      context: "tradie-bronze",
    });
  }

  if (role === "homeowner") {
    // Unlike the tradie email above, this one is a real account-activation
    // gate — homeowner-dashboard/post-a-job block on email_verified — but
    // sending it must still never block or fail signup itself; a homeowner
    // whose email bounces can always retry from the "resend" prompt on
    // their dashboard instead of being stuck mid-signup.
    await sendAccountVerificationEmail({
      email,
      firstName: fullName.trim().split(" ")[0],
      origin,
      next: "/homeowner-dashboard",
      context: "homeowner-signup",
    });
  }

  if (role === "tradie") {
    redirect("/tradie-dashboard");
  }

  redirect("/homeowner-dashboard");
}
