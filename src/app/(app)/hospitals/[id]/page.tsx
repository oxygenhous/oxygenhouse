import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HospitalDetailContent } from "@/components/hospital-detail-content";
import type { Hospital, Report } from "@/lib/types";

export default async function HospitalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: hospital } = await supabase
    .from("hospitals")
    .select("*")
    .eq("id", id)
    .single<Hospital>();

  if (!hospital) notFound();

  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("hospital_id", id)
    .order("year", { ascending: false })
    .order("month", { ascending: false })
    .returns<Report[]>();

  return <HospitalDetailContent hospital={hospital} reports={reports ?? []} />;
}
