"use client";

import { useActionState } from "react";
import RegionTownSelect from "@/components/RegionTownSelect";
import {
  completeHomeownerProfile,
  type CompleteHomeownerProfileState,
} from "./actions";

const initialState: CompleteHomeownerProfileState = { error: null };

export default function CompleteProfileSection({
  defaultAddress,
  defaultRegion,
  defaultTown,
}: {
  defaultAddress: string;
  defaultRegion: string;
  defaultTown: string;
}) {
  const [state, formAction, pending] = useActionState(
    completeHomeownerProfile,
    initialState
  );

  return (
    <div className="rounded-2xl border border-hivis-500/40 bg-hivis-500/5 p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold text-navy-950">
        Complete your profile
      </h2>
      <p className="mt-1 text-sm text-ink-700">
        Add your address and location so tradies know where the job is.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-ink-700">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            defaultValue={defaultAddress}
            placeholder="e.g. 12 Queen Street"
            className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
          />
        </div>

        <RegionTownSelect defaultRegion={defaultRegion} defaultTown={defaultTown} />

        {state.error && (
          <p className="text-sm text-red-600" role="alert">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-hivis-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save and continue"}
        </button>
      </form>
    </div>
  );
}
