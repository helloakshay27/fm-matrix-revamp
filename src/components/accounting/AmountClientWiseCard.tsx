import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { getFullUrl, getAuthenticatedFetchOptions } from "@/config/apiConfig";

interface AmountClientWiseCardProps {
  startDate?: string;
  endDate?: string;
}

interface ClientRow {
  site_name: string;
  outstanding_amount: number;
  paid_amount: number;
  total_amount: number;
  percentage: number;
}

interface ApiResponse {
  success: number;
  client_outstanding: ClientRow[];
  info?: { formula: string; info: string };
}

const formatINR = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return "₹ 0";
  const num = Number(n);
  if (Number.isNaN(num)) return "₹ 0";
  return `₹ ${num.toLocaleString("en-IN")}`;
};

const getPctColor = (pct: number): string => {
  if (pct > 50) return "#76CDC1";
  return "#DA7756";
};

const HEADERS = [
  "Site Name",
  "Total Amount",
  "Paid Amount",
  "Outstanding Amount",
  "Outstanding %",
];

const AmountClientWiseCard: React.FC<AmountClientWiseCardProps> = ({
  startDate,
  endDate,
}) => {
  const [rows, setRows] = useState<ClientRow[]>([]);
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

      const url = `${getFullUrl("/pms/account_setups/total_outstanding_amount_client_wise")}?${params.toString()}`;
      const response = await fetch(url, getAuthenticatedFetchOptions());
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: ApiResponse = await response.json();
      setRows(Array.isArray(data.client_outstanding) ? data.client_outstanding : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <div className="mb-6 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3 flex items-center justify-between">
        <h3
          style={{
            fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          Client-wise Outstanding Amount
        </h3>
        <RefreshCw
          className={`w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors ${loading ? "animate-spin" : ""}`}
          onClick={fetchData}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="rounded-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {HEADERS.map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header text-center"
                      style={{ backgroundColor: "#D97655" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#F6F4EE" }}>
                      {HEADERS.map((h) => (
                        <td key={h} className="px-4 py-3 border-b border-gray-100">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={HEADERS.length} className="px-4 py-6 text-center text-gray-400 text-sm">
                      No data available
                    </td>
                  </tr>
                ) : (
                  rows.map((row, i) => {
                    const pct = Number(row.percentage) || 0;
                    const pctColor = getPctColor(pct);
                    return (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#F6F4EE" }}>
                        <td className="px-4 py-3 text-left font-medium text-gray-800 text-xs border-b border-gray-100 whitespace-nowrap">
                          {row.site_name || "—"}
                        </td>
                        <td className="px-4 py-3 text-left text-xs text-gray-700 border-b border-gray-100 whitespace-nowrap">
                          {formatINR(row.total_amount)}
                        </td>
                        <td className="px-4 py-3 text-left text-xs font-semibold border-b border-gray-100 whitespace-nowrap" style={{ color: "#2E7D6B" }}>
                          {formatINR(row.paid_amount)}
                        </td>
                        <td className="px-4 py-3 text-left text-xs font-semibold border-b border-gray-100 whitespace-nowrap" style={{ color: "#C72030" }}>
                          {formatINR(row.outstanding_amount)}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2 justify-start">
                            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden min-w-[50px]">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: "#76CDC1" }}
                              />
                            </div>
                            <span className="text-xs font-semibold whitespace-nowrap" style={{ color: pctColor }}>
                              {pct}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default AmountClientWiseCard;
