export function LabeledBox({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="border border-gray-500">
      <div className="border-b border-gray-500 bg-gray-300 px-2 py-1 text-center text-[10pt] font-bold">
        {title}
      </div>
      <div className="divide-y divide-gray-300">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-2 text-[9pt]">
            <div className="border-l border-gray-300 bg-gray-50 px-2 py-1 font-semibold">
              {row.label}
            </div>
            <div className="px-2 py-1 text-center">{row.value || ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TransposedTable({
  title,
  itemLabel,
  columns,
  rows,
}: {
  title: string;
  itemLabel: string;
  columns: { key: string; label: string }[];
  rows: Record<string, string>[];
}) {
  const items = rows.length ? rows : [{}];
  return (
    <div>
      <table className="w-full border-collapse text-[9pt]">
        <thead>
          <tr>
            <th className="border border-gray-500 bg-gray-300 px-2 py-1 text-center">
              {title}
            </th>
            {items.map((_, i) => (
              <th
                key={i}
                className="border border-gray-500 bg-gray-300 px-2 py-1 text-center"
              >
                {itemLabel} # {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {columns.map((col) => (
            <tr key={col.key}>
              <td className="border border-gray-500 bg-gray-50 px-2 py-1 font-semibold">
                {col.label}
              </td>
              {items.map((item, i) => (
                <td key={i} className="border border-gray-500 px-2 py-1 text-center">
                  {item[col.key] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
