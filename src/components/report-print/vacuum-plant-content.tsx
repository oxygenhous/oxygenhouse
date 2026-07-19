import { TransposedTable, LabeledBox } from "./labeled-box";

function asRows(value: unknown): Record<string, string>[] {
  return Array.isArray(value) ? (value as Record<string, string>[]) : [];
}

function asGroup(value: unknown): Record<string, string> {
  return value && typeof value === "object"
    ? (value as Record<string, string>)
    : {};
}

const PUMP_COLUMNS = [
  { key: "model", label: "MODEL" },
  { key: "capacity", label: "CAPACITY" },
  { key: "power", label: "POWER" },
  { key: "oil_filters", label: "OIL FILTERS" },
  { key: "oil_level", label: "OIL LEVEL" },
  { key: "control_panel", label: "CONTROL PANEL" },
  { key: "flow", label: "FLOW" },
  { key: "max_pressure", label: "MAX PRESSURE" },
  { key: "min_pressure", label: "MIN PRESSURE" },
];

export function VacuumPlantContent({
  sectionValue,
}: {
  sectionValue: Record<string, unknown>;
}) {
  const tank = asGroup(sectionValue.tank);
  const filters = asGroup(sectionValue.filters);
  const notes = (sectionValue.notes as string) || "";

  return (
    <div className="space-y-3">
      <TransposedTable
        title=""
        itemLabel="PUMP"
        columns={PUMP_COLUMNS}
        rows={asRows(sectionValue.pumps)}
      />
      <div className="grid grid-cols-2 gap-3">
        <LabeledBox
          title="TANK"
          rows={[
            { label: "MANUFACTURER", value: tank.manufacturer },
            { label: "CAPACITY", value: tank.capacity },
            { label: "DRAIN", value: tank.drain },
          ]}
        />
        <LabeledBox
          title="FILTERS"
          rows={[
            { label: "MANUFACTURER", value: filters.manufacturer },
            { label: "CLEAN", value: filters.clean },
            { label: "TYPE", value: filters.type },
          ]}
        />
      </div>
      {notes && (
        <p className="text-[9pt]">
          <span className="font-semibold">NOTES: </span>
          {notes}
        </p>
      )}
    </div>
  );
}
