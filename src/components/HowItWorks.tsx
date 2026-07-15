import CorrugatedPattern from "./CorrugatedPattern";

const steps = [
  {
    number: "01",
    title: "Post the job",
    description:
      "Describe what you need done and where. Add photos if it helps — most jobs take under two minutes to list.",
  },
  {
    number: "02",
    title: "Review quotes",
    description:
      "Local tradies get in touch with quotes and availability. Compare prices, ratings and past work side by side.",
  },
  {
    number: "03",
    title: "Hire with confidence",
    description:
      "Pick the right tradie for the job and get it booked in. Leave a review once it's done to help the next homeowner.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
            The process
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
            Three steps from job to done.
          </h2>
        </div>

        <ol className="mt-14 grid gap-8 sm:grid-cols-3 sm:gap-6">
          {steps.map((step, index) => (
            <li key={step.number} className="relative">
              <div className="flex items-center gap-4 sm:block">
                <span className="font-display text-4xl font-semibold text-navy-900/15 sm:text-5xl">
                  {step.number}
                </span>
                <h3 className="font-display text-xl font-semibold text-navy-950 sm:mt-4">
                  {step.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute right-[-1.5rem] top-2 hidden h-px w-8 bg-line sm:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="relative mt-20 overflow-hidden rounded-2xl bg-navy-950 py-14">
        <CorrugatedPattern
          id="how-it-works-corrugation"
          className="pointer-events-none absolute inset-0 h-full w-full"
          color="#ffffff"
          opacity={0.06}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              Got a job that needs doing?
            </h3>
            <p className="mt-2 max-w-md text-white/70">
              Post it today and start hearing back from local tradies within
              hours.
            </p>
          </div>
          <a
            href="/post-a-job"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-hivis-500 px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
          >
            Post a job — it&apos;s free
          </a>
        </div>
      </div>
    </section>
  );
}
