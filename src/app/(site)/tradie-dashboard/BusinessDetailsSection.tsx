"use client";

import { useActionState, useEffect, useState } from "react";
import { updateBusinessDetails, type UpdateBusinessDetailsState } from "./actions";

const initialState: UpdateBusinessDetailsState = { error: null };

export default function BusinessDetailsSection({
  email,
  defaultBusinessName,
  defaultNzbn,
  defaultPhone,
}: {
  email: string;
  defaultBusinessName: string;
  defaultNzbn: string;
  defaultPhone: string;
}) {
  const [state, formAction, pending] = useActionState(updateBusinessDetails, initialState);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (state.saved) {
      setJustSaved(true);
      const timeout = setTimeout(() => setJustSaved(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [state.saved]);

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <h2 className="font-display text-xl font-semibold text-navy-950">
        Business details
      </h2>
      <p className="mt-2 text-sm text-ink-700">
        Shown to homeowners and used to verify your business.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="business_name" className="block text-sm font-medium text-ink-700">
            Business name
          </label>
          <input
            id="business_name"
            name="business_name"
            type="text"
            defaultValue={defaultBusinessName}
            placeholder="e.g. Smith Builders Ltd"
            className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="nzbn" className="block text-sm font-medium text-ink-700">
            NZBN number
          </label>
          <input
            id="nzbn"
            name="nzbn"
            type="text"
            defaultValue={defaultNzbn}
            placeholder="9429000000000"
            className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
          />
          <p className="mt-1 text-xs text-ink-500">
            Changing this clears any existing NZBN verification until we
            re-check it.
          </p>
        </div>

        <div>
          <span className="block text-sm font-medium text-ink-700">Email address</span>
          <p className="mt-1 rounded-md border border-line bg-paper-50 px-3 py-2 text-sm text-ink-500">
            {email}
          </p>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-ink-700">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={defaultPhone}
            placeholder="021 123 4567"
            className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
          />
        </div>

        {state.error && (
          <p className="text-sm text-red-600" role="alert">
            {state.error}
          </p>
        )}
        {justSaved && (
          <p className="text-sm text-iron-600">Business details saved ✓</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save business details"}
        </button>
      </form>
    </div>
  );
}
