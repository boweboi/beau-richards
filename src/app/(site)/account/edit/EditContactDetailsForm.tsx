"use client";

import { useActionState } from "react";
import { updateContactDetails, type UpdateContactDetailsState } from "./actions";

const initialState: UpdateContactDetailsState = { error: null };

export default function EditContactDetailsForm({
  email,
  defaultFullName,
  defaultPhone,
}: {
  email: string;
  defaultFullName: string;
  defaultPhone: string;
}) {
  const [state, formAction, pending] = useActionState(updateContactDetails, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-ink-700">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          defaultValue={defaultFullName}
          className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-ink-700">Email</span>
        <p className="mt-1 rounded-md border border-line bg-paper-50 px-3 py-2 text-sm text-ink-500">
          {email}
        </p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-ink-700">
          Phone (optional)
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

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save contact details"}
      </button>
    </form>
  );
}
