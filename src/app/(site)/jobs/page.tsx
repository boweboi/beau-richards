import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { groupJobsByRegion, type Job } from "@/lib/groupJobsByRegion";
import regionsData from "@/nz-regions.json";

function formatPostedAt(createdAt: string) {
  const date = new Date(createdAt);
  return {
    date: date.toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" }),
    time: date.toLocaleTimeString("en-NZ", { hour: "numeric", minute: "2-digit" }),
  };
}

export default async function JobsPage({
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

  let query = supabase
    .from("jobs")
    .select("id, title, description, region, town, created_at")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data: jobs } = await query;

  const groups = groupJobsByRegion((jobs ?? []) as Job[], regionsData);

  return (
    <main className="min-h-screen bg-paper-0 px-4 py-12 sm:py-16">
      <div className="mx-auto mb-10 max-w-4xl text-center">
        <h1 className="font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          {category ? `${category} jobs` : "Jobs in your area"}
        </h1>
        <p className="mt-2 text-ink-500">
          Browse jobs posted by homeowners across Aotearoa, grouped by region and town.
        </p>
        {category && (
          <p className="mt-3">
            <Link
              href="/jobs"
              className="text-sm font-medium text-navy-950 hover:underline"
            >
              Clear filter — show all trades
            </Link>
          </p>
        )}
      </div>

      <div className="mx-auto max-w-4xl space-y-10">
        {groups.length === 0 && (
          <p className="text-center text-ink-500">
            {category
              ? `No ${category} jobs posted yet — check back soon.`
              : "No jobs posted yet — check back soon."}
          </p>
        )}

        {groups.map((group) => (
          <section key={group.region}>
            <h2 className="font-display text-xl font-semibold text-navy-950">
              {group.region}
            </h2>
            <div className="mt-4 space-y-6">
              {group.towns.map((townGroup) => (
                <div key={townGroup.town}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-500">
                    {townGroup.town}
                  </h3>
                  <ul className="mt-3 space-y-3">
                    {townGroup.jobs.map((job) => {
                      const { date, time } = formatPostedAt(job.created_at);
                      return (
                        <li key={job.id}>
                          <Link
                            href={`/jobs/${job.id}`}
                            className="block rounded-xl border border-line bg-white p-5 shadow-sm transition hover:border-hivis-500"
                          >
                            <h4 className="font-semibold text-navy-950">{job.title}</h4>
                            <p className="mt-1 text-sm text-ink-700">{job.description}</p>
                            <p className="mt-3 text-xs text-ink-500">
                              Posted {date} at {time}
                            </p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
