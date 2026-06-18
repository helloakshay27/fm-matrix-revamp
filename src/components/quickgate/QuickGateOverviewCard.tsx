import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getFullUrl, getAuthenticatedFetchOptions } from "@/config/apiConfig";

interface QuickGateOverviewCardProps {
  startDate?: string;
  endDate?: string;
}

interface ApiResponse {
  success: number;
  totalVisitors: number;
  expectedVisitors: number;
  unexpectedVisitors: number;
  totalGatePass: number;
  returnableGatePass: number;
  nonReturnableGatePass: number;
  totalVehicle: number;
  info?: {
    totalVisitors?: string;
    expectedVisitors?: string;
    unexpectedVisitors?: string;
    totalGatePass?: string;
    returnableGatePass?: string;
    nonReturnableGatePass?: string;
    totalVehicle?: string;
  };
}

const CARD_STYLES = [
  { bg: "#EFEFFB", numColor: "#6B5EA8" },
  { bg: "#B7DCD44D", numColor: "#2E7D6B" },
  { bg: "#E3909026", numColor: "#D97655" },
  { bg: "rgba(133,189,246,0.20)", numColor: "#85BDF6" },
  { bg: "#EFEFFB", numColor: "#6B5EA8" },
  { bg: "#B7DCD44D", numColor: "#2E7D6B" },
  { bg: "#E3909026", numColor: "#D97655" },
];

const QuickGateOverviewCard: React.FC<QuickGateOverviewCardProps> = ({
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

      const url = `${getFullUrl("/pms/visitors/visitor_summary")}?${params.toString()}`;
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
      label: "Total Visitors",
      value: apiData?.totalVisitors ?? 0,
      info: apiData?.info?.totalVisitors,
    },
    {
      label: "Expected Visitors",
      value: apiData?.expectedVisitors ?? 0,
      info: apiData?.info?.expectedVisitors,
    },
    {
      label: "Unexpected Visitors",
      value: apiData?.unexpectedVisitors ?? 0,
      info: apiData?.info?.unexpectedVisitors,
    },
    {
      label: "Total Gate Pass",
      value: apiData?.totalGatePass ?? 0,
      info: apiData?.info?.totalGatePass,
    },
    {
      label: "Returnable Gate Pass Issued",
      value: apiData?.returnableGatePass ?? 0,
      info: apiData?.info?.returnableGatePass,
    },
    {
      label: "Non-Returnable Gate Pass Issued",
      value: apiData?.nonReturnableGatePass ?? 0,
      info: apiData?.info?.nonReturnableGatePass,
    },
    {
      label: "Total Vehicle",
      value: apiData?.totalVehicle ?? 0,
      info: apiData?.info?.totalVehicle,
    },
  ];

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
          Quick Gate Pass Overview
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const cardStyle = CARD_STYLES[index % CARD_STYLES.length];
          return (
            <div
              key={card.label}
              className="rounded-2xl p-6 text-center overflow-hidden relative"
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
              <div className="text-sm text-gray-600 font-medium mb-3 leading-tight break-words">
                {card.label}
              </div>
              {loading ? (
                <div
                  className="h-8 rounded animate-pulse mx-auto w-3/4"
                  style={{ backgroundColor: `${cardStyle.numColor}33` }}
                />
              ) : (
                <div
                  className="text-3xl font-extrabold"
                  style={{ color: cardStyle.numColor }}
                >
                  {Number(card.value).toLocaleString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickGateOverviewCard;
