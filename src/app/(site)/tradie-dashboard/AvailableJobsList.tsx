import Link from "next/link";

export type SortOption = "newest" | "closest" | "urgent";

export type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  region: string;
  town: string;
  timeframe: string;
  created_at: string;
};

function formatPostedAt(createdAt: string) {
  const date = new Date(createdAt);
  return date.toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "closest", label: "Closest" },
  { value: "urgent", label: "Urgent" },
];

export default function AvailableJobsList({
  jobs,
  sort,
  hasSetup,
  purchasedJobIds,
}: {
  jobs: Job[];
  sort: SortOption;
  hasSetup: boolean;
  purchasedJobIds: Set<string>;
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-xl font-semibold text-navy-950">
          Available jobs
        </h2>
        {hasSetup && jobs.length > 0 && (
          <div className="flex items-center gap-1 text-sm">
            {SORT_OPTIONS.map((option) => (
              <Link
                key={option.value}
                href={option.value === "newest" ? "/tradie-dashboard" : `/tradie-dashboard?sort=${option.value}`}
                className={`rounded-md px-3 py-1.5 font-medium transition ${
                  sort === option.value
                    ? "bg-navy-950 text-white"
                    : "text-ink-700 hover:bg-navy-950/5"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {!hasSetup && (
        <div className="mt-4 rounded-2xl border border-line bg-white p-6 text-sm text-ink-700">
          Set up your trade categories and service areas to see jobs
          matched to you.{" "}
          <Link
            href="/account/edit"
            className="font-semibold text-navy-950 hover:underline"
          >
            Edit your profile →
          </Link>
        </div>
      )}

      {hasSetup && jobs.length === 0 && (
        <p className="mt-4 rounded-2xl border border-line bg-white p-6 text-sm text-ink-700">
          No open jobs match your trades and areas right now — check back soon.
        </p>
      )}

      {jobs.length > 0 && (
        <ul className="mt-4 space-y-3">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <span className="inline-flex items-center rounded-full bg-navy-900/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-navy-700">
                    {job.category}
                  </span>
                  <h3 className="mt-2 font-semibold text-navy-950">{job.title}</h3>
                  <p className="mt-1 text-sm text-ink-700">
                    {truncate(job.description, 120)}
                  </p>
                  <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                    <div>
                      <dt className="inline font-semibold">Location: </dt>
                      <dd className="inline">
                        {job.town}, {job.region}
                      </dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">Timeline: </dt>
                      <dd className="inline">{job.timeframe}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">Posted: </dt>
                      <dd className="inline">{formatPostedAt(job.created_at)}</dd>
                    </div>
                  </dl>
                </div>
                <Link
                  href={`/jobs/${job.id}`}
                  className="shrink-0 rounded-md bg-hivis-500 px-4 py-2 text-center text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
                >
                  {purchasedJobIds.has(job.id) ? "View & contact →" : "View details →"}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
