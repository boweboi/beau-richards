import type { Metadata } from "next";
import Link from "next/link";
import CorrugatedPattern from "@/components/CorrugatedPattern";

export const metadata: Metadata = {
  title: "Post your job free | TradieMatch",
  description:
    "Post your job once and local Wellington tradies come to you. No ringing around, no chasing, no dead ends.",
  robots: { index: true, follow: true },
};

const BENEFITS = [
  {
    title: "Post your job once",
    description:
      "Describe your job in detail. Local tradies who do that work see it and get in touch. No more leaving voicemails that never get returned.",
  },
  {
    title: "Real local Wellington tradies",
    description:
      "No call centre, just real tradespeople working in your area, ready to quote your job.",
  },
  {
    title: "Free for homeowners",
    description:
      "Posting a job costs you nothing. Compare quotes, ask questions, and choose the tradie that's right for you.",
  },
];

const STEPS = [
  {
    number: "1",
    title: "Post your job",
    description:
      "Tell us what you need done and where. Takes a couple of minutes.",
  },
  {
    number: "2",
    title: "Local tradies get in touch",
    description:
      "Tradies who cover your area and your type of work reach out to discuss the job and quote it.",
  },
  {
    number: "3",
    title: "Compare and choose",
    description:
      "Weigh up your quotes, pick the tradie you're comfortable with, and get the job done.",
  },
];

const FAQS = [
  {
    question: "Is it really free for homeowners?",
    answer:
      "Yes. Posting a job and receiving quotes costs you nothing. There's no cost to you at any point.",
  },
  {
    question: "Can I talk to tradies before hiring?",
    answer:
      "Absolutely. Interested tradies contact you directly to talk through the job and quote it in person. You're never locked in — only go ahead with the tradie you're happy with.",
  },
  {
    question: "How quickly will I hear back?",
    answer:
      "It depends on your job and how many local tradies cover that trade. Once your job's posted, tradies in your area can see it straight away.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "We're focused on the Wellington region right now — real local tradies for local jobs.",
  },
  {
    question: "What if I don't get any quotes?",
    answer:
      "It costs you nothing to try, so there's no risk. If your trade is one we're still building numbers in, feel free to check back as more tradies join.",
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
            Need a tradie in Wellington?
          </h1>
          <p className="mt-4 text-white/70">
            Post your job once and local tradies come to you. No ringing around, no chasing, no dead ends.
          </p>
          <Link
            href="/signup?role=homeowner"
            className="mt-10 inline-block rounded-lg bg-hivis-500 px-12 py-6 font-display text-xl font-bold text-navy-950 shadow-[0_20px_50px_-15px_rgba(255,106,19,0.6)] transition hover:scale-105 hover:bg-hivis-400 sm:text-2xl"
          >
            Post your job — it's free
          </Link>
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
              Three simple steps.
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
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            More than just a job board
          </h2>
          <p className="mt-4 text-white/70">
            Every job posted on TradieMatch gives something back. Two dollars from each lead splits evenly between two community funds: one dollar into our apprenticeship toolkit fund, and one dollar toward planting native trees here in Aotearoā. Kaitiakitanga (guardianship of the land), looking after the land we all share. So when you find your tradie, you're also backing the next generation of tradies.
          </p>
          <Link
            href="/signup?role=homeowner"
            className="mt-10 inline-block rounded-lg bg-hivis-500 px-12 py-6 font-display text-xl font-bold text-navy-950 shadow-[0_20px_50px_-15px_rgba(255,106,19,0.6)] transition hover:scale-105 hover:bg-hivis-400 sm:text-2xl"
          >
            Post your job — it's free
          </Link>
        </div>
      </section>
    </main>
  );
}
