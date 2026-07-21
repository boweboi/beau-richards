"use client";

import { useState } from "react";
import regionsData from "@/nz-regions.json";

export default function RegionTownSelect({
  defaultRegion = "",
  defaultTown = "",
}: {
  defaultRegion?: string;
  defaultTown?: string;
}) {
  const [region, setRegion] = useState(defaultRegion);
  const towns = regionsData.regions.find((r) => r.name === region)?.towns ?? [];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="region" className="block text-sm font-medium text-ink-700">
          Region
        </label>
        <select
          id="region"
          name="region"
          required
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
        >
          <option value="">Select region…</option>
          {regionsData.regions.map((r) => (
            <option key={r.slug} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="town" className="block text-sm font-medium text-ink-700">
          Town / suburb
        </label>
        <select
          id="town"
          name="town"
          required
          disabled={!region}
          defaultValue={defaultTown}
          key={region}
          className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none disabled:cursor-not-allowed disabled:bg-navy-950/5"
        >
          <option value="">{region ? "Select town…" : "Pick a region first"}</option>
          {towns.map((town) => (
            <option key={town} value={town}>
              {town}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
