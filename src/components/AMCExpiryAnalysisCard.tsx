import React from 'react';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface AMCExpiryAnalysisCardProps {
  data: Array<{
    period: string;
    expiringCount: number;
    expiredCount: number;
  }> | null;
  className?: string;
  onDownload?: () => Promise<void>;
}

export const AMCExpiryAnalysisCard: React.FC<AMCExpiryAnalysisCardProps> = ({ data, className, onDownload }) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    if (onDownload) {
      try {
        await onDownload();
        toast({
          title: "Success",
          description: "AMC expiry analysis data downloaded successfully"
        });
      } catch (error) {
        console.error('Error downloading AMC expiry analysis data:', error);
        toast({
          title: "Error", 
          description: "Failed to download AMC expiry analysis data",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-[#C72030]">AMC Expiry Analysis</h3>
        {onDownload && (
          <Download
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-[#C72030] hover:text-[#A01828]"
            onClick={handleDownload}
          />
        )}
      </div>
      
      {data && data.length > 0 ? (
        <div className="space-y-6">
          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                <XAxis 
                  dataKey="period" 
                  tick={{ fill: '#374151', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: '#374151', fontSize: 12 }}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-semibold text-gray-800 mb-2">{label}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-yellow-600 font-medium">Expiring:</span>
                              <span className="text-gray-700">{payload[0]?.value || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-red-600 font-medium">Expired:</span>
                              <span className="text-gray-700">{payload[1]?.value || 0}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="expiringCount" fill="#f59e0b" name="Expiring" />
                <Bar dataKey="expiredCount" fill="#ef4444" name="Expired" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">
                {data.reduce((sum, item) => sum + item.expiringCount, 0)}
              </div>
              <div className="text-sm text-yellow-700 font-medium">Total Expiring</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">
                {data.reduce((sum, item) => sum + item.expiredCount, 0)}
              </div>
              <div className="text-sm text-red-700 font-medium">Total Expired</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">
                {data.reduce((sum, item) => sum + item.expiringCount + item.expiredCount, 0)}
              </div>
              <div className="text-sm text-orange-700 font-medium">Attention Required</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No AMC expiry analysis data available for the selected date range
        </div>
      )}
    </div>
  );
};
