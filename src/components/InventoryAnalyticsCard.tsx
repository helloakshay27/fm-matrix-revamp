import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { inventoryAnalyticsDownloadAPI } from '@/services/inventoryAnalyticsDownloadAPI';
import { toast } from 'sonner';

interface InventoryAnalyticsCardProps {
  title: string;
  data: any;
  type?: 'itemsStatus' | 'categoryWise' | 'greenConsumption' | 'consumptionReportGreen' | 'consumptionReportNonGreen' | 'inventoryConsumptionNonGreen' | 'currentMinimumStockNonGreen' | 'currentMinimumStockGreen' | 'inventoryCostOverMonth' | 'inventoryConsumptionOverSite';
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
  if (type === 'consumptionReportNonGreen') {
    console.log('[DEBUG] InventoryAnalyticsCard data for consumptionReportNonGreen:', data);
  }
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

    setDownloadLoading(true);
    try {
      switch (type) {
        case 'greenConsumption':
          await inventoryAnalyticsDownloadAPI.downloadGreenConsumptionExcel(dateRange.startDate, dateRange.endDate);
          toast.success('Green Consumption Excel downloaded successfully');
          break;
        case 'consumptionReportGreen':
          await inventoryAnalyticsDownloadAPI.downloadConsumptionReportGreenExcel(dateRange.startDate, dateRange.endDate);
          toast.success('Consumption Report Green Excel downloaded successfully');
          break;
        case 'consumptionReportNonGreen':
          await inventoryAnalyticsDownloadAPI.downloadConsumptionReportNonGreenExcel(dateRange.startDate, dateRange.endDate);
          toast.success('Consumption Report Non-Green Excel downloaded successfully');
          break;
        case 'itemsStatus':
          await inventoryAnalyticsDownloadAPI.downloadItemsStatusData(dateRange.startDate, dateRange.endDate);
          toast.success('Items status data downloaded successfully');
          break;
        case 'categoryWise':
          await inventoryAnalyticsDownloadAPI.downloadCategoryWiseData(dateRange.startDate, dateRange.endDate);
          toast.success('Category wise data downloaded successfully');
          break;
        case 'inventoryCostOverMonth':
          await inventoryAnalyticsDownloadAPI.downloadInventoryCostOverMonthExcel(dateRange.startDate, dateRange.endDate);
          toast.success('Inventory Cost Over Month Excel downloaded successfully');
          break;
        case 'inventoryConsumptionOverSite':
          await inventoryAnalyticsDownloadAPI.downloadInventoryConsumptionOverSiteExcel(dateRange.startDate, dateRange.endDate);
          toast.success('Inventory Consumption Over Site Excel downloaded successfully');
          break;
        case 'currentMinimumStockGreen':
          await inventoryAnalyticsDownloadAPI.downloadCurrentMinimumStockGreenExcel(dateRange.startDate, dateRange.endDate);
          toast.success('Current Minimum Stock Green Excel downloaded successfully');
          break;
        case 'currentMinimumStockNonGreen':
          await inventoryAnalyticsDownloadAPI.downloadCurrentMinimumStockNonGreenExcel(dateRange.startDate, dateRange.endDate);
          toast.success('Current Minimum Stock Non-Green Excel downloaded successfully');
          break;
        case 'inventoryConsumptionNonGreen':
          await inventoryAnalyticsDownloadAPI.downloadInventoryConsumptionNonGreenExcel(dateRange.startDate, dateRange.endDate);
          toast.success('Inventory Consumption Non-Green Excel downloaded successfully');
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
      case 'inventoryConsumptionOverSite': {
        // Render each site as a small box with consumption value, compact UI
        if (!data.response || typeof data.response !== 'object') {
          return <div>No site consumption data available</div>;
        }
        const sites = Object.entries(data.response);
        return (
          <div className="flex flex-wrap gap-2 min-h-[60px]">
            {sites.map(([site, value]: [string, any], idx: number) => (
              <div
                key={site}
                className="bg-[#f6f4ee] rounded shadow p-2 min-w-[70px] flex flex-col items-center h-[60px] justify-center"
                style={{ fontSize: '0.85rem' }}
              >
                <div className="font-semibold text-[#C72030] text-xs">{site}</div>
                <div className="font-bold text-gray-800 text-base mt-1">{value}</div>
              </div>
            ))}
          </div>
        );
      }
      case 'inventoryCostOverMonth': {
        // Bar chart view (improved UI)
        if (!data.response || typeof data.response !== 'object') return <div>No cost data available</div>;

        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const raw = Object.entries(data.response).map(([month, value]: [string, any]) => ({
          month,
          cost: Number(typeof value === 'object' && value ? (value.trend_over_month ?? value.cost ?? 0) : value) || 0
        })).sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

        const hasNonZero = raw.some(r => r.cost > 0);
        const dataPoints = hasNonZero ? raw.filter(r => r.cost > 0) : raw; // if all zero keep all for context
        const currency = localStorage.getItem('currency') || '₹';
        const total = dataPoints.reduce((s, d) => s + d.cost, 0);
        const max = Math.max(...dataPoints.map(d => d.cost), 0);
        const yDomain = [0, max === 0 ? 10 : max * 1.15];
        const short = dataPoints.length > 6; // use short month names if many
        const chartData = dataPoints.map(d => ({ ...d, label: short ? d.month.slice(0, 3) : d.month }));

        const formatNumber = (v: number) => {
          if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
          if (v >= 1_000) return (v / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
          return v.toString();
        };

        const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
          if (active && payload && payload.length) {
            return (
              <div className="bg-white border border-gray-200 rounded px-3 py-2 shadow-sm text-xs">
                <div className="font-semibold text-gray-700 mb-1">{label}</div>
                <div className="text-gray-600">Cost: <span className="font-medium text-gray-900">{currency}{payload[0].value}</span></div>
              </div>
            );
          }
          return null;
        };

        return (
          <div className="w-full space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-[#C72030] to-[#E84A4A]"></span>
                <span className="font-medium text-gray-700">Monthly Cost</span>
              </div>
              <div className="text-sm font-semibold text-gray-800">Total: <span className="text-[#C72030]">{currency}{total}</span></div>
            </div>
            <div className="w-full h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 40 }} barCategoryGap={20}>
                  <defs>
                    <linearGradient id="invCostBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E84A4A" />
                      <stop offset="100%" stopColor="#C72030" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} interval={0} tickLine={false} />
                  <YAxis domain={yDomain} tickFormatter={(v) => `${currency}${formatNumber(v)}`} tick={{ fontSize: 11 }} width={70} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="cost" fill="url(#invCostBar)" radius={[4, 4, 0, 0]} maxBarSize={50}>
                    <LabelList dataKey="cost" position="top" formatter={(v: number) => v ? `${currency}${formatNumber(v)}` : ''} className="text-[10px] fill-gray-800 font-medium" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {!hasNonZero && (
              <div className="text-xs text-gray-500 italic">No cost recorded in the selected period.</div>
            )}
          </div>
        );
      }
      case 'inventoryConsumptionNonGreen': {
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
                  <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Consumption</th>
                  <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Current Stock</th>
                  <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Cost/Unit</th>
                  <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Total Cost</th>
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
            {data.info?.info && (
              <div className="mt-4 text-xs text-gray-500">{data.info.info}</div>
            )}
          </div>
        );
      }
      case 'consumptionReportNonGreen': {
        if (!data.response || !Array.isArray(data.response)) {
          return <div>No consumption data available</div>;
        }
        // Scroll container similar to greenConsumption (≈5 rows visible)
        return (
          <div className="overflow-x-auto">
            <div className="max-h-[270px] overflow-y-auto rounded border border-gray-200">
              <table className="min-w-full table-auto">
                <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Product</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unit</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Opening</th>
                    <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Addition</th>
                    <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Consumption</th>
                    <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Current Stock</th>
                    <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Cost/Unit</th>
                    <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {data.response.map((row: any, index: number) => (
                    <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap">{row.date}</td>
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
            </div>
            {data.info?.info && (
              <div className="mt-2 text-xs text-gray-500">{data.info.info}</div>
            )}
          </div>
        );
      }

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
            <div className="text-2xl font-bold text-gray-800 mb-2">Total Items: {total}</div>
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
        // Approx row height (~44px) * 5 + header (~48px) => ~268px. Use max-h to allow shrink when fewer rows.
        return (
          <div className="overflow-x-auto">
            <div className="max-h-[270px] overflow-y-auto rounded border border-gray-200">
              <table className="min-w-full table-auto">
                <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Product</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unit</th>
                    <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Opening</th>
                    <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Addition</th>
                    <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Consumption</th>
                    <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Current Stock</th>
                    <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Cost/Unit</th>
                    <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {data.response.map((row: any, index: number) => (
                    <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap">{row.date}</td>
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
            </div>
            {data.info?.info && (
              <div className="mt-2 text-xs text-gray-500">{data.info.info}</div>
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
      case 'currentMinimumStockGreen': {
        // Render table for minimum stock, using the provided API response
        if (!data.response || !Array.isArray(data.response)) {
          return <div>No minimum stock data available</div>;
        }
        // Each item in response is an object with a single key (product name)
        const rows = data.response.map((item: any) => {
          const product = Object.keys(item)[0];
          const stock = item[product];
          return { product, ...stock };
        });
        // Scroll container: 5 rows (~44px each) + header ~48px => ~268px
        return (
          <div className="overflow-x-auto">
            <div className="max-h-[270px] overflow-y-auto rounded border border-gray-200">
              <table className="min-w-full table-auto">
                <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Product</th>
                    <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Current Stock</th>
                    <th className="px-4 py-2 text-left textsm font-medium text-gray-700">Minimum Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row: any, index: number) => (
                    <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-sm text-gray-600">{row.product}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{row.Current_Stock}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{row.Minimum_Stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.info?.info && (
              <div className="mt-2 text-xs text-gray-500">{data.info.info}</div>
            )}
          </div>
        );
      }

      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm h-[420px] flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4 shrink-0">
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
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto pr-1 custom-scrollbar">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default InventoryAnalyticsCard;