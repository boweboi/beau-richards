"use client";

import { useState } from "react";
import CorrugatedPattern from "./CorrugatedPattern";

type Audience = "homeowner" | "tradie";

const STEPS: Record<Audience, { number: string; title: string; description: string }[]> = {
  homeowner: [
    {
      number: "01",
      title: "Post your job",
      description: "Describe what you need done — it's free.",
    },
    {
      number: "02",
      title: "Get quotes",
      description: "Verified tradies in your area respond.",
    },
    {
      number: "03",
      title: "Compare & hire",
      description: "Pick the tradie that suits you.",
    },
    {
      number: "04",
      title: "Get it done",
      description: "Job completed — leave a review.",
    },
  ],
  tradie: [
    {
      number: "01",
      title: "Sign up",
      description: "Create your tradie profile.",
    },
    {
      number: "02",
      title: "Browse jobs",
      description: "Find work in your region and trade.",
    },
    {
      number: "03",
      title: "Send a quote",
      description: "Respond to jobs that suit you.",
    },
    {
      number: "04",
      title: "Get hired & paid",
      description: "Win the work, build your reputation.",
    },
  ],
};

const CTA: Record<Audience, { heading: string; body: string; label: string; href: string }> = {
  homeowner: {
    heading: "Got a job that needs doing?",
    body: "Post it today and start hearing back from local tradies within hours.",
    label: "Post a job — it's free",
    href: "/post-a-job",
  },
  tradie: {
    heading: "Ready to start winning jobs?",
    body: "Sign up and start browsing jobs that match your trade and region.",
    label: "Sign up as a tradie",
    href: "/signup",
  },
};

export default function HowItWorks() {
  const [audience, setAudience] = useState<Audience>("homeowner");
  const steps = STEPS[audience];
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
              Four steps from job to done.
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

        <ol className="mt-14 grid gap-8 sm:grid-cols-4 sm:gap-6">
          {steps.map((step, index) => (
            <li key={step.number} className="relative">
              <div className="flex items-center gap-4 sm:block">
                <span className="font-display text-4xl font-semibold text-navy-900/15 sm:text-5xl">
                  {step.number}
                </span>
                <h3 className="font-display text-xl font-semibold text-navy-950 sm:mt-4">
                  {step.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute right-[-1.5rem] top-2 hidden h-px w-8 bg-line sm:block"
                />
              )}
            </li>
          ))}
        </ol>
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
