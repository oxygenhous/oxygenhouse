import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;

    if (!user) {
      redirect("/login");
    }
  } catch (err) {
    const digest = (err as { digest?: string })?.digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Supabase auth check failed:", err);
    redirect("/login");
  }

  return (
    <>
      <Header userEmail={userEmail ?? ""} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 print:max-w-none print:px-0 print:py-0">
        {children}
      </main>
    </>
  );
}
