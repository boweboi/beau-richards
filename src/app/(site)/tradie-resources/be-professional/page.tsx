import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Professionalism On Site | TradieMatch",
  description:
    "Punctuality, presentation, site conduct, and safety — the professionalism habits that build a NZ tradie's reputation faster than word of mouth alone.",
};

export default function BeProfessionalPage() {
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
          Professionalism on the job.
        </h1>

        <p className="mt-6 leading-relaxed text-ink-700">
          Your skill gets you hired once. How you conduct yourself on site
          determines whether you get hired again, get recommended to
          someone else, or get a good review. None of what&apos;s in this guide
          is complicated — it&apos;s mostly about consistently doing the small
          things that a surprising number of tradies let slip, often
          without realising how much those small things are actually
          shaping the homeowner&apos;s opinion of the job as a whole.
        </p>
        <p className="mt-6 leading-relaxed text-ink-700">
          It&apos;s also one of the fastest ways to stand out. Most homeowners
          can&apos;t judge trade skill directly, but everyone can judge whether
          someone showed up on time, treated their home with respect, and
          communicated like a professional. Those small, easily-observed
          things end up carrying disproportionate weight in how a
          homeowner rates the whole job — including parts they never
          actually saw you do.
        </p>

        <section className="mt-12 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Punctuality
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Show up on time, or message ahead if you&apos;re going to be late —
            even by fifteen minutes. Homeowners often rearrange their day
            around a tradie&apos;s visit, and being left waiting with no word
            is one of the fastest ways to sour an otherwise good
            impression. A quick heads-up costs nothing and prevents most
            of the frustration.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            If you&apos;re regularly running late across multiple jobs, it&apos;s
            worth being honest with yourself about whether you&apos;re
            underestimating job length or double-booking too tightly.
            Homeowners will forgive the occasional delay on a job that ran
            long for a good reason. They&apos;re far less forgiving of a
            pattern, since it starts to feel like their time simply
            isn&apos;t being respected.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Appearance and presentation
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Wear clean work clothes and look after your gear — a
            well-kept van and tidy tools quietly signal competence before
            you&apos;ve said a word. This isn&apos;t about looking flashy; it&apos;s
            about looking like someone who takes the job seriously. A
            scruffy presentation makes homeowners wonder, fairly or not,
            whether the work will be scruffy too.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            The same logic applies to how you arrive, not just how you
            look once you&apos;re there. Parking considerately, not blocking a
            driveway unnecessarily, and bringing your gear in tidily
            rather than trailing tools and offcuts across a lawn all
            register with a homeowner, even if they never mention it. It&apos;s
            the kind of detail that&apos;s invisible when done right and
            noticeable when it isn&apos;t.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Site conduct
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Keep your work area tidy as you go, not just at the end of the
            job. Be respectful in someone&apos;s home — take your boots off if
            asked, don&apos;t play loud music without checking, and clean up
            properly once you&apos;re done. You&apos;re a guest in their house even
            when you&apos;re doing skilled trade work, and how you treat their
            space is something they notice as much as the work itself.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Small courtesies go further than most tradies expect —
            covering nearby surfaces before cutting or sanding, laying
            down a drop sheet in a hallway you&apos;re walking through
            repeatedly, checking before you use their power or water for
            anything beyond the job. None of it takes long, and all of it
            signals that you think about their home the way they do, not
            just as a job site.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Safety
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Follow the safety standards for your trade, keep the site safe
            for the homeowner and their family (especially kids and pets
            who might wander into a work area), and don&apos;t cut corners on
            anything that could put someone at risk to save time. A
            visible commitment to doing things safely and properly is
            part of what a homeowner is paying for, even if it&apos;s rarely
            stated outright in the quote.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            This extends to how you leave a site, not just how you work on
            it. Making sure tools, offcuts, and materials aren&apos;t left
            somewhere a child or pet could get hurt — even between visits
            on a multi-day job — is a basic expectation, and one that&apos;s
            easy to overlook when you&apos;re focused on getting through the
            day&apos;s work.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Staying composed under pressure
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Jobs go wrong sometimes — a part doesn&apos;t fit, something takes
            longer than expected, a homeowner is unhappy about something.
            How you handle that moment matters more than the fact that it
            happened. Staying calm, explaining the situation honestly, and
            offering a way forward builds more trust than the job going
            perfectly ever would. Your reputation builds faster than you&apos;d
            think, and it&apos;s built as much in the difficult moments as the
            easy ones — arguably more, since anyone can look professional
            when nothing has gone wrong.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            It&apos;s worth deciding in advance, before you&apos;re actually in a
            tense moment, roughly how you want to handle disagreements —
            offering options rather than getting defensive, for example,
            or agreeing to sleep on a dispute rather than resolving it in
            the heat of the moment. Having a default approach means
            you&apos;re not improvising your professionalism under pressure,
            which is exactly when it&apos;s hardest to get right.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Why this compounds over time
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            None of these habits show results after a single job. Their
            value comes from being consistent — a tradie who&apos;s reliably
            punctual, tidy, and calm across dozens of jobs builds a
            reputation that starts doing some of the selling for them,
            through reviews and word of mouth, before a homeowner has even
            met them. In a market where several tradies might be equally
            capable with the tools, professionalism is often the thing
            that actually decides who gets called back.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            The good news is that none of it requires natural talent —
            just attention and consistency. Pick a couple of habits from
            this guide that you know you&apos;re weakest on, and focus on
            those first rather than trying to overhaul everything at
            once. Small, consistent improvements here tend to show up in
            your reviews and repeat bookings faster than almost anything
            else you could change about how you run jobs.
          </p>
        </section>

        <p className="mt-10 border-t border-line pt-6 text-sm">
          <Link
            href="/tradie-resources/communication-wins-jobs"
            className="font-semibold text-navy-950 hover:underline"
          >
            Related guide: How communication wins jobs →
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
          This guide is general business advice for New Zealand tradies,
          not health and safety or legal advice. Follow the specific
          safety requirements that apply to your trade and each job site.
        </p>
      </div>
    </main>
  );
}
