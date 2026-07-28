export const metadata = {
  title: "Down for maintenance | TradieMatch",
};

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy-950 px-6 text-center">
      <span
        aria-hidden="true"
        className="grid h-12 w-12 place-items-center rounded-md bg-hivis-500 text-base font-bold text-navy-950"
      >
        TM
      </span>
      <h1 className="mt-6 font-display text-2xl font-semibold text-white sm:text-3xl">
        We&apos;ll be back shortly.
      </h1>
      <p className="mt-3 max-w-sm text-sm text-white/70">
        TradieMatch is down for scheduled maintenance right now. Thanks for
        your patience — check back soon.
      </p>
      <p className="mt-6 max-w-sm text-xs text-white/50">
        If the page doesn&apos;t refresh once we&apos;re back, try opening the
        site in a new browser tab.
      </p>
    </main>
  );
}
