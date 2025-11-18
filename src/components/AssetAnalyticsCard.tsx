import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Info } from 'lucide-react';
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
  info?: string;
}

const COLORS = ['#C4AE9D', '#C4B99D', '#DAD6CA', '#D5DBDB', '#8B5A3C', '#A0A0A0', '#FFB366', '#FF8C42', '#6B8E23'];

// Category-wise pie chart color palette - uses base colors and nearby variations
const CATEGORY_COLORS = [
  '#C4B99D', '#CFC4A8', '#D9CFB3', // C4B99D variations
  '#D5DBDB', '#DCE0E0', '#E3E5E5', // D5DBDB variations
  '#DAD6CA', '#DED9D1', '#E2DDD8', // DAD6CA variations
];

export const AssetAnalyticsCard: React.FC<AssetAnalyticsCardProps> = ({
  title,
  data,
  type,
  dateRange,
  onDownload,
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
                formatter={(value) => [value, 'Assets']}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill="#C4AE9D" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'categoryWise':
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
                  <Cell key={`cell-${index}`} fill={entry.color || CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [value, 'Assets']}
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
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
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
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
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
            {info && (title === "Asset Status" || title === "Asset Type Distribution" || title === "Group-wise Assets" || title === "Category-wise Assets") && (
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0"
                    >
                      <Info className="w-4 h-4 !text-[#C72030]" style={{ color: '#C72030' }} />
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
            {onDownload && title !== "Asset Status" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDownload}
                className="w-8 h-8 p-0"
                data-download="true"
              >
                <Download className="w-4 h-4 !text-[#C72030]" style={{ color: '#C72030' }} />
              </Button>
            )}
          </div>
        </div>

      </CardHeader>
      <CardContent className="px-6 pb-6">
        {data && Array.isArray(data) && data.length > 0 && data.some((item: { value: number }) => item.value > 0) ? (
          <div className="bg-gray-50 rounded-lg p-4">
            {renderChart()}
          </div>
        ) : data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0 ? (
          <div className="bg-gray-50 rounded-lg p-4">
            {renderChart()}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No data available for the selected period</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
