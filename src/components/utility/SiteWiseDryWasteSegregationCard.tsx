import React, { useMemo } from "react";
import { Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CATEGORY_COLORS: Record<string, string> = {
  "Dry Waste": "#9EC8BA",
  "Organic Waste": "#8E7BE0",
  "Hazardous Waste": "#DA7756",
};

const FALLBACK_COLORS = ["#798C5E", "#EDC488"];

interface SiteWiseDryWasteSegregationCardProps {
  data: any;
  onDownload?: () => void;
}

export const SiteWiseDryWasteSegregationCard: React.FC<SiteWiseDryWasteSegregationCardProps> = ({
  data,
  onDownload,
}) => {
  const { chartData, categories } = useMemo(() => {
    if (!data?.response) return { chartData: [], categories: [] as string[] };

    const catSet = new Set<string>();
    const entries: { site: string; values: Record<string, number> }[] = [];

    Object.entries(data.response).forEach(([site, arr]: [string, any]) => {
      const values: Record<string, number> = {};
      (arr as [number, string][]).forEach(([val, cat]) => {
        values[cat] = (values[cat] || 0) + val;
        catSet.add(cat);
      });
      entries.push({ site: site.trim(), values });
    });

    const sortedCats = Array.from(catSet).sort();
    const chartData = entries.map((entry) => {
      const row: Record<string, any> = { site: entry.site };
      sortedCats.forEach((cat) => {
        row[cat] = entry.values[cat] || 0;
      });
      return row;
    });

    return { chartData, categories: sortedCats };
  }, [data]);

  const getCategoryColor = (cat: string, idx: number) =>
    CATEGORY_COLORS[cat] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length];

  const thCls = 'px-4 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header text-center';
  const tdCls = 'px-4 py-3 text-sm text-left border-b border-gray-100';

  const handleDownload = () => {
    const csvContent = [
      ["Site", ...categories],
      ...chartData.map((row) =>
        [row.site, ...categories.map((c) => row[c])].join(",")
      ),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site_wise_dry_waste_segregation.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Site Wise Waste Segregation
        </h3>
        {onDownload && (
          <Download
            data-no-drag="true"
            className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors z-50"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDownload(); }}
            onPointerDown={(e) => { e.stopPropagation(); }}
            onMouseDown={(e) => { e.stopPropagation(); }}
            style={{ pointerEvents: 'auto' }}
          />
        )}
      </div>

      <div className="flex-1 p-5 flex flex-col overflow-auto">
        {!data || chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-analytics-muted">
            No data available
          </div>
        ) : (
          <>
            {/* Stacked Bar Chart — fixed height */}
            <div className="h-64 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  barSize={24}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="site"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  {categories.map((cat, idx) => (
                    <Bar
                      key={cat}
                      dataKey={cat}
                      stackId="a"
                      fill={getCategoryColor(cat, idx)}
                      name={cat}
                      radius={idx === categories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                      minPointSize={3}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Scrollable table */}
            <div className="flex-1 overflow-auto mt-3">
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <table className="w-full text-sm min-w-[360px] border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th className={thCls} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Site</th>
                      {categories.map((cat) => (
                        <th key={cat} className={thCls} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>{cat}</th>
                      ))}
                      <th className={thCls} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((row, index) => {
                      const total = categories.reduce((sum, cat) => sum + (Number(row[cat]) || 0), 0);
                      return (
                        <tr key={row.site} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#F6F4EE' }}>
                          <td className={`${tdCls} font-medium text-gray-800`}>{row.site}</td>
                          {categories.map((cat) => (
                            <td key={cat} className={tdCls}>{row[cat] ?? 0}</td>
                          ))}
                          <td className={`${tdCls} font-semibold`}>{total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              <span className="font-semibold">Note:</span> Waste segregation is measured in KG, broken down by site and waste category.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
