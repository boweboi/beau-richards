"use client";

import { useActionState } from "react";
import TradeCategoryCheckboxes from "@/components/TradeCategoryCheckboxes";
import { updateTradeCategories, type UpdateTradeCategoriesState } from "./actions";

const initialState: UpdateTradeCategoriesState = { error: null };

export default function EditTradeCategoriesForm({
  defaultSelected,
}: {
  defaultSelected: string[];
}) {
  const [state, formAction, pending] = useActionState(
    updateTradeCategories,
    initialState
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <TradeCategoryCheckboxes defaultSelected={defaultSelected} />

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
        {pending ? "Saving…" : "Save trades"}
      </button>
    </form>
  );
}
