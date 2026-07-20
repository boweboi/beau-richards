import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why Follow-Up Matters | TradeMatch NZ",
  description:
    "Why following up with homeowners after a quote wins more jobs, when to do it, and how to stay top of mind without being pushy.",
};

export default function FollowUpPage() {
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
          Why follow-up matters.
        </h1>

        <p className="mt-6 leading-relaxed text-ink-700">
          A homeowner who&apos;s gone quiet after you sent a quote hasn&apos;t
          necessarily said no — they&apos;re often just busy, waiting on other
          quotes, or the message got buried. A short, well-timed follow-up
          recovers a meaningful number of jobs that would otherwise be
          lost to silence rather than an actual decision against you —
          often for very little effort on your part.
        </p>
        <p className="mt-6 leading-relaxed text-ink-700">
          Most tradies skip follow-up because it feels awkward, or
          because there&apos;s always another job pulling at their attention.
          But treating follow-up as a normal, expected part of quoting —
          rather than an optional extra you get to if you remember — is
          one of the simplest ways to win more work without doing
          anything differently on the tools.
        </p>

        <section className="mt-12 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Why homeowners go quiet
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Most homeowners aren&apos;t ignoring you on purpose. They&apos;re
            juggling quotes from multiple tradies, work, family, and life
            in general — a quote sitting in their inbox or messages is
            easy to mean to respond to and then forget. Some are still
            waiting on a third quote before deciding. A few have simply
            gone with someone else and haven&apos;t gotten around to letting
            you know. You usually can&apos;t tell which, from silence alone.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            That uncertainty is exactly why follow-up works. Because
            silence is so often about the homeowner&apos;s week rather than a
            verdict on your quote, a well-timed nudge frequently reaches
            someone who genuinely meant to reply and just hadn&apos;t gotten
            to it yet — not someone who was avoiding you.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            When to follow up
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            A few days after sending a quote is usually the right window —
            enough time that you&apos;re not being impatient, soon enough that
            you&apos;re still front of mind. For anything urgent (a leak, no
            hot water, an electrical fault), a shorter window makes sense
            since the homeowner is likely still actively comparing
            options. For bigger, planned jobs — a renovation, a deck build
            — homeowners often take longer to decide, so give it closer to
            a week before checking in.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            It also helps to say up front, in the quote itself, roughly
            when you&apos;ll check back in — &quot;I&apos;ll follow up in a few days if
            I haven&apos;t heard back&quot; sets the expectation early, so the
            follow-up message doesn&apos;t come out of nowhere. It reads as
            organised rather than pushy, because you told them it was
            coming, and it removes any awkwardness on your end about
            whether a follow-up message is appropriate to send.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            How to follow up without being pushy
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Keep it short and friendly. Something like &quot;just checking in
            on the quote I sent for [job] — happy to answer any questions
            if you&apos;re still deciding&quot; does the job in one line. Don&apos;t
            chase repeatedly or add pressure (&quot;I&apos;ve got other jobs lined
            up, need to know soon&quot;) — it reads as pushy rather than
            professional, and it&apos;s the kind of thing homeowners mention
            in reviews. One or two friendly check-ins is plenty; beyond
            that, let it go.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Give the homeowner an easy way to say no, too — something like
            &quot;no worries if you&apos;ve gone another way, just let me know so I
            can plan around it&quot; takes the pressure off and often gets you
            a straight answer faster than silence would have. A clear no
            is more useful to you than a maybe that drags on for weeks,
            since it frees you up to focus on jobs you can actually win.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Staying top of mind long-term
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Follow-up isn&apos;t just about winning the immediate job. A
            homeowner who didn&apos;t hire you this time might come back for a
            future job, or refer you to someone else, if the interaction
            was pleasant and professional. Even a quote that doesn&apos;t
            convert is worth following up on politely once — it&apos;s a small
            investment that keeps the door open for repeat business later,
            long after the specific job has been forgotten.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            A simple habit worth building: keep a running note of every
            quote sent, when to follow up, and what happened. It doesn&apos;t
            need to be anything more sophisticated than a notes app or a
            spreadsheet — the point is having something that reminds you
            to check back in, since it&apos;s easy for a promising quote to
            slip your mind entirely once you&apos;re a few jobs further into
            a busy week.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            When to stop following up
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Persistence has a limit, and it&apos;s worth respecting it. After
            one or two genuine, friendly check-ins with no response,
            treat the silence as your answer and move your attention to
            other jobs. Continuing to chase past that point rarely changes
            the outcome — it mostly just risks the homeowner remembering
            you as the tradie who wouldn&apos;t take a hint, which works
            against you if they ever have future work.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            It&apos;s fine to leave the door open without chasing it — a final
            message like &quot;no problem either way, feel free to reach out
            if anything changes&quot; closes things off politely and costs you
            nothing, while still leaving room for them to come back later
            if their plans change.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Following up after the job is done, too
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Follow-up isn&apos;t only for unanswered quotes — it&apos;s worth doing
            after a completed job as well. A short message a week or two
            later, checking that everything&apos;s still working properly and
            they&apos;re happy with the result, does a lot of quiet work. It
            catches small issues before they become complaints, it&apos;s a
            natural moment to ask for a review, and it reminds the
            homeowner you&apos;re still around for anything else they might
            need down the track.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            This kind of follow-up tends to feel different from chasing a
            quote — there&apos;s no ask attached, just a genuine check-in — and
            it&apos;s often the message homeowners remember best, since most
            tradies disappear the moment the invoice is paid.
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
            href="/tradie-resources/why-your-quote-matters"
            className="font-semibold text-navy-950 hover:underline"
          >
            Related guide: Why your quote matters →
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
