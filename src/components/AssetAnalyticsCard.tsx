import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
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
}

const COLORS = ['#C72030', '#c6b692', '#d8dcdd', '#8B5A3C', '#A0A0A0', '#FFB366', '#FF8C42', '#6B8E23'];

export const AssetAnalyticsCard: React.FC<AssetAnalyticsCardProps> = ({
  title,
  data,
  type,
  dateRange,
  onDownload,
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
              <Bar
                dataKey="value"
                fill="#C72030"
                radius={[4, 4, 0, 0]}
                stroke="#C72030"
                strokeWidth={1}
              />
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
                outerRadius={85}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                stroke="#FFFFFF"
                strokeWidth={2}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Count']} />
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
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Count']} />
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
          {onDownload && title !== "Asset Status" && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="flex items-center gap-1 border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors"
              data-download="true"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>

      </CardHeader>
      <CardContent className="px-6 pb-6">
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
      </CardContent>
    </Card>
  );
};
