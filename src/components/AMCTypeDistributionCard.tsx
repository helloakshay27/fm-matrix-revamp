import React from "react";
import { ANALYTICS_PALETTE } from "@/styles/chartPalette";
import { Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useToast } from "@/hooks/use-toast";

interface AMCTypeDistributionCardProps {
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

export const AMCTypeDistributionCard: React.FC<
  AMCTypeDistributionCardProps
> = ({ data, className, onDownload, colorPalette, headerClassName }) => {
  const { toast } = useToast();

  const palette = colorPalette || {
    primary: "#C4B99D",
    secondary: "#DAD6CA",
    tertiary: "#D5DBDB",
    primaryLight: "#DDD4C4",
    secondaryLight: "#E8E5DD",
    tertiaryLight: "#E5E9E9",
  };
  const COLORS = ["#76CDC1", "#E39090", "#CDCAF5"];

  const handleDownload = async () => {
    if (onDownload) {
      try {
        await onDownload();
        toast({
          title: "Success",
          description:
            "Breakdown vs preventive visit data downloaded successfully",
        });
      } catch (error) {
        console.error(
          "Error downloading breakdown vs preventive visit data:",
          error
        );
        toast({
          title: "Error",
          description: "Failed to download breakdown vs preventive visit data",
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
          Type Distribution
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
                    `${value} (${props.payload.percentage.toFixed(1)}%)`,
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
        ) : (
          <div className="text-center py-8 text-gray-500">
            No breakdown vs preventive visit data available for the selected
            date range
          </div>
        )}
      </div>
    </div>
  );
};
