import { createClient } from "@/lib/supabase/server";
import PortfolioUploadForm from "./PortfolioUploadForm";
import PortfolioPhotoCard from "./PortfolioPhotoCard";

export type PortfolioPhotoRow = {
  id: string;
  storage_path: string;
  caption: string | null;
  photo_type: "before" | "after" | "other";
  created_at: string;
};

export default async function PortfolioSection({
  photos,
}: {
  photos: PortfolioPhotoRow[];
}) {
  const supabase = await createClient();

  const photosWithUrls = photos.map((photo) => ({
    ...photo,
    url: supabase.storage.from("tradie-portfolios").getPublicUrl(photo.storage_path).data
      .publicUrl,
  }));

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-navy-950">
        Work portfolio
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        Upload before/after photos of completed jobs to showcase your work.
      </p>

      <PortfolioUploadForm />

      {photosWithUrls.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-line bg-white p-6 text-sm text-ink-700">
          No photos yet — upload your first job photo above.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photosWithUrls.map((photo) => (
            <PortfolioPhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}
    </div>
  );
}
