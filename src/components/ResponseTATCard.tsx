import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Download } from 'lucide-react';
import { ticketAnalyticsDownloadAPI } from '@/services/ticketAnalyticsDownloadAPI';
import { useToast } from '@/hooks/use-toast';

interface ResponseTATData {
  success: number;
  message: string;
  response: {
    resolution: {
      breached: number;
      achieved: number;
    };
    response: {
      breached: number;
      achieved: number;
    };
  };
  info: string;
}

interface ResponseTATCardProps {
  data: ResponseTATData | null;
  className?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export const ResponseTATCard: React.FC<ResponseTATCardProps> = ({ data, className = "", dateRange }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!dateRange) return;
    
    setIsDownloading(true);
    try {
      await ticketAnalyticsDownloadAPI.downloadResponseTATData(dateRange.startDate, dateRange.endDate);
      toast({
        title: "Success",
        description: "Response TAT data downloaded successfully"
      });
    } catch (error) {
      console.error('Error downloading response TAT data:', error);
      toast({
        title: "Error",
        description: "Failed to download response TAT data",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  if (!data || !data.response) {
    return (
      <Card className={`bg-white ${className}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-[#C72030]">Response TAT</CardTitle>
            <Download 
              className="w-5 h-5 text-[#C72030] cursor-pointer" 
              onClick={handleDownload}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const responseData = [
    {
      name: 'Achieved',
      value: data.response.response.achieved,
      color: '#10b981'
    },
    {
      name: 'Breached',
      value: data.response.response.breached,
      color: '#ef4444'
    }
  ];

  const total = data.response.response.achieved + data.response.response.breached;

  return (
    <Card className={`bg-white ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-[#C72030]">Response TAT</CardTitle>
          <Download 
            className={`w-5 h-5 text-[#C72030] cursor-pointer ${isDownloading ? 'opacity-50' : ''}`}
            onClick={handleDownload}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={responseData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ value, cx, cy, midAngle, innerRadius, outerRadius }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      fontSize="14"
                      fontWeight="bold"
                    >
                      {value}
                    </text>
                  );
                }}
                labelLine={false}
              >
                {responseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700">Total: {total}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          {responseData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};