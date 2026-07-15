import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/supabase/actions";

export default async function NavBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    fullName = profile?.full_name ?? null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper-0/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-md bg-navy-900 text-sm font-bold text-hivis-500"
          >
            TM
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-navy-950">
            TradeMatch<span className="text-hivis-600"> NZ</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-700 md:flex">
          <a className="hover:text-navy-950" href="/#how-it-works">
            How it works
          </a>
          <Link className="hover:text-navy-950" href="/signup">
            For tradies
          </Link>
          <Link className="hover:text-navy-950" href="/pricing">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-sm font-medium text-ink-700">
                Hi {fullName || user.email}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm font-medium text-ink-700 hover:text-navy-950"
                >
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <div className="hidden items-center gap-4 sm:flex">
              <Link
                href="/login"
                className="text-sm font-medium text-ink-700 hover:text-navy-950"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium text-ink-700 hover:text-navy-950"
              >
                Sign up
              </Link>
            </div>
          )}
          <Link
            href="/jobs"
            className="hidden text-sm font-medium text-ink-700 hover:text-navy-950 sm:block"
          >
            Find jobs
          </Link>
          <a
            href="/post-a-job"
            className="rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 shadow-sm transition hover:bg-hivis-400"
          >
            Post a job
          </a>
        </div>
      </div>
    </header>
  );
}
