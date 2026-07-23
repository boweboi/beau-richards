import type { Metadata } from "next";
import Link from "next/link";

const CONTACT_EMAIL = "beaurichards01@gmail.com";

export const metadata: Metadata = {
  title: "Homeowner Terms and Conditions | TradieMatch",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    heading: "1. Who this applies to",
    body: `These terms apply to you if you create a homeowner account on
      TradieMatch. By creating an account and posting a job, you agree
      to these terms.`,
  },
  {
    heading: "2. Eligibility",
    body: `To create a homeowner account you must be at least 18 years
      old, a resident of New Zealand, and either the owner of the
      property the job relates to or otherwise authorised to arrange
      the work (for example, a tenant with the landlord's permission,
      or a property manager).`,
  },
  {
    heading: "3. Account creation and accuracy",
    body: `You agree to provide accurate information when you sign up —
      your name, email address, and contact details — and to keep your
      login credentials secure. You're responsible for activity that
      happens under your account.`,
  },
  {
    heading: "4. Posting a job",
    body: `Posting a job is free. Job descriptions must be accurate —
      describe the work you actually need done. Don't post spam,
      duplicate listings, or jobs that involve illegal or unsafe work.
      We may remove a job listing that breaches this.`,
  },
  {
    heading: "5. Your contact information",
    body: `Your contact details are not shown to a tradie until they pay
      to unlock that job as a lead. A tradie who misuses your contact
      information — for anything other than discussing the job you
      posted — may have their account suspended.`,
  },
  {
    heading: "6. Your responsibilities",
    body: `You agree to communicate honestly with tradies who respond to
      your job, to respond to messages in a reasonably timely way, and
      not to use the platform to make contact with a tradie and then
      arrange payment or future work off-platform specifically to avoid
      the lead system.`,
  },
  {
    heading: "7. Limitation of liability",
    body: `TradieMatch is a marketplace that connects you with
      tradies — we are not a party to any agreement you make with a
      tradie. We're not responsible for the quality, safety, or outcome
      of any work carried out, or for disputes between you and a
      tradie. You're responsible for satisfying yourself that a tradie
      is suitable for your job before hiring them.`,
  },
  {
    heading: "8. Prohibited conduct",
    body: `You may not harass or abuse tradies who respond to your job,
      post spam or fake job listings, or attempt to bypass the lead
      system (for example, by repeatedly posting the same job to avoid
      tradies needing to pay to respond).`,
  },
  {
    heading: "9. Governing law",
    body: `These terms are governed by the laws of New Zealand.`,
  },
  {
    heading: "10. Contact",
    body: `Questions about these terms? Email us.`,
  },
];

export default function TermsHomeownerPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/signup"
          className="text-sm font-medium text-ink-700 hover:text-navy-950"
        >
          ← Back to sign up
        </Link>

        <div className="mt-6 rounded-xl border border-hivis-500/40 bg-hivis-500/10 p-4 text-sm text-navy-950">
          <p className="font-semibold">Draft — not reviewed by a lawyer.</p>
          <p className="mt-1 text-ink-700">
            This is a plain-language starter template, not final legal
            advice. It should be reviewed by a lawyer before the platform
            takes real signups.
          </p>
        </div>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Terms &amp; conditions
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Homeowner terms and conditions
        </h1>
        <p className="mt-2 text-sm text-ink-500">Last updated: draft version.</p>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-lg font-semibold text-navy-950">
                {section.heading}
              </h2>
              <p className="mt-2 text-ink-700">{section.body}</p>
            </div>
          ))}
        </div>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-2 inline-block text-sm font-medium text-navy-950 underline"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </main>
  );
}
