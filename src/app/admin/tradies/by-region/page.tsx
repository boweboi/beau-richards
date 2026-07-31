"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TradeRow = {
  name: string;
  total: number;
  byRegion: Record<string, number>;
};

type ByRegionData = {
  trades: TradeRow[];
  regions: string[];
  totalsByRegion: Record<string, number>;
  grandTotal: number;
};

// Sequential, single-hue ramp (brand navy, light → dark = fewer → more) —
// existing tokens already used elsewhere in the admin/site UI, so no new
// colors are introduced. navy-900 is skipped: validate_palette.js --ordinal
// flags navy-900/navy-950 as too close in lightness (ΔL 0.041, below the
// 0.06 step-visibility floor) to read as distinct steps; the remaining
// four pass cleanly. Bucket 0 (no coverage at all) gets a distinct
// pale-neutral treatment rather than the ramp's lightest step, since a
// true zero is the recruitment gap this table exists to surface.
const BUCKET_STYLES = [
  { bg: "bg-paper-100", text: "text-ink-700" },
  { bg: "bg-navy-600", text: "text-white" },
  { bg: "bg-navy-700", text: "text-white" },
  { bg: "bg-navy-800", text: "text-white" },
  { bg: "bg-navy-950", text: "text-white" },
] as const;

function bucketFor(count: number, maxCount: number): number {
  if (count === 0 || maxCount === 0) return 0;
  const ratio = count / maxCount;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

export default function AdminTradiesByRegionPage() {
  const [data, setData] = useState<ByRegionData | null>(null);

  useEffect(() => {
    fetch("/api/admin/tradies/by-region")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink-500">Loading…</p>
      </main>
    );
  }

  const maxCount = Math.max(
    0,
    ...data.trades.flatMap((trade) => Object.values(trade.byRegion))
  );

  return (
    <main className="min-h-screen bg-paper pb-24">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-paper-0 px-6 py-4">
        <div>
          <Link href="/admin/tradies" className="text-xs font-medium text-ink-500 hover:text-navy-950">
            ← All tradies
          </Link>
          <h1 className="mt-1 font-display text-lg font-semibold text-navy-950">
            Tradies by trade &amp; region
          </h1>
          <p className="text-xs text-ink-500">
            Active tradies only. Darker cells mean more coverage — pale or
            empty cells are where recruitment is thin.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/homeowners"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            Homeowners →
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            ← Site content
          </Link>
        </div>
      </header>

      <div className="mx-auto mt-8 max-w-[1400px] px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-ink-700">
            <span className="font-semibold text-navy-950">{data.grandTotal}</span>{" "}
            active tradie{data.grandTotal === 1 ? "" : "s"} across{" "}
            {data.trades.filter((t) => t.total > 0).length} trade
            {data.trades.filter((t) => t.total > 0).length === 1 ? "" : "s"}.
          </p>

          <div className="flex items-center gap-2 text-xs text-ink-500">
            <span>Fewer</span>
            {BUCKET_STYLES.map((style, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`h-3.5 w-3.5 rounded-sm border border-line ${style.bg}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl bg-paper-0 shadow-sm">
          <table className="text-left text-xs">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-wide text-ink-500">
                <th className="sticky left-0 z-10 bg-paper-0 px-3 py-3 font-medium">
                  Trade
                </th>
                <th className="px-3 py-3 text-right font-medium">Total</th>
                {data.regions.map((region) => (
                  <th key={region} className="whitespace-nowrap px-3 py-3 font-medium">
                    {region}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.trades.map((trade) => (
                <tr key={trade.name} className="border-b border-line last:border-0">
                  <td className="sticky left-0 z-10 whitespace-nowrap bg-paper-0 px-3 py-2 font-medium text-navy-950">
                    {trade.name}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-navy-950">
                    {trade.total}
                  </td>
                  {data.regions.map((region) => {
                    const count = trade.byRegion[region] ?? 0;
                    const style = BUCKET_STYLES[bucketFor(count, maxCount)];
                    return (
                      <td key={region} className="px-1 py-1">
                        <div
                          title={`${trade.name} · ${region}: ${count} tradie${count === 1 ? "" : "s"}`}
                          className={`flex h-8 w-full items-center justify-center rounded-md ${style.bg} ${style.text}`}
                        >
                          {count > 0 ? count : ""}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-line text-[10px] uppercase tracking-wide text-ink-500">
                <td className="sticky left-0 z-10 bg-paper-0 px-3 py-3 font-medium">
                  Total
                </td>
                <td className="px-3 py-3 text-right font-semibold text-navy-950">
                  {data.grandTotal}
                </td>
                {data.regions.map((region) => (
                  <td key={region} className="px-3 py-3 text-center font-semibold text-navy-950">
                    {data.totalsByRegion[region] ?? 0}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="mt-3 text-xs text-ink-500">
          Each cell counts distinct active tradies offering that trade who
          also cover that region. A tradie covering several regions is
          counted once per region cell, but only once in the Total column
          and once in each region&apos;s bottom total — so a row&apos;s
          cells can add up to more than its Total.
        </p>
      </div>
    </main>
  );
}
