import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JobPostingForm from "@/components/jobpostingform.jsx";

export default async function PostAJobPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, address, region, town, full_name, email, phone")
    .eq("id", user.id)
    .single();

  if (profile?.role === "homeowner") {
    const hasProfile = Boolean(profile.address && profile.region && profile.town);
    if (!hasProfile) {
      redirect("/homeowner-dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-[#0B1F3A]/[0.03] px-4 py-12 sm:py-16">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-[#0B1F3A] sm:text-4xl">
          Post a job
        </h1>
        <p className="mt-2 text-[#0B1F3A]/60">
          Tell us what you need done and get connected with verified Kiwi tradies in your area.
        </p>
      </div>
      <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-hivis-500/30 bg-hivis-500/10 px-4 py-3 text-sm text-navy-950">
        <strong>Quick tip:</strong> Keep your contact details out of the job
        description. We&apos;ll connect you with interested tradies.
      </div>
      <JobPostingForm
        initialName={profile?.full_name ?? ""}
        initialEmail={profile?.email ?? ""}
        initialPhone={profile?.phone ?? ""}
        initialCategory={category ?? ""}
      />
    </main>
  );
}
