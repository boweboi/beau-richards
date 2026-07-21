import Link from "next/link";

export type HomeownerJob = {
  id: string;
  title: string;
  category: string;
  region: string;
  town: string;
  status: string;
  created_at: string;
};

export type PurchasingTradie = {
  leadId: string;
  tradieName: string;
  trade: string | null;
  engagementStatus: string;
};

const ENGAGEMENT_LABELS: Record<string, string> = {
  pending_response: "Pending response",
  quoted: "Quoted",
  hired: "Hired",
  not_progressing: "Not progressing",
};

function formatPostedAt(createdAt: string) {
  const date = new Date(createdAt);
  return date.toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PostedJobsList({
  jobs,
  leadsByJob,
}: {
  jobs: HomeownerJob[];
  leadsByJob: Record<string, PurchasingTradie[]>;
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-xl font-semibold text-navy-950">
          Your posted jobs
        </h2>
        <Link
          href="/post-a-job"
          className="rounded-md bg-hivis-500 px-4 py-2 text-center text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
        >
          + Post a new job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-line bg-white p-6 text-sm text-ink-700">
          You haven&apos;t posted any jobs yet.
        </p>
      ) : (
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
                  <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                    <div>
                      <dt className="inline font-semibold">Location: </dt>
                      <dd className="inline">
                        {job.town}, {job.region}
                      </dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">Status: </dt>
                      <dd className="inline capitalize">{job.status}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">Posted: </dt>
                      <dd className="inline">{formatPostedAt(job.created_at)}</dd>
                    </div>
                  </dl>
                </div>
                <Link
                  href={`/jobs/${job.id}`}
                  className="shrink-0 rounded-md border border-line px-4 py-2 text-center text-sm font-semibold text-navy-950 transition hover:bg-navy-950/5"
                >
                  View details →
                </Link>
              </div>

              {(leadsByJob[job.id]?.length ?? 0) > 0 && (
                <div className="mt-4 border-t border-line pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Tradies who bought this lead
                  </p>
                  <ul className="mt-2 space-y-2">
                    {leadsByJob[job.id].map((tradie) => (
                      <li
                        key={tradie.leadId}
                        className="flex flex-col gap-2 rounded-lg border border-line p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <span className="font-semibold text-navy-950">
                            {tradie.tradieName}
                          </span>
                          {tradie.trade && (
                            <span className="text-ink-500"> — {tradie.trade}</span>
                          )}
                          <span className="ml-2 text-xs text-ink-500">
                            {ENGAGEMENT_LABELS[tradie.engagementStatus] ??
                              tradie.engagementStatus}
                          </span>
                        </div>
                        <Link
                          href={`/homeowner-dashboard/leads/${tradie.leadId}`}
                          className="text-sm font-semibold text-navy-950 hover:underline"
                        >
                          View profile →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
