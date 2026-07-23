import { verifySignedEmailToken } from "@/lib/session-crypto";
import UnsubscribeForm from "./UnsubscribeForm";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const email = await verifySignedEmailToken(token);

  return (
    <main className="flex flex-1 items-center justify-center bg-navy-950 px-6 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-paper-0 p-8 shadow-xl">
        {email && token ? (
          <UnsubscribeForm email={email} token={token} />
        ) : (
          <>
            <h1 className="font-display text-xl font-semibold text-navy-950">Unsubscribe</h1>
            <p className="mt-4 text-sm text-red-600" role="alert">
              This unsubscribe link has expired. Contact{" "}
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
