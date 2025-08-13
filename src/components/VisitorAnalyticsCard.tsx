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
        const purposeData = data || [
          { purpose: 'Meeting', count: 45, percentage: 45 },
          { purpose: 'Personal', count: 20, percentage: 20 },
          { purpose: 'Delivery', count: 15, percentage: 15 },
          { purpose: 'Maintenance', count: 12, percentage: 12 },
          { purpose: 'Others', count: 8, percentage: 8 }
        ];

        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={purposeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="purpose" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={10}
                />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#C72030" />
              </BarChart>
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

        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
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
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-bold text-[#C72030]">{title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
          disabled={isDownloading}
          className="text-[#C72030] hover:text-[#C72030]/80"
        >
          <Download className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default VisitorAnalyticsCard;