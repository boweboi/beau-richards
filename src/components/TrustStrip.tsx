const stats = [
  { value: "12,400+", label: "jobs posted this year" },
  { value: "4,800+", label: "verified tradies on site" },
  { value: "3 hrs", label: "average time to first quote" },
];

export default function TrustStrip() {
  return (
    <section className="border-b border-line bg-paper-0">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-line px-6 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 py-6 sm:justify-center sm:py-8">
            <span className="font-mono text-2xl font-medium text-navy-900 sm:text-3xl">
              {stat.value}
            </span>
            <span className="max-w-[10rem] text-sm text-ink-500">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
