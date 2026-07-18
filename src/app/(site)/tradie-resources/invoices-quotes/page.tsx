import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Invoice Template for Tradies NZ | How to Quote a Job | TradeMatch NZ",
  description:
    "A practical guide for New Zealand tradies: how to write a compliant NZ tax invoice, GST rules explained, and how to quote a building job — with sample invoice and quote templates.",
};

const INVOICE_ITEMS = [
  { description: "Supply and install mixer tap set, kitchen", qty: 1, unitPrice: 245 },
  { description: "Labour — plumbing installation (4 hours)", qty: 4, unitPrice: 85 },
  { description: "Sundries and fittings", qty: 1, unitPrice: 60 },
];

const QUOTE_ITEMS = [
  { description: "Demolish and remove existing deck", qty: 1, unitPrice: 650 },
  { description: "Supply and construct new timber deck (18m²)", qty: 1, unitPrice: 4200 },
  { description: "Labour — construction (3 days)", qty: 3, unitPrice: 550 },
];

const INVOICE_TIERS = [
  {
    label: "Under $200",
    detail:
      "The basics: your business/trading name, the date, a description of what you supplied, and the amount charged.",
  },
  {
    label: "$200 to $1,000",
    detail:
      "Everything above, plus your GST number (if you're GST-registered) and the GST amount shown separately.",
  },
  {
    label: "Over $1,000",
    detail:
      "Everything above, plus the buyer's name and address.",
  },
];

export default function InvoicesQuotesPage() {
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
          Invoices and quotes: a practical guide for NZ tradies.
        </h1>

        <p className="mt-6 leading-relaxed text-ink-700">
          A good invoice gets you paid on time. A good quote wins the job in
          the first place — and keeps it from turning into an argument
          halfway through. This guide covers what actually needs to be on a
          New Zealand tax invoice to be compliant with Inland Revenue, how to
          write a quote that protects both you and the homeowner, and
          includes sample templates for both that you can copy the layout of
          for your own jobs.
        </p>

        <section className="mt-12 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Why good invoices and quotes matter
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Late or unpaid invoices are one of the biggest cash flow problems
            small trades businesses face — chasing money you&apos;re owed costs
            you time you could spend earning more of it. A clear, professional
            invoice sent promptly gets paid faster than a scribbled note or a
            text message with a dollar figure in it.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Quotes matter just as much, but earlier in the job. A detailed,
            professional quote is often the deciding factor when a homeowner
            is comparing you against two other tradies — it signals you run a
            legitimate, organised business. And a clear scope of work with an
            itemised price in writing is your best protection against the
            classic dispute: &quot;that&apos;s not what we agreed to.&quot; If
            it&apos;s on the quote, there&apos;s nothing to argue about.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Invoice promptly — ideally the same day you finish the job, or in
            stages for a longer project. The longer you wait to send an
            invoice, the longer you wait to get paid, and homeowners are far
            more likely to query a bill that turns up three weeks after the
            work was done than one that lands the next morning.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            What makes a compliant NZ tax invoice
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            GST in New Zealand is currently 15%. What has to appear on your
            invoice depends on how much you&apos;re charging — Inland Revenue uses
            a tiered system, and the requirements stack as the amount goes
            up:
          </p>

          <dl className="mt-6 space-y-4">
            {INVOICE_TIERS.map((tier) => (
              <div key={tier.label} className="flex gap-3 text-sm">
                <dt className="w-32 shrink-0 font-display font-semibold text-navy-950">
                  {tier.label}
                </dt>
                <dd className="text-ink-700">{tier.detail}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 leading-relaxed text-ink-700">
            Only put a GST number on your invoice if you&apos;re actually
            GST-registered. Registration becomes compulsory once your
            turnover passes $60,000 in a 12-month period, but you can
            register voluntarily earlier than that if it suits your
            business.
          </p>
          <p className="mt-3 rounded-md border border-line bg-navy-900/5 px-4 py-3 text-sm font-medium text-navy-950">
            Charging GST — or adding a GST number to your invoices — when
            you are not registered for GST is a serious offence under NZ tax
            law. Don&apos;t do it, even by accident.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Whatever you invoice, keep a copy. Inland Revenue requires you to
            retain business records, including invoices, for 7 years. You
            don&apos;t need expensive software to manage this — a simple
            numbered invoice template, whether it&apos;s a spreadsheet or a
            proper accounting app, is enough as long as every invoice is
            dated, numbered sequentially, and kept somewhere you can find it
            again years later. Cloud accounting tools back everything up
            automatically, which turns the 7-year rule into a non-issue
            rather than a filing-cabinet headache.
          </p>
        </section>

        <SampleDocument
          kind="Tax Invoice"
          documentNumber="INV-0142"
          date="18 July 2026"
          from={{
            name: "Kiwi Trade Co Ltd",
            address: "12 Totara Street, Manurewa, Auckland 2102",
            gstNumber: "GST 123-456-789",
          }}
          billTo={{ name: "J. and S. Williams", address: "45 Riverside Ave, Manurewa, Auckland 2102" }}
          items={INVOICE_ITEMS}
          footerNote="Payment due within 7 days. Direct credit: 01-0123-0123456-00 (Kiwi Trade Co Ltd)."
        />

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Writing good quotes
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            A strong quote does four things well. First, it sets out a{" "}
            <strong className="font-semibold text-navy-950">
              clear scope of work
            </strong>{" "}
            — exactly what you will and won&apos;t do, so there&apos;s no confusion
            later about what was included. Second, it{" "}
            <strong className="font-semibold text-navy-950">
              itemises the price
            </strong>{" "}
            rather than giving one lump sum — homeowners trust a breakdown,
            and it makes it easier to agree on changes if the scope shifts.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Third, state{" "}
            <strong className="font-semibold text-navy-950">
              how long the quote is valid for
            </strong>{" "}
            — 30 days is common. Materials prices move, and you don&apos;t want to
            be locked into a six-month-old price. Fourth, be explicit about{" "}
            <strong className="font-semibold text-navy-950">
              deposit and payment terms
            </strong>
            : how much deposit is required to secure the job, and when the
            balance is due — on completion, or in stages for a larger job.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Finally, know the difference between a{" "}
            <strong className="font-semibold text-navy-950">
              fixed quote
            </strong>{" "}
            and an{" "}
            <strong className="font-semibold text-navy-950">estimate</strong>
            . A quote is a firm price you&apos;re committing to for the scope
            described — if you go over, that&apos;s usually on you, unless the
            scope changes. An estimate is a ballpark figure that can move
            once you&apos;re into the job and see what&apos;s actually involved. Label
            which one you&apos;re giving in writing, every time, so there&apos;s no
            confusion about who wears the risk of a price change.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            And always get the quote accepted in writing before you start
            work — an email reply, a signed copy, or even a simple
            &quot;yes, go ahead&quot; text message is enough. A verbal
            &quot;yeah, sounds good&quot; over the phone leaves you with
            nothing to point back to if the homeowner later disputes the
            price or what was included.
          </p>
        </section>

        <SampleDocument
          kind="Quote"
          documentNumber="QT-0087"
          date="18 July 2026"
          validUntil="17 August 2026"
          badge="Fixed Price Quote"
          from={{
            name: "Kiwi Trade Co Ltd",
            address: "12 Totara Street, Manurewa, Auckland 2102",
            gstNumber: "GST 123-456-789",
          }}
          billTo={{ name: "R. Patel", address: "8 Hilltop Rd, Takapuna, Auckland 0622" }}
          items={QUOTE_ITEMS}
          footerNote="40% deposit required to confirm booking, balance due on completion. This is a fixed price quote for the scope described above — any additional work will be quoted separately."
        />

        <p className="mt-10 border-t border-line pt-6 text-sm">
          <Link
            href="/tradie-resources/skill-development"
            className="font-semibold text-navy-950 hover:underline"
          >
            Related guide: Growing your skills and trade career →
          </Link>
        </p>

        <p className="mt-6 border-t border-line pt-6 text-xs leading-relaxed text-ink-500">
          This guide is general information for New Zealand tradies and isn&apos;t
          legal or tax advice. GST rules, thresholds, and invoicing
          requirements can change — always confirm your specific
          obligations with Inland Revenue or a qualified accountant before
          relying on anything here.
        </p>
      </div>
    </main>
  );
}

function SampleDocument({
  kind,
  documentNumber,
  date,
  validUntil,
  badge,
  from,
  billTo,
  items,
  footerNote,
}: {
  kind: "Tax Invoice" | "Quote";
  documentNumber: string;
  date: string;
  validUntil?: string;
  badge?: string;
  from: { name: string; address: string; gstNumber: string };
  billTo: { name: string; address: string };
  items: { description: string; qty: number; unitPrice: number }[];
  footerNote: string;
}) {
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const gst = subtotal * 0.15;
  const total = subtotal + gst;

  return (
    <div className="mt-10 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
            Sample — {kind}
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-navy-950">
            {from.name}
          </p>
          <p className="text-sm text-ink-500">{from.address}</p>
          <p className="text-sm text-ink-500">{from.gstNumber}</p>
        </div>
        <div className="text-right text-sm text-ink-500">
          {badge && (
            <span className="mb-2 inline-flex items-center rounded-full bg-navy-900/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-navy-700">
              {badge}
            </span>
          )}
          <p>
            {kind} #{documentNumber}
          </p>
          <p>Date: {date}</p>
          {validUntil && <p>Valid until: {validUntil}</p>}
        </div>
      </div>

      <div className="mt-6 border-t border-line pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
          {kind === "Quote" ? "Quote for" : "Bill to"}
        </p>
        <p className="mt-1 text-sm font-medium text-navy-950">{billTo.name}</p>
        <p className="text-sm text-ink-500">{billTo.address}</p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-500">
              <th className="py-2 pr-3 font-medium">Description</th>
              <th className="py-2 pr-3 font-medium">Qty</th>
              <th className="py-2 pr-3 font-medium">Unit price</th>
              <th className="py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.description} className="border-b border-line/60">
                <td className="py-2 pr-3 text-ink-700">{item.description}</td>
                <td className="py-2 pr-3 text-ink-700">{item.qty}</td>
                <td className="py-2 pr-3 text-ink-700">
                  ${item.unitPrice.toFixed(2)}
                </td>
                <td className="py-2 text-right text-ink-700">
                  ${(item.qty * item.unitPrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="w-full max-w-xs space-y-1 text-sm">
          <div className="flex justify-between text-ink-700">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-ink-700">
            <span>GST (15%)</span>
            <span>${gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-1 font-display font-semibold text-navy-950">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-ink-500">
        {footerNote}
      </p>
    </div>
  );
}
