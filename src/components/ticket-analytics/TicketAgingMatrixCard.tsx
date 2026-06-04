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
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr style={{ backgroundColor: '#D97655' }}>
                    <th className="border border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm font-medium text-white">
                      Priority
                    </th>
                    <th colSpan={5} className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-white">
                      No. of Days
                    </th>
                  </tr>
                  <tr style={{ backgroundColor: '#D97655' }}>
                    <th className="border border-gray-300 p-2 sm:p-3"></th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-white">
                      0-10
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-white">
                      11-20
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-white">
                      21-30
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-white">
                      31-40
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-white">
                      41-50
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {agingMatrixData.map((row, index) => (
                    <tr key={index} className="bg-white">
                      <td className="border border-gray-300 p-2 sm:p-3 font-medium text-black text-xs sm:text-sm">
                        {row.priority}
                      </td>
                      <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">
                        {row.T1}
                      </td>
                      <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">
                        {row.T2}
                      </td>
                      <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">
                        {row.T3}
                      </td>
                      <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">
                        {row.T4}
                      </td>
                      <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">
                        {row.T5}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
