import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTradieMatchCriteria } from "@/lib/tradieJobMatch";
import PurchaseLeadButton from "@/components/PurchaseLeadButton";

function formatPostedAt(createdAt: string) {
  const date = new Date(createdAt);
  return {
    date: date.toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" }),
    time: date.toLocaleTimeString("en-NZ", { hour: "numeric", minute: "2-digit" }),
  };
}

export default async function JobDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ purchase?: string }>;
}) {
  const { id } = await params;
  const { purchase } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: job } = await supabase
    .from("jobs")
    .select("title, description, category, region, town, budget, timeframe, created_at, homeowner_id")
    .eq("id", id)
    .single();

  if (!job) {
    notFound();
  }

  const { date, time } = formatPostedAt(job.created_at);

  const isOwner = job.homeowner_id === user.id;

  const criteria = await getTradieMatchCriteria(supabase, user.id);
  const isMatchingCategory = criteria.categories.includes(job.category);
  const isMatchingRegion = criteria.regions.includes(job.region);

  // Only warn once the tradie actually has categories/areas set up —
  // with nothing set up yet, every job would "mismatch" and the banner
  // would show unconditionally, which isn't useful signal.
  let outsideMatchMessage: string | null = null;
  if (criteria.hasSetup && (!isMatchingCategory || !isMatchingRegion)) {
    if (!isMatchingCategory && !isMatchingRegion) {
      outsideMatchMessage = `This job is ${job.category} work in ${job.region}, outside both your trade categories and your service areas. You can still buy this lead, but it's outside your registered trades and regions.`;
    } else if (!isMatchingCategory) {
      outsideMatchMessage = `This job is ${job.category} work, outside your trade categories. You can still buy this lead, but it's outside your registered trades.`;
    } else {
      outsideMatchMessage = `This job is in ${job.region}, outside your service areas. You can still buy this lead, but you'll be working outside your registered regions.`;
    }
  }

  const admin = createAdminClient();

  const { count: paidCount } = await admin
    .from("lead_purchases")
    .select("id", { count: "exact", head: true })
    .eq("job_id", id)
    .eq("status", "paid");

  const { data: ownPurchase } = await admin
    .from("lead_purchases")
    .select("id")
    .eq("job_id", id)
    .eq("tradie_id", user.id)
    .eq("status", "paid")
    .maybeSingle();

  const hasPaid = Boolean(ownPurchase);

  let contact: { contact_name: string; contact_email: string; contact_phone: string | null } | null = null;
  if (isOwner || hasPaid) {
    const { data } = await admin
      .from("job_contacts")
      .select("contact_name, contact_email, contact_phone")
      .eq("job_id", id)
      .maybeSingle();
    contact = data;
  }

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

          <dl className="mt-6 border-t border-line pt-6">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Contact details
            </dt>
            {contact ? (
              <>
                <dd className="mt-2 text-navy-950">{contact.contact_name}</dd>
                <dd className="mt-1 text-navy-950">{contact.contact_email}</dd>
                {contact.contact_phone && (
                  <dd className="mt-1 text-navy-950">{contact.contact_phone}</dd>
                )}
              </>
            ) : (paidCount ?? 0) >= 2 ? (
              <dd className="mt-2 text-sm text-ink-700">
                This lead has already been claimed by 2 tradies.
              </dd>
            ) : (
              <dd className="mt-2">
                <p className="text-sm text-ink-700">
                  Contact details available after purchasing this lead.
                </p>
                {outsideMatchMessage && (
                  <p className="mt-3 rounded-md bg-hivis-500/10 px-4 py-3 text-sm text-navy-950">
                    {outsideMatchMessage}
                  </p>
                )}
                <PurchaseLeadButton jobId={id} />
              </dd>
            )}
          </dl>

          {purchase === "success" && !contact && (
            <p className="mt-6 rounded-md bg-hivis-500/10 px-4 py-3 text-sm text-navy-950">
              Payment received — we&apos;re confirming it now. Refresh in a
              moment to see the contact details.
            </p>
          )}
          {purchase === "cancelled" && (
            <p className="mt-6 rounded-md bg-navy-900/5 px-4 py-3 text-sm text-ink-700">
              Checkout was cancelled — no charge was made.
            </p>
          )}

          <p className="mt-6 text-xs text-ink-500">
            Posted {date} at {time}
          </p>
        </div>
      </div>
    </main>
  );
}
