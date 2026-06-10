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

  const thCls = 'px-3 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header';
  const tdCls = 'px-3 py-2.5 text-center text-sm border-b border-gray-100';

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
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

      <div className="px-4 pt-4 pb-2">
        <div className="rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th rowSpan={2} className={`${thCls} text-left`} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>
                  Priority
                </th>
                <th colSpan={5} className={thCls} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>
                  No. of Days
                </th>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.4)' }}>
                {['0-10', '11-20', '21-30', '31-40', '41-50'].map(label => (
                  <th key={label} className={thCls} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agingMatrixData.map((row, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#F6F4EE' }}>
                  <td className={`${tdCls} text-left font-medium text-gray-800`}>{row.priority}</td>
                  <td className={`${tdCls} text-gray-700`}>{row.T1}</td>
                  <td className={`${tdCls} text-gray-700`}>{row.T2}</td>
                  <td className={`${tdCls} text-gray-700`}>{row.T3}</td>
                  <td className={`${tdCls} text-gray-700`}>{row.T4}</td>
                  <td className={`${tdCls} text-gray-700`}>{row.T5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2">
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
  );
};
