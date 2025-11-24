import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { UnitCategorywiseData } from '@/services/ticketAnalyticsAPI';
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

interface UnitCategoryWiseCardProps {
  data: UnitCategorywiseData | null;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  className?: string;
}

export const UnitCategoryWiseCard: React.FC<UnitCategoryWiseCardProps> = ({
  data,
  dateRange,
  className = ""
}) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      await ticketAnalyticsDownloadAPI.downloadUnitCategorywiseData(dateRange.startDate, dateRange.endDate);
      toast({
        title: "Success",
        description: "Unit category-wise data downloaded successfully"
      });
    } catch (error) {
      console.error('Error downloading unit category-wise data:', error);
      toast({
        title: "Error",
        description: "Failed to download unit category-wise data",
        variant: "destructive"
      });
    }
  };

  const chartData = data?.response ? data.response.tickets_category.map((category, index) => ({
    name: category,
    open: data.response.open_tickets[index] || 0,
    closed: data.response.closed_tickets[index] || 0,
    total: data.response.total_tickets[index] || 0
  })) : [];

  return (
    <Card className={`shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg font-bold text-[#C72030]">
            Unit Category-wise Tickets
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
          <ResponsiveContainer width="100%" height={300} className="min-w-[400px]">
            {chartData.length > 0 ? (
              <BarChart 
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                  tick={{
                    fill: '#374151',
                    fontSize: 10
                  }} 
                  className="text-xs" 
                />
                <YAxis tick={{
                  fill: '#374151',
                  fontSize: 10
                }} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const openValue = payload.find(p => p.dataKey === 'open')?.value || 0;
                      const closedValue = payload.find(p => p.dataKey === 'closed')?.value || 0;
                      const totalValue = Number(openValue) + Number(closedValue);
                      
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-semibold text-gray-800 mb-2">{label}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-yellow-600 font-medium">Open:</span>
                              <span className="text-gray-700">{openValue}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-green-600 font-medium">Closed:</span>
                              <span className="text-gray-700">{closedValue}</span>
                            </div>
                            <div className="pt-1 border-t border-gray-200">
                              <div className="flex justify-between items-center font-semibold">
                                <span>Total:</span>
                                <span>{totalValue}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="open" fill={CHART_COLORS.primary} name="Open" />
                <Bar dataKey="closed" fill={CHART_COLORS.secondary} name="Closed" />
              </BarChart>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center py-8 text-gray-500">
                  No unit category-wise data available for the selected date range
                </div>
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
