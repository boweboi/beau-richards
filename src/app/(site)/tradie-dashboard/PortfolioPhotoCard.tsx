import { deletePortfolioPhoto } from "./actions";

const TYPE_LABELS: Record<string, string> = {
  before: "Before",
  after: "After",
  other: "Photo",
};

export default function PortfolioPhotoCard({
  photo,
}: {
  photo: {
    id: string;
    storage_path: string;
    caption: string | null;
    photo_type: string;
    url: string;
  };
}) {
  const deleteWithArgs = deletePortfolioPhoto.bind(null, photo.id, photo.storage_path);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.url}
        alt={photo.caption || "Portfolio photo"}
        className="aspect-square w-full object-cover"
      />
      <div className="p-3">
        <span className="inline-flex items-center rounded-full bg-navy-900/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-navy-700">
          {TYPE_LABELS[photo.photo_type] ?? "Photo"}
        </span>
        {photo.caption && (
          <p className="mt-2 text-xs leading-relaxed text-ink-700">{photo.caption}</p>
        )}
        <form action={deleteWithArgs} className="mt-2">
          <button type="submit" className="text-xs font-medium text-red-600 hover:underline">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
