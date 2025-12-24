import React, { useState, useEffect } from "react";
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
  RefreshCw,
} from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { toast } from 'sonner';

interface ParkingStatisticsCardProps {
  data?: {
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
  startDate?: string;
  endDate?: string;
  compareYoY?: boolean;
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
  textColor: string;
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
    textColor: "text-[#2F2A1F]",
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
    textColor: "text-[#2F2A1F]",
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
    textColor: "text-[#2F2A1F]",
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
    textColor: "text-[#2F2A1F]",
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
    textColor: "text-[#2F2A1F]",
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
    textColor: "text-[#2F2A1F]",
    subMetrics: {
      twoWheeler: "2W",
      fourWheeler: "4W",
    },
  },
];

export const ParkingStatisticsCard: React.FC<ParkingStatisticsCardProps> = ({
  data: propData,
  onDownload,
  metricDownloads,
  startDate,
  endDate,
  compareYoY = false,
}) => {
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchParkingSummary = async () => {
      try {
        setLoading(true);
        setError(null);

        // Calculate dates if not provided
        const endDateStr = endDate || new Date().toISOString().split('T')[0];
        const startDateStr = startDate || (() => {
          const date = new Date();
          date.setDate(date.getDate() - 7);
          return date.toISOString().split('T')[0];
        })();

        // Calculate previous period start date (last month)
        const previousStartDate = (() => {
          const date = new Date(startDateStr);
          date.setMonth(date.getMonth() - 1);
          return date.toISOString().split('T')[0];
        })();

        const url = getFullUrl('/parking_dashboard/parking_summary');
        const options = getAuthenticatedFetchOptions();
        
        const params = new URLSearchParams({
          start_date: startDateStr,
          end_date: endDateStr,
          previous_start_date: previousStartDate,
          compare_yoy: compareYoY.toString(),
        });

        const fullUrl = `${url}?${params.toString()}`;
        console.log('🔍 Fetching parking summary from:', fullUrl);

        const response = await fetch(fullUrl, options);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch parking summary: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Parking summary data:', result);
        setApiData(result);
      } catch (err) {
        console.error('Error fetching parking summary:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        toast.error('Failed to load parking statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchParkingSummary();
  }, [startDate, endDate, compareYoY]);

  // Use API data if available, otherwise use prop data
  const data = apiData ? {
    total_slots: apiData.current_period?.metrics?.total_slots || 0,
    occupied: apiData.current_period?.metrics?.occupied || 0,
    vacant: apiData.current_period?.metrics?.vacant || 0,
    checked_in: apiData.current_period?.metrics?.checked_in || 0,
    checked_out: apiData.current_period?.metrics?.checked_out || 0,
    utilization: apiData.current_period?.metrics?.utilization_percent || 0,
    two_wheeler: {
      total: apiData.current_period?.two_wheeler?.total || 0,
      occupied: apiData.current_period?.two_wheeler?.booked || 0,
      vacant: apiData.current_period?.two_wheeler?.available || 0,
    },
    four_wheeler: {
      total: apiData.current_period?.four_wheeler?.total || 0,
      occupied: apiData.current_period?.four_wheeler?.booked || 0,
      vacant: apiData.current_period?.four_wheeler?.available || 0,
    },
  } : (propData || {
    total_slots: 0,
    occupied: 0,
    vacant: 0,
    checked_in: 0,
    checked_out: 0,
    utilization: 0,
    two_wheeler: { total: 0, occupied: 0, vacant: 0 },
    four_wheeler: { total: 0, occupied: 0, vacant: 0 },
  });

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Trigger re-fetch by updating a dependency
      const endDateStr = endDate || new Date().toISOString().split('T')[0];
      const startDateStr = startDate || (() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split('T')[0];
      })();

      const previousStartDate = (() => {
        const date = new Date(startDateStr);
        date.setMonth(date.getMonth() - 1);
        return date.toISOString().split('T')[0];
      })();

      const url = getFullUrl('/parking_dashboard/parking_summary');
      const options = getAuthenticatedFetchOptions();
      
      const params = new URLSearchParams({
        start_date: startDateStr,
        end_date: endDateStr,
        previous_start_date: previousStartDate,
        compare_yoy: compareYoY.toString(),
      });

      const fullUrl = `${url}?${params.toString()}`;
      const response = await fetch(fullUrl, options);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch parking summary: ${response.statusText}`);
      }

      const result = await response.json();
      setApiData(result);
      toast.success('Parking statistics refreshed');
    } catch (err) {
      console.error('Error refreshing parking summary:', err);
      toast.error('Failed to refresh parking statistics');
    } finally {
      setLoading(false);
    }
  };
  const formatValue = (value: number | string | undefined | null) => {
    if (value === undefined || value === null) return "N/A";
    return typeof value === "number" ? value.toLocaleString() : value;
  };

  const getMetricValue = (key: ParkingStatisticsMetricKey) => {
    // Get last year comparison data from API if available
    const lastYearValue = apiData?.yoy_period?.metrics || apiData?.previous_period?.metrics;
    
    switch (key) {
      case "total_slots":
        return {
          total: data.total_slots || 0,
          twoWheeler: data.two_wheeler?.total || 0,
          fourWheeler: data.four_wheeler?.total || 0,
          lastYear: lastYearValue?.total_slots || 0,
        };
      case "occupied":
        return {
          total: data.occupied || 0,
          twoWheeler: data.two_wheeler?.occupied || 0,
          fourWheeler: data.four_wheeler?.occupied || 0,
          lastYear: lastYearValue?.occupied || 0,
        };
      case "vacant":
        return {
          total: data.vacant || 0,
          twoWheeler: data.two_wheeler?.vacant || 0,
          fourWheeler: data.four_wheeler?.vacant || 0,
          lastYear: lastYearValue?.vacant || 0,
        };
      case "checked_in":
        return {
          total: data.checked_in || 0,
          twoWheeler: 0,
          fourWheeler: 0,
          lastYear: lastYearValue?.checked_in || 0,
        };
      case "checked_out":
        return {
          total: data.checked_out || 0,
          twoWheeler: 0,
          fourWheeler: 0,
          lastYear: lastYearValue?.checked_out || 0,
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
          lastYear: lastYearValue?.utilization_percent || 0,
        };
      default:
        return { total: 0, twoWheeler: 0, fourWheeler: 0, lastYear: 0 };
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
              ? "text-white/40 cursor-not-allowed"
              : "text-white hover:text-white/80 opacity-0 group-hover:opacity-100"
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
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-[#1A1A1A]">Parking Statistics Overview</h3>
          {loading && <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />}
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw
            className={`w-5 h-5 text-[#000000] hover:text-[#333333] cursor-pointer transition-colors ${loading ? 'animate-spin opacity-50' : ''}`}
            onClick={handleRefresh}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-6 gap-3">
          {metricConfigs.map((metric) => {
            const Icon = metric.icon;
            const { bgColor, borderColor, iconBgColor, color, textColor } = metric;
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

            // Calculate percentage change vs last year
            const percentageChange = value.lastYear !== undefined && value.lastYear !== null && value.total !== undefined && value.total !== null
              ? value.lastYear !== 0 
                ? ((value.total - value.lastYear) / value.lastYear * 100).toFixed(1)
                : value.total !== 0 ? '100.0' : null
              : null;
            const isPositive = percentageChange ? parseFloat(percentageChange) > 0 : false;

            return (
              <div
                key={metric.key}
                className={`group relative ${bgColor} rounded-lg border ${borderColor} transition-all duration-200 hover:shadow-lg`}
              >
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                      <h3 className={`text-xs font-medium ${textColor} opacity-90 leading-tight`}>
                        {metric.label}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderDownloadButton(downloadHandler, !isDataAvailable)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className={`text-3xl font-bold ${textColor}`}>
                      {displayValue}
                    </div>
                  </div>

                  {/* Sub-metrics for 2W and 4W */}
                  {metric.subMetrics && (
                    <div className={`flex items-center gap-2 text-xs ${textColor} opacity-90 pt-1`}>
                      <div className="flex items-center gap-1">
                        <Bike className="w-3 h-3" />
                        <span>{metric.subMetrics.twoWheeler}: {metric.key === "utilization" ? `${value.twoWheeler}%` : value.twoWheeler}</span>
                      </div>
                      <span className="opacity-50">|</span>
                      <div className="flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        <span>{metric.subMetrics.fourWheeler}: {metric.key === "utilization" ? `${value.fourWheeler}%` : value.fourWheeler}</span>
                      </div>
                    </div>
                  )}

                  {/* Last year comparison - always show if data exists */}
                  {value.lastYear !== undefined && value.lastYear !== null && (
                    <div className={`text-xs ${textColor} opacity-90 pt-1`}>
                      Last year: {metric.key === "utilization" ? `${value.lastYear}%` : value.lastYear}
                    </div>
                  )}

                  {/* Percentage change indicator - always show if calculable */}
                  {percentageChange !== null && (
                    <div className={`flex items-center gap-1 text-xs ${textColor} font-medium pt-1`}>
                      <TrendingUp className={`w-3 h-3 ${isPositive ? '' : 'rotate-180'}`} />
                      <span>{isPositive ? '+' : ''}{percentageChange}% vs last year</span>
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
