import type { MetadataRoute } from "next";
import { TRADIE_RESOURCE_GUIDES } from "@/lib/tradieResourceGuides";
import { ESTIMATORS } from "@/lib/estimators";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tradiematch.co.nz";

// Only routes that render for an anonymous visitor belong here — anything
// that redirects to /login (jobs, tradies, pricing, post-a-job, dashboards,
// account) is excluded, since Googlebot crawls anonymously and would never
// see that content anyway. See step-by-step verification in the SEO audit.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${BASE_URL}${path}`;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: url("/tradie-recruitment"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/homeowner-recruitment"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/browse-trades"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/estimators"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/tradie-resources"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/homeowner-resources"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/trust"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/reviews"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/success-stories"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/support"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/careers"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: url("/apprenticeship-fund"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/environmental-impact"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/signup"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/login"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/terms-homeowner"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms-tradie"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: url("/privacy-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const resourceArticles: MetadataRoute.Sitemap = TRADIE_RESOURCE_GUIDES.map((guide) => ({
    url: url(guide.href),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const estimators: MetadataRoute.Sitemap = Object.keys(ESTIMATORS).map((slug) => ({
    url: url(`/estimators/${slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...resourceArticles, ...estimators];
}
