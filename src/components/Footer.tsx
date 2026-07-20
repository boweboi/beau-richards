const columns = [
  {
    title: "Homeowners",
    links: [
      { label: "Post a job", href: "/post-a-job" },
      { label: "Browse trades", href: "/browse-trades" },
      { label: "Trust & verification", href: "/trust" },
      { label: "Reviews", href: "/reviews" },
      { label: "Homeowner resources", href: "/homeowner-resources" },
    ],
  },
  {
    title: "Tradies",
    links: [
      { label: "Join as a tradie", href: "/signup" },
      { label: "Pricing", href: "/pricing" },
      { label: "Success stories", href: "/success-stories" },
      { label: "Support", href: "/support" },
      { label: "Tradie resources", href: "/tradie-resources" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="tradies" className="mt-auto bg-navy-950">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-display text-lg font-semibold tracking-tight text-white">
              TradeMatch<span className="text-hivis-500"> NZ</span>
            </span>
            <p className="mt-3 max-w-xs text-sm text-white/60">
              Connecting homeowners with trusted, verified tradies across
              Aotearoa New Zealand.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-white/50">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TradeMatch NZ. All rights reserved.</p>
          <p>Made in Aotearoa.</p>
        </div>
      </div>
    </footer>
  );
}
