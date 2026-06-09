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
    <div className="bg-white rounded-xl p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3
          className="font-semibold text-base"
          style={{ fontFamily: 'Work Sans, sans-serif' }}
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
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="min-w-[700px] px-3 sm:px-0">
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full text-sm whitespace-nowrap">
                  <thead>
                    <tr>
                      {['Site', ...headers].map((h) => (
                        <th
                          key={h}
                          className={`px-4 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header text-center`}
                          style={{ backgroundColor: '#D97655' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, i) => (
                      <tr key={row.site} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#F6F4EE' }}>
                        <td className="px-4 py-3 text-left font-medium text-gray-800 text-xs border-b border-gray-100 whitespace-nowrap">
                          {row.site}
                        </td>
                        {row.values.map((v, idx) => (
                          <td
                            key={`${row.site}-${idx}`}
                            className="px-4 py-3 text-left border-b border-gray-100 tabular-nums"
                          >
                            <span className="font-semibold text-xs text-gray-800">
                              {v.toLocaleString('en-IN')}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                    {tableData.length === 0 && (
                      <tr>
                        <td colSpan={headers.length + 1} className="px-4 py-6 text-center text-gray-400 text-sm">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
