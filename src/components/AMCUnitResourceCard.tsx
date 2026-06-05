import React from "react";
import { ANALYTICS_PALETTE } from "@/styles/chartPalette";
import { Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

interface AMCUnitResourceCardProps {
  data: Array<{
    type: string;
    count: number;
    percentage: number;
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

// Unified palette mapping
const COLORS = [ANALYTICS_PALETTE[3], ANALYTICS_PALETTE[1]]; // Services, Assets

export const AMCUnitResourceCard: React.FC<AMCUnitResourceCardProps> = ({
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
  const COLORS = ["#9EC8BA", "#8E7BE0", "#DA7756", "#798C5E", "#EDC488"];

  const handleDownload = async () => {
    if (onDownload) {
      try {
        await onDownload();
        toast({
          title: "Success",
          description: "AMC unit resource data downloaded successfully",
        });
      } catch (error) {
        console.error("Error downloading AMC unit resource data:", error);
        toast({
          title: "Error",
          description: "Failed to download AMC unit resource data",
          variant: "destructive",
        });
      }
    }
  };

  const chartData = data?.map((item, index) => ({
    name: item.type,
    value: item.count,
    percentage: item.percentage,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div
      className={`bg-white rounded-xl shadow-sm h-full flex flex-col ${className}`}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <h3
          className="text-base font-semibold text-gray-900"
          style={{ fontFamily: "Work Sans, sans-serif" }}
        >
          Unit Resource Distribution
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      `${value} (${props.payload.percentage.toFixed(1)}%)`,
                      name,
                    ]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend and Stats */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Resource Breakdown
              </h4>
              {chartData?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">
                      {item.value}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
              {/* Summary */}
              <div
                className="mt-4 p-3 rounded-lg border"
                style={{
                  background: palette.primaryLight,
                  borderColor: palette.secondaryLight,
                }}
              >
                <div
                  className="text-sm font-semibold mb-1"
                  style={{ color: palette.primaryLight }}
                >
                  Total Units
                </div>
                <div
                  className="text-lg font-bold"
                  style={{ color: palette.primaryLight }}
                >
                  {chartData?.reduce((sum, item) => sum + item.value, 0) || 0}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No AMC unit resource data available for the selected date range
          </div>
        )}
      </div>
    </div>
  );
};
