"use client";

import { useActionState } from "react";
import { unsubscribe, type UnsubscribeState } from "./actions";

const initialState: UnsubscribeState = { success: false, error: null };

export default function UnsubscribeForm({ email, token }: { email: string; token: string }) {
  const [state, formAction, pending] = useActionState(
    unsubscribe.bind(null, token),
    initialState
  );

  if (state.success) {
    return (
      <>
        <h1 className="font-display text-xl font-semibold text-navy-950">Unsubscribe</h1>
        <p className="mt-4 text-sm text-ink-700">
          You&apos;ve been unsubscribed from job alerts.
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="font-display text-xl font-semibold text-navy-950">Unsubscribe</h1>
      <p className="mt-1 text-sm text-ink-500">
        Confirm you&apos;d like to stop receiving job alert emails.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            disabled
            className="mt-1 w-full rounded-md border border-line bg-paper-50 px-3 py-2 text-sm text-ink-500"
          />
        </div>

        <div className="flex items-start gap-2">
          <input
            id="confirm"
            name="confirm"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-line text-hivis-500 focus:ring-hivis-500"
          />
          <label htmlFor="confirm" className="text-sm text-ink-700">
            Yes, unsubscribe me from job alert emails.
          </label>
        </div>

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
          {pending ? "Unsubscribing…" : "Unsubscribe"}
        </button>
      </form>
    </>
  );
}
