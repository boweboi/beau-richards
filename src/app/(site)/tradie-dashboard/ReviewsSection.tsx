export type ReviewRow = {
  id: string;
  created_at: string;
  homeowner_name: string;
  job_title: string | null;
  communication_rating: number;
  quality_rating: number;
  timeliness_rating: number;
  value_rating: number;
  professionalism_rating: number;
  overall_rating: number;
};

function formatReviewDate(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ReviewsSection({ reviews }: { reviews: ReviewRow[] }) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.overall_rating, 0) / reviews.length
      : null;

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-navy-950">
        Your reviews
        {reviews.length > 0 && (
          <span className="ml-2 text-sm font-normal text-ink-500">
            ({reviews.length}, {averageRating!.toFixed(1)}★ avg)
          </span>
        )}
      </h2>

      {reviews.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-line bg-white p-6 text-sm text-ink-700">
          No reviews yet — homeowners can leave one once they&apos;ve hired you
          for a job.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-navy-950">{review.homeowner_name}</p>
                <span className="text-xs text-ink-500">
                  {formatReviewDate(review.created_at)}
                </span>
              </div>
              {review.job_title && (
                <p className="mt-1 text-sm text-ink-500">{review.job_title}</p>
              )}
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-ink-700 sm:grid-cols-3">
                <div>Communication: {review.communication_rating}★</div>
                <div>Quality: {review.quality_rating}★</div>
                <div>Timeliness: {review.timeliness_rating}★</div>
                <div>Value: {review.value_rating}★</div>
                <div>Professionalism: {review.professionalism_rating}★</div>
                <div className="font-semibold text-navy-950">
                  Overall: {review.overall_rating.toFixed(1)}★
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
