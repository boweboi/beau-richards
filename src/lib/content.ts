import fs from "fs/promises";
import path from "path";

export type SiteContent = {
  brand: string;
  heroImage: string | null;
  hero: {
    eyebrow: string;
    headline: string;
    subcopy: string;
    homeownerCard: { title: string; description: string; buttonText: string };
    tradieCard: { title: string; description: string; buttonText: string };
  };
  stats: { value: string; label: string }[];
  steps: { number: string; title: string; description: string }[];
  ctaBand: { heading: string; subcopy: string; buttonText: string };
  footerTagline: string;
};

const CONTENT_PATH = path.join(
  process.cwd(),
  "src",
  "content",
  "site-content.json"
);

export async function getContent(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

export async function saveContent(content: SiteContent): Promise<void> {
  await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
}
