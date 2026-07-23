import type { Metadata } from "next";
import Link from "next/link";

const CONTACT_EMAIL = "support@tradiematch.co.nz";

export const metadata: Metadata = {
  title: "Tradie Terms and Conditions | TradieMatch",
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
      "2.2 You must be actively working in a licensed or regulated trade, or be a qualified contractor in your field.",
      "2.3 You must provide accurate, complete information including your legal name, business registration details (if applicable), trade qualifications, and contact information.",
      "2.4 For regulated trades (e.g. Licensed Building Practitioners, electricians, plumbers, gasfitters), you must provide proof of current licensing or registration.",
      "2.5 Providing false or misleading information may result in immediate account suspension or termination.",
      "2.6 You are responsible for maintaining the confidentiality of your login credentials. You are liable for all activity on your account.",
      "2.7 Your account is for your own trade business use only. You may not share login credentials or allow others to use your account.",
    ],
  },
  {
    heading: "3. Lead purchases and payments",
    body: [
      "3.1 To contact a homeowner and view their details, you must purchase access to a lead for $20 NZD per job.",
      "3.2 Payment is processed securely through our payment processor, Stripe. By purchasing a lead, you authorise the $20 charge to your payment method.",
      "3.3 Once you have paid, your purchase is final. No refunds are issued, including if:",
      [
        "You change your mind after purchase",
        "You decide not to quote on the job",
        "The homeowner has already hired another tradie",
        "You cannot complete the job",
        "Any dispute arises after payment",
      ],
      "3.4 Nothing in clause 3.3 limits any rights you may have under the Consumer Guarantees Act 1993 or the Fair Trading Act 1986 where those Acts apply.",
      "3.5 A maximum of 2 tradies per job can purchase access to a lead. Once 2 tradies have paid, the lead is no longer available for purchase.",
      "3.6 You are responsible for checking your payment history and purchase confirmation emails.",
      "3.7 All prices are in NZD and include GST where applicable.",
    ],
  },
  {
    heading: "4. Using homeowner contact details",
    body: [
      "4.1 Homeowner contact details are provided solely for the purpose of quoting on and discussing the specific job posted.",
      "4.2 You agree not to:",
      [
        "Use the homeowner's contact details for marketing, sales calls, or any purpose other than the posted job",
        "Share the homeowner's details with other tradies, contractors, or third parties",
        "Add the homeowner to mailing lists or contact them about unrelated services",
        "Sell, distribute, or misuse their information",
      ],
      "4.3 Misuse of homeowner contact details will result in immediate account suspension and may result in legal action.",
      "4.4 The homeowner's information is confidential and for use only in relation to the lead purchased.",
    ],
  },
  {
    heading: "5. Your responsibilities as a tradie",
    body: [
      "5.1 Professionalism: You agree to be professional, courteous, and responsive in all communication with homeowners.",
      "5.2 Honest quotes: You agree to provide accurate, honest quotes based on the actual scope of work described in the job posting.",
      "5.3 Licensing and compliance: You are solely responsible for ensuring you hold all required licences and qualifications for the work you quote on. You must comply with all relevant NZ trade regulations, including the Building Act 2004 where applicable.",
      "5.4 Safety and quality: You are solely responsible for delivering safe, legal, quality work that complies with all applicable NZ building codes and trade standards, and with the Health and Safety at Work Act 2015.",
      "5.5 Timeliness: You agree to respond to job enquiries in a timely manner (within 24 hours where reasonable) or withdraw your interest.",
      "5.6 No off-platform payments: You agree not to request or accept payment outside the Platform, or arrange work outside TradieMatch, in order to avoid Platform fees.",
      "5.7 Honest profile: Your trade category, service areas, and qualifications listed on your profile must be accurate and current.",
    ],
  },
  {
    heading: "6. Verification tiers",
    body: [
      "6.1 Your account may display a verification tier (Bronze, Silver, Gold) based on your qualifications, licensing, and customer reviews.",
      "6.2 Higher verification tiers may be required for certain regulated trades or higher-value jobs in the future.",
      "6.3 False or outdated qualification information will result in demotion of your verification tier and possible account suspension.",
    ],
  },
  {
    heading: "7. Reviews and reputation",
    body: [
      "7.1 Homeowners may leave ratings based on their experience with you.",
      "7.2 You agree that ratings are honest feedback from genuine customers, and you may not pressure homeowners to leave positive ratings or remove negative ones.",
      "7.3 Repeatedly poor ratings may result in reduced visibility on the Platform or account suspension.",
    ],
  },
  {
    heading: "8. Liability and indemnity",
    body: [
      "8.1 TradieMatch is a marketplace that connects you with homeowners. We do not supervise, manage, or guarantee the outcomes of any job.",
      "8.2 You are an independent contractor, not an employee of TradieMatch. You are solely responsible for:",
      [
        "Quality and safety of your work",
        "All licensing, insurance, and tax obligations",
        "Any disputes or claims arising from your work",
        "Compliance with all NZ laws and trade regulations",
      ],
      "8.3 To the fullest extent permitted by law, TradieMatch is not liable for:",
      [
        "Quality or safety of your work",
        "Homeowner payment disputes or non-payment",
        "Injury or property damage caused by your work",
        "Any financial loss arising from your use of the Platform",
        "Disputes with homeowners",
      ],
      "8.4 To the fullest extent permitted by law, TradieMatch's liability is limited to the amounts paid by you to the Platform in the 12 months preceding the claim.",
      "8.5 You agree to indemnify TradieMatch against any claims, damages, or costs arising from your use of the Platform or your work as a tradie.",
      "8.6 You acknowledge that you acquire access to the Platform for the purposes of a business, and that the Consumer Guarantees Act 1993 does not apply to that supply to the extent permitted by section 43 of that Act.",
    ],
  },
  {
    heading: "9. Prohibited conduct",
    body: [
      "9.1 You agree not to:",
      [
        "Misuse or abuse homeowner contact information",
        "Spam, harass, or threaten homeowners",
        "Post fake reviews or ratings",
        "Attempt to circumvent Platform systems or bypass payments",
        "Use the Platform for illegal, unsafe, or fraudulent purposes",
        "Solicit homeowners off-Platform to avoid fees",
        "Share your login credentials or allow others to use your account",
        "Provide false information about your qualifications or licensing",
      ],
      "9.2 Violation of these rules may result in:",
      [
        "Account suspension or permanent termination",
        "Forfeiture of any pending payments",
        "Legal action",
        "Reporting to relevant trade licensing bodies",
      ],
    ],
  },
  {
    heading: "10. Payment and financial",
    body: [
      "10.1 You are responsible for all taxes, GST, and business obligations arising from your income earned through the Platform.",
      "10.2 TradieMatch does not withhold taxes or provide employment benefits. You are an independent contractor.",
      "10.3 Lead purchase fees are non-refundable and do not guarantee a job or a homeowner response.",
      "10.4 We reserve the right to suspend accounts with payment issues or fraudulent activity.",
    ],
  },
  {
    heading: "11. Changes to the platform",
    body: [
      "11.1 We may update, modify, or discontinue features at any time.",
      "11.2 We will make reasonable efforts to notify you of significant changes.",
      "11.3 Changes to pricing (e.g. lead cost) will be announced in advance where practicable.",
    ],
  },
  {
    heading: "12. Dispute resolution",
    body: [
      "12.1 If you have a dispute with a homeowner, we encourage direct communication and mediation.",
      "12.2 TradieMatch is not responsible for resolving disputes between you and homeowners.",
      "12.3 For disputes with TradieMatch itself, contact us at support@tradiematch.co.nz with details. We will respond within 5 business days.",
    ],
  },
  {
    heading: "13. Governing law",
    body: [
      "These Terms and Conditions are governed by the laws of New Zealand. Any disputes shall be subject to the jurisdiction of the New Zealand courts.",
    ],
  },
  {
    heading: "14. Legal entity",
    body: [
      "TradieMatch is a trading name of Iscape Limited (NZBN 9429052661242), a company registered in New Zealand.",
    ],
  },
  {
    heading: "15. Contact us",
    body: [
      "If you have questions about these Terms and Conditions, contact us at support@tradiematch.co.nz.",
    ],
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

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Terms &amp; conditions
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Tradie terms and conditions
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
