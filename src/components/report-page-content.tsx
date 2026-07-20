"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { ReportForm } from "@/components/report-form/report-form";
import type { Hospital, Report } from "@/lib/types";

export function ReportPageContent({
  hospital,
  report,
}: {
  hospital: Hospital;
  report: Report;
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/hospitals/${hospital.id}`}
          className="text-sm text-gray-500 hover:underline"
        >
          &larr; {hospital.name}
        </Link>
        <h1 className="mt-1 text-xl font-semibold">
          {t("report_title")} {t(`month_${report.month}`)} {report.year}
        </h1>
      </div>

      <ReportForm
        reportId={report.id}
        hospitalId={hospital.id}
        initialSections={report.sections}
      />
    </div>
  );
}
