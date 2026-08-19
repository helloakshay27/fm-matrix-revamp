import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Info, RefreshCw } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AssetAnalyticsCardProps {
  title: string;
  data: any;
  type: 'groupWise' | 'categoryWise' | 'statusDistribution' | 'assetDistributions';
  dateRange: { startDate: Date; endDate: Date };
  onDownload?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  info?: string;
}

const PIE_COLORS = [
  "#76CDC1",
  "#E39090",
  "#CDCAF5",
  "#9EC8BA",
  "#EDC488",
  "#8E7BE0",
  "#DA7756",
  "#798C5E",
];

export const AssetAnalyticsCard: React.FC<AssetAnalyticsCardProps> = ({
  title,
  data,
  type,
  dateRange,
  onDownload,
  onRefresh,
  isLoading = false,
  info,
}) => {
  const renderChart = () => {
    switch (type) {
      case 'groupWise':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#6B7280' }}
                angle={-45}
                textAnchor="end"
                height={80}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={{ stroke: '#D1D5DB' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={{ stroke: '#D1D5DB' }}
              />
              <Tooltip
                formatter={(value: any, _name: any, props: any) => [
                  value,
                  props?.payload?.name ?? 'Count',
                ]}
                labelFormatter={() => ''}
                labelStyle={{ display: 'none' }}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'categoryWise': {
        const palette = PIE_COLORS;
        return (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={90}
                innerRadius={45}
                fill="#8884d8"
                dataKey="value"
                stroke="#FFFFFF"
                strokeWidth={2}
              >
                {data.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || palette[index % palette.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, _name: any, props: any) => [
                  value,
                  props?.payload?.name ?? 'Count',
                ]}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      }

      case 'statusDistribution':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={90}
                innerRadius={45}
                fill="#8884d8"
                dataKey="value"
                stroke="#FFFFFF"
                strokeWidth={2}
              >
                {data.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [value, 'Count']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'assetDistributions':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={90}
                innerRadius={45}
                fill="#8884d8"
                dataKey="value"
                stroke="#FFFFFF"
                strokeWidth={2}
              >
                {data.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [value, 'Count']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No chart available for this data type</p>
          </div>
        );
    }
  };

  return (
    <Card className="w-full border border-gray-200 shadow-sm bg-white">
      <CardHeader className="pb-4 px-6 pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-[#C72030]">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {info && (
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0"
                    >
                      <Info className="w-5 h-5 !text-[#000000]" style={{ color: '#000000' }} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-gray-700">
                    <p className="max-w-xs text-sm font-medium">
                      {info}
                    </p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            )}
            {onRefresh && (
              <RefreshCw
                data-no-drag="true"
                className={`w-5 h-5 flex-shrink-0 cursor-pointer text-black hover:text-gray-700 transition-colors z-50${
                  isLoading ? ' animate-spin' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRefresh();
                }}
                onPointerDown={(e) => { e.stopPropagation(); }}
                onMouseDown={(e) => { e.stopPropagation(); }}
                style={{ pointerEvents: 'auto' }}
              />
            )}
            {onDownload && title !== "Asset Status" && (
              <Download
                data-no-drag="true"
                className="w-5 h-5 flex-shrink-0 cursor-pointer text-black hover:text-gray-700 transition-colors z-50"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDownload();
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                style={{ pointerEvents: 'auto' }}
              />
            )}
          </div>
        </div>

      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 rounded-lg">
              <RefreshCw className="w-8 h-8 animate-spin text-[#C72030] mb-2" />
              <span className="text-sm text-gray-500 font-medium">Refreshing...</span>
            </div>
          )}
          {data && Array.isArray(data) && data.length > 0 ? (
          <div className="bg-gray-50 rounded-lg p-4">
            {renderChart()}
          </div>
        ) : data && typeof data === 'object' && Object.keys(data).length > 0 ? (
          <div className="bg-gray-50 rounded-lg p-4">
            {renderChart()}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No data available for the selected period</p>
          </div>
        )}
        </div>
      </CardContent>
    </Card>
  );
};