import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Write a Winning Quote | TradieMatch",
  description:
    "How to structure and price a quote that wins jobs for New Zealand tradies — what to include, what to leave out, and the mistakes that lose work.",
};

export default function WritingAWinningQuotePage() {
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
          How to write a quote that wins the job.
        </h1>

        <p className="mt-6 leading-relaxed text-ink-700">
          A winning quote isn&apos;t necessarily the cheapest one — it&apos;s the one
          that&apos;s clearest about what&apos;s on offer and easiest for a
          homeowner to say yes to. This guide covers how to structure a
          quote, what to include, how to price it so it reads well, and
          the common mistakes that quietly cost tradies jobs they should
          have won.
        </p>
        <p className="mt-6 leading-relaxed text-ink-700">
          Most tradies are good at the trade and self-taught at the
          paperwork, which is fair enough — nobody goes into plumbing or
          building to become a copywriter. But a quote is a piece of
          business writing with real money attached to it, and a little
          structure goes a long way. None of what follows requires
          software or design skill — just a consistent format you use
          every time, so a homeowner reading it knows exactly where to
          look for what they need.
        </p>

        <section className="mt-12 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Structure: what a good quote covers
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Keep it clean and predictable. A homeowner reading multiple
            quotes shouldn&apos;t have to hunt for the basics. Cover: what work
            you&apos;re doing (the scope), materials if they&apos;re relevant to
            show, your total price, your proposed start date, roughly how
            long the job will take, and your payment terms. That&apos;s it —
            resist the urge to pad it out with anything that doesn&apos;t help
            the homeowner decide.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Homeowners are mostly focused on two things: the total cost,
            and when you can start. Make sure both are impossible to miss
            — don&apos;t bury the price in a paragraph or leave the start date
            vague (&quot;soon,&quot; &quot;when I get a chance&quot;) if you can help it.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            A consistent order also helps you personally — once you&apos;ve got
            a template that covers all of the above, writing the next
            quote is mostly filling in the blanks rather than starting
            from a blank page each time. That speed matters, since a fast
            quote is often a winning quote regardless of how it&apos;s priced.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Pricing psychology: itemised vs. lump sum
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            An itemised quote — broken into labour, materials, and any
            distinct stages of work — tends to build more trust than a
            single lump-sum figure, even when the total is identical.
            Breaking the price down shows your working, which makes the
            number feel considered rather than plucked out of the air. It
            also makes it much easier to agree on changes later, since you
            can adjust one line rather than renegotiating the whole quote.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            That said, don&apos;t over-itemise a small job — three line items
            for a two-hour job looks like padding, not transparency. Match
            the level of detail to the size of the job.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            For bigger jobs, consider breaking the total into stages —
            deposit, progress payment, final payment tied to milestones
            like completion of the rough-in or the final fix. This does
            two things at once: it reassures the homeowner that they&apos;re
            not handing over the full amount up front for work that
            hasn&apos;t happened yet, and it protects your own cash flow on a
            longer job by spreading payment across the timeline rather
            than waiting until the very end to get paid for weeks of work.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            What to include — and what to leave out
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Include anything that affects the price or the outcome: the
            scope of work, materials (brand or grade if it matters),
            total price, GST treatment if you&apos;re registered, how long the
            quote is valid for, deposit and payment terms, and your
            contact details. Leave out generic filler — boilerplate
            paragraphs about &quot;quality workmanship&quot; don&apos;t help a homeowner
            decide and just make the important information harder to find.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            If there&apos;s anything you&apos;re deliberately excluding — say,
            you&apos;re not responsible for repainting after a plumbing repair
            — say so explicitly. An assumption you didn&apos;t write down is an
            assumption the homeowner doesn&apos;t know you made.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            It&apos;s worth thinking about exclusions the same way you think
            about inclusions — as information the homeowner needs, not as
            small print to protect yourself. &quot;Excludes scaffolding hire,
            which we&apos;ll arrange separately if needed&quot; reads as helpful
            and upfront. The same fact discovered halfway through the job,
            with no warning, reads as a tradie trying to squeeze in an
            extra charge — even when it was always going to be necessary.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Common mistakes that lose jobs
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            The most common one is vagueness — a single number with no
            explanation of what it covers. Close behind is being slow: a
            detailed quote that arrives four days later often loses to a
            mediocre one that arrived within the hour, simply because the
            homeowner has already moved on. Other frequent mistakes:
            leaving out a start date, forgetting to state how long the
            quote is valid before prices might change, and not making it
            obvious how to accept the quote and get the job underway.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Another mistake worth naming: sending the same generic quote
            regardless of who&apos;s asking. It&apos;s tempting when you&apos;re busy to
            reuse a near-identical quote for every similar job, but
            homeowners can usually tell when a quote hasn&apos;t actually been
            written for their specific job — a wrong address, a leftover
            reference to a different type of work, or details that don&apos;t
            quite match what they asked for. Even a quick personal touch,
            like referencing something specific from their job post,
            signals that you actually read what they need.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Following up on a quote you&apos;ve sent
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Sending the quote isn&apos;t the end of the process. Homeowners are
            often weighing up two or three quotes at once and can go quiet
            simply because they&apos;re still deciding, not because they&apos;ve
            ruled you out. A short, friendly check-in a few days after
            sending a quote can recover jobs that would otherwise be lost
            to silence rather than an actual no — worth doing on anything
            you were genuinely hoping to win.
          </p>
        </section>

        <p className="mt-10 border-t border-line pt-6 text-sm">
          <Link
            href="/tradie-resources/why-your-quote-matters"
            className="font-semibold text-navy-950 hover:underline"
          >
            Related guide: Why your quote matters →
          </Link>
        </p>
        <p className="mt-2 text-sm">
          <Link
            href="/tradie-resources/price-your-work-right"
            className="font-semibold text-navy-950 hover:underline"
          >
            Related guide: Pricing your work right →
          </Link>
        </p>

        <p className="mt-6 border-t border-line pt-6 text-xs leading-relaxed text-ink-500">
          This guide is general business advice for New Zealand tradies,
          not professional or legal advice. For guidance on compliant NZ
          tax invoices and GST, see our invoices and quotes guide.
        </p>
      </div>
    </main>
  );
}
