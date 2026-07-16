const SECTIONS = [
  {
    title: "Get Your Job Brief Ready",
    body: "Before you post a job or ask for quotes, know exactly what you want done. Vague jobs lead to vague quotes, which means surprises later. Walk around your property, take photos, write down what needs doing. The clearer you are, the better quotes you'll get.",
  },
  {
    title: "Know Your Budget",
    body: "Decide what you can spend before you ask for quotes. This helps tradies understand if you're in the same ballpark. Be realistic — cheap isn't always better, and the cheapest quote often has hidden costs later.",
  },
  {
    title: "Get Your Paperwork in Order",
    body: "If your job needs resource consent, building consent, or any council paperwork, sort it out first or confirm the tradie will handle it. The fewer surprises, the faster your job gets done. Ask the tradie upfront what paperwork they need from you.",
  },
  {
    title: "What to Look for in a Tradie",
    body: "Check their Trade Match NZ profile. Look at their reviews and their verification tier. A Bronze-verified tradie has been checked out. Ask questions if you're not sure about something. A good tradie will explain things clearly without making you feel silly.",
  },
  {
    title: "When You Get Quotes",
    body: "Compare a few, but don't just pick the cheapest. Look at what's included, the timeline, and whether the tradie answers your questions professionally. A slightly higher quote from someone who communicates well is often worth it.",
  },
  {
    title: "During the Job",
    body: "Keep communication open. Check in, but don't hover. Respect their workspace. If something doesn't look right, ask about it early rather than complaining at the end. Most issues are easier to fix mid-job.",
  },
  {
    title: "After It's Done",
    body: "Leave an honest review on Trade Match NZ. It helps other homeowners and helps good tradies build their reputation.",
  },
];

export default function HomeownerResourcesPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Homeowner resources
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Resources for Homeowners.
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
