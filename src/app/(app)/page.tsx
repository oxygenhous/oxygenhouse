import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/dashboard-content";
import type { Hospital } from "@/lib/types";

export default async function HospitalsPage() {
  const supabase = await createClient();
  const { data: hospitals } = await supabase
    .from("hospitals")
    .select("*")
    .order("name")
    .returns<Hospital[]>();

  const list = hospitals ?? [];
  const uniqueCities = new Set(
    list.map((h) => h.city?.trim()).filter(Boolean)
  );

  return <DashboardContent hospitals={list} totalCities={uniqueCities.size} />;
}
