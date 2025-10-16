import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AssetGroupWiseCardProps {
  data: any;
  onDownload?: () => Promise<void>;
}

export const AssetGroupWiseCard: React.FC<AssetGroupWiseCardProps> = ({ data, onDownload }) => {
  // Process data for chart - support both new and legacy structures
  const processData = () => {
    if (!data) {
      return [];
    }

    let groupAssets: Array<{ group_name: string; asset_count?: number; count?: number }> = [];

    if (data.assets_statistics?.assets_group_count_by_name) {
      // New structure
      groupAssets = data.assets_statistics.assets_group_count_by_name;
    } else if (data.group_wise_assets) {
      // Legacy structure
      groupAssets = data.group_wise_assets;
    }

    return groupAssets.slice(0, 10).map((item: any) => ({
      name: item.group_name,
      value: item.asset_count || item.count || 0
    }));
  };

  const chartData = processData();
  const hasData = chartData.length > 0;

  return (
    <Card className="h-96">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Users className="w-4 h-4" />
          Assets Group-Wise
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
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" />
              </BarChart>
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
