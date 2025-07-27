// new comment //
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { GripVertical, Package, AlertTriangle } from 'lucide-react';

interface InventoryAnalyticsCardProps {
  title: string;
  data: any;
  type: 'items_status' | 'category_wise' | 'green_consumption' | 'aging_matrix' | 'low_stock' | 'high_value';
}

const COLORS = ['#10B981', '#F59E0B', '#C72030', '#3B82F6', '#8B5CF6', '#EF4444'];

export const InventoryAnalyticsCard: React.FC<InventoryAnalyticsCardProps> = ({ title, data, type }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: title });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderContent = () => {
    if (!data) {
      return <div className="text-center text-analytics-muted py-8">No data available</div>;
    }

    switch (type) {
      case 'items_status':
        if (typeof data === 'object' && data.status_breakdown) {
          const statusData = Object.entries(data.status_breakdown).map(([key, value]) => ({
            name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value: value as number
          }));

          return (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-analytics-muted">Total Items:</span>
                  <span className="font-medium text-analytics-text">{data.total_items || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-analytics-muted">Available:</span>
                  <span className="font-medium text-green-600">{data.available_items || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-analytics-muted">Out of Stock:</span>
                  <span className="font-medium text-red-600">{data.out_of_stock_items || 0}</span>
                </div>
              </div>
            </div>
          );
        }
        break;

      case 'category_wise':
        if (Array.isArray(data)) {
          const chartData = data.map(item => ({
            name: item.category || 'Unknown',
            count: item.item_count || 0,
            value: item.total_value || 0
          }));

          return (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" name="Items" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="text-sm">
                <div className="font-medium text-analytics-text mb-2">Category Summary</div>
                {chartData.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between py-1">
                    <span className="text-analytics-muted">{item.name}</span>
                    <span className="font-medium text-analytics-text">{item.count} items</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        break;

      case 'green_consumption':
        if (data && data.consumption_data) {
          const consumptionData = data.consumption_data.map((item: any) => ({
            month: item.month || '',
            green: item.green_items || 0,
            regular: item.regular_items || 0
          }));

          return (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="green" stroke="#10B981" strokeWidth={2} name="Green Items" />
                  <Line type="monotone" dataKey="regular" stroke="#6B7280" strokeWidth={2} name="Regular Items" />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-green-600">{data.total_green_consumed || 0}</div>
                  <div className="text-analytics-muted">Green Items</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-analytics-text">{data.green_percentage || 0}%</div>
                  <div className="text-analytics-muted">Green Ratio</div>
                </div>
              </div>
            </div>
          );
        }
        break;

      case 'low_stock':
        if (data && data.items) {
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span className="font-medium text-analytics-text">
                  {data.items.length} Items Below Minimum Stock
                </span>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data.items.slice(0, 10).map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-analytics-background rounded">
                    <div>
                      <div className="font-medium text-analytics-text text-sm">{item.name || 'Unknown Item'}</div>
                      <div className="text-xs text-analytics-muted">{item.category || 'No Category'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-600">{item.current_stock || 0}</div>
                      <div className="text-xs text-analytics-muted">Min: {item.minimum_stock || 0}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {data.items.length > 10 && (
                <div className="text-center text-sm text-analytics-muted">
                  +{data.items.length - 10} more items
                </div>
              )}
            </div>
          );
        }
        break;

      case 'high_value':
        if (data && data.items) {
          const totalValue = data.items.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
          
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-analytics-text">
                  High Value Items (₹{totalValue.toLocaleString()})
                </span>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data.items.slice(0, 10).map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-analytics-background rounded">
                    <div>
                      <div className="font-medium text-analytics-text text-sm">{item.name || 'Unknown Item'}</div>
                      <div className="text-xs text-analytics-muted">{item.category || 'No Category'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-600">₹{(item.value || 0).toLocaleString()}</div>
                      <div className="text-xs text-analytics-muted">Qty: {item.quantity || 0}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {data.items.length > 10 && (
                <div className="text-center text-sm text-analytics-muted">
                  +{data.items.length - 10} more items
                </div>
              )}
            </div>
          );
        }
        break;

      case 'aging_matrix':
        if (data && typeof data === 'object') {
          const agingData = Object.entries(data).map(([range, count]) => ({
            range: range.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            count: count as number
          }));

          return (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        }
        break;

      default:
        return <div className="text-center text-analytics-muted py-8">Chart type not supported</div>;
    }

    return <div className="text-center text-analytics-muted py-8">Invalid data format</div>;
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="bg-background border-analytics-border hover:shadow-lg transition-shadow h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-analytics-text">{title}</CardTitle>
          <div {...listeners} className="cursor-grab hover:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-analytics-muted" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};