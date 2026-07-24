"use client";

import { useState, useTransition } from "react";
import { addToWatchlist, removeFromWatchlist } from "./watchlist-actions";

export default function SaveJobButton({
  jobId,
  initialSaved,
}: {
  jobId: string;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    setError(null);
    startTransition(async () => {
      const result = saved ? await removeFromWatchlist(jobId) : await addToWatchlist(jobId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSaved(!saved);
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={
          saved
            ? "rounded-md bg-hivis-500 px-3 py-1.5 text-xs font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:cursor-not-allowed disabled:opacity-60"
            : "rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-hivis-500 hover:text-navy-950 disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {pending ? "Saving…" : saved ? "★ Saved" : "☆ Save"}
      </button>
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
