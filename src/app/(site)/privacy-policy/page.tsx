import type { Metadata } from "next";
import Link from "next/link";

const CONTACT_EMAIL = "support@tradiematch.co.nz";

export const metadata: Metadata = {
  title: "Privacy Policy | TradieMatch",
  robots: { index: false, follow: false },
};

type SectionBlock = string | string[];

type Section = {
  heading: string;
  body: SectionBlock[];
};

const SECTIONS: Section[] = [
  {
    heading: "1. Introduction",
    body: [
      `This Privacy Policy explains how Iscape Limited, trading as TradieMatch (the "Platform"), collects, uses, stores, and shares personal information, and the rights you have over it. This policy applies to all users of the Platform, whether you sign up as a homeowner or a tradie. We collect and handle personal information in accordance with the Privacy Act 2020 (NZ).`,
    ],
  },
  {
    heading: "2. Information we collect",
    body: [
      "2.1 Account information (all users): full name, email address, password (stored securely, hashed by our authentication provider — we never see or store your plaintext password), and account type (homeowner or tradie).",
      "2.2 Tradie profile information: trade category or categories, service areas (region and town), and any qualification, licensing, or registration details you provide as part of your profile or verification tier.",
      "2.3 Job information: when a homeowner posts a job, we collect the job title, description, trade category, region and town, budget, timeframe, and the contact name, email, and phone number to be shared with tradies who purchase access to that job.",
      "2.4 Payment information: lead purchases are processed by our payment provider, Stripe. We do not collect or store your card details — Stripe handles this directly, and we only receive confirmation that a payment succeeded.",
      "2.5 Reviews and ratings: homeowners may rate a tradie across five categories after a job.",
      "2.6 Communications: records of transactional emails we send you (for example, a welcome email, a lead purchase receipt, or a job alert), sent through our email provider, Resend.",
      "2.7 Session and usage data: a functional cookie that keeps you signed in between visits. We don't use third-party advertising or tracking cookies.",
    ],
  },
  {
    heading: "3. How we use your information",
    body: [
      "3.1 To create and administer your account, and to verify tradie qualifications where applicable.",
      "3.2 To operate the marketplace: showing jobs to tradies by trade category and service area, letting homeowners manage jobs they've posted, and processing lead purchases.",
      "3.3 To send you transactional emails about your account, such as a welcome email, a receipt when a tradie unlocks a lead, or a job alert when a new job matches a tradie's categories and areas.",
      "3.4 To respond to support requests and enforce our Terms and Conditions.",
      "3.5 We do not sell your personal information to third parties, and we do not use your information for third-party advertising.",
    ],
  },
  {
    heading: "4. Who we share your information with",
    body: [
      "4.1 Other users, as part of how the Platform works: a homeowner's job contact details (name, email, phone) are only revealed to a tradie once that tradie has paid to unlock the lead for that specific job. A tradie's profile information (name, trade category, service areas, verification tier, ratings) is visible to homeowners browsing or reviewing leads.",
      "4.2 Service providers who process data on our behalf:",
      [
        "Supabase — hosts our database and handles account authentication",
        "Stripe — processes lead purchase payments; we never see your full card details",
        "Resend — delivers the transactional emails described in section 3.3",
      ],
      "4.3 We may disclose information where required by law, or to protect the rights, property, or safety of TradieMatch, our users, or the public.",
    ],
  },
  {
    heading: "5. Cookies",
    body: [
      "We use a single functional, signed session cookie to keep you signed in between visits. This cookie is required for the Platform to work and cannot be disabled while remaining signed in. We don't use analytics or advertising cookies.",
    ],
  },
  {
    heading: "6. Data storage and security",
    body: [
      "6.1 Your data is stored with Supabase, our database provider. Access to sensitive tables — such as job contact details and (once you unsubscribe) your unsubscribe preference — is restricted at the database level to trusted server-side systems only, and is never exposed directly to other users' browsers.",
      "6.2 Session cookies are cryptographically signed so they can't be forged or tampered with.",
      "6.3 While we take reasonable steps to protect your information, no method of storage or transmission over the internet is 100% secure, and we can't guarantee absolute security.",
    ],
  },
  {
    heading: "7. Data retention",
    body: [
      "We retain your personal information for as long as your account is active, or as needed to provide the Platform, comply with our legal obligations, resolve disputes, and enforce our agreements. If you'd like your account and associated data deleted, contact us using the details in section 14.",
    ],
  },
  {
    heading: "8. Your rights under the Privacy Act 2020",
    body: [
      "8.1 You have the right to ask us what personal information we hold about you, and to request a copy of it.",
      "8.2 You have the right to ask us to correct any personal information that is inaccurate, incomplete, or out of date.",
      "8.3 You can exercise either right at any time by emailing us at the address in section 14. We'll respond within the timeframes required by the Privacy Act 2020.",
      "8.4 If you believe we've mishandled your personal information and we haven't resolved your concern, you have the right to complain to the Office of the Privacy Commissioner (privacy.org.nz).",
    ],
  },
  {
    heading: "9. Email preferences",
    body: [
      "9.1 Transactional emails (such as account confirmations and lead purchase receipts) are a necessary part of using the Platform and can't be turned off while you hold an account.",
      "9.2 Job alert emails, sent to tradies when a new job matches their trade categories and service areas, include an unsubscribe link in the footer of every email. Following it removes your address from future job alerts. Unsubscribing doesn't otherwise affect your account.",
    ],
  },
  {
    heading: "10. Children's privacy",
    body: [
      "The Platform is intended for users aged 18 and over, in line with our Terms and Conditions. We don't knowingly collect personal information from anyone under 18.",
    ],
  },
  {
    heading: "11. International data transfers",
    body: [
      "Some of our service providers (including Supabase, Stripe, and Resend) may store or process data on servers located outside New Zealand. Where this happens, we rely on those providers' own security and privacy safeguards to protect your information.",
    ],
  },
  {
    heading: "12. Changes to this policy",
    body: [
      "We may update this Privacy Policy as the Platform develops. If we make material changes, we'll update the date below. Continued use of the Platform after a change means you accept the updated policy.",
    ],
  },
  {
    heading: "13. Legal entity",
    body: [
      "TradieMatch is a trading name of Iscape Limited (NZBN 9429052661242), a company registered in New Zealand.",
    ],
  },
  {
    heading: "14. Contact us",
    body: [
      "If you have questions about this Privacy Policy, or want to access, correct, or delete your personal information, contact us at support@tradiematch.co.nz.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm font-medium text-ink-700 hover:text-navy-950"
        >
          ← Back to home
        </Link>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Privacy policy
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Privacy policy
        </h1>
        <p className="mt-2 text-sm text-ink-500">Last updated: July 2026.</p>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-lg font-semibold text-navy-950">
                {section.heading}
              </h2>
              {section.body.map((block, index) =>
                Array.isArray(block) ? (
                  <ul
                    key={index}
                    className="mt-2 list-disc space-y-1 pl-5 text-ink-700"
                  >
                    {block.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={index} className="mt-2 text-ink-700">
                    {block}
                  </p>
                )
              )}
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
