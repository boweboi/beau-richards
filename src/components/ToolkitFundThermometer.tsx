import Link from "next/link";
import { TOOLKIT_FUND_TARGET, type ToolkitDonation } from "@/lib/toolkitFund";

const MARKER_AMOUNTS = [0, 500, 1000, 1500, 2000];

function formatDollars(value: number) {
  return `$${Math.round(value).toLocaleString("en-NZ")}`;
}

export default function ToolkitFundThermometer({
  amount,
  donations = [],
}: {
  amount: number;
  donations?: ToolkitDonation[];
}) {
  const pct = Math.max(0, Math.min(100, (amount / TOOLKIT_FUND_TARGET) * 100));

  return (
    <section className="border-b border-line bg-paper-0 py-16">
      <Link
        href="/apprenticeship-fund"
        className="mx-auto block max-w-4xl px-6 text-center transition hover:opacity-90"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Community toolkit fund
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
          Every lead we sell chips in towards an apprentice&apos;s toolkit.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-700">
          $1 from every lead purchase goes into the Kiwi Trade Toolkit
          Fund. It&apos;s the TradieMatch community working together,
          building up the next generation of tradespeople. When it hits
          $2,000, we buy a complete toolkit, everything a tradie starting
          out needs. We&apos;ll share their stories here so you can see
          the real impact.
        </p>

        <div className="mt-10 flex flex-col items-center">
          <div className="flex flex-col items-center">
            {/* Tube — markers are positioned relative to this box
                specifically, so they track the tube regardless of the
                bulb's size below it. */}
            <div className="relative">
              <div
                role="progressbar"
                aria-valuenow={Math.round(amount)}
                aria-valuemin={0}
                aria-valuemax={TOOLKIT_FUND_TARGET}
                className="relative h-56 w-10 overflow-hidden rounded-t-full border-2 border-b-0 border-navy-950/15 bg-paper"
              >
                <div
                  className="absolute bottom-0 left-0 w-full bg-hivis-500 transition-all duration-500"
                  style={{ height: `${pct}%` }}
                />
              </div>

              {MARKER_AMOUNTS.map((marker) => (
                <span
                  key={marker}
                  className="absolute right-full mr-2 -translate-y-1/2 whitespace-nowrap text-[10px] font-medium text-ink-500"
                  style={{ bottom: `${(marker / TOOLKIT_FUND_TARGET) * 100}%` }}
                >
                  {formatDollars(marker)}
                </span>
              ))}
            </div>

            {/* Bulb — always filled, like mercury pooling at the base. */}
            <div className="-mt-1 h-14 w-14 rounded-full border-2 border-navy-950/15 bg-hivis-500" />

            <span className="mt-3 whitespace-nowrap rounded-full bg-navy-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-hivis-500">
              Tap to learn more
            </span>
          </div>
          <p className="mt-4 font-display text-xl font-semibold text-navy-950">
            {formatDollars(amount)} of {formatDollars(TOOLKIT_FUND_TARGET)}
          </p>
        </div>

        {donations.length > 0 && (
          <div className="mt-14 text-left">
            <h3 className="text-center font-display text-lg font-semibold text-navy-950">
              Toolkits funded so far
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {donations.map((donation, index) => (
                <figure
                  key={`${donation.photo_url}-${index}`}
                  className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={donation.photo_url}
                    alt={donation.caption}
                    className="h-48 w-full object-cover"
                  />
                  <figcaption className="p-4 text-sm text-ink-700">
                    {donation.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </Link>
    </section>
  );
}
