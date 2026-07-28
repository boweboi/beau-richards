import { TOOLKIT_FUND_TARGET, type ToolkitDonation } from "@/lib/toolkitFund";

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
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Community toolkit fund
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
          Every lead we sell chips in toward a tradie&apos;s toolkit.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-700">
          $2 from every lead purchase goes into this fund. When it hits
          $2,000, we buy a toolkit for a Kiwi tradie starting out and post
          it here.
        </p>

        <div className="mt-10 flex flex-col items-center">
          <div
            role="progressbar"
            aria-valuenow={Math.round(amount)}
            aria-valuemin={0}
            aria-valuemax={TOOLKIT_FUND_TARGET}
            className="relative h-64 w-16 overflow-hidden rounded-full border-2 border-navy-950/15 bg-paper"
          >
            <div
              className="absolute bottom-0 left-0 w-full rounded-full bg-hivis-500 transition-all duration-500"
              style={{ height: `${pct}%` }}
            />
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
      </div>
    </section>
  );
}
