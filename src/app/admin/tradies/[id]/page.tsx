"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { TRADE_CATEGORIES, isRegulatedTrade } from "@/lib/tradeCategories";
import { getVerificationTier, type VerificationTier } from "@/lib/verificationTier";
import VerificationBadge from "@/components/VerificationBadge";

type QualificationDocument = {
  id: string;
  file_name: string;
  created_at: string;
  url: string | null;
};

type Purchase = {
  id: string;
  job_id: string;
  amount_cents: number;
  engagement_status: string;
  paid_at: string | null;
  jobs: { title: string; region: string; town: string } | null;
};

type Review = {
  id: string;
  created_at: string;
  homeowner_name: string;
  job_title: string | null;
  communication_rating: number;
  quality_rating: number;
  timeliness_rating: number;
  value_rating: number;
  professionalism_rating: number;
  overall_rating: number;
};

type Tradie = {
  id: string;
  full_name: string;
  email: string;
  business_name: string | null;
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
  created_at: string;
  deactivated: boolean;
  service_areas: { region: string; town: string }[];
  qualification_documents: QualificationDocument[];
  purchases: Purchase[];
  reviews: Review[];
  review_count: number;
  average_rating: number | null;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amountCents: number) {
  return `$${(amountCents / 100).toFixed(0)}`;
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

// Tier is entirely computed from real data (see src/lib/verificationTier.ts)
// — Silver/Gold require actual review volume and rating that no admin
// button can grant, so this only ever describes what's still missing.
function tierProgress(tradie: Tradie): string {
  const tier = tierOf(tradie);
  const avg = tradie.average_rating;

  if (tier === "none") {
    return "Not yet verified — waiting on the tradie to confirm their email.";
  }
  if (tier === "gold") {
    return "Fully verified — Gold tier.";
  }
  if (tier === "silver") {
    const missing: string[] = [];
    if (tradie.review_count < 10) missing.push(`${10 - tradie.review_count} more review(s)`);
    if (avg === null || avg < 4.5) missing.push("a 4.5+ average rating");
    return `${tradie.review_count} review(s), ${avg !== null ? avg.toFixed(1) : "—"}★ avg — needs ${missing.join(" and ")} to reach Gold.`;
  }

  const missing: string[] = [];
  if (!tradie.nzbn_verified) missing.push("NZBN verification");
  if (tradie.review_count < 3) missing.push(`${3 - tradie.review_count} more review(s)`);
  if (avg === null || avg < 4.0) missing.push("a 4.0+ average rating");
  return missing.length > 0
    ? `Needs ${missing.join(", ")} to reach Silver.`
    : "Eligible for Silver.";
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

export default function AdminTradieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [tradie, setTradie] = useState<Tradie | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [businessForm, setBusinessForm] = useState({
    business_name: "",
    trade_type: "",
    phone: "",
    nzbn: "",
    lbp_number: "",
  });
  const [businessSaved, setBusinessSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/tradies/${id}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setTradie(data.tradie);
        setBusinessForm({
          business_name: data.tradie.business_name ?? "",
          trade_type: data.tradie.trade_type ?? "",
          phone: data.tradie.phone ?? "",
          nzbn: data.tradie.nzbn ?? "",
          lbp_number: data.tradie.lbp_number ?? "",
        });
      });
  }, [id]);

  async function patchTradie(patch: Record<string, unknown>) {
    setBusy(true);
    setError(null);

    const response = await fetch(`/api/admin/tradies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });

    setBusy(false);

    if (!response.ok) {
      setError("Failed — try again.");
      return false;
    }

    setTradie((current) => (current ? { ...current, ...patch } : current));
    return true;
  }

  async function saveBusinessDetails() {
    if (!tradie) return;

    // Changing the NZBN value clears nzbn_verified — otherwise a tradie
    // could swap in a different number while keeping an admin's earlier
    // verification (same rule as the tradie-facing business details form).
    const nzbnChanged = (tradie.nzbn ?? "") !== businessForm.nzbn;

    const saved = await patchTradie({
      business_name: businessForm.business_name || null,
      trade_type: businessForm.trade_type || null,
      phone: businessForm.phone || null,
      nzbn: businessForm.nzbn || null,
      lbp_number: businessForm.lbp_number || null,
      ...(nzbnChanged ? { nzbn_verified: false } : {}),
    });

    if (saved) {
      setBusinessSaved(true);
      setTimeout(() => setBusinessSaved(false), 2000);
    }
  }

  if (notFound) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink-500">That tradie account couldn&apos;t be found.</p>
      </main>
    );
  }

  if (!tradie) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink-500">Loading…</p>
      </main>
    );
  }

  const tier = tierOf(tradie);
  const upgrade = nextTierUpgrade(tradie);

  return (
    <main className="min-h-screen bg-paper pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper-0 px-6 py-4">
        <div>
          <Link href="/admin/tradies" className="text-xs font-medium text-ink-500 hover:text-navy-950">
            ← All tradies
          </Link>
          <h1 className="mt-1 font-display text-lg font-semibold text-navy-950">
            {tradie.full_name}
            {tradie.deactivated && (
              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                Deactivated
              </span>
            )}
          </h1>
          <p className="text-xs text-ink-500">{tradie.email}</p>
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

      <div className="mx-auto mt-8 max-w-3xl space-y-8 px-6">
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Verification tier */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-navy-950">Verification tier</h2>
          <div className="mt-3">
            {tier !== "none" ? (
              <VerificationBadge tier={tier} />
            ) : (
              <span className="text-sm text-ink-500">Not verified</span>
            )}
          </div>
          <p className="mt-3 text-sm text-ink-700">{tierProgress(tradie)}</p>
        </section>

        {/* Verification actions */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Verification actions
          </h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={tradie.email_verified}
                disabled={busy}
                onChange={(e) => patchTradie({ email_verified: e.target.checked })}
                className="accent-navy-950"
              />
              Email verified
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={tradie.phone_verified}
                disabled={busy}
                onChange={(e) => patchTradie({ phone_verified: e.target.checked })}
                className="accent-navy-950"
              />
              Phone verified
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={tradie.nzbn_verified}
                disabled={busy}
                onChange={(e) => patchTradie({ nzbn_verified: e.target.checked })}
                className="accent-navy-950"
              />
              NZBN verified
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={tradie.qualifications_checked}
                disabled={busy}
                onChange={(e) => patchTradie({ qualifications_checked: e.target.checked })}
                className="accent-navy-950"
              />
              Qualifications checked
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {upgrade && (
              <button
                onClick={() => patchTradie(upgrade.patch)}
                disabled={busy}
                className="rounded-md bg-hivis-500 px-3 py-1.5 text-xs font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:opacity-60"
              >
                {upgrade.label}
              </button>
            )}
            <button
              onClick={() => patchTradie({ deactivated: !tradie.deactivated })}
              disabled={busy}
              className="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-navy-950/5 disabled:opacity-60"
            >
              {tradie.deactivated ? "Reactivate" : "Deactivate"}
            </button>
          </div>
        </section>

        {/* Business details */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-navy-950">Business details</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-700">Business name</label>
              <input
                type="text"
                value={businessForm.business_name}
                onChange={(e) =>
                  setBusinessForm((f) => ({ ...f, business_name: e.target.value }))
                }
                className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700">Trade</label>
              <select
                value={businessForm.trade_type}
                onChange={(e) => setBusinessForm((f) => ({ ...f, trade_type: e.target.value }))}
                className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
              >
                <option value="">—</option>
                {TRADE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700">Phone</label>
              <input
                type="tel"
                value={businessForm.phone}
                onChange={(e) => setBusinessForm((f) => ({ ...f, phone: e.target.value }))}
                className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700">NZBN number</label>
              <input
                type="text"
                value={businessForm.nzbn}
                onChange={(e) => setBusinessForm((f) => ({ ...f, nzbn: e.target.value }))}
                className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
              />
              <p className="mt-1 text-xs text-ink-500">
                Changing this clears NZBN verification until it&apos;s re-checked.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700">LBP number</label>
              <input
                type="text"
                value={businessForm.lbp_number}
                onChange={(e) => setBusinessForm((f) => ({ ...f, lbp_number: e.target.value }))}
                className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
              />
            </div>

            {tradie.service_areas.length > 0 && (
              <div>
                <span className="block text-sm font-medium text-ink-700">Service areas</span>
                <p className="mt-1 text-sm text-ink-500">
                  {tradie.service_areas.map((a) => `${a.town}, ${a.region}`).join(" · ")}
                </p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={saveBusinessDetails}
                disabled={busy}
                className="rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save business details"}
              </button>
              {businessSaved && <p className="text-sm text-iron-600">Saved ✓</p>}
            </div>
          </div>
        </section>

        {/* Qualifications */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-navy-950">Qualifications</h2>
          <label className="mt-4 flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={tradie.has_level4_qualification}
              disabled={busy}
              onChange={(e) => patchTradie({ has_level4_qualification: e.target.checked })}
              className="accent-navy-950"
            />
            Has Level 4 qualification
          </label>

          <div className="mt-4">
            {tradie.qualification_documents.length === 0 ? (
              <p className="text-sm text-ink-500">No documents uploaded.</p>
            ) : (
              <ul className="space-y-1">
                {tradie.qualification_documents.map((document) => (
                  <li key={document.id} className="text-sm">
                    {document.url ? (
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-navy-950 underline"
                      >
                        {document.file_name}
                      </a>
                    ) : (
                      <span className="text-ink-500">{document.file_name}</span>
                    )}
                    <span className="ml-2 text-xs text-ink-500">
                      {formatDate(document.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Purchased leads */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-navy-950">Purchased leads</h2>
          {tradie.purchases.length === 0 ? (
            <p className="mt-4 text-sm text-ink-500">No leads purchased yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {tradie.purchases.map((purchase) => (
                <li key={purchase.id} className="rounded-lg border border-line p-4">
                  <p className="font-medium text-navy-950">
                    {purchase.jobs?.title ?? "Job no longer available"}
                  </p>
                  {purchase.jobs && (
                    <p className="text-sm text-ink-500">
                      {purchase.jobs.town}, {purchase.jobs.region}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                    <span>Paid: {formatAmount(purchase.amount_cents)}</span>
                    <span>
                      Purchased:{" "}
                      {purchase.paid_at ? formatDate(purchase.paid_at) : "—"}
                    </span>
                    <span>Status: {purchase.engagement_status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Homeowner reviews */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Homeowner reviews
            <span className="ml-2 text-sm font-normal text-ink-500">
              ({tradie.review_count}
              {tradie.average_rating !== null ? `, ${tradie.average_rating.toFixed(1)}★ avg` : ""})
            </span>
          </h2>
          {tradie.reviews.length === 0 ? (
            <p className="mt-4 text-sm text-ink-500">No reviews yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {tradie.reviews.map((review) => (
                <li key={review.id} className="rounded-lg border border-line p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-navy-950">{review.homeowner_name}</p>
                    <span className="text-xs text-ink-500">{formatDate(review.created_at)}</span>
                  </div>
                  {review.job_title && (
                    <p className="text-sm text-ink-500">{review.job_title}</p>
                  )}
                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-ink-700 sm:grid-cols-3">
                    <div>Communication: {review.communication_rating}★</div>
                    <div>Quality: {review.quality_rating}★</div>
                    <div>Timeliness: {review.timeliness_rating}★</div>
                    <div>Value: {review.value_rating}★</div>
                    <div>Professionalism: {review.professionalism_rating}★</div>
                    <div className="font-semibold">Overall: {review.overall_rating.toFixed(1)}★</div>
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
