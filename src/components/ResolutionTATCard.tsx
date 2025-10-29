import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { ticketAnalyticsDownloadAPI } from '@/services/ticketAnalyticsDownloadAPI';
import { useToast } from '@/hooks/use-toast';

// Color palette with lighter shades
const CHART_COLORS = {
  primary: '#C4B99D',
  secondary: '#DAD6CA',
  tertiary: '#D5DBDB',
  primaryLight: '#DDD4C4',    // Lighter shade of primary
  secondaryLight: '#E8E5DD',  // Lighter shade of secondary
  tertiaryLight: '#E5E9E9',   // Lighter shade of tertiary
};

interface ResolutionTATData {
  success: number;
  message: string;
  response: {
    categories: string[];
    breached: number[];
    achieved: number[];
    total: number[];
    percentage_breached: number[];
    percentage_achieved: number[];
  };
  info: string;
}

interface ResolutionTATCardProps {
  data: ResolutionTATData | null;
  className?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export const ResolutionTATCard: React.FC<ResolutionTATCardProps> = ({ data, className = "", dateRange }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!dateRange) return;
    
    setIsDownloading(true);
    try {
      await ticketAnalyticsDownloadAPI.downloadResolutionTATData(dateRange.startDate, dateRange.endDate);
      toast({
        title: "Success",
        description: "Resolution TAT data downloaded successfully"
      });
    } catch (error) {
      console.error('Error downloading resolution TAT data:', error);
      toast({
        title: "Error",
        description: "Failed to download resolution TAT data",
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
            <CardTitle className="text-lg font-bold text-[#1A1A1A]">Resolution TAT Report</CardTitle>
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

  const chartData = data.response.categories.map((category, index) => ({
    category: category || 'Unknown',
    breached: data.response.breached[index] || 0,
    achieved: data.response.achieved[index] || 0,
    total: data.response.total[index] || 0,
    percentage_breached: data.response.percentage_breached[index] || 0,
    percentage_achieved: data.response.percentage_achieved[index] || 0
  })).filter(item => item.total > 0); // Only show categories with data

  return (
    <Card className={`bg-white ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-[#1A1A1A]">Resolution TAT Report</CardTitle>
          <Download 
            className={`w-5 h-5 text-[#C72030] cursor-pointer ${isDownloading ? 'opacity-50' : ''}`}
            onClick={handleDownload}
          />
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} className="min-w-[400px]">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                  />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'breached' ? 'Breached' : 'Achieved']}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  <Bar dataKey="breached" fill={CHART_COLORS.secondary} name="Breached" />
                  <Bar dataKey="achieved" fill={CHART_COLORS.primary} name="Achieved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Summary Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Category</th>
                    <th className="border border-gray-300 p-2 text-center">Breached</th>
                    <th className="border border-gray-300 p-2 text-center">Achieved</th>
                    <th className="border border-gray-300 p-2 text-center">Total</th>
                    <th className="border border-gray-300 p-2 text-center">% Breached</th>
                    <th className="border border-gray-300 p-2 text-center">% Achieved</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item, index) => (
                    <tr key={index} className="bg-white">
                      <td className="border border-gray-300 p-2">{item.category}</td>
                      <td className="border border-gray-300 p-2 text-center text-red-600">{item.breached}</td>
                      <td className="border border-gray-300 p-2 text-center text-green-600">{item.achieved}</td>
                      <td className="border border-gray-300 p-2 text-center font-medium">{item.total}</td>
                      <td className="border border-gray-300 p-2 text-center text-red-600">{item.percentage_breached.toFixed(1)}%</td>
                      <td className="border border-gray-300 p-2 text-center text-green-600">{item.percentage_achieved.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500">No resolution TAT data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};