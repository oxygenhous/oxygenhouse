"use client";

import { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";
import Link from "next/link";
import { updatePrintData } from "@/app/(app)/actions";
import { useI18n } from "@/lib/i18n";
import type { Hospital, Report } from "@/lib/types";

const MONTH_NAMES = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

const LAYOUT_KEY = "print-layout-v1";

type PageConfig = {
  sectionKey: string;
  image: string;
  mandatory: boolean;
};

const PAGES: PageConfig[] = [
  { sectionKey: "air_plant", image: "/report-assets/page-air-plant.png", mandatory: true },
  { sectionKey: "vacuum_plant", image: "/report-assets/page-vacuum-plant.png", mandatory: true },
  { sectionKey: "oxygen_plant", image: "/report-assets/page-liquid-oxygen-tank.png", mandatory: true },
  { sectionKey: "oxygen_manifold_automatic", image: "/report-assets/page-o2-auto-manifold.png", mandatory: true },
  { sectionKey: "oxygen_manifold_manual", image: "/report-assets/page-o2-manual-manifold.png", mandatory: false },
  { sectionKey: "n2o_manifold_automatic", image: "/report-assets/page-n2o-auto-manifold.png", mandatory: false },
  { sectionKey: "air_manual_manifold", image: "/report-assets/page-air-manual-manifold.png", mandatory: false },
  { sectionKey: "oxygen_generator", image: "/report-assets/page-oxygen-generator.png", mandatory: false },
];

function isEnabled(sections: Record<string, unknown>, page: PageConfig): boolean {
  if (page.mandatory) return true;
  const value = sections[page.sectionKey] as { mandatory?: boolean } | undefined;
  return Boolean(value?.mandatory);
}

function pv(val: unknown): string {
  const s = String(val ?? "");
  const parts = s.split(" / ");
  return parts[0] || "";
}

function getGroup(sections: Record<string, unknown>, sectionKey: string, groupKey: string): Record<string, string> {
  const section = sections[sectionKey] as Record<string, unknown> | undefined;
  if (!section) return {};
  const group = section[groupKey] as Record<string, string> | undefined;
  return group ?? {};
}

function getRows(sections: Record<string, unknown>, sectionKey: string, tableKey: string): Record<string, string>[] {
  const section = sections[sectionKey] as Record<string, unknown> | undefined;
  if (!section) return [];
  const rows = section[tableKey];
  return Array.isArray(rows) ? (rows as Record<string, string>[]) : [];
}

function getPaddedRows(rows: Record<string, string>[]): Record<string, string>[] {
  const padded = [...rows];
  while (padded.length < 3) {
    padded.push({});
  }
  return padded;
}

// ─────────────────────────────────────────────────────────
// Calibration store — lets the user drag each field to its
// exact spot on the ministry image; positions persist locally.
// ─────────────────────────────────────────────────────────
type Pos = { top: number; left: number };

type CalibContextType = {
  calibrate: boolean;
  getPos: (key: string, def: Pos) => Pos;
  startDrag: (e: React.PointerEvent, key: string, def: Pos) => void;
};

const CalibContext = createContext<CalibContextType>({
  calibrate: false,
  getPos: (_k, def) => def,
  startDrag: () => {},
});

function useCalib() {
  return useContext(CalibContext);
}

const round2 = (n: number) => Math.round(n * 100) / 100;

// Calibrated default positions (dragged into place on the ministry images).
// Applied for everyone; a user's own localStorage overrides still win.
const CALIBRATED: Record<string, Pos> = {
  ap_comp2_model: { top: 24.26, left: 71.45 },
  ap_comp2_serial_number: { top: 26.1, left: 71.2 },
  ap_comp2_power_kw: { top: 28.13, left: 71.45 },
  ap_comp2_flow: { top: 30.15, left: 71.37 },
  ap_comp2_control_panel: { top: 32.12, left: 71.54 },
  ap_comp2_oil_filter: { top: 34.14, left: 71.45 },
  ap_comp2_oil_level: { top: 36.1, left: 71.37 },
  ap_comp2_running_hours: { top: 38.19, left: 71.45 },

  ap_comp1_model: { top: 24.14, left: 50.4 },
  ap_comp1_serial_number: { top: 26.16, left: 49.98 },
  ap_comp1_power_kw: { top: 28.36, left: 49.9 },
  ap_comp1_flow: { top: 30.32, left: 50.14 },
  ap_comp1_control_panel: { top: 32.29, left: 50.14 },
  ap_comp1_oil_filter: { top: 34.25, left: 50.14 },
  ap_comp1_oil_level: { top: 36.11, left: 49.98 },
  ap_comp1_running_hours: { top: 38.3, left: 49.9 },

  ap_comp0_model: { top: 24.38, left: 29.06 },
  ap_comp0_serial_number: { top: 26.46, left: 28.55 },
  ap_comp0_power_kw: { top: 28.42, left: 28.8 },
  ap_comp0_flow: { top: 30.39, left: 28.8 },
  ap_comp0_control_panel: { top: 32.53, left: 28.97 },
  ap_comp0_oil_filter: { top: 34.43, left: 29.06 },
  ap_comp0_oil_level: { top: 36.4, left: 28.97 },
  ap_comp0_running_hours: { top: 38.19, left: 29.06 },

  ap_dry2_manufacturer: { top: 45.13, left: 71.7 },
  ap_dry2_serial_number: { top: 47.04, left: 71.62 },
  ap_dry2_drain: { top: 48.88, left: 71.79 },
  ap_dry2_flow: { top: 50.55, left: 71.54 },
  ap_dry2_type: { top: 52.52, left: 71.62 },
  ap_dry2_power: { top: 54.42, left: 71.2 },

  ap_dry1_manufacturer: { top: 44.9, left: 50.32 },
  ap_dry1_serial_number: { top: 46.86, left: 50.48 },
  ap_dry1_drain: { top: 48.71, left: 50.57 },
  ap_dry1_flow: { top: 50.61, left: 50.48 },
  ap_dry1_type: { top: 52.4, left: 50.56 },
  ap_dry1_power: { top: 54.25, left: 50.57 },

  ap_dry0_manufacturer: { top: 44.78, left: 29.31 },
  ap_dry0_serial_number: { top: 46.68, left: 29.31 },
  ap_dry0_drain: { top: 48.47, left: 29.22 },
  ap_dry0_flow: { top: 50.49, left: 29.39 },
  ap_dry0_type: { top: 52.28, left: 29.4 },
  ap_dry0_power: { top: 54.31, left: 29.64 },

  ap_tank_manufacturer: { top: 59.45, left: 24.6 },
  ap_tank_capacity: { top: 61.23, left: 24.69 },
  ap_tank_clean: { top: 63.14, left: 24.52 },
  ap_tank_drain: { top: 65.05, left: 24.44 },
  ap_tank_safety_valve: { top: 67.19, left: 24.35 },

  ap_filt_cyclone_filter: { top: 59.39, left: 73.6 },
  ap_filt_micronic_filter: { top: 61.29, left: 73.51 },
  ap_filt_submicronic_filter: { top: 63.02, left: 73.34 },
  ap_filt_dust_filter: { top: 65.1, left: 73.26 },
  ap_filt_automatic_drain: { top: 67.3, left: 73.34 },

  ap_reg_main: { top: 71.82, left: 22.59 },
  ap_reg_bar2: { top: 73.9, left: 22.34 },

  air_plant_h_contractor: { top: 11.7, left: 34.43 },
  air_plant_h_name: { top: 9.09, left: 33.34 },
  air_plant_h_location: { top: 9.26, left: 62.15 },
  air_plant_h_date: { top: 6.65, left: 57.7 },
  air_plant_r_rec: { top: 78.26, left: 4 },
  air_plant_r_notes: { top: 78.2, left: 52.66 },
  air_plant_s_igas_name: { top: 84.85, left: 17.92 },
  air_plant_s_cont_name: { top: 87.46, left: 18.34 },
  air_plant_s_moh_name: { top: 89.48, left: 18.42 },
  air_plant_s_igas_sig: { top: 84.85, left: 68.17 },
  air_plant_s_cont_sig: { top: 87.17, left: 69.26 },
  air_plant_s_moh_sig: { top: 89.13, left: 69.09 },

  vacuum_plant_h_contractor: { top: 12.81, left: 35.36 },
  vacuum_plant_h_name: { top: 10.19, left: 35.02 },
  vacuum_plant_h_location: { top: 10.43, left: 58.54 },
  vacuum_plant_h_date: { top: 7.93, left: 58.2 },

  vp_pump0_model: { top: 29.18, left: 28.3 },
  vp_pump0_serial_number: { top: 31.6, left: 28.05 },
  vp_pump0_power: { top: 34.2, left: 27.88 },
  vp_pump0_oil_filters: { top: 36.68, left: 27.54 },
  vp_pump0_oil_level: { top: 39.04, left: 27.62 },
  vp_pump0_control_panel: { top: 41.7, left: 27.38 },
  vp_pump0_flow: { top: 44.18, left: 27.55 },
  vp_pump0_running_hours: { top: 46.48, left: 27.8 },
  vp_pump0_max_pressure: { top: 48.89, left: 27.63 },
  vp_pump0_min_pressure: { top: 51.55, left: 27.46 },

  vp_pump1_model: { top: 29.13, left: 50.06 },
  vp_pump1_serial_number: { top: 31.6, left: 50.32 },
  vp_pump1_power: { top: 34.14, left: 50.4 },
  vp_pump1_oil_filters: { top: 36.5, left: 50.49 },
  vp_pump1_oil_level: { top: 38.98, left: 50.74 },
  vp_pump1_control_panel: { top: 41.64, left: 50.32 },
  vp_pump1_flow: { top: 43.76, left: 50.31 },
  vp_pump1_running_hours: { top: 46.24, left: 49.9 },
  vp_pump1_max_pressure: { top: 48.89, left: 49.89 },
  vp_pump1_min_pressure: { top: 51.79, left: 49.73 },

  vp_pump2_model: { top: 29.31, left: 70.28 },
  vp_pump2_serial_number: { top: 31.72, left: 70.44 },
  vp_pump2_power: { top: 34.38, left: 70.44 },
  vp_pump2_oil_filters: { top: 36.74, left: 70.44 },
  vp_pump2_oil_level: { top: 39.22, left: 70.61 },
  vp_pump2_control_panel: { top: 41.64, left: 70.69 },
  vp_pump2_flow: { top: 44.18, left: 70.87 },
  vp_pump2_running_hours: { top: 46.71, left: 70.78 },
  vp_pump2_max_pressure: { top: 49.31, left: 70.53 },
  vp_pump2_min_pressure: { top: 51.79, left: 70.61 },

  vp_tank_manufacturer: { top: 58.23, left: 24.35 },
  vp_tank_capacity: { top: 60.53, left: 24.44 },
  vp_tank_drain: { top: 62.82, left: 24.27 },

  vp_filt_manufacturer: { top: 57.69, left: 73.18 },
  vp_filt_clean: { top: 60.4, left: 73.18 },
  vp_filt_type: { top: 62.88, left: 72.92 },

  vacuum_plant_r_rec: { top: 71.34, left: 2.91 },
  vacuum_plant_r_notes: { top: 71.46, left: 53.34 },
  vacuum_plant_s_igas_name: { top: 81.6, left: 18.17 },
  vacuum_plant_s_cont_name: { top: 84.33, left: 18.34 },
  vacuum_plant_s_moh_name: { top: 86.89, left: 18.25 },
  vacuum_plant_s_igas_sig: { top: 81.71, left: 66.15 },
  vacuum_plant_s_cont_sig: { top: 84.21, left: 67.16 },
  vacuum_plant_s_moh_sig: { top: 86.71, left: 67.24 },

  oxygen_plant_h_contractor: { top: 11.38, left: 33.68 },
  oxygen_plant_h_name: { top: 8.77, left: 32.67 },
  oxygen_plant_h_location: { top: 9.06, left: 60.89 },
  oxygen_plant_h_date: { top: 6.74, left: 59.3 },

  ot_manufacturer: { top: 29.79, left: 3.99 },
  ot_serial: { top: 29.79, left: 30.1 },
  ot_capacity: { top: 45.73, left: 5.17 },
  ot_date: { top: 45.49, left: 30.27 },
  ot_leak_ok: { top: 55.02, left: 8.52 },
  ot_leak_def: { top: 54.55, left: 20.02 },
  ot_gauge_ok: { top: 54.84, left: 34.62 },
  ot_gauge_def: { top: 54.49, left: 44.69 },
  ot_vap_ok: { top: 63.35, left: 9.02 },
  ot_vap_def: { top: 64.07, left: 19.85 },
  ot_refill: { top: 63.88, left: 29.93 },

  oxygen_plant_r_rec: { top: 73.48, left: 4.34 },
  oxygen_plant_r_notes: { top: 73.3, left: 53.25 },
  oxygen_plant_s_igas_name: { top: 81.12, left: 16.07 },
  oxygen_plant_s_cont_name: { top: 83.68, left: 17.58 },
  oxygen_plant_s_moh_name: { top: 86.29, left: 17.41 },
  oxygen_plant_s_igas_sig: { top: 81.24, left: 66.74 },
  oxygen_plant_s_cont_sig: { top: 83.62, left: 67.75 },
  oxygen_plant_s_moh_sig: { top: 86.11, left: 67.92 },

  oxygen_manifold_automatic_h_contractor: { top: 11.5, left: 33.76 },
  oxygen_manifold_automatic_h_name: { top: 8.88, left: 33.51 },
  oxygen_manifold_automatic_h_location: { top: 8.89, left: 57.95 },
  oxygen_manifold_automatic_h_date: { top: 6.33, left: 58.96 },
  oxygen_manifold_automatic_manufacturer: { top: 36.01, left: 35.26 },
  oxygen_manifold_automatic_serial: { top: 43.56, left: 36.35 },
  oxygen_manifold_automatic_qtyL: { top: 51.82, left: 12.05 },
  oxygen_manifold_automatic_tpl_ok: { top: 59.6, left: 12.37 },
  oxygen_manifold_automatic_tpl_ch: { top: 59.42, left: 27.41 },
  oxygen_manifold_automatic_co_ok: { top: 52.08, left: 42.19 },
  oxygen_manifold_automatic_co_ch: { top: 52.32, left: 57.7 },
  oxygen_manifold_automatic_qtyR: { top: 51.46, left: 72.25 },
  oxygen_manifold_automatic_g_ok: { top: 59.66, left: 42.02 },
  oxygen_manifold_automatic_g_ch: { top: 59.48, left: 57.37 },
  oxygen_manifold_automatic_tpr_ok: { top: 59.3, left: 71.66 },
  oxygen_manifold_automatic_tpr_ch: { top: 59.78, left: 86.93 },
  oxygen_manifold_automatic_cpd: { top: 66.78, left: 21.06 },
  oxygen_manifold_automatic_points: { top: 67.49, left: 52.86 },
  oxygen_manifold_automatic_r_rec: { top: 73.24, left: 4.84 },
  oxygen_manifold_automatic_r_notes: { top: 73.89, left: 52.5 },
  oxygen_manifold_automatic_s_igas_name: { top: 81.65, left: 18.34 },
  oxygen_manifold_automatic_s_cont_name: { top: 84.09, left: 18.42 },
  oxygen_manifold_automatic_s_moh_name: { top: 86.71, left: 18.34 },
  oxygen_manifold_automatic_s_igas_sig: { top: 82.07, left: 67.24 },
  oxygen_manifold_automatic_s_cont_sig: { top: 84.57, left: 66.48 },
  oxygen_manifold_automatic_s_moh_sig: { top: 86.89, left: 66.91 },

  oxygen_manifold_manual_h_contractor: { top: 12.41, left: 32.33 },
  oxygen_manifold_manual_h_name: { top: 9.76, left: 32.42 },
  oxygen_manifold_manual_h_location: { top: 9.56, left: 59.55 },
  oxygen_manifold_manual_h_date: { top: 6.71, left: 60.22 },
  oxygen_manifold_manual_manufacturer: { top: 34.04, left: 1.49 },
  oxygen_manifold_manual_serial: { top: 45.96, left: 2.25 },
  oxygen_manifold_manual_qtyL: { top: 53.61, left: 10.54 },
  oxygen_manifold_manual_co_ok: { top: 53.49, left: 40.68 },
  oxygen_manifold_manual_co_ch: { top: 53.49, left: 55.1 },
  oxygen_manifold_manual_qtyR: { top: 53.81, left: 70.83 },
  oxygen_manifold_manual_tpl_ok: { top: 61.01, left: 10.86 },
  oxygen_manifold_manual_tpl_ch: { top: 61.2, left: 25.14 },
  oxygen_manifold_manual_g_ok: { top: 61.2, left: 40.6 },
  oxygen_manifold_manual_g_ch: { top: 61.01, left: 55.35 },
  oxygen_manifold_manual_tpr_ok: { top: 61.14, left: 70.99 },
  oxygen_manifold_manual_tpr_ch: { top: 60.49, left: 84.42 },
  oxygen_manifold_manual_power: { top: 68.79, left: 37.08 },
  oxygen_manifold_manual_r_rec: { top: 74.73, left: 4.59 },
  oxygen_manifold_manual_r_notes: { top: 75.06, left: 52.58 },
  oxygen_manifold_manual_s_igas_name: { top: 83.9, left: 19.26 },
  oxygen_manifold_manual_s_cont_name: { top: 86.1, left: 19.1 },
  oxygen_manifold_manual_s_moh_name: { top: 88.56, left: 19.01 },
  oxygen_manifold_manual_s_igas_sig: { top: 83.71, left: 65.82 },
  oxygen_manifold_manual_s_cont_sig: { top: 85.91, left: 65.74 },
  oxygen_manifold_manual_s_moh_sig: { top: 88.24, left: 65.48 },

  air_manual_manifold_h_contractor: { top: 11.71, left: 30.65 },
  air_manual_manifold_h_name: { top: 8.8, left: 31.07 },
  air_manual_manifold_h_location: { top: 9.38, left: 59.04 },
  air_manual_manifold_h_date: { top: 6.22, left: 58.04 },
  air_manual_manifold_manufacturer: { top: 34.18, left: 2.08 },
  air_manual_manifold_serial: { top: 45.65, left: 1.74 },
  air_manual_manifold_qtyL: { top: 53.83, left: 10.79 },
  air_manual_manifold_tpl_ok: { top: 61.49, left: 10.77 },
  air_manual_manifold_tpl_ch: { top: 61.17, left: 25.48 },
  air_manual_manifold_co_ok: { top: 54.32, left: 40.6 },
  air_manual_manifold_co_ch: { top: 53.67, left: 55.6 },
  air_manual_manifold_qtyR: { top: 53.7, left: 71.66 },
  air_manual_manifold_g_ok: { top: 61.49, left: 40.26 },
  air_manual_manifold_g_ch: { top: 61.55, left: 55.27 },
  air_manual_manifold_tpr_ok: { top: 61.23, left: 71.92 },
  air_manual_manifold_tpr_ch: { top: 61.23, left: 87.52 },
  air_manual_manifold_power: { top: 68.68, left: 37.92 },
  air_manual_manifold_r_rec: { top: 73.71, left: 4 },
  air_manual_manifold_r_notes: { top: 73.91, left: 51.32 },
  air_manual_manifold_s_igas_name: { top: 81.46, left: 16.07 },
  air_manual_manifold_s_cont_name: { top: 83.72, left: 16.15 },
  air_manual_manifold_s_moh_name: { top: 85.86, left: 16.32 },
  air_manual_manifold_s_igas_sig: { top: 81.39, left: 68.08 },
  air_manual_manifold_s_cont_sig: { top: 83.78, left: 68.25 },
  air_manual_manifold_s_moh_sig: { top: 85.79, left: 67.75 },

  n2o_manifold_automatic_h_location: { top: 9.03, left: 58.2 },
  n2o_manifold_automatic_manufacturer: { top: 40.09, left: 34.33 },
  n2o_manifold_automatic_serial: { top: 47.98, left: 35.59 },
  n2o_manifold_automatic_qtyL: { top: 56.53, left: 11.88 },
  n2o_manifold_automatic_co_ok: { top: 56.42, left: 42.11 },
  n2o_manifold_automatic_co_ch: { top: 56.15, left: 57.28 },
  n2o_manifold_automatic_qtyR: { top: 56.74, left: 72.92 },
  n2o_manifold_automatic_g_ok: { top: 63.87, left: 41.6 },
  n2o_manifold_automatic_g_ch: { top: 63.88, left: 57.54 },
  n2o_manifold_automatic_tpl_ok: { top: 63.75, left: 11.28 },
  n2o_manifold_automatic_tpl_ch: { top: 63.69, left: 27.49 },
  n2o_manifold_automatic_tpr_ok: { top: 63.95, left: 71.83 },
  n2o_manifold_automatic_tpr_ch: { top: 63.99, left: 86.26 },
  n2o_manifold_automatic_r_rec: { top: 75.94, left: 4 },
  n2o_manifold_automatic_r_notes: { top: 76.15, left: 51.66 },
  n2o_manifold_automatic_s_igas_name: { top: 83.97, left: 17.76 },
  n2o_manifold_automatic_s_cont_name: { top: 86.1, left: 17.91 },
  n2o_manifold_automatic_s_moh_name: { top: 88.28, left: 18 },
  n2o_manifold_automatic_s_igas_sig: { top: 83.7, left: 67.32 },
  n2o_manifold_automatic_s_cont_sig: { top: 85.91, left: 67.41 },
  n2o_manifold_automatic_s_moh_sig: { top: 88.46, left: 67.58 },

  oxygen_generator_h_contractor: { top: 11.63, left: 33.76 },
  oxygen_generator_h_name: { top: 8.93, left: 31.66 },
  oxygen_generator_h_location: { top: 9.12, left: 56.35 },
  oxygen_generator_h_date: { top: 6.09, left: 54.67 },
  og_gen_manufacturer: { top: 45, left: 25.96 },
  og_gen_date_of_installation: { top: 47.17, left: 26.47 },
  og_gen_oil_level: { top: 49.21, left: 26.39 },
  og_gen_control_panel: { top: 51.18, left: 26.48 },
  og_gen_max_pressure: { top: 53.09, left: 26.81 },
  og_gen_min_pressure: { top: 55.25, left: 27.15 },
  og_gen_noise: { top: 57.22, left: 27.14 },
  og_gen_power: { top: 59.26, left: 28.15 },
  og_tank_manufacturer: { top: 64.17, left: 25.93 },
  og_tank_date_of_installation: { top: 66.24, left: 25.85 },
  og_tank_last_ppm_date: { top: 68.24, left: 25.68 },
  og_tank_capacity: { top: 70.23, left: 26.01 },
  og_tank_max_pressure: { top: 71.98, left: 25.94 },
  og_tank_drain: { top: 74.36, left: 25.34 },
  og_tank_safety_valve: { top: 76.05, left: 25.6 },
  og_filt_manufacturer: { top: 63.99, left: 71.97 },
  og_filt_date_of_installation: { top: 66.18, left: 72.47 },
  og_filt_last_ppm_date: { top: 68.11, left: 72.64 },
  og_filt_last_date_of_change: { top: 69.92, left: 72.72 },
  og_filt_clean: { top: 71.86, left: 72.98 },
  og_filt_type: { top: 73.67, left: 73.06 },
  og_filt_max_pressure: { top: 75.61, left: 73.23 },
  og_filt_min_pressure: { top: 77.42, left: 72.81 },
  oxygen_generator_s_igas_name: { top: 81.1, left: 18.25 },
  oxygen_generator_s_cont_name: { top: 83.37, left: 18.34 },
  oxygen_generator_s_moh_name: { top: 86.01, left: 18 },
  oxygen_generator_s_igas_sig: { top: 81.23, left: 66.15 },
  oxygen_generator_s_cont_sig: { top: 83.68, left: 66.4 },
  oxygen_generator_s_moh_sig: { top: 86.01, left: 66.91 },
};

// N2O auto manifold shares the O2 auto manifold layout — reuse those positions
// as its defaults so an enabled N2O page starts already aligned.
const DEFAULT_POSITIONS: Record<string, Pos> = { ...CALIBRATED };
for (const [k, v] of Object.entries(CALIBRATED)) {
  if (k.startsWith("oxygen_manifold_automatic_")) {
    const nk = k.replace("oxygen_manifold_automatic_", "n2o_manifold_automatic_");
    if (!(nk in DEFAULT_POSITIONS)) DEFAULT_POSITIONS[nk] = v;
  }
}

// Arabic labels shown inside each box while calibrating, so the user
// knows exactly which field each box belongs to.
const FIELD_LABELS: Record<string, string> = {
  // headers
  name: "اسم المستشفى",
  contractor: "المقاول",
  location: "المكان",
  date: "التاريخ",
  // signatures (specific — must win over generic "name")
  igas_name: "اسم مهندس iGAS",
  cont_name: "اسم مهندس المقاول",
  moh_name: "اسم مهندس الوزارة",
  igas_sig: "توقيع مهندس iGAS",
  cont_sig: "توقيع مهندس المقاول",
  moh_sig: "توقيع مهندس الوزارة",
  // recommendation / notes
  rec: "التوصية",
  notes: "الملاحظات",
  // common fields
  model: "الموديل",
  serial_number: "الرقم التسلسلي",
  serial_no: "الرقم التسلسلي",
  serial: "الرقم التسلسلي",
  power_kw: "القدرة",
  power: "القدرة",
  flow: "التدفق",
  control_panel: "لوحة التحكم",
  oil_filter: "فلتر الزيت",
  oil_filters: "فلاتر الزيت",
  oil_level: "مستوى الزيت",
  running_hours: "ساعات التشغيل",
  manufacturer: "الشركة المصنعة",
  drain: "الصرف",
  type: "النوع",
  capacity: "السعة",
  tank_capacity: "سعة الخزان",
  clean: "النظافة",
  safety_valve: "صمام الأمان",
  cyclone_filter: "فلتر سيكلون",
  micronic_filter: "فلتر ميكرونيك",
  submicronic_filter: "فلتر سب ميكرونيك",
  dust_filter: "فلتر الغبار",
  automatic_drain: "الصرف الأوتوماتيك",
  main: "رئيسي",
  bar2: "٢ بار",
  max_pressure: "أقصى ضغط",
  min_pressure: "أقل ضغط",
  date_of_installation: "تاريخ التركيب",
  last_ppm_date: "آخر صيانة دورية",
  last_date_of_change: "آخر تاريخ تغيير",
  noise: "الضوضاء",
  refill: "وقت التعبئة",
  qtyL: "عدد الاسطوانات (يسار)",
  qtyR: "عدد الاسطوانات (يمين)",
  cpd: "تغيير الاسطوانات/يوم",
  points: "النقاط",
};

const LABEL_KEYS = Object.keys(FIELD_LABELS).sort((a, b) => b.length - a.length);

const COL_NAMES: Record<string, string> = { comp: "كمبريسور", dry: "مجفف", pump: "مضخة" };
const COL_NUMS = ["١", "٢", "٣"];

function calibLabel(pk: string): string {
  // Checkbox fields
  if (pk.endsWith("_ok")) return "✓ سليم";
  if (pk.endsWith("_def")) return "✗ عيب";
  if (pk.endsWith("_ch")) return "↺ تغيير";

  // Column-table fields: e.g. ap_comp0_model, vp_pump1_serial_number
  const m = pk.match(/_(comp|dry|pump)(\d)_(.+)$/);
  if (m) {
    const col = `${COL_NAMES[m[1]]} ${COL_NUMS[Number(m[2])] ?? ""}`;
    const fk = m[3];
    return `${col}: ${FIELD_LABELS[fk] ?? fk}`;
  }

  // Longest-match on the remaining field key
  for (const key of LABEL_KEYS) {
    if (pk === key || pk.endsWith("_" + key)) return FIELD_LABELS[key];
  }
  return pk.split("_").slice(-1)[0];
}

function Cell({
  pk,
  top,
  left,
  w,
  value,
  onChange,
  align = "center",
}: {
  pk: string;
  top: number;
  left: number;
  w?: string;
  value: string;
  onChange?: (v: string) => void;
  align?: "left" | "center" | "right";
}) {
  const { calibrate, getPos, startDrag } = useCalib();
  const pos = getPos(pk, { top, left });

  if (calibrate) {
    const short = pk.split("_").slice(-1)[0];
    return (
      <div
        onPointerDown={(e) => startDrag(e, pk, { top, left })}
        title={pk}
        className="absolute z-30 flex items-center justify-center rounded-sm border border-teal-400 bg-teal-50/80 text-[7pt] font-bold text-teal-800 cursor-move select-none leading-none touch-none hover:bg-teal-100 hover:border-teal-500 shadow-sm"
        style={{
          top: `${pos.top}%`,
          left: `${pos.left}%`,
          width: w ?? "auto",
          minWidth: "24px",
          height: "14px",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {value || short}
      </div>
    );
  }

  return (
    <div
      className="absolute font-medium leading-none flex items-center justify-center"
      style={{
        top: `${pos.top}%`,
        left: `${pos.left}%`,
        width: w ?? "auto",
        maxWidth: w,
        height: "14px",
        fontSize: "9pt",
        fontFamily: "'Inter', 'Cairo', sans-serif",
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full bg-transparent border-0 border-b border-dashed border-slate-200 hover:border-teal-400 focus:border-teal-500 focus:bg-teal-50/10 p-0 outline-none font-medium text-slate-800 placeholder-slate-300 print:placeholder-transparent print:border-transparent print:bg-transparent print:text-black print:p-0 print:m-0
          ${align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"}
        `}
        style={{
          fontSize: "inherit",
          fontFamily: "inherit",
          fontWeight: "600",
          height: "100%",
        }}
        placeholder="•••"
      />
    </div>
  );
}

function CheckMark({
  pk,
  top,
  left,
  checked,
  onClick,
}: {
  pk: string;
  top: number;
  left: number;
  checked: boolean;
  onClick: () => void;
}) {
  const { calibrate, getPos, startDrag } = useCalib();
  const pos = getPos(pk, { top, left });

  if (calibrate) {
    return (
      <div
        onPointerDown={(e) => startDrag(e, pk, { top, left })}
        title={pk}
        className="absolute z-30 flex items-center justify-center rounded-sm border border-teal-400 bg-teal-50/80 text-[8pt] font-bold text-teal-800 cursor-move select-none leading-none touch-none hover:bg-teal-100"
        style={{ top: `${pos.top}%`, left: `${pos.left}%`, width: "15px", height: "15px" }}
      >
        ✓
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`absolute text-[10pt] font-extrabold leading-none cursor-pointer select-none transition-colors border border-transparent flex items-center justify-center p-0 m-0 bg-transparent outline-none
        ${checked ? "text-green-700 font-bold" : "text-slate-300 hover:text-slate-500 hover:border-slate-300 print:hidden"}
      `}
      style={{ top: `${pos.top}%`, left: `${pos.left}%`, width: "15px", height: "15px" }}
      type="button"
    >
      {checked ? "✓" : <span className="text-[7pt] print:hidden opacity-30">✓</span>}
    </button>
  );
}

function HeaderOverlay({
  pageKey,
  hospital,
  reportDate,
  onChangeHospital,
  onChangeReportDate,
}: {
  pageKey: string;
  hospital: Hospital;
  reportDate: string;
  onChangeHospital: (field: keyof Hospital, value: string) => void;
  onChangeReportDate: (value: string) => void;
}) {
  const { calibrate, getPos, startDrag } = useCalib();
  const d = new Date(reportDate);
  const formattedDate = isNaN(d.getTime())
    ? ""
    : `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} (${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()})`;

  const kDate = `${pageKey}_h_date`;
  const kLoc = `${pageKey}_h_location`;
  const datePos = getPos(kDate, { top: 3.0, left: 64 });
  const locPos = getPos(kLoc, { top: 5.2, left: 64 });

  return (
    <>
      <Cell pk={`${pageKey}_h_name`} top={5.2} left={22} w="30%" value={hospital.name} onChange={(v) => onChangeHospital("name", v)} align="left" />
      <Cell pk={`${pageKey}_h_contractor`} top={7.4} left={22} w="30%" value={hospital.contractor_name || ""} onChange={(v) => onChangeHospital("contractor_name", v)} align="left" />

      {/* Date */}
      {calibrate ? (
        <div
          onPointerDown={(e) => startDrag(e, kDate, { top: 3.0, left: 64 })}
          title={kDate}
          className="absolute z-30 flex items-center rounded-sm border border-teal-400 bg-teal-50/80 text-[7pt] font-bold text-teal-800 cursor-move select-none leading-none touch-none"
          style={{ top: `${datePos.top}%`, left: `${datePos.left}%`, width: "33%", height: "13px" }}
        >
          {formattedDate || "date"}
        </div>
      ) : (
        <div className="absolute text-[7.5pt]" style={{ top: `${datePos.top}%`, left: `${datePos.left}%`, width: "33%", height: "12px" }}>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => onChangeReportDate(e.target.value)}
            className="print:hidden w-full bg-transparent border-0 border-b border-dashed border-slate-200 hover:border-teal-400 focus:border-teal-500 focus:bg-teal-50/10 p-0 outline-none font-medium leading-none text-slate-800 text-left"
            style={{ height: "100%" }}
          />
          <span className="hidden print:inline font-medium leading-none text-slate-800 print:text-black">
            {formattedDate}
          </span>
        </div>
      )}

      {/* Location */}
      {calibrate ? (
        <div
          onPointerDown={(e) => startDrag(e, kLoc, { top: 5.2, left: 64 })}
          title={kLoc}
          className="absolute z-30 flex items-center rounded-sm border border-teal-400 bg-teal-50/80 text-[7pt] font-bold text-teal-800 cursor-move select-none leading-none touch-none"
          style={{ top: `${locPos.top}%`, left: `${locPos.left}%`, width: "33%", height: "13px" }}
        >
          {[hospital.city, hospital.governorate].filter(Boolean).join(" - ") || "location"}
        </div>
      ) : (
        <div className="absolute text-[7.5pt] font-medium leading-none flex items-center gap-1" style={{ top: `${locPos.top}%`, left: `${locPos.left}%`, width: "33%", height: "12px" }}>
          <input
            type="text"
            value={hospital.city || ""}
            onChange={(e) => onChangeHospital("city", e.target.value)}
            placeholder="المدينة"
            className="print:hidden w-[45%] bg-transparent border-0 border-b border-dashed border-slate-200 hover:border-teal-400 focus:border-teal-500 focus:bg-teal-50/10 p-0 outline-none font-medium leading-none text-slate-800 placeholder-slate-300 text-left"
            style={{ height: "100%" }}
          />
          <span className="print:hidden text-slate-400">-</span>
          <input
            type="text"
            value={hospital.governorate || ""}
            onChange={(e) => onChangeHospital("governorate", e.target.value)}
            placeholder="المحافظة"
            className="print:hidden w-[45%] bg-transparent border-0 border-b border-dashed border-slate-200 hover:border-teal-400 focus:border-teal-500 focus:bg-teal-50/10 p-0 outline-none font-medium leading-none text-slate-800 placeholder-slate-300 text-left"
            style={{ height: "100%" }}
          />
          <span className="hidden print:inline">
            {[hospital.city, hospital.governorate].filter(Boolean).join(" - ")}
          </span>
        </div>
      )}
    </>
  );
}

function SignatureOverlay({
  pageKey,
  sections,
  onChange,
}: {
  pageKey: string;
  sections: Record<string, unknown>;
  onChange: (field: string, value: string) => void;
}) {
  const sig = (sections.signatures as Record<string, string>) ?? {};
  return (
    <>
      <Cell pk={`${pageKey}_s_igas_name`} top={89.5} left={18} w="28%" value={sig.igas_eng_name || ""} onChange={(v) => onChange("igas_eng_name", v)} />
      <Cell pk={`${pageKey}_s_cont_name`} top={91.7} left={18} w="28%" value={sig.contractor_eng_name || ""} onChange={(v) => onChange("contractor_eng_name", v)} />
      <Cell pk={`${pageKey}_s_moh_name`} top={93.9} left={18} w="28%" value={sig.moh_eng_name || ""} onChange={(v) => onChange("moh_eng_name", v)} />
      <Cell pk={`${pageKey}_s_igas_sig`} top={89.5} left={68} w="28%" value={sig.igas_eng_signature || ""} onChange={(v) => onChange("igas_eng_signature", v)} />
      <Cell pk={`${pageKey}_s_cont_sig`} top={91.7} left={68} w="28%" value={sig.contractor_eng_signature || ""} onChange={(v) => onChange("contractor_eng_signature", v)} />
      <Cell pk={`${pageKey}_s_moh_sig`} top={93.9} left={68} w="28%" value={sig.moh_eng_signature || ""} onChange={(v) => onChange("moh_eng_signature", v)} />
    </>
  );
}

function RecommendationOverlay({
  pageKey,
  sections,
  onChange,
}: {
  pageKey: string;
  sections: Record<string, unknown>;
  onChange: (key: string, value: string) => void;
}) {
  const { calibrate, getPos, startDrag } = useCalib();
  const rec = (sections.recommendation as string) || "";
  const notes = (sections.notes as string) || "";
  const kRec = `${pageKey}_r_rec`;
  const kNotes = `${pageKey}_r_notes`;
  const recPos = getPos(kRec, { top: 81.5, left: 4 });
  const notesPos = getPos(kNotes, { top: 81.5, left: 53 });

  if (calibrate) {
    return (
      <>
        <div
          onPointerDown={(e) => startDrag(e, kRec, { top: 81.5, left: 4 })}
          title={kRec}
          className="absolute z-30 flex items-center justify-center rounded-sm border border-teal-400 bg-teal-50/80 text-[7pt] font-bold text-teal-800 cursor-move select-none touch-none"
          style={{ top: `${recPos.top}%`, left: `${recPos.left}%`, width: "44%", height: "5%" }}
        >
          {rec || "recommendation"}
        </div>
        <div
          onPointerDown={(e) => startDrag(e, kNotes, { top: 81.5, left: 53 })}
          title={kNotes}
          className="absolute z-30 flex items-center justify-center rounded-sm border border-teal-400 bg-teal-50/80 text-[7pt] font-bold text-teal-800 cursor-move select-none touch-none"
          style={{ top: `${notesPos.top}%`, left: `${notesPos.left}%`, width: "44%", height: "5%" }}
        >
          {notes || "notes"}
        </div>
      </>
    );
  }

  return (
    <>
      <textarea
        value={rec}
        onChange={(e) => onChange("recommendation", e.target.value)}
        className="absolute leading-tight w-[44%] h-[5%] bg-transparent border-0 border-b border-dashed border-slate-200 hover:border-teal-400 focus:border-teal-500 focus:bg-teal-50/10 px-1 py-0.5 outline-none resize-none overflow-hidden text-slate-800 placeholder-slate-300 print:placeholder-transparent print:border-transparent print:bg-transparent print:text-black print:px-0 print:py-0 print:m-0 text-center font-semibold"
        style={{ top: `${recPos.top}%`, left: `${recPos.left}%`, fontSize: "9pt", fontFamily: "'Inter', 'Cairo', sans-serif" }}
        placeholder="•••"
      />
      <textarea
        value={notes}
        onChange={(e) => onChange("notes", e.target.value)}
        className="absolute leading-tight w-[44%] h-[5%] bg-transparent border-0 border-b border-dashed border-slate-200 hover:border-teal-400 focus:border-teal-500 focus:bg-teal-50/10 px-1 py-0.5 outline-none resize-none overflow-hidden text-slate-800 placeholder-slate-300 print:placeholder-transparent print:border-transparent print:bg-transparent print:text-black print:px-0 print:py-0 print:m-0 text-center font-semibold"
        style={{ top: `${notesPos.top}%`, left: `${notesPos.left}%`, fontSize: "9pt", fontFamily: "'Inter', 'Cairo', sans-serif" }}
        placeholder="•••"
      />
    </>
  );
}

// ─── AIR PLANT ───
function AirPlantOverlay({
  sections,
  onChange,
}: {
  sections: Record<string, unknown>;
  onChange: (path: (string | number)[], value: string) => void;
}) {
  const compressors = getRows(sections, "air_plant", "compressors");
  const dryers = getRows(sections, "air_plant", "dryers");
  const tank = getGroup(sections, "air_plant", "tank");
  const filters = getGroup(sections, "air_plant", "filters");
  const regulators = getGroup(sections, "air_plant", "regulators");

  const compFields = ["model", "serial_number", "power_kw", "flow", "control_panel", "oil_filter", "oil_level", "running_hours"];
  const compRowTops = [24.2, 26.4, 28.6, 30.8, 33, 35.2, 37.4, 39.6];
  const colLefts = [22, 42, 67];
  const colWidths = ["18%", "22%", "28%"];

  const dryerFields = ["manufacturer", "serial_number", "drain", "flow", "type", "power"];
  const dryerRowTops = [43.6, 45.8, 48, 50.2, 52.4, 54.6];

  const tankFields = ["manufacturer", "capacity", "clean", "drain", "safety_valve"];
  const tankRowTops = [59.8, 62.0, 64.2, 66.4, 68.6];

  const filterFields = ["cyclone_filter", "micronic_filter", "submicronic_filter", "dust_filter", "automatic_drain"];
  const filterRowTops = [59.8, 62.0, 64.2, 66.4, 68.6];

  return (
    <>
      {getPaddedRows(compressors).slice(0, 3).map((row, ci) =>
        compFields.map((field, ri) => (
          <Cell
            key={`c${ci}${field}`}
            pk={`ap_comp${ci}_${field}`}
            top={compRowTops[ri]}
            left={colLefts[ci]}
            w={colWidths[ci]}
            value={pv(row[field])}
            onChange={(v) => onChange(["air_plant", "compressors", ci, field], v)}
          />
        ))
      )}

      {getPaddedRows(dryers).slice(0, 3).map((row, ci) =>
        dryerFields.map((field, ri) => (
          <Cell
            key={`d${ci}${field}`}
            pk={`ap_dry${ci}_${field}`}
            top={dryerRowTops[ri]}
            left={colLefts[ci]}
            w={colWidths[ci]}
            value={pv(row[field])}
            onChange={(v) => onChange(["air_plant", "dryers", ci, field], v)}
          />
        ))
      )}

      {tankFields.map((field, i) => (
        <Cell
          key={`tank_${field}`}
          pk={`ap_tank_${field}`}
          top={tankRowTops[i]}
          left={22}
          w="24%"
          value={pv(tank[field])}
          onChange={(v) => onChange(["air_plant", "tank", field], v)}
        />
      ))}

      {filterFields.map((field, i) => (
        <Cell
          key={`filt_${field}`}
          pk={`ap_filt_${field}`}
          top={filterRowTops[i]}
          left={72}
          w="24%"
          value={pv(filters[field])}
          onChange={(v) => onChange(["air_plant", "filters", field], v)}
        />
      ))}

      <Cell pk="ap_reg_main" top={74.0} left={22} w="72%" value={pv(regulators.main)} onChange={(v) => onChange(["air_plant", "regulators", "main"], v)} align="left" />
      <Cell pk="ap_reg_bar2" top={76.2} left={22} w="72%" value={pv(regulators.bar_2)} onChange={(v) => onChange(["air_plant", "regulators", "bar_2"], v)} align="left" />
    </>
  );
}

// ─── VACUUM PLANT ───
function VacuumPlantOverlay({
  sections,
  onChange,
}: {
  sections: Record<string, unknown>;
  onChange: (path: (string | number)[], value: string) => void;
}) {
  const pumps = getRows(sections, "vacuum_plant", "pumps");
  const tank = getGroup(sections, "vacuum_plant", "tank");
  const filters = getGroup(sections, "vacuum_plant", "filters");

  const pumpFields = ["model", "serial_number", "power", "oil_filters", "oil_level", "control_panel", "flow", "running_hours", "max_pressure", "min_pressure"];
  const pumpRowTops = [25.5, 27.8, 30.1, 32.4, 34.7, 37, 39.3, 41.6, 43.9, 46.2];
  const colLefts = [22, 42, 67];
  const colWidths = ["18%", "22%", "28%"];

  const tankFields = ["manufacturer", "capacity", "drain"];
  const tankRowTops = [56.5, 58.8, 61.1];

  const filterFields = ["manufacturer", "clean", "type"];
  const filterRowTops = [56.5, 58.8, 61.1];

  return (
    <>
      {getPaddedRows(pumps).slice(0, 3).map((row, ci) =>
        pumpFields.map((field, ri) => (
          <Cell
            key={`p${ci}${field}`}
            pk={`vp_pump${ci}_${field}`}
            top={pumpRowTops[ri]}
            left={colLefts[ci]}
            w={colWidths[ci]}
            value={pv(row[field])}
            onChange={(v) => onChange(["vacuum_plant", "pumps", ci, field], v)}
          />
        ))
      )}

      {tankFields.map((field, i) => (
        <Cell
          key={`tank_${field}`}
          pk={`vp_tank_${field}`}
          top={tankRowTops[i]}
          left={22}
          w="24%"
          value={pv(tank[field])}
          onChange={(v) => onChange(["vacuum_plant", "tank", field], v)}
        />
      ))}

      {filterFields.map((field, i) => (
        <Cell
          key={`filt_${field}`}
          pk={`vp_filt_${field}`}
          top={filterRowTops[i]}
          left={72}
          w="24%"
          value={pv(filters[field])}
          onChange={(v) => onChange(["vacuum_plant", "filters", field], v)}
        />
      ))}
    </>
  );
}

// ─── LIQUID OXYGEN TANK ───
function OxygenTankOverlay({
  sections,
  onChange,
}: {
  sections: Record<string, unknown>;
  onChange: (path: (string | number)[], value: string) => void;
}) {
  const info = getGroup(sections, "oxygen_plant", "tank_info");

  const handleToggle = (field: string, targetValue: string) => {
    const currentValue = pv(info[field]);
    if (currentValue.startsWith(targetValue.split(" / ")[0])) {
      onChange(["oxygen_plant", "tank_info", field], "");
    } else {
      onChange(["oxygen_plant", "tank_info", field], targetValue);
    }
  };

  const isOk = (field: string) => pv(info[field]).startsWith("OK");
  const isDefect = (field: string) => {
    const v = pv(info[field]);
    return v.startsWith("Defect") || v.startsWith("Needs") || v.startsWith("Defective");
  };

  return (
    <>
      <Cell pk="ot_manufacturer" top={22} left={5} w="18%" value={pv(info.manufacturer)} onChange={(v) => onChange(["oxygen_plant", "tank_info", "manufacturer"], v)} />
      <Cell pk="ot_serial" top={22} left={28} w="18%" value={pv(info.serial_no)} onChange={(v) => onChange(["oxygen_plant", "tank_info", "serial_no"], v)} />
      <Cell pk="ot_capacity" top={38} left={5} w="18%" value={pv(info.tank_capacity)} onChange={(v) => onChange(["oxygen_plant", "tank_info", "tank_capacity"], v)} />
      <Cell pk="ot_date" top={38} left={28} w="18%" value={pv(info.date_of_manufacturing)} onChange={(v) => onChange(["oxygen_plant", "tank_info", "date_of_manufacturing"], v)} />

      <CheckMark pk="ot_leak_ok" top={53} left={6.5} checked={isOk("leak_test")} onClick={() => handleToggle("leak_test", "OK / سليم")} />
      <CheckMark pk="ot_leak_def" top={53} left={18} checked={isDefect("leak_test")} onClick={() => handleToggle("leak_test", "Defect / عيب")} />

      <CheckMark pk="ot_gauge_ok" top={53} left={30} checked={isOk("gauge")} onClick={() => handleToggle("gauge", "OK / سليم")} />
      <CheckMark pk="ot_gauge_def" top={53} left={42} checked={isDefect("gauge")} onClick={() => handleToggle("gauge", "Defect / عيب")} />

      <CheckMark pk="ot_vap_ok" top={60.5} left={6.5} checked={isOk("vaporizers")} onClick={() => handleToggle("vaporizers", "OK / سليم")} />
      <CheckMark pk="ot_vap_def" top={60.5} left={18} checked={isDefect("vaporizers")} onClick={() => handleToggle("vaporizers", "Defect / عيب")} />

      <Cell pk="ot_refill" top={64} left={28} w="18%" value={pv(info.refill_time)} onChange={(v) => onChange(["oxygen_plant", "tank_info", "refill_time"], v)} />
    </>
  );
}

// ─── MANIFOLD ───
function ManifoldOverlay({
  sections,
  sectionKey,
  hasChangePerDay,
  onChange,
}: {
  sections: Record<string, unknown>;
  sectionKey: string;
  hasChangePerDay: boolean;
  onChange: (path: (string | number)[], value: string) => void;
}) {
  const data = getGroup(sections, sectionKey, "manifold");
  const sk = sectionKey;

  const changeoverKey = sectionKey === "air_manual_manifold" ? "regulator_changeover" : "automatic_changeover";

  const handleToggle = (field: string, targetValue: string) => {
    const currentValue = pv(data[field]);
    if (currentValue.startsWith(targetValue.split(" / ")[0])) {
      onChange([sectionKey, "manifold", field], "");
    } else {
      onChange([sectionKey, "manifold", field], targetValue);
    }
  };

  const isOk = (field: string) => pv(data[field]).startsWith("OK");
  const isChange = (field: string) => {
    const v = pv(data[field]);
    return v.startsWith("Change") || v.startsWith("Defect") || v.startsWith("Needs") || v.startsWith("Defective");
  };

  return (
    <>
      <Cell pk={`${sk}_manufacturer`} top={41} left={34} w="28%" value={pv(data.manufacturer)} onChange={(v) => onChange([sectionKey, "manifold", "manufacturer"], v)} />
      <Cell pk={`${sk}_serial`} top={47} left={34} w="28%" value={pv(data.serial_no)} onChange={(v) => onChange([sectionKey, "manifold", "serial_no"], v)} />

      <Cell pk={`${sk}_qtyL`} top={55.5} left={6} w="15%" value={pv(data.qty_cylinders_left)} onChange={(v) => onChange([sectionKey, "manifold", "qty_cylinders_left"], v)} />
      <Cell pk={`${sk}_qtyR`} top={55.5} left={72} w="15%" value={pv(data.qty_cylinders_right)} onChange={(v) => onChange([sectionKey, "manifold", "qty_cylinders_right"], v)} />

      <CheckMark pk={`${sk}_co_ok`} top={58.5} left={39} checked={isOk(changeoverKey)} onClick={() => handleToggle(changeoverKey, "OK / سليم")} />
      <CheckMark pk={`${sk}_co_ch`} top={58.5} left={53} checked={isChange(changeoverKey)} onClick={() => handleToggle(changeoverKey, "Change / تغيير")} />

      <CheckMark pk={`${sk}_tpl_ok`} top={64} left={8} checked={isOk("tail_pipe_left")} onClick={() => handleToggle("tail_pipe_left", "OK / سليم")} />
      <CheckMark pk={`${sk}_tpl_ch`} top={64} left={18} checked={isChange("tail_pipe_left")} onClick={() => handleToggle("tail_pipe_left", "Change / تغيير")} />

      <CheckMark pk={`${sk}_g_ok`} top={64} left={39} checked={isOk("gauge")} onClick={() => handleToggle("gauge", "OK / سليم")} />
      <CheckMark pk={`${sk}_g_ch`} top={64} left={53} checked={isChange("gauge")} onClick={() => handleToggle("gauge", "Change / تغيير")} />

      <CheckMark pk={`${sk}_tpr_ok`} top={64} left={72} checked={isOk("tail_pipe_right")} onClick={() => handleToggle("tail_pipe_right", "OK / سليم")} />
      <CheckMark pk={`${sk}_tpr_ch`} top={64} left={85} checked={isChange("tail_pipe_right")} onClick={() => handleToggle("tail_pipe_right", "Change / تغيير")} />

      {hasChangePerDay ? (
        <>
          <Cell pk={`${sk}_cpd`} top={71} left={14} w="26%" value={pv(data.cylinders_change_per_day)} onChange={(v) => onChange([sectionKey, "manifold", "cylinders_change_per_day"], v)} />
          <Cell pk={`${sk}_points`} top={71} left={60} w="26%" value={pv(data.points)} onChange={(v) => onChange([sectionKey, "manifold", "points"], v)} />
        </>
      ) : (
        <Cell pk={`${sk}_power`} top={71} left={38} w="24%" value={pv(data.power)} onChange={(v) => onChange([sectionKey, "manifold", "power"], v)} />
      )}
    </>
  );
}

// ─── OXYGEN GENERATOR ───
function OxygenGeneratorOverlay({
  sections,
  onChange,
}: {
  sections: Record<string, unknown>;
  onChange: (path: (string | number)[], value: string) => void;
}) {
  const gen = getGroup(sections, "oxygen_generator", "generator");
  const tank = getGroup(sections, "oxygen_generator", "tank");
  const filters = getGroup(sections, "oxygen_generator", "filters");

  const genFields = ["manufacturer", "date_of_installation", "oil_level", "control_panel", "max_pressure", "min_pressure", "noise", "power"];
  const genRowTops = [50.5, 52.6, 54.7, 56.8, 58.9, 61, 63.1, 65.2];

  const tankFields = ["manufacturer", "date_of_installation", "last_ppm_date", "capacity", "max_pressure", "drain", "safety_valve"];
  const tankRowTops = [71.5, 73.5, 75.5, 77.5, 79.5, 81.5, 83.5];

  const filterFields = ["manufacturer", "date_of_installation", "last_ppm_date", "last_date_of_change", "clean", "type", "max_pressure", "min_pressure"];
  const filterRowTops = [71.5, 73.5, 75.5, 77.5, 79.5, 81.5, 83.5, 85.5];

  return (
    <>
      {genFields.map((field, i) => (
        <Cell
          key={`gen_${field}`}
          pk={`og_gen_${field}`}
          top={genRowTops[i]}
          left={30}
          w="65%"
          value={pv(gen[field])}
          onChange={(v) => onChange(["oxygen_generator", "generator", field], v)}
        />
      ))}

      {tankFields.map((field, i) => (
        <Cell
          key={`tank_${field}`}
          pk={`og_tank_${field}`}
          top={tankRowTops[i]}
          left={24}
          w="22%"
          value={pv(tank[field])}
          onChange={(v) => onChange(["oxygen_generator", "tank", field], v)}
        />
      ))}

      {filterFields.map((field, i) => (
        <Cell
          key={`filt_${field}`}
          pk={`og_filt_${field}`}
          top={filterRowTops[i]}
          left={76}
          w="22%"
          value={pv(filters[field])}
          onChange={(v) => onChange(["oxygen_generator", "filters", field], v)}
        />
      ))}
    </>
  );
}

function getDataOverlay(
  sectionKey: string,
  sections: Record<string, unknown>,
  onChange: (path: (string | number)[], value: string) => void
) {
  switch (sectionKey) {
    case "air_plant":
      return <AirPlantOverlay sections={sections} onChange={onChange} />;
    case "vacuum_plant":
      return <VacuumPlantOverlay sections={sections} onChange={onChange} />;
    case "oxygen_plant":
      return <OxygenTankOverlay sections={sections} onChange={onChange} />;
    case "oxygen_manifold_automatic":
      return <ManifoldOverlay sections={sections} sectionKey={sectionKey} hasChangePerDay={true} onChange={onChange} />;
    case "oxygen_manifold_manual":
      return <ManifoldOverlay sections={sections} sectionKey={sectionKey} hasChangePerDay={false} onChange={onChange} />;
    case "n2o_manifold_automatic":
      return <ManifoldOverlay sections={sections} sectionKey={sectionKey} hasChangePerDay={false} onChange={onChange} />;
    case "air_manual_manifold":
      return <ManifoldOverlay sections={sections} sectionKey={sectionKey} hasChangePerDay={false} onChange={onChange} />;
    case "oxygen_generator":
      return <OxygenGeneratorOverlay sections={sections} onChange={onChange} />;
    default:
      return null;
  }
}

export function PrintView({
  hospital,
  report,
}: {
  hospital: Hospital;
  report: Report;
}) {
  const { t } = useI18n();
  const [sections, setSections] = useState<Record<string, unknown>>(report.sections ?? {});
  const [hospitalData, setHospitalData] = useState<Hospital>(hospital);
  const [reportDate, setReportDate] = useState(report.report_date);
  const [reportMonth, setReportMonth] = useState(report.month);
  const [reportYear, setReportYear] = useState(report.year);

  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  // ── Calibration (drag-to-position) store ──
  const [calibrate, setCalibrate] = useState(false);
  const [positions, setPositions] = useState<Record<string, Pos>>({});
  const positionsRef = useRef<Record<string, Pos>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAYOUT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, Pos>;
        positionsRef.current = parsed;
        setPositions(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const getPos = useCallback(
    (key: string, def: Pos) => positions[key] ?? DEFAULT_POSITIONS[key] ?? def,
    [positions]
  );

  const startDrag = useCallback((e: React.PointerEvent, key: string, def: Pos) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    const page = target.closest(".print-page") as HTMLElement | null;
    if (!page) return;
    const rect = page.getBoundingClientRect();
    const start = positionsRef.current[key] ?? DEFAULT_POSITIONS[key] ?? def;
    const sx = e.clientX;
    const sy = e.clientY;

    const move = (ev: PointerEvent) => {
      const dLeft = ((ev.clientX - sx) / rect.width) * 100;
      const dTop = ((ev.clientY - sy) / rect.height) * 100;
      const nextPos = { top: round2(start.top + dTop), left: round2(start.left + dLeft) };
      const next = { ...positionsRef.current, [key]: nextPos };
      positionsRef.current = next;
      setPositions(next);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      try {
        localStorage.setItem(LAYOUT_KEY, JSON.stringify(positionsRef.current));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }, []);

  const resetLayout = useCallback(() => {
    positionsRef.current = {};
    setPositions({});
    try {
      localStorage.removeItem(LAYOUT_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const calibValue = useMemo<CalibContextType>(
    () => ({ calibrate, getPos, startDrag }),
    [calibrate, getPos, startDrag]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setStatus("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        await updatePrintData(
          report.id,
          hospital.id,
          sections,
          {
            name: hospitalData.name,
            city: hospitalData.city,
            governorate: hospitalData.governorate,
            contractor_name: hospitalData.contractor_name,
          },
          {
            report_date: reportDate,
            month: reportMonth,
            year: reportYear,
          }
        );
        setStatus("saved");
      } catch (err) {
        console.error("Failed to save printed view data:", err);
        setStatus("idle");
      }
    }, 1500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [sections, hospitalData, reportDate, reportMonth, reportYear, report.id, hospital.id]);

  const updateSection = (path: (string | number)[], val: string) => {
    setSections((prev) => {
      const next = structuredClone(prev);
      let target: any = next;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        const nextKey = path[i + 1];
        if (target[key] === undefined) {
          target[key] = typeof nextKey === "number" ? [] : {};
        }
        if (Array.isArray(target[key]) && typeof nextKey === "number") {
          while (target[key].length <= nextKey) {
            target[key].push({});
          }
        }
        target = target[key];
      }
      const lastKey = path[path.length - 1];
      target[lastKey] = val;
      return next;
    });
  };

  const updateHospitalField = (field: keyof Hospital, val: string) => {
    setHospitalData((prev) => ({
      ...prev,
      [field]: val === "" ? null : val,
    }));
  };

  const updateReportDate = (newDate: string) => {
    setReportDate(newDate);
    const d = new Date(newDate);
    if (!isNaN(d.getTime())) {
      setReportMonth(d.getMonth() + 1);
      setReportYear(d.getFullYear());
    }
  };

  const updateRecommendationNotes = (sectionKey: string, key: string, val: string) => {
    setSections((prev) => {
      const sectionData = (prev[sectionKey] as Record<string, unknown>) ?? {};
      return {
        ...prev,
        [sectionKey]: {
          ...sectionData,
          [key]: val,
        },
      };
    });
  };

  const updateSignatures = (field: string, val: string) => {
    setSections((prev) => {
      const sigs = (prev.signatures as Record<string, string>) ?? {};
      return {
        ...prev,
        signatures: {
          ...sigs,
          [field]: val,
        },
      };
    });
  };

  const enabledPages = PAGES.filter((p) => isEnabled(sections, p));

  return (
    <CalibContext.Provider value={calibValue}>
      <div className="space-y-6 print:space-y-0 pt-16 print:pt-0">
        {/* Top Floating Control Bar (Screen only) */}
        <div className="print:hidden fixed top-0 inset-x-0 bg-slate-900/90 text-white backdrop-blur shadow-md z-50">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Link
                href={`/hospitals/${hospital.id}/reports/${report.id}`}
                className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1"
              >
                &larr; {t("back_to_hospital")}
              </Link>
              <span className="text-sm font-bold hidden md:inline border-r border-slate-700 pr-3 mr-3 text-slate-100">
                {t("print_report")} - {hospitalData.name}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Auto-save Status */}
              <div className="text-xs font-bold">
                {status === "saving" && (
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-amber-400 border-t-transparent"></div>
                    <span>{t("saving")}</span>
                  </div>
                )}
                {status === "saved" && (
                  <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t("auto_saved")}</span>
                  </div>
                )}
                {status === "idle" && (
                  <span className="text-slate-400">{t("unsaved_changes")}</span>
                )}
              </div>

              {/* Calibrate toggle */}
              <button
                onClick={() => setCalibrate((c) => !c)}
                className={`rounded-xl text-xs font-extrabold px-4 py-2.5 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 border ${
                  calibrate
                    ? "bg-amber-500 text-white border-amber-400 hover:bg-amber-400"
                    : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                }`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>{calibrate ? t("done_positions") : t("adjust_positions")}</span>
              </button>

              {calibrate && (
                <button
                  onClick={resetLayout}
                  className="rounded-xl text-xs font-bold px-3 py-2.5 bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  {t("reset_positions")}
                </button>
              )}

              {/* Print Button */}
              {!calibrate && (
                <button
                  onClick={() => window.print()}
                  className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs px-5 py-2.5 shadow-md shadow-teal-600/10 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>{t("print_save_pdf")}</span>
                </button>
              )}
            </div>
          </div>

          {calibrate && (
            <div className="bg-amber-500/90 text-amber-950 text-[11px] font-bold text-center py-1.5 px-4">
              {t("calibrate_hint")}
            </div>
          )}
        </div>

        {/* Cover page */}
        <div className="print-page relative mx-auto w-[210mm] bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/report-assets/cover-page.png"
            alt="Medical Gas Maintenance Report"
            className="w-full h-auto block"
          />
        </div>

        {/* Section pages */}
        {enabledPages.map((page) => (
          <div key={page.sectionKey} className="print-page relative mx-auto w-[210mm] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.image}
              alt={page.sectionKey}
              className="w-full h-auto block"
            />
            <div className="absolute inset-0">
              <HeaderOverlay
                pageKey={page.sectionKey}
                hospital={hospitalData}
                reportDate={reportDate}
                onChangeHospital={updateHospitalField}
                onChangeReportDate={updateReportDate}
              />
              {getDataOverlay(page.sectionKey, sections, updateSection)}
              {page.sectionKey !== "oxygen_generator" && (
                <RecommendationOverlay
                  pageKey={page.sectionKey}
                  sections={(sections[page.sectionKey] as Record<string, unknown>) ?? {}}
                  onChange={(key, val) => updateRecommendationNotes(page.sectionKey, key, val)}
                />
              )}
              <SignatureOverlay pageKey={page.sectionKey} sections={sections} onChange={updateSignatures} />
            </div>
          </div>
        ))}
      </div>
    </CalibContext.Provider>
  );
}
