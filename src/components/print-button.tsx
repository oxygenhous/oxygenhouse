"use client";

import { useI18n } from "@/lib/i18n";

export function PrintButton() {
  const { t } = useI18n();
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      {t("print_save_pdf")}
    </button>
  );
}
