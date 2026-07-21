import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CompleteProfileSection from "./CompleteProfileSection";
import PostedJobsList, { type HomeownerJob, type PurchasingTradie } from "./PostedJobsList";

type LeadRow = {
  id: string;
  job_id: string;
  tradie_id: string;
  engagement_status: string;
  profiles: { full_name: string; trade_type: string | null } | null;
};

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
  const leadsByJob: Record<string, PurchasingTradie[]> = {};
  if (hasProfile) {
    const { data } = await supabase
      .from("jobs")
      .select("id, title, category, region, town, status, created_at")
      .eq("homeowner_id", user.id)
      .order("created_at", { ascending: false });
    jobs = (data ?? []) as HomeownerJob[];

    if (jobs.length > 0) {
      const admin = createAdminClient();
      const { data: leadRows } = await admin
        .from("lead_purchases")
        .select("id, job_id, tradie_id, engagement_status, profiles(full_name, trade_type)")
        .in(
          "job_id",
          jobs.map((job) => job.id)
        )
        .eq("status", "paid");

      for (const row of (leadRows ?? []) as unknown as LeadRow[]) {
        const existing = leadsByJob[row.job_id] ?? [];
        existing.push({
          leadId: row.id,
          tradieName: row.profiles?.full_name ?? "Tradie",
          trade: row.profiles?.trade_type ?? null,
          engagementStatus: row.engagement_status,
        });
        leadsByJob[row.job_id] = existing;
      }
    }
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
            <PostedJobsList jobs={jobs} leadsByJob={leadsByJob} />
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
