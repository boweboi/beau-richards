import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Backing Our Tradies | TradieMatch",
  description:
    "The trade takes a toll. Why looking out for your mates is part of the job, and where tradies can get free 24/7 support from MATES in Construction.",
};

export default function TradieWellbeingPage() {
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
          Backing our tradies.
        </h1>

        <p className="mt-6 leading-relaxed text-ink-700">
          The trade&apos;s a tough gig. Long days, early starts, the pressure
          of running a business, chasing payments, and keeping everyone
          happy, it adds up. And too often, tradies are expected to just
          harden up and get on with it.
        </p>
        <p className="mt-6 leading-relaxed text-ink-700">
          We reckon that&apos;s rubbish. Looking after yourself, and looking
          out for your mates, is just as much a part of the job as doing
          the work right.
        </p>
        <p className="mt-6 leading-relaxed text-ink-700">
          Keep an eye on your mates. If someone on site has gone quiet,
          seems flat, is drinking more, or just isn&apos;t themselves lately,
          don&apos;t let it slide. A simple, you alright, mate? can go a long
          way.
        </p>
        <p className="mt-6 leading-relaxed text-ink-700">
          And if it&apos;s you that&apos;s struggling, there&apos;s no shame in it. Talk
          to someone you trust, a mate, your boss, your partner. You don&apos;t
          have to carry it on your own.
        </p>
        <p className="mt-6 leading-relaxed text-ink-700">
          And if you or a mate need someone to talk to, MATES in
          Construction runs a free, twenty four seven support line built
          for the trade. Give them a call on 0800 111 315.
        </p>
        <p className="mt-6 leading-relaxed text-ink-700">
          We&apos;re building TradieMatch to back tradies, not just with work,
          but as people. Because a strong trade is built on strong people
          looking out for each other.
        </p>
      </div>
    </main>
  );
}
