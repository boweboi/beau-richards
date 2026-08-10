import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tradiematch.co.nz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Prefix matches — "/jobs" and "/tradies" also cover /jobs/[id] and
      // /tradies/[id]. Every route here already redirects an anonymous
      // visitor to /login (see src/app/sitemap.ts), so this just saves
      // crawl budget rather than hiding anything actually reachable.
      disallow: [
        "/admin",
        "/api",
        "/account",
        "/homeowner-dashboard",
        "/tradie-dashboard",
        "/jobs",
        "/tradies",
        "/post-a-job",
        "/pricing",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
