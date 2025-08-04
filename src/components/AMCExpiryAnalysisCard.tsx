import React from 'react';
import { Download, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
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
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6 p-3 sm:p-6 pb-0">
        <h3 className="text-base sm:text-lg font-bold text-[#C72030]">AMC Expiry Analysis</h3>
        {onDownload && (
          <Download
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-[#C72030] hover:text-[#A01828]"
            onClick={handleDownload}
          />
        )}
      </div>
      
      <div className="flex-1 overflow-auto p-3 sm:p-6 pt-0">
        {data && data.length > 0 ? (
          <div className="space-y-6">
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 shadow-sm">
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-sm font-medium text-red-700">Expired</span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {data.find(item => item.period === 'Expired')?.expiredCount || 0}
                </div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 shadow-sm">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-orange-700">30 Days</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {data.find(item => item.period === 'Next 30 Days')?.expiringCount || 0}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-700">60 Days</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {data.find(item => item.period === 'Next 60 Days')?.expiringCount || 0}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-700">90 Days</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {data.find(item => item.period === 'Next 90 Days')?.expiringCount || 0}
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">AMC Expiry Trend</h4>
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Expiry Forecast</span>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={data.filter(item => item.period !== 'Expired')}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="expiringGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="period" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    labelStyle={{ color: '#374151', fontWeight: 'semibold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expiringCount" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    fill="url(#expiringGradient)"
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

            {/* Summary Insights */}
         
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No AMC expiry analysis data available for the selected date range
          </div>
        )}
      </div>
    </div>
  );
};
