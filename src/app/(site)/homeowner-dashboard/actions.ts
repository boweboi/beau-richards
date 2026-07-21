"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidAreaPair } from "@/lib/serviceAreas";

export type CompleteHomeownerProfileState = { error: string | null };

export async function completeHomeownerProfile(
  _prevState: CompleteHomeownerProfileState,
  formData: FormData
): Promise<CompleteHomeownerProfileState> {
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

  if (profile?.role !== "homeowner") {
    return { error: "Only homeowner accounts can set this up." };
  }

  const address = (formData.get("address") as string | null)?.trim() ?? "";
  const region = formData.get("region") as string | null;
  const town = formData.get("town") as string | null;

  if (!address) {
    return { error: "Please enter your address." };
  }
  if (!region || !town || !isValidAreaPair({ region, town })) {
    return { error: "Please select a valid region and town." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ address, region, town })
    .eq("id", user.id);

  if (error) {
    return { error: "Something went wrong saving your profile. Please try again." };
  }

  redirect("/homeowner-dashboard");
}
