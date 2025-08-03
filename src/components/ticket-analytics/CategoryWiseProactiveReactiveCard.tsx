import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { TicketCategoryData } from '@/services/ticketAnalyticsAPI';
import { ticketAnalyticsDownloadAPI } from '@/services/ticketAnalyticsDownloadAPI';
import { useToast } from '@/hooks/use-toast';

interface CategoryWiseProactiveReactiveCardProps {
  data: TicketCategoryData[];
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  className?: string;
}

export const CategoryWiseProactiveReactiveCard: React.FC<CategoryWiseProactiveReactiveCardProps> = ({
  data,
  dateRange,
  className = ""
}) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      await ticketAnalyticsDownloadAPI.downloadProactiveCategorywiseData(dateRange.startDate, dateRange.endDate);
      toast({
        title: "Success",
        description: "Category-wise proactive/reactive data downloaded successfully"
      });
    } catch (error) {
      console.error('Error downloading category-wise proactive/reactive data:', error);
      toast({
        title: "Error",
        description: "Failed to download category-wise data",
        variant: "destructive"
      });
    }
  };

  const chartData = data && data.length > 0 ? data.slice(0, 10).map(categoryData => ({
    category: categoryData.category || 'Unknown',
    proactiveOpen: categoryData.proactive?.Open || 0,
    proactiveClosed: categoryData.proactive?.Closed || 0,
    reactiveOpen: categoryData.reactive?.Open || 0,
    reactiveClosed: categoryData.reactive?.Closed || 0,
    proactiveTotal: (categoryData.proactive?.Open || 0) + (categoryData.proactive?.Closed || 0),
    reactiveTotal: (categoryData.reactive?.Open || 0) + (categoryData.reactive?.Closed || 0)
  })) : [];

  return (
    <Card className={`shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg font-bold text-[#C72030]">
            Category Wise ProActive / Reactives
          </CardTitle>
          <Download
            className="w-4 h-4 sm:w-4 sm:h-4 cursor-pointer text-[#C72030] hover:text-[#A01829] transition-colors"
            onClick={handleDownload}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="space-y-4">
            {chartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                    <XAxis
                      dataKey="category"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={10}
                      tick={{ fill: '#374151' }}
                    />
                    <YAxis
                      fontSize={12}
                      tick={{ fill: '#374151' }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-800 mb-2">{label}</p>
                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-blue-600 font-medium">Proactive:</span>
                                  <span className="text-gray-700">
                                    Open: {data.proactiveOpen}, Closed: {data.proactiveClosed}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-red-600 font-medium">Reactive:</span>
                                  <span className="text-gray-700">
                                    Open: {data.reactiveOpen}, Closed: {data.reactiveClosed}
                                  </span>
                                </div>
                                <div className="pt-1 border-t border-gray-200">
                                  <div className="flex justify-between items-center font-semibold">
                                    <span>Total:</span>
                                    <span>{data.proactiveTotal + data.reactiveTotal}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="proactiveTotal" fill="#3b82f6" name="Proactive" />
                    <Bar dataKey="reactiveTotal" fill="#ef4444" name="Reactive" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No category-wise data available for the selected date range
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
