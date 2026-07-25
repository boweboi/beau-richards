export const TRADE_CATEGORIES = [
  'Building',
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
  'Waterproofing',
  'Pest Control',
  'Excavation',
  'Heating & Cooling',
  'Carpet Laying',
  'Insulation',
  'Solar',
  'Arborists',
  'Locksmiths',
];

// Trades where NZ law restricts who can do the work (LBP scheme, licensed
// trades, etc.) — these require relevant qualifications and/or LBP (plus
// EWRB for electricians, PGDB for plumbers and gasfitters) at every
// verification tier. Everything else in TRADE_CATEGORIES is non-regulated.
export const REGULATED_TRADES = [
  'Building',
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

// Beyond LBP, Electrical and Plumbing have their own separate registration
// boards — this surfaces that alongside "relevant qualifications and/or
// LBP" wherever a tradie's qualification status is displayed. Returns ""
// for regulated trades without a separate board (Building, Roofing,
// Bricklaying & Blocklaying).
export function qualificationBoardSuffix(trades: (string | null)[]): string {
  const boards: string[] = [];
  if (trades.includes('Electrical')) boards.push('EWRB');
  if (trades.includes('Plumbing')) boards.push('PGDB');
  return boards.length > 0 ? ` (${boards.join(', ')})` : '';
}
