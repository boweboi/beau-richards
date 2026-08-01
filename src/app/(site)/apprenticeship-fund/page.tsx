import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TOOLKIT_FUND_TARGET } from "@/lib/toolkitFund";
import CorrugatedPattern from "@/components/CorrugatedPattern";

export const metadata: Metadata = {
  title: "Apprenticeship Toolkit Fund | TradieMatch",
  robots: { index: true, follow: true },
};

// Without this, the fetched site_stats row can get baked into a cached
// render at build/deploy time — the live counter would then never update
// until the next deploy (same reasoning as the homepage and the
// environmental-impact page).
export const dynamic = "force-dynamic";

function formatDollars(value: number) {
  return `$${Math.round(value).toLocaleString("en-NZ")}`;
}

export default async function ApprenticeshipFundPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_stats")
    .select("toolkit_fund_amount")
    .eq("id", 1)
    .single();

  const fundAmount = Number(data?.toolkit_fund_amount ?? 0);

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-navy-950 px-4 py-16 text-center sm:py-20">
        <CorrugatedPattern
          id="apprenticeship-hero-corrugation"
          className="pointer-events-none absolute inset-0 h-full w-full"
          color="#ffffff"
          opacity={0.05}
        />

        <div className="relative mx-auto max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-400">
            Apprenticeship toolkit fund
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
            Building more than a marketplace.
          </h1>
          <p className="mt-4 text-white/70">
            TradieMatch believes in giving back to the trade that built
            us. Every lead purchased on this platform helps fund the
            next generation of Kiwi tradies — the apprentices who&apos;ll
            still be doing this work long after we&apos;re gone.
            It&apos;s not a slogan; it&apos;s money we actually set
            aside, tracked openly, right here.
          </p>

          <div className="mx-auto mt-10 w-fit rounded-2xl border border-white/10 bg-navy-900 px-10 py-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-500">
              Toolkit fund raised so far
            </p>
            <p className="mt-2 font-display text-5xl font-semibold text-white sm:text-6xl">
              {formatDollars(fundAmount)}
            </p>
            <p className="mt-2 text-sm text-white/60">
              of {formatDollars(TOOLKIT_FUND_TARGET)} target
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-2xl space-y-14 bg-paper-0 px-4 py-16 sm:py-20">
        <section>
          <h2 className="font-display text-xl font-semibold text-navy-950">
            How it works
          </h2>
          <p className="mt-3 text-ink-700">
            For every lead a tradie buys, one dollar goes into our
            apprenticeship toolkit fund. When that fund reaches $2,000,
            we buy a professional-grade toolkit — everything a tradie
            starting out needs — and donate it to a young apprentice.
            Every toolkit is real and every donation is documented; when
            we hand one over, we share the moment right here so you can
            see exactly where your support goes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Why we do this
          </h2>
          <p className="mt-3 text-ink-700">
            Aotearoā, New Zealand needs skilled tradies now more than
            ever. But for many young people, the barrier isn&apos;t
            talent or drive. It&apos;s access. Many complete their
            pre-trades training only to get stuck at the next step,
            unable to afford the tools they need to land an
            apprenticeship. We&apos;re here to help open that door.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Meet the apprentices
          </h2>
          <p className="mt-3 text-ink-700">
            As we fund and donate toolkits, the apprentices who receive
            them will be featured here — their stories, their trades,
            their journey.
          </p>
          <p className="mt-3 text-sm text-ink-500">Check back soon.</p>
        </section>
      </div>
    </main>
  );
}
