import Link from "next/link";

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 21s-6.72-4.35-9.3-8.1C.9 10.1 1.6 6.6 4.6 5.2c2.2-1 4.6-.3 6 1.6L12 8.7l1.4-1.9c1.4-1.9 3.8-2.6 6-1.6 3 1.4 3.7 4.9 1.9 7.7C18.72 16.65 12 21 12 21z" />
    </svg>
  );
}

export default function TradieWellbeingCard() {
  return (
    <section className="border-b border-line bg-paper-0 py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Tradie Wellbeing
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
          Backing our tradies, on the tools and off them.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-700">
          The trade&apos;s a tough gig, and too often tradies are expected to
          just harden up and get on with it. We reckon looking out for
          your mates is just as much a part of the job as doing the work
          right.
        </p>

        <div className="mt-10 flex flex-col items-center">
          {/* Same h-56 height as the other two homepage cards, for visual
              size parity across all three. */}
          <div className="flex h-56 w-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-navy-950/15 bg-paper px-3 text-center">
            <HeartIcon className="h-10 w-10 text-iron-600" />
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-iron-600">
              Free 24/7 support
            </p>
            <p className="font-display text-2xl font-semibold text-navy-950">
              0800 111 315
            </p>
          </div>

          <p className="mt-4 font-display text-xl font-semibold text-navy-950">
            MATES in Construction
          </p>
        </div>

        <Link
          href="/tradie-resources/tradie-wellbeing"
          className="mt-8 inline-block rounded-md bg-hivis-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
        >
          Learn More →
        </Link>
      </div>
    </section>
  );
}
