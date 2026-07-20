import type { Metadata } from "next";
import Link from "next/link";

const CONTACT_EMAIL = "beaurichards01@gmail.com";

export const metadata: Metadata = {
  title: "Tradie Terms and Conditions | TradeMatch NZ",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    heading: "1. Who this applies to",
    body: `These terms apply to you if you create a tradie account on
      TradeMatch NZ. By creating an account and purchasing leads, you
      agree to these terms.`,
  },
  {
    heading: "2. Eligibility",
    body: `To create a tradie account you must be at least 18 years old
      and a resident of New Zealand. We may ask you to provide
      information to verify your trade qualification, registration, or
      licensing before or after signup.`,
  },
  {
    heading: "3. Account creation and accuracy",
    body: `You agree to provide accurate information when you sign up —
      your name, email address, trade, and service areas — and to keep
      your login credentials secure. You're responsible for activity
      that happens under your account.`,
  },
  {
    heading: "4. Lead purchases",
    body: `Unlocking a homeowner's contact details for a job costs $20
      NZD per lead. This charge is final — leads are non-refundable
      once purchased, including if the homeowner doesn't respond,
      doesn't hire you, or the job falls through for any reason.`,
  },
  {
    heading: "5. Professionalism",
    body: `You agree to represent yourself professionally in all
      communication with homeowners on the platform, and to respond to
      homeowners promptly once you've purchased a lead.`,
  },
  {
    heading: "6. Verification and licensing",
    body: `You must be legitimately qualified to carry out the trade
      work you offer, including holding any registration or practising
      licence your trade legally requires. Any verification badge or
      status shown on your profile reflects checks we've carried out —
      it doesn't replace your own legal responsibility to be properly
      qualified and licensed for the work you take on.`,
  },
  {
    heading: "7. Payment terms",
    body: `Lead payments are processed through Stripe. Once a payment
      has been processed, it is non-refundable — see "Lead purchases"
      above.`,
  },
  {
    heading: "8. Independent contractor status",
    body: `You are an independent contractor. You are not an employee,
      agent, or partner of TradeMatch NZ, and nothing in these terms
      creates an employment relationship. You're responsible for your
      own tax, ACC, insurance, and business obligations.`,
  },
  {
    heading: "9. Prohibited conduct",
    body: `You may not send spam or unsolicited marketing to
      homeowners, use contact details you've unlocked for anything
      other than discussing the job you paid to access, or harass or
      abuse homeowners on the platform.`,
  },
  {
    heading: "10. Limitation of liability",
    body: `TradeMatch NZ is a marketplace that connects you with
      homeowners — we are not a party to any agreement you make with a
      homeowner. We're not responsible for disputes between you and a
      homeowner, the outcome of any job, or payment issues arising
      between you and a homeowner.`,
  },
  {
    heading: "11. Governing law",
    body: `These terms are governed by the laws of New Zealand.`,
  },
  {
    heading: "12. Contact",
    body: `Questions about these terms? Email us.`,
  },
];

export default function TermsTradiePage() {
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
          Tradie terms and conditions
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
