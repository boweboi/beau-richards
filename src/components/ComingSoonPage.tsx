import Link from "next/link";

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-paper-0 px-6 py-16">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl font-semibold text-navy-950">
          {title}
        </h1>
        <p className="mt-3 text-ink-500">
          We&apos;re still writing this page — check back soon.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-navy-950 hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
