import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { visitorHostWiseAPI } from '@/services/visitorHostWiseAPI';

interface VisitorAnalyticsCardProps {
  title: string;
  data: any;
  type: 'purposeWise' | 'statusWise' | 'locationWise';
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
  const [hostWiseData, setHostWiseData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiData, setHasApiData] = useState(false);

  useEffect(() => {
    if (type === 'purposeWise' && dateRange) {
      fetchHostWiseData();
    }
  }, [type, dateRange]);

  const fetchHostWiseData = async () => {
    if (!dateRange) return;
    
    setIsLoading(true);
    try {
      const fromDate = `${dateRange.startDate.getDate()}/${dateRange.startDate.getMonth() + 1}/${dateRange.startDate.getFullYear()}`;
      const toDate = `${dateRange.endDate.getDate()}/${dateRange.endDate.getMonth() + 1}/${dateRange.endDate.getFullYear()}`;
      
      const response = await visitorHostWiseAPI.getHostWiseVisitors(fromDate, toDate);
      
      // Transform the API response to chart data
      const chartData = Object.entries(response.host_wise_guest_count.visitorsByHost).map(([host, count]) => ({
        purpose: host || 'Unknown Host',
        count: count as number,
        percentage: 0 // Will be calculated after we have total
      }));

      // Calculate percentages
      const total = chartData.reduce((sum, item) => sum + item.count, 0);
      chartData.forEach(item => {
        item.percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
      });

      setHostWiseData(chartData);
      setHasApiData(true);
    } catch (error) {
      console.error('Error fetching host-wise data:', error);
      setHostWiseData([]);
      setHasApiData(true); // Still mark as having API data to avoid fallback
    } finally {
      setIsLoading(false);
    }
  };

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
        // Use API data if we've made an API call, otherwise use provided data or fallback
        const purposeData = hasApiData ? hostWiseData : (data || [
          { purpose: 'Meeting', count: 45, percentage: 45 },
          { purpose: 'Personal', count: 20, percentage: 20 },
          { purpose: 'Delivery', count: 15, percentage: 15 },
          { purpose: 'Maintenance', count: 12, percentage: 12 },
          { purpose: 'Others', count: 8, percentage: 8 }
        ]);

        return (
          <div className="w-full overflow-x-auto">
            {isLoading && type === 'purposeWise' ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-center py-8 text-gray-500">
                  Loading host-wise visitor data...
                </div>
              </div>
            ) : (
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
                      {type === 'purposeWise' ? 'No host-wise data available for the selected date range' : 'No purpose-wise data available for the selected date range'}
                    </div>
                  </div>
                )}
              </ResponsiveContainer>
            )}
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