import React, { useState, useEffect, useCallback } from "react";
import { Car, Bike, MapPin, Activity, CheckCircle, RefreshCw } from "lucide-react";
import { getFullUrl, getAuthenticatedFetchOptions } from "@/config/apiConfig";

interface ExecutiveParkingStatsCardProps {
  startDate?: string;
  endDate?: string;
}

interface ApiResponse {
  success: number;
  total_parking: number;
  free_parking: number;
  paid_parking: number;
  booked: {
    total: number;
    two_wheeler: number;
    four_wheeler: number;
  };
  available: {
    total: number;
    two_wheeler: number;
    four_wheeler: number;
  };
}

const singleMetrics = [
  {
    key: "total_parking" as const,
    label: "Total Parking",
    icon: MapPin,
    color: "text-[#6B5EA8]",
    bgColor: "bg-[#EFEFFB]",
    iconBgColor: "bg-[#CDCAF5]",
    numColor: "#6B5EA8",
  },
  {
    key: "free_parking" as const,
    label: "Free Parking",
    icon: Car,
    color: "text-[#2E7D6B]",
    bgColor: "bg-[#B7DCD44D]",
    iconBgColor: "bg-[#76CDC180]",
    numColor: "#2E7D6B",
  },
  {
    key: "paid_parking" as const,
    label: "Paid Parking",
    icon: Activity,
    color: "text-[#D97655]",
    bgColor: "bg-[#E3909026]",
    iconBgColor: "bg-[#E3909060]",
    numColor: "#D97655",
  },
];

const dualMetrics = [
  {
    key: "booked" as const,
    label: "Allocated Parking",
    icon: CheckCircle,
    bgColor: "bg-[#FFF8EC]",
    iconBgColor: "bg-[#FFDD9480]",
    color: "text-[#B45309]",
    numColor: "#B45309",
  },
  {
    key: "available" as const,
    label: "Available Parking",
    icon: Bike,
    bgColor: "bg-[#85BDF633]",
    iconBgColor: "bg-[#85BDF660]",
    color: "text-[#1565C0]",
    numColor: "#1565C0",
  },
];

const fmt = (val: number | undefined | null) => (val ?? 0).toLocaleString();

const ExecutiveParkingStatsCard: React.FC<ExecutiveParkingStatsCardProps> = ({
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

      const params = new URLSearchParams({ from_date: fromDate, to_date: toDate });
      if (siteId) params.set("site_id", siteId);

      const url = `${getFullUrl("/parking_dashboard/parking_statistics")}?${params.toString()}`;
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

  const stats = {
    total_parking: apiData?.total_parking ?? 0,
    free_parking: apiData?.free_parking ?? 0,
    paid_parking: apiData?.paid_parking ?? 0,
    booked: {
      total: apiData?.booked?.total ?? 0,
      two_wheeler: apiData?.booked?.two_wheeler ?? 0,
      four_wheeler: apiData?.booked?.four_wheeler ?? 0,
    },
    available: {
      total: apiData?.available?.total ?? 0,
      two_wheeler: apiData?.available?.two_wheeler ?? 0,
      four_wheeler: apiData?.available?.four_wheeler ?? 0,
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm w-full">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3
          className="text-base font-semibold text-gray-900"
          style={{ fontFamily: "Work Sans, sans-serif" }}
        >
          Parking Statistics Overview
        </h3>
        <RefreshCw
          className={`w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors ${loading ? "animate-spin" : ""}`}
          onClick={fetchData}
        />
      </div>

      <div className="p-5 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Row 1 — Total Parking · Free Parking · Paid Parking */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {singleMetrics.map((metric) => {
            const Icon = metric.icon;
            const value = stats[metric.key] as number;

            return (
              <div
                key={metric.key}
                className={`relative rounded-2xl px-5 py-6 text-center flex flex-col items-center gap-2 ${metric.bgColor}`}
              >
                <div
                  className={`w-10 h-10 rounded-full ${metric.iconBgColor} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <p className="text-xs text-gray-500 leading-tight">{metric.label}</p>
                <div
                  className="text-3xl font-bold leading-none"
                  style={{ color: metric.numColor, fontFamily: "Work Sans, sans-serif" }}
                >
                  {loading ? (
                    <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    fmt(value)
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 2 — Allocated Parking · Available Parking */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dualMetrics.map((metric) => {
            const Icon = metric.icon;
            const group = stats[metric.key];

            return (
              <div
                key={metric.key}
                className={`${metric.bgColor} rounded-lg border border-transparent`}
              >
                <div className="p-6 space-y-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${metric.iconBgColor} flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>

                  <p className="text-sm font-medium text-[#6B7280] leading-tight">
                    {metric.label}
                  </p>

                  <div
                    className="text-2xl font-bold"
                    style={{ color: metric.numColor, fontFamily: "Work Sans, sans-serif" }}
                  >
                    {loading ? (
                      <span className="inline-block w-20 h-7 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      fmt(group.total)
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-3">
                    <div className="border-r border-gray-300 pr-3">
                      <p className="text-xs text-[#6B7280] mb-1">4-Wheelers</p>
                      <p className="text-xl font-semibold text-[#1F2937]">
                        {loading ? (
                          <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse" />
                        ) : (
                          fmt(group.four_wheeler)
                        )}
                      </p>
                    </div>
                    <div className="pl-3">
                      <p className="text-xs text-[#6B7280] mb-1">2-Wheelers</p>
                      <p className="text-xl font-semibold text-[#1F2937]">
                        {loading ? (
                          <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse" />
                        ) : (
                          fmt(group.two_wheeler)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveParkingStatsCard;
