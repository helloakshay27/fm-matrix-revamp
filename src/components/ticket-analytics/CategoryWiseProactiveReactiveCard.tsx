import React from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { TicketCategoryData } from '@/services/ticketAnalyticsAPI';
import { ticketAnalyticsDownloadAPI } from '@/services/ticketAnalyticsDownloadAPI';
import { useToast } from '@/hooks/use-toast';

// Color palette
const CHART_COLORS = {
  proactiveOpen: '#9EC8BA',
  proactiveClosed: '#DA7756',
  reactiveOpen: '#8E7BE0',
  reactiveClosed: '#798C5E',
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
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Category Wise Proactive / Reactive
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
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300} className="min-w-[380px]">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 55 }} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="category" angle={-35} textAnchor="end" height={65} tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Bar dataKey="proactiveOpen" stackId="proactive" fill={CHART_COLORS.proactiveOpen} name="Proactive Open" radius={[0, 0, 0, 0]} />
                <Bar dataKey="proactiveClosed" stackId="proactive" fill={CHART_COLORS.proactiveClosed} name="Proactive Closed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reactiveOpen" stackId="reactive" fill={CHART_COLORS.reactiveOpen} name="Reactive Open" radius={[0, 0, 0, 0]} />
                <Bar dataKey="reactiveClosed" stackId="reactive" fill={CHART_COLORS.reactiveClosed} name="Reactive Closed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              No category-wise data available for the selected date range
            </div>
          )}
        </div>
        {/* Legend */}
        {chartData.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3 justify-center">
            {[
              { label: 'Proactive Open', color: CHART_COLORS.proactiveOpen },
              { label: 'Proactive Closed', color: CHART_COLORS.proactiveClosed },
              { label: 'Reactive Open', color: CHART_COLORS.reactiveOpen },
              { label: 'Reactive Closed', color: CHART_COLORS.reactiveClosed },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
