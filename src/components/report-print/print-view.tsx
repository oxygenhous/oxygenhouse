import type { Hospital, Report } from "@/lib/types";
import { PrintPage } from "./print-page";
import { ManifoldContent } from "./manifold-content";
import { AirPlantContent } from "./air-plant-content";
import { VacuumPlantContent } from "./vacuum-plant-content";
import { OxygenTankContent } from "./oxygen-tank-content";
import { OxygenGeneratorContent } from "./oxygen-generator-content";
import { LabeledBox } from "./labeled-box";
import {
  MANIFOLD_PRINT_CONFIGS,
  SECTION_PRINT_TITLES,
} from "@/lib/print-manifold-config";

function asGroup(value: unknown): Record<string, string> {
  return value && typeof value === "object"
    ? (value as Record<string, string>)
    : {};
}

export function PrintView({
  hospital,
  report,
}: {
  hospital: Hospital;
  report: Report;
}) {
  const sections = report.sections ?? {};

  const MANDATORY_SECTIONS = new Set([
    "oxygen_plant",
    "oxygen_manifold_automatic",
    "air_plant",
  ]);

  function isEnabled(key: string) {
    if (MANDATORY_SECTIONS.has(key)) return true;
    const value = sections[key] as { mandatory?: boolean } | undefined;
    return Boolean(value?.mandatory);
  }

  const pages: React.ReactNode[] = [];

  if (isEnabled("oxygen_plant")) {
    pages.push(
      <OxygenTankContent sectionValue={asGroup(sections.oxygen_plant)} />
    );
  }

  for (const config of MANIFOLD_PRINT_CONFIGS) {
    if (isEnabled(config.sectionKey)) {
      pages.push(
        <ManifoldContent
          config={config}
          sectionValue={asGroup(sections[config.sectionKey])}
        />
      );
    }
  }

  if (isEnabled("air_plant")) {
    pages.push(<AirPlantContent sectionValue={asGroup(sections.air_plant)} />);
  }

  if (isEnabled("vacuum_plant")) {
    pages.push(
      <VacuumPlantContent sectionValue={asGroup(sections.vacuum_plant)} />
    );
  }

  if (isEnabled("oxygen_generator")) {
    pages.push(
      <OxygenGeneratorContent
        sectionValue={asGroup(sections.oxygen_generator)}
      />
    );
  }

  if (isEnabled("regulators_settings")) {
    const regulatorsSection = sections.regulators_settings as
      | { settings?: Record<string, string> }
      | undefined;
    const settings = regulatorsSection?.settings ?? {};
    pages.push(
      <LabeledBox
        title="REGULATORS SETTINGS"
        rows={[
          { label: "MAIN PRESSURE (BAR)", value: settings.main_pressure_bar },
          { label: "ALL ROOMS (BAR)", value: settings.all_rooms_bar },
          {
            label: "OPERATIONS / CONSULTATIONS (BAR)",
            value: settings.operations_consultations_bar,
          },
        ]}
      />
    );
  }

  const sectionKeysInOrder = [
    "oxygen_plant",
    ...MANIFOLD_PRINT_CONFIGS.map((c) => c.sectionKey),
    "air_plant",
    "vacuum_plant",
    "oxygen_generator",
    "regulators_settings",
  ].filter(isEnabled);

  return (
    <div className="space-y-6 print:space-y-0">
      {pages.map((content, i) => {
        const key = sectionKeysInOrder[i];
        const titles = SECTION_PRINT_TITLES[key] ?? { en: key, ar: "" };
        return (
          <PrintPage
            key={key}
            hospital={hospital}
            report={report}
            titleEn={titles.en}
            titleAr={titles.ar}
            pageNumber={i + 1}
            totalPages={pages.length}
          >
            {content}
          </PrintPage>
        );
      })}
    </div>
  );
}
