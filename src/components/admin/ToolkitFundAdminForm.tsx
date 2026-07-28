"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured, MEDIA_BUCKET } from "@/lib/supabaseClient";
import { TOOLKIT_FUND_TARGET, type ToolkitDonation } from "@/lib/toolkitFund";
import ToolkitFundThermometer from "@/components/ToolkitFundThermometer";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

type FormState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "error"; message: string };

export default function ToolkitFundAdminForm() {
  const [amount, setAmount] = useState<number | null>(null);
  const [donations, setDonations] = useState<ToolkitDonation[]>([]);
  const [caption, setCaption] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<FormState>({ status: "idle" });

  useEffect(() => {
    loadFund();
  }, []);

  function loadFund() {
    fetch("/api/admin/toolkit-fund")
      .then((res) => res.json())
      .then((data) => {
        setAmount(Number(data.toolkit_fund_amount ?? 0));
        setDonations(Array.isArray(data.toolkit_donations) ? data.toolkit_donations : []);
      });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setState({ status: "error", message: "Please choose a photo to upload." });
      return;
    }
    if (!caption.trim()) {
      setState({ status: "error", message: "Please add a caption." });
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setState({ status: "error", message: "Only PNG, JPG, or WebP images are allowed." });
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setState({ status: "error", message: "That image is over 5MB. Please choose a smaller file." });
      return;
    }
    if (!isSupabaseConfigured) {
      setState({ status: "error", message: "Supabase isn't configured — check .env.local." });
      return;
    }

    setState({ status: "uploading" });

    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `toolkit/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, { contentType: file.type, cacheControl: "3600" });

    if (uploadError) {
      setState({ status: "error", message: `Upload failed: ${uploadError.message}` });
      return;
    }

    const { data: publicUrlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

    const response = await fetch("/api/admin/toolkit-fund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo_url: publicUrlData.publicUrl, caption: caption.trim() }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setState({ status: "error", message: body.error ?? "Couldn't record the donation." });
      return;
    }

    setState({ status: "idle" });
    setCaption("");
    setFile(null);
    setSelectedFileName(null);
    loadFund();
  }

  if (amount === null) {
    return <p className="text-sm text-ink-500">Loading toolkit fund…</p>;
  }

  const reachedTarget = amount >= TOOLKIT_FUND_TARGET;

  return (
    <div className="space-y-6">
      <ToolkitFundThermometer amount={amount} />

      <form onSubmit={handleSubmit} className="rounded-xl border border-line p-4">
        <p className="text-sm font-semibold text-ink-700">
          Record a funded toolkit
        </p>
        <p className="mt-1 text-xs text-ink-500">
          {reachedTarget
            ? "The fund has hit the target — upload the toolkit photo below to log it and reset the fund to $0."
            : "You can log a donation early if needed — submitting always resets the fund to $0."}
        </p>

        <div className="mt-4">
          <label className="block text-sm font-medium text-ink-700">Photo</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const chosen = event.target.files?.[0] ?? null;
              setFile(chosen);
              setSelectedFileName(chosen?.name ?? null);
            }}
            className="mt-1 text-sm"
          />
          {selectedFileName && (
            <p className="mt-1 text-xs text-ink-500">{selectedFileName}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-ink-700">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="e.g. A new toolkit for Sam, a first-year builder in Hamilton"
            className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
          />
        </div>

        {state.status === "error" && (
          <p className="mt-3 text-xs text-red-600">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={state.status === "uploading"}
          className="mt-4 rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:opacity-60"
        >
          {state.status === "uploading" ? "Uploading…" : "Log toolkit & reset fund"}
        </button>
      </form>

      {donations.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-ink-700">Past toolkits</p>
          <ul className="mt-2 space-y-1">
            {donations.map((donation, index) => (
              <li key={`${donation.photo_url}-${index}`} className="text-xs text-ink-500">
                {new Date(donation.funded_at).toLocaleDateString("en-NZ")} — {donation.caption}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
