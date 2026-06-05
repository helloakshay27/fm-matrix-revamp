import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { taskAnalyticsDownloadAPI } from '@/services/taskAnalyticsDownloadAPI';

type TaskCategoryValue = { open?: number; closed?: number; work_in_progress?: number; overdue?: number };
type TopTenItem = { type?: string; count?: number };

interface TaskAnalyticsCardProps {
  title: string;
  data: Record<string, TaskCategoryValue> | TopTenItem[] | unknown;
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

        const chartData = Object.entries(responseData as Record<string, TaskCategoryValue>).map(([key, value]) => ({
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
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} padding={{ left: 30, right: 20 }} />
                  <YAxis width={40} />
                  <Tooltip cursor={{ fill: 'rgba(180,180,180,0.15)' }} />
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
                  {chartData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-4 text-muted-foreground text-sm">No data available</td>
                    </tr>
                  ) : (
                    chartData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="text-right p-2">{item.open ?? 0}</td>
                        <td className="text-right p-2">{item.closed ?? 0}</td>
                        <td className="text-right p-2">{item.work_in_progress ?? 0}</td>
                        <td className="text-right p-2">{item.overdue ?? 0}</td>
                        <td className="text-right p-2 font-semibold">{item.total ?? 0}</td>
                      </tr>
                    ))
                  )}
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
        const chartData = (responseData as TopTenItem[]).slice(0, 10).map((item, index) => ({
          ...item,
          fill: topTenColors[index % topTenColors.length]
        }));

        return (
          <div className="flex flex-col h-full">
            {/* Bar Chart — fixed height */}
            <div className="h-52 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-35} textAnchor="end" height={80} fontSize={9} padding={{ left: 30, right: 20 }} />
                  <YAxis width={40} />
                  <Tooltip cursor={{ fill: 'rgba(180,180,180,0.15)' }} />
                  <Bar dataKey="count">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill as string} />
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
                  {(responseData as TopTenItem[]).slice(0, 10).map((item, index) => (
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

        const chartData = Object.entries(responseData as Record<string, TaskCategoryValue>).map(([siteName, value]) => ({
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
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="site" fontSize={10} padding={{ left: 30, right: 20 }} />
                  <YAxis width={40} />
                  <Tooltip cursor={{ fill: 'rgba(180,180,180,0.15)' }} />
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
                  {chartData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-4 text-muted-foreground text-sm">No data available</td>
                    </tr>
                  ) : (
                    chartData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{item.site}</td>
                        <td className="text-right p-2">{item.open ?? 0}</td>
                        <td className="text-right p-2">{item.closed ?? 0}</td>
                        <td className="text-right p-2">{item.work_in_progress ?? 0}</td>
                        <td className="text-right p-2">{item.overdue ?? 0}</td>
                        <td className="text-right p-2 font-semibold">{item.total ?? 0}</td>
                      </tr>
                    ))
                  )}
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
    <div className={`bg-white rounded-xl shadow-sm flex flex-col ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-900 truncate flex-1" style={{ fontFamily: 'Work Sans, sans-serif' }}>{title}</h3>
        {dateRange && (
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1 flex-shrink-0 p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex-1 min-h-0 p-5 flex flex-col overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};