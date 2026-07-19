import { LabeledBox } from "./labeled-box";

function asGroup(value: unknown): Record<string, string> {
  return value && typeof value === "object"
    ? (value as Record<string, string>)
    : {};
}

export function OxygenGeneratorContent({
  sectionValue,
}: {
  sectionValue: Record<string, unknown>;
}) {
  const generator = asGroup(sectionValue.generator);
  const tank = asGroup(sectionValue.tank);
  const filters = asGroup(sectionValue.filters);

  return (
    <div className="space-y-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/report-assets/oxygen-generator.png"
        alt="Oxygen Generator"
        className="mx-auto w-full max-w-[420pt]"
      />
      <LabeledBox
        title="OXYGEN GENERATOR"
        rows={[
          { label: "MANUFACTURER", value: generator.model },
          { label: "DATE OF INSTALLATION", value: generator.date_of_installation },
          { label: "COMPRESSOR MODEL", value: generator.compressor_model },
          { label: "COMPRESSOR CAPACITY", value: generator.compressor_capacity },
          { label: "CAPACITY", value: generator.capacity },
          { label: "OIL LEVEL", value: generator.oil_level },
          { label: "CONTROL PANEL", value: generator.control_panel },
          { label: "POWER", value: generator.power },
          { label: "NOISE", value: generator.noise },
        ]}
      />
      <div className="grid grid-cols-2 gap-3">
        <LabeledBox
          title="TANK"
          rows={[
            { label: "MANUFACTURER", value: tank.manufacturer },
            { label: "DATE OF INSTALLATION", value: tank.date_of_installation },
            { label: "LAST PPM DATE", value: tank.last_ppm_date },
            { label: "CAPACITY", value: tank.capacity },
            { label: "MAX PRESSURE", value: tank.max_pressure },
            { label: "DRAIN", value: tank.drain },
            { label: "SAFETY VALVE", value: tank.safety_valve },
          ]}
        />
        <LabeledBox
          title="FILTERS & SECRETION BOTTLE"
          rows={[
            { label: "MANUFACTURER", value: filters.manufacturer },
            { label: "DATE OF INSTALLATION", value: filters.date_of_installation },
            { label: "LAST PPM DATE", value: filters.last_ppm_date },
            { label: "LAST DATE OF CHANGE", value: filters.last_change_date },
            { label: "CLEAN", value: filters.clean },
            { label: "TYPE", value: filters.type },
          ]}
        />
      </div>
    </div>
  );
}
