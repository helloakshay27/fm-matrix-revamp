import React, { useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { ticketAnalyticsDownloadAPI } from '@/services/ticketAnalyticsDownloadAPI';
import { useToast } from '@/hooks/use-toast';

const TICKET_ANALYTICS_SERIES_COUNT = 8;

interface ResolutionTATData {
  success: number;
  message: string;
  response: {
    categories: string[];
    breached: number[];
    achieved: number[];
    total: number[];
    percentage_breached: number[];
    percentage_achieved: number[];
  };
  info: string;
}

interface ResolutionTATCardProps {
  data: ResolutionTATData | null;
  className?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export const ResolutionTATCard: React.FC<ResolutionTATCardProps> = ({ data, className = "", dateRange }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!dateRange) return;
    
    setIsDownloading(true);
    try {
      await ticketAnalyticsDownloadAPI.downloadResolutionTATData(dateRange.startDate, dateRange.endDate);
      toast({
        title: "Success",
        description: "Resolution TAT data downloaded successfully"
      });
    } catch (error) {
      console.error('Error downloading resolution TAT data:', error);
      toast({
        title: "Error",
        description: "Failed to download resolution TAT data",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  if (!data || !data.response) {
    return (
      <div className={`bg-white rounded-xl shadow-sm ${className}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>Resolution TAT Report</h3>
          <Download
            data-no-drag="true"
            className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors z-50"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDownload(); }}
            onPointerDown={(e) => { e.stopPropagation(); }}
            onMouseDown={(e) => { e.stopPropagation(); }}
            style={{ pointerEvents: 'auto' }}
          />
        </div>
        <div className="p-5 flex items-center justify-center h-48">
          <p className="text-gray-400 text-sm">No data available</p>
        </div>
      </div>
    );
  }

  const chartData = data.response.categories.map((category, index) => ({
    category: category || 'Unknown',
    breached: data.response.breached[index] || 0,
    achieved: data.response.achieved[index] || 0,
    total: data.response.total[index] || 0,
    percentage_breached: data.response.percentage_breached[index] || 0,
    percentage_achieved: data.response.percentage_achieved[index] || 0,
    color: `var(--ticket-analytics-series-${(index % TICKET_ANALYTICS_SERIES_COUNT) + 1})`,
  })).filter(item => item.total > 0);

  return (
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>Resolution TAT Report</h3>
        <Download
          data-no-drag="true"
          className={`w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors z-50 ${isDownloading ? 'opacity-50' : ''}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDownload(); }}
          onPointerDown={(e) => { e.stopPropagation(); }}
          onMouseDown={(e) => { e.stopPropagation(); }}
          style={{ pointerEvents: 'auto' }}
        />
      </div>
      <div className="p-5">
        {chartData.length > 0 ? (
          <>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={280} className="min-w-[340px]">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 55 }} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="category"
                    angle={-35}
                    textAnchor="end"
                    height={70}
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value, name) => {
                      const key = String(name || '').toLowerCase();
                      return [value, key.includes('breach') ? 'Breached' : 'Achieved'];
                    }}
                    labelFormatter={(label) => `Category: ${label}`}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                  />
                  <Bar dataKey="total" name="Total" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Summary Table */}
            <div className="mt-4">
              <div className="ticket-analytics-table-clip">
              <div className="overflow-x-auto">
                <table className="ticket-analytics-table ticket-resolution-tat-table">
                  <thead>
                    <tr>
                      {['Category', 'Breached', 'Achieved', 'Total', '% Breached', '% Achieved'].map(label => (
                        <th key={label} className="ticket-analytics-table-header text-center">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((item, index) => (
                      <tr key={index} className="ticket-analytics-table-row">
                        <td className="ticket-analytics-table-cell text-left font-medium">{item.category}</td>
                        <td className="ticket-analytics-table-cell text-left text-red-600">{item.breached}</td>
                        <td className="ticket-analytics-table-cell text-left text-green-600">{item.achieved}</td>
                        <td className="ticket-analytics-table-cell text-left font-medium">{item.total}</td>
                        <td className="ticket-analytics-table-cell text-left text-red-600">{item.percentage_breached.toFixed(1)}%</td>
                        <td className="ticket-analytics-table-cell text-left text-green-600">{item.percentage_achieved.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500">No resolution TAT data available</p>
          </div>
        )}
      </div>
    </div>
  );
};