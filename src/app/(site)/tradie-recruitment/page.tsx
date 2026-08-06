import type { Metadata } from "next";
import Link from "next/link";
import CorrugatedPattern from "@/components/CorrugatedPattern";
import { LEAD_PRICE_CENTS_BY_TIMEFRAME } from "@/lib/leadPricing";

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

const STORY_CHECKLIST = [
  "No more overpaying for leads that go nowhere.",
  "Transparent pricing you can see before you commit.",
  "You'll only ever compete with one other tradie per lead.",
  "Built by real tradies, not some corporate suit who's never swung a hammer.",
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

      <section className="bg-paper px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
            Our Story
          </p>
          <h2 className="mt-3 text-center font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
            Built by tradies, for tradies.
          </h2>

          <div className="mt-6 space-y-4 text-ink-700">
            <p>
              We&apos;re Wellington tradies, and we&apos;ve been in the game
              for over twenty five years. We know how hard it is out there
              right now, we&apos;ve seen the ups and the downs firsthand.
            </p>
            <p>
              You work so hard for what you earn, and it feels like
              everyone&apos;s got their hand in your pocket. And let&apos;s
              be honest, most of these platforms are run by some corporate
              suit who&apos;s never done a real day&apos;s work in his life,
              sitting behind a screen working out how to squeeze a bigger
              profit off the backs of tradies, because let&apos;s face it,
              they don&apos;t actually care, they&apos;re just parasites.
            </p>
            <p>
              We know what it&apos;s like coming up in these trades, and
              we&apos;re committed to putting as many resources in your
              hands as we can, because it&apos;s what we wished we had when
              we were starting out. That&apos;s why we&apos;re always adding
              new trade resources, guides, tools, support, whatever helps
              you get ahead. We want to take away as many of those pain
              points as we can by sharing these resources, and it&apos;ll be
              an ongoing effort, we&apos;re never done building for you.
              Because we&apos;re not just building a lead platform,
              we&apos;re building something for the whole trade community.
            </p>
            <p>
              That&apos;s exactly why we built this. TradieMatch is a
              genuine opportunity to get in early with a new Wellington born
              platform, built by tradies, for tradies.
            </p>
          </div>

          <ul className="mt-8 space-y-3">
            {STORY_CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="mt-0.5 h-5 w-5 shrink-0 text-green-600"
                >
                  <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15" />
                  <path
                    d="M6 10.5l2.5 2.5L14 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm text-ink-700">{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 rounded-md bg-hivis-500/10 px-4 py-3 text-sm text-navy-950">
            <strong>
              Sign up today and see the full pricing breakdown for yourself.
            </strong>
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
            className="mt-10 inline-block rounded-lg bg-hivis-500 px-12 py-6 font-display text-xl font-bold text-navy-950 shadow-[0_20px_50px_-15px_rgba(255,106,19,0.6)] transition hover:scale-105 hover:bg-hivis-400 sm:text-2xl"
          >
            Sign Up as a Tradie
          </Link>
        </div>
      </section>
    </main>
  );
}
