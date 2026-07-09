"use client";

import { useCallback, useRef, useState } from "react";
import { supabase, isSupabaseConfigured, MEDIA_BUCKET } from "@/lib/supabaseClient";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const ACCEPTED_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

type ImageCategory = "Site Logo" | "Homepage Banner" | "Category Thumbnail";

const CATEGORY_OPTIONS: ImageCategory[] = [
  "Site Logo",
  "Homepage Banner",
  "Category Thumbnail",
];

// Maps each category to a storage folder + base filename, matching the
// "logos/site-logo.png" style naming convention.
const CATEGORY_PATH_MAP: Record<
  ImageCategory,
  { folder: string; baseName: string; unique: boolean }
> = {
  "Site Logo": { folder: "logos", baseName: "site-logo", unique: false },
  "Homepage Banner": {
    folder: "banners",
    baseName: "homepage-banner",
    unique: true,
  },
  "Category Thumbnail": {
    folder: "thumbnails",
    baseName: "category-thumbnail",
    unique: true,
  },
};

type UploadState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "uploading" }
  | { status: "success"; url: string; path: string };

function buildStoragePath(category: ImageCategory, file: File): string {
  const { folder, baseName, unique } = CATEGORY_PATH_MAP[category];
  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const suffix = unique ? `-${Date.now()}` : "";
  return `${folder}/${baseName}${suffix}.${extension}`;
}

function validateFile(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXTENSIONS.includes(extension)) {
    return "Only PNG, JPG, or WebP images are allowed.";
  }

  if (file.size > MAX_SIZE_BYTES) {
    return "That image is over 5MB. Please choose a smaller file.";
  }

  return null;
}

export default function MediaManager() {
  const [category, setCategory] = useState<ImageCategory>("Site Logo");
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setState({ status: "error", message: validationError });
        return;
      }

      if (!isSupabaseConfigured) {
        setState({
          status: "error",
          message:
            "Supabase isn't configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.",
        });
        return;
      }

      setState({ status: "uploading" });

      const path = buildStoragePath(category, file);

      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "3600",
        });

      if (uploadError) {
        setState({
          status: "error",
          message: `Upload failed: ${uploadError.message}`,
        });
        return;
      }

      const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

      setState({ status: "success", url: data.publicUrl, path });
    },
    [category]
  );

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
    // Reset so the same file can be re-selected later if needed.
    event.target.value = "";
  }

  return (
    <section className="rounded-2xl bg-paper-0 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-base font-semibold text-navy-950">
            Media manager
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Upload images to cloud storage and grab their public URL.
          </p>
        </div>
        {!isSupabaseConfigured && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            Supabase not configured
          </span>
        )}
      </div>

      {/* Category selector */}
      <div className="mt-5">
        <label
          htmlFor="image-category"
          className="block text-sm font-medium text-ink-700"
        >
          Image type
        </label>
        <select
          id="image-category"
          value={category}
          onChange={(event) => setCategory(event.target.value as ImageCategory)}
          className="mt-1 w-full rounded-md border border-line bg-paper-0 px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none sm:w-72"
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <p className="mt-1 font-mono text-xs text-ink-500">
          Will be saved as{" "}
          <span className="text-navy-700">
            {CATEGORY_PATH_MAP[category].folder}/{CATEGORY_PATH_MAP[category].baseName}
            {CATEGORY_PATH_MAP[category].unique ? "-<timestamp>" : ""}.png
          </span>
        </p>
      </div>

      {/* Drag and drop zone */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            fileInputRef.current?.click();
          }
        }}
        className={`mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
          isDragging
            ? "border-hivis-500 bg-hivis-500/5"
            : "border-line bg-paper hover:border-navy-700/40"
        }`}
      >
        <svg
          aria-hidden="true"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          className="text-navy-700/60"
        >
          <path
            d="M12 16V4m0 0L7 9m5-5 5 5M5 20h14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-sm font-medium text-ink-700">
          Drag an image here, or click to browse
        </p>
        <p className="text-xs text-ink-500">
          PNG, JPG, or WebP — up to 5MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Status states */}
      {state.status === "uploading" && (
        <div className="mt-4 flex items-center gap-2 text-sm text-ink-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-hivis-500" />
          Uploading…
        </div>
      )}

      {state.status === "error" && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.message}
        </p>
      )}

      {state.status === "success" && (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-line bg-paper p-4 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.url}
            alt="Uploaded preview"
            className="h-20 w-20 rounded-lg border border-line object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-iron-600">
              Uploaded successfully
            </p>
            <p className="mt-1 truncate font-mono text-xs text-ink-500">
              {state.path}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <input
                readOnly
                value={state.url}
                onFocus={(event) => event.target.select()}
                className="w-full min-w-0 rounded-md border border-line bg-paper-0 px-2 py-1 font-mono text-xs text-ink-700"
              />
              <button
                onClick={() => navigator.clipboard.writeText(state.url)}
                className="shrink-0 rounded-md bg-navy-950 px-3 py-1 text-xs font-semibold text-white transition hover:bg-navy-800"
              >
                Copy URL
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
