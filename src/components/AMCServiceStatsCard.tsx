import React from "react";
import { Download, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useToast } from "@/hooks/use-toast";

interface AMCServiceStatsCardProps {
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

export const AMCServiceStatsCard: React.FC<AMCServiceStatsCardProps> = ({
  data,
  className,
  onDownload,
  colorPalette,
  headerClassName,
}) => {
  const { toast } = useToast();

  const COLORS = ["#76CDC1", "#E39090", "#CDCAF5"];

  const handleDownload = async () => {
    if (onDownload) {
      try {
        await onDownload();
        toast({
          title: "Success",
          description: "AMC service statistics data downloaded successfully",
        });
      } catch (error) {
        console.error("Error downloading AMC service statistics data:", error);
        toast({
          title: "Error",
          description: "Failed to download AMC service statistics data",
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

  const totalServices = data?.reduce((sum, item) => sum + item.count, 0) || 0;

  const STATUS_COLORS: Record<string, { bg: string; num: string; Icon: React.ElementType }> = {
    Completed: { bg: "rgba(183,220,212,0.30)", num: "#2E7D6B", Icon: CheckCircle },
    Pending:   { bg: "#EFEFFB",                num: "#6B5EA8", Icon: Clock },
    Overdue:   { bg: "rgba(227,144,144,0.15)", num: "#D97655", Icon: AlertTriangle },
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
          Service Statistics
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
        {data && data.length > 0 && totalServices > 0 ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.map((item, index) => {
                const { bg, num, Icon } = STATUS_COLORS[item.type] ?? { bg: "#F9FAFB", num: "#374151", Icon: CheckCircle };
                return (
                  <div
                    key={index}
                    className="rounded-2xl px-4 py-5 text-center"
                    style={{ backgroundColor: bg }}
                  >
                    <div
                      className="text-2xl font-bold"
                      style={{ color: num, fontFamily: "Work Sans, sans-serif" }}
                    >
                      {item.count.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                      <Icon className="w-3 h-3" style={{ color: num }} />
                      {item.type}
                    </div>
                    <div className="text-xs mt-1" style={{ color: num }}>
                      {item.percentage.toFixed(1)}% of total
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} (${value})`}
                    outerRadius={90}
                    innerRadius={45}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  >
                    {chartData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      `${value.toLocaleString()} (${props.payload.percentage.toFixed(1)}%)`,
                      name,
                    ]}
                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-[#1A1A1A] mx-auto mb-4" />
            <div className="text-[#1A1A1A] text-lg font-medium">
              No service statistics available
            </div>
            <div className="text-[#1A1A1A] text-sm mt-1">
              No AMC service data found for the selected date range
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
