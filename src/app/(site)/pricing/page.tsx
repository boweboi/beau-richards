import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Pricing
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Simple, fair pricing.
        </h1>
        <p className="mt-4 text-ink-700">
          Homeowners never pay a cent. Tradies only pay for the leads they
          choose to respond to.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-8">
          <span className="inline-flex items-center rounded-full bg-navy-900/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-navy-700">
            Homeowners
          </span>
          <p className="mt-4 font-display text-4xl font-semibold text-navy-950">
            Free
          </p>
          <p className="mt-1 text-sm text-ink-500">
            Always free to post a job.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ink-700">
            <li>Post as many jobs as you need</li>
            <li>Get quotes from verified local tradies</li>
            <li>No fees, no commissions, ever</li>
          </ul>
          <Link
            href="/post-a-job"
            className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-900"
          >
            Post a job — it&apos;s free
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-950 p-8 text-white">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-hivis-400">
            Tradies
          </span>
          <p className="mt-4 font-display text-4xl font-semibold">
            $15{" "}
            <span className="text-lg font-normal text-white/60">
              / lead
            </span>
          </p>
          <p className="mt-1 text-sm text-white/60">
            Pay only when you respond to a job.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-white/80">
            <li>Browse every job for free</li>
            <li>No monthly fees or subscriptions</li>
            <li>$15 flat, per lead, whenever you choose to respond</li>
          </ul>
          <Link
            href="/signup"
            className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-hivis-500 px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
          >
            Sign up as a tradie
          </Link>
        </div>
      </div>
    </main>
  );
}
