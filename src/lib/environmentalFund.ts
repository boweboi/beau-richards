// $1 from every paid lead purchase goes toward native tree planting (see
// increment_environmental_fund in step24-environmental-fund.sql, called
// from the Stripe webhook alongside the apprenticeship toolkit fund
// increment). $5 raised is counted as one tree funded — an internal
// planting-cost estimate stated openly on /environmental-impact, not a
// specific named planting partner.
export const DOLLARS_PER_TREE = 5;

export function treesFunded(amount: number): number {
  return Math.floor(amount / DOLLARS_PER_TREE);
}
