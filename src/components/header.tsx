"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function Header({ userEmail }: { userEmail: string }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  // Get first letter of email for a user avatar
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-40 print:hidden border-b border-slate-100 bg-white/80 backdrop-blur-md shadow-sm shadow-slate-100/20">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/report-assets/logo.png"
            alt="iGAS"
            width={100}
            height={40}
            className="h-10 w-auto group-hover:scale-105 transition-all"
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-1.5 pl-3 border border-slate-100/50">
            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-teal-500/10 text-[13px] font-extrabold text-teal-700">
              {userInitial}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-600">
              {userEmail}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 hover:border-rose-100 hover:bg-rose-50 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 transition-all cursor-pointer active:scale-95"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            تسجيل الخروج
          </button>
        </div>
      </div>
    </header>
  );
}
