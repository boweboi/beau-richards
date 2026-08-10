"use client";

import { useActionState } from "react";
import { confirmJobFollowUp, type ConfirmJobFollowUpState } from "./actions";

const initialState: ConfirmJobFollowUpState = { success: false, error: null };

export default function JobFollowUpConfirmForm({
  token,
  jobTitle,
}: {
  token: string;
  jobTitle: string;
}) {
  const [state, formAction, pending] = useActionState(
    confirmJobFollowUp.bind(null, token),
    initialState
  );

  if (state.success) {
    return (
      <>
        <h1 className="font-display text-xl font-semibold text-navy-950">
          Job closed
        </h1>
        <p className="mt-4 text-sm text-ink-700">
          &ldquo;{jobTitle}&rdquo; is no longer listed as open. Nice one —
          hope the work goes well.
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="font-display text-xl font-semibold text-navy-950">
        All sorted?
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        Confirm you&apos;ve found a tradie for &ldquo;{jobTitle}&rdquo; and
        want to close this job listing. Any tradies who bought this lead but
        haven&apos;t heard from you will be marked as not progressing.
      </p>

      <form action={formAction} className="mt-6">
        {state.error && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Closing…" : "Yes, close this job listing"}
        </button>
      </form>
    </>
  );
}
