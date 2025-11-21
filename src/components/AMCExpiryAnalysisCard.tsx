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
  colorPalette?: {
    primary: string;
    secondary: string;
    tertiary: string;
    primaryLight: string;
    secondaryLight: string;
    tertiaryLight: string;
  };
  headerClassName?: string;
}

export const AMCExpiryAnalysisCard: React.FC<AMCExpiryAnalysisCardProps> = ({ data, className, onDownload, colorPalette, headerClassName }) => {
  const { toast } = useToast();

  const palette = colorPalette || {
    primary: '#C4B99D',
    secondary: '#DAD6CA',
    tertiary: '#D5DBDB',
    primaryLight: '#DDD4C4',
    secondaryLight: '#E8E5DD',
    tertiaryLight: '#E5E9E9',
  };

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
        <h3 className={`text-base sm:text-lg font-bold ${headerClassName || 'text-[#1A1A1A]'}`}>AMC Expiry Analysis</h3>
        {onDownload && (
          <Download
            className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer ${headerClassName || 'text-[#1A1A1A]'} hover:opacity-80`}
            onClick={handleDownload}
          />
        )}
      </div>
      <div className="flex-1 overflow-auto p-3 sm:p-6 pt-0">
        {data && data.length > 0 ? (
          <div className="space-y-6">
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 rounded-xl border shadow-sm" style={{ background: palette.tertiary, borderColor: palette.tertiaryLight }}>
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle className="w-5 h-5 mr-2" style={{ color: palette.tertiary }} />
                  <span className="text-sm font-medium text-[#1A1A1A]">Expired</span>
                </div>
                <div className="text-2xl font-bold text-[#1A1A1A]">
                  {data.find(item => item.period === 'Expired')?.expiredCount || 0}
                </div>
              </div>
              <div className="text-center p-4 rounded-xl border shadow-sm" style={{ background: palette.primaryLight, borderColor: palette.secondaryLight }}>
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 mr-2" style={{ color: palette.primary }} />
                  <span className="text-sm font-medium text-[#1A1A1A]">30 Days</span>
                </div>
                <div className="text-2xl font-bold text-[#1A1A1A]">
                  {data.find(item => item.period === 'Next 30 Days')?.expiringCount || 0}
                </div>
              </div>
              <div className="text-center p-4 rounded-xl border shadow-sm" style={{ background: palette.secondaryLight, borderColor: palette.tertiaryLight }}>
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 mr-2" style={{ color: palette.secondary }} />
                  <span className="text-sm font-medium text-[#1A1A1A]">60 Days</span>
                </div>
                <div className="text-2xl font-bold text-[#1A1A1A]">
                  {data.find(item => item.period === 'Next 60 Days')?.expiringCount || 0}
                </div>
              </div>
              <div className="text-center p-4 rounded-xl border shadow-sm" style={{ background: palette.primary, borderColor: palette.primaryLight }}>
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 mr-2" style={{ color: palette.primaryLight }} />
                  <span className="text-sm font-medium text-[#1A1A1A]">90 Days</span>
                </div>
                <div className="text-2xl font-bold text-[#1A1A1A]">
                  {data.find(item => item.period === 'Next 90 Days')?.expiringCount || 0}
                </div>
              </div>
            </div>
            {/* Trend Chart */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-[#1A1A1A]">AMC Expiry Trend</h4>
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-[#1A1A1A]">Expiry Forecast</span>
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
                        <stop offset="5%" stopColor={palette.primary} stopOpacity={0.35}/>
                        <stop offset="95%" stopColor={palette.primary} stopOpacity={0.05}/>
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
                      stroke={palette.primary} 
                      strokeWidth={3}
                      fill="url(#expiringGradient)"
                      dot={{ fill: palette.primary, strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, fill: palette.primary, stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
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
