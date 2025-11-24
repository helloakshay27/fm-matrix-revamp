import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { TicketCategoryData } from '@/services/ticketAnalyticsAPI';
import { ticketAnalyticsDownloadAPI } from '@/services/ticketAnalyticsDownloadAPI';
import { useToast } from '@/hooks/use-toast';

// Color palette with lighter shades
const CHART_COLORS = {
  proactiveOpen: '#8B7355',      // Darker brown for Proactive Open
  proactiveClosed: '#C4B99D',    // Original primary for Proactive Closed
  reactiveOpen: '#B8AFA0',       // Medium shade for Reactive Open
  reactiveClosed: '#DAD6CA',     // Original secondary for Reactive Closed
};

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
          <CardTitle className="text-base sm:text-lg font-bold text-[#1A1A1A]">
            Category Wise Proactive / Reactives
          </CardTitle>
          <Download
            data-no-drag="true"
            className="w-5 h-5 cursor-pointer text-[#C72030] hover:text-[#A01829] transition-colors z-50"
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
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="space-y-4">
            {chartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
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
                      allowDecimals={false}
                      domain={[0, data && data.length > 0 ? Math.max(3, Math.ceil(Math.max(...chartData.map(d => d.proactiveTotal || 0, ...chartData.map(d => d.reactiveTotal || 0))) * 1.2)) : 3]}
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
                                  <span className="font-medium" style={{ color: CHART_COLORS.proactiveOpen }}>Proactive Open:</span>
                                  <span className="text-gray-700">{data.proactiveOpen}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-medium" style={{ color: CHART_COLORS.proactiveClosed }}>Proactive Closed:</span>
                                  <span className="text-gray-700">{data.proactiveClosed}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-medium" style={{ color: CHART_COLORS.reactiveOpen }}>Reactive Open:</span>
                                  <span className="text-gray-700">{data.reactiveOpen}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-medium" style={{ color: CHART_COLORS.reactiveClosed }}>Reactive Closed:</span>
                                  <span className="text-gray-700">{data.reactiveClosed}</span>
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
                    <Bar dataKey="proactiveOpen" stackId="proactive" fill={CHART_COLORS.proactiveOpen} name="Proactive Open" />
                    <Bar dataKey="proactiveClosed" stackId="proactive" fill={CHART_COLORS.proactiveClosed} name="Proactive Closed" />
                    <Bar dataKey="reactiveOpen" stackId="reactive" fill={CHART_COLORS.reactiveOpen} name="Reactive Open" />
                    <Bar dataKey="reactiveClosed" stackId="reactive" fill={CHART_COLORS.reactiveClosed} name="Reactive Closed" />
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
