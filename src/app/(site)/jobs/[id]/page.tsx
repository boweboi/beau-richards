import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function formatPostedAt(createdAt: string) {
  const date = new Date(createdAt);
  return {
    date: date.toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" }),
    time: date.toLocaleTimeString("en-NZ", { hour: "numeric", minute: "2-digit" }),
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: job } = await supabase
    .from("jobs")
    .select("title, description, category, region, town, budget, timeframe, created_at")
    .eq("id", id)
    .single();

  if (!job) {
    notFound();
  }

  const { date, time } = formatPostedAt(job.created_at);

  return (
    <main className="min-h-screen bg-paper-0 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link href="/jobs" className="text-sm font-medium text-ink-700 hover:text-navy-950">
          ← Back to all jobs
        </Link>

        <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
          <span className="inline-flex items-center rounded-full bg-navy-900/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-navy-700">
            {job.category}
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
            {job.title}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {job.town}, {job.region}
          </p>

          <p className="mt-6 whitespace-pre-wrap text-ink-700">{job.description}</p>

          <dl className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
            {job.budget && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Budget
                </dt>
                <dd className="mt-1 text-navy-950">{job.budget}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Timeframe
              </dt>
              <dd className="mt-1 text-navy-950">{job.timeframe}</dd>
            </div>
          </dl>

          <p className="mt-6 text-xs text-ink-500">
            Posted {date} at {time}
          </p>
        </div>
      </div>
    </main>
  );
}
