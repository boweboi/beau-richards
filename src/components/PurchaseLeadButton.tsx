"use client";

import { useActionState } from "react";
import { purchaseLead, type PurchaseLeadState } from "@/app/(site)/jobs/[id]/actions";

const initialState: PurchaseLeadState = { error: null };

export default function PurchaseLeadButton({ jobId }: { jobId: string }) {
  const [state, formAction, pending] = useActionState(
    purchaseLead.bind(null, jobId),
    initialState
  );

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={pending}
        className="mt-3 rounded-md bg-hivis-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Redirecting to checkout…" : "Unlock this lead — $20"}
      </button>
      {state.error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
