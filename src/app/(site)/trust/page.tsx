import { REGULATED_TRADES } from "@/lib/tradeCategories";
import VerificationBadge from "@/components/VerificationBadge";
import type { VerificationTier } from "@/lib/verificationTier";

export default function TrustPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Trust &amp; verification
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Why we verify every tradie.
        </h1>
        <p className="mt-4 text-ink-700">
          Letting a stranger into your home for a quote — or a job — takes
          trust. Before a tradie shows up on Trade Match NZ, we check who
          they are, confirm they&apos;re qualified to do the work they&apos;re
          offering, and make sure they&apos;re a real, legitimate business.
          That&apos;s what earns them a badge.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
        <WhyCard
          title="Protect homeowners"
          description="Every tradie on the platform has a verified identity and a confirmed way to reach them, so you're never dealing with a stranger you can't trace."
        />
        <WhyCard
          title="Confirm qualifications & legitimacy"
          description="For regulated trades, we check a Level 4 qualification or LBP number before it counts. Business registration is checked too, so you know who you're actually hiring."
        />
        <WhyCard
          title="Build confidence"
          description="A visible badge means you don't have to take a tradie's word for it — you can see exactly what's been checked before you get a quote."
        />
      </div>

      <div className="mx-auto mt-20 max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Verification tiers
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
          Bronze, Silver, Gold.
        </h2>
        <p className="mt-4 text-ink-700">
          Tradies move up through three tiers as we confirm more about them.
          Requirements are cumulative — Silver includes everything in Bronze,
          and Gold includes everything in Silver.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
        <TierCard
          tier="bronze"
          description="The baseline every listed tradie meets."
          requirements={[
            "Email verified",
            "Phone verified",
            "Regulated trades only: Level 4 qualification or LBP number, checked by our team",
          ]}
        />
        <TierCard
          tier="silver"
          description="Everything in Bronze, plus a confirmed business and a track record."
          requirements={[
            "Everything in Bronze",
            "NZBN verified",
            "3 or more customer reviews",
          ]}
        />
        <TierCard
          tier="gold"
          description="Our highest tier — a well-established, thoroughly checked tradie."
          requirements={["Everything in Silver", "10 or more customer reviews"]}
        />
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-line bg-paper-50 p-6 text-center text-sm text-ink-700">
        <span className="font-semibold text-navy-950">Regulated trades</span>{" "}
        — {REGULATED_TRADES.join(", ")} — must show a Level 4 qualification
        or LBP number at every tier, confirmed by our team before it counts.
        Every other trade follows the same email, phone, NZBN, and review
        requirements without that extra qualification check.
      </div>
    </main>
  );
}

function WhyCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-5 text-left shadow-sm">
      <h3 className="font-display text-base font-semibold text-navy-950">
        {title}
      </h3>
      <p className="mt-2 text-sm text-ink-700">{description}</p>
    </div>
  );
}

function TierCard({
  tier,
  description,
  requirements,
}: {
  tier: Exclude<VerificationTier, "none">;
  description: string;
  requirements: string[];
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-5 text-left shadow-sm">
      <VerificationBadge tier={tier} />
      <p className="mt-3 text-sm text-ink-700">{description}</p>
      <ul className="mt-4 space-y-2 text-sm text-ink-700">
        {requirements.map((requirement) => (
          <li key={requirement} className="flex gap-2">
            <span aria-hidden="true" className="text-iron-600">
              ✓
            </span>
            {requirement}
          </li>
        ))}
      </ul>
    </div>
  );
}
