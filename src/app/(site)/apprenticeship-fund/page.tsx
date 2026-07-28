import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apprenticeship Toolkit Fund | TradieMatch",
  robots: { index: true, follow: true },
};

export default function ApprenticeshipFundPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Apprenticeship toolkit fund
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Building more than a marketplace.
        </h1>
        <p className="mt-4 text-ink-700">
          TradieMatch believes in giving back to the trade that built us.
          That&apos;s why every lead purchased on our platform helps fund
          the next generation of Kiwi tradies.
        </p>
        <p className="mt-4 text-ink-700">
          For every lead a tradie buys, two dollars goes into our
          apprenticeship toolkit fund. When that fund reaches $2,000, we
          purchase a professional-grade toolkit and donate it to a
          rangatahi apprentice through Māori and Pasifika Trades Training
          (MPTT), helping a young Kiwi take their first real step into a
          trades career.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl space-y-14">
        <section>
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Why we do this
          </h2>
          <p className="mt-3 text-ink-700">
            Aotearoā, New Zealand needs skilled tradies now more than
            ever. But for many young people, especially Māori and
            Pasifika rangatahi, the barrier isn&apos;t talent or drive.
            It&apos;s access. Many complete their pre-trades training
            only to get stuck at the next step, unable to afford the
            tools they need to land an apprenticeship.
          </p>
          <p className="mt-3 font-medium text-navy-950">
            We&apos;re here to help open that door.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy-950">
            How it works
          </h2>
          <p className="mt-3 text-ink-700">
            Every toolkit is real. Every donation is documented. When we
            hand over a toolkit, we share the moment right here, so you
            can see exactly where your support goes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy-950">
            The math
          </h2>
          <p className="mt-3 text-ink-700">
            Every $20 lead purchased equals $2 toward a toolkit.
          </p>
          <div className="mt-4 rounded-2xl border border-hivis-500/30 bg-hivis-500/10 px-6 py-5 text-center">
            <p className="font-display text-2xl font-semibold text-navy-950">
              100 leads funded = 1 complete apprenticeship toolkit
            </p>
            <p className="mt-1 text-sm text-ink-700">
              in the hands of a rangatahi ready to build their career.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Meet the apprentices
          </h2>
          <p className="mt-3 text-ink-700">
            As we fund and donate toolkits, the rangatahi who receive
            them will be featured here — their stories, their trades,
            their journey.
          </p>
          <p className="mt-3 text-sm text-ink-500">Check back soon.</p>
        </section>
      </div>
    </main>
  );
}
