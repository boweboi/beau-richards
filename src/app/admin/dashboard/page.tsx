"use client";

import { useRouter } from "next/navigation";
import MaintenanceModeToggle from "@/components/admin/MaintenanceModeToggle";

export default function AdminDashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-paper pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper-0 px-6 py-4">
        <div>
          <h1 className="font-display text-lg font-semibold text-navy-950">
            Admin
          </h1>
          <p className="text-xs text-ink-500">Manage the live site.</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/admin/media"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            Media manager
          </a>
          <a
            href="/admin/tradies"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            Tradies
          </a>
          <a
            href="/admin/homeowners"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            Homeowners
          </a>
          <a
            href="/admin/site-stats"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            Site stats
          </a>
          <a
            href="/"
            target="_blank"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            View site ↗
          </a>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="mx-auto mt-8 max-w-3xl space-y-10 px-6">
        <Section title="Maintenance mode">
          <p className="text-xs text-ink-500">
            When on, every visitor is redirected to a maintenance page — the
            admin panel stays reachable so you can turn it back off.
          </p>
          <MaintenanceModeToggle />
        </Section>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-paper-0 p-6 shadow-sm">
      <h2 className="font-display text-base font-semibold text-navy-950">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
