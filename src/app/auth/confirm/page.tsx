import { Suspense } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import VerifyEmailContent from "./VerifyEmailContent";

export default function VerifyEmailPage() {
  return (
    <>
      <NavBar />
      <main className="flex flex-1 items-center justify-center bg-paper px-6 py-12">
        <Suspense
          fallback={
            <div className="w-full max-w-sm rounded-2xl border border-line bg-paper-0 p-8 shadow-sm">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-line border-t-navy-950"></div>
                <p className="text-sm text-ink-500">Loading…</p>
              </div>
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
