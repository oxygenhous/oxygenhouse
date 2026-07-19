import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Header userEmail={user.email ?? ""} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 print:max-w-none print:px-0 print:py-0">
        {children}
      </main>
    </>
  );
}
