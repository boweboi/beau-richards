"use client";

import CheckboxOption from "@/components/CheckboxOption";
import { useState } from "react";
import regionsData from "@/nz-regions.json";

export default function ServiceAreaCheckboxes({
  defaultSelected = [],
}: {
  defaultSelected?: string[];
}) {
  const defaultOpenRegions = new Set(
    defaultSelected.map((pair) => pair.split("|")[0])
  );
  const [openRegions, setOpenRegions] = useState<Set<string>>(defaultOpenRegions);

  function toggleRegion(name: string) {
    setOpenRegions((current) => {
      const next = new Set(current);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  return (
    <fieldset>
      <legend className="block text-sm font-medium text-ink-700">
        Which areas do you cover?
      </legend>
      <div className="mt-2 space-y-2">
        {regionsData.regions.map((region) => {
          const isOpen = openRegions.has(region.name);
          return (
            <div key={region.name} className="rounded-md border border-line">
              <button
                type="button"
                onClick={() => toggleRegion(region.name)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-ink-900"
              >
                {region.name}
                <span aria-hidden="true" className="text-ink-500">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>
              {/* Always mounted, just visually hidden when collapsed —
                  conditionally rendering this would unmount the
                  checkboxes on collapse and silently discard whatever
                  was checked inside (uncontrolled inputs don't survive
                  unmount). */}
              <div
                className={`grid grid-cols-2 gap-2 border-t border-line p-3 sm:grid-cols-3 ${isOpen ? "" : "hidden"}`}
              >
                {region.towns.map((town) => {
                  const value = `${region.name}|${town}`;
                  return (
                    <CheckboxOption
                      key={town}
                      name="areas"
                      value={value}
                      defaultChecked={defaultSelected.includes(value)}
                      labelClassName="h-full"
                    >
                      {town}
                    </CheckboxOption>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
