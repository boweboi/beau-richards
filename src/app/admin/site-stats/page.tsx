"use client";

import { useEffect, useState } from "react";
import ToolkitFundAdminForm from "@/components/admin/ToolkitFundAdminForm";

type SiteStats = {
  verified_tradies: number;
  jobs_completed: number;
};

export default function AdminSiteStatsPage() {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/site-stats")
      .then((res) => res.json())
      .then((data) => setStats(data.stats));
  }, []);

  async function handleSave() {
    if (!stats) return;

    setStatus("saving");
    setErrorMessage(null);

    const response = await fetch("/api/admin/site-stats", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stats),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setStatus("error");
      setErrorMessage(body.error ?? "Couldn't save changes. Please try again.");
      return;
    }

    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  }

  if (!stats) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink-500">Loading site stats…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper-0 px-6 py-4">
        <div>
          <h1 className="font-display text-lg font-semibold text-navy-950">Site stats</h1>
          <p className="text-xs text-ink-500">
            Shown in the trust strip on the home page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status === "saved" && <span className="text-sm text-iron-600">Saved ✓</span>}
          {status === "error" && <span className="text-sm text-red-600">{errorMessage}</span>}
          <a
            href="/admin/dashboard"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            ← Site content
          </a>
          <button
            onClick={handleSave}
            disabled={status === "saving"}
            className="rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:opacity-60"
          >
            {status === "saving" ? "Saving…" : "Save changes"}
          </button>
        </div>
      </header>

      <div className="mx-auto mt-8 max-w-md space-y-4 px-6">
        <div className="rounded-2xl bg-paper-0 p-6 shadow-sm">
          <label className="block text-sm font-medium text-ink-700">Verified Tradies</label>
          <input
            type="number"
            min={0}
            value={stats.verified_tradies}
            onChange={(event) =>
              setStats({ ...stats, verified_tradies: Number(event.target.value) })
            }
            className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
          />
        </div>

        <div className="rounded-2xl bg-paper-0 p-6 shadow-sm">
          <label className="block text-sm font-medium text-ink-700">Jobs Completed</label>
          <input
            type="number"
            min={0}
            value={stats.jobs_completed}
            onChange={(event) =>
              setStats({ ...stats, jobs_completed: Number(event.target.value) })
            }
            className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
          />
        </div>

        <div className="rounded-2xl bg-paper-0 p-6 shadow-sm">
          <h2 className="font-display text-base font-semibold text-navy-950">
            Toolkit fund
          </h2>
          <p className="mt-1 text-xs text-ink-500">
            $2 of every lead purchase, tracked automatically. Log a photo
            when a toolkit is funded to reset it and add it to the
            homepage gallery.
          </p>
          <div className="mt-4">
            <ToolkitFundAdminForm />
          </div>
        </div>
      </div>
    </main>
  );
}
