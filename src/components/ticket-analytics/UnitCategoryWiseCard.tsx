import React from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { UnitCategorywiseData } from '@/services/ticketAnalyticsAPI';
import { ticketAnalyticsDownloadAPI } from '@/services/ticketAnalyticsDownloadAPI';
import { useToast } from '@/hooks/use-toast';


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
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Unit Category-wise Tickets
        </h3>
        <Download
          data-no-drag="true"
          className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors z-50"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDownload(); }}
          onPointerDown={(e) => { e.stopPropagation(); }}
          onMouseDown={(e) => { e.stopPropagation(); }}
          style={{ pointerEvents: 'auto' }}
        />
      </div>
      <div className="p-5">
        <div className="w-full overflow-x-auto">
          <ResponsiveContainer width="100%" height={280} className="min-w-[380px]">
            {chartData.length > 0 ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" angle={-35} textAnchor="end" height={65} tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Bar dataKey="open" fill="#E39090" name="Open" radius={[4, 4, 0, 0]} />
                <Bar dataKey="closed" fill="#76CDC1" name="Closed" radius={[4, 4, 0, 0]} />
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
      </div>
    </div>
  );
};
