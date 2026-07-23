import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trade Apprenticeships NZ | Licensed Builder & Upskilling Guide | TradieMatch",
  description:
    "A practical guide for New Zealand tradies: apprenticeships and formal training, becoming a licensed builder, electrical and plumbing registration, and how to keep upskilling around a full workload.",
};

export default function SkillDevelopmentPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/tradie-resources"
          className="text-sm font-medium text-ink-700 hover:text-navy-950"
        >
          ← Back to tradie resources
        </Link>

        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
          Tradie resources
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Growing your skills and your trade career in NZ.
        </h1>

        <p className="mt-6 leading-relaxed text-ink-700">
          The tradies who do best over the long run aren&apos;t just the ones
          who are good with their hands on day one — they&apos;re the ones
          who keep learning. This guide covers how apprenticeships and formal
          training work in New Zealand, what licensing actually requires for
          regulated trades like building, electrical, and plumbing, and how
          to keep upskilling even when your diary is already full.
        </p>

        <section className="mt-12 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Why upskilling matters
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            A trade qualification gets you in the door, but it&apos;s not a
            finish line. Tradies who keep building their skills stay more
            competitive — they can quote with more confidence, take on bigger
            and more complex jobs that pay better, and aren&apos;t left behind
            when materials, building codes, or tools change. Someone who only
            ever learned one way of doing things in their first year on the
            job will, sooner or later, find that the industry has moved on
            without them.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            It also directly affects what you can charge. A tradie with a
            broader skill set, a recognised license, or a specialist
            capability can take on work that an unqualified competitor
            simply can&apos;t, which means less competing purely on price.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Homeowners posting jobs on platforms like TradieMatch can also
            see your qualifications and verification status on your profile
            — the more you can genuinely show, the more you stand out
            against other tradies bidding on the same job.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Apprenticeships and formal training
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Apprenticeships and on-the-job training remain the main path into
            a trade in New Zealand. They combine paid work with formal
            study, so you&apos;re earning while you learn, and what you study
            is directly tied to the work you&apos;re actually doing on site.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            New Zealand&apos;s vocational training system is currently going
            through significant change, with new arrangements for training
            providers and industry bodies being phased in through 2026 and
            2027. Rather than naming specific organisations here — which
            could be out of date by the time you read this — the practical
            advice is to check directly with your trade&apos;s current
            industry body or training provider for the up-to-date pathway
            into an apprenticeship, and for what formal qualifications are
            recognised right now. If you&apos;re already partway through an
            apprenticeship, your provider will be able to tell you how any
            changes affect you specifically.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Licensing and certification
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Some trades are legally regulated, and working in them means
            more than just having the skills — you need the right
            registration or licence. In building, New Zealand has the
            Licensed Building Practitioner (LBP) scheme: certain categories
            of building work, known as restricted building work, must be
            either carried out or supervised by someone holding the
            relevant LBP licence class.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Electrical work has its own regime — electricians must be
            registered and hold a current practising licence, overseen by
            the Electrical Workers Registration Board. Plumbing, gasfitting,
            and drainlaying work is similar: practitioners must be
            registered and hold a current practising licence through the
            Plumbers, Gasfitters and Drainlayers Board. Working outside
            these rules isn&apos;t just a compliance risk — it can mean the
            work isn&apos;t legally recognised at all.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Requirements and licence classes can be updated, so always
            confirm the current rules directly with the relevant licensing
            body for your trade before assuming what applied last year still
            applies today.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Learning on the job vs. formal courses
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            The two aren&apos;t competing options — the best tradies use
            both. Nothing replaces time spent alongside an experienced
            tradie, watching how they solve problems that don&apos;t show up
            in any textbook: the judgment calls, the shortcuts that
            aren&apos;t worth taking, the way they talk to a difficult
            client. If you get the chance to work alongside someone more
            experienced than you, take it, even if it means a lower rate for
            that job.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Formal courses and short, targeted micro-credentials fill a
            different gap — they&apos;re the fastest way to pick up a specific
            new skill or certification (a new install method, a safety
            ticket, a specialist material) without waiting years to stumble
            across it on the job. Used together, on-the-job learning gives
            you judgment, and formal courses give you breadth. Neither one
            on its own builds a complete tradie — the ones who stand out
            tend to be doing both continuously, not treating either as a
            one-off box to tick early in their career.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Fitting learning around a full workload
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            The hardest part of upskilling once you&apos;re self-employed
            and busy isn&apos;t finding the will — it&apos;s finding the
            time. A few things help. Block out fixed time for it, the same
            way you&apos;d block out time for a job, rather than leaving it
            for whenever things go quiet — for most tradies, that day never
            comes on its own.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Treat the cost of a course the same way you&apos;d treat any
            other business investment — weighed against what it lets you
            charge or which jobs it lets you take on, not just as an
            out-of-pocket expense. And look for modular, evening, weekend,
            or online formats specifically — you don&apos;t need to shut the
            business for a week to learn one new skill, and most providers
            now offer options built around exactly that constraint.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            It also helps to pick one skill at a time rather than trying to
            upskill across everything at once. A single, well-chosen course
            or qualification a year — one that actually changes what jobs
            you can take on — beats a scattered list of things half-started
            and never finished.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Trade-specific pointers
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Every trade has its own governing bodies, its own licensing
            pathway, and its own industry association running training,
            events, and updates specific to that trade. What applies to a
            builder doesn&apos;t necessarily apply to an electrician or a
            plumber, and pathways change over time. Rather than relying on
            general advice like this guide for the specifics, seek out and
            follow your own trade&apos;s industry association directly — they&apos;re
            the most reliable source for what&apos;s current and relevant to you.
          </p>
        </section>

        <p className="mt-10 border-t border-line pt-6 text-sm">
          <Link
            href="/tradie-resources/invoices-quotes"
            className="font-semibold text-navy-950 hover:underline"
          >
            Related guide: Invoices and quotes for NZ tradies →
          </Link>
        </p>
        <p className="mt-2 text-sm">
          <Link
            href="/tradie-resources/build-your-profile"
            className="font-semibold text-navy-950 hover:underline"
          >
            Related guide: Building a strong TradieMatch profile →
          </Link>
        </p>

        <p className="mt-6 border-t border-line pt-6 text-xs leading-relaxed text-ink-500">
          This guide is general information for New Zealand tradies and
          isn&apos;t legal or professional advice. Training pathways and
          licensing requirements can and do change — always confirm current
          requirements with the relevant licensing body, training provider,
          or your trade&apos;s industry association before relying on
          anything here.
        </p>
      </div>
    </main>
  );
}
