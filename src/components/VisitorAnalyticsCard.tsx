import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { hostWiseGuestAPI, HostWiseGuestResponse } from '@/services/hostWiseGuestAPI';
import { useToast } from '@/hooks/use-toast';

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
  const [hostWiseData, setHostWiseData] = useState<HostWiseGuestResponse | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (type === 'purposeWise' && dateRange) {
      fetchHostWiseData();
    }
  }, [type, dateRange]);

  const fetchHostWiseData = async () => {
    if (!dateRange) return;
    
    try {
      const fromDate = `${dateRange.startDate.getMonth() + 1}/${dateRange.startDate.getDate()}/${dateRange.startDate.getFullYear()}`;
      const toDate = `${dateRange.endDate.getMonth() + 1}/${dateRange.endDate.getDate()}/${dateRange.endDate.getFullYear()}`;
      
      const response = await hostWiseGuestAPI.getHostWiseGuestCount(fromDate, toDate);
      setHostWiseData(response);
    } catch (error) {
      console.error('Error fetching host-wise data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch host-wise guest data",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async () => {
    if (!dateRange) return;
    
    setIsDownloading(true);
    try {
      // Implement download logic for visitor analytics
      console.log(`Downloading ${type} data for range:`, dateRange);
    } catch (error) {
      console.error('Error downloading data:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'purposeWise':
        const hostWiseVisitors = hostWiseData?.host_wise_guest_count?.visitorsByHost || {};
        const totalVisitors = Object.values(hostWiseVisitors).reduce((sum: number, count: number) => sum + count, 0);
        
        const purposeData = Object.entries(hostWiseVisitors).map(([host, count]) => ({
          purpose: host || 'Unknown Host',
          count: count as number,
          percentage: totalVisitors > 0 ? Math.round(((count as number) / totalVisitors) * 100) : 0
        }));

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

      case 'locationWise':
        const locationData = data || [
          { location: 'Reception', count: 45 },
          { location: 'Main Gate', count: 35 },
          { location: 'Side Entrance', count: 20 },
          { location: 'Parking', count: 15 },
          { location: 'Emergency Exit', count: 5 }
        ];

        return (
          <div className="space-y-3">
            {locationData.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">{item.location}</span>
                <span className="text-sm font-bold text-[#C72030]">{item.count}</span>
              </div>
            ))}
          </div>
        );

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