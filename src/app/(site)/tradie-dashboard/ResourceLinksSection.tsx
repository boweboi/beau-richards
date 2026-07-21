import Link from "next/link";
import { TRADIE_RESOURCE_GUIDES } from "@/lib/tradieResourceGuides";

export default function ResourceLinksSection() {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-navy-950">
        Tradie resources
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        Guides on quoting, pricing, and winning more work.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRADIE_RESOURCE_GUIDES.map((guide) => (
          <div
            key={guide.href}
            className="rounded-xl border border-line bg-white p-5 shadow-sm"
          >
            <h3 className="font-semibold text-navy-950">{guide.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-700">
              {guide.description}
            </p>
            <Link
              href={guide.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-navy-950 hover:underline"
            >
              Read guide →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
