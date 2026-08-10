import type { Metadata } from "next";
import Link from "next/link";
import { getEstimatorsByCategory } from "@/lib/estimators";

export const metadata: Metadata = {
  title: "Cost Estimators | Ballpark NZ Trade Prices | TradieMatch",
  description:
    "Get a rough NZ price range for decks, renovations, roofing, and more before you post a job and get real quotes from tradies.",
};

export default function EstimatorsLandingPage() {
  const groups = getEstimatorsByCategory();

  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
            Cost estimators
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
            Get a ballpark price before you post a job.
          </h1>
          <p className="mt-4 text-ink-700">
            Pick a job type below and answer a few quick questions to see a
            rough NZ price range. These are estimates only — post a job to
            get real quotes from local tradies.
          </p>
        </div>

        {groups.map(({ category, estimators }) => (
          <section key={category} className="mt-12">
            <h2 className="font-display text-lg font-semibold text-navy-950">
              {category}
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {estimators.map((estimator) => (
                <Link
                  key={estimator.slug}
                  href={`/estimators/${estimator.slug}`}
                  className="rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-hivis-500"
                >
                  <h3 className="font-semibold text-navy-950">{estimator.name}</h3>
                  <p className="mt-1 text-sm text-ink-500">{estimator.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-16 rounded-2xl border border-line bg-navy-950 p-8 text-center">
          <h2 className="font-display text-xl font-semibold text-white">
            Ready for a real quote?
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Post your job and hear directly from verified local tradies.
          </p>
          <Link
            href="/post-a-job"
            className="mt-4 inline-block rounded-md bg-hivis-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
          >
            Post a job →
          </Link>
        </div>
      </div>
    </main>
  );
}
