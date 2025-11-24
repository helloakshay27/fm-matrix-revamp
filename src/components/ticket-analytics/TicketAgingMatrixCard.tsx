import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className={`shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg font-bold text-[#C72030]">
            Tickets Ageing Matrix
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
        <div className="space-y-4 sm:space-y-6">
          {/* Table - Horizontally scrollable on mobile */}
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="min-w-[500px] px-3 sm:px-0">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr style={{ backgroundColor: '#EDE4D8' }}>
                    <th className="border border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm font-medium text-black">
                      Priority
                    </th>
                    <th colSpan={5} className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">
                      No. of Days
                    </th>
                  </tr>
                  <tr style={{ backgroundColor: '#EDE4D8' }}>
                    <th className="border border-gray-300 p-2 sm:p-3"></th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">
                      0-10
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">
                      11-20
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">
                      21-30
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">
                      31-40
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">
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
            <div className="rounded-lg p-4 sm:p-8 text-center" style={{ backgroundColor: '#EDE4D8' }}>
              <div className="text-2xl sm:text-4xl font-bold text-black mb-1 sm:mb-2">
                {data?.average_days || 0} Days
              </div>
              <div className="text-sm sm:text-base text-black">
                Average Time Taken To Resolve A Ticket
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
