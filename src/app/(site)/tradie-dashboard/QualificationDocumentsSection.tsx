import { createClient } from "@/lib/supabase/server";
import QualificationDocumentUploadForm from "./QualificationDocumentUploadForm";
import { deleteQualificationDocument } from "./actions";

export type QualificationDocumentRow = {
  id: string;
  storage_path: string;
  file_name: string;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function QualificationDocumentsSection({
  documents,
}: {
  documents: QualificationDocumentRow[];
}) {
  const supabase = await createClient();

  // Private bucket — signed, short-lived URLs only (never a public one).
  // The select-own RLS policy (step17 migration) is what lets this
  // session client generate a signed URL for the caller's own objects.
  const documentsWithUrls = await Promise.all(
    documents.map(async (document) => {
      const { data } = await supabase.storage
        .from("tradie-qualifications")
        .createSignedUrl(document.storage_path, 60 * 10);
      return { ...document, url: data?.signedUrl ?? null };
    })
  );

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-navy-950">
        Qualification documents
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        Upload certificates, LBP cards, or other proof of qualification for an admin to review.
      </p>

      <QualificationDocumentUploadForm />

      {documentsWithUrls.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-line bg-white p-6 text-sm text-ink-700">
          No documents yet — upload one above.
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {documentsWithUrls.map((document) => {
            const deleteWithArgs = deleteQualificationDocument.bind(
              null,
              document.id,
              document.storage_path
            );

            return (
              <li
                key={document.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-4"
              >
                <div className="min-w-0">
                  {document.url ? (
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-sm font-medium text-navy-950 underline"
                    >
                      {document.file_name}
                    </a>
                  ) : (
                    <span className="truncate text-sm font-medium text-navy-950">
                      {document.file_name}
                    </span>
                  )}
                  <p className="text-xs text-ink-500">Uploaded {formatDate(document.created_at)}</p>
                </div>
                <form action={deleteWithArgs}>
                  <button type="submit" className="text-xs font-medium text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
