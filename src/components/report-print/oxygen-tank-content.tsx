import { LabeledBox } from "./labeled-box";

function asRows(value: unknown): Record<string, string>[] {
  return Array.isArray(value) ? (value as Record<string, string>[]) : [];
}

function asGroup(value: unknown): Record<string, string> {
  return value && typeof value === "object"
    ? (value as Record<string, string>)
    : {};
}

export function OxygenTankContent({
  sectionValue,
}: {
  sectionValue: Record<string, unknown>;
}) {
  const tanks = asRows(sectionValue.tanks);
  const vaporizer = asGroup(sectionValue.vaporizer);

  return (
    <div className="grid grid-cols-[1fr_180pt] gap-3">
      <div className="space-y-3">
        {(tanks.length ? tanks : [{}]).map((tank, i) => (
          <LabeledBox
            key={i}
            title={tanks.length > 1 ? `TANK ${i + 1}` : "TANK"}
            rows={[
              { label: "MANUFACTURER", value: tank.manufacturer },
              { label: "SERIAL NO", value: tank.serial_no },
              { label: "MODEL", value: tank.model },
              { label: "DATE OF MANUFACTURE", value: tank.date_of_manufacture },
              { label: "TANK CAPACITY", value: tank.capacity_l },
              { label: "WORK STATUS", value: tank.work_status },
              { label: "PRESSURE", value: tank.pressure },
              { label: "LEAK TEST", value: tank.leak_test },
              { label: "GAUGE", value: tank.gauge },
              { label: "REMARKS", value: tank.remarks },
            ]}
          />
        ))}
        <LabeledBox
          title="VAPORIZER"
          rows={[
            { label: "MODEL", value: vaporizer.model },
            { label: "SERIAL NO", value: vaporizer.serial_no },
            { label: "STATUS", value: vaporizer.status },
          ]}
        />
      </div>
      <div className="flex items-start justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/report-assets/tank-photo.png"
          alt="Liquid Oxygen Tank"
          className="h-auto w-full max-w-[180pt]"
        />
      </div>
    </div>
  );
}
