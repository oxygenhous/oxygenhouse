"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SECTION_SCHEMA, SIGNATURE_FIELDS } from "@/lib/report-sections";
import { updateReportSections } from "@/app/(app)/actions";
import { useI18n } from "@/lib/i18n";
import { SectionCard } from "./section-card";
import { FieldInput } from "./field-input";

type Props = {
  reportId: string;
  hospitalId: string;
  initialSections: Record<string, unknown>;
};

export function ReportForm({ reportId, hospitalId, initialSections }: Props) {
  const { t } = useI18n();
  const [sections, setSections] =
    useState<Record<string, unknown>>(initialSections);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setStatus("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await updateReportSections(reportId, hospitalId, sections);
      setStatus("saved");
    }, 1500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  async function handleSaveNow() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setStatus("saving");
    await updateReportSections(reportId, hospitalId, sections);
    setStatus("saved");
  }

  function updateSection(key: string, value: Record<string, unknown>) {
    setSections((prev) => ({ ...prev, [key]: value }));
  }

  const signatures = (sections.signatures as Record<string, string>) ?? {};

  return (
    <div className="space-y-6 pb-28">
      {SECTION_SCHEMA.map((section) => (
        <SectionCard
          key={section.key}
          section={section}
          value={(sections[section.key] as Record<string, unknown>) ?? {}}
          onChange={(value) => updateSection(section.key, value)}
        />
      ))}

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm border-r-4 border-r-amber-500">
        <h2 className="font-extrabold text-slate-800 text-[15px] pb-3 border-b border-slate-50">
          {t("recommendation")} & {t("general_notes")}
        </h2>
        <div className="mt-4 space-y-4">
          <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500 block">
            <span>{t("recommendation")}</span>
            <textarea
              value={(sections.recommendation as string) ?? ""}
              onChange={(e) =>
                setSections((prev) => ({
                  ...prev,
                  recommendation: e.target.value,
                }))
              }
              rows={3}
              placeholder={t("recommendation_ph")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500 block">
            <span>{t("general_notes")}</span>
            <textarea
              value={(sections.notes as string) ?? ""}
              onChange={(e) =>
                setSections((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={3}
              placeholder={t("general_notes_ph")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm border-r-4 border-r-blue-600">
        <h2 className="font-extrabold text-slate-800 text-[15px] pb-3 border-b border-slate-50">
          {t("signatures")}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {SIGNATURE_FIELDS.map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={signatures[field.key] ?? ""}
              onChange={(v) =>
                setSections((prev) => ({
                  ...prev,
                  signatures: { ...signatures, [field.key]: v },
                }))
              }
            />
          ))}
        </div>
      </section>

      <div className="print:hidden fixed inset-x-0 bottom-0 border-t border-slate-100 bg-white/80 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.03)] z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            {status === "saving" && (
              <div className="flex items-center gap-1.5 text-teal-600 animate-pulse">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
                <span>{t("saving")}</span>
              </div>
            )}
            {status === "saved" && (
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t("auto_saved")}</span>
              </div>
            )}
            {status === "idle" && (
              <span className="text-slate-400 font-semibold">{t("unsaved_changes")}</span>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              href={`/hospitals/${hospitalId}/reports/${reportId}/print`}
              className="rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-800 px-4 py-2.5 text-xs font-extrabold text-slate-600 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm shadow-slate-100/10"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>{t("print_report")}</span>
            </Link>
            <button
              type="button"
              onClick={handleSaveNow}
              className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs px-5 py-2.5 shadow-md shadow-teal-600/10 hover:shadow-lg hover:shadow-teal-600/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>{t("save_now")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
