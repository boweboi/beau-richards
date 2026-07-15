"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, LoginState } from "./actions";

const initialState: LoginState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="flex flex-1 items-center justify-center bg-navy-950 px-6 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-paper-0 p-8 shadow-xl">
        <h1 className="font-display text-xl font-semibold text-navy-950">
          Log in
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Welcome back. Log in to your account.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
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
              autoFocus
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
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
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
            className="w-full rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:opacity-60"
          >
            {pending ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-ink-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-navy-950 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
