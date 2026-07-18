export const TRADE_CATEGORIES = [
  'Building & Construction',
  'Plumbing',
  'Electrical',
  'Painting & Decorating',
  'Roofing',
  'Plastering & Gib Stopping',
  'Tiling',
  'Flooring',
  'Landscaping & Gardening',
  'Fencing',
  'Concreting',
  'Bricklaying & Blocklaying',
  'Glazing & Windows',
  'Handyman / General',
  'Cleaning',
];

// Trades where NZ law restricts who can do the work (LBP scheme, licensed
// trades, etc.) — these require a Level 4 qualification or LBP number at
// every verification tier. Everything else in TRADE_CATEGORIES is
// non-regulated.
export const REGULATED_TRADES = [
  'Building & Construction',
  'Plumbing',
  'Electrical',
  'Roofing',
  'Bricklaying & Blocklaying',
];

export function isRegulatedTrade(trade: string | null): boolean {
  return trade !== null && (REGULATED_TRADES as string[]).includes(trade);
}

export function isAnyRegulatedTrade(trades: string[]): boolean {
  return trades.some((trade) => (REGULATED_TRADES as string[]).includes(trade));
}
