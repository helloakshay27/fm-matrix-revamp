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

      <div className="flex-1 p-5 overflow-auto">
        {!data || chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-analytics-muted">
            No data available
          </div>
        ) : (
          <>
            <div className="flex items-center justify-end gap-4 mb-4 text-sm flex-wrap">
              {categories.map((cat, idx) => (
                <div key={cat} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getCategoryColor(cat, idx) }}
                  />
                  <span className="text-xs">{cat}</span>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 20, bottom: 60 }}
                barSize={24}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="site"
                  angle={-45}
                  textAnchor="end"
                  height={65}
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
                {categories.map((cat, idx) => (
                  <Bar
                    key={cat}
                    dataKey={cat}
                    fill={getCategoryColor(cat, idx)}
                    name={cat}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>

            <div className="p-3 rounded-md">
              <p className="text-xs text-gray-700">
                <span className="font-semibold">Note:</span> The bar graph represents dry waste segregation (in KG) broken down by site and waste category.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
