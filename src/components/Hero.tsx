import CorrugatedPattern from "./CorrugatedPattern";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-navy-950 pb-20 pt-16 sm:pt-24"
    >
      <CorrugatedPattern
        id="hero-corrugation"
        className="pointer-events-none absolute inset-0 h-full w-full"
        color="#ffffff"
        opacity={0.05}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-400">
            Built for New Zealand homeowners and tradies.
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Find trusted Kiwi tradies for your home improvement jobs.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            Describe the job once. Verified local tradies send you quotes —
            no cold calls, no chasing callbacks, no guesswork on price.
          </p>
        </div>

        {/* The fork in the road: two doors, one page. */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <article className="group relative flex flex-col justify-between rounded-2xl bg-paper-0 p-7 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
            <div>
              <h2 className="font-display text-2xl font-semibold text-navy-950">
                Homeowner?
              </h2>
              <p className="mt-2 text-sm text-ink-700">
                Create a free account, then post your job and get quotes
                from verified local tradies.
              </p>
            </div>
            <a
              href="/signup"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition group-hover:bg-hivis-500 group-hover:text-navy-950"
            >
              Join as a homeowner
            </a>
          </article>

          <article className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-navy-900 p-7">
            <div>
              <h2 className="font-display text-2xl font-semibold text-white">
                Tradie?
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Create a free profile, then browse local jobs that match
                your trade and quote on the ones you want.
              </p>
            </div>
            <a
              href="/signup"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-hivis-500 px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
            >
              Join as a tradie
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
