"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent } from "@/lib/content";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState<
    "idle" | "saving" | "saved" | "error" | "uploading"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then(setContent);
  }, []);

  if (!content) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink-500">Loading your content…</p>
      </main>
    );
  }

  async function handleSave() {
    setStatus("saving");
    setErrorMessage(null);

    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      setStatus("error");
      setErrorMessage("Couldn't save changes. Please try again.");
      return;
    }

    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !content) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      setStatus("error");
      setErrorMessage("Couldn't upload that image. Please try again.");
      return;
    }

    const data = await response.json();
    setContent({ ...content, heroImage: data.path });
    setStatus("idle");
  }

  return (
    <main className="min-h-screen bg-paper pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper-0 px-6 py-4">
        <div>
          <h1 className="font-display text-lg font-semibold text-navy-950">
            Site content
          </h1>
          <p className="text-xs text-ink-500">
            Changes go live on the site as soon as you save.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status === "saved" && (
            <span className="text-sm text-iron-600">Saved ✓</span>
          )}
          {status === "error" && (
            <span className="text-sm text-red-600">{errorMessage}</span>
          )}
          <a
            href="/admin/media"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            Media manager
          </a>
          <a
            href="/admin/tradies"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            Tradie verification
          </a>
          <a
            href="/"
            target="_blank"
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            View site ↗
          </a>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-ink-700 hover:text-navy-950"
          >
            Log out
          </button>
          <button
            onClick={handleSave}
            disabled={status === "saving"}
            className="rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:opacity-60"
          >
            {status === "saving" ? "Saving…" : "Save changes"}
          </button>
        </div>
      </header>

      <div className="mx-auto mt-8 max-w-3xl space-y-10 px-6">
        <Section title="Brand">
          <Field
            label="Site name"
            value={content.brand}
            onChange={(v) => setContent({ ...content, brand: v })}
          />

          <div>
            <label className="block text-sm font-medium text-ink-700">
              Hero image (optional)
            </label>
            <p className="mt-1 text-xs text-ink-500">
              Shown behind the hero section. PNG, JPEG, WEBP, or GIF, up to
              5MB.
            </p>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleImageUpload}
              className="mt-2 text-sm"
            />
            {status === "uploading" && (
              <p className="mt-1 text-xs text-ink-500">Uploading…</p>
            )}
            {content.heroImage && (
              <div className="mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.heroImage}
                  alt="Hero preview"
                  className="h-32 rounded-md border border-line object-cover"
                />
                <button
                  onClick={() => setContent({ ...content, heroImage: null })}
                  className="mt-2 text-xs font-medium text-red-600 hover:underline"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>
        </Section>

        <Section title="Hero">
          <Field
            label="Eyebrow text"
            value={content.hero.eyebrow}
            onChange={(v) =>
              setContent({ ...content, hero: { ...content.hero, eyebrow: v } })
            }
          />
          <Field
            label="Headline"
            value={content.hero.headline}
            multiline
            onChange={(v) =>
              setContent({
                ...content,
                hero: { ...content.hero, headline: v },
              })
            }
          />
          <Field
            label="Subcopy"
            value={content.hero.subcopy}
            multiline
            onChange={(v) =>
              setContent({ ...content, hero: { ...content.hero, subcopy: v } })
            }
          />
        </Section>

        <Section title="Homeowner card">
          <Field
            label="Title"
            value={content.hero.homeownerCard.title}
            onChange={(v) =>
              setContent({
                ...content,
                hero: {
                  ...content.hero,
                  homeownerCard: { ...content.hero.homeownerCard, title: v },
                },
              })
            }
          />
          <Field
            label="Description"
            value={content.hero.homeownerCard.description}
            multiline
            onChange={(v) =>
              setContent({
                ...content,
                hero: {
                  ...content.hero,
                  homeownerCard: {
                    ...content.hero.homeownerCard,
                    description: v,
                  },
                },
              })
            }
          />
          <Field
            label="Button text"
            value={content.hero.homeownerCard.buttonText}
            onChange={(v) =>
              setContent({
                ...content,
                hero: {
                  ...content.hero,
                  homeownerCard: {
                    ...content.hero.homeownerCard,
                    buttonText: v,
                  },
                },
              })
            }
          />
        </Section>

        <Section title="Tradie card">
          <Field
            label="Title"
            value={content.hero.tradieCard.title}
            onChange={(v) =>
              setContent({
                ...content,
                hero: {
                  ...content.hero,
                  tradieCard: { ...content.hero.tradieCard, title: v },
                },
              })
            }
          />
          <Field
            label="Description"
            value={content.hero.tradieCard.description}
            multiline
            onChange={(v) =>
              setContent({
                ...content,
                hero: {
                  ...content.hero,
                  tradieCard: {
                    ...content.hero.tradieCard,
                    description: v,
                  },
                },
              })
            }
          />
          <Field
            label="Button text"
            value={content.hero.tradieCard.buttonText}
            onChange={(v) =>
              setContent({
                ...content,
                hero: {
                  ...content.hero,
                  tradieCard: { ...content.hero.tradieCard, buttonText: v },
                },
              })
            }
          />
        </Section>

        <Section title="Trust stats">
          {content.stats.map((stat, index) => (
            <div key={index} className="grid grid-cols-2 gap-3">
              <Field
                label={`Stat ${index + 1} value`}
                value={stat.value}
                onChange={(v) => {
                  const stats = [...content.stats];
                  stats[index] = { ...stats[index], value: v };
                  setContent({ ...content, stats });
                }}
              />
              <Field
                label={`Stat ${index + 1} label`}
                value={stat.label}
                onChange={(v) => {
                  const stats = [...content.stats];
                  stats[index] = { ...stats[index], label: v };
                  setContent({ ...content, stats });
                }}
              />
            </div>
          ))}
        </Section>

        <Section title="How it works — steps">
          {content.steps.map((step, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-line p-4">
              <p className="font-mono text-xs text-ink-500">
                Step {step.number}
              </p>
              <Field
                label="Title"
                value={step.title}
                onChange={(v) => {
                  const steps = [...content.steps];
                  steps[index] = { ...steps[index], title: v };
                  setContent({ ...content, steps });
                }}
              />
              <Field
                label="Description"
                value={step.description}
                multiline
                onChange={(v) => {
                  const steps = [...content.steps];
                  steps[index] = { ...steps[index], description: v };
                  setContent({ ...content, steps });
                }}
              />
            </div>
          ))}
        </Section>

        <Section title="Bottom call-to-action band">
          <Field
            label="Heading"
            value={content.ctaBand.heading}
            onChange={(v) =>
              setContent({
                ...content,
                ctaBand: { ...content.ctaBand, heading: v },
              })
            }
          />
          <Field
            label="Subcopy"
            value={content.ctaBand.subcopy}
            multiline
            onChange={(v) =>
              setContent({
                ...content,
                ctaBand: { ...content.ctaBand, subcopy: v },
              })
            }
          />
          <Field
            label="Button text"
            value={content.ctaBand.buttonText}
            onChange={(v) =>
              setContent({
                ...content,
                ctaBand: { ...content.ctaBand, buttonText: v },
              })
            }
          />
        </Section>

        <Section title="Footer">
          <Field
            label="Tagline"
            value={content.footerTagline}
            multiline
            onChange={(v) => setContent({ ...content, footerTagline: v })}
          />
        </Section>

        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="w-full rounded-md bg-navy-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save all changes"}
        </button>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-paper-0 p-6 shadow-sm">
      <h2 className="font-display text-base font-semibold text-navy-950">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
        />
      )}
    </div>
  );
}
