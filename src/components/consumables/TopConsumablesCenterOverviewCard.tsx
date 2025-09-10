import React, { useMemo } from 'react';

type Props = {
  data: any;
};

// Builds a top-10 consumables table across sites
const TopConsumablesCenterOverviewCard: React.FC<Props> = ({ data }) => {
  const rows = useMemo(() => {
    const root = data?.data?.center_wise_consumables
      ?? data?.center_wise_consumables
      ?? [];
    return Array.isArray(root) ? root : [];
  }, [data]);

  const headers = useMemo(() => {
    const totals = new Map<string, number>();
    rows.forEach((row: any) => {
      const cons = row?.consumables && typeof row.consumables === 'object' ? row.consumables : {};
      Object.entries(cons).forEach(([name, val]) => {
        const n = Number(val) || 0;
        totals.set(String(name), (totals.get(String(name)) ?? 0) + n);
      });
    });
    return Array.from(totals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name]) => name);
  }, [rows]);

  const tableData = useMemo(() => {
    return rows.map((row: any) => {
      const cons = row?.consumables && typeof row.consumables === 'object' ? row.consumables : {};
      const values = headers.map((name) => Number((cons as any)[name] ?? 0));
      return { site: row?.site_name || row?.site || '-', values };
    });
  }, [rows, headers]);

  return (
    <div className="bg-white border rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Top Consumables – Centre-wise Overview</h3>
      {headers.length === 0 ? (
        <div className="text-sm text-gray-500">No data</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs text-center">
            <thead>
              <tr className="bg-[#ded9cd] text-[#b62527]">
                <th className="border p-2 text-left">Site</th>
                {headers.map((h) => (
                  <th key={h} className="border p-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.site}>
                  <td className="border p-2 text-left font-medium">{row.site}</td>
                  {row.values.map((v, idx) => (
                    <td key={`${row.site}-${idx}`} className="border p-2 text-right tabular-nums">
                      {v.toLocaleString('en-IN')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopConsumablesCenterOverviewCard;
