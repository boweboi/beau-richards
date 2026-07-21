import Link from "next/link";
import LeadEngagementStatusSelect from "./LeadEngagementStatusSelect";

export type PurchaseRow = {
  id: string;
  job_id: string;
  amount_cents: number;
  engagement_status: string;
  paid_at: string | null;
  jobs: { title: string; region: string; town: string } | null;
};

function formatPaidAt(paidAt: string | null) {
  if (!paidAt) return "—";
  return new Date(paidAt).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amountCents: number) {
  return `$${(amountCents / 100).toFixed(0)}`;
}

export default function PurchasedLeadsList({ purchases }: { purchases: PurchaseRow[] }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-navy-950">
        Purchased leads
      </h2>

      {purchases.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-line bg-white p-6 text-sm text-ink-700">
          You haven&apos;t purchased any leads yet — browse the jobs above to
          get started.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {purchases.map((purchase) => (
            <li
              key={purchase.id}
              className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold text-navy-950">
                    {purchase.jobs?.title ?? "Job no longer available"}
                  </h3>
                  {purchase.jobs && (
                    <p className="mt-1 text-sm text-ink-500">
                      {purchase.jobs.town}, {purchase.jobs.region}
                    </p>
                  )}
                  <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                    <div>
                      <dt className="inline font-semibold">Paid: </dt>
                      <dd className="inline">{formatAmount(purchase.amount_cents)}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">Purchased: </dt>
                      <dd className="inline">{formatPaidAt(purchase.paid_at)}</dd>
                    </div>
                  </dl>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                  <LeadEngagementStatusSelect
                    leadId={purchase.id}
                    currentStatus={purchase.engagement_status}
                  />
                  <Link
                    href={`/jobs/${purchase.job_id}`}
                    className="text-sm font-semibold text-navy-950 hover:underline"
                  >
                    View & contact homeowner →
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
