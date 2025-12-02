import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Grid } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AssetCategoryWiseCardProps {
  data: any;
  onDownload?: () => Promise<void>;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];

export const AssetCategoryWiseCard: React.FC<AssetCategoryWiseCardProps> = ({ data, onDownload }) => {
  // Process data for chart
  const processData = () => {
    if (!data) {
      return [{ name: 'No Data', value: 1, color: '#e5e7eb' }];
    }

    // Handle different data structures
    let categoryData = [];
    
    if (data.assets_statistics?.asset_categorywise) {
      // New structure
      categoryData = data.assets_statistics.asset_categorywise.map((item: any, index: number) => ({
        name: item.category,
        value: item.count,
        color: COLORS[index % COLORS.length]
      }));
    } else if (data.categories && Array.isArray(data.categories)) {
      // Legacy structure with categories array
      categoryData = data.categories.map((item: any, index: number) => ({
        name: item.category_name || item.name,
        value: item.asset_count || item.count || item.value,
        color: COLORS[index % COLORS.length]
      }));
    } else if (data.asset_type_category_counts) {
      // Legacy structure with asset_type_category_counts
      categoryData = Object.entries(data.asset_type_category_counts).map(([name, value], index) => ({
        name,
        value: value as number,
        color: COLORS[index % COLORS.length]
      }));
    } else if (Array.isArray(data)) {
      // Direct array structure
      categoryData = data.map((item: any, index: number) => ({
        name: item.category || item.name,
        value: item.count || item.value,
        color: COLORS[index % COLORS.length]
      }));
    }

    return categoryData.length > 0 ? categoryData : [{ name: 'No Data', value: 1, color: '#e5e7eb' }];
  };

  const chartData = processData();
  const hasData = chartData.length > 0 && chartData[0].name !== 'No Data';

  return (
    <Card className="h-96">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Grid className="w-4 h-4" />
          Category Wise Assets
        </CardTitle>
        {onDownload && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            className="h-8 w-8 p-0"
            data-download-button
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
