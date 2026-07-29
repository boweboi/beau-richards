// Per-tier lead price, keyed by jobs.timeframe (see src/lib/timeframes.ts).
// Read at purchase time in src/app/(site)/jobs/[id]/actions.ts — always
// derived server-side from the job row already fetched from the
// database, never from anything the client sends, so a tradie can't
// tamper with it to pay less than the tier actually costs.
export const LEAD_PRICE_CENTS_BY_TIMEFRAME: Record<string, number> = {
  Urgent: 2500,
  Flexible: 1500,
  Quotes: 1000,
};

// Falls back to the old flat rate for any job whose timeframe predates
// the 3-tier model (e.g. "As soon as possible", from before this change).
export const DEFAULT_LEAD_PRICE_CENTS = 2000;

export function getLeadPriceCents(timeframe: string): number {
  return LEAD_PRICE_CENTS_BY_TIMEFRAME[timeframe] ?? DEFAULT_LEAD_PRICE_CENTS;
}
