export default function PricingPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Pricing
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          TradieMatch Pricing
        </h1>
        <p className="mt-4 text-ink-700">
          We believe in fair pricing that reflects the quality of the
          lead. Every job on TradieMatch falls into one of three tiers
          based on how urgent the homeowner is.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl space-y-14">
        <section>
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Urgent — $25
          </h2>
          <p className="mt-3 text-ink-700">
            The homeowner needs work done as soon as possible. These are
            hot leads with real timeline pressure and high conversion
            odds. You&apos;re competing with one tradie on our platform,
            but if you quote fast and professionally, you&apos;ve got a
            genuine shot at winning the job.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Flexible — $20
          </h2>
          <p className="mt-3 text-ink-700">
            The homeowner wants the work done, but they&apos;re not in a
            rush. They&apos;ve got a few weeks or more to get it sorted.
            These are solid leads with good conversion odds — you&apos;re
            still competing, but the timeline is relaxed enough that
            professionalism and a fair quote go a long way.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Quotes — $10
          </h2>
          <p className="mt-3 text-ink-700">
            The homeowner is gathering quotes and exploring options. They
            might not hire anyone tomorrow, but they&apos;re serious
            about eventually getting the work done. We price these lower
            because the conversion odds are longer, but they&apos;re
            still real opportunities — many tradies build their business
            on quote-gathering leads that turn into jobs weeks later.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Why three tiers?
          </h2>
          <p className="mt-3 text-ink-700">
            It&apos;s simple: we want to be honest with you about what
            you&apos;re paying for. A homeowner saying &ldquo;I need this
            next week&rdquo; is a different lead than one saying
            &ldquo;I&apos;m just getting some quotes.&rdquo; The price
            reflects that difference, and so do your odds of winning the
            job.
          </p>
        </section>
      </div>
    </main>
  );
}
