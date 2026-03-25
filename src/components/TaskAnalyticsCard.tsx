import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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
  primaryLight: '#DDD4C4',
  secondaryLight: '#E8E5DD',
  tertiaryLight: '#E5E9E9',
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
        <div className="flex items-center justify-center h-48">
          <p className="text-muted-foreground">No data available</p>
        </div>
      );
    }

    switch (type) {
      case 'technical':
      case 'nonTechnical': {
        const responseData = data?.response || data;
        if (!responseData || typeof responseData !== 'object') {
          return (
            <div className="flex items-center justify-center h-48">
              <p className="text-muted-foreground">No data available</p>
            </div>
          );
        }

        const chartData = Object.entries(responseData).map(([key, value]: [string, any]) => ({
          name: key,
          open: value?.open || 0,
          closed: value?.closed || 0,
          work_in_progress: value?.work_in_progress || 0,
          overdue: value?.overdue || 0,
          total: (value?.open || 0) + (value?.closed || 0) + (value?.work_in_progress || 0) + (value?.overdue || 0)
        }));

        return (
          <div className="flex flex-col h-full">
            {/* Bar Chart — fixed height, never shrinks */}
            <div className="h-52 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="open" stackId="a" fill={CHART_COLORS.primary} name="Open" />
                  <Bar dataKey="closed" stackId="a" fill={CHART_COLORS.secondary} name="Closed" />
                  <Bar dataKey="work_in_progress" stackId="a" fill={CHART_COLORS.tertiary} name="Work in Progress" />
                  <Bar dataKey="overdue" stackId="a" fill="#A3A8AA" name="Overdue" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Scrollable table */}
            <div className="flex-1 overflow-auto mt-3 border rounded-md">
              <table className="w-full text-sm min-w-[340px]">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-2 font-semibold">Category</th>
                    <th className="text-right p-2 font-semibold">Open</th>
                    <th className="text-right p-2 font-semibold">Closed</th>
                    <th className="text-right p-2 font-semibold">WIP</th>
                    <th className="text-right p-2 font-semibold">Overdue</th>
                    <th className="text-right p-2 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
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
        const responseData = data?.response || data;
        if (!Array.isArray(responseData)) {
          return (
            <div className="flex items-center justify-center h-48">
              <p className="text-muted-foreground">No data available or invalid data format</p>
            </div>
          );
        }

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
          <div className="flex flex-col h-full">
            {/* Bar Chart — fixed height */}
            <div className="h-52 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-35} textAnchor="end" height={80} fontSize={9} />
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

            {/* Scrollable table */}
            <div className="flex-1 overflow-auto mt-3 border rounded-md">
              <table className="w-full text-sm min-w-[280px]">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-2 font-semibold">Rank</th>
                    <th className="text-left p-2 font-semibold">Checklist Type</th>
                    <th className="text-right p-2 font-semibold">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {responseData.slice(0, 10).map((item: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
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
        const responseData = data?.response || data;
        if (!responseData || typeof responseData !== 'object') {
          return (
            <div className="flex items-center justify-center h-48">
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
          <div className="flex flex-col h-full">
            {/* Stacked Bar Chart — fixed height */}
            <div className="h-52 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="site" fontSize={10} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="open" stackId="a" fill={CHART_COLORS.primary} name="Open" />
                  <Bar dataKey="closed" stackId="a" fill={CHART_COLORS.secondary} name="Closed" />
                  <Bar dataKey="work_in_progress" stackId="a" fill={CHART_COLORS.tertiary} name="Work in Progress" />
                  <Bar dataKey="overdue" stackId="a" fill="#A3A8AA" name="Overdue" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Scrollable table */}
            <div className="flex-1 overflow-auto mt-3 border rounded-md">
              <table className="w-full text-sm min-w-[360px]">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-2 font-semibold">Site</th>
                    <th className="text-right p-2 font-semibold">Open</th>
                    <th className="text-right p-2 font-semibold">Closed</th>
                    <th className="text-right p-2 font-semibold">WIP</th>
                    <th className="text-right p-2 font-semibold">Overdue</th>
                    <th className="text-right p-2 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
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
    <Card
      className={`flex flex-col transition-all duration-200 hover:shadow-lg border-gray-200 group ${className}`}
      style={{ height: '520px' }}
    >
      <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-5 flex flex-row items-center justify-between gap-2 flex-shrink-0">
        <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold truncate flex-1">{title}</CardTitle>
        {dateRange && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1 flex-shrink-0"
            data-download-button
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0 px-4 sm:px-6 pb-4 flex-1 min-h-0 overflow-hidden">
        {renderContent()}
      </CardContent>
    </Card>
  );
};