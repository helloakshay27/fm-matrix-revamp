import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AssetDistributionCardProps {
  data: any;
  onDownload?: () => Promise<void>;
}

export const AssetDistributionCard: React.FC<AssetDistributionCardProps> = ({ data, onDownload }) => {
  // Process data for chart
  const processData = () => {
    if (!data) {
      return [{ name: 'No Data', value: 1, color: '#e5e7eb' }];
    }

    // Support both new and legacy data structures
    let itAssets = 0;
    let nonItAssets = 0;

    if (data.assets_statistics?.assets_distribution) {
      // New structure
      itAssets = data.assets_statistics.assets_distribution.it_assets_count || 0;
      nonItAssets = data.assets_statistics.assets_distribution.non_it_assets_count || 0;
    } else if (data.info) {
      // Legacy structure
      itAssets = data.info.total_it_assets || 0;
      nonItAssets = data.info.total_non_it_assets || 0;
    }

    const chartData = [
      {
        name: 'IT Equipment',
        value: itAssets,
        color: '#d8dcdd'
      },
      {
        name: 'Non-IT Equipment',
        value: nonItAssets,
        color: '#c6b692'
      }
    ].filter(item => item.value > 0);

    return chartData.length > 0 ? chartData : [{ name: 'No Data', value: 1, color: '#e5e7eb' }];
  };

  const chartData = processData();
  
  // Support both new and legacy data structures for hasData check
  let itAssets = 0;
  let nonItAssets = 0;

  if (data?.assets_statistics?.assets_distribution) {
    // New structure
    itAssets = data.assets_statistics.assets_distribution.it_assets_count || 0;
    nonItAssets = data.assets_statistics.assets_distribution.non_it_assets_count || 0;
  } else if (data?.info) {
    // Legacy structure
    itAssets = data.info.total_it_assets || 0;
    nonItAssets = data.info.total_non_it_assets || 0;
  }

  const hasData = data && (itAssets + nonItAssets) > 0;

  return (
    <Card className="h-96">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <BarChart3 className="w-4 h-4" />
          Assets Distributions
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
                  {itAssets}
                </div>
                <div className="text-muted-foreground">IT Equipment</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {nonItAssets}
                </div>
                <div className="text-muted-foreground">Non-IT Equipment</div>
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
