import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import EditContactDetailsForm from "./EditContactDetailsForm";
import EditLocationForm from "./EditLocationForm";
import EditTradeCategoriesForm from "./EditTradeCategoriesForm";
import EditServiceAreasForm from "./EditServiceAreasForm";

export default async function EditAccountPage({
  searchParams,
}: {
  searchParams: Promise<{
    savedContact?: string;
    savedLocation?: string;
    saved?: string;
    savedAreas?: string;
  }>;
}) {
  const { savedContact, savedLocation, saved, savedAreas } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email, phone, address, region, town")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  const isTradie = profile.role === "tradie";

  let selectedCategories: string[] = [];
  let selectedAreas: string[] = [];
  if (isTradie) {
    const [{ data: categoryRows }, { data: areaRows }] = await Promise.all([
      supabase.from("tradie_trade_categories").select("category").eq("tradie_id", user.id),
      supabase.from("tradie_service_areas").select("region, town").eq("tradie_id", user.id),
    ]);
    selectedCategories = (categoryRows ?? []).map((row) => row.category);
    selectedAreas = (areaRows ?? []).map((row) => `${row.region}|${row.town}`);
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-navy-950 px-6 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-paper-0 p-8 shadow-xl">
        <h1 className="font-display text-xl font-semibold text-navy-950">
          Edit your profile
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Update your contact details and location{isTradie ? ", and your trade details." : "."}
        </p>

        {savedContact === "1" && (
          <p className="mt-4 rounded-md bg-hivis-500/10 px-4 py-3 text-sm text-navy-950">
            Your contact details have been saved.
          </p>
        )}

        <EditContactDetailsForm
          email={profile.email}
          defaultFullName={profile.full_name}
          defaultPhone={profile.phone ?? ""}
        />

        <hr className="mt-8 border-line" />

        <h2 className="mt-8 font-display text-lg font-semibold text-navy-950">
          Location
        </h2>

        {savedLocation === "1" && (
          <p className="mt-4 rounded-md bg-hivis-500/10 px-4 py-3 text-sm text-navy-950">
            Your location has been saved.
          </p>
        )}

        <EditLocationForm
          role={profile.role}
          defaultAddress={profile.address ?? ""}
          defaultRegion={profile.region ?? ""}
          defaultTown={profile.town ?? ""}
        />

        {isTradie && (
          <>
            <hr className="mt-8 border-line" />

            <h2 className="mt-8 font-display text-lg font-semibold text-navy-950">
              Trade categories
            </h2>

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

            {savedAreas === "1" && (
              <p className="mt-4 rounded-md bg-hivis-500/10 px-4 py-3 text-sm text-navy-950">
                Your service areas have been saved.
              </p>
            )}

            <EditServiceAreasForm defaultSelected={selectedAreas} />
          </>
        )}

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
