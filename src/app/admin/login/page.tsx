"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-6">
      <div className="w-full max-w-sm rounded-2xl bg-paper-0 p-8 shadow-xl">
        <h1 className="font-display text-xl font-semibold text-navy-950">
          Admin sign in
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Enter the admin password to edit your site.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-ink-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoFocus
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
