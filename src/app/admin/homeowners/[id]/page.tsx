"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  category: string;
  region: string;
  town: string;
  status: string;
  created_at: string;
};

type Review = {
  id: string;
  created_at: string;
  tradie_name: string;
  job_title: string | null;
  communication_rating: number;
  quality_rating: number;
  timeliness_rating: number;
  value_rating: number;
  professionalism_rating: number;
  overall_rating: number;
};

type Homeowner = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  deactivated: boolean;
  jobs: Job[];
  reviews: Review[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminHomeownerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [homeowner, setHomeowner] = useState<Homeowner | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/homeowners/${id}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setHomeowner(data.homeowner);
      });
  }, [id]);

  async function toggleDeactivated() {
    if (!homeowner) return;
    setBusy(true);
    setError(null);

    const response = await fetch(`/api/admin/homeowners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deactivated: !homeowner.deactivated }),
    });

    setBusy(false);

    if (!response.ok) {
      setError("Failed — try again.");
      return;
    }

    setHomeowner((current) =>
      current ? { ...current, deactivated: !current.deactivated } : current
    );
  }

  if (notFound) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink-500">That homeowner account couldn&apos;t be found.</p>
      </main>
    );
  }

  if (!homeowner) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper-0 px-6 py-4">
        <div>
          <Link
            href="/admin/homeowners"
            className="text-xs font-medium text-ink-500 hover:text-navy-950"
          >
            ← All homeowners
          </Link>
          <h1 className="mt-1 font-display text-lg font-semibold text-navy-950">
            {homeowner.full_name}
            {homeowner.deactivated && (
              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                Deactivated
              </span>
            )}
          </h1>
          <p className="text-xs text-ink-500">{homeowner.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/tradies"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            Tradies →
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            ← Site content
          </Link>
        </div>
      </header>

      <div className="mx-auto mt-8 max-w-3xl space-y-8 px-6">
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Account status */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-navy-950">Account status</h2>
          <p className="mt-3 text-sm text-ink-700">
            {homeowner.deactivated ? (
              <>This account is deactivated — the homeowner can&apos;t sign in.</>
            ) : (
              <>Active since {formatDate(homeowner.created_at)}.</>
            )}
          </p>
          <button
            onClick={toggleDeactivated}
            disabled={busy}
            className="mt-4 rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-navy-950/5 disabled:opacity-60"
          >
            {busy ? "Saving…" : homeowner.deactivated ? "Reactivate account" : "Deactivate / suspend account"}
          </button>
        </section>

        {/* Job postings */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-navy-950">Job postings</h2>
          {homeowner.jobs.length === 0 ? (
            <p className="mt-4 text-sm text-ink-500">No jobs posted yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {homeowner.jobs.map((job) => (
                <li key={job.id} className="rounded-lg border border-line p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="inline-flex items-center rounded-full bg-navy-900/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-navy-700">
                        {job.category}
                      </span>
                      <p className="mt-1 font-medium text-navy-950">{job.title}</p>
                      <p className="text-sm text-ink-500">
                        {job.town}, {job.region}
                      </p>
                    </div>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="shrink-0 text-sm font-semibold text-navy-950 hover:underline"
                    >
                      View →
                    </Link>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                    <span className="capitalize">Status: {job.status}</span>
                    <span>Posted: {formatDate(job.created_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Reviews left */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Reviews left
            <span className="ml-2 text-sm font-normal text-ink-500">
              ({homeowner.reviews.length})
            </span>
          </h2>
          {homeowner.reviews.length === 0 ? (
            <p className="mt-4 text-sm text-ink-500">No reviews left yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {homeowner.reviews.map((review) => (
                <li key={review.id} className="rounded-lg border border-line p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-navy-950">{review.tradie_name}</p>
                    <span className="text-xs text-ink-500">{formatDate(review.created_at)}</span>
                  </div>
                  {review.job_title && <p className="text-sm text-ink-500">{review.job_title}</p>}
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
