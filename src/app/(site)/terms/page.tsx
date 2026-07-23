const CONTACT_EMAIL = "beaurichards01@gmail.com";

const SECTIONS = [
  {
    heading: "1. Who this applies to",
    body: `These terms apply to anyone who creates an account on TradieMatch,
      whether as a homeowner posting a job or a tradie browsing and responding
      to jobs. By creating an account, you agree to these terms.`,
  },
  {
    heading: "2. What TradieMatch is (and isn't)",
    body: `TradieMatch is a marketplace that connects homeowners with tradies.
      We are not a party to any agreement between a homeowner and a tradie,
      we don't employ tradies, and we don't guarantee the quality, licensing,
      or outcome of any work. Homeowners and tradies are responsible for
      agreeing their own terms, pricing, and work standards with each other.`,
  },
  {
    heading: "3. Accounts",
    body: `You need an account to post a job or browse jobs. You agree to
      provide accurate information (name, email, and — for tradies — trade
      details) and to keep your login credentials secure. You're responsible
      for activity that happens under your account.`,
  },
  {
    heading: "4. What we collect",
    body: `When you sign up, we collect your name, email address, and account
      type (homeowner or tradie). When you post a job, we collect the job
      details you provide — title, description, category, region and town,
      budget, timeframe, and your contact information. Authentication and
      account data is stored with our database provider, Supabase.`,
  },
  {
    heading: "5. How we use it",
    body: `We use this information to operate the marketplace: to show jobs to
      tradies grouped by region and town, to let homeowners manage the jobs
      they've posted, and to communicate with you about your account. We
      don't sell your personal information to third parties.`,
  },
  {
    heading: "6. Cookies",
    body: `We use cookies to keep you signed in between visits. These are
      functional cookies required for the site to work — we don't use
      third-party advertising or tracking cookies.`,
  },
  {
    heading: "7. Fees",
    body: `Posting a job is free for homeowners. Fees for tradies, where
      applicable, are described on our Pricing page and may change with
      notice.`,
  },
  {
    heading: "8. Your rights",
    body: `You can ask us to access, correct, or delete the personal
      information we hold about you at any time by emailing us using the
      details below.`,
  },
  {
    heading: "9. Limitation of liability",
    body: `TradieMatch is provided "as is." To the extent permitted by law,
      we're not liable for disputes, damages, or losses arising from
      interactions or work arranged between homeowners and tradies through
      the platform.`,
  },
  {
    heading: "10. Changes to these terms",
    body: `We may update these terms as the platform develops. If we make
      material changes, we'll update the date below.`,
  },
  {
    heading: "11. Contact",
    body: `Questions about these terms or your data? Email us.`,
  },
];

export default function TermsPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-hivis-500/40 bg-hivis-500/10 p-4 text-sm text-navy-950">
          <p className="font-semibold">Draft — not reviewed by a lawyer.</p>
          <p className="mt-1 text-ink-700">
            This is a plain-language starter template, not final legal
            advice. It should be reviewed by a lawyer before the platform
            takes real signups.
          </p>
        </div>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Terms &amp; privacy
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Terms of use &amp; privacy policy
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
