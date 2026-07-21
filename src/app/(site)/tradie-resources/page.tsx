import Link from "next/link";
import { TRADIE_RESOURCE_GUIDES as GUIDES } from "@/lib/tradieResourceGuides";

export default function TradieResourcesPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Tradie resources
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Resources for Tradies.
        </h1>
      </div>

      <div className="mx-auto mt-14 max-w-2xl space-y-6">
        {GUIDES.map((guide) => (
          <div key={guide.href} className="rounded-2xl border border-line bg-white p-8">
            <span className="inline-flex items-center rounded-full bg-navy-900/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-navy-700">
              Guide
            </span>
            <h2 className="mt-4 font-display text-xl font-semibold text-navy-950">
              {guide.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              {guide.description}
            </p>
            <Link
              href={guide.href}
              className="mt-4 inline-block text-sm font-semibold text-navy-950 hover:underline"
            >
              Read the full guide →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
