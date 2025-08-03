import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AssetStatusCardProps {
  data: any;
  onDownload?: () => Promise<void>;
}

const COLORS = ['#c6b692', '#d8dcdd', '#8b7355', '#a3a8aa'];

export const AssetStatusCard: React.FC<AssetStatusCardProps> = ({ data, onDownload }) => {
  // Process data for chart
  const processData = () => {
    if (!data || !data.info) {
      return [
        { name: 'No Data', value: 1, color: '#e5e7eb' }
      ];
    }

    const info = data.info;
    const chartData = [
      {
        name: 'In Use',
        value: info.total_assets_in_use || 0,
        color: '#c6b692'
      },
      {
        name: 'Breakdown',
        value: info.total_assets_in_breakdown || 0,
        color: '#d8dcdd'
      }
    ].filter(item => item.value > 0);

    return chartData.length > 0 ? chartData : [{ name: 'No Data', value: 1, color: '#e5e7eb' }];
  };

  const chartData = processData();
  const hasData = data && data.info && (data.info.total_assets_in_use > 0 || data.info.total_assets_in_breakdown > 0);

  return (
    <Card className="h-96">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Activity className="w-4 h-4" />
          Assets Status
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
          <div className="space-y-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {data.info?.total_assets_in_use || 0}
                </div>
                <div className="text-muted-foreground">In Use</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {data.info?.total_assets_in_breakdown || 0}
                </div>
                <div className="text-muted-foreground">Breakdown</div>
              </div>
            </div>
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
