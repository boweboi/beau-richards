import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Price Your Work Right | NZ Tradie Pricing Guide | TradieMatch",
  description:
    "A practical guide to pricing trade work fairly in New Zealand — cost breakdowns, margin, researching regional rates, and the pricing mistakes that quietly cost tradies money.",
};

export default function PriceYourWorkRightPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/tradie-resources"
          className="text-sm font-medium text-ink-700 hover:text-navy-950"
        >
          ← Back to tradie resources
        </Link>

        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Tradie resources
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Pricing your work right.
        </h1>

        <p className="mt-6 leading-relaxed text-ink-700">
          Underpricing is one of the quiet killers of a trades business —
          it wins jobs in the short term and quietly erodes the business
          in the long term. This guide covers how to break down your
          costs, what a fair margin looks like, how to research what
          other tradies in your region charge, and the pricing mistakes
          that catch tradies out again and again.
        </p>
        <p className="mt-6 leading-relaxed text-ink-700">
          Pricing feels like the most personal, most sensitive number in
          the whole quote — it&apos;s easy to second-guess and easy to shave a
          little off just to feel more confident about winning the job.
          But a business that consistently prices too low doesn&apos;t stay in
          business long, no matter how good the work is. Getting pricing
          right isn&apos;t about charging as much as possible; it&apos;s about
          charging what the work actually costs you to do, plus a margin
          that lets the business keep going.
        </p>

        <section className="mt-12 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Breaking down your costs
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            A price that actually covers your business has three parts.
            Materials — what you&apos;ll spend supplying the job, plus a
            reasonable markup for sourcing and handling them. Labour —
            your time, priced at a rate that reflects your skill and
            experience, not just what you&apos;d accept to avoid an empty
            diary. And overheads — vehicle costs, insurance, tools, ACC
            levies, accounting, and every other cost of running the
            business that isn&apos;t tied to any one job. Tradies who only
            price materials and labour, and forget overheads, are
            effectively subsidising every job out of their own pocket.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            A simple way to check your own pricing: at the end of a job,
            work out what you actually earned per hour once materials and
            overheads are subtracted, not what the invoice total was. Many
            tradies are surprised to find their real hourly return is
            lower than they assumed, especially on jobs with a lot of
            travel, small extras, or unpaid time spent quoting and
            following up.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Margin: why &quot;fair&quot; isn&apos;t the same as &quot;cheap&quot;
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            A fair profit margin isn&apos;t greedy — it&apos;s what keeps your
            business able to invest in better tools, take on staff or
            apprentices, and survive a slow month. Homeowners generally
            respect a tradie who prices fairly and explains their price
            over one who&apos;s simply the cheapest number on the page,
            especially when the quote itself is clear (see our guide on{" "}
            <Link
              href="/tradie-resources/writing-a-winning-quote"
              className="underline hover:no-underline"
            >
              writing a winning quote
            </Link>
            ). Competing purely on being the lowest bidder is a race
            that only ends one way.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            It also helps to remember that margin isn&apos;t just profit
            sitting idle — it&apos;s what pays for the things that make your
            business more resilient. A healthy margin is what lets you
            afford proper insurance, replace a tool the day it breaks
            instead of limping along without it, and take a week off
            without the business grinding to a halt. Tradies who price at
            the bare minimum often end up trapped: unable to invest in
            the business because there&apos;s never any spare margin to invest.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Researching what others charge
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Rates vary significantly by region and by trade in New
            Zealand — what&apos;s a fair hourly rate in a small provincial
            town is often well below what the same work commands in
            Auckland or Wellington. If you&apos;re not sure where you sit,
            talk to other tradies in your trade and region, check your
            trade&apos;s industry association if it publishes rate guidance,
            and pay attention to what similar jobs are actually going
            for on platforms like TradieMatch. Pricing blind — either
            too high or too low — costs you jobs or costs you margin.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Don&apos;t rely on rates from a few years ago, either — material
            costs and wages have moved a lot in recent years across New
            Zealand, and a rate that felt right a couple of years back may
            now be quietly underpricing your work. Set a reminder to
            revisit your rates every six to twelve months rather than
            waiting until cash flow forces the conversation.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Pricing for risk and the unknown
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Not every job is equally predictable. A straightforward,
            well-defined job should cost less than one with real unknowns
            — old wiring behind a wall you can&apos;t see, a foundation that
            might need more work once it&apos;s exposed, access issues you
            won&apos;t know about until you&apos;re on site. Build a reasonable
            buffer into jobs with genuine uncertainty, and say so in the
            quote (for example, pricing as an estimate rather than a
            fixed quote for that portion of the work) rather than
            absorbing the risk silently and hoping it doesn&apos;t bite you.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Homeowners generally accept genuine uncertainty when it&apos;s
            explained honestly — most people understand that you can&apos;t
            know exactly what&apos;s behind a wall until it&apos;s opened up. What
            they don&apos;t accept well is a fixed price that turns out not to
            have been fixed at all, with extra costs appearing after the
            work has started and no prior warning that they might. Naming
            the risk in the quote protects both the relationship and your
            margin at the same time.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Common pricing mistakes
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            The big one is underselling — pricing to win the job today at
            the cost of the business&apos;s health over the year. Close behind:
            forgetting overheads entirely, not accounting for travel time
            on spread-out jobs, quoting a fixed price for genuinely
            uncertain work, and not revisiting your rates as your costs
            rise. Review your pricing periodically rather than setting it
            once and never touching it again.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Another common trap is discounting reflexively whenever a
            homeowner pushes back on price, without checking whether
            there&apos;s actually room to give anything away. If you do want
            to offer a discount, tie it to something concrete — a slightly
            later start date, a slightly reduced scope, payment upfront —
            rather than just shaving the number to make the conversation
            easier. A discount with no reason behind it trains homeowners
            to expect your first number is never your real one.
          </p>
        </section>

        <p className="mt-10 border-t border-line pt-6 text-sm">
          <Link
            href="/tradie-resources/writing-a-winning-quote"
            className="font-semibold text-navy-950 hover:underline"
          >
            Related guide: Writing a winning quote →
          </Link>
        </p>
        <p className="mt-2 text-sm">
          <Link
            href="/tradie-resources/invoices-quotes"
            className="font-semibold text-navy-950 hover:underline"
          >
            Related guide: Invoices and quotes for NZ tradies →
          </Link>
        </p>

        <p className="mt-6 border-t border-line pt-6 text-xs leading-relaxed text-ink-500">
          This guide is general business advice for New Zealand tradies,
          not financial or accounting advice. For advice specific to your
          business and costs, talk to an accountant.
        </p>
      </div>
    </main>
  );
}
