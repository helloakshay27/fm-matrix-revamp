import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { ticketAnalyticsDownloadAPI } from '@/services/ticketAnalyticsDownloadAPI';
import { useToast } from '@/hooks/use-toast';

// Color palette matching CategoryWiseProactiveReactiveCard
const CHART_COLORS = {
  openAchieved: '#8B7355',      // Darker brown for Open Achieved
  openBreached: '#C4B99D',      // Original primary for Open Breached
  closeAchieved: '#B8AFA0',     // Medium shade for Close Achieved
  closeBreached: '#DAD6CA',     // Original secondary for Close Breached
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
      <Card className={`bg-white ${className} relative z-0`}>
        <CardHeader className="relative z-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-[#C72030]">Response & Resolution TAT</CardTitle>
            <Download
              data-no-drag="true"
              className="w-5 h-5 text-[#000000] hover:text-[#333333] cursor-pointer transition-colors z-50"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDownload();
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              style={{ pointerEvents: 'auto' }}
            />
          </div>
        </CardHeader>
        <CardContent className="relative z-0">
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for Response TAT bar chart - Two categories: Open and Close
  const responseTATChartData = [
    {
      name: 'Open',
      achieved: data.response.response_tat.open.achieved,
      breached: data.response.response_tat.open.breached,
    },
    {
      name: 'Close',
      achieved: data.response.response_tat.close.achieved,
      breached: data.response.response_tat.close.breached,
    }
  ];

  // Prepare data for Resolution TAT bar chart - Two categories: Open and Close
  const resolutionTATChartData = [
    {
      name: 'Open',
      achieved: data.response.resolution_tat.open.achieved,
      breached: data.response.resolution_tat.open.breached,
    },
    {
      name: 'Close',
      achieved: data.response.resolution_tat.close.achieved,
      breached: data.response.resolution_tat.close.breached,
    }
  ];

  // Calculate totals for display
  const responseTotalValue = 
    data.response.response_tat.open.achieved +
    data.response.response_tat.open.breached +
    data.response.response_tat.close.achieved +
    data.response.response_tat.close.breached;

  const resolutionTotalValue = 
    data.response.resolution_tat.open.achieved +
    data.response.resolution_tat.open.breached +
    data.response.resolution_tat.close.achieved +
    data.response.resolution_tat.close.breached;

  return (
    <Card className={`bg-white ${className} relative z-0`}>
      <CardHeader className="relative z-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-[#C72030]">Response & Resolution TAT</CardTitle>
          <Download
            data-no-drag="true"
            className={`w-5 h-5 text-[#000000] hover:text-[#333333] cursor-pointer transition-colors z-50 ${isDownloading ? 'opacity-50' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDownload();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            style={{ pointerEvents: 'auto' }}
          />
        </div>
      </CardHeader>
      <CardContent className="relative z-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Response TAT Chart */}
          <div className="text-center">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Response TAT</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={responseTATChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tick={{ fill: '#374151' }}
                  />
                  <YAxis
                    fontSize={12}
                    tick={{ fill: '#374151' }}
                    allowDecimals={false}
                    domain={[0, Math.max(3, Math.ceil(responseTotalValue * 0.6))]}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const total = data.achieved + data.breached;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-semibold text-gray-800 mb-2">{data.name}</p>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center gap-4">
                                <span className="font-medium" style={{ color: CHART_COLORS.openAchieved }}>Achieved:</span>
                                <span className="text-gray-700">{data.achieved}</span>
                              </div>
                              <div className="flex justify-between items-center gap-4">
                                <span className="font-medium" style={{ color: CHART_COLORS.openBreached }}>Breached:</span>
                                <span className="text-gray-700">{data.breached}</span>
                              </div>
                              <div className="pt-1 border-t border-gray-200">
                                <div className="flex justify-between items-center font-semibold gap-4">
                                  <span>Total:</span>
                                  <span>{total}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="achieved" stackId="a" fill={CHART_COLORS.openAchieved} name="Achieved" />
                  <Bar dataKey="breached" stackId="a" fill={CHART_COLORS.openBreached} name="Breached" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resolution TAT Chart */}
          <div className="text-center">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Resolution TAT</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={resolutionTATChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tick={{ fill: '#374151' }}
                  />
                  <YAxis
                    fontSize={12}
                    tick={{ fill: '#374151' }}
                    allowDecimals={false}
                    domain={[0, Math.max(3, Math.ceil(resolutionTotalValue * 0.6))]}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const total = data.achieved + data.breached;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-semibold text-gray-800 mb-2">{data.name}</p>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center gap-4">
                                <span className="font-medium" style={{ color: CHART_COLORS.openAchieved }}>Achieved:</span>
                                <span className="text-gray-700">{data.achieved}</span>
                              </div>
                              <div className="flex justify-between items-center gap-4">
                                <span className="font-medium" style={{ color: CHART_COLORS.openBreached }}>Breached:</span>
                                <span className="text-gray-700">{data.breached}</span>
                              </div>
                              <div className="pt-1 border-t border-gray-200">
                                <div className="flex justify-between items-center font-semibold gap-4">
                                  <span>Total:</span>
                                  <span>{total}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="achieved" stackId="a" fill={CHART_COLORS.openAchieved} name="Achieved" />
                  <Bar dataKey="breached" stackId="a" fill={CHART_COLORS.openBreached} name="Breached" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-1 mt-4 px-2">
          <div className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: CHART_COLORS.openAchieved }}
            />
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">Achieved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: CHART_COLORS.openBreached }}
            />
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">Breached</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};