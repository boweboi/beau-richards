"use client";

import { useEffect, useState } from "react";
import { isRegulatedTrade } from "@/lib/tradeCategories";
import { getVerificationTier } from "@/lib/verificationTier";
import VerificationBadge from "@/components/VerificationBadge";

type Tradie = {
  id: string;
  full_name: string;
  email: string;
  trade_type: string | null;
  service_region: string | null;
  phone: string | null;
  phone_verified: boolean;
  email_verified: boolean;
  nzbn: string | null;
  nzbn_verified: boolean;
  lbp_number: string | null;
  has_level4_qualification: boolean;
  qualifications_checked: boolean;
  review_count: number;
};

export default function AdminTradiesPage() {
  const [tradies, setTradies] = useState<Tradie[] | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/tradies")
      .then((res) => res.json())
      .then((data) => setTradies(data.tradies));
  }, []);

  function updateRow(id: string, patch: Partial<Tradie>) {
    setTradies((current) =>
      current
        ? current.map((tradie) =>
            tradie.id === id ? { ...tradie, ...patch } : tradie
          )
        : current
    );
  }

  async function handleSave(tradie: Tradie) {
    setSavingId(tradie.id);
    setErrorId(null);

    const response = await fetch(`/api/admin/tradies/${tradie.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: tradie.phone,
        phone_verified: tradie.phone_verified,
        email_verified: tradie.email_verified,
        nzbn: tradie.nzbn,
        nzbn_verified: tradie.nzbn_verified,
        lbp_number: tradie.lbp_number,
        has_level4_qualification: tradie.has_level4_qualification,
        qualifications_checked: tradie.qualifications_checked,
        review_count: tradie.review_count,
      }),
    });

    setSavingId(null);

    if (!response.ok) {
      setErrorId(tradie.id);
      return;
    }

    setSavedId(tradie.id);
    setTimeout(() => setSavedId(null), 2000);
  }

  if (!tradies) {
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
          <h1 className="font-display text-lg font-semibold text-navy-950">
            Tradie verification
          </h1>
          <p className="text-xs text-ink-500">
            Badges update automatically as you check boxes below.
          </p>
        </div>
        <a
          href="/admin/dashboard"
          className="text-sm font-medium text-ink-700 hover:text-navy-950"
        >
          ← Site content
        </a>
      </header>

      <div className="mx-auto mt-8 max-w-3xl space-y-6 px-6">
        {tradies.length === 0 && (
          <p className="text-sm text-ink-500">No tradie accounts yet.</p>
        )}

        {tradies.map((tradie) => {
          const regulated = isRegulatedTrade(tradie.trade_type);
          const tier = getVerificationTier({
            tradeType: tradie.trade_type,
            emailVerified: tradie.email_verified,
            phoneVerified: tradie.phone_verified,
            nzbnVerified: tradie.nzbn_verified,
            qualificationsChecked: tradie.qualifications_checked,
            hasLevel4Qualification: tradie.has_level4_qualification,
            lbpNumber: tradie.lbp_number,
            reviewCount: tradie.review_count,
          });

          return (
            <section
              key={tradie.id}
              className="rounded-2xl bg-paper-0 p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-base font-semibold text-navy-950">
                    {tradie.full_name}
                  </h2>
                  <p className="text-xs text-ink-500">{tradie.email}</p>
                  <p className="mt-1 text-xs text-ink-500">
                    {tradie.trade_type ?? "No trade set"}
                    {regulated ? " · Regulated trade" : ""}
                  </p>
                </div>
                {tier !== "none" ? (
                  <VerificationBadge tier={tier} />
                ) : (
                  <span className="text-xs text-ink-500">Not yet verified</span>
                )}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field
                  label="Phone"
                  value={tradie.phone ?? ""}
                  onChange={(v) => updateRow(tradie.id, { phone: v || null })}
                />
                <Field
                  label="NZBN"
                  value={tradie.nzbn ?? ""}
                  onChange={(v) => updateRow(tradie.id, { nzbn: v || null })}
                />
                {regulated && (
                  <Field
                    label="LBP number"
                    value={tradie.lbp_number ?? ""}
                    onChange={(v) =>
                      updateRow(tradie.id, { lbp_number: v || null })
                    }
                  />
                )}
                <Field
                  label="Review count"
                  type="number"
                  value={String(tradie.review_count)}
                  onChange={(v) =>
                    updateRow(tradie.id, {
                      review_count: Math.max(0, Number(v) || 0),
                    })
                  }
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                <Checkbox
                  label="Email verified"
                  checked={tradie.email_verified}
                  onChange={(v) => updateRow(tradie.id, { email_verified: v })}
                />
                <Checkbox
                  label="Phone verified"
                  checked={tradie.phone_verified}
                  onChange={(v) => updateRow(tradie.id, { phone_verified: v })}
                />
                <Checkbox
                  label="NZBN verified"
                  checked={tradie.nzbn_verified}
                  onChange={(v) => updateRow(tradie.id, { nzbn_verified: v })}
                />
                {regulated && (
                  <>
                    <Checkbox
                      label="Has Level 4 qualification"
                      checked={tradie.has_level4_qualification}
                      onChange={(v) =>
                        updateRow(tradie.id, { has_level4_qualification: v })
                      }
                    />
                    <Checkbox
                      label="Qualifications checked"
                      checked={tradie.qualifications_checked}
                      onChange={(v) =>
                        updateRow(tradie.id, { qualifications_checked: v })
                      }
                    />
                  </>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => handleSave(tradie)}
                  disabled={savingId === tradie.id}
                  className="rounded-md bg-navy-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60"
                >
                  {savingId === tradie.id ? "Saving…" : "Save changes"}
                </button>
                {savedId === tradie.id && (
                  <span className="text-sm text-iron-600">Saved ✓</span>
                )}
                {errorId === tradie.id && (
                  <span className="text-sm text-red-600">
                    Couldn&apos;t save. Please try again.
                  </span>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
      />
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-navy-950"
      />
      {label}
    </label>
  );
}
