"use client";

import { useActionState } from "react";
import { submitReview, type SubmitReviewState } from "./actions";

const initialState: SubmitReviewState = { error: null };

export default function ReviewForm({ leadId }: { leadId: string }) {
  const [state, formAction, pending] = useActionState(
    submitReview.bind(null, leadId),
    initialState
  );

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-ink-700">
          Rating
        </label>
        <select
          id="rating"
          name="rating"
          defaultValue={5}
          className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none sm:w-40"
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} star{value === 1 ? "" : "s"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-ink-700">
          Comment (optional)
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          placeholder="How did the job go?"
          className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
        />
      </div>

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
        {pending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
