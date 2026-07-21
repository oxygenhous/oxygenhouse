"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { createHospital, deleteHospital, updateHospital } from "@/app/(app)/actions";
import type { Hospital } from "@/lib/types";

export function DashboardContent({
  hospitals,
  totalCities,
}: {
  hospitals: Hospital[];
  totalCities: number;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const totalHospitals = hospitals.length;

  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [deletingHospitalId, setDeletingHospitalId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleDeleteHospital(hospitalId: string) {
    setIsPending(true);
    try {
      await deleteHospital(hospitalId);
      setDeletingHospitalId(null);
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  async function handleUpdateHospital(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingHospital) return;
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    await updateHospital(editingHospital.id, formData);
    setEditingHospital(null);
    setIsPending(false);
  }

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 p-6 md:p-8 text-white shadow-xl shadow-teal-700/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
              {t("dashboard_title")}
            </h1>
            <p className="text-teal-50 text-sm font-medium">
              {t("dashboard_desc")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 min-w-[120px] border border-white/10 text-center">
              <span className="text-3xl font-extrabold block">{totalHospitals}</span>
              <span className="text-[11px] text-teal-100 font-bold">{t("hospitals_registered")}</span>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 min-w-[120px] border border-white/10 text-center">
              <span className="text-3xl font-extrabold block">{totalCities}</span>
              <span className="text-[11px] text-teal-100 font-bold">{t("cities_covered")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">{t("hospital_list")}</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">{t("hospital_list_desc")}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 border border-emerald-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold text-emerald-700">{t("system_active")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hospitals.length ? (
          hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-teal-500/30 hover:shadow-teal-500/5 transition-all duration-300 relative flex flex-col justify-between min-h-[150px]"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 font-bold group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <svg className="h-5.5 w-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex rounded-lg bg-slate-50 border border-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-700 group-hover:border-teal-100 transition-colors">
                      {[hospital.city, hospital.governorate].filter(Boolean).join(" — ") || "—"}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingHospital(hospital);
                      }}
                      title={t("edit")}
                      className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:text-teal-700 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingHospitalId(hospital.id);
                      }}
                      title={t("delete")}
                      className="p-1 rounded-lg border border-rose-200 text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link href={`/hospitals/${hospital.id}`} className="font-extrabold text-slate-800 text-[16px] group-hover:text-teal-700 transition-colors block">
                    {hospital.name}
                  </Link>
                  {hospital.contractor_name && (
                    <p className="text-[11px] font-semibold text-slate-400">
                      {t("contractor")}: {hospital.contractor_name}
                    </p>
                  )}
                </div>
              </div>

              <Link
                href={`/hospitals/${hospital.id}`}
                className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3 text-xs font-bold text-teal-600 group-hover:text-teal-700 cursor-pointer"
              >
                <span>{t("open_full_file")}</span>
                <span className="text-lg">&larr;</span>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500">
            {t("no_reports")}
          </div>
        )}
      </div>

      {/* Add Hospital Accordion */}
      <details className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300">
        <summary className="flex cursor-pointer items-center justify-between p-5 font-extrabold text-slate-700 bg-slate-50/50 hover:bg-slate-50 select-none list-none transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-teal-600 text-lg group-open:rotate-45 transition-transform font-light">+</span>
            <span>{t("add_hospital_title")}</span>
          </div>
          <svg className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="border-t border-slate-100 p-5 bg-white">
          <form action={createHospital} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-600">{t("hospital_name_label")} *</label>
              <input name="name" required placeholder={t("hospital_name_ph")} className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">{t("city_label")}</label>
              <input name="city" placeholder={t("city_ph")} className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">{t("governorate_label")}</label>
              <input name="governorate" placeholder={t("governorate_ph")} className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-600">{t("contractor_label")}</label>
              <input name="contractor_name" placeholder={t("contractor_ph")} className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" />
            </div>
            <button type="submit" className="mt-2 sm:col-span-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 py-3 text-sm font-bold text-white shadow-md shadow-teal-600/10 hover:shadow-lg hover:shadow-teal-600/20 transition-all active:scale-[0.98] cursor-pointer text-center">
              {t("add_hospital_btn")}
            </button>
          </form>
        </div>
      </details>

      {/* Edit Hospital Modal */}
      {editingHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-800">{t("edit_hospital_details")}</h3>
              <button
                onClick={() => setEditingHospital(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateHospital} className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-600">{t("hospital_name_label")} *</label>
                <input
                  name="name"
                  required
                  defaultValue={editingHospital.name}
                  className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600">{t("city_label")}</label>
                <input
                  name="city"
                  defaultValue={editingHospital.city ?? ""}
                  className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600">{t("governorate_label")}</label>
                <input
                  name="governorate"
                  defaultValue={editingHospital.governorate ?? ""}
                  className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-600">{t("contractor_label")}</label>
                <input
                  name="contractor_name"
                  defaultValue={editingHospital.contractor_name ?? ""}
                  className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
                />
              </div>

              <div className="flex items-center gap-3 sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-3 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {t("save_changes")}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setEditingHospital(null)}
                  className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 transition-all cursor-pointer"
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Hospital Confirmation Modal */}
      {deletingHospitalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-[fadeIn_0.2s_ease-out] border border-rose-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mx-auto">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-extrabold text-slate-800">{t("delete_hospital")}</h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                {t("delete_hospital_confirm")}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={isPending}
                onClick={() => handleDeleteHospital(deletingHospitalId)}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isPending ? t("deleting") : t("delete")}
              </button>
              <button
                disabled={isPending}
                onClick={() => setDeletingHospitalId(null)}
                className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 transition-all cursor-pointer"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
