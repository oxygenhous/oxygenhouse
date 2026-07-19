// Schema-driven definition of the `reports.sections` JSONB column.
// Mirrors the structure agreed in the project spec (page 2 of the PDF),
// so the form, the stored JSON, and the print view all read from one source.

export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "select";
  options?: string[];
};

export type GroupDef = {
  key: string;
  label: string;
  fields: FieldDef[];
};

export type TableDef = {
  key: string;
  label: string;
  columns: FieldDef[];
};

export type SectionDef = {
  key: string;
  label: string;
  mandatory: boolean;
  tables?: TableDef[];
  groups?: GroupDef[];
  notes?: boolean; // free-text notes field on the section itself
};

const STATUS_OPTIONS = ["سليم", "يحتاج صيانة", "معطل"];
const YES_NO = ["نعم", "لا"];

const manifoldColumns = (variant: "automatic" | "manual"): FieldDef[] => [
  { key: "model", label: "الموديل" },
  { key: "serial_no", label: "الرقم التسلسلي" },
  { key: "cylinders_left", label: "أسطوانات (يسار)" },
  { key: "cylinders_right", label: "أسطوانات (يمين)" },
  variant === "automatic"
    ? { key: "automatic_changeover", label: "Automatic Changeover" }
    : { key: "regulator", label: "Regulator" },
  { key: "tail_pipe_left", label: "Tail Pipe (يسار)" },
  { key: "tail_pipe_right", label: "Tail Pipe (يمين)" },
  { key: "gauge", label: "Gauge" },
  { key: "cylinders_change_per_day", label: "عدد مرات تغيير الأسطوانات/يوم" },
  { key: "power", label: "Power" },
];

export const SECTION_SCHEMA: SectionDef[] = [
  {
    key: "oxygen_plant",
    label: "Oxygen Plant (Tank)",
    mandatory: true,
    tables: [
      {
        key: "tanks",
        label: "الخزانات (Tanks)",
        columns: [
          { key: "model", label: "الموديل" },
          { key: "serial_no", label: "الرقم التسلسلي" },
          { key: "manufacturer", label: "الشركة المصنعة" },
          { key: "date_of_manufacture", label: "تاريخ التصنيع" },
          { key: "capacity_l", label: "السعة (لتر)" },
          {
            key: "work_status",
            label: "حالة التشغيل",
            type: "select",
            options: STATUS_OPTIONS,
          },
          { key: "pressure", label: "الضغط" },
          {
            key: "leak_test",
            label: "اختبار التسريب",
            type: "select",
            options: YES_NO,
          },
          { key: "gauge", label: "Gauge" },
          { key: "remarks", label: "ملاحظات" },
        ],
      },
    ],
    groups: [
      {
        key: "vaporizer",
        label: "Vaporizer",
        fields: [
          { key: "model", label: "الموديل" },
          { key: "serial_no", label: "الرقم التسلسلي" },
          { key: "status", label: "الحالة", type: "select", options: STATUS_OPTIONS },
        ],
      },
    ],
  },
  {
    key: "oxygen_manifold_automatic",
    label: "Oxygen Manifold — Automatic",
    mandatory: true,
    groups: [
      { key: "manifold", label: "بيانات المانيفولد", fields: manifoldColumns("automatic") },
    ],
  },
  {
    key: "oxygen_manifold_manual",
    label: "Oxygen Manifold — Manual",
    mandatory: false,
    groups: [
      { key: "manifold", label: "بيانات المانيفولد", fields: manifoldColumns("manual") },
    ],
  },
  {
    key: "n2o_manifold_automatic",
    label: "N2O Manifold — Automatic",
    mandatory: false,
    groups: [
      { key: "manifold", label: "بيانات المانيفولد", fields: manifoldColumns("automatic") },
    ],
  },
  {
    key: "air_plant",
    label: "Air Plant (Compressor)",
    mandatory: true,
    tables: [
      {
        key: "compressors",
        label: "الكمبروسورات",
        columns: [
          { key: "model", label: "الموديل" },
          { key: "manufacturer", label: "الشركة المصنعة" },
          { key: "serial_number", label: "الرقم التسلسلي" },
          { key: "power_new", label: "Power" },
          { key: "flow", label: "Flow" },
          { key: "control_panel", label: "Control Panel" },
          { key: "oil_filter", label: "Oil Filter" },
          { key: "oil_level", label: "Oil Level" },
          { key: "running_hours", label: "ساعات التشغيل" },
        ],
      },
      {
        key: "dryers",
        label: "الدرايرز",
        columns: [
          { key: "manufacturer", label: "الشركة المصنعة" },
          { key: "serial_number", label: "الرقم التسلسلي" },
          { key: "drain", label: "Drain" },
          { key: "flow", label: "Flow" },
          { key: "type", label: "النوع" },
          { key: "power", label: "Power" },
        ],
      },
    ],
    groups: [
      {
        key: "tank",
        label: "Tank",
        fields: [
          { key: "manufacturer", label: "الشركة المصنعة" },
          { key: "capacity", label: "السعة" },
          { key: "clean", label: "نظافة الخزان", type: "select", options: YES_NO },
          { key: "drain", label: "Drain" },
          { key: "safety_valve", label: "Safety Valve" },
        ],
      },
      {
        key: "filters",
        label: "الفلاتر",
        fields: [
          { key: "cyclonic", label: "Cyclonic" },
          { key: "micronic", label: "Micronic" },
          { key: "submicronic", label: "Submicronic" },
          { key: "dust", label: "Dust" },
          { key: "automatic_drain", label: "Automatic Drain" },
        ],
      },
      {
        key: "regulators",
        label: "المنظمات (Regulators)",
        fields: [
          { key: "bar_4", label: "4 Bar" },
          { key: "bar_7", label: "7 Bar" },
        ],
      },
    ],
  },
  {
    key: "air_manual_manifold",
    label: "Air Manual Manifold",
    mandatory: false,
    groups: [
      { key: "manifold", label: "بيانات المانيفولد", fields: manifoldColumns("manual") },
    ],
  },
  {
    key: "vacuum_plant",
    label: "Vacuum Plant",
    mandatory: false,
    tables: [
      {
        key: "pumps",
        label: "المضخات (Pumps)",
        columns: [
          { key: "model", label: "الموديل" },
          { key: "capacity", label: "السعة" },
          { key: "power", label: "Power" },
          { key: "oil_filters", label: "Oil Filters" },
          { key: "oil_level", label: "Oil Level" },
          { key: "control_panel", label: "Control Panel" },
          { key: "flow", label: "Flow" },
          { key: "max_pressure", label: "أقصى ضغط" },
          { key: "min_pressure", label: "أقل ضغط" },
        ],
      },
    ],
    groups: [
      {
        key: "tank",
        label: "Tank",
        fields: [
          { key: "manufacturer", label: "الشركة المصنعة" },
          { key: "capacity", label: "السعة" },
          { key: "drain", label: "Drain" },
        ],
      },
      {
        key: "filters",
        label: "الفلاتر",
        fields: [
          { key: "manufacturer", label: "الشركة المصنعة" },
          { key: "clean", label: "نظافة", type: "select", options: YES_NO },
          { key: "type", label: "النوع" },
        ],
      },
    ],
    notes: true,
  },
  {
    key: "oxygen_generator",
    label: "Oxygen Generator",
    mandatory: false,
    groups: [
      {
        key: "generator",
        label: "المولد (Generator)",
        fields: [
          { key: "model", label: "الموديل" },
          { key: "capacity", label: "السعة" },
          { key: "date_of_installation", label: "تاريخ التركيب" },
          { key: "compressor_model", label: "موديل الكمبروسور" },
          { key: "compressor_capacity", label: "سعة الكمبروسور" },
          { key: "power", label: "Power" },
          { key: "oil_level", label: "Oil Level" },
          { key: "control_panel", label: "Control Panel" },
          { key: "noise", label: "الضوضاء" },
        ],
      },
      {
        key: "tank",
        label: "Tank",
        fields: [
          { key: "manufacturer", label: "الشركة المصنعة" },
          { key: "date_of_installation", label: "تاريخ التركيب" },
          { key: "last_ppm_date", label: "آخر تاريخ صيانة دورية" },
          { key: "capacity", label: "السعة" },
          { key: "max_pressure", label: "أقصى ضغط" },
          { key: "drain", label: "Drain" },
          { key: "safety_valve", label: "Safety Valve" },
        ],
      },
      {
        key: "filters",
        label: "الفلاتر",
        fields: [
          { key: "manufacturer", label: "الشركة المصنعة" },
          { key: "date_of_installation", label: "تاريخ التركيب" },
          { key: "last_ppm_date", label: "آخر تاريخ صيانة دورية" },
          { key: "last_change_date", label: "آخر تاريخ تغيير" },
          { key: "clean", label: "نظافة", type: "select", options: YES_NO },
          { key: "type", label: "النوع" },
        ],
      },
    ],
  },
  {
    key: "regulators_settings",
    label: "Regulators Settings",
    mandatory: false,
    groups: [
      {
        key: "settings",
        label: "إعدادات الضغط",
        fields: [
          { key: "main_pressure_bar", label: "الضغط الرئيسي (Bar)" },
          { key: "all_rooms_bar", label: "ضغط كل الغرف (Bar)" },
          { key: "operations_consultations_bar", label: "ضغط العمليات/العيادات (Bar)" },
        ],
      },
    ],
  },
];

export const SIGNATURE_FIELDS: FieldDef[] = [
  { key: "igas_eng_name", label: "اسم مهندس iGAS" },
  { key: "igas_eng_signature", label: "توقيع مهندس iGAS" },
  { key: "contractor_eng_name", label: "اسم مهندس المقاول" },
  { key: "contractor_eng_signature", label: "توقيع مهندس المقاول" },
  { key: "moh_eng_name", label: "اسم مهندس الوزارة" },
  { key: "moh_eng_signature", label: "توقيع مهندس الوزارة" },
];

function emptyRow(columns: FieldDef[]): Record<string, string> {
  return Object.fromEntries(columns.map((c) => [c.key, ""]));
}

function emptyGroup(fields: FieldDef[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.key, ""]));
}

export function emptyReportSections(): Record<string, unknown> {
  const sections: Record<string, unknown> = {};

  for (const section of SECTION_SCHEMA) {
    const value: Record<string, unknown> = { mandatory: section.mandatory };

    for (const table of section.tables ?? []) {
      value[table.key] = [emptyRow(table.columns)];
    }
    for (const group of section.groups ?? []) {
      value[group.key] = emptyGroup(group.fields);
    }
    if (section.notes) {
      value.notes = "";
    }

    sections[section.key] = value;
  }

  sections.recommendation = "";
  sections.notes = "";
  sections.signatures = emptyGroup(SIGNATURE_FIELDS);

  return sections;
}
