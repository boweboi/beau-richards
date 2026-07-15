import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/supabase/actions";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const isTradie = profile?.role === "tradie";
  const primaryLink = isTradie
    ? { href: "/jobs", label: "Find jobs" }
    : { href: "/post-a-job", label: "Post a job" };
  const secondaryLink = isTradie
    ? { href: "/post-a-job", label: "Post a job" }
    : { href: "/jobs", label: "Find jobs" };

  return (
    <main className="flex flex-1 items-center justify-center bg-navy-950 px-6 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-paper-0 p-8 text-center shadow-xl">
        <h1 className="font-display text-xl font-semibold text-navy-950">
          Welcome back, {profile?.full_name || user.email}.
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          You&apos;re signed in as a{" "}
          <span className="font-medium text-ink-700">
            {profile?.role ?? "unknown"}
          </span>
          .
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href={primaryLink.href}
            className="block w-full rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
          >
            {primaryLink.label}
          </Link>
          <Link
            href={secondaryLink.href}
            className="block w-full rounded-md border border-line px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-navy-950/5"
          >
            {secondaryLink.label}
          </Link>
        </div>

        <form action={logout} className="mt-3">
          <button
            type="submit"
            className="w-full rounded-md px-4 py-2 text-sm font-medium text-ink-500 transition hover:text-navy-950"
          >
            Log out
          </button>
        </form>
      </div>
    </main>
  );
}
