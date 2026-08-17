import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/supabase/actions";
import GivingBackMenu from "./GivingBackMenu";

export default async function NavBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName: string | null = null;
  let isTradie = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();
    fullName = profile?.full_name ?? null;
    isTradie = profile?.role === "tradie";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper-0/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2">
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center rounded-md bg-navy-900 text-[0.7rem] font-bold text-hivis-500 sm:h-8 sm:w-8 sm:text-sm"
          >
            TM
          </span>
          <span className="truncate font-display text-base font-semibold tracking-tight text-navy-950 sm:text-lg">
            TradieMatch
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-700 md:flex">
          <Link className="hover:text-navy-950 hover:underline hover:decoration-hivis-500 decoration-2 underline-offset-8" href="/#how-it-works">
            How it works
          </Link>
          <Link className="hover:text-navy-950 hover:underline hover:decoration-hivis-500 decoration-2 underline-offset-8" href="/tradie-resources">
            Tradie resources
          </Link>
          <Link className="hover:text-navy-950 hover:underline hover:decoration-hivis-500 decoration-2 underline-offset-8" href="/homeowner-resources">
            Homeowner resources
          </Link>
          <GivingBackMenu />
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-sm font-medium text-ink-700">
                Hi {fullName || user.email}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm font-medium text-ink-700 hover:text-navy-950 hover:underline hover:decoration-hivis-500 decoration-2 underline-offset-8"
                >
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <div className="hidden items-center gap-4 sm:flex">
              <Link
                href="/login"
                className="text-sm font-medium text-ink-700 hover:text-navy-950 hover:underline hover:decoration-hivis-500 decoration-2 underline-offset-8"
              >
                Log in
              </Link>
            </div>
          )}
          {user && (
            <Link
              href={isTradie ? "/tradie-dashboard" : "/homeowner-dashboard"}
              className="whitespace-nowrap text-sm font-medium text-ink-700 hover:text-navy-950 hover:underline hover:decoration-hivis-500 decoration-2 underline-offset-8"
            >
              Dashboard
            </Link>
          )}
          {!isTradie && (
            <a
              href="/signup"
              className="hidden rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 shadow-sm transition hover:bg-hivis-400 sm:block"
            >
              Sign up
            </a>
          )}
          {user ? (
            <form action={logout} className="sm:hidden">
              <button
                type="submit"
                className="rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 shadow-sm transition hover:bg-hivis-400"
              >
                Logout
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 shadow-sm transition hover:bg-hivis-400 sm:hidden"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
