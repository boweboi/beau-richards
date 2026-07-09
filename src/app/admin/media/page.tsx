import Link from "next/link";
import MediaManager from "@/components/admin/MediaManager";

export default function AdminMediaPage() {
  return (
    <main className="min-h-screen bg-paper pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper-0 px-6 py-4">
        <div>
          <h1 className="font-display text-lg font-semibold text-navy-950">
            Media manager
          </h1>
          <p className="text-xs text-ink-500">
            Upload images to your Supabase storage bucket.
          </p>
        </div>
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-ink-700 hover:text-navy-950"
        >
          ← Back to content
        </Link>
      </header>

      <div className="mx-auto mt-8 max-w-3xl px-6">
        <MediaManager />
      </div>
    </main>
  );
}
