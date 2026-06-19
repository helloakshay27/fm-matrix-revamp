import React from "react";
import { Download, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

interface AMCExpiryAnalysisCardProps {
  data: Array<{
    period: string;
    expiringCount: number;
    expiredCount: number;
  }> | null;
  className?: string;
  onDownload?: () => Promise<void>;
  colorPalette?: {
    primary: string;
    secondary: string;
    tertiary: string;
    primaryLight: string;
    secondaryLight: string;
    tertiaryLight: string;
  };
  headerClassName?: string;
}

export const AMCExpiryAnalysisCard: React.FC<AMCExpiryAnalysisCardProps> = ({
  data,
  className,
  onDownload,
  colorPalette,
  headerClassName,
}) => {
  const { toast } = useToast();

  const palette = colorPalette || {
    primary: "#C4B99D",
    secondary: "#DAD6CA",
    tertiary: "#D5DBDB",
    primaryLight: "#DDD4C4",
    secondaryLight: "#E8E5DD",
    tertiaryLight: "#E5E9E9",
  };

  const handleDownload = async () => {
    if (onDownload) {
      try {
        await onDownload();
        toast({
          title: "Success",
          description: "AMC expiry analysis data downloaded successfully",
        });
      } catch (error) {
        console.error("Error downloading AMC expiry analysis data:", error);
        toast({
          title: "Error",
          description: "Failed to download AMC expiry analysis data",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm h-full flex flex-col ${className}`}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <h3
          className="text-base font-semibold text-gray-900"
          style={{ fontFamily: "Work Sans, sans-serif" }}
        >
          Expiry Analysis
        </h3>
        {onDownload && (
          <Download
            data-no-drag="true"
            className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors z-50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDownload();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ pointerEvents: "auto" }}
          />
        )}
      </div>
      <div className="flex-1 overflow-auto p-5">
        {data && data.length > 0 ? (
          <div className="space-y-6">
            {/* Key Metrics Row — guideline colors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                {
                  label: "Expired",
                  val:
                    data.find((i) => i.period === "Expired")?.expiredCount || 0,
                  bg: "rgba(227,144,144,0.15)",
                  num: "#D97655",
                  Icon: AlertTriangle,
                },
                {
                  label: "30 Days",
                  val:
                    data.find((i) => i.period === "Next 30 Days")
                      ?.expiringCount || 0,
                  bg: "rgba(183,220,212,0.30)",
                  num: "#2E7D6B",
                  Icon: Clock,
                },
                {
                  label: "60 Days",
                  val:
                    data.find((i) => i.period === "Next 60 Days")
                      ?.expiringCount || 0,
                  bg: "rgba(133,189,246,0.20)",
                  num: "#85BDF6",
                  Icon: Clock,
                },
                {
                  label: "90 Days",
                  val:
                    data.find((i) => i.period === "Next 90 Days")
                      ?.expiringCount || 0,
                  bg: "#EFEFFB",
                  num: "#6B5EA8",
                  Icon: TrendingUp,
                },
              ].map(({ label, val, bg, num, Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl px-4 py-5 text-center"
                  style={{ backgroundColor: bg }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: num, fontFamily: "Work Sans, sans-serif" }}
                  >
                    {val}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                    <Icon className="w-3 h-3" style={{ color: num }} />
                    {label}
                  </div>
                </div>
              ))}
            </div>
            {/* Trend Chart */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-[#1A1A1A]">
                  AMC Expiry Trend
                </h4>
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-[#1A1A1A]">Expiry Forecast</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.filter((item) => item.period !== "Expired")}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="expiringGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#9EC8BA"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor="#9EC8BA"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="period"
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      axisLine={{ stroke: "#d1d5db" }}
                    />
                    <YAxis
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      axisLine={{ stroke: "#d1d5db" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      labelStyle={{ color: "#374151", fontWeight: "semibold" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="expiringCount"
                      stroke="#9EC8BA"
                      strokeWidth={3}
                      fill="url(#expiringGradient)"
                      dot={{ fill: "#9EC8BA", strokeWidth: 2, r: 5 }}
                      activeDot={{
                        r: 7,
                        fill: "#9EC8BA",
                        stroke: "#ffffff",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No AMC expiry analysis data available for the selected date range
          </div>
        )}
      </div>
    </div>
  );
};
