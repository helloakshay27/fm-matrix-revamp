import React from 'react';
import { Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface AMCTypeDistributionCardProps {
  data: Array<{
    type: string;
    count: number;
    percentage: number;
  }> | null;
  className?: string;
  onDownload?: () => Promise<void>;
}

const COLORS = ['#ef4444', '#10b981']; // Red for Breakdown, Green for Preventive

export const AMCTypeDistributionCard: React.FC<AMCTypeDistributionCardProps> = ({ data, className, onDownload }) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    if (onDownload) {
      try {
        await onDownload();
        toast({
          title: "Success",
          description: "Breakdown vs preventive visit data downloaded successfully"
        });
      } catch (error) {
        console.error('Error downloading breakdown vs preventive visit data:', error);
        toast({
          title: "Error", 
          description: "Failed to download breakdown vs preventive visit data",
          variant: "destructive"
        });
      }
    }
  };

  const chartData = data?.map((item, index) => ({
    name: item.type,
    value: item.count,
    percentage: item.percentage,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6 p-3 sm:p-6 pb-0">
        <h3 className="text-base sm:text-lg font-bold text-[#C72030]">Breakdown vs Preventive Visits</h3>
        {onDownload && (
          <Download
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-[#C72030] hover:text-[#A01828]"
            onClick={handleDownload}
          />
        )}
      </div>
      
      <div className="flex-1 overflow-auto p-3 sm:p-6 pt-0">
        {data && data.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string, props: any) => [
                      `${value} (${props.payload.percentage.toFixed(1)}%)`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend and Stats */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Visit Type Breakdown</h4>
              {chartData?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No breakdown vs preventive visit data available for the selected date range
          </div>
        )}
      </div>
    </div>
  );
};
