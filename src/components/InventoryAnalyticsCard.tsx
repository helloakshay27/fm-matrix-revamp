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

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
  };

  const handleDownload = async () => {
    if (!dateRange) {
      toast.error('Date range is required for download');
      return;
    }

    const formattedStart = formatDate(dateRange.startDate);
    const formattedEnd = formatDate(dateRange.endDate);

    setDownloadLoading(true);
    try {
      switch (type) {
        case 'itemsStatus':
          await inventoryAnalyticsDownloadAPI.downloadItemsStatusData(formattedStart, formattedEnd);
          toast.success('Items status data downloaded successfully');
          break;
        case 'categoryWise':
          await inventoryAnalyticsDownloadAPI.downloadCategoryWiseData(formattedStart, formattedEnd);
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

      case 'itemsStatus': {
        // Convert status data to chart format
        const statusChartData = [
          { name: 'Active', value: data.count_of_active_items, color: '#22C55E' },
          { name: 'Inactive', value: data.count_of_inactive_items, color: '#EF4444' },
          { name: 'Critical', value: data.count_of_critical_items, color: '#F97316' },
          { name: 'Non-Critical', value: data.count_of_non_critical_items, color: '#3B82F6' }
        ];
        const total = statusChartData.reduce((sum, item) => sum + (item.value || 0), 0);
        // Custom label for PieChart to show value outside the arc
        const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, value, index }) => {
          if (!value) return null;
          const RADIAN = Math.PI / 180;
          const radius = outerRadius + 18; // smaller offset for smaller chart
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);
          return (
            <text
              x={x}
              y={y}
              fill="#222"
              textAnchor={x > cx ? 'start' : 'end'}
              dominantBaseline="central"
              fontSize={15}
              fontWeight={700}
              stroke="#fff"
              strokeWidth={0.5}
            >
              {value}
            </text>
          );
        };
        return (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="p-6 w-full flex flex-col items-center">
              <div className="text-2xl font-bold text-gray-800 mb-2">Total Items: {total}</div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
                <ResponsiveContainer width={170} height={170}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey="value"
                      label={renderCustomLabel}
                      stroke="#fff"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string, props: any) => [`${value}`, statusChartData[props.index]?.name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-3 min-w-[160px]">
                  {statusChartData.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-base font-medium text-gray-700">{item.name}</span>
                      <span className="ml-auto text-base font-semibold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'categoryWise': {
        // Show a bar chart for category_wise using category_counts
        const categoryData = Array.isArray(data.category_counts) ? data.category_counts : [];
        return (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="group_name" angle={-45} textAnchor="end" interval={0} height={80} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="item_count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4 flex-wrap">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#3B82F6' }}></div>
                  <span className="text-sm font-medium text-gray-700">{item.group_name}: {item.item_count}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'greenConsumption': {
        // Show a table for green_consumption using the API response
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
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cost/Unit</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Cost</th>
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
                    <td className="px-4 py-2 text-sm text-gray-600">{row.cost_per_unit}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Info section */}
            {data.info?.info && (
              <div className="mt-4 text-xs text-gray-500">{data.info.info}</div>
            )}
          </div>
        );
      }

      case 'consumptionReportGreen': {
        // Show a bar chart and info for consumption_report_green using the API response
        if (!data.response || typeof data.response !== 'object') {
          return <div>No consumption report data available</div>;
        }
        const consumptionData = Object.entries(data.response).map(([product, value]) => ({
          name: product,
          value: value
        }));
        return (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={consumptionData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
            {/* Info section */}
            {data.info?.info && (
              <div className="mt-4 text-xs text-gray-500">{data.info.info}</div>
            )}
          </div>
        );
      }

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