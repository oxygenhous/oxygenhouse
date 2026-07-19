"use client";

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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 shadow-md shadow-teal-500/15 group-hover:scale-105 transition-all">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <span className="font-extrabold text-lg text-slate-800 tracking-wide">
            iGAS
          </span>
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
