import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Download,
  Info,
  Package,
  TrendingUp,
  Wrench,
} from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AssetStatisticsCardProps {
  data: any;
  onDownload?: () => Promise<void>;
  metricDownloads?: Partial<
    Record<AssetStatisticsMetricKey, (() => Promise<void>) | undefined>
  >;
}

type AssetStatisticsMetricKey =
  | "total_assets"
  | "assets_in_use"
  | "assets_in_breakdown"
  | "critical_assets_breakdown"
  | "ppm_assets"
  | "amc_assets";

const metricConfigs: Array<{
  key: AssetStatisticsMetricKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
}> = [
  {
    key: "total_assets",
    label: "Total Assets",
    icon: Package,
    color: "text-[#2F2A1F]",
    bgColor: "bg-[#F9F6EF]",
    borderColor: "border-[#E4DDCE]",
    iconBgColor: "bg-[#E6DDCF]",
  },
  {
    key: "assets_in_use",
    label: "Assets in Use",
    icon: Activity,
    color: "text-[#2F2A1F]",
    bgColor: "bg-[#F9F6EF]",
    borderColor: "border-[#E4DDCE]",
    iconBgColor: "bg-[#E6DDCF]",
  },
  {
    key: "assets_in_breakdown",
    label: "Assets in Breakdown",
    icon: AlertTriangle,
    color: "text-[#2F2A1F]",
    bgColor: "bg-[#F9F6EF]",
    borderColor: "border-[#E4DDCE]",
    iconBgColor: "bg-[#E6DDCF]",
  },
  {
    key: "critical_assets_breakdown",
    label: "Critical Assets in Breakdown",
    icon: TrendingUp,
    color: "text-[#2F2A1F]",
    bgColor: "bg-[#F9F6EF]",
    borderColor: "border-[#E4DDCE]",
    iconBgColor: "bg-[#E6DDCF]",
  },
  {
    key: "ppm_assets",
    label: "PPM Conduct Assets",
    icon: Wrench,
    color: "text-[#2F2A1F]",
    bgColor: "bg-[#F9F6EF]",
    borderColor: "border-[#E4DDCE]",
    iconBgColor: "bg-[#E6DDCF]",
  },
  {
    key: "amc_assets",
    label: "AMC Assets",
    icon: BarChart3,
    color: "text-[#2F2A1F]",
    bgColor: "bg-[#F9F6EF]",
    borderColor: "border-[#E4DDCE]",
    iconBgColor: "bg-[#E6DDCF]",
  },
];

export const AssetStatisticsCard: React.FC<AssetStatisticsCardProps> = ({
  data,
  onDownload,
  metricDownloads,
}) => {
  const stats = data?.assets_statistics || data || {};

  const formatValue = (value: number | string | undefined | null) => {
    if (value === undefined || value === null) return "N/A";
    return typeof value === "number" ? value.toLocaleString() : value;
  };

  const getMetricValue = (key: string) => {
    switch (key) {
      case "total_assets":
        return (
          stats.total_assets?.assets_total_count ||
          stats.total_assets_count?.total_assets_count ||
          0
        );
      case "assets_in_use":
        return stats.assets_in_use?.assets_in_use_total || 0;
      case "assets_in_breakdown":
        return stats.assets_in_breakdown?.assets_in_breakdown_total || 0;
      case "critical_assets_breakdown":
        return (
          stats.critical_assets_breakdown?.critical_assets_breakdown_total || 0
        );
      case "ppm_assets":
        return (
          stats.ppm_overdue_assets?.ppm_conduct_assets_count ||
          stats.ppm_conduct_assets_count?.total ||
          stats.ppm_conduct_assets_count?.ppm_conduct_assets_count ||
          0
        );
      case "amc_assets":
        return stats.amc_assets || null;
      default:
        return 0;
    }
  };

  const getMetricInfo = (key: AssetStatisticsMetricKey): string | undefined => {
    switch (key) {
      case "total_assets":
        return stats.total_assets?.assets_total_count_info;
      case "assets_in_use":
        return stats.assets_in_use?.assets_in_use_info;
      case "assets_in_breakdown":
        return stats.assets_in_breakdown?.assets_in_breakdown_info;
      case "critical_assets_breakdown":
        return stats.critical_assets_breakdown?.critical_assets_breakdown_info;
      case "ppm_assets":
        return (
          stats.ppm_overdue_assets?.ppm_conduct_assets_info?.info ||
          stats.ppm_conduct_assets_count?.ppm_conduct_assets_info
        );
      case "amc_assets":
        return stats.amc_assets?.info;
      default:
        return undefined;
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
          <Button
            variant="ghost"
            size="sm"
        onClick={async (e) => {
          e.stopPropagation();
          try {
            await handler();
          } catch (error) {
            console.error("Failed to download asset statistics metric:", error);
          }
        }}
        className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/50 transition-opacity"
        title="Download data"
        disabled={disabled}
          >
        <Download className="w-4 h-4 text-[#C72030]" />
          </Button>
    );
  };

  return (
    <Card className="w-full border border-gray-200 shadow-sm bg-white">
      <CardHeader className="flex items-center justify-between pb-4">
        {/* <CardTitle className="text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
          <Package className="w-5 h-5 text-[#C72030]" />
          Assets Statistics
        </CardTitle> */}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {metricConfigs.map((metric) => {
            const Icon = metric.icon;
            const { bgColor, borderColor, iconBgColor, color } = metric;
            const value = getMetricValue(metric.key);
            const infoText = getMetricInfo(metric.key);
            const downloadHandler = metricDownloads?.[metric.key];

            if (
              metric.key === "amc_assets" &&
              value &&
              typeof value === "object"
            ) {
              const amcData = value as {
                assets_under_amc?: number;
                assets_missing_amc?: number;
                info?: string;
              };
              const underAmc = amcData.assets_under_amc ?? 0;
              const missingAmc = amcData.assets_missing_amc ?? 0;
              const hasAmcData = underAmc > 0 || missingAmc > 0;

              return (
                <div
                  key={metric.key}
                  className={`group relative ${bgColor} rounded-lg border ${borderColor} transition-all duration-200 ${
                    !hasAmcData ? "opacity-60" : "hover:shadow-md"
                  }`}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                      <div className="flex items-center gap-1">
                        {renderInfoButton(infoText || amcData.info)}
                        {renderDownloadButton(downloadHandler, !hasAmcData)}
                </div>
              </div>
              
                    <h3 className="text-sm font-medium text-[#6B7280] leading-tight">
                      {metric.label}
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="border-r border-gray-300 pr-3">
                        <div className="text-xs text-[#6B7280] mb-1">
                          Assets Under AMC
                  </div>
                        <div className="text-2xl font-semibold text-[#1F2937]">
                          {underAmc.toLocaleString()}
                </div>
              </div>
                      <div className="pl-3">
                        <div className="text-xs text-[#6B7280] mb-1">
                          Assets Missing AMC
                        </div>
                        <div className="text-2xl font-semibold text-[#1F2937]">
                          {missingAmc.toLocaleString()}
                  </div>
                </div>
              </div>
                  </div>
                </div>
              );
            }

            const displayValue =
              typeof value === "object" && value !== null
                ? "N/A"
                : formatValue(value as number | string | undefined | null);
            const isDataAvailable =
              displayValue !== "N/A" &&
              displayValue !== "0" &&
              displayValue !== "0.00";

            return (
              <div
                key={metric.key}
                className={`group relative ${bgColor} rounded-lg border ${borderColor} transition-all duration-200 ${
                  !isDataAvailable ? "opacity-60" : "hover:shadow-md"
                }`}
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <div className="flex items-center gap-1">
                      {renderInfoButton(infoText)}
                      {renderDownloadButton(downloadHandler, !isDataAvailable)}
              </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-[#6B7280] leading-tight">
                      {metric.label}
                    </h3>
                    <div className="text-3xl font-semibold text-[#1F2937]">
                      {displayValue}
              </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
      </CardContent>
    </Card>
  );
};
