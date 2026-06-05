import React from 'react';

import { Download } from 'lucide-react';
import { TicketAgingMatrix } from '@/services/ticketAnalyticsAPI';
import { ticketAnalyticsDownloadAPI } from '@/services/ticketAnalyticsDownloadAPI';
import { useToast } from '@/hooks/use-toast';

interface TicketAgingMatrixCardProps {
  data: TicketAgingMatrix | null;
  agingMatrixData: Array<{
    priority: string;
    T1: number;
    T2: number;
    T3: number;
    T4: number;
    T5: number;
  }>;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  className?: string;
}

export const TicketAgingMatrixCard: React.FC<TicketAgingMatrixCardProps> = ({
  data,
  agingMatrixData,
  dateRange,
  className = ""
}) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      await ticketAnalyticsDownloadAPI.downloadTicketAgingMatrixData(dateRange.startDate, dateRange.endDate);
      toast({
        title: "Success",
        description: "Ticket aging matrix data downloaded successfully"
      });
    } catch (error) {
      console.error('Error downloading aging matrix data:', error);
      toast({
        title: "Error",
        description: "Failed to download aging matrix data",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Tickets Ageing Matrix
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
        <div className="space-y-4 sm:space-y-6">
          {/* Table - Horizontally scrollable on mobile */}
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="min-w-[500px] px-3 sm:px-0">
              <div className="rounded-xl overflow-hidden border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-3 py-2.5 text-left text-xs sm:text-sm font-semibold text-white analytics-header" style={{ backgroundColor: '#D97655' }}>
                      Priority
                    </th>
                    <th colSpan={5} className="px-3 py-2.5 text-center text-xs sm:text-sm font-semibold text-white analytics-header" style={{ backgroundColor: '#D97655' }}>
                      No. of Days
                    </th>
                  </tr>
                  <tr>
                    <th className="px-3 py-2 analytics-header" style={{ backgroundColor: '#D97655', borderTop: '1px solid rgba(255,255,255,0.2)' }}></th>
                    {['0-10', '11-20', '21-30', '31-40', '41-50'].map(label => (
                      <th key={label} className="px-3 py-2 text-center text-xs sm:text-sm font-semibold text-white analytics-header" style={{ backgroundColor: '#D97655', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agingMatrixData.map((row, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#F6F4EE' }}>
                      <td className="px-3 py-2.5 font-medium text-gray-800 text-xs sm:text-sm border-b border-gray-100">
                        {row.priority}
                      </td>
                      <td className="px-3 py-2.5 text-center text-gray-700 text-xs sm:text-sm border-b border-gray-100">{row.T1}</td>
                      <td className="px-3 py-2.5 text-center text-gray-700 text-xs sm:text-sm border-b border-gray-100">{row.T2}</td>
                      <td className="px-3 py-2.5 text-center text-gray-700 text-xs sm:text-sm border-b border-gray-100">{row.T3}</td>
                      <td className="px-3 py-2.5 text-center text-gray-700 text-xs sm:text-sm border-b border-gray-100">{row.T4}</td>
                      <td className="px-3 py-2.5 text-center text-gray-700 text-xs sm:text-sm border-b border-gray-100">{row.T5}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>

          {/* Summary Box - Full Width Below Table */}
          <div className="w-full">
            <div className="rounded-lg p-4 sm:p-8 text-center" style={{ backgroundColor: '#f5e8e4' }}>
              <div className="text-2xl sm:text-4xl font-bold text-black mb-1 sm:mb-2">
                {data?.average_days || 0} Days
              </div>
              <div className="text-sm sm:text-base text-black">
                Average Time Taken To Resolve A Ticket
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
