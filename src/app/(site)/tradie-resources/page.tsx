const SECTIONS = [
  {
    title: "Why Your Quote Matters",
    body: "Your quote is your first impression. It needs to be clear, professional, and detailed. A homeowner comparing three quotes will pick the one that feels trustworthy and explains things plainly. That's you.",
  },
  {
    title: "Writing a Winning Quote",
    body: "Keep your quote clean and professional. List what work you're doing, any materials if they're relevant to show, your total price, start date, how long it'll take, and payment terms. Don't overcomplicate it. Homeowners want to know the total cost and when you'll start, that's what they focus on.",
  },
  {
    title: "Pricing Your Work Right",
    body: "Don't undersell yourself. Calculate your costs, your time, your overheads, and add a fair profit margin. If you're not sure, research what other tradies in your region charge. Every job is different — a risky job with unknowns should cost more than a straightforward one. Add a buffer for unexpected issues. Homeowners respect tradies who price fairly, not cheaply.",
  },
  {
    title: "Communication Wins Jobs",
    body: "Answer messages quickly. Keep it friendly and clear. If a homeowner asks something you don't understand, ask them to explain rather than guessing. Update them on progress, especially if something changes. If a problem pops up, tell them straight away with options, not excuses.",
  },
  {
    title: "Be Professional",
    body: "Show up on time. Keep your work area tidy. Be respectful in their home. Wear clean work clothes and look after your gear. Your reputation builds faster than you think — word of mouth matters, and Trade Match NZ reviews matter even more.",
  },
  {
    title: "Follow Up",
    body: "If a homeowner hasn't responded to your quote, follow up after a few days. Keep it short and friendly. Don't be pushy, just remind them you're interested.",
  },
  {
    title: "Build Your Profile",
    body: "Keep your Trade Match NZ profile up to date. List your qualifications, your experience, your region. Ask happy customers for reviews — they're gold. Good reviews get you more jobs.",
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

      <div className="mx-auto mt-14 max-w-2xl space-y-10">
        {SECTIONS.map((section, index) => (
          <ResourceSection
            key={section.title}
            title={section.title}
            body={section.body}
            withDivider={index > 0}
          />
        ))}
      </div>
    </main>
  );
}

function ResourceSection({
  title,
  body,
  withDivider,
}: {
  title: string;
  body: string;
  withDivider: boolean;
}) {
  return (
    <section className={withDivider ? "border-t border-line pt-10" : undefined}>
      <h2 className="font-display text-xl font-semibold text-navy-950">
        {title}
      </h2>
      <p className="mt-3 leading-relaxed text-ink-700">{body}</p>
    </section>
  );
}
