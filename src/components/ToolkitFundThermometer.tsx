import Link from "next/link";
import { TOOLKIT_FUND_TARGET, type ToolkitDonation } from "@/lib/toolkitFund";

function formatDollars(value: number) {
  return `$${Math.round(value).toLocaleString("en-NZ")}`;
}

// A side-profile claw hammer: flat striking face + shaft on the right,
// a forked claw on the left, handle offset under the face (not centered
// under the whole head) — the asymmetry is what reads as "hammer" rather
// than a symmetric double-ended gavel head.
const HAMMER_HEAD_PATH =
  "M20.5 2 H14 C10.8 2 7.2 2.9 3.8 5.6 L9 6.1 L3.8 8.4 C7.2 10.5 10.8 11.4 14 11.4 H20.5 C21.3 11.4 22 10.7 22 9.9 V3.5 C22 2.7 21.3 2 20.5 2 Z";
const HAMMER_HANDLE = { x: 11, y: 9.5, width: 3, height: 20.5, rx: 1.5 };
const HAMMER_VIEW_W = 24;
const HAMMER_VIEW_H = 32;
// Fixed, not generated — fine as long as this component only renders
// once per page (true today, on the homepage). A second instance would
// need a unique id per instance to avoid the two <clipPath>s colliding.
const HAMMER_CLIP_ID = "toolkit-hammer-fill-clip";

function HammerSilhouette({ className }: { className?: string }) {
  return (
    <g className={className}>
      <path d={HAMMER_HEAD_PATH} fill="currentColor" />
      <rect
        x={HAMMER_HANDLE.x}
        y={HAMMER_HANDLE.y}
        width={HAMMER_HANDLE.width}
        height={HAMMER_HANDLE.height}
        rx={HAMMER_HANDLE.rx}
        fill="currentColor"
      />
    </g>
  );
}

// The hammer's own outline is the gauge — it fills with hi-vis orange from
// the bottom up as the fund grows, rather than a separate ring around a
// static icon. A <clipPath> masks the hi-vis copy of the same silhouette
// down to the bottom pct% of the viewBox.
function HammerFillGauge({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  const fillHeight = (HAMMER_VIEW_H * clamped) / 100;
  const fillY = HAMMER_VIEW_H - fillHeight;

  return (
    <svg
      width={140}
      height={(140 * HAMMER_VIEW_H) / HAMMER_VIEW_W}
      viewBox={`0 0 ${HAMMER_VIEW_W} ${HAMMER_VIEW_H}`}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <defs>
        <clipPath id={HAMMER_CLIP_ID}>
          <rect x={0} y={fillY} width={HAMMER_VIEW_W} height={fillHeight} />
        </clipPath>
      </defs>

      <HammerSilhouette className="text-navy-950/10" />

      <g clipPath={`url(#${HAMMER_CLIP_ID})`}>
        <HammerSilhouette className="text-hivis-500 transition-all duration-500" />
      </g>

      {/* Outline so the hammer still reads clearly at low fill levels. */}
      <path
        d={HAMMER_HEAD_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        className="text-navy-950/25"
      />
      <rect
        x={HAMMER_HANDLE.x}
        y={HAMMER_HANDLE.y}
        width={HAMMER_HANDLE.width}
        height={HAMMER_HANDLE.height}
        rx={HAMMER_HANDLE.rx}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        className="text-navy-950/25"
      />
    </svg>
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
          <HammerFillGauge pct={pct} />

          <span className="mt-4 inline-block rounded-md bg-hivis-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400">
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
