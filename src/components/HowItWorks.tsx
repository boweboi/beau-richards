"use client";

import { useState } from "react";
import CorrugatedPattern from "./CorrugatedPattern";

type Audience = "homeowner" | "tradie";

const FLOWS: Record<Audience, string> = {
  homeowner:
    "Sign up, post your job, and verified tradies in your region will browse it, reach out to discuss and view the project, and send you a quote — then you choose which tradie to hire.",
  tradie:
    "Sign up and create your profile, browse jobs in your region, reach out to homeowners to discuss and view the project, submit a quote, and once you're hired, build your reputation through reviews.",
};

const CTA: Record<Audience, { heading: string; body: string; label: string; href: string }> = {
  homeowner: {
    heading: "Ready to get your job done right?",
    body: "Skip the cold calls and guesswork. All our tradies are independently verified by us. Post your job once, get quotes from qualified professionals who match your needs, and hire with confidence. See ratings from real customers who've used them before. No more chasing callbacks or wondering if you're getting a fair price. Sign up and post your job today.",
    label: "Sign up. It's free",
    href: "/post-a-job",
  },
  tradie: {
    heading: "Ready to start winning jobs?",
    body: "For urgent repairs, first to quote often wins. For planned work, your professionalism and price matter most. Your return on investment could be 100 to 500 times the cost of unlocking a lead. At just $20 per lead, that's the price of three cups of coffee. You're positioned to win jobs worth thousands. Sign up and start browsing jobs that match your trade and region.",
    label: "Sign up as a tradie",
    href: "/signup",
  },
};

export default function HowItWorks() {
  const [audience, setAudience] = useState<Audience>("homeowner");
  const flow = FLOWS[audience];
  const cta = CTA[audience];

  return (
    <section id="how-it-works" className="relative bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
              The process
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
              How it works.
            </h2>
          </div>

          <div className="inline-flex shrink-0 rounded-md border border-line bg-white p-1">
            <button
              type="button"
              aria-pressed={audience === "homeowner"}
              onClick={() => setAudience("homeowner")}
              className={`rounded px-4 py-2 text-sm font-semibold transition ${
                audience === "homeowner"
                  ? "bg-navy-950 text-white"
                  : "text-ink-700 hover:text-navy-950"
              }`}
            >
              I&apos;m a homeowner
            </button>
            <button
              type="button"
              aria-pressed={audience === "tradie"}
              onClick={() => setAudience("tradie")}
              className={`rounded px-4 py-2 text-sm font-semibold transition ${
                audience === "tradie"
                  ? "bg-navy-950 text-white"
                  : "text-ink-700 hover:text-navy-950"
              }`}
            >
              I&apos;m a tradie
            </button>
          </div>
        </div>

        <p className="mt-14 max-w-3xl font-display text-2xl font-medium leading-relaxed text-navy-950 sm:text-3xl">
          {flow}
        </p>
      </div>

      <div className="relative mt-20 overflow-hidden rounded-2xl bg-navy-950 py-14">
        <CorrugatedPattern
          id="how-it-works-corrugation"
          className="pointer-events-none absolute inset-0 h-full w-full"
          color="#ffffff"
          opacity={0.06}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              {cta.heading}
            </h3>
            <p className="mt-2 max-w-md text-white/70">{cta.body}</p>
          </div>
          <a
            href={cta.href}
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-hivis-500 px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
          >
            {cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
