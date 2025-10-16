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
    if (!data) {
      return [
        { name: 'No Data', value: 1, color: '#e5e7eb' }
      ];
    }

    // Handle both direct status data (from API service) and wrapped data
    const statusData = data.assets_statistics?.status || data;
    
    const chartData = [
      {
        name: 'In Use',
        value: statusData.assets_in_use_total || statusData.total_assets_in_use || 0,
        color: '#c6b692'
      },
      {
        name: 'Breakdown',
        value: statusData.assets_in_breakdown_total || statusData.total_assets_in_breakdown || 0,
        color: '#d8dcdd'
      },
      {
        name: 'In Store',
        value: statusData.in_store || 0,
        color: '#8b7355'
      },
      {
        name: 'In Disposed',
        value: statusData.in_disposed || 0,
        color: '#a3a8aa'
      }
    ].filter(item => item.value > 0);

    return chartData.length > 0 ? chartData : [{ name: 'No Data', value: 1, color: '#e5e7eb' }];
  };

  const chartData = processData();
  const statusData = data?.assets_statistics?.status || data;
  
  // Debug logging
  console.log('AssetStatusCard - Raw data:', data);
  console.log('AssetStatusCard - Status data:', statusData);
  console.log('AssetStatusCard - Chart data:', chartData);
  
  const hasData = statusData && (
    statusData.assets_in_use_total !== undefined ||
    statusData.assets_in_breakdown_total !== undefined ||
    statusData.total_assets_in_use !== undefined ||
    statusData.total_assets_in_breakdown !== undefined
  );
  
  console.log('AssetStatusCard - Has data:', hasData);

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
            <Download className="w-4 h-4 !text-[#C72030]" style={{ color: '#C72030' }} />
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
                  {statusData?.assets_in_use_total || statusData?.total_assets_in_use || 0}
                </div>
                <div className="text-muted-foreground">In Use</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {statusData?.assets_in_breakdown_total || statusData?.total_assets_in_breakdown || 0}
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
