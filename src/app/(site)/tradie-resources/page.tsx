import Link from "next/link";

const GUIDES = [
  {
    title: "Invoices and quotes: a practical guide",
    description:
      "What has to be on a compliant NZ tax invoice, the GST rules you need to know, and how to write a quote that protects you and the homeowner — with sample templates.",
    href: "/tradie-resources/invoices-quotes",
  },
  {
    title: "Growing your skills and trade career",
    description:
      "Apprenticeships and formal training, becoming a licensed builder, electrical and plumbing registration, and how to keep upskilling around a full workload.",
    href: "/tradie-resources/skill-development",
  },
  {
    title: "Why your quote matters",
    description:
      "Why the quote you send is often the deciding factor in whether you win the job — first impressions, trust, and standing out from other tradies.",
    href: "/tradie-resources/why-your-quote-matters",
  },
  {
    title: "Writing a winning quote",
    description:
      "How to structure and price a quote that wins jobs — what to include, what to leave out, and the mistakes that quietly cost tradies work.",
    href: "/tradie-resources/writing-a-winning-quote",
  },
  {
    title: "Pricing your work right",
    description:
      "Cost breakdowns, fair margin, researching regional rates, and the pricing mistakes that catch tradies out.",
    href: "/tradie-resources/price-your-work-right",
  },
  {
    title: "How communication wins jobs",
    description:
      "How clear, responsive communication turns one-off jobs into repeat business and referrals.",
    href: "/tradie-resources/communication-wins-jobs",
  },
  {
    title: "Professionalism on the job",
    description:
      "Punctuality, presentation, site conduct, and safety — the habits that build your reputation faster than word of mouth alone.",
    href: "/tradie-resources/be-professional",
  },
  {
    title: "Why follow-up matters",
    description:
      "When to follow up with a homeowner after a quote, how to do it without being pushy, and how it keeps you top of mind.",
    href: "/tradie-resources/follow-up",
  },
  {
    title: "Building a strong TradeMatch profile",
    description:
      "Photos, bio, qualifications, reviews, and verification status — how to stand out among tradies bidding the same job.",
    href: "/tradie-resources/build-your-profile",
  },
];

export default function TradieResourcesPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Tradie resources
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Resources for Tradies.
        </h1>
      </div>

      <div className="mx-auto mt-14 max-w-2xl space-y-6">
        {GUIDES.map((guide) => (
          <div key={guide.href} className="rounded-2xl border border-line bg-white p-8">
            <span className="inline-flex items-center rounded-full bg-navy-900/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-navy-700">
              Guide
            </span>
            <h2 className="mt-4 font-display text-xl font-semibold text-navy-950">
              {guide.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              {guide.description}
            </p>
            <Link
              href={guide.href}
              className="mt-4 inline-block text-sm font-semibold text-navy-950 hover:underline"
            >
              Read the full guide →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
