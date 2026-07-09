export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper-0/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2">
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
          <a className="hover:text-navy-950" href="#how-it-works">
            How it works
          </a>
          <a className="hover:text-navy-950" href="#tradies">
            For tradies
          </a>
          <a className="hover:text-navy-950" href="#faq">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="#login"
            className="hidden text-sm font-medium text-ink-700 hover:text-navy-950 sm:block"
          >
            Log in
          </a>
          <a
            href="#post-job"
            className="rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 shadow-sm transition hover:bg-hivis-400"
          >
            Post a job
          </a>
        </div>
      </div>
    </header>
  );
}
