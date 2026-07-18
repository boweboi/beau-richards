"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TRADE_CATEGORIES } from "@/lib/tradeCategories";

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
