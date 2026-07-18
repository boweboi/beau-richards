import regionsData from "@/nz-regions.json";

export type RegionTown = { region: string; town: string };

// Checkbox values are "<Region>|<Town>" pairs (see ServiceAreaCheckboxes) —
// this splits them back into structured pairs for validation/inserts.
export function parseAreaPairs(values: string[]): RegionTown[] {
  return values.map((value) => {
    const [region, town] = value.split("|");
    return { region, town };
  });
}

export function isValidAreaPair({ region, town }: RegionTown): boolean {
  const regionEntry = regionsData.regions.find((r) => r.name === region);
  return Boolean(regionEntry && regionEntry.towns.includes(town));
}
