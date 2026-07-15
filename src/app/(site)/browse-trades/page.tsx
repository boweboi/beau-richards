import Link from "next/link";
import { TRADE_CATEGORIES } from "@/lib/tradeCategories";

export default function BrowseTradesPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Browse trades
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          What do you need done?
        </h1>
        <p className="mt-4 text-ink-700">
          Pick a trade to see the jobs currently posted in that category.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
        {TRADE_CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/jobs?category=${encodeURIComponent(category)}`}
            className="rounded-xl border border-line bg-white p-4 text-center text-sm font-medium text-navy-950 shadow-sm transition hover:border-hivis-500"
          >
            {category}
          </Link>
        ))}
      </div>
    </main>
  );
}
