"use client";

import { useActionState } from "react";
import StarRating from "@/components/StarRating";
import { submitReview, type SubmitReviewState } from "./actions";

const initialState: SubmitReviewState = { error: null };

const CATEGORIES = [
  { name: "communication_rating", label: "Communication" },
  { name: "quality_rating", label: "Quality of Work" },
  { name: "timeliness_rating", label: "Timeliness" },
  { name: "value_rating", label: "Value for Money" },
  { name: "professionalism_rating", label: "Professionalism" },
];

export default function ReviewForm({ leadId }: { leadId: string }) {
  const [state, formAction, pending] = useActionState(
    submitReview.bind(null, leadId),
    initialState
  );

  return (
    <form action={formAction} className="mt-4 space-y-4">
      {CATEGORIES.map((category) => (
        <StarRating key={category.name} name={category.name} label={category.label} />
      ))}

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
