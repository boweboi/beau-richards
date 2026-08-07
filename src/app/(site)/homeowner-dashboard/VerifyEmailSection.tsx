import { resendHomeownerVerification } from "./actions";

export default function VerifyEmailSection({
  email,
  resent,
}: {
  email: string;
  resent: boolean;
}) {
  return (
    <div className="rounded-2xl border border-hivis-500/40 bg-hivis-500/5 p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold text-navy-950">
        Verify your email
      </h2>
      <p className="mt-1 text-sm text-ink-700">
        We sent a verification link to {email}. Click it to activate your
        account — you&apos;ll need to verify before you can post a job.
      </p>

      {resent && (
        <p className="mt-3 rounded-md bg-hivis-500/10 px-3 py-2 text-sm text-navy-950">
          Verification email resent — check your inbox.
        </p>
      )}

      <form action={resendHomeownerVerification} className="mt-4">
        <button
          type="submit"
          className="rounded-md bg-hivis-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
        >
          Resend verification email
        </button>
      </form>
    </div>
  );
}
