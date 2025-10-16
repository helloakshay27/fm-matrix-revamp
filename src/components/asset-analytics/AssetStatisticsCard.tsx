import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Package, DollarSign, Cpu, AlertTriangle, Settings, Star } from 'lucide-react';

interface AssetStatisticsCardProps {
  data: any;
  onDownload?: () => Promise<void>;
}

export const AssetStatisticsCard: React.FC<AssetStatisticsCardProps> = ({ data, onDownload }) => {
  // Process data for statistics
  const processData = () => {
    if (!data) {
      return {
        total_assets: 0,
        total_value: '$0.00',
        assets_in_use: 0,
        assets_in_breakdown: 0,
        critical_assets: 0,
        ppm_assets: 0,
        average_rating: 0
      };
    }

    // Handle new API structure with assets_statistics wrapper
    const assetsStats = data.assets_statistics || data;
    
    return {
      total_assets: assetsStats.total_assets?.assets_total_count || 0,
      total_value: data.total_value || '$0.00',
      assets_in_use: assetsStats.assets_in_use?.assets_in_use_total || 0,
      assets_in_breakdown: assetsStats.assets_in_breakdown?.assets_in_breakdown_total || 0,
      critical_assets: assetsStats.critical_assets_breakdown?.critical_assets_breakdown_total || 0,
      ppm_assets: assetsStats.ppm_overdue_assets?.ppm_conduct_assets_count || 0,
      average_rating: data.average_customer_rating?.avg_rating || 0
    };
  };

  const stats = processData();
  const hasData = stats.total_assets > 0;

  return (
    <Card className="h-96">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Package className="w-4 h-4" />
          Assets Statistics
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
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {stats.total_assets}
                  </div>
                  <div className="text-xs text-blue-500">Total Assets</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {stats.total_value}
                  </div>
                  <div className="text-xs text-green-500">Total Value</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg">
                <Cpu className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-lg font-bold text-emerald-600">
                    {stats.assets_in_use}
                  </div>
                  <div className="text-xs text-emerald-500">In Use</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {stats.assets_in_breakdown}
                  </div>
                  <div className="text-xs text-red-500">Breakdown</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-lg font-bold text-orange-600">
                    {stats.critical_assets}
                  </div>
                  <div className="text-xs text-orange-500">Critical Assets</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                <Settings className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    {stats.ppm_assets}
                  </div>
                  <div className="text-xs text-purple-500">PPM Assets</div>
                </div>
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
