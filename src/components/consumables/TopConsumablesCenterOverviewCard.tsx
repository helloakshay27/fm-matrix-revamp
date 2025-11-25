import React, { useMemo } from 'react';
import { Download } from 'lucide-react';

type Props = {
  data: any;
  onDownload?: () => void;
};

// Builds a top-10 consumables table across sites
const TopConsumablesCenterOverviewCard: React.FC<Props> = ({ data, onDownload }) => {
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
      <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3">
        <h3
          className="flex-1"
          style={{
            fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '100%',
            letterSpacing: '0%'
          }}
        >
          Top Consumables – Centre-wise Overview
        </h3>
        {onDownload && (
          <Download
            data-no-drag="true"
            className="w-5 h-5 flex-shrink-0 cursor-pointer text-[#C72030] hover:text-[#A01829] transition-colors z-50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDownload();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            style={{ pointerEvents: 'auto' }}
          />
        )}
      </div>
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
      
      {/* Note section */}
      <div className="mt-4 p-3 rounded-md">
        <p className="text-xs text-gray-700">
          <span className="font-semibold">Note:</span> This table highlights the top 10 consumable rate used across each centre, helping to monitor usage patterns and manage inventory more effectively.
        </p>
        <p className="text-xs text-gray-700 mt-2">
          <span className="font-semibold">Formula:</span> Total consumable × (Average Sqft (1000) / Site Sqft)
        </p>
      </div>
    </div>
  );
};

export default TopConsumablesCenterOverviewCard;
