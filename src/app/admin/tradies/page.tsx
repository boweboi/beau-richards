"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Tradie = {
  id: string;
  full_name: string;
  email: string;
};

type Counts = { tradies: number; homeowners: number };

export default function AdminTradiesPage() {
  const [tradies, setTradies] = useState<Tradie[] | null>(null);
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    fetch("/api/admin/tradies")
      .then((res) => res.json())
      .then((data) => {
        setTradies(data.tradies);
        setCounts(data.counts);
      });
  }, []);

  if (!tradies || !counts) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink-500">Loading tradies…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper-0 px-6 py-4">
        <div>
          <h1 className="font-display text-lg font-semibold text-navy-950">Tradies</h1>
          <p className="text-xs text-ink-500">Manage tradie accounts and verification tiers.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/tradies/by-region"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            By trade &amp; region →
          </Link>
          <Link
            href="/admin/homeowners"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            Homeowners →
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            ← Site content
          </Link>
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
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-500">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
              </tr>
            </thead>
            <tbody>
              {tradies.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-ink-500">
                    No tradie accounts yet.
                  </td>
                </tr>
              )}
              {tradies.map((tradie) => (
                <tr key={tradie.id} className="border-b border-line last:border-0">
                  <td className="p-0">
                    <Link
                      href={`/admin/tradies/${tradie.id}`}
                      className="block px-4 py-3 font-medium text-navy-950 hover:underline"
                    >
                      {tradie.full_name}
                    </Link>
                  </td>
                  <td className="p-0">
                    <Link
                      href={`/admin/tradies/${tradie.id}`}
                      className="block px-4 py-3 text-ink-700"
                    >
                      {tradie.email}
                    </Link>
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
