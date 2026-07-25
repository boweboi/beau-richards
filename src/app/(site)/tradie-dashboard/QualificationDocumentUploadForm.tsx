"use client";

import { useCallback, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { addQualificationDocument } from "./actions";

const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg"];
const ACCEPTED_EXTENSIONS = ["pdf", "png", "jpg", "jpeg"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

type UploadState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "error"; message: string };

function validateFile(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXTENSIONS.includes(extension)) {
    return "Only PDF, PNG, or JPG files are allowed.";
  }

  if (file.size > MAX_SIZE_BYTES) {
    return "That file is over 10MB. Please choose a smaller file.";
  }

  return null;
}

export default function QualificationDocumentUploadForm() {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("document") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!file) {
      setState({ status: "error", message: "Please choose a document to upload." });
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
      setState({ status: "error", message: "You need to be signed in to upload documents." });
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const path = `${user.id}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("tradie-qualifications")
      .upload(path, file, { contentType: file.type, cacheControl: "3600" });

    if (uploadError) {
      setState({ status: "error", message: `Upload failed: ${uploadError.message}` });
      return;
    }

    const result = await addQualificationDocument(path, file.name);

    if (result.error) {
      setState({ status: "error", message: result.error });
      return;
    }

    setState({ status: "idle" });
    setSelectedFileName(null);
    form.reset();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-2xl border border-line bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="qualification-document" className="block text-sm font-medium text-ink-700">
            Document
          </label>
          <div className="mt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md border border-line px-3 py-2 text-sm font-semibold text-navy-950 transition hover:bg-navy-950/5"
            >
              Choose file
            </button>
            <span className="truncate text-sm text-ink-500">
              {selectedFileName ?? "No file chosen"}
            </span>
          </div>
          <input
            ref={fileInputRef}
            id="qualification-document"
            name="document"
            type="file"
            accept="application/pdf,image/png,image/jpeg"
            onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name ?? null)}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          disabled={state.status === "uploading"}
          className="rounded-md bg-hivis-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.status === "uploading" ? "Uploading…" : "Upload document"}
        </button>
      </div>

      {state.status === "error" && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.message}
        </p>
      )}
      <p className="mt-2 text-xs text-ink-500">
        PDF, PNG, or JPG — up to 10MB. Only you and TradieMatch admins can view these.
      </p>
    </form>
  );
}
