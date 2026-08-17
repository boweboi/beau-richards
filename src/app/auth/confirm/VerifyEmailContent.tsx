"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

async function verifyEmail(
  tokenHash: string,
  type: string,
  origin: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenHash, type }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.error || "Verification failed" };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Verification failed",
    };
  }
}

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/tradie-dashboard";

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const openPreferredBrowser = () => {
    const url = window.location.href;
    const opened = window.open(url, "_blank", "noopener,noreferrer");

    if (!opened) {
      window.location.href = url;
    }
  };

  const copyPageUrl = async () => {
    const url = pageUrl || window.location.href;

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("textarea");
      input.value = url;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.focus();
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!tokenHash || !type) {
      setStatus("error");
      setErrorMessage("Invalid verification link");
      return;
    }

    const verify = async () => {
      const origin = window.location.origin;
      const result = await verifyEmail(tokenHash, type, origin);

      if (result.success) {
        setStatus("success");
        // Redirect after 2 seconds to give user time to see the success message
        setTimeout(() => {
          router.push(next);
        }, 2000);
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Email verification failed. Please try again.");
      }
    };

    verify();
  }, [tokenHash, type, next, router]);

  return (
    <div
      className="w-full max-w-sm rounded-2xl border border-line bg-paper-0 p-8 shadow-sm"
      style={{
        maxWidth: "28rem",
        width: "100%",
        borderRadius: "1rem",
        border: "1px solid #dde5ea",
        backgroundColor: "#ffffff",
        padding: "2rem",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      }}
    >
      {status === "loading" && (
        <div className="text-center" style={{ textAlign: "center" }}>
          <div
            className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-line border-t-navy-950"
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "9999px",
              border: "4px solid #dde5ea",
              borderTopColor: "#0b2035",
              animation: "spin 1s linear infinite",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "1rem",
            }}
          />
          <h1 className="font-display text-xl font-semibold text-navy-950" style={{ fontSize: "1.25rem", fontWeight: 600, color: "#0b2035" }}>
            Verifying your email
          </h1>
          <p className="mt-2 text-sm text-ink-500" style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#5c7286" }}>
            Please wait while we confirm your email address…
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center" style={{ textAlign: "center" }}>
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "9999px",
              backgroundColor: "#dcfce7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "1rem",
            }}
          >
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ width: "1.5rem", height: "1.5rem", color: "#16a34a", stroke: "currentColor" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="font-display text-xl font-semibold text-navy-950" style={{ fontSize: "1.25rem", fontWeight: 600, color: "#0b2035" }}>
            Email verified!
          </h1>
          <p className="mt-2 text-sm text-ink-500" style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#5c7286" }}>
            Thank you for verifying your email. Redirecting you now…
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center" style={{ textAlign: "center" }}>
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100"
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "9999px",
              backgroundColor: "#fee2e2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "1rem",
            }}
          >
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ width: "1.5rem", height: "1.5rem", color: "#dc2626", stroke: "currentColor" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="font-display text-xl font-semibold text-navy-950" style={{ fontSize: "1.25rem", fontWeight: 600, color: "#0b2035" }}>
            Verification failed
          </h1>
          <p className="mt-2 text-sm text-ink-500" style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#5c7286" }}>
            {errorMessage}
          </p>
          <p className="mt-4 text-xs text-ink-500" style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#5c7286" }}>
            The link may have expired. Please check your email for a new verification link,
            or try signing up again.
          </p>
        </div>
      )}
      <div
        style={{
          borderTop: "1px solid #dde5ea",
          marginTop: "2rem",
          paddingTop: "1.5rem",
          textAlign: "center",
        }}
      >
        <p
          className="text-xs text-ink-500"
          style={{ margin: 0, fontSize: "0.75rem", lineHeight: 1.5, color: "#5c7286" }}
        >
          Email apps sometimes display pages incorrectly. Open this page in your preferred
          browser for the best experience.
        </p>
        <button
          type="button"
          onClick={openPreferredBrowser}
          style={{
            width: "100%",
            marginTop: "1rem",
            border: 0,
            borderRadius: "0.375rem",
            backgroundColor: "#ff6a13",
            color: "#0b2035",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 600,
            padding: "0.75rem 1rem",
          }}
        >
          Open in your preferred browser
        </button>
        <label
          htmlFor="verification-page-url"
          style={{
            display: "block",
            marginTop: "1rem",
            marginBottom: "0.375rem",
            textAlign: "left",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#33475a",
          }}
        >
          Or copy this link
        </label>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "stretch" }}>
          <input
            id="verification-page-url"
            type="text"
            value={pageUrl}
            readOnly
            aria-label="Verification page link"
            onFocus={(event) => event.currentTarget.select()}
            style={{
              minWidth: 0,
              flex: 1,
              border: "1px solid #dde5ea",
              borderRadius: "0.375rem",
              backgroundColor: "#f6f8fa",
              color: "#33475a",
              fontSize: "0.6875rem",
              padding: "0.625rem 0.5rem",
            }}
          />
          <button
            type="button"
            onClick={copyPageUrl}
            style={{
              flexShrink: 0,
              border: "1px solid #0b2035",
              borderRadius: "0.375rem",
              backgroundColor: "#ffffff",
              color: "#0b2035",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: 600,
              padding: "0.625rem 0.75rem",
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
