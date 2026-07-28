"use client";

import { useEffect, useState } from "react";

export default function MaintenanceModeToggle() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/maintenance")
      .then((res) => res.json())
      .then((data) => setEnabled(Boolean(data.maintenance_mode)));
  }, []);

  async function confirmToggle() {
    setSaving(true);
    setErrorMessage(null);

    const response = await fetch("/api/admin/maintenance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maintenance_mode: !enabled }),
    });

    setSaving(false);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setErrorMessage(body.error ?? "Couldn't save changes. Please try again.");
      return;
    }

    setEnabled((current) => !current);
    setConfirming(false);
  }

  if (enabled === null) {
    return <p className="text-sm text-ink-500">Loading maintenance mode…</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
          enabled ? "bg-red-100 text-red-700" : "bg-iron-100 text-iron-700"
        }`}
      >
        {enabled ? "Maintenance mode is ON" : "Maintenance mode is off"}
      </span>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-navy-950/5"
        >
          {enabled ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
        </button>
      ) : (
        <>
          <span className="text-xs text-ink-700">
            {enabled
              ? "Turn maintenance mode off?"
              : "This takes the whole site down for visitors — are you sure?"}
          </span>
          <button
            onClick={confirmToggle}
            disabled={saving}
            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Confirm"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={saving}
            className="text-xs font-medium text-ink-500 hover:text-navy-950"
          >
            Cancel
          </button>
        </>
      )}

      {errorMessage && <span className="text-xs text-red-600">{errorMessage}</span>}
    </div>
  );
}
