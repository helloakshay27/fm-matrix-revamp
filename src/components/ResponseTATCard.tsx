import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Download } from 'lucide-react';
import { ticketAnalyticsDownloadAPI } from '@/services/ticketAnalyticsDownloadAPI';
import { useToast } from '@/hooks/use-toast';

// Color palette with lighter shades
const CHART_COLORS = {
  primary: '#C4B99D',
  secondary: '#DAD6CA',
  tertiary: '#D5DBDB',
  primaryLight: '#DDD4C4',    // Lighter shade of primary
  secondaryLight: '#E8E5DD',  // Lighter shade of secondary
  tertiaryLight: '#E5E9E9',   // Lighter shade of tertiary
};

interface ResponseTATData {
  success: number;
  message: string;
  response: {
    response_tat: {
      open: {
        breached: number;
        achieved: number;
      };
      close: {
        breached: number;
        achieved: number;
      };
    };
    resolution_tat: {
      open: {
        breached: number;
        achieved: number;
      };
      close: {
        breached: number;
        achieved: number;
      };
    };
  };
  info: string;
}

interface ResponseTATCardProps {
  data: ResponseTATData | null;
  className?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export const ResponseTATCard: React.FC<ResponseTATCardProps> = ({ data, className = "", dateRange }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!dateRange) return;
    
    setIsDownloading(true);
    try {
      await ticketAnalyticsDownloadAPI.downloadResponseTATData(dateRange.startDate, dateRange.endDate);
      toast({
        title: "Success",
        description: "Response TAT data downloaded successfully"
      });
    } catch (error) {
      console.error('Error downloading response TAT data:', error);
      toast({
        title: "Error",
        description: "Failed to download response TAT data",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  if (!data || !data.response) {
    return (
      <Card className={`bg-white ${className}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-[#C72030]">Response & Resolution TAT</CardTitle>
            <Download 
              className="w-5 h-5 text-[#C72030] cursor-pointer" 
              onClick={handleDownload}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for Response TAT chart
  const responseTATData = [
    {
      name: 'Achieved',
      value: data.response.response_tat.open.achieved + data.response.response_tat.close.achieved,
      color: CHART_COLORS.primary,
      open: data.response.response_tat.open.achieved,
      close: data.response.response_tat.close.achieved
    },
    {
      name: 'Breached',
      value: data.response.response_tat.open.breached + data.response.response_tat.close.breached,
      color: CHART_COLORS.secondary,
      open: data.response.response_tat.open.breached,
      close: data.response.response_tat.close.breached
    }
  ];

  // Prepare data for Resolution TAT chart
  const resolutionTATData = [
    {
      name: 'Achieved',
      value: data.response.resolution_tat.open.achieved + data.response.resolution_tat.close.achieved,
      color: CHART_COLORS.primary,
      open: data.response.resolution_tat.open.achieved,
      close: data.response.resolution_tat.close.achieved
    },
    {
      name: 'Breached',
      value: data.response.resolution_tat.open.breached + data.response.resolution_tat.close.breached,
      color: CHART_COLORS.secondary,
      open: data.response.resolution_tat.open.breached,
      close: data.response.resolution_tat.close.breached
    }
  ];

  const responseTotalValue = responseTATData.reduce((sum, item) => sum + item.value, 0);
  const resolutionTotalValue = resolutionTATData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={`bg-white ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-[#C72030]">Response & Resolution TAT</CardTitle>
          <Download 
            className={`w-5 h-5 text-[#C72030] cursor-pointer ${isDownloading ? 'opacity-50' : ''}`}
            onClick={handleDownload}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Response TAT Chart */}
          <div className="text-center">
            <h3 className="text-md font-semibold text-gray-700 mb-4">Response TAT</h3>
            <div className="relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={responseTATData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ value, cx, cy, midAngle, innerRadius, outerRadius }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {value}
                        </text>
                      );
                    }}
                    labelLine={false}
                  >
                    {responseTATData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg z-50">
                            <p className="font-semibold text-gray-800 mb-2">{data.name}</p>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-blue-600 font-medium">Open:</span>
                                <span className="text-gray-700">{data.open}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Close:</span>
                                <span className="text-gray-700">{data.close}</span>
                              </div>
                              <div className="pt-1 border-t border-gray-200">
                                <div className="flex justify-between items-center font-semibold">
                                  <span>Total:</span>
                                  <span>{data.value}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                    wrapperStyle={{ zIndex: 1000 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-700">Total: {responseTotalValue}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {responseTATData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-medium text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution TAT Chart */}
          <div className="text-center">
            <h3 className="text-md font-semibold text-gray-700 mb-4">Resolution TAT</h3>
            <div className="relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={resolutionTATData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ value, cx, cy, midAngle, innerRadius, outerRadius }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {value}
                        </text>
                      );
                    }}
                    labelLine={false}
                  >
                    {resolutionTATData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg z-50">
                            <p className="font-semibold text-gray-800 mb-2">{data.name}</p>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-blue-600 font-medium">Open:</span>
                                <span className="text-gray-700">{data.open}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Close:</span>
                                <span className="text-gray-700">{data.close}</span>
                              </div>
                              <div className="pt-1 border-t border-gray-200">
                                <div className="flex justify-between items-center font-semibold">
                                  <span>Total:</span>
                                  <span>{data.value}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                    wrapperStyle={{ zIndex: 1000 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-700">Total: {resolutionTotalValue}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {resolutionTATData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-medium text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};