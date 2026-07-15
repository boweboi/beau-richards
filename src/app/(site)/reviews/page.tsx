import Link from "next/link";

export default function ReviewsPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Reviews
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          We&apos;re just getting started.
        </h1>
        <p className="mt-4 text-ink-700">
          Reviews will appear here once homeowners begin rating completed
          jobs. We&apos;d rather show you nothing than make something up —
          check back soon.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/post-a-job"
            className="inline-flex items-center justify-center rounded-md bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-900"
          >
            Post a job — it&apos;s free
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md border border-line px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-navy-950/5"
          >
            Sign up as a tradie
          </Link>
        </div>
      </div>
    </main>
  );
}
