import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface VisitorAnalyticsCardProps {
  title: string;
  data: any;
  type: 'purposeWise' | 'hourlyTrend' | 'statusWise' | 'locationWise';
  className?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export const VisitorAnalyticsCard: React.FC<VisitorAnalyticsCardProps> = ({
  title,
  data,
  type,
  className = "",
  dateRange
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!dateRange) return;
    
    setIsDownloading(true);
    try {
      const { visitorDownloadAPI } = await import('@/services/visitorDownloadAPI');
      
      switch (type) {
        case 'purposeWise':
          await visitorDownloadAPI.downloadComparisonData(dateRange.startDate, dateRange.endDate);
          break;
        case 'statusWise':
          await visitorDownloadAPI.downloadTotalVisitorsData(dateRange.startDate, dateRange.endDate);
          break;
        case 'hourlyTrend':
          await visitorDownloadAPI.downloadExpectedVisitorsData(dateRange.startDate, dateRange.endDate);
          break;
        case 'locationWise':
          await visitorDownloadAPI.downloadUnexpectedVisitorsData(dateRange.startDate, dateRange.endDate);
          break;
        default:
          console.log(`Download not implemented for ${type} type`);
      }
    } catch (error) {
      console.error('Error downloading data:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'purposeWise':
        const purposeData = data || [
          { purpose: 'Meeting', count: 45, percentage: 45 },
          { purpose: 'Personal', count: 20, percentage: 20 },
          { purpose: 'Delivery', count: 15, percentage: 15 },
          { purpose: 'Maintenance', count: 12, percentage: 12 },
          { purpose: 'Others', count: 8, percentage: 8 }
        ];

        return (
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={300} className="min-w-[400px]">
              {purposeData.length > 0 ? (
                <BarChart 
                  data={purposeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                  <XAxis 
                    dataKey="purpose" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                    tick={{
                      fill: '#374151',
                      fontSize: 10
                    }} 
                    className="text-xs" 
                  />
                  <YAxis tick={{
                    fill: '#374151',
                    fontSize: 10
                  }} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-semibold text-gray-800 mb-2">{label}</p>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-[#C72030] font-medium">Count:</span>
                                <span className="text-gray-700">{payload[0]?.value || 0}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[#C72030] font-medium">Percentage:</span>
                                <span className="text-gray-700">{payload[0]?.payload?.percentage || 0}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#C72030" name="Count" />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center py-8 text-gray-500">
                    No purpose-wise data available for the selected date range
                  </div>
                </div>
              )}
            </ResponsiveContainer>
          </div>
        );

      case 'hourlyTrend':
        const hourlyData = data || [
          { hour: '9:00', visitors: 15 },
          { hour: '10:00', visitors: 25 },
          { hour: '11:00', visitors: 30 },
          { hour: '12:00', visitors: 20 },
          { hour: '13:00', visitors: 10 },
          { hour: '14:00', visitors: 35 },
          { hour: '15:00', visitors: 28 },
          { hour: '16:00', visitors: 22 },
          { hour: '17:00', visitors: 18 }
        ];

        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" fontSize={10} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="visitors" fill="#00B4D8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'statusWise':
        const statusData = data || [
          { name: 'Approved', value: 85, color: '#22C55E' },
          { name: 'Pending', value: 10, color: '#F59E0B' },
          { name: 'Rejected', value: 5, color: '#EF4444' }
        ];

        const statusTotal = statusData.reduce((sum, item) => sum + item.value, 0);

        return (
          <div className="relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ value, cx, cy, midAngle, innerRadius, outerRadius }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="16"
                        fontWeight="bold"
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth="0.5"
                      >
                        {value}
                      </text>
                    );
                  }}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700">Total: {statusTotal}</div>
              </div>
            </div>
            <div className="absolute -bottom-2 left-0 right-0 flex justify-center gap-6">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // locationWise case removed

      default:
        return <div>No data available</div>;
    }
  };

  return (
    <Card className={`shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg font-bold text-[#C72030]">{title}</CardTitle>
          <Download
            className="w-4 h-4 sm:w-4 sm:h-4 cursor-pointer text-[#C72030] hover:text-[#A01829] transition-colors"
            onClick={handleDownload}
          />
        </div>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default VisitorAnalyticsCard;