import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/dashboard-content";
import type { Hospital } from "@/lib/types";

export default async function HospitalsPage() {
  let list: Hospital[] = [];

  try {
    const supabase = await createClient();
    const { data: hospitals, error } = await supabase
      .from("hospitals")
      .select("*")
      .order("name")
      .returns<Hospital[]>();

    if (error) {
      console.error("Error fetching hospitals:", error);
    } else {
      list = hospitals ?? [];
    }
  } catch (err) {
    console.error("Supabase connection error:", err);
  }

  const uniqueCities = new Set(
    list.map((h) => h.city?.trim()).filter(Boolean)
  );

  return <DashboardContent hospitals={list} totalCities={uniqueCities.size} />;
}
