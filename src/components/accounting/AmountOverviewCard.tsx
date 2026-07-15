import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getFullUrl, getAuthenticatedFetchOptions } from "@/config/apiConfig";

interface AmountOverviewCardProps {
  startDate?: string;
  endDate?: string;
}

interface ApiResponse {
  success: number;
  total_amount_response: number;
  received_amount_response: number;
  total_outstanding: number;
  info_total?: { info: string };
  info_paid?: { info: string };
  info_outstanding?: { info: string };
}

const CARD_STYLES = [
  { bg: "#EFEFFB", numColor: "#6B5EA8" },
  { bg: "#B7DCD44D", numColor: "#2E7D6B" },
  { bg: "#E3909026", numColor: "#D97655" },
];

const formatINR = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return "₹ 0";
  const num = Number(n);
  if (Number.isNaN(num)) return "₹ 0";
  return `₹ ${num.toLocaleString("en-IN")}`;
};

const AmountOverviewCard: React.FC<AmountOverviewCardProps> = ({
  startDate,
  endDate,
}) => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
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

      const url = `${getFullUrl("/pms/account_setups/top_management_total_amount")}?${params.toString()}`;
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

  const cards = [
    {
      label: "Total Amount",
      value: formatINR(apiData?.total_amount_response),
      info: apiData?.info_total?.info,
    },
    {
      label: "Total Received",
      value: formatINR(apiData?.received_amount_response),
      info: apiData?.info_paid?.info,
    },
    {
      label: "Total Outstanding",
      value: formatINR(apiData?.total_outstanding),
      info: apiData?.info_outstanding?.info,
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <div
        className="mb-6 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3 flex items-center justify-between"
      >
        <h3
          style={{
            fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          Amount Overview
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, index) => {
          const cardStyle = CARD_STYLES[index % CARD_STYLES.length];
          return (
            <div
              key={card.label}
              className="rounded-2xl p-5 text-center relative"
              style={{ backgroundColor: cardStyle.bg }}
            >
              {card.info && (
                <div className="absolute top-3 right-3">
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                          <Info className="w-4 h-4" style={{ color: cardStyle.numColor }} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
                        <p className="text-sm leading-snug">{card.info}</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
              )}
              <div className="text-sm text-gray-600 font-medium mb-3 leading-tight">
                {card.label}
              </div>
              {loading ? (
                <div
                  className="h-8 rounded animate-pulse mx-auto w-3/4"
                  style={{ backgroundColor: `${cardStyle.numColor}33` }}
                />
              ) : (
                <div
                  className="text-2xl font-extrabold break-all leading-snug"
                  style={{ color: cardStyle.numColor }}
                >
                  {card.value}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AmountOverviewCard;
