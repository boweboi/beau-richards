import JobPostingForm from "@/components/jobpostingform.jsx";

export default function PostAJobPage() {
  return (
    <main className="min-h-screen bg-[#0B1F3A]/[0.03] px-4 py-12 sm:py-16">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-[#0B1F3A] sm:text-4xl">
          Post a job
        </h1>
        <p className="mt-2 text-[#0B1F3A]/60">
          Tell us what you need done and get connected with verified Kiwi tradies in your area.
        </p>
      </div>
      <JobPostingForm />
    </main>
  );
}
