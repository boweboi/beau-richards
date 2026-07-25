import Link from "next/link";

type PaginationParams = {
  tab: "matching" | "all";
  category?: string;
  matchingPage: number;
  allPage: number;
};

function buildJobsUrl(params: PaginationParams) {
  const searchParams = new URLSearchParams();
  searchParams.set("tab", params.tab);
  if (params.category) searchParams.set("category", params.category);
  // Page 1 is the implicit default — omitting it keeps URLs clean and
  // matches sanitizePage's own "missing means 1" behavior.
  if (params.matchingPage > 1) searchParams.set("matchingPage", String(params.matchingPage));
  if (params.allPage > 1) searchParams.set("allPage", String(params.allPage));
  return `/jobs?${searchParams.toString()}`;
}

export { buildJobsUrl };

export default function Pagination({
  page,
  totalPages,
  paramName,
  otherParams,
}: {
  page: number;
  totalPages: number;
  paramName: "matchingPage" | "allPage";
  otherParams: PaginationParams;
}) {
  if (totalPages <= 1) return null;

  const hrefForPage = (targetPage: number) =>
    buildJobsUrl({ ...otherParams, [paramName]: targetPage });

  const linkClass =
    "rounded-md px-3 py-1.5 font-medium text-ink-700 transition hover:bg-navy-950/5";
  const disabledClass = "rounded-md px-3 py-1.5 font-medium text-ink-300";

  return (
    <div className="mt-8 flex items-center justify-center gap-3 text-sm">
      {page > 1 ? (
        <Link href={hrefForPage(page - 1)} className={linkClass}>
          ← Prev
        </Link>
      ) : (
        <span className={disabledClass}>← Prev</span>
      )}

      <span className="text-ink-500">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link href={hrefForPage(page + 1)} className={linkClass}>
          Next →
        </Link>
      ) : (
        <span className={disabledClass}>Next →</span>
      )}
    </div>
  );
}
