"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type Lang = "ar" | "en";

type Translations = Record<string, Record<Lang, string>>;

const T: Translations = {
  // ── Header ──
  sign_out: { ar: "تسجيل الخروج", en: "Sign Out" },

  // ── Login ──
  login_subtitle: { ar: "نظام تقارير صيانة شبكة الغازات الطبية", en: "Medical Gas Maintenance Report System" },
  email: { ar: "البريد الإلكتروني", en: "Email" },
  password: { ar: "كلمة المرور", en: "Password" },
  sign_in: { ar: "تسجيل الدخول", en: "Sign In" },
  signing_in: { ar: "جاري تسجيل الدخول...", en: "Signing in..." },
  login_error: { ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة", en: "Invalid email or password" },

  // ── Dashboard ──
  dashboard_title: { ar: "لوحة التحكم الرئيسية", en: "Main Dashboard" },
  dashboard_desc: { ar: "متابعة وإدارة تقارير الصيانة الدورية لشبكة الغازات الطبية بالمستشفيات.", en: "Monitor and manage periodic medical gas maintenance reports for hospitals." },
  hospitals_registered: { ar: "مستشفيات مسجلة", en: "Registered Hospitals" },
  cities_covered: { ar: "مدن مغطاة", en: "Cities Covered" },
  hospital_list: { ar: "قائمة المستشفيات", en: "Hospital List" },
  hospital_list_desc: { ar: "اختر مستشفى لعرض تقاريره الدورية، أو تعديل بياناتها.", en: "Select a hospital to view its reports or edit its data." },
  system_active: { ar: "النظام نشط", en: "System Active" },
  open_full_file: { ar: "فتح الملف الكامل", en: "Open Full File" },
  contractor: { ar: "المقاول", en: "Contractor" },
  add_hospital_title: { ar: "إضافة مستشفى جديد للسيستم", en: "Add New Hospital" },
  hospital_name_label: { ar: "اسم المستشفى بالكامل", en: "Hospital Full Name" },
  hospital_name_ph: { ar: "مثال: مستشفى قصر العيني", en: "e.g. Cairo University Hospital" },
  city_label: { ar: "المدينة", en: "City" },
  city_ph: { ar: "مثال: المنصورة", en: "e.g. Mansoura" },
  governorate_label: { ar: "المحافظة", en: "Governorate" },
  governorate_ph: { ar: "مثال: الدقهلية", en: "e.g. Dakahlia" },
  contractor_label: { ar: "اسم مقاول المشروع", en: "Project Contractor Name" },
  contractor_ph: { ar: "مثال: شركة المقاولون العرب", en: "e.g. Arab Contractors" },
  add_hospital_btn: { ar: "تسجيل وإضافة المستشفى", en: "Register & Add Hospital" },

  // ── Hospital Detail ──
  hospital_file: { ar: "ملف المستشفى", en: "Hospital File" },
  hospital_file_badge: { ar: "ملف مستشفى", en: "Hospital File" },
  back_to_hospitals: { ar: "العودة للمستشفيات", en: "Back to Hospitals" },
  edit_data: { ar: "تعديل بيانات المستشفى", en: "Edit Hospital Data" },
  edit_hospital_details: { ar: "تعديل بيانات وملف المستشفى", en: "Edit Hospital Details" },
  save_changes: { ar: "حفظ التعديلات الجديدة", en: "Save Changes" },
  cancel: { ar: "إلغاء", en: "Cancel" },
  reports: { ar: "التقارير الدورية", en: "Periodic Reports" },
  maintenance_reports: { ar: "تقارير الصيانة الدورية", en: "Periodic Maintenance Reports" },
  no_reports: { ar: "لا توجد تقارير حتى الآن", en: "No reports yet" },
  no_reports_detail: { ar: "لا توجد أي تقارير صيانة مسجلة لهذه المستشفى بعد.", en: "No maintenance reports registered for this hospital yet." },
  create_report: { ar: "إنشاء تقرير صيانة جديد", en: "Create New Maintenance Report" },
  report_month: { ar: "الشهر", en: "Month" },
  report_year: { ar: "السنة", en: "Year" },
  creating_report: { ar: "جاري الإنشاء...", en: "Creating..." },
  report_of: { ar: "تقرير", en: "Report" },
  report_date: { ar: "تاريخ التقرير", en: "Report Date" },
  complete_ready: { ar: "مكتمل / جاهز للطباعة", en: "Complete / Ready to Print" },
  open_edit: { ar: "فتح وتعديل", en: "Open & Edit" },
  delete_hospital: { ar: "مسح المستشفى بالكامل", en: "Delete Entire Hospital" },
  delete_hospital_confirm: { ar: "هل أنت تأكد من مسح هذه المستشفى بالكامل؟ سيتم مسح جميع التقارير المرتبطة بها نهائياً ولا يمكن التراجع عن هذا الإجراء.", en: "Are you sure you want to delete this hospital? All related reports will be permanently deleted." },
  delete_report: { ar: "مسح التقرير", en: "Delete Report" },
  delete_report_confirm: { ar: "هل أنت تأكد من مسح هذا التقرير نهائياً؟", en: "Are you sure you want to permanently delete this report?" },
  edit_report_title: { ar: "تعديل تفاصيل التقرير", en: "Edit Report Details" },
  deleting: { ar: "جاري المسح...", en: "Deleting..." },
  edit: { ar: "تعديل", en: "Edit" },
  delete: { ar: "مسح", en: "Delete" },

  // ── Report Page ──
  report_title: { ar: "تقرير", en: "Report" },

  // ── Print ──
  print_save_pdf: { ar: "طباعة / حفظ PDF", en: "Print / Save PDF" },
  adjust_positions: { ar: "تحديد المواقع", en: "Adjust Positions" },
  done_positions: { ar: "تم — حفظ المواقع", en: "Done — Save Positions" },
  reset_positions: { ar: "إعادة ضبط", en: "Reset" },
  calibrate_hint: { ar: "اسحب كل خانة بالماوس وحطها مكانها الصح على الصورة — المواقع بتتحفظ تلقائياً وبتفضل ثابتة لكل التقارير", en: "Drag each field with the mouse onto its correct spot on the image — positions save automatically and stay fixed for all reports" },

  // ── Months ──
  month_1: { ar: "يناير", en: "January" },
  month_2: { ar: "فبراير", en: "February" },
  month_3: { ar: "مارس", en: "March" },
  month_4: { ar: "أبريل", en: "April" },
  month_5: { ar: "مايو", en: "May" },
  month_6: { ar: "يونيو", en: "June" },
  month_7: { ar: "يوليو", en: "July" },
  month_8: { ar: "أغسطس", en: "August" },
  month_9: { ar: "سبتمبر", en: "September" },
  month_10: { ar: "أكتوبر", en: "October" },
  month_11: { ar: "نوفمبر", en: "November" },
  month_12: { ar: "ديسمبر", en: "December" },

  // ── Report Form ──
  back_to_hospital: { ar: "العودة لملف المستشفى", en: "Back to Hospital" },
  monthly_report: { ar: "تقرير الصيانة الدورية", en: "Monthly Maintenance Report" },
  print_report: { ar: "طباعة التقرير", en: "Print Report" },
  auto_saved: { ar: "تم الحفظ تلقائياً", en: "Auto-saved" },
  saving: { ar: "جاري الحفظ...", en: "Saving..." },
  unsaved_changes: { ar: "تغييرات غير محفوظة", en: "Unsaved changes" },
  save_now: { ar: "حفظ الآن", en: "Save Now" },
  section_exists: { ar: "هذا القسم موجود بالمستشفى", en: "This section exists in the hospital" },
  add_row: { ar: "إضافة صف جديد", en: "Add New Row" },
  delete_row: { ar: "حذف هذا الصف", en: "Delete This Row" },
  section_notes: { ar: "ملاحظات القسم", en: "Section Notes" },
  section_notes_ph: { ar: "اكتب أي ملاحظات إضافية بخصوص هذا القسم هنا...", en: "Write any additional notes about this section here..." },
  recommendation: { ar: "التوصيات", en: "Recommendation" },
  recommendation_ph: { ar: "اكتب التوصيات هنا...", en: "Write recommendations here..." },
  general_notes: { ar: "ملاحظات عامة", en: "General Notes" },
  general_notes_ph: { ar: "اكتب الملاحظات العامة هنا...", en: "Write general notes here..." },
  signatures: { ar: "التوقيعات", en: "Signatures" },
};

type I18nContextType = {
  lang: Lang;
  dir: "rtl" | "ltr";
  toggle: () => void;
  t: (key: string) => string;
  fl: (bilingualLabel: string) => string;
};

const I18nContext = createContext<I18nContextType>({
  lang: "ar",
  dir: "rtl",
  toggle: () => {},
  t: (key: string) => key,
  fl: (label: string) => label,
});

function getInitialLang(): Lang {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "ar") return saved;
  }
  return "ar";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  }, []);

  const t = useCallback(
    (key: string) => T[key]?.[lang] ?? key,
    [lang]
  );

  const fl = useCallback(
    (bilingualLabel: string) => {
      const parts = bilingualLabel.split(" / ");
      if (parts.length === 2) {
        return lang === "en" ? parts[0] : parts[1];
      }
      return bilingualLabel;
    },
    [lang]
  );

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ lang, dir, toggle, t, fl }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
