"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { emptyReportSections } from "@/lib/report-sections";

export async function createHospital(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const governorate = String(formData.get("governorate") ?? "").trim();
  const contractor_name = String(formData.get("contractor_name") ?? "").trim();

  if (!name) return;

  await supabase.from("hospitals").insert({
    name,
    city: city || null,
    governorate: governorate || null,
    contractor_name: contractor_name || null,
  });

  revalidatePath("/");
}

export async function updateHospital(hospitalId: string, formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const governorate = String(formData.get("governorate") ?? "").trim();
  const contractor_name = String(formData.get("contractor_name") ?? "").trim();

  if (!name) return;

  await supabase
    .from("hospitals")
    .update({
      name,
      city: city || null,
      governorate: governorate || null,
      contractor_name: contractor_name || null,
    })
    .eq("id", hospitalId);

  revalidatePath("/");
  revalidatePath(`/hospitals/${hospitalId}`);
}

export async function deleteHospital(hospitalId: string) {
  const supabase = await createClient();
  await supabase.from("hospitals").delete().eq("id", hospitalId);
  revalidatePath("/");
}

export async function deleteReport(reportId: string, hospitalId: string) {
  const supabase = await createClient();
  await supabase.from("reports").delete().eq("id", reportId);
  revalidatePath(`/hospitals/${hospitalId}`);
  revalidatePath("/");
}

export async function updateReportMetadata(
  reportId: string,
  hospitalId: string,
  reportDate: string,
  month: number,
  year: number
) {
  const supabase = await createClient();
  await supabase
    .from("reports")
    .update({ report_date: reportDate, month, year })
    .eq("id", reportId);

  revalidatePath(`/hospitals/${hospitalId}`);
  revalidatePath(`/hospitals/${hospitalId}/reports/${reportId}`);
}

export async function createReport(hospitalId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();

  const { data, error } = await supabase
    .from("reports")
    .insert({
      hospital_id: hospitalId,
      report_date: now.toISOString().slice(0, 10),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      engineer_id: user.id,
      sections: emptyReportSections(),
    })
    .select("id")
    .single();

  if (error || !data) return;

  revalidatePath(`/hospitals/${hospitalId}`);
  redirect(`/hospitals/${hospitalId}/reports/${data.id}`);
}

export async function updateReportSections(
  reportId: string,
  hospitalId: string,
  sections: Record<string, unknown>
) {
  const supabase = await createClient();

  await supabase.from("reports").update({ sections }).eq("id", reportId);

  revalidatePath(`/hospitals/${hospitalId}/reports/${reportId}`);
}

export async function updatePrintData(
  reportId: string,
  hospitalId: string,
  sections: Record<string, unknown>,
  hospitalData: {
    name: string;
    city: string | null;
    governorate: string | null;
    contractor_name: string | null;
  },
  reportData: {
    report_date: string;
    month: number;
    year: number;
  }
) {
  const supabase = await createClient();

  await Promise.all([
    supabase
      .from("reports")
      .update({
        sections,
        report_date: reportData.report_date,
        month: reportData.month,
        year: reportData.year,
      })
      .eq("id", reportId),
    supabase
      .from("hospitals")
      .update(hospitalData)
      .eq("id", hospitalId),
  ]);

  revalidatePath(`/hospitals/${hospitalId}/reports/${reportId}/print`);
  revalidatePath(`/hospitals/${hospitalId}/reports/${reportId}`);
  revalidatePath(`/hospitals/${hospitalId}`);
  revalidatePath("/");
}

