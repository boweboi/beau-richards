import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Communication Wins Jobs | TradieMatch",
  description:
    "How clear, responsive communication with homeowners wins more jobs and turns one-off customers into repeat business and referrals for NZ tradies.",
};

export default function CommunicationWinsJobsPage() {
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
          How communication wins jobs.
        </h1>

        <p className="mt-6 leading-relaxed text-ink-700">
          Two tradies with near-identical skill and price will get very
          different results if one replies to messages within the hour
          and explains things clearly, and the other goes quiet for two
          days and answers in one-word texts. Communication is one of the
          most controllable parts of your business — you can&apos;t always
          control the job, but you can always control how well you keep
          the homeowner informed.
        </p>
        <p className="mt-6 leading-relaxed text-ink-700">
          It&apos;s also one of the cheapest things you can improve. Getting
          better at communication doesn&apos;t cost anything — no new tools,
          no extra training, no time off the tools. It&apos;s mostly a matter
          of building a few small habits and sticking to them consistently
          on every job, not just the ones that happen to go smoothly.
        </p>

        <section className="mt-12 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Responsiveness
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Answer messages quickly — ideally within a few hours during
            the working day. A homeowner comparing several tradies will
            often go with whoever responds first and clearly, especially
            for anything urgent. This doesn&apos;t mean being available around
            the clock; it means not letting messages sit unanswered for
            days when a two-line reply would have kept the conversation
            moving.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            If you genuinely can&apos;t reply properly for a day or two — busy
            week, on a job with no signal — even a quick &quot;got your
            message, will reply properly tonight&quot; keeps the conversation
            alive. Total silence is what loses jobs, not a short delay
            that&apos;s been flagged in advance.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Plain-language clarity
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Keep it friendly and clear, and avoid trade jargon a
            homeowner won&apos;t understand. If a homeowner asks something
            that&apos;s unclear to you, ask them to explain rather than
            guessing at what they mean — a wrong guess wastes both your
            time and theirs. Plain, simple explanations of what you&apos;re
            doing and why build more confidence than technical language
            that sounds impressive but explains nothing.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            This matters just as much in writing as in person. A text
            message full of trade shorthand and abbreviations might save
            you a few seconds to type, but it leaves the homeowner unsure
            what you actually mean — and an unsure homeowner is more
            likely to hesitate, ask around, or get a second opinion before
            committing. A sentence or two of plain language almost always
            pays for itself.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Proactive updates
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Don&apos;t make a homeowner chase you for progress updates,
            especially on longer jobs. A short message — &quot;finished the
            rough-in today, back Thursday to close it up&quot; — costs you
            thirty seconds and reassures them the job&apos;s on track. Silence
            makes people anxious, even when everything is actually going
            fine.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            This matters even more for jobs where the homeowner isn&apos;t on
            site during the day — most are at work while you&apos;re doing the
            job. A short photo update sent partway through the day does
            double duty: it reassures them things are progressing, and it
            gives them something concrete to show a partner or flatmate
            who&apos;s asking how the job&apos;s going.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Delivering bad news well
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            If a problem pops up — you&apos;ve found rot behind the wall, a
            part&apos;s on backorder, the job&apos;s going to take longer than
            quoted — tell the homeowner straight away, with options, not
            excuses. &quot;Here&apos;s what we found, here&apos;s what it means for the
            price and timeline, here&apos;s what I&apos;d recommend&quot; lands far
            better than avoiding the conversation until it can&apos;t be
            avoided any longer. Homeowners forgive problems. They don&apos;t
            forgive being kept in the dark about them.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            It helps to call rather than text for anything genuinely
            significant — a bigger cost increase, a real delay, a problem
            that changes the scope of the job. Bad news delivered by text
            can read as impersonal or evasive, even when that&apos;s not the
            intention. A short call, followed up with the details in
            writing afterwards, usually lands better and gives the
            homeowner a chance to ask questions in real time.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Repeat business and referrals
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Most tradies underestimate how much of their future work
            comes from how they communicated on past jobs, not just how
            good the finished work was. A homeowner who felt informed and
            respected throughout the job is far more likely to call you
            again for the next job, and to recommend you to a neighbour
            or friend — which, in a country where word of mouth still
            carries real weight, is often worth more than any amount of
            marketing.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            This is worth remembering on the jobs that don&apos;t go
            perfectly, too. A homeowner who had a problem handled well —
            told about it early, kept updated, given a fair resolution —
            often ends up just as loyal as one whose job went off without
            a hitch. How a problem is communicated tends to matter more,
            longer, than the fact it happened at all.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Setting communication expectations early
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            A lot of communication friction can be avoided before the job
            even starts, simply by telling the homeowner how you work.
            Let them know roughly when you&apos;ll be reachable, how you
            prefer to be contacted for quick questions versus anything
            urgent, and when they can expect updates during the job. This
            takes thirty seconds in your first message and saves both of
            you from mismatched expectations later — a homeowner who
            knows you reply in the evenings won&apos;t assume you&apos;re ignoring
            them at 2pm.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            The same applies at the end of a job. Confirming what&apos;s been
            done, what to keep an eye on, and how to reach you if anything
            comes up afterwards closes the loop properly — and it&apos;s often
            the last thing a homeowner remembers about working with you,
            right before they decide whether to leave a review.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            None of this needs to be formal — a couple of sentences in
            your first and last message on a job is enough. The point
            isn&apos;t ceremony, it&apos;s making sure the homeowner never has to
            guess where things stand, from the moment you&apos;re hired to the
            moment the job is finished and paid for.
          </p>
        </section>

        <p className="mt-10 border-t border-line pt-6 text-sm">
          <Link
            href="/tradie-resources/be-professional"
            className="font-semibold text-navy-950 hover:underline"
          >
            Related guide: Being professional on the job →
          </Link>
        </p>
        <p className="mt-2 text-sm">
          <Link
            href="/tradie-resources/follow-up"
            className="font-semibold text-navy-950 hover:underline"
          >
            Related guide: Why follow-up matters →
          </Link>
        </p>

        <p className="mt-6 border-t border-line pt-6 text-xs leading-relaxed text-ink-500">
          This guide is general business advice for New Zealand tradies,
          not professional advice. Use your own judgement about what&apos;s
          appropriate for your customers and the work you do.
        </p>
      </div>
    </main>
  );
}
