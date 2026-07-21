"use client";

import type { SectionDef } from "@/lib/report-sections";
import { useI18n } from "@/lib/i18n";
import { FieldInput } from "./field-input";

type SectionValue = Record<string, unknown>;

function getRowLabel(tableKey: string, index: number, lang: "ar" | "en"): string {
  if (tableKey === "compressors") {
    return lang === "ar" ? `كمبريسور رقم ${index + 1}` : `Compressor #${index + 1}`;
  }
  if (tableKey === "dryers") {
    return lang === "ar" ? `مجفف رقم ${index + 1}` : `Dryer #${index + 1}`;
  }
  if (tableKey === "pumps") {
    return lang === "ar" ? `مضخة رقم ${index + 1}` : `Pump #${index + 1}`;
  }
  return lang === "ar" ? `بند رقم ${index + 1}` : `Item #${index + 1}`;
}

function asRows(value: unknown): Record<string, string>[] {
  return Array.isArray(value) ? (value as Record<string, string>[]) : [];
}

function asGroup(value: unknown): Record<string, string> {
  return value && typeof value === "object"
    ? (value as Record<string, string>)
    : {};
}

export function SectionCard({
  section,
  value,
  onChange,
}: {
  section: SectionDef;
  value: SectionValue;
  onChange: (next: SectionValue) => void;
}) {
  const { t, fl, lang } = useI18n();
  const enabled = section.mandatory || Boolean(value.mandatory);

  function updateField(path: (string | number)[], val: string) {
    const next = structuredClone(value);
    let target: Record<string, unknown> = next;
    for (let i = 0; i < path.length - 1; i++) {
      target = target[path[i] as string] as Record<string, unknown>;
    }
    target[path[path.length - 1]] = val;
    onChange(next);
  }

  function addRow(tableKey: string, columns: { key: string }[]) {
    const rows = asRows(value[tableKey]);
    const emptyRow = Object.fromEntries(columns.map((c) => [c.key, ""]));
    onChange({ ...value, [tableKey]: [...rows, emptyRow] });
  }

  function removeRow(tableKey: string, index: number) {
    const rows = asRows(value[tableKey]);
    onChange({ ...value, [tableKey]: rows.filter((_, i) => i !== index) });
  }

  return (
    <section
      className={`rounded-2xl border transition-all duration-300 p-5 shadow-sm relative overflow-hidden ${
        enabled
          ? "border-slate-100 bg-white border-r-4 border-r-teal-600 shadow-slate-100/50"
          : "border-dashed border-slate-200 bg-slate-50/50 opacity-75"
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-50">
        <h2 className="font-extrabold text-slate-800 text-[15px]">{fl(section.label)}</h2>
        {!section.mandatory && (
          <label className="flex items-center gap-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onChange({ ...value, mandatory: e.target.checked })}
              className="accent-teal-600 rounded"
            />
            <span>{t("section_exists")}</span>
          </label>
        )}
      </div>

      {enabled && (
        <div className="mt-5 space-y-6">
          {section.tables?.map((table) => {
            const rows = asRows(value[table.key]);
            return (
              <div key={table.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                    {fl(table.label)}
                  </h3>
                  <button
                    type="button"
                    onClick={() => addRow(table.key, table.columns)}
                    className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-100/50 transition-colors cursor-pointer"
                  >
                    <span>+ {t("add_row")}</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {rows.map((row, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50/10 p-4 shadow-inner relative hover:border-slate-200/50 transition-all"
                    >
                      <div className="col-span-2 text-xs font-bold text-teal-700 border-b border-slate-100 pb-2">
                        {getRowLabel(table.key, i, lang)}
                      </div>
                      {table.columns.map((col) => (
                        <FieldInput
                          key={col.key}
                          field={col}
                          value={row[col.key] ?? ""}
                          onChange={(v) =>
                            updateField([table.key, i, col.key], v)
                          }
                        />
                      ))}
                      {rows.length > 1 && (
                        <div className="col-span-2 flex justify-end mt-2 pt-2 border-t border-dashed border-slate-100">
                          <button
                            type="button"
                            onClick={() => removeRow(table.key, i)}
                            className="flex items-center justify-center gap-1 rounded-xl border border-rose-200 hover:border-rose-300 hover:bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-all cursor-pointer"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>{t("delete_row")}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {section.groups?.map((group) => {
            const groupValue = asGroup(value[group.key]);
            return (
              <div key={group.key} className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  {fl(group.label)}
                </h3>
                <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50/10 p-4">
                  {group.fields.map((field) => (
                    <FieldInput
                      key={field.key}
                      field={field}
                      value={groupValue[field.key] ?? ""}
                      onChange={(v) =>
                        updateField([group.key, field.key], v)
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {section.notes && (
            <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500 block">
              <span>{t("section_notes")}</span>
              <textarea
                value={(value.notes as string) ?? ""}
                onChange={(e) => onChange({ ...value, notes: e.target.value })}
                rows={3}
                placeholder={t("section_notes_ph")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
              />
            </label>
          )}

          {/* Per-section recommendation */}
          <label className="flex flex-col gap-1.5 text-xs font-bold text-amber-600 block">
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t("recommendation")}
            </span>
            <textarea
              value={(value.recommendation as string) ?? ""}
              onChange={(e) => onChange({ ...value, recommendation: e.target.value })}
              rows={2}
              placeholder={t("recommendation_ph")}
              className="w-full rounded-xl border border-amber-200 bg-amber-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-amber-300 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/10 transition-all"
            />
          </label>
        </div>
      )}
    </section>
  );
}
