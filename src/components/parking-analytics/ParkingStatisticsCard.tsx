import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Bike,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Info,
  Download,
} from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ParkingStatisticsCardProps {
  data: {
    total_slots?: number;
    occupied?: number;
    vacant?: number;
    checked_in?: number;
    checked_out?: number;
    utilization?: number;
    two_wheeler?: {
      total: number;
      occupied: number;
      vacant: number;
    };
    four_wheeler?: {
      total: number;
      occupied: number;
      vacant: number;
    };
  };
  onDownload?: () => Promise<void>;
  metricDownloads?: Partial<
    Record<ParkingStatisticsMetricKey, (() => Promise<void>) | undefined>
  >;
}

type ParkingStatisticsMetricKey =
  | "total_slots"
  | "occupied"
  | "vacant"
  | "checked_in"
  | "checked_out"
  | "utilization";

const metricConfigs: Array<{
  key: ParkingStatisticsMetricKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
  subMetrics?: {
    twoWheeler: string;
    fourWheeler: string;
  };
}> = [
  {
    key: "total_slots",
    label: "Total Slots",
    icon: Car,
    color: "text-[#2F2A1F]",
    bgColor: "bg-[#F9F6EF]",
    borderColor: "border-[#E4DDCE]",
    iconBgColor: "bg-[#E6DDCF]",
    subMetrics: {
      twoWheeler: "2W",
      fourWheeler: "4W",
    },
  },
  {
    key: "occupied",
    label: "Occupied",
    icon: CheckCircle,
    color: "text-[#2F2A1F]",
    bgColor: "bg-[#F9F6EF]",
    borderColor: "border-[#E4DDCE]",
    iconBgColor: "bg-[#E6DDCF]",
    subMetrics: {
      twoWheeler: "2W",
      fourWheeler: "4W",
    },
  },
  {
    key: "vacant",
    label: "Vacant",
    icon: XCircle,
    color: "text-[#2F2A1F]",
    bgColor: "bg-[#F9F6EF]",
    borderColor: "border-[#E4DDCE]",
    iconBgColor: "bg-[#E6DDCF]",
    subMetrics: {
      twoWheeler: "2W",
      fourWheeler: "4W",
    },
  },
  {
    key: "checked_in",
    label: "Checked-In",
    icon: Users,
    color: "text-[#2F2A1F]",
    bgColor: "bg-[#F9F6EF]",
    borderColor: "border-[#E4DDCE]",
    iconBgColor: "bg-[#E6DDCF]",
    subMetrics: {
      twoWheeler: "2W",
      fourWheeler: "4W",
    },
  },
  {
    key: "checked_out",
    label: "Checked-Out",
    icon: Users,
    color: "text-[#2F2A1F]",
    bgColor: "bg-[#F9F6EF]",
    borderColor: "border-[#E4DDCE]",
    iconBgColor: "bg-[#E6DDCF]",
    subMetrics: {
      twoWheeler: "2W",
      fourWheeler: "4W",
    },
  },
  {
    key: "utilization",
    label: "Utilization %",
    icon: TrendingUp,
    color: "text-[#2F2A1F]",
    bgColor: "bg-[#F9F6EF]",
    borderColor: "border-[#E4DDCE]",
    iconBgColor: "bg-[#E6DDCF]",
    subMetrics: {
      twoWheeler: "2W",
      fourWheeler: "4W",
    },
  },
];

export const ParkingStatisticsCard: React.FC<ParkingStatisticsCardProps> = ({
  data,
  onDownload,
  metricDownloads,
}) => {
  const formatValue = (value: number | string | undefined | null) => {
    if (value === undefined || value === null) return "N/A";
    return typeof value === "number" ? value.toLocaleString() : value;
  };

  const getMetricValue = (key: ParkingStatisticsMetricKey) => {
    switch (key) {
      case "total_slots":
        return {
          total: data.total_slots || 0,
          twoWheeler: data.two_wheeler?.total || 0,
          fourWheeler: data.four_wheeler?.total || 0,
        };
      case "occupied":
        return {
          total: data.occupied || 0,
          twoWheeler: data.two_wheeler?.occupied || 0,
          fourWheeler: data.four_wheeler?.occupied || 0,
        };
      case "vacant":
        return {
          total: data.vacant || 0,
          twoWheeler: data.two_wheeler?.vacant || 0,
          fourWheeler: data.four_wheeler?.vacant || 0,
        };
      case "checked_in":
        return {
          total: data.checked_in || 0,
          twoWheeler: 0,
          fourWheeler: 0,
        };
      case "checked_out":
        return {
          total: data.checked_out || 0,
          twoWheeler: 0,
          fourWheeler: 0,
        };
      case "utilization":
        return {
          total: data.utilization || 0,
          twoWheeler: data.two_wheeler?.total && data.two_wheeler?.occupied 
            ? Math.round((data.two_wheeler.occupied / data.two_wheeler.total) * 100) 
            : 0,
          fourWheeler: data.four_wheeler?.total && data.four_wheeler?.occupied
            ? Math.round((data.four_wheeler.occupied / data.four_wheeler.total) * 100)
            : 0,
        };
      default:
        return { total: 0, twoWheeler: 0, fourWheeler: 0 };
    }
  };

  const renderInfoButton = (infoText?: string) => {
    if (!infoText) return null;
    return (
      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/50 transition-opacity"
            >
              <Info className="w-4 h-4 text-[#6B7280]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
            <p className="text-sm font-medium leading-snug">{infoText}</p>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    );
  };

  const renderDownloadButton = (
    handler?: () => Promise<void>,
    disabled?: boolean
  ) => {
    if (!handler) return null;
    return (
      <div title={disabled ? "No data to download" : "Download data"}>
        <Download
          data-no-drag="true"
          className={`w-5 h-5 flex-shrink-0 cursor-pointer transition-all z-50 ${
            disabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-black hover:text-gray-700 opacity-0 group-hover:opacity-100"
          }`}
          onClick={async (e) => {
            if (disabled) return;
            e.preventDefault();
            e.stopPropagation();
            try {
              await handler();
            } catch (error) {
              console.error("Failed to download parking statistics metric:", error);
            }
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          style={{ pointerEvents: disabled ? "none" : "auto" }}
        />
      </div>
    );
  };

  return (
    <Card className="w-full border border-gray-200 shadow-sm bg-white">
      <CardHeader className="flex items-center justify-between pb-2">
        {/* Header can be added if needed */}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-6 gap-3">
          {metricConfigs.map((metric) => {
            const Icon = metric.icon;
            const { bgColor, borderColor, iconBgColor, color } = metric;
            const value = getMetricValue(metric.key);
            const downloadHandler = metricDownloads?.[metric.key];

            const displayValue =
              metric.key === "utilization"
                ? `${value.total}%`
                : formatValue(value.total);
            const isDataAvailable =
              displayValue !== "N/A" &&
              displayValue !== "0" &&
              displayValue !== "0%" &&
              displayValue !== "0.00";

            return (
              <div
                key={metric.key}
                className={`group relative ${bgColor} rounded-lg border ${borderColor} transition-all duration-200 ${
                  !isDataAvailable ? "opacity-60" : "hover:shadow-md"
                }`}
              >
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div className="flex items-center gap-1">
                      {renderDownloadButton(downloadHandler, !isDataAvailable)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-medium text-[#6B7280] leading-tight">
                      {metric.label}
                    </h3>
                    <div className="text-2xl font-semibold text-[#1F2937]">
                      {displayValue}
                    </div>
                  </div>

                  {/* Sub-metrics for 2W and 4W */}
                  {metric.subMetrics && (metric.key === "total_slots" || metric.key === "occupied" || metric.key === "vacant" || metric.key === "utilization") && (
                    <div className="flex items-center gap-2 text-xs text-[#6B7280] pt-1 border-t border-gray-200">
                      <div className="flex items-center gap-1">
                        <Bike className="w-3 h-3" />
                        <span>{metric.subMetrics.twoWheeler}: {metric.key === "utilization" ? `${value.twoWheeler}%` : value.twoWheeler}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        <span>{metric.subMetrics.fourWheeler}: {metric.key === "utilization" ? `${value.fourWheeler}%` : value.fourWheeler}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
