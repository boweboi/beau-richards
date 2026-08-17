import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Account Deactivated | TradieMatch",
  description: "Your TradieMatch account has been deactivated.",
  robots: { index: false, follow: false },
};

export default function AccountDeactivatedPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-paper px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-paper-0 p-8 text-center shadow-sm">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Account access
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-navy-950">
          Your account has been deactivated
        </h1>
        <p className="mt-4 text-sm leading-6 text-ink-700">
          Access to your account and features is blocked while your account is deactivated.
          Please contact support if you think this is a mistake.
        </p>
        <Link
          href="mailto:support@tradiematch.co.nz"
          className="mt-6 inline-flex rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
        >
          Contact support
        </Link>
      </div>
    </main>
  );
}
