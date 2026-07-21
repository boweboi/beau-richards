"use client";

import { useCallback, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { addPortfolioPhoto } from "./actions";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const ACCEPTED_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

type UploadState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "error"; message: string };

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

export default function PortfolioUploadForm() {
  const [photoType, setPhotoType] = useState<"before" | "after" | "other">("other");
  const [caption, setCaption] = useState("");
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const fileInput = form.elements.namedItem("photo") as HTMLInputElement | null;
      const file = fileInput?.files?.[0];

      if (!file) {
        setState({ status: "error", message: "Please choose a photo to upload." });
        return;
      }

      const validationError = validateFile(file);
      if (validationError) {
        setState({ status: "error", message: validationError });
        return;
      }

      setState({ status: "uploading" });

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setState({ status: "error", message: "You need to be signed in to upload photos." });
        return;
      }

      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("tradie-portfolios")
        .upload(path, file, { contentType: file.type, cacheControl: "3600" });

      if (uploadError) {
        setState({ status: "error", message: `Upload failed: ${uploadError.message}` });
        return;
      }

      const result = await addPortfolioPhoto(path, caption, photoType);

      if (result.error) {
        setState({ status: "error", message: result.error });
        return;
      }

      setState({ status: "idle" });
      setCaption("");
      setPhotoType("other");
      setSelectedFileName(null);
      form.reset();
    },
    [caption, photoType]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-2xl border border-line bg-white p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-end">
        <div>
          <label htmlFor="portfolio-photo" className="block text-sm font-medium text-ink-700">
            Photo
          </label>
          <div className="mt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md border border-line px-3 py-2 text-sm font-semibold text-navy-950 transition hover:bg-navy-950/5"
            >
              Choose photo
            </button>
            <span className="truncate text-sm text-ink-500">
              {selectedFileName ?? "No file chosen"}
            </span>
          </div>
          <input
            ref={fileInputRef}
            id="portfolio-photo"
            name="photo"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name ?? null)}
            className="hidden"
          />
        </div>

        <div>
          <label htmlFor="portfolio-caption" className="block text-sm font-medium text-ink-700">
            Caption (optional)
          </label>
          <input
            id="portfolio-caption"
            type="text"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="e.g. Bathroom reno, Hamilton"
            className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="portfolio-type" className="block text-sm font-medium text-ink-700">
            Type
          </label>
          <select
            id="portfolio-type"
            value={photoType}
            onChange={(event) =>
              setPhotoType(event.target.value as "before" | "after" | "other")
            }
            className="mt-1 rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-700 focus:outline-none"
          >
            <option value="before">Before</option>
            <option value="after">After</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={state.status === "uploading"}
        className="mt-4 rounded-md bg-hivis-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.status === "uploading" ? "Uploading…" : "Upload photo"}
      </button>

      {state.status === "error" && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.message}
        </p>
      )}
      <p className="mt-2 text-xs text-ink-500">PNG, JPG, or WebP — up to 5MB.</p>
    </form>
  );
}
