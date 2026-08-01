import type { Metadata } from "next";
import Link from "next/link";
import CorrugatedPattern from "@/components/CorrugatedPattern";

export const metadata: Metadata = {
  title: "Post a Job Free | TradieMatch",
  description:
    "Post a job, get matched with verified tradies in your area, compare quotes, and choose who you trust. Free for homeowners.",
  robots: { index: true, follow: true },
};

const BENEFITS = [
  {
    title: "Verified Tradies Only",
    description:
      "All tradies are verified and reviewed by real homeowners. Check ratings and reviews before you choose.",
  },
  {
    title: "No Upfront Costs",
    description:
      "Posting a job is free. Get quotes, compare, and only pay when you hire.",
  },
  {
    title: "Local and Fast",
    description:
      "Get matched with tradies in your area who can start soon. Browse their availability and experience.",
  },
];

const STEPS = [
  {
    number: "1",
    title: "Post a Job",
    description:
      "Tell us what needs doing, where, and when. Include a detailed description.",
  },
  {
    number: "2",
    title: "Get Matched",
    description:
      "Verified tradies matching your job will respond with a quote. Up to two tradies can take on your job at a time, so you get real options without your inbox getting flooded.",
  },
  {
    number: "3",
    title: "Choose Your Tradie",
    description:
      "Compare quotes, check ratings, and mark the tradie you trust as hired.",
  },
];

const FAQS = [
  {
    question: "How much does it cost?",
    answer: (
      <>
        Posting a job and receiving quotes is completely free for
        homeowners.
      </>
    ),
  },
  {
    question: "How long does it take to get quotes?",
    answer: (
      <>
        It depends on how urgent you say the job is. Urgent jobs tend to
        get a response fastest, since the tradies who buy them are
        motivated to act quickly — jobs marked Flexible or Quotes may
        take a little longer to hear back on.
      </>
    ),
  },
  {
    question: "Can I message tradies before hiring?",
    answer: (
      <>
        There&apos;s no in-app chat. Once you post a job, matching
        tradies will contact you directly by phone or email to discuss
        the work and give you a quote.
      </>
    ),
  },
  {
    question: "What if I'm not happy with the quote?",
    answer: (
      <>
        You&apos;re never obligated to hire anyone. Every job is capped
        at 2 tradies, so you can compare both quotes and only mark
        someone as hired once you&apos;re happy with their price and
        approach.
      </>
    ),
  },
  {
    question: "How do I know tradies are verified?",
    answer: (
      <>
        Every tradie moves through Bronze, Silver, and Gold verification
        tiers as we confirm their email, NZBN, and review history from
        real homeowners. You&apos;ll see their badge on their profile
        before you decide who to work with. Read more on{" "}
        <Link href="/trust" className="font-medium text-navy-950 underline">
          trust &amp; verification
        </Link>
        .
      </>
    ),
  },
  {
    question: "What happens after I book a tradie?",
    answer: (
      <>
        Once you&apos;ve agreed on a price, mark them as hired from your
        dashboard. After the work&apos;s done, you can leave a review to
        help other homeowners choose with confidence.
      </>
    ),
  },
];

export default function HomeownerRecruitmentPage() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-navy-950 px-4 py-16 text-center sm:py-20">
        <CorrugatedPattern
          id="homeowner-recruitment-hero-corrugation"
          className="pointer-events-none absolute inset-0 h-full w-full"
          color="#ffffff"
          opacity={0.05}
        />

        <div className="relative mx-auto max-w-2xl">
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Get Multiple Quotes from Local Tradies
          </h1>
          <p className="mt-4 text-white/70">
            Post a job, get matched with verified tradies in your area,
            compare quotes, choose who you trust.
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
              Three steps to your next job done.
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
            Questions homeowners ask us.
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
          id="homeowner-recruitment-cta-corrugation"
          className="pointer-events-none absolute inset-0 h-full w-full"
          color="#ffffff"
          opacity={0.05}
        />
        <div className="relative mx-auto max-w-xl">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Ready to get your job done?
          </h2>
          <p className="mt-3 text-white/70">
            Post your job free and start comparing quotes from verified
            tradies in your area today.
          </p>
          <Link
            href="/signup?role=homeowner"
            className="mt-8 inline-block rounded-md bg-hivis-500 px-8 py-4 text-base font-semibold text-navy-950 transition hover:bg-hivis-400"
          >
            Post a Job Free
          </Link>
        </div>
      </section>
    </main>
  );
}
