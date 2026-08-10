import type { Metadata } from "next";
import { Suspense } from "react";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign Up | Join TradieMatch as a Homeowner or Tradie",
  description:
    "Create a free TradieMatch account as a homeowner to post jobs, or as a tradie to browse and quote on local work.",
};

// SignupForm reads ?role= via useSearchParams(), which requires a Suspense
// boundary here — without one, a static production build fails with
// "Missing Suspense boundary with useSearchParams".
export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center bg-navy-950 px-6 py-12">
          <div className="w-full max-w-sm rounded-2xl bg-paper-0 p-8 shadow-xl">
            <p className="text-sm text-ink-500">Loading…</p>
          </div>
        </main>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
