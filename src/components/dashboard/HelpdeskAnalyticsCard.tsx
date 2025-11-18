import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface HelpdeskAnalyticsCardProps {
  title: string;
  data: any;
  type: "response_tat_quarterly" | "resolution_tat_quarterly";
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

// Helper function to get period labels
const getPeriodLabels = (startDate: Date, endDate: Date) => {
  const monthsDiff = Math.abs(
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth())
  );

  if (monthsDiff <= 1) {
    return {
      periodLabel: "Weekly",
      periodUnit: "Week",
      lastLabel: "Last Week",
      currentLabel: "Current Week",
    };
  } else if (monthsDiff <= 3) {
    return {
      periodLabel: "Monthly",
      periodUnit: "Month",
      lastLabel: "Last Month",
      currentLabel: "Current Month",
    };
  } else if (monthsDiff <= 6) {
    return {
      periodLabel: "Quarterly",
      periodUnit: "Quarter",
      lastLabel: "Last Quarter",
      currentLabel: "Current Quarter",
    };
  } else {
    return {
      periodLabel: "Yearly",
      periodUnit: "Year",
      lastLabel: "Previous",
      currentLabel: "Current",
    };
  }
};

// Custom Tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <p style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{entry.value}%</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const HelpdeskAnalyticsCard: React.FC<HelpdeskAnalyticsCardProps> = ({
  title,
  data,
  type,
  dateRange,
}) => {
  const { lastLabel, currentLabel, periodUnit } = useMemo(() => {
    // Check if API provides period information
    if (data?.date_range_info) {
      const periodType = data.date_range_info.current_period?.period_type || "";
      const currentStart = data.date_range_info.current_period?.start_date || "";
      const currentEnd = data.date_range_info.current_period?.end_date || "";
      const previousStart = data.date_range_info.previous_period?.start_date || "";
      const previousEnd = data.date_range_info.previous_period?.end_date || "";
      
      return {
        periodLabel: "Custom Range",
        periodUnit: "Period",
        lastLabel: `Previous Period (${previousStart} - ${previousEnd})`,
        currentLabel: `Current Period (${currentStart} - ${currentEnd})`,
      };
    }
    
    if (dateRange) {
      return getPeriodLabels(dateRange.startDate, dateRange.endDate);
    }
    return {
      periodLabel: "Quarterly",
      periodUnit: "Quarter",
      lastLabel: "Previous Period",
      currentLabel: "Current Period",
    };
  }, [data, dateRange]);

  // Transform data based on type
  const chartData = useMemo(() => {
    if (!data) return [];

    // Determine which array to use based on API response
    // Resolution TAT API returns resolution_performance_data
    // Response TAT API returns performance_data
    // Check for nested data.data.X OR direct data.X
    const performanceArray = type === "resolution_tat_quarterly"
      ? (data?.data?.resolution_performance_data 
         ?? data?.resolution_performance_data
         ?? data?.data?.performance_data 
         ?? data?.performance_data
         ?? [])
      : (data?.data?.performance_data 
         ?? data?.performance_data
         ?? data?.data?.resolution_performance_data 
         ?? data?.resolution_performance_data
         ?? []);

    console.log('🔍 HelpdeskAnalyticsCard - type:', type);
    console.log('🔍 HelpdeskAnalyticsCard - performanceArray:', performanceArray);
    console.log('🔍 HelpdeskAnalyticsCard - data keys:', data ? Object.keys(data) : 'null');

    // Handle new API structure with performance_data array
    if (Array.isArray(performanceArray) && performanceArray.length > 0) {
      return performanceArray
        .filter((item: any) => {
          // Filter out sites with no data in both periods
          const hasCurrentData = type === "response_tat_quarterly"
            ? item.current_period?.response_tat?.total_tickets > 0
            : item.current_period?.resolution_tat?.total_tickets > 0;
          const hasPreviousData = type === "response_tat_quarterly"
            ? item.previous_period?.response_tat?.total_tickets > 0
            : item.previous_period?.resolution_tat?.total_tickets > 0;
          return hasCurrentData || hasPreviousData;
        })
        .map((item: any) => {
          const site = item.center_name || item.site_name || item.site || '';
          const tatType = type === "response_tat_quarterly" ? "response_tat" : "resolution_tat";
          return {
            site,
            last: parseFloat(item.previous_period?.[tatType]?.achieved_percentage || 0),
            current: parseFloat(item.current_period?.[tatType]?.achieved_percentage || 0),
          };
        });
    }

    // Fallback to old structure (quarterly_performance)
    if (data.quarterly_performance) {
      return Object.entries(data.quarterly_performance).map(([site, values]: [string, any]) => ({
        site,
        last: parseFloat(values.last_quarter || 0),
        current: parseFloat(values.current_quarter || 0),
      }));
    }

    return [];
  }, [data, type]);

  // Set chart max to always be 100%
  const chartMax = 100;

  const handleDownload = () => {
    // CSV download functionality
    const csvContent = [
      ["Site", lastLabel, currentLabel],
      ...chartData.map((item) => [item.site, item.last, item.current]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const chartTitle = useMemo(() => {
    return type === "response_tat_quarterly" 
      ? "Response Achieved (TAT in Percentage)"
      : "Resolution Achieved (TAT in Percentage)";
  }, [type]);

  return (
    <Card className="h-full flex flex-col border-analytics-border bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-analytics-border">
        <CardTitle className="text-lg font-semibold text-analytics-text">
          {chartTitle}
        </CardTitle>
        {/* <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="hover:bg-analytics-secondary/50"
          data-download-button
        >
          <Download className="w-4 h-4" />
        </Button> */}
      </CardHeader>

      <CardContent className="flex-1 pt-4">
        {!data || chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-analytics-muted">
            No data available
          </div>
        ) : (
          <>
            {/* Legend */}
            <div className="flex items-center justify-end gap-4 mb-6 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-[#8B6D4F] bg-[repeating-linear-gradient(-45deg,#fff,#fff_2px,#8B6D4F_2px,#8B6D4F_4px)]" />
                <span className="text-xs" title={lastLabel}>
                  {lastLabel.length > 50 ? "Previous Period" : lastLabel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#C4AD98]" />
                <span className="text-xs" title={currentLabel}>
                  {currentLabel.length > 50 ? "Current Period" : currentLabel}
                </span>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                {/* Pattern definitions for striped fill */}
                <defs>
                  <pattern
                    id={`stripedPattern_${type}`}
                    patternUnits="userSpaceOnUse"
                    width="6"
                    height="6"
                    patternTransform="rotate(45)"
                  >
                    <line x1="0" y="0" x2="0" y2="6" stroke="#8B6D4F" strokeWidth="2" />
                  </pattern>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                {/* X Axis with site names */}
                <XAxis
                  dataKey="site"
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 10 }}
                  height={80}
                  interval={0}
                />

                {/* Y Axis with percentages */}
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                  tickFormatter={(tick) => `${tick}%`}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip content={(props) => <CustomTooltip {...props} />} />

                {/* Last period with striped pattern */}
                <Bar
                  dataKey="last"
                  fill={`url(#stripedPattern_${type})`}
                  name={lastLabel}
                  barSize={30}
                />

                {/* Current period with solid fill */}
                <Bar
                  dataKey="current"
                  fill="#C4AE9D"
                  name={currentLabel}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Note section */}
            <div className="p-3 rounded-md">
              <p className="text-xs text-gray-700">
                <span className="font-semibold">Note:</span> The bar graph represents the{" "}
                {type === "response_tat_quarterly" ? "response" : "resolution"} TAT achieved in the current and previous quarter, 
                while the line graph indicates the {type === "response_tat_quarterly" ? "response" : "resolution"} TAT achieved over the same period.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
