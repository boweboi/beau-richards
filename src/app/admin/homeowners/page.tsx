"use client";

import { useEffect, useState } from "react";

type Homeowner = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  deactivated: boolean;
};

type Counts = { tradies: number; homeowners: number };

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminHomeownersPage() {
  const [homeowners, setHomeowners] = useState<Homeowner[] | null>(null);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/homeowners")
      .then((res) => res.json())
      .then((data) => {
        setHomeowners(data.homeowners);
        setCounts(data.counts);
      });
  }, []);

  async function toggleDeactivated(homeowner: Homeowner) {
    setBusyId(homeowner.id);
    setErrorId(null);

    const response = await fetch(`/api/admin/homeowners/${homeowner.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deactivated: !homeowner.deactivated }),
    });

    setBusyId(null);

    if (!response.ok) {
      setErrorId(homeowner.id);
      return;
    }

    setHomeowners((current) =>
      current
        ? current.map((h) =>
            h.id === homeowner.id ? { ...h, deactivated: !homeowner.deactivated } : h
          )
        : current
    );
  }

  if (!homeowners || !counts) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink-500">Loading homeowners…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper-0 px-6 py-4">
        <div>
          <h1 className="font-display text-lg font-semibold text-navy-950">Homeowners</h1>
          <p className="text-xs text-ink-500">Manage homeowner accounts.</p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/admin/tradies"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            Tradies →
          </a>
          <a
            href="/admin/dashboard"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            ← Site content
          </a>
        </div>
      </header>

      <div className="mx-auto mt-8 max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-4 sm:max-w-md">
          <div className="rounded-2xl bg-paper-0 p-5 shadow-sm">
            <p className="text-2xl font-semibold text-navy-950">{counts.tradies}</p>
            <p className="text-xs text-ink-500">Active tradies</p>
          </div>
          <div className="rounded-2xl bg-paper-0 p-5 shadow-sm">
            <p className="text-2xl font-semibold text-navy-950">{counts.homeowners}</p>
            <p className="text-xs text-ink-500">Active homeowners</p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl bg-paper-0 shadow-sm">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-500">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Signed up</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {homeowners.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-ink-500">
                    No homeowner accounts yet.
                  </td>
                </tr>
              )}
              {homeowners.map((homeowner) => (
                <tr key={homeowner.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-navy-950">
                    {homeowner.full_name}
                    {homeowner.deactivated && (
                      <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        Deactivated
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-700">{homeowner.email}</td>
                  <td className="px-4 py-3 text-ink-500">{formatDate(homeowner.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleDeactivated(homeowner)}
                        disabled={busyId === homeowner.id}
                        className="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-navy-950/5 disabled:opacity-60"
                      >
                        {homeowner.deactivated ? "Reactivate" : "Deactivate"}
                      </button>
                      {errorId === homeowner.id && (
                        <span className="text-xs text-red-600">Failed — try again.</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
