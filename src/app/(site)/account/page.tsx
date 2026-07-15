import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/supabase/actions";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <main className="flex flex-1 items-center justify-center bg-navy-950 px-6 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-paper-0 p-8 text-center shadow-xl">
        <h1 className="font-display text-xl font-semibold text-navy-950">
          Welcome back, {profile?.full_name || user.email}.
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          You&apos;re signed in as a{" "}
          <span className="font-medium text-ink-700">
            {profile?.role ?? "unknown"}
          </span>
          .
        </p>

        <form action={logout} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-md bg-hivis-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-hivis-400"
          >
            Log out
          </button>
        </form>
      </div>
    </main>
  );
}
