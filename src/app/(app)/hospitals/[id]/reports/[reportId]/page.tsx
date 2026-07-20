import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReportPageContent } from "@/components/report-page-content";
import type { Hospital, Report } from "@/lib/types";

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

  return <ReportPageContent hospital={hospital} report={report} />;
}
