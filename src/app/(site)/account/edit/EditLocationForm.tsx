"use client";

import { useActionState } from "react";
import RegionTownSelect from "@/components/RegionTownSelect";
import { updateLocation, type UpdateLocationState } from "./actions";

const initialState: UpdateLocationState = { error: null };

export default function EditLocationForm({
  role,
  defaultAddress,
  defaultRegion,
  defaultTown,
}: {
  role: string;
  defaultAddress: string;
  defaultRegion: string;
  defaultTown: string;
}) {
  const [state, formAction, pending] = useActionState(updateLocation, initialState);
  const required = role === "homeowner";

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-ink-700">
          Address{!required && " (optional)"}
        </label>
        <input
          id="address"
          name="address"
          type="text"
          required={required}
          defaultValue={defaultAddress}
          placeholder="e.g. 12 Queen Street"
          className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
        />
      </div>

      <RegionTownSelect
        defaultRegion={defaultRegion}
        defaultTown={defaultTown}
        required={required}
      />

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save location"}
      </button>
    </form>
  );
}
