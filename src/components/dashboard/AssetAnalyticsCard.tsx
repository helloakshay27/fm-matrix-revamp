import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Package, AlertTriangle, Settings, DollarSign } from 'lucide-react';

interface AssetAnalyticsCardProps {
  title: string;
  data: any;
  type: 'group_wise' | 'asset_status' | 'asset_distribution' | 'asset_statistics' | 'asset_breakdown' | 'category_wise' | 'overall_analytics';
}

const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#84CC16'];

export const AssetAnalyticsCard: React.FC<AssetAnalyticsCardProps> = ({ title, data, type }) => {
  if (!data) {
    return (
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderGroupWiseChart = () => {
    const chartData = data.group_wise_assets?.slice(0, 10) || [];
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="group_name" 
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="asset_count" fill="#6366F1" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderAssetStatusChart = () => {
    const statusData = [
      { name: 'In Use', value: data.in_use, color: '#10B981' },
      { name: 'In Storage', value: data.in_storage, color: '#06B6D4' },
      { name: 'Breakdown', value: data.breakdown, color: '#EF4444' },
      { name: 'Disposed', value: data.disposed, color: '#6B7280' },
    ];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {statusData.map((item, index) => (
            <div key={index} className="text-center p-4 rounded-lg border">
              <div className="text-2xl font-bold" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="text-sm text-muted-foreground">{item.name}</div>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderAssetStatistics = () => {
    const stats = [
      { label: 'Total Assets', value: data.total_assets, icon: Package, color: 'text-blue-600' },
      { label: 'Total Value', value: data.total_value, icon: DollarSign, color: 'text-green-600' },
      { label: 'IT Assets', value: data.it_assets, icon: Settings, color: 'text-purple-600' },
      { label: 'Non-IT Assets', value: data.non_it_assets, icon: Package, color: 'text-orange-600' },
      { label: 'Critical Assets', value: data.critical_assets, icon: AlertTriangle, color: 'text-red-600' },
      { label: 'PPM Assets', value: data.ppm_assets, icon: Settings, color: 'text-cyan-600' },
    ];

    return (
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAssetBreakdown = () => {
    const breakdownData = data.breakdown_by_group || [];
    
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-4">Breakdown by Group</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={breakdownData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group_name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="breakdown_count" fill="#EF4444" />
              <Bar dataKey="total_count" fill="#E5E7EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Critical Breakdown Items</h4>
          <div className="space-y-2">
            {data.critical_breakdown?.slice(0, 5).map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-medium">{item.asset_name}</div>
                  <div className="text-sm text-muted-foreground">{item.group_name}</div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    item.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                    item.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.priority}
                  </div>
                  <div className="text-sm text-muted-foreground">{item.breakdown_date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryWiseChart = () => {
    const chartData = data.categories?.slice(0, 8) || [];
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="asset_count"
            label={(entry) => `${entry.category_name}: ${entry.percentage}%`}
          >
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderOverallAnalytics = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{data.summary?.total_assets}</div>
            <div className="text-sm text-muted-foreground">Total Assets</div>
          </div>
          <div className="text-center p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{data.summary?.in_use_percentage}%</div>
            <div className="text-sm text-muted-foreground">In Use</div>
          </div>
          <div className="text-center p-4 rounded-lg border">
            <div className="text-2xl font-bold text-red-600">{data.summary?.breakdown_percentage}%</div>
            <div className="text-sm text-muted-foreground">Breakdown</div>
          </div>
          <div className="text-center p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">₹{data.summary?.value_per_asset}</div>
            <div className="text-sm text-muted-foreground">Value/Asset</div>
          </div>
        </div>
        
        {data.group_wise && (
          <div>
            <h4 className="text-lg font-semibold mb-4">Asset Distribution by Group</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.group_wise.group_wise_assets?.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="group_name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="asset_count" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'group_wise':
        return renderGroupWiseChart();
      case 'asset_status':
        return renderAssetStatusChart();
      case 'asset_statistics':
        return renderAssetStatistics();
      case 'asset_breakdown':
        return renderAssetBreakdown();
      case 'category_wise':
        return renderCategoryWiseChart();
      case 'overall_analytics':
        return renderOverallAnalytics();
      default:
        return <div className="text-center text-muted-foreground">Chart type not supported</div>;
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};