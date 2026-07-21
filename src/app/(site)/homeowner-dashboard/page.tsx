import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CompleteProfileSection from "./CompleteProfileSection";
import PostedJobsList, { type HomeownerJob } from "./PostedJobsList";

export default async function HomeownerDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, address, region, town")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "homeowner") {
    redirect("/account");
  }

  const hasProfile = Boolean(profile.address && profile.region && profile.town);

  let jobs: HomeownerJob[] = [];
  if (hasProfile) {
    const { data } = await supabase
      .from("jobs")
      .select("id, title, category, region, town, status, created_at")
      .eq("homeowner_id", user.id)
      .order("created_at", { ascending: false });
    jobs = (data ?? []) as HomeownerJob[];
  }

  return (
    <main className="min-h-screen bg-paper-0 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Homeowner dashboard
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Your dashboard
        </h1>

        <section className="mt-10">
          {hasProfile ? (
            <PostedJobsList jobs={jobs} />
          ) : (
            <CompleteProfileSection
              defaultAddress={profile.address ?? ""}
              defaultRegion={profile.region ?? ""}
              defaultTown={profile.town ?? ""}
            />
          )}
        </section>
      </div>
    </main>
  );
}
