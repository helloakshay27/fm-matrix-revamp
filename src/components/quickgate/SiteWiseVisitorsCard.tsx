import React, { useState, useEffect, useCallback, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getFullUrl, getAuthenticatedFetchOptions } from "@/config/apiConfig";

const BAR_COLORS = ["#9EC8BA", "#8E7BE0", "#DA7756", "#798C5E", "#EDC488"];

interface SiteWiseVisitorsCardProps {
  startDate?: string;
  endDate?: string;
}

interface ApiResponse {
  success: number;
  response: Record<string, number>;
  info?: { formula: string; info: string };
}

const SiteWiseVisitorsCard: React.FC<SiteWiseVisitorsCardProps> = ({
  startDate,
  endDate,
}) => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const siteId = localStorage.getItem("selectedSiteId") || "";
      const fromDate = startDate || "2020-01-01";
      const toDate = endDate || new Date().toISOString().split("T")[0];

      const params = new URLSearchParams({
        from_date: fromDate,
        to_date: toDate,
        assets_status: "true",
      });
      if (siteId) params.set("site_id", siteId);

      const url = `${getFullUrl("/pms/visitors/site_wise_visitors")}?${params.toString()}`;
      const response = await fetch(url, getAuthenticatedFetchOptions());
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: ApiResponse = await response.json();
      setApiData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartData = useMemo(() => {
    if (!apiData?.response || typeof apiData.response !== "object") return [];
    return Object.entries(apiData.response)
      .map(([site, count]) => ({ site, count: Number(count) || 0 }))
      .sort((a, b) => b.count - a.count);
  }, [apiData]);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <h3
          className="text-base font-semibold text-gray-900"
          style={{ fontFamily: "Work Sans, sans-serif" }}
        >
          Site-wise Visitor Count
        </h3>
        <RefreshCw
          className={`w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors ${loading ? "animate-spin" : ""}`}
          onClick={fetchData}
        />
      </div>

      <div className="flex-1 p-5 overflow-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#9EC8BA] rounded-full animate-spin" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No data available
          </div>
        ) : (
          <>
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mb-4">
              {BAR_COLORS.map((color) => (
                <div key={color} className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
              ))}
              <span className="text-xs text-gray-600 ml-1">Visitor Count</span>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
                barSize={28}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="site"
                  angle={-45}
                  textAnchor="end"
                  height={65}
                  tick={{ fill: "#9CA3AF", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#9CA3AF", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                  formatter={(v: number) => [v, "Visitors"]}
                />
                <Bar dataKey="count" name="Visitor Count" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {apiData?.info?.info && (
              <div className="mt-3 p-3 rounded-md">
                <p className="text-xs text-gray-700">
                  <span className="font-semibold">Note:</span> {apiData.info.info}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SiteWiseVisitorsCard;
