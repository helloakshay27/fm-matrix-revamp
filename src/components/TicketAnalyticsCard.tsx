import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ticketAnalyticsDownloadAPI } from '@/services/ticketAnalyticsDownloadAPI';
import { useToast } from '@/hooks/use-toast';

interface TicketAnalyticsCardProps {
  title: string;
  data: any;
  type: 'categoryWise' | 'tatResponse' | 'tatResolution' | 'unitCategoryWise' | 'agingMatrix';
  className?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export const TicketAnalyticsCard: React.FC<TicketAnalyticsCardProps> = ({
  title,
  data,
  type,
  className = "",
  dateRange
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!dateRange) return;
    
    setIsDownloading(true);
    try {
      switch (type) {
        case 'unitCategoryWise':
          await ticketAnalyticsDownloadAPI.downloadUnitCategorywiseData(dateRange.startDate, dateRange.endDate);
          toast({
            title: "Success",
            description: "Unit category-wise data downloaded successfully"
          });
          break;
        case 'tatResponse':
          await ticketAnalyticsDownloadAPI.downloadResponseTATData(dateRange.startDate, dateRange.endDate);
          toast({
            title: "Success",
            description: "Response TAT data downloaded successfully"
          });
          break;
        case 'tatResolution':
          await ticketAnalyticsDownloadAPI.downloadResolutionTATData(dateRange.startDate, dateRange.endDate);
          toast({
            title: "Success",
            description: "Resolution TAT data downloaded successfully"
          });
          break;
        case 'agingMatrix':
          await ticketAnalyticsDownloadAPI.downloadTicketAgingMatrixData(dateRange.startDate, dateRange.endDate);
          toast({
            title: "Success",
            description: "Aging matrix data downloaded successfully"
          });
          break;
        default:
          console.error('Unknown chart type for download');
          toast({
            title: "Error",
            description: "Unknown chart type for download",
            variant: "destructive"
          });
      }
    } catch (error) {
      console.error('Error downloading data:', error);
      toast({
        title: "Error",
        description: `Failed to download ${title.toLowerCase()} data`,
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  const renderContent = () => {
    switch (type) {
      case 'categoryWise':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Proactive vs Reactive</h4>
              {data?.slice(0, 10).map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-sm">{item.category}</span>
                  <div className="flex gap-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      P: {item.proactive?.Open + item.proactive?.Closed || 0}
                    </span>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      R: {item.reactive?.Open + item.reactive?.Closed || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'unitCategoryWise':
        const chartData = data?.response?.tickets_category?.slice(0, 10).map((category: string, index: number) => ({
          category: category || 'Unknown',
          open: data.response.open_tickets[index] || 0,
          closed: data.response.closed_tickets[index] || 0,
          total: data.response.total_tickets[index] || 0
        })) || [];

        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={10}
                />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="open" fill="#f59e0b" name="Open" />
                <Bar dataKey="closed" fill="#10b981" name="Closed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'tatResponse':
        const responseData = [
          { name: 'Response Achieved', value: data?.response?.achieved || 0, color: '#10b981' },
          { name: 'Response Breached', value: data?.response?.breached || 0, color: '#ef4444' },
          { name: 'Resolution Achieved', value: data?.resolution?.achieved || 0, color: '#3b82f6' },
          { name: 'Resolution Breached', value: data?.resolution?.breached || 0, color: '#f59e0b' }
        ];

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Response TAT</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={responseData.slice(0, 2)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {responseData.slice(0, 2).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-xs">Achieved: {data?.response?.achieved || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-xs">Breached: {data?.response?.breached || 0}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Resolution TAT</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={responseData.slice(2, 4)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {responseData.slice(2, 4).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-xs">Achieved: {data?.resolution?.achieved || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-xs">Breached: {data?.resolution?.breached || 0}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tatResolution':
        const resolutionChartData = data?.response?.categories?.map((category: string, index: number) => ({
          category,
          breached: data.response.breached[index] || 0,
          achieved: data.response.achieved[index] || 0,
          percentage_breached: data.response.percentage_breached[index] || 0,
          percentage_achieved: data.response.percentage_achieved[index] || 0
        })) || [];

        return (
          <div className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resolutionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" fontSize={10} />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value} (${name === 'breached' ? resolutionChartData.find(d => d.category)?.percentage_breached?.toFixed(1) : resolutionChartData.find(d => d.category)?.percentage_achieved?.toFixed(1)}%)`,
                      name === 'breached' ? 'Breached' : 'Achieved'
                    ]}
                  />
                  <Bar dataKey="breached" fill="#ef4444" name="Breached" />
                  <Bar dataKey="achieved" fill="#10b981" name="Achieved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {resolutionChartData.map((item: any, index: number) => (
                <div key={index} className="p-3 border rounded-lg">
                  <h5 className="font-medium text-sm">{item.category}</h5>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Breached:</span>
                      <span className="text-red-600">{item.breached} ({item.percentage_breached?.toFixed(1)}%)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Achieved:</span>
                      <span className="text-green-600">{item.achieved} ({item.percentage_achieved?.toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div className="text-center text-muted-foreground">No data available</div>;
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {dateRange && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="text-muted-foreground hover:text-foreground"
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default TicketAnalyticsCard;