import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { inventoryAnalyticsDownloadAPI } from '@/services/inventoryAnalyticsDownloadAPI';
import { toast } from 'sonner';

interface InventoryAnalyticsCardProps {
  title: string;
  data: any;
  type?: 'itemsStatus' | 'categoryWise' | 'greenConsumption' | 'consumptionReportGreen' | 'consumptionReportNonGreen' | 'currentMinimumStockNonGreen' | 'currentMinimumStockGreen';
  className?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export const InventoryAnalyticsCard: React.FC<InventoryAnalyticsCardProps> = ({
  title,
  data,
  type = 'itemsStatus',
  className = '',
  dateRange
}) => {
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleDownload = async () => {
    if (!dateRange) {
      toast.error('Date range is required for download');
      return;
    }

    setDownloadLoading(true);
    try {
      switch (type) {
        case 'itemsStatus':
          await inventoryAnalyticsDownloadAPI.downloadItemsStatusData(dateRange.startDate, dateRange.endDate);
          toast.success('Items status data downloaded successfully');
          break;
        case 'categoryWise':
          await inventoryAnalyticsDownloadAPI.downloadCategoryWiseData(dateRange.startDate, dateRange.endDate);
          toast.success('Category wise data downloaded successfully');
          break;
        default:
          toast.error('Download not available for this data type');
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download data');
    } finally {
      setDownloadLoading(false);
    }
  };
  if (!data) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#C72030]">{title}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={downloadLoading || !dateRange}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center h-32 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (type) {
      case 'itemsStatus':
      case 'categoryWise':
        // Convert status data to chart format
        const statusChartData = [
          { name: 'Active Items', value: data.count_of_active_items, color: '#22C55E' },
          { name: 'Inactive Items', value: data.count_of_inactive_items, color: '#EF4444' },
          { name: 'Critical Items', value: data.count_of_critical_items, color: '#F97316' },
          { name: 'Non-Critical Items', value: data.count_of_non_critical_items, color: '#3B82F6' }
        ];

        return (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => value > 0 ? `${value}` : ''}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4 flex-wrap">
              {statusChartData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'greenConsumption':
      case 'consumptionReportNonGreen':
        if (!data.response || !Array.isArray(data.response)) {
          return <div>No consumption data available</div>;
        }

        return (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Product</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unit</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Opening</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Addition</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Consumption</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Current Stock</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cost</th>
                </tr>
              </thead>
              <tbody>
                {data.response.map((row: any, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-600">{row.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{row.product}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{row.unit}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{row.opening}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{row.addition}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{row.consumption}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{row.current_stock}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">${row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'consumptionReportGreen':
        if (!data.response) {
          return <div>No consumption report data available</div>;
        }

        const consumptionData = Object.entries(data.response).map(([product, value]) => ({
          name: product,
          value: value
        }));

        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={consumptionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22C55E" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'currentMinimumStockNonGreen':
      case 'currentMinimumStockGreen':
        if (!data.response || !Array.isArray(data.response)) {
          return <div>No stock data available</div>;
        }

        return (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Product</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Current Stock</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Minimum Stock</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.response.map((item: any, index: number) => {
                  const productName = Object.keys(item)[0];
                  const productData = item[productName];
                  const isLowStock = productData.Current_Stock < parseInt(productData.Minimum_Stock);
                  
                  return (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 text-sm text-gray-600">{productName}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{productData.Current_Stock}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{productData.Minimum_Stock}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          isLowStock 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {isLowStock ? 'Low Stock' : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#C72030]">{title}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={downloadLoading || !dateRange}
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
      {renderContent()}
    </div>
  );
};

export default InventoryAnalyticsCard;