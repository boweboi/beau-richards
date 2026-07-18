import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import EditTradeCategoriesForm from "./EditTradeCategoriesForm";
import EditServiceAreasForm from "./EditServiceAreasForm";

export default async function EditAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; savedAreas?: string }>;
}) {
  const { saved, savedAreas } = await searchParams;

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
    redirect("/account");
  }

  const { data: categoryRows } = await supabase
    .from("tradie_trade_categories")
    .select("category")
    .eq("tradie_id", user.id);

  const selectedCategories = (categoryRows ?? []).map((row) => row.category);

  const { data: areaRows } = await supabase
    .from("tradie_service_areas")
    .select("region, town")
    .eq("tradie_id", user.id);

  const selectedAreas = (areaRows ?? []).map((row) => `${row.region}|${row.town}`);

  return (
    <main className="flex flex-1 items-center justify-center bg-navy-950 px-6 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-paper-0 p-8 shadow-xl">
        <h1 className="font-display text-xl font-semibold text-navy-950">
          Edit your profile
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Choose every trade category that applies to your work.
        </p>

        {saved === "1" && (
          <p className="mt-4 rounded-md bg-hivis-500/10 px-4 py-3 text-sm text-navy-950">
            Your trades have been saved.
          </p>
        )}

        <EditTradeCategoriesForm defaultSelected={selectedCategories} />

        <hr className="mt-8 border-line" />

        <h2 className="mt-8 font-display text-lg font-semibold text-navy-950">
          Service areas
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Choose every region and town/suburb you cover.
        </p>

        {savedAreas === "1" && (
          <p className="mt-4 rounded-md bg-hivis-500/10 px-4 py-3 text-sm text-navy-950">
            Your service areas have been saved.
          </p>
        )}

        <EditServiceAreasForm defaultSelected={selectedAreas} />

        <Link
          href="/account"
          className="mt-4 block text-center text-sm font-medium text-navy-950 hover:underline"
        >
          Back to account
        </Link>
      </div>
    </main>
  );
}
