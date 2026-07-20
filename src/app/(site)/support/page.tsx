import Link from "next/link";

const FAQS = [
  {
    question: "How much does it cost to post a job?",
    answer: (
      <>
        It&apos;s free, always. Head to{" "}
        <Link href="/post-a-job" className="underline hover:text-navy-950">
          /post-a-job
        </Link>{" "}
        and it takes about two minutes.
      </>
    ),
  },
  {
    question: "How much do tradies pay?",
    answer: (
      <>
        $20 flat per lead, and only when you choose to respond to a job — no
        subscriptions or monthly fees. See the full{" "}
        <Link href="/pricing" className="underline hover:text-navy-950">
          pricing breakdown
        </Link>
        .
      </>
    ),
  },
  {
    question: "How do I sign up?",
    answer: (
      <>
        Head to{" "}
        <Link href="/signup" className="underline hover:text-navy-950">
          /signup
        </Link>{" "}
        and choose whether you&apos;re a homeowner or a tradie.
      </>
    ),
  },
  {
    question: "How do I browse jobs as a tradie?",
    answer: (
      <>
        Sign in and visit{" "}
        <Link href="/jobs" className="underline hover:text-navy-950">
          /jobs
        </Link>{" "}
        to see every open job grouped by region and town, or{" "}
        <Link href="/browse-trades" className="underline hover:text-navy-950">
          /browse-trades
        </Link>{" "}
        to filter by category.
      </>
    ),
  },
  {
    question: "Can I edit or delete a job after posting it?",
    answer:
      "Not yet — that's on our list. For now, jobs stay open once posted.",
  },
  {
    question: "How do I respond to a job as a tradie?",
    answer:
      "We're still building the response and payment flow. For now, browse open jobs to see what's out there in your area.",
  },
  {
    question: "Are there reviews yet?",
    answer: (
      <>
        Not yet — see the{" "}
        <Link href="/reviews" className="underline hover:text-navy-950">
          reviews page
        </Link>{" "}
        for details on when that&apos;s coming.
      </>
    ),
  },
];

export default function SupportPage() {
  return (
    <main className="flex-1 bg-paper-0 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-hivis-600">
            Support
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
            Common questions
          </h1>
        </div>

        <dl className="mt-12 space-y-8">
          {FAQS.map((faq) => (
            <div key={faq.question}>
              <dt className="font-display text-lg font-semibold text-navy-950">
                {faq.question}
              </dt>
              <dd className="mt-2 text-ink-700">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  );
}
