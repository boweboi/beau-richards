import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Getting Paid: A Guide for NZ Tradies | TradieMatch",
  description:
    "How NZ tradies get paid fairly and on time — contracts, deposits, progress payments, invoicing, and your rights under the Construction Contracts Act.",
};

export default function GettingPaidPage() {
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
          Getting paid: a practical guide for NZ tradies.
        </h1>

        <p className="mt-6 leading-relaxed text-ink-700">
          Doing good work is only half the job — getting paid fairly and on
          time for it is the other half, and it&apos;s the half that keeps
          your business actually running. Cash flow problems sink small
          trades businesses far more often than a shortage of work does,
          and most of it comes down to the same handful of gaps: nothing
          in writing, no deposit, invoices sent late, and follow-up that
          never happens.
        </p>
        <p className="mt-6 leading-relaxed text-ink-700">
          None of this is complicated once it&apos;s a habit. This guide walks
          through getting the paperwork right before you start, taking a
          deposit and progress payments so you&apos;re never too exposed on a
          job, invoicing promptly, chasing overdue money early, and what
          your options are — Disputes Tribunal, Construction Contracts Act
          — if a homeowner simply won&apos;t pay.
        </p>

        <section className="mt-12 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Get it in writing
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Every job should follow the same paper trail:{" "}
            <strong className="font-semibold text-navy-950">
              a quote first
            </strong>
            , setting out the scope and price;{" "}
            <strong className="font-semibold text-navy-950">
              client acceptance
            </strong>{" "}
            in writing — an email reply, a signed copy, or a clear text
            message confirming they want you to go ahead; then, for
            anything beyond a small job,{" "}
            <strong className="font-semibold text-navy-950">
              a contract
            </strong>{" "}
            that formalises the terms — price, payment stages, timeframe,
            and what happens if either side wants to make changes along
            the way.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            For smaller jobs, an accepted quote plus a page of written
            terms is usually enough to protect both sides. But it&apos;s worth
            knowing the line isn&apos;t just good practice — it&apos;s the law.
          </p>
          <p className="mt-3 rounded-md border border-line bg-navy-900/5 px-4 py-3 text-sm font-medium text-navy-950">
            Under the Building Act 2004, residential building work priced
            at $30,000 or more (including GST) legally requires a written
            contract. Say you&apos;re quoting a $35,000 bathroom-to-kitchen
            reno in Khandallah — a written contract isn&apos;t optional there,
            it&apos;s a legal requirement, regardless of how well you know the
            client.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Take a deposit upfront
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            A deposit before you start covers your materials cost and
            shows the client is genuinely committed — not just collecting
            quotes to compare. It also protects you from being left out of
            pocket if a job falls through after you&apos;ve already ordered
            supplies or turned down other work to fit them in. A standard
            deposit sits somewhere between 10% and 40% of the job total,
            depending on how materials-heavy the work is and how long the
            job will run for.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Use progress payments on larger jobs
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            For anything that runs over a few weeks, don&apos;t wait until the
            very end to get paid. Break the job into agreed stages —
            deposit, framing or rough-in complete, lock-up, final
            completion is a common structure — and invoice at each one.
            This keeps the amount of money you&apos;ve got tied up in
            materials and labour at any given point manageable, and it
            means a dispute late in the job is over one stage of payment,
            not the whole contract.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Invoice promptly and clearly
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Send the invoice as soon as the stage or job is done — same
            day if you can manage it. The longer an invoice sits unsent,
            the easier it is for the client to forget the work was even
            finished, and the more likely they are to query it when it
            finally does turn up. Make sure it&apos;s clear: what was done,
            the amount owing, when payment is due, and your bank account
            details right there on the page so there&apos;s no back-and-forth
            just to pay you. (For what has to legally appear on a
            compliant NZ tax invoice, see our{" "}
            <Link
              href="/tradie-resources/invoices-quotes"
              className="font-semibold text-navy-950 hover:underline"
            >
              invoices and quotes guide
            </Link>
            .)
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Follow up overdue invoices early
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            The moment an invoice goes past its due date, send a short,
            friendly reminder — most late payments are a busy client who
            forgot, not a refusal to pay, and a quick nudge sorts it out.
            Don&apos;t let it drift for weeks hoping it&apos;ll sort itself out; the
            longer unpaid money sits, the harder it gets to recover and
            the more awkward the conversation becomes. If a polite
            reminder or two doesn&apos;t get a response, follow up with a
            firmer written notice before you consider the options below.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            When it goes wrong
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            If a client simply won&apos;t pay, you&apos;ve got real options. The{" "}
            <strong className="font-semibold text-navy-950">
              Disputes Tribunal
            </strong>{" "}
            handles claims up to $30,000 — it&apos;s quick, informal, doesn&apos;t
            need a lawyer, and is designed for exactly this kind of
            dispute between a tradie and a homeowner.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            You&apos;ve also got rights under the{" "}
            <strong className="font-semibold text-navy-950">
              Construction Contracts Act 2002
            </strong>
            , which sets out a formal payment claims and payment schedules
            process, a fast adjudication route for resolving disputes, and
            — importantly — the right to suspend work on a job if you
            haven&apos;t been paid what you&apos;re legally owed. Knowing this
            process exists, and that it&apos;s there to protect you
            specifically, is often enough on its own to get a stalled
            payment moving again.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Resources
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            A few places worth bookmarking before you need them:
          </p>
          <ul className="mt-4 space-y-4 text-sm">
            <li>
              <a
                href="https://www.building.govt.nz/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-navy-950 hover:underline"
              >
                Building Performance — building.govt.nz ↗
              </a>
              <p className="mt-1 leading-relaxed text-ink-700">
                The government&apos;s official guidance on building contracts,
                consents, and the rules around residential building work.
              </p>
            </li>
            <li>
              <a
                href="https://www.standards.govt.nz/shop/nzs-39022004"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-navy-950 hover:underline"
              >
                Standards New Zealand — free NZS 3902 contract template ↗
              </a>
              <p className="mt-1 leading-relaxed text-ink-700">
                NZS 3902 is the standard housing, alterations, and
                small-buildings contract used across the industry — a free
                template is available from Standards New Zealand.
              </p>
            </li>
          </ul>

          <p className="mt-6 rounded-md border border-hivis-500/30 bg-hivis-500/10 px-4 py-3 text-sm text-navy-950">
            <strong className="font-semibold">Recommended:</strong>{" "}
            <a
              href="https://buildinghub.nz/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              The Building Hub
            </a>{" "}
            (buildinghub.nz) is a great one-stop shop for contracts,
            payment templates, and general business support for NZ trades
            businesses.
          </p>
        </section>

        <p className="mt-10 border-t border-line pt-6 text-sm">
          <Link
            href="/tradie-resources/invoices-quotes"
            className="font-semibold text-navy-950 hover:underline"
          >
            Related guide: Invoices and quotes →
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
          This guide is general information for New Zealand tradies and
          isn&apos;t legal advice. Contract requirements, monetary
          thresholds, and dispute processes can change — confirm your
          specific obligations with a lawyer, accountant, or Building
          Performance before relying on anything here.
        </p>
      </div>
    </main>
  );
}
