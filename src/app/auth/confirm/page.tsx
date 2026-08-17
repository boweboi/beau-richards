import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import VerifyEmailContent from "./VerifyEmailContent";

export const metadata: Metadata = {
  title: "Verify Email | TradieMatch",
  description: "Verify your email address to activate your TradieMatch account.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light",
  themeColor: "#f6f8fa",
};

export default function VerifyEmailPage() {
  return (
    <>
      <NavBar />
      <main
        className="flex flex-1 items-center justify-center bg-paper px-6 py-12"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          paddingTop: "3rem",
          paddingBottom: "3rem",
          backgroundColor: "#f6f8fa",
        }}
      >
        <Suspense
          fallback={
            <div
              className="w-full max-w-sm rounded-2xl border border-line bg-paper-0 p-8 shadow-sm"
              style={{
                maxWidth: "28rem",
                width: "100%",
                borderRadius: "1rem",
                border: "1px solid #dde5ea",
                backgroundColor: "#ffffff",
                padding: "2rem",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-line border-t-navy-950"
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "9999px",
                    border: "4px solid #dde5ea",
                    borderTopColor: "#0b2035",
                    animation: "spin 1s linear infinite",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginBottom: "1rem",
                  }}
                />
                <p className="text-sm text-ink-500" style={{ fontSize: "0.875rem", color: "#5c7286" }}>
                  Loading…
                </p>
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
