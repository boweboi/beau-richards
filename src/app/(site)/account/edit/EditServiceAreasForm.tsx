"use client";

import { useActionState } from "react";
import ServiceAreaCheckboxes from "@/components/ServiceAreaCheckboxes";
import { updateServiceAreas, type UpdateServiceAreasState } from "./actions";

const initialState: UpdateServiceAreasState = { error: null };

export default function EditServiceAreasForm({
  defaultSelected,
}: {
  defaultSelected: string[];
}) {
  const [state, formAction, pending] = useActionState(
    updateServiceAreas,
    initialState
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <ServiceAreaCheckboxes defaultSelected={defaultSelected} />

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save service areas"}
      </button>
    </form>
  );
}
