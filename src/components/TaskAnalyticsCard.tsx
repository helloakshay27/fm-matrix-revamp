import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { taskAnalyticsDownloadAPI, DownloadType } from '@/services/taskAnalyticsDownloadAPI';

interface TaskAnalyticsCardProps {
  title: string;
  data: any;
  type: 'technical' | 'nonTechnical' | 'topTen' | 'siteWise';
  className?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const TaskAnalyticsCard: React.FC<TaskAnalyticsCardProps> = ({ 
  title, 
  data, 
  type, 
  className = '',
  dateRange
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!dateRange) {
      console.warn('Date range not provided for download');
      return;
    }

    setIsDownloading(true);
    try {
      await taskAnalyticsDownloadAPI.downloadAnalyticsData(type as DownloadType, {
        fromDate: dateRange.from,
        toDate: dateRange.to
      });
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  const renderContent = () => {
    if (!data) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No data available</p>
        </div>
      );
    }

    switch (type) {
      case 'technical':
      case 'nonTechnical': {
        // Transform the data for chart display
        const chartData = Object.entries(data).map(([key, value]: [string, any]) => ({
          name: key,
          open: value.open,
          closed: value.closed,
          work_in_progress: value.work_in_progress,
          overdue: value.overdue,
          total: value.open + value.closed + value.work_in_progress + value.overdue
        }));

        return (
          <div className="space-y-4">
            {/* Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="open" stackId="a" fill="#0088FE" name="Open" />
                  <Bar dataKey="closed" stackId="a" fill="#00C49F" name="Closed" />
                  <Bar dataKey="work_in_progress" stackId="a" fill="#FFBB28" name="Work in Progress" />
                  <Bar dataKey="overdue" stackId="a" fill="#FF8042" name="Overdue" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Category</th>
                    <th className="text-right p-2">Open</th>
                    <th className="text-right p-2">Closed</th>
                    <th className="text-right p-2">WIP</th>
                    <th className="text-right p-2">Overdue</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{item.name}</td>
                      <td className="text-right p-2">{item.open}</td>
                      <td className="text-right p-2">{item.closed}</td>
                      <td className="text-right p-2">{item.work_in_progress}</td>
                      <td className="text-right p-2">{item.overdue}</td>
                      <td className="text-right p-2 font-semibold">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'topTen': {
        // For top ten, show both chart and table
        const chartData = data.slice(0, 10).map((item: any, index: number) => ({
          ...item,
          color: COLORS[index % COLORS.length]
        }));

        return (
          <div className="space-y-4">
            {/* Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Rank</th>
                    <th className="text-left p-2">Checklist Type</th>
                    <th className="text-right p-2">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 10).map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">#{index + 1}</td>
                      <td className="p-2">{item.type}</td>
                      <td className="text-right p-2 font-semibold">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'siteWise': {
        const chartData = Object.entries(data).map(([siteName, value]: [string, any]) => ({
          site: siteName,
          open: value.open,
          closed: value.closed,
          work_in_progress: value.work_in_progress,
          overdue: value.overdue,
          total: value.open + value.closed + value.work_in_progress + value.overdue
        }));

        return (
          <div className="space-y-4">
            {/* Stacked Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="site" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="open" stackId="a" fill="#0088FE" name="Open" />
                  <Bar dataKey="closed" stackId="a" fill="#00C49F" name="Closed" />
                  <Bar dataKey="work_in_progress" stackId="a" fill="#FFBB28" name="Work in Progress" />
                  <Bar dataKey="overdue" stackId="a" fill="#FF8042" name="Overdue" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Site</th>
                    <th className="text-right p-2">Open</th>
                    <th className="text-right p-2">Closed</th>
                    <th className="text-right p-2">WIP</th>
                    <th className="text-right p-2">Overdue</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{item.site}</td>
                      <td className="text-right p-2">{item.open}</td>
                      <td className="text-right p-2">{item.closed}</td>
                      <td className="text-right p-2">{item.work_in_progress}</td>
                      <td className="text-right p-2">{item.overdue}</td>
                      <td className="text-right p-2 font-semibold">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      default:
        return <div>Unknown chart type</div>;
    }
  };

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {dateRange && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <Download className={`h-4 w-4 ${isDownloading ? 'animate-pulse' : ''}`} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
};