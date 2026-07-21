"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import {
  createReport,
  updateHospital,
  deleteHospital,
  deleteReport,
  updateReportMetadata,
} from "@/app/(app)/actions";
import type { Hospital, Report } from "@/lib/types";

export function HospitalDetailContent({
  hospital,
  reports,
}: {
  hospital: Hospital;
  reports: Report[];
}) {
  const { t } = useI18n();

  const [isEditingHospital, setIsEditingHospital] = useState(false);
  const [isDeletingHospital, setIsDeletingHospital] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);

  const [isPending, setIsPending] = useState(false);

  const updateHospitalWithId = updateHospital.bind(null, hospital.id);
  const createReportWithId = createReport.bind(null, hospital.id);

  async function handleDeleteHospital() {
    setIsPending(true);
    await deleteHospital(hospital.id);
  }

  async function handleDeleteReport(reportId: string) {
    setIsPending(true);
    await deleteReport(reportId, hospital.id);
    setDeletingReportId(null);
    setIsPending(false);
  }

  async function handleSaveReportMetadata(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingReport) return;
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const date = String(formData.get("report_date") || "").trim();
    const month = Number(formData.get("month") || 1);
    const year = Number(formData.get("year") || new Date().getFullYear());

    await updateReportMetadata(editingReport.id, hospital.id, date, month, year);
    setEditingReport(null);
    setIsPending(false);
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-800 transition-all"
        >
          <span>&larr;</span>
          <span>{t("back_to_hospitals")}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingHospital((prev) => !prev)}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <svg className="h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>{t("edit")}</span>
          </button>

          <button
            onClick={() => setIsDeletingHospital(true)}
            className="rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 px-3.5 py-1.5 text-xs font-bold text-rose-600 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>{t("delete")}</span>
          </button>
        </div>
      </div>

      {/* Hospital Banner */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm border-r-4 border-r-teal-600 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-lg bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700">
              {t("hospital_file_badge")}
            </span>
            {hospital.city && (
              <span className="inline-flex rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                {hospital.city}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-extrabold text-slate-800">{hospital.name}</h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-500">
            {hospital.governorate && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {hospital.governorate}
              </span>
            )}
            {hospital.contractor_name && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {t("contractor")}: {hospital.contractor_name}
              </span>
            )}
          </div>
        </div>

        <form action={createReportWithId} className="shrink-0">
          <button
            type="submit"
            className="w-full md:w-auto rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-teal-600/10 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t("create_report")}
          </button>
        </form>
      </div>

      {/* Edit Hospital Form Inline Collapsible */}
      {isEditingHospital && (
        <div className="rounded-2xl border border-teal-200 bg-teal-50/20 p-5 shadow-sm space-y-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-teal-900">{t("edit_hospital_details")}</h3>
            <button
              onClick={() => setIsEditingHospital(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              ✕ {t("cancel")}
            </button>
          </div>
          <form action={updateHospitalWithId} onSubmit={() => setIsEditingHospital(false)} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-600">{t("hospital_name_label")} *</label>
              <input
                name="name"
                required
                defaultValue={hospital.name}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">{t("city_label")}</label>
              <input
                name="city"
                defaultValue={hospital.city ?? ""}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">{t("governorate_label")}</label>
              <input
                name="governorate"
                defaultValue={hospital.governorate ?? ""}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-600">{t("contractor_label")}</label>
              <input
                name="contractor_name"
                defaultValue={hospital.contractor_name ?? ""}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
              />
            </div>
            <div className="flex items-center gap-3 sm:col-span-2 mt-2">
              <button
                type="submit"
                className="rounded-xl bg-teal-600 hover:bg-teal-700 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
              >
                {t("save_changes")}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingHospital(false)}
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-600 cursor-pointer"
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Maintenance Reports Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-extrabold text-slate-800">{t("maintenance_reports")}</h2>

        <div className="grid grid-cols-1 gap-3">
          {reports.length ? (
            reports.map((report) => (
              <div
                key={report.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-100 hover:border-teal-500/20 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 gap-4"
              >
                <Link
                  href={`/hospitals/${hospital.id}/reports/${report.id}`}
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-800 group-hover:text-teal-700 transition-colors">
                      {t("report_of")} {t(`month_${report.month}`)} {report.year}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                      {t("report_date")}: {new Date(report.report_date).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <Link
                    href={`/hospitals/${hospital.id}/reports/${report.id}`}
                    className="rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 px-3 py-1.5 text-xs font-bold transition-all"
                  >
                    {t("open_edit")} &larr;
                  </Link>

                  <button
                    onClick={() => setEditingReport(report)}
                    title={t("edit")}
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setDeletingReportId(report.id)}
                    title={t("delete")}
                    className="p-1.5 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500">
              {t("no_reports_detail")}
            </div>
          )}
        </div>
      </div>

      {/* Delete Hospital Modal Confirmation */}
      {isDeletingHospital && (
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
                onClick={handleDeleteHospital}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isPending ? t("deleting") : t("delete")}
              </button>
              <button
                disabled={isPending}
                onClick={() => setIsDeletingHospital(false)}
                className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 transition-all cursor-pointer"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Report Modal Confirmation */}
      {deletingReportId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-[fadeIn_0.2s_ease-out] border border-rose-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mx-auto">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-extrabold text-slate-800">{t("delete_report")}</h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                {t("delete_report_confirm")}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={isPending}
                onClick={() => handleDeleteReport(deletingReportId)}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isPending ? t("deleting") : t("delete")}
              </button>
              <button
                disabled={isPending}
                onClick={() => setDeletingReportId(null)}
                className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 transition-all cursor-pointer"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Report Modal */}
      {editingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-800">{t("edit_report_title")}</h3>
              <button
                onClick={() => setEditingReport(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveReportMetadata} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600">{t("report_date")}</label>
                <input
                  type="date"
                  name="report_date"
                  required
                  defaultValue={editingReport.report_date}
                  className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600">{t("report_month")}</label>
                  <select
                    name="month"
                    defaultValue={editingReport.month}
                    className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m} — {t(`month_${m}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600">{t("report_year")}</label>
                  <input
                    type="number"
                    name="year"
                    required
                    defaultValue={editingReport.year}
                    className="rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
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
                  onClick={() => setEditingReport(null)}
                  className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 transition-all cursor-pointer"
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
