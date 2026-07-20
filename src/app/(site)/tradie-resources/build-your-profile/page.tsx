import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Build a Strong TradeMatch Profile | TradeMatch NZ",
  description:
    "How NZ tradies can build a TradeMatch profile that stands out — photos, bio, qualifications, reviews, and verification status.",
};

export default function BuildYourProfilePage() {
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
          Building a profile that wins work.
        </h1>

        <p className="mt-6 leading-relaxed text-ink-700">
          When a homeowner is deciding between several tradies who&apos;ve all
          quoted a similar price, your profile is often what tips the
          decision. A thin, empty profile makes you look interchangeable
          with everyone else on the list. A complete one — photos,
          qualifications, reviews — makes you the obvious choice, often
          before the homeowner has read a single word of your quote.
        </p>
        <p className="mt-6 leading-relaxed text-ink-700">
          Your profile is also the one part of your presence on
          TradeMatch NZ that keeps working for you between jobs. You quote
          once, but your profile is seen by every homeowner comparing you
          against other tradies — it&apos;s worth treating it as seriously as
          you&apos;d treat a quote, rather than something you fill in once and
          forget about. A well-built profile is one of the few marketing
          assets a small trades business has that doesn&apos;t cost anything
          beyond a bit of time to set up properly.
        </p>

        <section className="mt-12 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Photos of your work
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Nothing sells your work better than seeing it. Add photos of
            completed jobs — before-and-after shots are especially
            effective, since they show the actual transformation a
            homeowner is paying for. Good lighting and a tidy shot matter
            more than expensive equipment; a clear photo taken on a phone
            beats no photo every time. If you don&apos;t have photos yet, start
            taking them on your next few jobs — with the homeowner&apos;s
            permission where appropriate.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Aim for a spread rather than one or two photos — a range of
            jobs shows breadth, and recent photos show you&apos;re actively
            working, not coasting on work from years ago. If you can, add
            a short caption to each one; &quot;bathroom reno, Hamilton&quot; tells a
            homeowner far more at a glance than an unlabelled photo does.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Your bio, qualifications, and experience
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Keep your profile up to date — your trade, your years of
            experience, the region and towns you cover, and any
            qualifications or licences you hold. A short, specific bio
            (&quot;15 years in residential plumbing across Auckland, specialise
            in bathroom renos&quot;) tells a homeowner more in one line than a
            generic &quot;quality work at fair prices&quot; ever will. Specificity
            builds more confidence than a broad claim.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Update your bio when things change — new qualification, more
            years of experience, a new area you now cover — rather than
            leaving it as whatever you wrote when you first signed up. A
            stale bio is a small thing, but it&apos;s the kind of detail that
            quietly signals whether a profile is actively maintained or
            has been left untouched for years.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Reviews: ask, don&apos;t wait
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            Happy customers are usually glad to leave a review — most
            simply don&apos;t think to unless you ask. A short message after
            the job wraps up (&quot;thanks for the work — if you were happy,
            a review would really help the business&quot;) gets far more
            reviews than hoping they&apos;ll leave one unprompted. Reviews are
            one of the strongest trust signals a new homeowner can see,
            since they&apos;re coming from people with nothing to gain by
            lying.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Timing matters — ask while the job is still fresh in the
            homeowner&apos;s mind, ideally right after they&apos;ve seen and paid
            for the finished work, rather than weeks later when the
            details have faded. If a review is ever less positive than
            you&apos;d hoped, respond to it calmly and professionally rather
            than ignoring it or getting defensive — how you handle a
            mediocre review often says more to future homeowners than the
            review itself.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Verification status
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            TradeMatch NZ shows a verification badge on your profile based
            on what&apos;s been checked — things like your email, phone, and
            for regulated trades, your qualifications or licence. Keeping
            your details current and getting verified where you can is
            one of the simplest ways to stand out, since it&apos;s a signal a
            homeowner doesn&apos;t have to take on faith. See our guide on{" "}
            <Link
              href="/tradie-resources/skill-development"
              className="underline hover:no-underline"
            >
              growing your skills and trade career
            </Link>{" "}
            for more on licensing and qualifications.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            If part of your profile isn&apos;t verified yet, don&apos;t leave it
            sitting unfinished — it&apos;s usually a quick step, and an
            unverified profile can quietly cost you jobs against a
            competitor whose profile shows the badge. Homeowners comparing
            two similar tradies will often lean toward the one who looks
            more established, and verification is one of the clearest
            signals of that.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Standing out among tradies bidding the same job
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            When several tradies quote on the same job, the homeowner is
            often flicking between profiles as much as quotes. A profile
            with real photos, a specific bio, genuine reviews, and
            verified details reads as a real, established business — not
            just a phone number and a price. That impression is often
            worth more than being a few dollars cheaper.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            Think of your profile as doing part of the selling for you
            before the homeowner has even read your quote in full. If
            they land on your profile first and come away thinking
            &quot;this looks like a proper business,&quot; your quote starts the
            conversation from a position of trust rather than having to
            build it from nothing.
          </p>
        </section>

        <section className="mt-10 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Keeping your profile current
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            A profile isn&apos;t a one-off task — it&apos;s worth a quick review
            every few months. Add new photos as you complete jobs worth
            showing off, check your bio still reflects where you&apos;re at,
            and make sure your service area and availability are accurate.
            A tradie who lists an area they no longer cover, or hours that
            don&apos;t match how they actually work, creates friction and
            wasted messages for both sides.
          </p>
          <p className="mt-3 leading-relaxed text-ink-700">
            The tradies who get the most out of their profile tend to
            treat it the same way they&apos;d treat their tools — properly
            set up once, then kept in good order rather than left to
            gather dust. It&apos;s a small, recurring investment that keeps
            paying off on every job you&apos;re quoting for.
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
            href="/tradie-resources/skill-development"
            className="font-semibold text-navy-950 hover:underline"
          >
            Related guide: Growing your skills and trade career →
          </Link>
        </p>

        <p className="mt-6 border-t border-line pt-6 text-xs leading-relaxed text-ink-500">
          This guide is general business advice for New Zealand tradies,
          not professional advice. Only claim qualifications, licences, or
          experience you genuinely hold.
        </p>
      </div>
    </main>
  );
}
