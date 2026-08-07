"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signup, SignupState } from "./actions";
import TradeCategoryCheckboxes from "@/components/TradeCategoryCheckboxes";
import ServiceAreaCheckboxes from "@/components/ServiceAreaCheckboxes";
import RegionTownSelect from "@/components/RegionTownSelect";
import TermsCheckbox from "@/components/TermsCheckbox";

const initialState: SignupState = { error: null };

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  // ?role=tradie (e.g. from the tradie recruitment landing page) pre-selects
  // the tradie option instead of the default homeowner one.
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"homeowner" | "tradie">(
    searchParams.get("role") === "tradie" ? "tradie" : "homeowner"
  );

  return (
    <main className="flex flex-1 items-center justify-center bg-navy-950 px-6 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-paper-0 p-8 shadow-xl">
        <h1 className="font-display text-xl font-semibold text-navy-950">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Sign up as a tradie or a homeowner to get started.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-ink-700"
            >
              Full name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              autoComplete="name"
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-ink-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-ink-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
            />
          </div>

          <fieldset>
            <legend className="block text-sm font-medium text-ink-700">
              I am a...
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-ink-900 has-[:checked]:border-navy-700 has-[:checked]:bg-navy-950/5">
                <input
                  type="radio"
                  name="role"
                  value="homeowner"
                  checked={role === "homeowner"}
                  onChange={() => setRole("homeowner")}
                  className="accent-navy-950"
                />
                Homeowner
              </label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-ink-900 has-[:checked]:border-navy-700 has-[:checked]:bg-navy-950/5">
                <input
                  type="radio"
                  name="role"
                  value="tradie"
                  checked={role === "tradie"}
                  onChange={() => setRole("tradie")}
                  className="accent-navy-950"
                />
                Tradie
              </label>
            </div>
          </fieldset>

          {role === "tradie" && <TradeCategoryCheckboxes />}
          {role === "tradie" && <ServiceAreaCheckboxes />}

          {role === "tradie" && (
            <p className="text-xs text-ink-500">
              We&apos;ll email you a link to verify your address — confirming it
              unlocks Bronze tier on your profile.
            </p>
          )}

          {role === "homeowner" && (
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-ink-700">
                Property address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                autoComplete="street-address"
                placeholder="e.g. 12 Queen Street"
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
              />
            </div>
          )}

          {role === "homeowner" && <RegionTownSelect />}

          {role === "homeowner" && (
            <p className="text-xs text-ink-500">
              We use your address to show tradies where the job is, and
              we&apos;ll email you a link to verify your account before you can
              post a job.
            </p>
          )}

          <TermsCheckbox role={role} />

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
            {pending ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-navy-950 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
