const CONTACT_EMAIL = "support@tradematchnz.co.nz";

export default function ContactPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Contact
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Get in touch.
        </h1>
        <p className="mt-4 text-ink-700">
          Got a question, a problem, or feedback for us? Email us and
          we&apos;ll get back to you.
        </p>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-8 inline-flex items-center justify-center rounded-md bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-900"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </main>
  );
}
