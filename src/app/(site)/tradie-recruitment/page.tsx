import type { Metadata } from "next";
import Link from "next/link";
import CorrugatedPattern from "@/components/CorrugatedPattern";
import { LEAD_PRICE_CENTS_BY_TIMEFRAME } from "@/lib/leadPricing";
import { TOOLKIT_FUND_TARGET } from "@/lib/toolkitFund";
import { DOLLARS_PER_TREE } from "@/lib/environmentalFund";

export const metadata: Metadata = {
  title: "Join as a Tradie | TradieMatch",
  description:
    "Get qualified leads in your area. Pay per lead, browse jobs by trade and region, set your own rates. No subscriptions, no contracts.",
  robots: { index: true, follow: true },
};

function formatLeadPrice(cents: number) {
  return `$${Math.round(cents / 100)}`;
}

const BENEFITS = [
  {
    title: "Pay Per Lead Only",
    description:
      "No monthly fees or token packs. You only pay when you buy a lead you actually want.",
  },
  {
    title: "Browse and Choose",
    description:
      "Filter jobs by your trade category and service regions. You're in control of what you bid on.",
  },
  {
    title: "Set Your Own Rates",
    description:
      "You decide your pricing. Quote in person, negotiate directly with homeowners. No platform markups.",
  },
];

const STEPS = [
  {
    number: "1",
    title: "Sign Up",
    description:
      "Create your tradie profile in minutes. Verify your email, add your trade categories and service areas.",
  },
  {
    number: "2",
    title: "Browse Jobs",
    description:
      "See all available jobs matching your trade and location. Save favourites to your watchlist.",
  },
  {
    number: "3",
    title: "Buy and Quote",
    description: `Buy a lead from ${formatLeadPrice(Math.min(...Object.values(LEAD_PRICE_CENTS_BY_TIMEFRAME)))}. Call the homeowner, quote in person, win the job.`,
  },
];

const FAQS = [
  {
    question: "How much does it cost?",
    answer: (
      <>
        No subscription, no monthly fee. Every job falls into one of
        three timeframes based on how urgent the homeowner is: Urgent
        (they need it done as soon as possible), Flexible (they want it
        done, but there&apos;s no rush), or Quotes (they&apos;re
        gathering quotes and exploring options). Pricing starts from{" "}
        {formatLeadPrice(Math.min(...Object.values(LEAD_PRICE_CENTS_BY_TIMEFRAME)))}{" "}
        per lead — see the full pricing breakdown when you sign up.
      </>
    ),
  },
  {
    question: "How do leads work?",
    answer: (
      <>
        Browse jobs that match your trade and service areas, then buy the
        ones you want to quote on. Buying a lead unlocks the homeowner&apos;s
        contact details so you can call them directly. Every lead is capped
        at 2 tradies, max — once 2 tradies have bought it, it&apos;s closed
        to further purchases, so you&apos;re never competing with a crowd.
      </>
    ),
  },
  {
    question: "How does verification work?",
    answer: (
      <>
        Every tradie moves through three tiers as we confirm more about
        them — Bronze (email and phone verified, plus qualifications for
        regulated trades), Silver (NZBN verified with 3+ customer reviews),
        and Gold (10+ reviews). Homeowners see your badge before they even
        request a quote. Read more on{" "}
        <Link href="/trust" className="font-medium text-navy-950 underline">
          trust &amp; verification
        </Link>
        .
      </>
    ),
  },
  {
    question: "What's the apprenticeship fund?",
    answer: (
      <>
        $1 from every lead purchased goes into our apprenticeship toolkit
        fund. Once it reaches {`$${TOOLKIT_FUND_TARGET.toLocaleString("en-NZ")}`}, we buy
        a professional-grade toolkit and donate it to a young apprentice
        starting their trade career.{" "}
        <Link
          href="/apprenticeship-fund"
          className="font-medium text-navy-950 underline"
        >
          Learn more
        </Link>
        .
      </>
    ),
  },
  {
    question: "What's the environmental fund?",
    answer: (
      <>
        Another $1 from every lead goes toward native tree planting in
        Aotearoā — ${DOLLARS_PER_TREE} raised funds one tree. It&apos;s part
        of practising kaitiakitanga, the Māori principle of guardianship
        over the land.{" "}
        <Link
          href="/environmental-impact"
          className="font-medium text-navy-950 underline"
        >
          See the live counter
        </Link>
        .
      </>
    ),
  },
  {
    question: "What makes TradieMatch different?",
    answer:
      "We're not a subscription service and we don't stack ten tradies onto the same lead — every job is capped at 2 buyers. Every tradie is verified before homeowners see them, and part of every lead you buy goes straight back into the trade: funding apprentice toolkits and native tree planting. Built by Kiwis, for Kiwis in the trades.",
  },
];

export default function TradieRecruitmentPage() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-navy-950 px-4 py-16 text-center sm:py-20">
        <CorrugatedPattern
          id="tradie-recruitment-hero-corrugation"
          className="pointer-events-none absolute inset-0 h-full w-full"
          color="#ffffff"
          opacity={0.05}
        />

        <div className="relative mx-auto max-w-2xl">
          <div className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] sm:max-w-sm">
            {/* Silent hero footage — text captions are burned in
                server-side, not a WebVTT track. */}
            <video
              className="aspect-[9/16] w-full bg-navy-900 object-cover opacity-50"
              src="/videos/tradie-recruitment-hero.mp4"
              poster="/videos/tradie-recruitment-hero-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>

          <h1 className="mt-8 font-display text-3xl font-semibold text-white sm:text-4xl">
            Get Qualified Leads in Your Area
          </h1>
          <p className="mt-4 text-white/70">
            Browse jobs matching your trade, pay only for the leads you buy,
            set your own rates. No subscriptions, no contracts.
          </p>
        </div>
      </section>

      <section className="bg-paper-0 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-line bg-white p-6 text-left shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="block h-1 w-10 rounded-full bg-hivis-500"
                />
                <h2 className="mt-4 font-display text-lg font-semibold text-navy-950">
                  {benefit.title}
                </h2>
                <p className="mt-2 text-sm text-ink-700">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
              How it works
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
              Three steps to your next job.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-xl border border-line bg-white p-6 text-left shadow-sm"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-950 font-display text-sm font-semibold text-hivis-500">
                  {step.number}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-navy-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-ink-700">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper-0 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
            FAQ
          </p>
          <h2 className="mt-3 text-center font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
            Questions tradies ask us.
          </h2>

          <div className="mt-10 divide-y divide-line border-y border-line">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-navy-950 marker:content-none">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xl leading-none text-hivis-500 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-ink-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-950 px-4 py-16 text-center sm:py-20">
        <CorrugatedPattern
          id="tradie-recruitment-cta-corrugation"
          className="pointer-events-none absolute inset-0 h-full w-full"
          color="#ffffff"
          opacity={0.05}
        />
        <div className="relative mx-auto max-w-xl">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Ready to start winning jobs?
          </h2>
          <p className="mt-3 text-white/70">
            Create your free profile and start browsing leads in your area
            today.
          </p>
          <Link
            href="/signup?role=tradie"
            className="mt-8 inline-block rounded-md bg-hivis-500 px-8 py-4 text-base font-semibold text-navy-950 transition hover:bg-hivis-400"
          >
            Sign Up as a Tradie
          </Link>
        </div>
      </section>
    </main>
  );
}
