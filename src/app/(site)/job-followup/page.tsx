import { verifySignedJobToken } from "@/lib/session-crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import JobFollowUpConfirmForm from "./JobFollowUpConfirmForm";

export default async function JobFollowUpPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const jobId = await verifySignedJobToken(token);

  let jobTitle: string | null = null;
  if (jobId) {
    const admin = createAdminClient();
    const { data: job } = await admin
      .from("jobs")
      .select("title, status")
      .eq("id", jobId)
      .single();

    if (job && job.status === "open") {
      jobTitle = job.title;
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-navy-950 px-6 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-paper-0 p-8 shadow-xl">
        {jobId && token && jobTitle ? (
          <JobFollowUpConfirmForm token={token} jobTitle={jobTitle} />
        ) : (
          <>
            <h1 className="font-display text-xl font-semibold text-navy-950">
              All sorted?
            </h1>
            <p className="mt-4 text-sm text-red-600" role="alert">
              This link has expired, or the job isn&apos;t open any more. If
              you still need to close a job listing, sign in and do it from
              your dashboard, or contact{" "}
              <a
                href="mailto:support@tradiematch.co.nz"
                className="font-medium underline"
              >
                support@tradiematch.co.nz
              </a>
              .
            </p>
          </>
        )}
      </div>
    </main>
  );
}
