import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrintView } from "@/components/report-print/print-view";
import type { Hospital, Report } from "@/lib/types";

export const dynamic = "force-dynamic";

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

  return <PrintView hospital={hospital} report={report} />;
}

