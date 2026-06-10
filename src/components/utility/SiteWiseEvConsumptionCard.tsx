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
  Cell,
} from "recharts";

const BAR_COLORS = ['#9EC8BA', '#8E7BE0', '#DA7756', '#798C5E', '#EDC488'];

interface SiteWiseEvConsumptionCardProps {
  data: any;
  onDownload?: () => void;
}

export const SiteWiseEvConsumptionCard: React.FC<SiteWiseEvConsumptionCardProps> = ({
  data,
  onDownload,
}) => {
  const chartData = useMemo(() => {
    if (!data?.response) return [];
    return Object.entries(data.response).map(([site, values]: [string, any]) => ({
      site: site.trim(),
      ev: parseFloat(values.ev) || 0,
    }));
  }, [data]);

  const handleDownload = () => {
    const csvContent = [
      ["Site", "EV Consumption (kWh)"],
      ...chartData.map((item) => [item.site, item.ev]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site_wise_ev_consumption.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const maxEv = useMemo(
    () => Math.max(...chartData.map((d) => d.ev), 0),
    [chartData]
  );

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Site Wise EV Consumption
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
              {chartData.map((item, idx) => (
                <div key={item.site} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: BAR_COLORS[idx % BAR_COLORS.length] }} />
                  <span className="text-xs">{item.site}</span>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 20, bottom: 60 }}
                barSize={36}
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
                  domain={[0, maxEv > 0 ? Math.ceil(maxEv * 1.15 / 1000) * 1000 : 100]}
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                  formatter={(v: number) => [`${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWh`, 'EV Consumption']}
                />
                <Bar dataKey="ev" radius={[4, 4, 0, 0]}>
                  {chartData.map((_entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="p-3 rounded-md">
              <p className="text-xs text-gray-700">
                <span className="font-semibold">Note:</span> The bar graph represents the total EV energy consumption (in kWh) broken down by site.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
