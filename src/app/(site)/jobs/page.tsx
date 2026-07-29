import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { groupJobsByRegion, type Job, type RegionGroup } from "@/lib/groupJobsByRegion";
import { getTradieMatchCriteria } from "@/lib/tradieJobMatch";
import regionsData from "@/nz-regions.json";
import SaveJobButton from "./SaveJobButton";
import Pagination, { buildJobsUrl } from "./Pagination";

type Tab = "matching" | "all";

const PAGE_SIZE = 10;

// "Garbage in" guard — missing, non-numeric, or sub-1 values all default
// to page 1 rather than producing a broken range() call.
function sanitizePage(value: string | undefined): number {
  const parsed = parseInt(value ?? "", 10);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
}

function formatPostedAt(createdAt: string) {
  const date = new Date(createdAt);
  return {
    date: date.toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" }),
    time: date.toLocaleTimeString("en-NZ", { hour: "numeric", minute: "2-digit" }),
  };
}

// Urgent stands out (green), Flexible is moderate (hivis orange), Quotes
// is the lowest-priority tier so it stays a plain neutral badge.
const TIMEFRAME_BADGE_STYLES: Record<string, string> = {
  Urgent: "bg-iron-600/10 text-iron-600",
  Flexible: "bg-hivis-500/10 text-hivis-600",
  Quotes: "border border-line bg-white text-ink-700",
};

function TimeframeBadge({ timeframe }: { timeframe: string }) {
  const style = TIMEFRAME_BADGE_STYLES[timeframe] ?? "border border-line bg-white text-ink-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${style}`}
    >
      {timeframe}
    </span>
  );
}

function JobGroups({
  groups,
  savedJobIds,
  purchasedJobIds,
  showSaveButton,
}: {
  groups: RegionGroup[];
  savedJobIds: Set<string>;
  purchasedJobIds: Set<string>;
  showSaveButton: boolean;
}) {
  return (
    <>
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
                      <li
                        key={job.id}
                        className="rounded-xl border border-line bg-white p-5 shadow-sm transition hover:border-hivis-500"
                      >
                        <Link href={`/jobs/${job.id}`} className="block">
                          <h4 className="font-semibold text-navy-950">{job.title}</h4>
                          <p className="mt-1 text-sm text-ink-700">{job.description}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <TimeframeBadge timeframe={job.timeframe} />
                            <p className="text-xs text-ink-500">
                              Posted {date} at {time}
                            </p>
                          </div>
                        </Link>
                        {purchasedJobIds.has(job.id) && (
                          <span className="mt-2 inline-flex items-center rounded-full bg-iron-600/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-iron-600">
                            Contact unlocked
                          </span>
                        )}
                        {showSaveButton && (
                          <div className="mt-3">
                            <SaveJobButton
                              jobId={job.id}
                              initialSaved={savedJobIds.has(job.id)}
                            />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    tab?: string;
    matchingPage?: string;
    allPage?: string;
  }>;
}) {
  const {
    category,
    tab: tabParam,
    matchingPage: matchingPageParam,
    allPage: allPageParam,
  } = await searchParams;
  const tab: Tab = tabParam === "all" ? "all" : "matching";

  const matchingPage = sanitizePage(matchingPageParam);
  const allPage = sanitizePage(allPageParam);
  // Only the active tab's page actually gets clamped against a real
  // totalPages below (that's the only tab whose query runs) — the other
  // tab's sanitized value just passes through untouched so it round-trips
  // in links until the user switches to it.
  let matchingPageClamped = matchingPage;
  let allPageClamped = allPage;

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

  // This page shows jobs matched to a tradie's own trade categories and
  // service areas (or, on the "All jobs" tab, everything site-wide) — it
  // isn't for homeowners. Homeowners view their own posted jobs from
  // their dashboard.
  if (profile?.role !== "tradie") {
    redirect("/account");
  }

  // A tradie can purchase a lead for any open job regardless of whether it
  // matches their categories/areas (purchaseLead has no such restriction),
  // so this is fetched once and shown on both tabs.
  const { data: purchaseRows } = await supabase
    .from("lead_purchases")
    .select("job_id")
    .eq("tradie_id", user.id)
    .eq("status", "paid");
  const purchasedJobIds = new Set((purchaseRows ?? []).map((row) => row.job_id));

  let categories: string[] = [];
  let regions: string[] = [];
  let hasSetup = false;
  const savedJobIds = new Set<string>();

  if (tab === "matching") {
    const criteria = await getTradieMatchCriteria(supabase, user.id);
    categories = criteria.categories;
    regions = criteria.regions;
    hasSetup = criteria.hasSetup;

    const { data: watchlistRows } = await supabase
      .from("tradie_watchlist")
      .select("job_id")
      .eq("tradie_id", user.id);

    for (const row of watchlistRows ?? []) {
      savedJobIds.add(row.job_id);
    }
  }

  let jobs: Job[] = [];
  let matchingTotalPages = 1;
  let allTotalPages = 1;

  if (tab === "matching") {
    if (hasSetup) {
      // Count first, with the same filters but no range — that's what the
      // clamp below needs before we can build a valid range() for the
      // actual fetch.
      let countQuery = supabase
        .from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("status", "open")
        .in("category", categories)
        .in("region", regions);

      if (category) {
        countQuery = countQuery.eq("category", category);
      }

      const { count } = await countQuery;
      matchingTotalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
      matchingPageClamped = matchingPage > matchingTotalPages ? matchingTotalPages : matchingPage;

      const from = (matchingPageClamped - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("jobs")
        .select("id, title, description, region, town, timeframe, created_at", { count: "exact" })
        .eq("status", "open")
        .in("category", categories)
        .in("region", regions)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (category) {
        query = query.eq("category", category);
      }

      const { data } = await query;
      jobs = (data ?? []) as Job[];
    }
  } else {
    // "All jobs" — deliberately unfiltered by category/region. ?category=
    // still applies here (unlike region), since the whole point of this
    // tab is letting a tradie see work outside their usual area.
    let countQuery = supabase
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("status", "open");

    if (category) {
      countQuery = countQuery.eq("category", category);
    }

    const { count } = await countQuery;
    allTotalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
    allPageClamped = allPage > allTotalPages ? allTotalPages : allPage;

    const from = (allPageClamped - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("jobs")
      .select("id, title, description, region, town, timeframe, created_at", { count: "exact" })
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (category) {
      query = query.eq("category", category);
    }

    const { data } = await query;
    jobs = (data ?? []) as Job[];
  }

  const groups = groupJobsByRegion(jobs, regionsData);

  const heading =
    tab === "all" ? "All open jobs" : category ? `${category} jobs` : "Jobs matching your trade";

  const otherParams = {
    tab,
    category,
    matchingPage: matchingPageClamped,
    allPage: allPageClamped,
  };

  const clearFilterHref = buildJobsUrl({ ...otherParams, category: undefined });

  return (
    <main className="min-h-screen bg-paper-0 px-4 py-12 sm:py-16">
      <div className="mx-auto mb-10 max-w-4xl text-center">
        <h1 className="font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          {heading}
        </h1>
        <p className="mt-2 text-ink-500">
          {tab === "all"
            ? "Every open job posted on TradieMatch, unfiltered."
            : "Jobs matched to your trade categories and service areas."}
        </p>

        <div className="mt-4 flex items-center justify-center gap-1 text-sm">
          <Link
            href={buildJobsUrl({ ...otherParams, tab: "matching" })}
            className={`rounded-md px-3 py-1.5 font-medium transition ${
              tab === "matching" ? "bg-navy-950 text-white" : "text-ink-700 hover:bg-navy-950/5"
            }`}
          >
            Matching jobs
          </Link>
          <Link
            href={buildJobsUrl({ ...otherParams, tab: "all" })}
            className={`rounded-md px-3 py-1.5 font-medium transition ${
              tab === "all" ? "bg-navy-950 text-white" : "text-ink-700 hover:bg-navy-950/5"
            }`}
          >
            All jobs
          </Link>
        </div>

        {category && (
          <p className="mt-3">
            <Link
              href={clearFilterHref}
              className="text-sm font-medium text-navy-950 hover:underline"
            >
              Clear filter — show all trades
            </Link>
          </p>
        )}
      </div>

      <div className="mx-auto max-w-4xl space-y-10">
        {tab === "matching" && !hasSetup ? (
          <p className="text-center text-ink-500">
            Add your trade categories and service areas to your{" "}
            <Link href="/tradie-dashboard" className="font-medium text-navy-950 hover:underline">
              dashboard
            </Link>{" "}
            to start seeing matching jobs here.
          </p>
        ) : groups.length === 0 ? (
          <p className="text-center text-ink-500">
            {category
              ? `No ${category} jobs posted yet — check back soon.`
              : tab === "all"
              ? "No open jobs right now — check back soon."
              : "No jobs posted yet — check back soon."}
          </p>
        ) : (
          <>
            <JobGroups
              groups={groups}
              savedJobIds={savedJobIds}
              purchasedJobIds={purchasedJobIds}
              showSaveButton={tab === "matching"}
            />
            {tab === "matching" ? (
              <Pagination
                page={matchingPageClamped}
                totalPages={matchingTotalPages}
                paramName="matchingPage"
                otherParams={otherParams}
              />
            ) : (
              <Pagination
                page={allPageClamped}
                totalPages={allTotalPages}
                paramName="allPage"
                otherParams={otherParams}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
