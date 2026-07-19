import type { ManifoldPrintConfig } from "@/lib/print-manifold-config";

function asGroup(value: unknown): Record<string, string> {
  return value && typeof value === "object"
    ? (value as Record<string, string>)
    : {};
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-500 text-center text-[9pt]">
      <div className="border-b border-gray-500 bg-gray-300 px-2 py-1 font-bold">
        {label}
      </div>
      <div className="min-h-[20pt] px-2 py-1">{value || ""}</div>
    </div>
  );
}

export function ManifoldContent({
  config,
  sectionValue,
}: {
  config: ManifoldPrintConfig;
  sectionValue: Record<string, unknown>;
}) {
  const manifold = asGroup(sectionValue.manifold);
  const isAutomatic = config.changeoverLabel.startsWith("AUTOMATIC");
  const changeoverValue = isAutomatic
    ? manifold.automatic_changeover
    : manifold.regulator;

  return (
    <div>
      <div className="relative mx-auto" style={{ width: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={config.image} alt={config.sectionKey} className="w-full" />
        <div
          className="absolute flex items-center justify-center text-[8.5pt] font-medium"
          style={{
            left: `${config.manufacturerBox.left}%`,
            top: `${config.manufacturerBox.top}%`,
            width: `${config.manufacturerBox.width}%`,
            height: `${config.manufacturerBox.height}%`,
          }}
        >
          {manifold.model || ""}
        </div>
        <div
          className="absolute flex items-center justify-center text-[8.5pt] font-medium"
          style={{
            left: `${config.serialBox.left}%`,
            top: `${config.serialBox.top}%`,
            width: `${config.serialBox.width}%`,
            height: `${config.serialBox.height}%`,
          }}
        >
          {manifold.serial_no || ""}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <Pill label="QTY OF CYLINDERS" value={manifold.cylinders_left} />
        <Pill label={config.changeoverLabel} value={changeoverValue} />
        <Pill label="QTY OF CYLINDERS" value={manifold.cylinders_right} />
        <Pill label="TAIL PIPE" value={manifold.tail_pipe_left} />
        <Pill label="GAUGE" value={manifold.gauge} />
        <Pill label="TAIL PIPE" value={manifold.tail_pipe_right} />
        <Pill label="CYLINDERS CHANGE / DAY" value={manifold.cylinders_change_per_day} />
        <Pill label="POWER" value={manifold.power} />
      </div>
    </div>
  );
}
