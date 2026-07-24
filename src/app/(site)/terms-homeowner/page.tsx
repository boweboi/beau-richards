import type { Metadata } from "next";
import Link from "next/link";

const CONTACT_EMAIL = "support@tradiematch.co.nz";

export const metadata: Metadata = {
  title: "Homeowner Terms and Conditions | TradieMatch",
  robots: { index: false, follow: false },
};

type SectionBlock = string | string[];

type Section = {
  heading: string;
  body: SectionBlock[];
};

const SECTIONS: Section[] = [
  {
    heading: "1. Acceptance of terms",
    body: [
      `By creating an account and using TradieMatch (the "Platform"), you agree to be bound by these Terms and Conditions. If you do not agree, do not use the Platform. We reserve the right to modify these terms at any time. Your continued use of the Platform constitutes acceptance of any changes.`,
    ],
  },
  {
    heading: "2. User eligibility and account",
    body: [
      "2.1 You must be at least 18 years old and a legal resident of New Zealand.",
      "2.2 You must be the property owner or have legal authority to hire services on the property where work will be performed.",
      "2.3 You must provide accurate, complete information when creating your account, including your name, contact details, and address.",
      "2.4 You are responsible for maintaining the confidentiality of your login credentials. You are liable for all activity on your account.",
      "2.5 We reserve the right to suspend or terminate your account if you provide false or misleading information.",
    ],
  },
  {
    heading: "3. Posting jobs",
    body: [
      "3.1 Posting jobs on TradieMatch is free.",
      "3.2 You agree to provide accurate, honest descriptions of the work required, including the trade category, location, scope of work, and any budget information you're willing to share.",
      "3.3 You must not post jobs that are illegal, unsafe, or fraudulent.",
      "3.4 You must not post the same job multiple times or spam the Platform.",
      "3.5 Once a job is posted, verified local tradies can view it and purchase access to your contact details. Your contact details are locked until a tradie purchases access to them.",
      "3.6 You are responsible for communicating directly with tradies, comparing quotes, and deciding who to hire. TradieMatch does not vet the quality of tradie work or guarantee outcomes.",
    ],
  },
  {
    heading: "4. Contact information and privacy",
    body: [
      "4.1 Your contact details (phone, email, address) are private and only revealed to tradies who have paid to access them.",
      "4.2 Tradies who purchase access to your details agree to use that information solely to discuss and quote on the job you posted. Misuse of your contact details may result in their account suspension.",
      "4.3 We collect and store your information in accordance with the Privacy Act 2020. See our Privacy Policy (/privacy-policy) for full details.",
    ],
  },
  {
    heading: "5. Your responsibilities",
    body: [
      "5.1 You agree to be honest and respectful in all communication with tradies.",
      "5.2 You agree to respond to quotes in a timely manner or inform tradies if you've already hired someone.",
      "5.3 You agree not to request or offer payment outside the Platform to avoid our systems.",
      "5.4 You are solely responsible for hiring decisions, payment agreements, and any disputes with tradies. TradieMatch is a marketplace; we do not employ tradies or guarantee their work.",
    ],
  },
  {
    heading: "6. Liability and disputes",
    body: [
      "6.1 TradieMatch connects homeowners and tradies but does not supervise, endorse, or guarantee the quality, safety, or legality of any tradie's work.",
      "6.2 Any dispute with a tradie (quality of work, pricing, safety) is between you and the tradie. We encourage mediation or legal advice if needed.",
      "6.3 To the fullest extent permitted by law, TradieMatch is not liable for:",
      [
        "Injury or property damage caused by a tradie",
        "Incomplete, poor-quality, or unsafe work",
        "Tradie no-shows or broken agreements",
        "Any financial loss arising from your use of the Platform",
      ],
      "6.4 To the fullest extent permitted by law, TradieMatch's liability is limited to the amount you paid to use the Platform (which is zero for homeowners).",
      "6.5 Nothing in these Terms limits your rights under the Consumer Guarantees Act 1993 or the Fair Trading Act 1986 where those Acts apply.",
    ],
  },
  {
    heading: "7. Prohibited conduct",
    body: [
      "7.1 You agree not to:",
      [
        "Post jobs that are illegal, unsafe, or fraudulent",
        "Harass, threaten, or abuse tradies",
        "Request payment outside the Platform",
        "Spam or flood the Platform with duplicate jobs",
        "Attempt to bypass the Platform's systems or access tradies' information without paying",
        "Collect or use tradies' contact information for purposes other than the posted job",
      ],
      "7.2 Violation of these rules may result in account suspension or termination without refund.",
    ],
  },
  {
    heading: "8. Changes to the platform",
    body: [
      "8.1 We may update, modify, or discontinue features of the Platform at any time.",
      "8.2 We will make reasonable efforts to notify you of significant changes.",
    ],
  },
  {
    heading: "9. Governing law",
    body: [
      "These Terms and Conditions are governed by the laws of New Zealand. Any disputes shall be subject to the jurisdiction of the New Zealand courts.",
    ],
  },
  {
    heading: "10. Legal entity",
    body: [
      "TradieMatch is a trading name of Iscape Limited (NZBN 9429052661242), a company registered in New Zealand.",
    ],
  },
  {
    heading: "11. Contact us",
    body: [
      "If you have questions about these Terms and Conditions, contact us at support@tradiematch.co.nz.",
    ],
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

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Terms &amp; conditions
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Homeowner terms and conditions
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
