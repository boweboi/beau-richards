const CONTACT_EMAIL = "beaurichards01@gmail.com";

export default function CareersPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Careers
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          We&apos;re not hiring yet.
        </h1>
        <p className="mt-4 text-ink-700">
          TradeMatch NZ is just getting started, and there are no open
          roles right now. If that changes, we&apos;ll list them here — but
          if you&apos;d like to reach out anyway, we&apos;d love to hear
          from you.
        </p>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-8 inline-flex items-center justify-center rounded-md border border-line px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-navy-950/5"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </main>
  );
}
