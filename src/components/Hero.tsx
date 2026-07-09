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
            Built for Aotearoa homeowners &amp; tradies
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
              <span className="inline-flex items-center rounded-full bg-navy-900/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-navy-700">
                Homeowner
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold text-navy-950">
                Post a job
              </h2>
              <p className="mt-2 text-sm text-ink-700">
                Tell us what needs doing — a leaky tap, a full renovation, or
                anything in between. It takes about two minutes.
              </p>
            </div>
            <a
              href="#post-job"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition group-hover:bg-hivis-500 group-hover:text-navy-950"
            >
              Post a job — it&apos;s free
            </a>
          </article>

          <article className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-navy-900 p-7">
            <div>
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-hivis-400">
                Tradie
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold text-white">
                Join as a tradie
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Get matched with local jobs that fit your trade and your
                schedule. Quote only on the work you actually want.
              </p>
            </div>
            <a
              href="#tradies"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-hivis-500 px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
            >
              Sign up as a tradie
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
