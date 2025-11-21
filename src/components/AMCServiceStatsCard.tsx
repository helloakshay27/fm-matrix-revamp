import React from 'react';
import { Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useToast } from '@/hooks/use-toast';

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

export const AMCServiceStatsCard: React.FC<AMCServiceStatsCardProps> = ({ data, className, onDownload, colorPalette, headerClassName }) => {
  const { toast } = useToast();

  const palette = colorPalette || {
    primary: '#C4B99D',
    secondary: '#DAD6CA',
    tertiary: '#D5DBDB',
    primaryLight: '#DDD4C4',
    secondaryLight: '#E8E5DD',
    tertiaryLight: '#E5E9E9',
  };
  const COLORS = [palette.primary, palette.primaryLight, palette.tertiary];

  const handleDownload = async () => {
    if (onDownload) {
      try {
        await onDownload();
        toast({
          title: "Success",
          description: "AMC service statistics data downloaded successfully"
        });
      } catch (error) {
        console.error('Error downloading AMC service statistics data:', error);
        toast({
          title: "Error", 
          description: "Failed to download AMC service statistics data",
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

  const totalServices = data?.reduce((sum, item) => sum + item.count, 0) || 0;

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'Completed':
        return <CheckCircle className="w-5 h-5" style={{ color: palette.primary }} />;
      case 'Pending':
        return <Clock className="w-5 h-5" style={{ color: palette.primaryLight }} />;
      case 'Overdue':
        return <AlertTriangle className="w-5 h-5" style={{ color: palette.tertiary }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'Completed':
        return { bg: 'bg-white', border: 'border-gray-200', text: '' };
      case 'Pending':
        return { bg: 'bg-white', border: 'border-gray-200', text: '' };
      case 'Overdue':
        return { bg: 'bg-white', border: 'border-gray-200', text: '' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600' };
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6 p-3 sm:p-6 pb-0">
        <h3 className={`text-base sm:text-lg font-bold ${headerClassName || 'text-[#1A1A1A]'}`}>AMC Service Statistics</h3>
        {onDownload && (
          <Download
            className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer ${headerClassName || 'text-[#1A1A1A]'} hover:opacity-80`}
            onClick={handleDownload}
          />
        )}
      </div>
      <div className="flex-1 overflow-auto p-3 sm:p-6 pt-0">
        {data && data.length > 0 && totalServices > 0 ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.map((item, index) => {
                const colors = getStatusColor(item.type);
                return (
                  <div key={index} className={`text-center p-4 ${colors.bg} rounded-xl border ${colors.border} shadow-sm`}>
                    <div className="flex items-center justify-center mb-2">
                      {getStatusIcon(item.type)}
                      <span className="text-sm font-medium ml-2 text-[#1A1A1A]">{item.type}</span>
                    </div>
                    <div className="text-2xl font-bold text-[#1A1A1A]">{item.count.toLocaleString()}</div>
                    <div className="text-xs text-[#1A1A1A] mt-1">{item.percentage.toFixed(1)}% of total</div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {/* Pie Chart */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-[#1A1A1A]">Service Distribution</h4>
                  <div className="text-sm text-[#1A1A1A]">
                    Total: {totalServices.toLocaleString()}
                  </div>
                </div>
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
                          `${value.toLocaleString()} (${props.payload.percentage.toFixed(1)}%)`,
                          name
                        ]}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-[#1A1A1A] mx-auto mb-4" />
            <div className="text-[#1A1A1A] text-lg font-medium">No service statistics available</div>
            <div className="text-[#1A1A1A] text-sm mt-1">No AMC service data found for the selected date range</div>
          </div>
        )}
      </div>
    </div>
  );
};
