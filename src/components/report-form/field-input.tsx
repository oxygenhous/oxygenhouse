"use client";

import type { FieldDef } from "@/lib/report-sections";
import { useI18n } from "@/lib/i18n";

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
}) {
  const { fl } = useI18n();
  const label = fl(field.label);

  let statusClass = "border-slate-200 bg-slate-50/30 text-slate-800 focus:bg-white";
  if (value.startsWith("OK") || value.startsWith("Yes")) {
    statusClass = "border-emerald-200 bg-emerald-50/30 text-emerald-700 font-bold focus:bg-white";
  } else if (value.includes("Maintenance") || value.includes("صيانة")) {
    statusClass = "border-amber-200 bg-amber-50/30 text-amber-700 font-bold focus:bg-white";
  } else if (value.includes("Defect") || value.includes("عيب") || value.startsWith("No") || value.includes("معطل")) {
    statusClass = "border-rose-200 bg-rose-50/30 text-rose-700 font-bold focus:bg-white";
  }

  if (field.type === "select") {
    return (
      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500 block">
        <span>{label}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border px-3 py-2.5 text-sm font-medium focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all cursor-pointer text-center ${statusClass}`}
        >
          <option value="" className="text-slate-500 font-normal">—</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {fl(opt)}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-500 block">
      <span>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all text-center"
      />
    </label>
  );
}
