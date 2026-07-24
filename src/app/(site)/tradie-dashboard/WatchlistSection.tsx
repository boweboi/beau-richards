import Link from "next/link";
import { removeFromWatchlist } from "@/app/(site)/jobs/watchlist-actions";

export type WatchlistRow = {
  id: string;
  job_id: string;
  created_at: string;
  jobs: {
    title: string;
    description: string;
    category: string;
    region: string;
    town: string;
    timeframe: string;
    created_at: string;
  } | null;
};

function formatPostedAt(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export default function WatchlistSection({ watchlist }: { watchlist: WatchlistRow[] }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-navy-950">Saved jobs</h2>

      {watchlist.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-line bg-white p-6 text-sm text-ink-700">
          No saved jobs yet.{" "}
          <Link href="/jobs" className="font-semibold text-navy-950 hover:underline">
            Browse jobs
          </Link>{" "}
          and hit Save to keep an eye on them.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {watchlist.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  {row.jobs && (
                    <span className="inline-flex items-center rounded-full bg-navy-900/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-navy-700">
                      {row.jobs.category}
                    </span>
                  )}
                  <h3 className="mt-2 font-semibold text-navy-950">
                    {row.jobs?.title ?? "Job no longer available"}
                  </h3>
                  {row.jobs && (
                    <>
                      <p className="mt-1 text-sm text-ink-700">
                        {truncate(row.jobs.description, 120)}
                      </p>
                      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                        <div>
                          <dt className="inline font-semibold">Location: </dt>
                          <dd className="inline">
                            {row.jobs.town}, {row.jobs.region}
                          </dd>
                        </div>
                        <div>
                          <dt className="inline font-semibold">Timeline: </dt>
                          <dd className="inline">{row.jobs.timeframe}</dd>
                        </div>
                        <div>
                          <dt className="inline font-semibold">Posted: </dt>
                          <dd className="inline">{formatPostedAt(row.jobs.created_at)}</dd>
                        </div>
                      </dl>
                    </>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                  {row.jobs && (
                    <Link
                      href={`/jobs/${row.job_id}`}
                      className="rounded-md bg-hivis-500 px-4 py-2 text-center text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
                    >
                      View details →
                    </Link>
                  )}
                  <form
                    action={async () => {
                      "use server";
                      await removeFromWatchlist(row.job_id);
                    }}
                  >
                    <button
                      type="submit"
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
