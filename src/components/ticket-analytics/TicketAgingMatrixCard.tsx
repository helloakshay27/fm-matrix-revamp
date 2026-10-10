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
        <div className="ticket-analytics-table-clip">
        <div className="overflow-x-auto">
          <table className="ticket-analytics-table ticket-aging-matrix-table">
            <thead>
              <tr>
                <th rowSpan={2} className="ticket-analytics-table-header text-left">
                  Priority
                </th>
                <th colSpan={5} className="ticket-analytics-table-header">
                  No. of Days
                </th>
              </tr>
              <tr>
                {['0-10', '11-20', '21-30', '31-40', '41-50'].map(label => (
                  <th key={label} className="ticket-analytics-table-header">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agingMatrixData.map((row, index) => (
                <tr key={index} className="ticket-analytics-table-row">
                  <td className="ticket-analytics-table-cell text-left font-medium">{row.priority}</td>
                  <td className="ticket-analytics-table-cell">{row.T1}</td>
                  <td className="ticket-analytics-table-cell">{row.T2}</td>
                  <td className="ticket-analytics-table-cell">{row.T3}</td>
                  <td className="ticket-analytics-table-cell">{row.T4}</td>
                  <td className="ticket-analytics-table-cell">{row.T5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2">
        <div className="ticket-aging-average">
          <div className="ticket-aging-average-value">
            {data?.average_days || 0} Days
          </div>
          <div className="ticket-aging-average-label">
            Average Time Taken To Resolve A Ticket
          </div>
        </div>
      </div>
    </div>
  );
};
