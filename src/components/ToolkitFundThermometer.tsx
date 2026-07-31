import Link from "next/link";
import { TOOLKIT_FUND_TARGET, type ToolkitDonation } from "@/lib/toolkitFund";

function formatDollars(value: number) {
  return `$${Math.round(value).toLocaleString("en-NZ")}`;
}

function HammerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <g transform="rotate(45 12 12)">
        <rect x="8.5" y="2.5" width="7" height="5" rx="1.2" fill="currentColor" />
        <rect x="10.7" y="7" width="2.6" height="13.5" rx="1.2" fill="currentColor" />
      </g>
    </svg>
  );
}

const GAUGE_SIZE = 176;
const GAUGE_STROKE = 12;
const GAUGE_RADIUS = (GAUGE_SIZE - GAUGE_STROKE) / 2;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

function ProgressGauge({ pct }: { pct: number }) {
  const offset = GAUGE_CIRCUMFERENCE * (1 - pct / 100);

  return (
    <div className="relative" style={{ width: GAUGE_SIZE, height: GAUGE_SIZE }}>
      <svg
        width={GAUGE_SIZE}
        height={GAUGE_SIZE}
        viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`}
        className="-rotate-90"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <circle
          cx={GAUGE_SIZE / 2}
          cy={GAUGE_SIZE / 2}
          r={GAUGE_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={GAUGE_STROKE}
          className="text-navy-950/10"
        />
        <circle
          cx={GAUGE_SIZE / 2}
          cy={GAUGE_SIZE / 2}
          r={GAUGE_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={GAUGE_STROKE}
          strokeLinecap="round"
          strokeDasharray={GAUGE_CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="text-hivis-500 transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <HammerIcon className="h-14 w-14 text-navy-950" />
      </div>
    </div>
  );
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
          <ProgressGauge pct={pct} />

          <span className="mt-4 whitespace-nowrap rounded-full bg-navy-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-hivis-500">
            Tap to learn more
          </span>
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
