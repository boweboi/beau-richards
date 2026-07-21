"use client";

import { useActionState } from "react";
import TradeCategoryCheckboxes from "@/components/TradeCategoryCheckboxes";
import ServiceAreaCheckboxes from "@/components/ServiceAreaCheckboxes";
import { completeProfileSetup, type CompleteProfileSetupState } from "./actions";

const initialState: CompleteProfileSetupState = { error: null };

export default function CompleteProfileSection({
  defaultCategories,
  defaultAreas,
}: {
  defaultCategories: string[];
  defaultAreas: string[];
}) {
  const [state, formAction, pending] = useActionState(completeProfileSetup, initialState);

  return (
    <div className="rounded-2xl border border-hivis-500/40 bg-hivis-500/5 p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold text-navy-950">
        Complete your profile
      </h2>
      <p className="mt-1 text-sm text-ink-700">
        Select the trades you do and the areas you cover so we can show you
        jobs matched to you.
      </p>

      <form action={formAction} className="mt-6 space-y-6">
        <TradeCategoryCheckboxes defaultSelected={defaultCategories} />
        <ServiceAreaCheckboxes defaultSelected={defaultAreas} />

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
