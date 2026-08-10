"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ESTIMATORS, formatNzd, getDefaultInputs, type EstimatorInputs } from "@/lib/estimators";

const GST_RATE = 0.15;

// Takes the slug, not the resolved EstimatorConfig — config.calculate is a
// function, and functions can't cross the server/client prop boundary
// (the page.tsx server component already validated the slug exists before
// rendering this, via the same ESTIMATORS lookup).
export default function EstimatorForm({ slug }: { slug: string }) {
  const config = ESTIMATORS[slug];
  const [inputs, setInputs] = useState<EstimatorInputs>(() => getDefaultInputs(config));
  const result = useMemo(() => config.calculate(inputs), [config, inputs]);

  function setField(key: string, value: number | string | boolean) {
    setInputs((current) => ({ ...current, [key]: value }));
  }

  const hasRange = typeof result.min === "number" && typeof result.max === "number";

  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Link href="/estimators" className="text-sm font-medium text-ink-700 hover:text-navy-950">
          ← All estimators
        </Link>

        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Cost estimator
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
          {config.name}
        </h1>
        <p className="mt-2 text-sm text-ink-500">{config.description}</p>

        <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-5">
            {config.fields.map((field) => (
              <div key={field.key}>
                <label
                  htmlFor={field.key}
                  className="block text-sm font-medium text-ink-700"
                >
                  {field.label}
                  {field.type === "number" && ` (${field.unit})`}
                </label>

                {field.type === "number" && (
                  <input
                    id={field.key}
                    type="number"
                    min={field.min}
                    max={field.max}
                    step={field.step ?? 1}
                    value={Number(inputs[field.key])}
                    onChange={(event) =>
                      setField(field.key, Number(event.target.value) || 0)
                    }
                    className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
                  />
                )}

                {field.type === "select" && (
                  <select
                    id={field.key}
                    value={String(inputs[field.key])}
                    onChange={(event) => setField(field.key, event.target.value)}
                    className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "checkbox" && (
                  <label className="mt-1 flex items-center gap-2 text-sm text-ink-700">
                    <input
                      id={field.key}
                      type="checkbox"
                      checked={Boolean(inputs[field.key])}
                      onChange={(event) => setField(field.key, event.target.checked)}
                      className="accent-navy-950"
                    />
                    Yes
                  </label>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-navy-950 p-6 text-white">
            <p className="text-xs uppercase tracking-wide text-white/60">
              Estimated range
            </p>

            {hasRange ? (
              <>
                <p className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
                  {formatNzd(result.min!)} – {formatNzd(result.max!)}
                </p>
                <p className="mt-1 text-xs text-white/60">
                  + GST — approx. {formatNzd(result.min! * (1 + GST_RATE))} –{" "}
                  {formatNzd(result.max! * (1 + GST_RATE))} incl. GST
                </p>
                {result.breakdown.length > 0 && (
                  <ul className="mt-4 space-y-1 border-t border-white/10 pt-4 text-xs text-white/70">
                    {result.breakdown.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="mt-2 text-sm text-white/80">No reliable ballpark for this one.</p>
            )}

            {result.note && (
              <p className="mt-4 rounded-md bg-hivis-500/10 px-4 py-3 text-xs text-hivis-400">
                {result.note}
              </p>
            )}
          </div>

          <p className="mt-4 text-xs text-ink-500">
            This is a ballpark estimate only, not a quote. Get a quote from a
            tradie for exact pricing on your job.
          </p>

          <Link
            href="/post-a-job"
            className="mt-6 block w-full rounded-md bg-hivis-500 px-4 py-2.5 text-center text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
          >
            Ready to hire? Post a job on TradieMatch →
          </Link>
        </div>
      </div>
    </main>
  );
}
