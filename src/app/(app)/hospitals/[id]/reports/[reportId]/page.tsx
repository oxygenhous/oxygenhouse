import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReportForm } from "@/components/report-form/report-form";
import type { Hospital, Report } from "@/lib/types";

const MONTH_NAMES = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string; reportId: string }>;
}) {
  const { id, reportId } = await params;
  const supabase = await createClient();

  const [{ data: hospital }, { data: report }] = await Promise.all([
    supabase.from("hospitals").select("*").eq("id", id).single<Hospital>(),
    supabase
      .from("reports")
      .select("*")
      .eq("id", reportId)
      .single<Report>(),
  ]);

  if (!hospital || !report) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/hospitals/${hospital.id}`}
          className="text-sm text-gray-500 hover:underline"
        >
          ← {hospital.name}
        </Link>
        <h1 className="mt-1 text-xl font-semibold">
          تقرير {MONTH_NAMES[report.month - 1]} {report.year}
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
