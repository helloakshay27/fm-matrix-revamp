import React, { useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { ticketAnalyticsDownloadAPI } from '@/services/ticketAnalyticsDownloadAPI';
import { useToast } from '@/hooks/use-toast';

// Per-bar colors per guideline
const BAR_COLORS = ['#9EC8BA', '#8E7BE0', '#DA7756', '#798C5E', '#EDC488'];
const CHART_COLORS = {
  primary: '#9EC8BA',
  secondary: '#DA7756',
  tertiary: '#8E7BE0',
  primaryLight: '#EDC488',
  secondaryLight: '#798C5E',
  tertiaryLight: '#CDCAF5',
};

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
    color: BAR_COLORS[index % BAR_COLORS.length],
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
            <div className="mt-4 overflow-x-auto">
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header text-left" style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Category</th>
                      <th className="px-4 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header" style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Breached</th>
                      <th className="px-4 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header" style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Achieved</th>
                      <th className="px-4 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header" style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Total</th>
                      <th className="px-4 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header" style={{ backgroundColor: '#D97655', color: '#ffffff' }}>% Breached</th>
                      <th className="px-4 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header" style={{ backgroundColor: '#D97655', color: '#ffffff' }}>% Achieved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((item, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#F6F4EE' }}>
                        <td className="px-4 py-3 text-sm border-b border-gray-100 text-left font-medium text-gray-800">{item.category}</td>
                        <td className="px-4 py-3 text-sm border-b border-gray-100 text-center text-red-600">{item.breached}</td>
                        <td className="px-4 py-3 text-sm border-b border-gray-100 text-center text-green-600">{item.achieved}</td>
                        <td className="px-4 py-3 text-sm border-b border-gray-100 text-center font-medium">{item.total}</td>
                        <td className="px-4 py-3 text-sm border-b border-gray-100 text-center text-red-600">{item.percentage_breached.toFixed(1)}%</td>
                        <td className="px-4 py-3 text-sm border-b border-gray-100 text-center text-green-600">{item.percentage_achieved.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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