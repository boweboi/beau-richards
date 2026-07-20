export default function AboutPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          About us
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Built for Aotearoa homeowners &amp; tradies.
        </h1>
        <p className="mt-4 text-ink-700">
          TradeMatch NZ connects homeowners across Aotearoa with trusted
          local tradies. Post a job for free, get quotes from verified
          tradies, and hire with confidence — no cold calls, no chasing
          callbacks, no guesswork on price.
        </p>
        <p className="mt-4 text-ink-700">
          Posting a job is free, and stays free. Tradies pay a flat fee
          only for the leads they choose to respond to — no subscriptions,
          no upfront cost to browse.
        </p>
      </div>
    </main>
  );
}
