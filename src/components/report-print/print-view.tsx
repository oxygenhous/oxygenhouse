import type { Hospital, Report } from "@/lib/types";

const MONTH_NAMES = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

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

function formatDate(report: Report): string {
  const d = new Date(report.report_date);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} (${MONTH_NAMES[report.month - 1]} ${report.year})`;
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

function Cell({ top, left, w, children }: { top: string; left: string; w?: string; children: React.ReactNode }) {
  if (!children || children === "") return null;
  return (
    <span
      className="absolute text-[7.5pt] font-medium leading-tight"
      style={{ top, left, width: w ?? "auto", maxWidth: w, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
    >
      {children}
    </span>
  );
}

function CheckMark({ top, left }: { top: string; left: string }) {
  return (
    <span
      className="absolute text-[10pt] font-bold text-green-700 leading-none"
      style={{ top, left }}
    >
      ✓
    </span>
  );
}

function HeaderOverlay({ hospital, report }: { hospital: Hospital; report: Report }) {
  return (
    <>
      <Cell top="7.5%" left="22%" w="30%">{hospital.name}</Cell>
      <Cell top="9.8%" left="22%" w="30%">{hospital.contractor_name || ""}</Cell>
      <Cell top="5.5%" left="64%" w="33%">{formatDate(report)}</Cell>
      <Cell top="7.8%" left="64%" w="33%">{[hospital.city, hospital.governorate].filter(Boolean).join(" - ")}</Cell>
    </>
  );
}

function SignatureOverlay({ sections }: { sections: Record<string, unknown> }) {
  const sig = (sections.signatures as Record<string, string>) ?? {};
  return (
    <>
      <Cell top="91%" left="18%" w="28%">{sig.igas_eng_name}</Cell>
      <Cell top="93.2%" left="18%" w="28%">{sig.contractor_eng_name}</Cell>
      <Cell top="95.4%" left="18%" w="28%">{sig.moh_eng_name}</Cell>
      <Cell top="91%" left="68%" w="28%">{sig.igas_eng_signature}</Cell>
      <Cell top="93.2%" left="68%" w="28%">{sig.contractor_eng_signature}</Cell>
      <Cell top="95.4%" left="68%" w="28%">{sig.moh_eng_signature}</Cell>
    </>
  );
}

function RecommendationOverlay({ sections }: { sections: Record<string, unknown> }) {
  const rec = (sections.recommendation as string) || "";
  const notes = (sections.notes as string) || "";
  return (
    <>
      <span className="absolute text-[7pt] whitespace-pre-wrap overflow-hidden leading-tight" style={{ top: "84.5%", left: "4%", width: "44%", maxHeight: "5%" }}>
        {rec}
      </span>
      <span className="absolute text-[7pt] whitespace-pre-wrap overflow-hidden leading-tight" style={{ top: "84.5%", left: "53%", width: "44%", maxHeight: "5%" }}>
        {notes}
      </span>
    </>
  );
}

// ─── AIR PLANT ───
function AirPlantOverlay({ sections }: { sections: Record<string, unknown> }) {
  const compressors = getRows(sections, "air_plant", "compressors");
  const dryers = getRows(sections, "air_plant", "dryers");
  const tank = getGroup(sections, "air_plant", "tank");
  const filters = getGroup(sections, "air_plant", "filters");
  const regulators = getGroup(sections, "air_plant", "regulators");

  const compFields = ["model", "serial_number", "power_kw", "flow", "control_panel", "oil_filter", "oil_level", "running_hours"];
  const compRowTops = ["24.2%", "26.4%", "28.6%", "30.8%", "33%", "35.2%", "37.4%", "39.6%"];
  const colLefts = ["22%", "42%", "67%"];
  const colWidths = ["18%", "22%", "28%"];

  const dryerFields = ["manufacturer", "serial_number", "drain", "flow", "type", "power"];
  const dryerRowTops = ["48%", "50.2%", "52.4%", "54.6%", "56.8%", "59%"];

  const tankFields = ["manufacturer", "capacity", "clean", "drain", "safety_valve"];
  const tankRowTops = ["65%", "67.2%", "69.4%", "71.6%", "73.8%"];

  const filterFields = ["cyclone_filter", "micronic_filter", "submicronic_filter", "dust_filter", "automatic_drain"];
  const filterRowTops = ["65%", "67.2%", "69.4%", "71.6%", "73.8%"];

  return (
    <>
      {/* Compressor table: each compressor is a COLUMN */}
      {compressors.slice(0, 3).map((row, ci) =>
        compFields.map((field, ri) => (
          <Cell key={`c${ci}${field}`} top={compRowTops[ri]} left={colLefts[ci]} w={colWidths[ci]}>
            {pv(row[field])}
          </Cell>
        ))
      )}

      {/* Dryer table */}
      {dryers.slice(0, 3).map((row, ci) =>
        dryerFields.map((field, ri) => (
          <Cell key={`d${ci}${field}`} top={dryerRowTops[ri]} left={colLefts[ci]} w={colWidths[ci]}>
            {pv(row[field])}
          </Cell>
        ))
      )}

      {/* Tank (left half) */}
      {tankFields.map((field, i) => (
        <Cell key={`tank_${field}`} top={tankRowTops[i]} left="22%" w="24%">
          {pv(tank[field])}
        </Cell>
      ))}

      {/* Filters (right half) */}
      {filterFields.map((field, i) => (
        <Cell key={`filt_${field}`} top={filterRowTops[i]} left="72%" w="24%">
          {pv(filters[field])}
        </Cell>
      ))}

      {/* Regulators */}
      <Cell top="78.5%" left="22%" w="72%">{pv(regulators.main)}</Cell>
      <Cell top="80.7%" left="22%" w="72%">{pv(regulators.bar_2)}</Cell>
    </>
  );
}

// ─── VACUUM PLANT ───
function VacuumPlantOverlay({ sections }: { sections: Record<string, unknown> }) {
  const pumps = getRows(sections, "vacuum_plant", "pumps");
  const tank = getGroup(sections, "vacuum_plant", "tank");
  const filters = getGroup(sections, "vacuum_plant", "filters");

  const pumpFields = ["model", "serial_number", "power", "oil_filters", "oil_level", "control_panel", "flow", "running_hours", "max_pressure", "min_pressure"];
  const pumpRowTops = ["25.5%", "27.8%", "30.1%", "32.4%", "34.7%", "37%", "39.3%", "41.6%", "43.9%", "46.2%"];
  const colLefts = ["22%", "42%", "67%"];
  const colWidths = ["18%", "22%", "28%"];

  const tankFields = ["manufacturer", "capacity", "drain"];
  const tankRowTops = ["56.5%", "58.8%", "61.1%"];

  const filterFields = ["manufacturer", "clean", "type"];
  const filterRowTops = ["56.5%", "58.8%", "61.1%"];

  return (
    <>
      {pumps.slice(0, 3).map((row, ci) =>
        pumpFields.map((field, ri) => (
          <Cell key={`p${ci}${field}`} top={pumpRowTops[ri]} left={colLefts[ci]} w={colWidths[ci]}>
            {pv(row[field])}
          </Cell>
        ))
      )}

      <Cell top="68%" left="4%" w="44%">
        {(sections.vacuum_plant as Record<string, unknown>)?.notes as string ?? ""}
      </Cell>

      {/* Tank (left half) */}
      {tankFields.map((field, i) => (
        <Cell key={`tank_${field}`} top={tankRowTops[i]} left="22%" w="24%">
          {pv(tank[field])}
        </Cell>
      ))}

      {/* Filters (right half) */}
      {filterFields.map((field, i) => (
        <Cell key={`filt_${field}`} top={filterRowTops[i]} left="72%" w="24%">
          {pv(filters[field])}
        </Cell>
      ))}
    </>
  );
}

// ─── LIQUID OXYGEN TANK ───
function OxygenTankOverlay({ sections }: { sections: Record<string, unknown> }) {
  const info = getGroup(sections, "oxygen_plant", "tank_info");

  const isOk = (field: string) => pv(info[field]).startsWith("OK");
  const isDefect = (field: string) => pv(info[field]).startsWith("Defect");

  return (
    <>
      {/* Manufacturer value box */}
      <Cell top="22%" left="5%" w="18%">{pv(info.manufacturer)}</Cell>
      {/* Serial No value box */}
      <Cell top="22%" left="28%" w="18%">{pv(info.serial_no)}</Cell>
      {/* Tank Capacity value box */}
      <Cell top="38%" left="5%" w="18%">{pv(info.tank_capacity)}</Cell>
      {/* Date of Manufacturing value box */}
      <Cell top="38%" left="28%" w="18%">{pv(info.date_of_manufacturing)}</Cell>

      {/* Leak Test OK / Defect */}
      {isOk("leak_test") && <CheckMark top="53%" left="6.5%" />}
      {isDefect("leak_test") && <CheckMark top="53%" left="18%" />}

      {/* Gauge OK / Defect */}
      {isOk("gauge") && <CheckMark top="53%" left="30%" />}
      {isDefect("gauge") && <CheckMark top="53%" left="42%" />}

      {/* Vaporizers OK / Defect */}
      {isOk("vaporizers") && <CheckMark top="60.5%" left="6.5%" />}
      {isDefect("vaporizers") && <CheckMark top="60.5%" left="18%" />}

      {/* Refill Time value */}
      <Cell top="64%" left="28%" w="18%">{pv(info.refill_time)}</Cell>
    </>
  );
}

// ─── MANIFOLD (O2 Auto, O2 Manual, N2O Auto, Air Manual) ───
function ManifoldOverlay({ sections, sectionKey, hasChangePerDay }: {
  sections: Record<string, unknown>;
  sectionKey: string;
  hasChangePerDay: boolean;
}) {
  const data = getGroup(sections, sectionKey, "manifold");

  const isOk = (field: string) => pv(data[field]).startsWith("OK");
  const isChange = (field: string) => {
    const v = pv(data[field]);
    return v.startsWith("Change") || v.startsWith("Defect");
  };

  const changeoverKey = sectionKey === "air_manual_manifold" ? "regulator_changeover" : "automatic_changeover";

  return (
    <>
      {/* Manufacturer box */}
      <Cell top="41%" left="34%" w="28%">{pv(data.manufacturer)}</Cell>
      {/* Serial No box */}
      <Cell top="47%" left="34%" w="28%">{pv(data.serial_no)}</Cell>

      {/* Qty Cylinders Left */}
      <Cell top="55.5%" left="6%" w="15%">{pv(data.qty_cylinders_left)}</Cell>
      {/* Qty Cylinders Right */}
      <Cell top="55.5%" left="72%" w="15%">{pv(data.qty_cylinders_right)}</Cell>

      {/* Changeover OK / Change */}
      {isOk(changeoverKey) && <CheckMark top="58.5%" left="39%" />}
      {isChange(changeoverKey) && <CheckMark top="58.5%" left="53%" />}

      {/* Tail Pipe Left OK / Change */}
      {isOk("tail_pipe_left") && <CheckMark top="64%" left="8%" />}
      {isChange("tail_pipe_left") && <CheckMark top="64%" left="18%" />}

      {/* Gauge OK / Change */}
      {isOk("gauge") && <CheckMark top="64%" left="39%" />}
      {isChange("gauge") && <CheckMark top="64%" left="53%" />}

      {/* Tail Pipe Right OK / Change */}
      {isOk("tail_pipe_right") && <CheckMark top="64%" left="72%" />}
      {isChange("tail_pipe_right") && <CheckMark top="64%" left="85%" />}

      {hasChangePerDay ? (
        <>
          <Cell top="71%" left="14%" w="26%">{pv(data.cylinders_change_per_day)}</Cell>
          <Cell top="71%" left="60%" w="26%">{pv(data.points)}</Cell>
        </>
      ) : (
        <Cell top="71%" left="38%" w="24%">{pv(data.power)}</Cell>
      )}
    </>
  );
}

// ─── OXYGEN GENERATOR ───
function OxygenGeneratorOverlay({ sections }: { sections: Record<string, unknown> }) {
  const gen = getGroup(sections, "oxygen_generator", "generator");
  const tank = getGroup(sections, "oxygen_generator", "tank");
  const filters = getGroup(sections, "oxygen_generator", "filters");

  const genFields = ["manufacturer", "date_of_installation", "oil_level", "control_panel", "max_pressure", "min_pressure", "noise", "power"];
  const genRowTops = ["50.5%", "52.6%", "54.7%", "56.8%", "58.9%", "61%", "63.1%", "65.2%"];

  const tankFields = ["manufacturer", "date_of_installation", "last_ppm_date", "capacity", "max_pressure", "drain", "safety_valve"];
  const tankRowTops = ["71.5%", "73.5%", "75.5%", "77.5%", "79.5%", "81.5%", "83.5%"];

  const filterFields = ["manufacturer", "date_of_installation", "last_ppm_date", "last_date_of_change", "clean", "type", "max_pressure", "min_pressure"];
  const filterRowTops = ["71.5%", "73.5%", "75.5%", "77.5%", "79.5%", "81.5%", "83.5%", "85.5%"];

  return (
    <>
      {/* Generator table - data fills the right side */}
      {genFields.map((field, i) => (
        <Cell key={`gen_${field}`} top={genRowTops[i]} left="30%" w="65%">
          {pv(gen[field])}
        </Cell>
      ))}

      {/* Tank (left side) */}
      {tankFields.map((field, i) => (
        <Cell key={`tank_${field}`} top={tankRowTops[i]} left="24%" w="22%">
          {pv(tank[field])}
        </Cell>
      ))}

      {/* Filters (right side) */}
      {filterFields.map((field, i) => (
        <Cell key={`filt_${field}`} top={filterRowTops[i]} left="76%" w="22%">
          {pv(filters[field])}
        </Cell>
      ))}
    </>
  );
}

function getDataOverlay(sectionKey: string, sections: Record<string, unknown>) {
  switch (sectionKey) {
    case "air_plant":
      return <AirPlantOverlay sections={sections} />;
    case "vacuum_plant":
      return <VacuumPlantOverlay sections={sections} />;
    case "oxygen_plant":
      return <OxygenTankOverlay sections={sections} />;
    case "oxygen_manifold_automatic":
      return <ManifoldOverlay sections={sections} sectionKey={sectionKey} hasChangePerDay={true} />;
    case "oxygen_manifold_manual":
      return <ManifoldOverlay sections={sections} sectionKey={sectionKey} hasChangePerDay={false} />;
    case "n2o_manifold_automatic":
      return <ManifoldOverlay sections={sections} sectionKey={sectionKey} hasChangePerDay={false} />;
    case "air_manual_manifold":
      return <ManifoldOverlay sections={sections} sectionKey={sectionKey} hasChangePerDay={false} />;
    case "oxygen_generator":
      return <OxygenGeneratorOverlay sections={sections} />;
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
  const sections = (report.sections ?? {}) as Record<string, unknown>;
  const enabledPages = PAGES.filter((p) => isEnabled(sections, p));

  return (
    <div className="space-y-6 print:space-y-0">
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
            <HeaderOverlay hospital={hospital} report={report} />
            {getDataOverlay(page.sectionKey, sections)}
            <RecommendationOverlay sections={sections} />
            <SignatureOverlay sections={sections} />
          </div>
        </div>
      ))}
    </div>
  );
}
