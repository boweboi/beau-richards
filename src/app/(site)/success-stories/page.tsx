import Link from "next/link";

export default function SuccessStoriesPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Success stories
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          The first stories are still being written.
        </h1>
        <p className="mt-4 text-ink-700">
          We&apos;ll feature real tradies who&apos;ve grown their business
          through TradieMatch here — once there are jobs to tell stories
          about. We&apos;d rather show you nothing than make something up.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-hivis-500 px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
          >
            Sign up as a tradie
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center rounded-md border border-line px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-navy-950/5"
          >
            Browse jobs
          </Link>
        </div>
      </div>
    </main>
  );
}
