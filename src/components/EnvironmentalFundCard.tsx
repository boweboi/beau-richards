import Link from "next/link";
import { DOLLARS_PER_TREE, treesFunded } from "@/lib/environmentalFund";

function formatDollars(value: number) {
  return `$${Math.round(value).toLocaleString("en-NZ")}`;
}

export default function EnvironmentalFundCard({ amount }: { amount: number }) {
  const trees = treesFunded(amount);

  return (
    <section className="border-b border-line bg-paper-0 py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Environmental Impact
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
          Kaitiakitanga — every lead helps plant a native tree.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-700">
          $1 from every lead purchase goes toward native tree planting in
          Aotearoā — our way of practising kaitiakitanga, the Māori
          principle of guardianship over the land we all share.
        </p>

        <div className="mt-10 flex flex-col items-center">
          {/* Same h-56 height as the toolkit fund's thermometer tube, for
              visual size parity between the two homepage cards. */}
          <div className="flex h-56 w-40 flex-col items-center justify-center rounded-2xl border-2 border-navy-950/15 bg-paper">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-iron-600">
              Trees funded
            </p>
            <p className="mt-2 font-display text-5xl font-semibold text-navy-950">
              {trees.toLocaleString("en-NZ")}
            </p>
          </div>

          <p className="mt-4 font-display text-xl font-semibold text-navy-950">
            {formatDollars(amount)} raised, {formatDollars(DOLLARS_PER_TREE)} per tree
          </p>
        </div>

        <Link
          href="/environmental-impact"
          className="mt-8 inline-block rounded-md bg-hivis-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
        >
          Learn More →
        </Link>
      </div>
    </section>
  );
}
