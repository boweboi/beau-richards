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

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/tradie-dashboard";

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
    <div className="w-full max-w-sm rounded-2xl border border-line bg-paper-0 p-8 shadow-sm">
      {status === "loading" && (
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-line border-t-navy-950"></div>
          <h1 className="font-display text-xl font-semibold text-navy-950">
            Verifying your email
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Please wait while we confirm your email address…
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="font-display text-xl font-semibold text-navy-950">
            Email verified!
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Thank you for verifying your email. Redirecting you now…
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="font-display text-xl font-semibold text-navy-950">
            Verification failed
          </h1>
          <p className="mt-2 text-sm text-ink-500">{errorMessage}</p>
          <p className="mt-4 text-xs text-ink-500">
            The link may have expired. Please check your email for a new verification link,
            or try signing up again.
          </p>
        </div>
      )}
    </div>
  );
}
