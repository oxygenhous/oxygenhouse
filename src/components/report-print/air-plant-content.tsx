import { TransposedTable, LabeledBox } from "./labeled-box";

function asRows(value: unknown): Record<string, string>[] {
  return Array.isArray(value) ? (value as Record<string, string>[]) : [];
}

function asGroup(value: unknown): Record<string, string> {
  return value && typeof value === "object"
    ? (value as Record<string, string>)
    : {};
}

const COMPRESSOR_COLUMNS = [
  { key: "model", label: "MODEL" },
  { key: "serial_number", label: "SERIAL NUMBER" },
  { key: "power_new", label: "POWER NEW" },
  { key: "flow", label: "FLOW" },
  { key: "control_panel", label: "CONTROL PANEL" },
  { key: "oil_filter", label: "OIL FILTER" },
  { key: "oil_level", label: "OIL LEVEL" },
  { key: "running_hours", label: "RUNNING HOURS" },
];

const DRYER_COLUMNS = [
  { key: "manufacturer", label: "MANUFACTURER" },
  { key: "serial_number", label: "SERIAL NUMBER" },
  { key: "drain", label: "DRAIN" },
  { key: "flow", label: "FLOW" },
  { key: "type", label: "TYPE" },
  { key: "power", label: "POWER" },
];

export function AirPlantContent({
  sectionValue,
}: {
  sectionValue: Record<string, unknown>;
}) {
  const tank = asGroup(sectionValue.tank);
  const filters = asGroup(sectionValue.filters);
  const regulators = asGroup(sectionValue.regulators);

  return (
    <div className="space-y-3">
      <TransposedTable
        title=""
        itemLabel="COMPRESSOR"
        columns={COMPRESSOR_COLUMNS}
        rows={asRows(sectionValue.compressors)}
      />
      <TransposedTable
        title="DRYERS"
        itemLabel="DRYER"
        columns={DRYER_COLUMNS}
        rows={asRows(sectionValue.dryers)}
      />
      <div className="grid grid-cols-2 gap-3">
        <LabeledBox
          title="TANK"
          rows={[
            { label: "MANUFACTURER", value: tank.manufacturer },
            { label: "CAPACITY", value: tank.capacity },
            { label: "CLEAN", value: tank.clean },
            { label: "DRAIN", value: tank.drain },
            { label: "SAFETY VALVE", value: tank.safety_valve },
          ]}
        />
        <LabeledBox
          title="FILTERS"
          rows={[
            { label: "CYCLONIC FILTER", value: filters.cyclonic },
            { label: "MICRONIC FILTER", value: filters.micronic },
            { label: "SUBMICRONIC FILTER", value: filters.submicronic },
            { label: "DUST FILTER", value: filters.dust },
            { label: "AUTOMATIC DRAIN", value: filters.automatic_drain },
          ]}
        />
      </div>
      <LabeledBox
        title="REGULATORS"
        rows={[
          { label: "4 BAR", value: regulators.bar_4 },
          { label: "7 BAR", value: regulators.bar_7 },
        ]}
      />
    </div>
  );
}
