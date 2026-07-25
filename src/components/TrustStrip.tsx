export type TrustStripStats = {
  verified_tradies: number;
  jobs_completed: number;
  average_quote_hours: number;
};

function formatCount(value: number) {
  return `${value.toLocaleString("en-NZ")}+`;
}

function formatHours(value: number) {
  return `${value % 1 === 0 ? value : value.toFixed(1)} hrs`;
}

export default function TrustStrip({ stats }: { stats: TrustStripStats }) {
  const items = [
    { value: formatCount(stats.jobs_completed), label: "jobs completed" },
    { value: formatCount(stats.verified_tradies), label: "verified tradies on site" },
    { value: formatHours(stats.average_quote_hours), label: "average time to first quote" },
  ];

  return (
    <section className="border-b border-line bg-paper-0">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-line px-6 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-4 py-6 sm:justify-center sm:py-8">
            <span className="font-mono text-2xl font-medium text-navy-900 sm:text-3xl">
              {item.value}
            </span>
            <span className="max-w-[10rem] text-sm text-ink-500">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
