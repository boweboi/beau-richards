import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { DOLLARS_PER_TREE, treesFunded } from "@/lib/environmentalFund";
import CorrugatedPattern from "@/components/CorrugatedPattern";

export const metadata: Metadata = {
  title: "Environmental Impact | TradieMatch",
  robots: { index: true, follow: true },
};

// Without this, the fetched site_stats row can get baked into a cached
// render at build/deploy time — the live tree counter would then never
// update until the next deploy (same reasoning as the homepage).
export const dynamic = "force-dynamic";

function formatDollars(value: number) {
  return `$${Math.round(value).toLocaleString("en-NZ")}`;
}

export default async function EnvironmentalImpactPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_stats")
    .select("environmental_fund_amount")
    .eq("id", 1)
    .single();

  const fundAmount = Number(data?.environmental_fund_amount ?? 0);
  const trees = treesFunded(fundAmount);

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-navy-950 px-4 py-16 text-center sm:py-20">
        <CorrugatedPattern
          id="environmental-hero-corrugation"
          className="pointer-events-none absolute inset-0 h-full w-full"
          color="#ffffff"
          opacity={0.05}
        />

        <div className="relative mx-auto max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-400">
            Environmental impact
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
            Kaitiakitanga — looking after the land we all share.
          </h1>
          <p className="mt-4 text-white/70">
            Kaitiakitanga is the Māori principle of guardianship — caring
            for the whenua (land) not because it&apos;s owed to us, but
            because we&apos;re responsible for it, for now and for
            whoever comes after. It&apos;s a value we want TradieMatch to
            practise, not just print on a page. So every lead purchased
            on the platform puts real money toward planting native trees
            in Aotearoā.
          </p>

          <div className="mx-auto mt-10 w-fit rounded-2xl border border-white/10 bg-navy-900 px-10 py-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-iron-600">
              Native trees funded so far
            </p>
            <p className="mt-2 font-display text-5xl font-semibold text-white sm:text-6xl">
              {trees.toLocaleString("en-NZ")}
            </p>
            <p className="mt-2 text-sm text-white/60">
              {formatDollars(fundAmount)} raised, ${DOLLARS_PER_TREE} per tree
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
            Every lead purchased on TradieMatch splits $2 evenly between
            two community funds: $1 into our apprenticeship toolkit fund,
            and $1 straight into this environmental fund. We count one
            native tree funded for every ${DOLLARS_PER_TREE} raised. No
            offsets, no credits — just a running tally of trees this
            community has funded together.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Why native trees
          </h2>
          <p className="mt-3 text-ink-700">
            Native trees do more than any imported species could — they
            rebuild habitat for native birds and insects, hold hillsides
            together, and put down roots in soil that belongs to them.
            Tradies build homes; we figured the least we could do is help
            put something back into the whenua those homes sit on.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Where the trees go
          </h2>
          <p className="mt-3 text-ink-700">
            As we confirm plantings with a native tree-planting partner,
            we&apos;ll document them here — locations, photos, the lot —
            the same way we document every toolkit we fund for an
            apprentice.
          </p>
          <p className="mt-3 text-sm text-ink-500">Check back soon.</p>
        </section>
      </div>
    </main>
  );
}
