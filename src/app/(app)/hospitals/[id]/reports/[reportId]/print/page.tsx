import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrintView } from "@/components/report-print/print-view";
import { PrintButton } from "@/components/print-button";
import type { Hospital, Report } from "@/lib/types";

export default async function ReportPrintPage({
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
    <div>
      <div className="print:hidden mb-4 flex justify-end">
        <PrintButton />
      </div>
      <PrintView hospital={hospital} report={report} />
    </div>
  );
}
