"use client";

import { useEffect, useState } from "react";
import { isRegulatedTrade } from "@/lib/tradeCategories";
import { getVerificationTier, type VerificationTier } from "@/lib/verificationTier";
import VerificationBadge from "@/components/VerificationBadge";

type Tradie = {
  id: string;
  full_name: string;
  email: string;
  trade_type: string | null;
  phone_verified: boolean;
  email_verified: boolean;
  nzbn_verified: boolean;
  lbp_number: string | null;
  has_level4_qualification: boolean;
  qualifications_checked: boolean;
  review_count: number;
  average_rating: number | null;
  created_at: string;
  deactivated: boolean;
  leads_purchased_count: number;
  qualification_documents: {
    id: string;
    file_name: string;
    created_at: string;
    url: string | null;
  }[];
};

type Counts = { tradies: number; homeowners: number };

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function tierOf(tradie: Tradie): VerificationTier {
  return getVerificationTier({
    regulated: isRegulatedTrade(tradie.trade_type),
    emailVerified: tradie.email_verified,
    phoneVerified: tradie.phone_verified,
    nzbnVerified: tradie.nzbn_verified,
    qualificationsChecked: tradie.qualifications_checked,
    hasLevel4Qualification: tradie.has_level4_qualification,
    lbpNumber: tradie.lbp_number,
    reviewCount: tradie.review_count,
    averageRating: tradie.average_rating,
  });
}

// The next tier up is only ever unlocked by setting the fields an admin
// can actually vouch for (email/phone/NZBN verified, qualifications
// checked) — Silver/Gold also require real review volume/rating, which
// no button can grant. When nothing togglable is left, there's no
// shortcut to offer.
function nextTierUpgrade(tradie: Tradie): { label: string; patch: Partial<Tradie> } | null {
  const tier = tierOf(tradie);
  const regulated = isRegulatedTrade(tradie.trade_type);

  if (tier === "none") {
    return regulated
      ? {
          label: "Verify for Bronze",
          patch: {
            email_verified: true,
            phone_verified: true,
            has_level4_qualification: true,
            qualifications_checked: true,
          },
        }
      : {
          label: "Verify for Bronze",
          patch: { email_verified: true, phone_verified: true },
        };
  }

  if (tier === "bronze" && !tradie.nzbn_verified) {
    return { label: "Verify NZBN (Silver)", patch: { nzbn_verified: true } };
  }

  return null;
}

export default function AdminTradiesPage() {
  const [tradies, setTradies] = useState<Tradie[] | null>(null);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/tradies")
      .then((res) => res.json())
      .then((data) => {
        setTradies(data.tradies);
        setCounts(data.counts);
      });
  }, []);

  async function patchTradie(id: string, patch: Partial<Tradie>) {
    setBusyId(id);
    setErrorId(null);

    const response = await fetch(`/api/admin/tradies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });

    setBusyId(null);

    if (!response.ok) {
      setErrorId(id);
      return;
    }

    setTradies((current) =>
      current
        ? current.map((tradie) => (tradie.id === id ? { ...tradie, ...patch } : tradie))
        : current
    );
  }

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
          <a
            href="/admin/homeowners"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            Homeowners →
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
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-500">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Trade</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Signed up</th>
                <th className="px-4 py-3 font-medium">Leads purchased</th>
                <th className="px-4 py-3 font-medium">Tier</th>
                <th className="px-4 py-3 font-medium">Qualification docs</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tradies.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-ink-500">
                    No tradie accounts yet.
                  </td>
                </tr>
              )}
              {tradies.map((tradie) => {
                const tier = tierOf(tradie);
                const upgrade = nextTierUpgrade(tradie);
                const busy = busyId === tradie.id;

                return (
                  <tr key={tradie.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-medium text-navy-950">
                      {tradie.full_name}
                      {tradie.deactivated && (
                        <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                          Deactivated
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-700">{tradie.trade_type ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-700">{tradie.email}</td>
                    <td className="px-4 py-3 text-ink-500">{formatDate(tradie.created_at)}</td>
                    <td className="px-4 py-3 text-ink-700">{tradie.leads_purchased_count}</td>
                    <td className="px-4 py-3">
                      {tier !== "none" ? (
                        <VerificationBadge tier={tier} />
                      ) : (
                        <span className="text-xs text-ink-500">Not verified</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {tradie.qualification_documents.length === 0 ? (
                        <span className="text-xs text-ink-500">None uploaded</span>
                      ) : (
                        <ul className="space-y-1">
                          {tradie.qualification_documents.map((document) => (
                            <li key={document.id}>
                              {document.url ? (
                                <a
                                  href={document.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-medium text-navy-950 underline"
                                >
                                  {document.file_name}
                                </a>
                              ) : (
                                <span className="text-xs text-ink-500">{document.file_name}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="flex items-center gap-1.5 text-xs text-ink-700">
                          <input
                            type="checkbox"
                            checked={tradie.qualifications_checked}
                            disabled={busy}
                            onChange={(event) =>
                              patchTradie(tradie.id, {
                                qualifications_checked: event.target.checked,
                              })
                            }
                            className="accent-navy-950"
                          />
                          Qualifications checked
                        </label>
                        {upgrade && (
                          <button
                            onClick={() => patchTradie(tradie.id, upgrade.patch)}
                            disabled={busy}
                            className="rounded-md bg-hivis-500 px-3 py-1.5 text-xs font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:opacity-60"
                          >
                            {upgrade.label}
                          </button>
                        )}
                        <button
                          onClick={() =>
                            patchTradie(tradie.id, { deactivated: !tradie.deactivated })
                          }
                          disabled={busy}
                          className="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-navy-950/5 disabled:opacity-60"
                        >
                          {tradie.deactivated ? "Reactivate" : "Deactivate"}
                        </button>
                        {errorId === tradie.id && (
                          <span className="text-xs text-red-600">Failed — try again.</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
