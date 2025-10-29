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

// Color palette with lighter shades
const CHART_COLORS = {
  primary: '#C4B99D',
  secondary: '#DAD6CA',
  tertiary: '#D5DBDB',
  primaryLight: '#DDD4C4',    // Lighter shade of primary
  secondaryLight: '#E8E5DD',  // Lighter shade of secondary
  tertiaryLight: '#E5E9E9',   // Lighter shade of tertiary
};

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
                  <Bar dataKey="open" stackId="a" fill={CHART_COLORS.primary} name="Open" />
                  <Bar dataKey="closed" stackId="a" fill={CHART_COLORS.secondary} name="Closed" />
                  <Bar dataKey="work_in_progress" stackId="a" fill={CHART_COLORS.tertiary} name="Work in Progress" />
                  <Bar dataKey="overdue" stackId="a" fill="#A3A8AA" name="Overdue" />
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
        // Handle the response structure for top ten data
        const responseData = data?.response || data;
        if (!Array.isArray(responseData)) {
          return (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No data available or invalid data format</p>
            </div>
          );
        }

        // For top ten, show both chart and table
        const topTenColors = [
          CHART_COLORS.primary, 
          CHART_COLORS.secondary, 
          CHART_COLORS.tertiary,
          CHART_COLORS.primaryLight,
          CHART_COLORS.secondaryLight,
          CHART_COLORS.tertiaryLight
        ];
        const chartData = responseData.slice(0, 10).map((item: any, index: number) => ({
          ...item,
          fill: topTenColors[index % topTenColors.length]
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
                      <Cell key={`cell-${index}`} fill={entry.fill} />
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
                      <td className="p-2 font-medium">#{index + 1}</td>
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
                  <Bar dataKey="open" stackId="a" fill={CHART_COLORS.primary} name="Open" />
                  <Bar dataKey="closed" stackId="a" fill={CHART_COLORS.secondary} name="Closed" />
                  <Bar dataKey="work_in_progress" stackId="a" fill={CHART_COLORS.tertiary} name="Work in Progress" />
                  <Bar dataKey="overdue" stackId="a" fill="#A3A8AA" name="Overdue" />
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
    <Card className={`h-full transition-all duration-200 hover:shadow-lg border-gray-200 group ${className}`}>
      <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold truncate flex-1">{title}</CardTitle>
        {dateRange && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1 flex-shrink-0"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
};