import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { taskAnalyticsDownloadAPI } from '@/services/taskAnalyticsDownloadAPI';

interface TaskAnalyticsCardProps {
  title: string;
  data: any;
  type: 'technical' | 'nonTechnical' | 'topTen' | 'siteWise';
  className?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

// Custom color palette matching survey analytics - warm, professional tones
const STATUS_COLORS = {
  open: '#E67E22',        // Warm orange for open tasks
  closed: '#27AE60',      // Green for closed tasks
  work_in_progress: '#F39C12', // Yellow/gold for work in progress
  overdue: '#E74C3C',     // Red for overdue tasks
};

// Color palette for Top 10 charts - warm, professional gradient
const TOP_TEN_COLORS = [
  '#8B7355',   // Warm brown
  '#A8956B',   // Soft gold/tan
  '#9B8B7E',   // Neutral taupe
  '#B5A089',   // Light beige
  '#94857A',   // Medium taupe
  '#C4B5A0',   // Pale tan
  '#AA9980',   // Sandy brown
  '#D4C4B0',   // Light cream
  '#8E7A6B',   // Deep taupe
  '#C9B8A3',   // Warm beige
];

export const TaskAnalyticsCard: React.FC<TaskAnalyticsCardProps> = ({ 
  title, 
  data, 
  type, 
  className = '',
  dateRange
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!dateRange) return;
    
    setIsDownloading(true);
    try {
      switch (type) {
        case 'technical':
          await taskAnalyticsDownloadAPI.downloadTechnicalChecklistData(dateRange.startDate, dateRange.endDate);
          break;
        case 'nonTechnical':
          await taskAnalyticsDownloadAPI.downloadNonTechnicalChecklistData(dateRange.startDate, dateRange.endDate);
          break;
        case 'topTen':
          await taskAnalyticsDownloadAPI.downloadTopTenChecklistData(dateRange.startDate, dateRange.endDate);
          break;
        case 'siteWise':
          await taskAnalyticsDownloadAPI.downloadSiteWiseChecklistData(dateRange.startDate, dateRange.endDate);
          break;
        default:
          console.error('Unknown chart type for download');
      }
    } catch (error) {
      console.error('Error downloading data:', error);
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
        // Handle the response structure - check if data has a 'response' property
        const responseData = data?.response || data;
        if (!responseData || typeof responseData !== 'object') {
          return (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No data available</p>
            </div>
          );
        }

        // Transform the data for chart display
        const chartData = Object.entries(responseData).map(([key, value]: [string, any]) => ({
          name: key,
          open: value?.open || 0,
          closed: value?.closed || 0,
          work_in_progress: value?.work_in_progress || 0,
          overdue: value?.overdue || 0,
          total: (value?.open || 0) + (value?.closed || 0) + (value?.work_in_progress || 0) + (value?.overdue || 0)
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
                  <Bar dataKey="open" stackId="a" fill={STATUS_COLORS.open} name="Open" />
                  <Bar dataKey="closed" stackId="a" fill={STATUS_COLORS.closed} name="Closed" />
                  <Bar dataKey="work_in_progress" stackId="a" fill={STATUS_COLORS.work_in_progress} name="Work in Progress" />
                  <Bar dataKey="overdue" stackId="a" fill={STATUS_COLORS.overdue} name="Overdue" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Category</th>
                    <th className="text-right p-2">
                      <span className="inline-flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: STATUS_COLORS.open }}></span>
                        Open
                      </span>
                    </th>
                    <th className="text-right p-2">
                      <span className="inline-flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: STATUS_COLORS.closed }}></span>
                        Closed
                      </span>
                    </th>
                    <th className="text-right p-2">
                      <span className="inline-flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: STATUS_COLORS.work_in_progress }}></span>
                        WIP
                      </span>
                    </th>
                    <th className="text-right p-2">
                      <span className="inline-flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: STATUS_COLORS.overdue }}></span>
                        Overdue
                      </span>
                    </th>
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
        // Handle the response structure for top ten data
        const responseData = data?.response || data;
        if (!Array.isArray(responseData)) {
          return (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No data available or invalid data format</p>
            </div>
          );
        }

        // For top ten, show both chart and table with custom colors
        const chartData = responseData.slice(0, 10).map((item: any, index: number) => ({
          ...item,
          color: TOP_TEN_COLORS[index % TOP_TEN_COLORS.length]
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
                  <Bar dataKey="count">
                    {chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
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
                  {responseData.slice(0, 10).map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">
                        <span className="inline-flex items-center gap-2">
                          <span 
                            className="inline-block w-3 h-3 rounded-sm" 
                            style={{ backgroundColor: TOP_TEN_COLORS[index % TOP_TEN_COLORS.length] }}
                          ></span>
                          #{index + 1}
                        </span>
                      </td>
                      <td className="p-2">{item.type || 'N/A'}</td>
                      <td className="text-right p-2 font-semibold">{item.count || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'siteWise': {
        // Handle the response structure for site-wise data
        const responseData = data?.response || data;
        if (!responseData || typeof responseData !== 'object') {
          return (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No data available</p>
            </div>
          );
        }

        const chartData = Object.entries(responseData).map(([siteName, value]: [string, any]) => ({
          site: siteName,
          open: value?.open || 0,
          closed: value?.closed || 0,
          work_in_progress: value?.work_in_progress || 0,
          overdue: value?.overdue || 0,
          total: (value?.open || 0) + (value?.closed || 0) + (value?.work_in_progress || 0) + (value?.overdue || 0)
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
                  <Bar dataKey="open" stackId="a" fill={STATUS_COLORS.open} name="Open" />
                  <Bar dataKey="closed" stackId="a" fill={STATUS_COLORS.closed} name="Closed" />
                  <Bar dataKey="work_in_progress" stackId="a" fill={STATUS_COLORS.work_in_progress} name="Work in Progress" />
                  <Bar dataKey="overdue" stackId="a" fill={STATUS_COLORS.overdue} name="Overdue" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Site</th>
                    <th className="text-right p-2">
                      <span className="inline-flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: STATUS_COLORS.open }}></span>
                        Open
                      </span>
                    </th>
                    <th className="text-right p-2">
                      <span className="inline-flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: STATUS_COLORS.closed }}></span>
                        Closed
                      </span>
                    </th>
                    <th className="text-right p-2">
                      <span className="inline-flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: STATUS_COLORS.work_in_progress }}></span>
                        WIP
                      </span>
                    </th>
                    <th className="text-right p-2">
                      <span className="inline-flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: STATUS_COLORS.overdue }}></span>
                        Overdue
                      </span>
                    </th>
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
    <Card className={`h-full transition-all duration-200 hover:shadow-lg border-gray-200 group ${className}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {dateRange && (
         

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
};