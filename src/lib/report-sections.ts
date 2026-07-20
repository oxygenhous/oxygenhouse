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
  notes?: boolean;
};

const STATUS_OPTIONS = ["OK / سليم", "Needs Maintenance / يحتاج صيانة", "Defective / معطل"];
const OK_DEFECT = ["OK / سليم", "Defect / عيب"];
const OK_CHANGE = ["OK / سليم", "Change / تغيير"];
const YES_NO = ["Yes / نعم", "No / لا"];

export const SECTION_SCHEMA: SectionDef[] = [
  // ──── Page 2: MEDICAL AIR PLANT ────
  {
    key: "air_plant",
    label: "Medical Air Plant / كمبريسور الهواء الطبي",
    mandatory: true,
    tables: [
      {
        key: "compressors",
        label: "Compressors / الكمبريسورات",
        columns: [
          { key: "model", label: "Model / الموديل" },
          { key: "serial_number", label: "Serial Number / الرقم التسلسلي" },
          { key: "power_kw", label: "Power (kW) / القدرة" },
          { key: "flow", label: "Flow / التدفق" },
          { key: "control_panel", label: "Control Panel / لوحة التحكم", type: "select", options: STATUS_OPTIONS },
          { key: "oil_filter", label: "Oil Filter / فلتر الزيت", type: "select", options: OK_CHANGE },
          { key: "oil_level", label: "Oil Level / مستوى الزيت", type: "select", options: STATUS_OPTIONS },
          { key: "running_hours", label: "Running Hours / ساعات التشغيل" },
        ],
      },
      {
        key: "dryers",
        label: "Dryers / المجففات",
        columns: [
          { key: "manufacturer", label: "Manufacturer / الشركة المصنعة" },
          { key: "serial_number", label: "Serial Number / الرقم التسلسلي" },
          { key: "drain", label: "Drain / الصرف", type: "select", options: STATUS_OPTIONS },
          { key: "flow", label: "Flow / التدفق" },
          { key: "type", label: "Type / النوع" },
          { key: "power", label: "Power / القدرة" },
        ],
      },
    ],
    groups: [
      {
        key: "tank",
        label: "Tank / الخزان",
        fields: [
          { key: "manufacturer", label: "Manufacturer / الشركة المصنعة" },
          { key: "capacity", label: "Capacity (L) / السعة (لتر)" },
          { key: "clean", label: "Clean / النظافة", type: "select", options: YES_NO },
          { key: "drain", label: "Drain / الصرف", type: "select", options: STATUS_OPTIONS },
          { key: "safety_valve", label: "Safety Valve / صمام الأمان", type: "select", options: STATUS_OPTIONS },
        ],
      },
      {
        key: "filters",
        label: "Filters / الفلاتر",
        fields: [
          { key: "cyclone_filter", label: "Cyclone Filter / فلتر سيكلون", type: "select", options: STATUS_OPTIONS },
          { key: "micronic_filter", label: "Micronic Filter / فلتر ميكرونيك", type: "select", options: STATUS_OPTIONS },
          { key: "submicronic_filter", label: "Submicronic Filter / فلتر سب ميكرونيك", type: "select", options: STATUS_OPTIONS },
          { key: "dust_filter", label: "Dust Filter / فلتر الغبار", type: "select", options: STATUS_OPTIONS },
          { key: "automatic_drain", label: "Automatic Drain / الصرف الأوتوماتيك", type: "select", options: STATUS_OPTIONS },
        ],
      },
      {
        key: "regulators",
        label: "Regulators / المنظمات",
        fields: [
          { key: "main", label: "Main / رئيسي (Bar)" },
          { key: "bar_2", label: "2 Bar" },
        ],
      },
    ],
  },

  // ──── Page 3: MEDICAL VACUUM PLANT ────
  {
    key: "vacuum_plant",
    label: "Medical Vacuum Plant / وحدة التفريغ الطبي",
    mandatory: true,
    tables: [
      {
        key: "pumps",
        label: "Pumps / المضخات",
        columns: [
          { key: "model", label: "Model / الموديل" },
          { key: "serial_number", label: "Serial Number / الرقم التسلسلي" },
          { key: "power", label: "Power (kW) / القدرة" },
          { key: "oil_filters", label: "Oil Filters / فلاتر الزيت", type: "select", options: OK_CHANGE },
          { key: "oil_level", label: "Oil Level / مستوى الزيت", type: "select", options: STATUS_OPTIONS },
          { key: "control_panel", label: "Control Panel / لوحة التحكم", type: "select", options: STATUS_OPTIONS },
          { key: "flow", label: "Flow / التدفق" },
          { key: "running_hours", label: "Running Hours / ساعات التشغيل" },
          { key: "max_pressure", label: "Max Pressure (Bar) / أقصى ضغط" },
          { key: "min_pressure", label: "Min Pressure (Bar) / أقل ضغط" },
        ],
      },
    ],
    groups: [
      {
        key: "tank",
        label: "Tank / الخزان",
        fields: [
          { key: "manufacturer", label: "Manufacturer / الشركة المصنعة" },
          { key: "capacity", label: "Capacity (L) / السعة (لتر)" },
          { key: "drain", label: "Drain / الصرف", type: "select", options: STATUS_OPTIONS },
        ],
      },
      {
        key: "filters",
        label: "Filters / الفلاتر",
        fields: [
          { key: "manufacturer", label: "Manufacturer / الشركة المصنعة" },
          { key: "clean", label: "Clean / النظافة", type: "select", options: YES_NO },
          { key: "type", label: "Type / النوع" },
        ],
      },
    ],
    notes: true,
  },

  // ──── Page 4: LIQUID OXYGEN TANK ────
  {
    key: "oxygen_plant",
    label: "Liquid Oxygen Tank / خزان الأكسجين السائل",
    mandatory: true,
    groups: [
      {
        key: "tank_info",
        label: "Tank Info / بيانات الخزان",
        fields: [
          { key: "manufacturer", label: "Manufacturer / الشركة المصنعة" },
          { key: "serial_no", label: "Serial No. / الرقم التسلسلي" },
          { key: "tank_capacity", label: "Tank Capacity (L) / سعة الخزان (لتر)" },
          { key: "date_of_manufacturing", label: "Date of Manufacturing / تاريخ التصنيع" },
          { key: "leak_test", label: "Leak Test / اختبار التسريب", type: "select", options: OK_DEFECT },
          { key: "gauge", label: "Gauge / العداد", type: "select", options: OK_DEFECT },
          { key: "vaporizers", label: "Vaporizers / المبخرات", type: "select", options: OK_DEFECT },
          { key: "refill_time", label: "Refill Time / وقت إعادة التعبئة" },
        ],
      },
    ],
  },

  // ──── Page 5: OXYGEN AUTOMATIC MANIFOLD ────
  {
    key: "oxygen_manifold_automatic",
    label: "Oxygen Automatic Manifold / موزع الأكسجين الآلي",
    mandatory: true,
    groups: [
      {
        key: "manifold",
        label: "Manifold Info / بيانات الموزع",
        fields: [
          { key: "manufacturer", label: "Manufacturer / الشركة المصنعة" },
          { key: "serial_no", label: "Serial No. / الرقم التسلسلي" },
          { key: "qty_cylinders_left", label: "Qty of Cylinders (Left) / عدد الاسطوانات (يسار)" },
          { key: "qty_cylinders_right", label: "Qty of Cylinders (Right) / عدد الاسطوانات (يمين)" },
          { key: "automatic_changeover", label: "Automatic Changeover / التغيير الآلي", type: "select", options: OK_CHANGE },
          { key: "tail_pipe_left", label: "Tail Pipe (Left) / الماسورة (يسار)", type: "select", options: OK_CHANGE },
          { key: "tail_pipe_right", label: "Tail Pipe (Right) / الماسورة (يمين)", type: "select", options: OK_CHANGE },
          { key: "gauge", label: "Gauge / العداد", type: "select", options: OK_CHANGE },
          { key: "cylinders_change_per_day", label: "Cylinders Change/Day / تغيير الاسطوانات/يوم" },
          { key: "points", label: "Points / النقاط" },
        ],
      },
    ],
  },

  // ──── Page 6: OXYGEN MANUAL MANIFOLD ────
  {
    key: "oxygen_manifold_manual",
    label: "Oxygen Manual Manifold / موزع الأكسجين الاحتياطي",
    mandatory: false,
    groups: [
      {
        key: "manifold",
        label: "Manifold Info / بيانات الموزع",
        fields: [
          { key: "manufacturer", label: "Manufacturer / الشركة المصنعة" },
          { key: "serial_no", label: "Serial No. / الرقم التسلسلي" },
          { key: "qty_cylinders_left", label: "Qty of Cylinders (Left) / عدد الاسطوانات (يسار)" },
          { key: "qty_cylinders_right", label: "Qty of Cylinders (Right) / عدد الاسطوانات (يمين)" },
          { key: "automatic_changeover", label: "Regulator Changeover / تغيير المنظم", type: "select", options: OK_CHANGE },
          { key: "tail_pipe_left", label: "Tail Pipe (Left) / الماسورة (يسار)", type: "select", options: OK_CHANGE },
          { key: "tail_pipe_right", label: "Tail Pipe (Right) / الماسورة (يمين)", type: "select", options: OK_CHANGE },
          { key: "gauge", label: "Gauge / العداد", type: "select", options: OK_CHANGE },
          { key: "power", label: "Power / القدرة" },
        ],
      },
    ],
  },

  // ──── Page 7: N2O AUTOMATIC MANIFOLD ────
  {
    key: "n2o_manifold_automatic",
    label: "N₂O Automatic Manifold / موزع أكسيد النيتروز الأوتوماتيك",
    mandatory: false,
    groups: [
      {
        key: "manifold",
        label: "Manifold Info / بيانات الموزع",
        fields: [
          { key: "manufacturer", label: "Manufacturer / الشركة المصنعة" },
          { key: "serial_no", label: "Serial No. / الرقم التسلسلي" },
          { key: "qty_cylinders_left", label: "Qty of Cylinders (Left) / عدد الاسطوانات (يسار)" },
          { key: "qty_cylinders_right", label: "Qty of Cylinders (Right) / عدد الاسطوانات (يمين)" },
          { key: "automatic_changeover", label: "Automatic Changeover / التغيير الآلي", type: "select", options: OK_CHANGE },
          { key: "tail_pipe_left", label: "Tail Pipe (Left) / الماسورة (يسار)", type: "select", options: OK_CHANGE },
          { key: "tail_pipe_right", label: "Tail Pipe (Right) / الماسورة (يمين)", type: "select", options: OK_CHANGE },
          { key: "gauge", label: "Gauge / العداد", type: "select", options: OK_CHANGE },
          { key: "power", label: "Power / القدرة" },
        ],
      },
    ],
  },

  // ──── Page 8: MEDICAL AIR MANUAL MANIFOLD ────
  {
    key: "air_manual_manifold",
    label: "Medical Air Manual Manifold / موزع الهواء الطبي الاحتياطي",
    mandatory: false,
    groups: [
      {
        key: "manifold",
        label: "Manifold Info / بيانات الموزع",
        fields: [
          { key: "manufacturer", label: "Manufacturer / الشركة المصنعة" },
          { key: "serial_no", label: "Serial No. / الرقم التسلسلي" },
          { key: "qty_cylinders_left", label: "Qty of Cylinders (Left) / عدد الاسطوانات (يسار)" },
          { key: "qty_cylinders_right", label: "Qty of Cylinders (Right) / عدد الاسطوانات (يمين)" },
          { key: "regulator_changeover", label: "Regulator Changeover / تغيير المنظم", type: "select", options: OK_CHANGE },
          { key: "tail_pipe_left", label: "Tail Pipe (Left) / الماسورة (يسار)", type: "select", options: OK_CHANGE },
          { key: "tail_pipe_right", label: "Tail Pipe (Right) / الماسورة (يمين)", type: "select", options: OK_CHANGE },
          { key: "gauge", label: "Gauge / العداد", type: "select", options: OK_CHANGE },
          { key: "power", label: "Power / القدرة" },
        ],
      },
    ],
  },

  // ──── Page 9: OXYGEN GENERATOR ────
  {
    key: "oxygen_generator",
    label: "Oxygen Generator / مولد الأكسجين",
    mandatory: false,
    groups: [
      {
        key: "generator",
        label: "Generator / المولد",
        fields: [
          { key: "manufacturer", label: "Manufacturer / الشركة المصنعة" },
          { key: "date_of_installation", label: "Date of Installation / تاريخ التركيب" },
          { key: "oil_level", label: "Oil Level / مستوى الزيت", type: "select", options: STATUS_OPTIONS },
          { key: "control_panel", label: "Control Panel / لوحة التحكم", type: "select", options: STATUS_OPTIONS },
          { key: "max_pressure", label: "Max Pressure (Bar) / أقصى ضغط" },
          { key: "min_pressure", label: "Min Pressure (Bar) / أقل ضغط" },
          { key: "noise", label: "Noise / الضوضاء", type: "select", options: STATUS_OPTIONS },
          { key: "power", label: "Power (kW) / القدرة" },
        ],
      },
      {
        key: "tank",
        label: "Tank / الخزان",
        fields: [
          { key: "manufacturer", label: "Manufacturer / الشركة المصنعة" },
          { key: "date_of_installation", label: "Date of Installation / تاريخ التركيب" },
          { key: "last_ppm_date", label: "Last PPM Date / آخر صيانة دورية" },
          { key: "capacity", label: "Capacity (L) / السعة (لتر)" },
          { key: "max_pressure", label: "Max Pressure (Bar) / أقصى ضغط" },
          { key: "drain", label: "Drain / الصرف", type: "select", options: STATUS_OPTIONS },
          { key: "safety_valve", label: "Safety Valve / صمام الأمان", type: "select", options: STATUS_OPTIONS },
        ],
      },
      {
        key: "filters",
        label: "Filters & Secation Bottle / الفلاتر",
        fields: [
          { key: "manufacturer", label: "Manufacture / الشركة المصنعة" },
          { key: "date_of_installation", label: "Date of Installation / تاريخ التركيب" },
          { key: "last_ppm_date", label: "Last PPM Date / آخر صيانة دورية" },
          { key: "last_date_of_change", label: "Last Date of Change / آخر تاريخ تغيير" },
          { key: "clean", label: "Clean / النظافة", type: "select", options: YES_NO },
          { key: "type", label: "Type / النوع" },
          { key: "max_pressure", label: "Max Pressure (Bar) / أقصى ضغط" },
          { key: "min_pressure", label: "Min Pressure (Bar) / أقل ضغط" },
        ],
      },
    ],
  },

  // ──── REGULATORS SETTINGS (not a separate print page, added to air plant) ────
  {
    key: "regulators_settings",
    label: "Regulators Settings / إعدادات المنظمات",
    mandatory: false,
    groups: [
      {
        key: "settings",
        label: "Pressure Settings / إعدادات الضغط",
        fields: [
          { key: "main_pressure_bar", label: "Main Pressure (Bar) / الضغط الرئيسي" },
          { key: "all_rooms_bar", label: "All Rooms (Bar) / ضغط كل الغرف" },
          { key: "operations_consultations_bar", label: "Operations (Bar) / ضغط العمليات" },
        ],
      },
    ],
  },
];

export const SIGNATURE_FIELDS: FieldDef[] = [
  { key: "igas_eng_name", label: "IGAS Eng Name / اسم مهندس iGAS" },
  { key: "igas_eng_signature", label: "IGAS Eng Signature / توقيع مهندس iGAS" },
  { key: "contractor_eng_name", label: "Cont Eng Name / اسم مهندس المقاول" },
  { key: "contractor_eng_signature", label: "Cont Eng Signature / توقيع مهندس المقاول" },
  { key: "moh_eng_name", label: "M.O.H Eng Name / اسم مهندس الوزارة" },
  { key: "moh_eng_signature", label: "M.O.H Eng Signature / توقيع مهندس الوزارة" },
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
