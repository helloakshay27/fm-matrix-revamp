import React, { useEffect, useState } from 'react';
import { ITEM_STATUS_COLORS, ANALYTICS_PALETTE, CATEGORY_BAR_COLOR, LINE_CHART_COLORS, getPaletteColor } from '@/styles/chartPalette';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList, LineChart, Line, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Info, RefreshCw } from 'lucide-react';
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
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [localData, setLocalData] = useState<any>(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
  };

  const handleDownload = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!dateRange) {
      toast.error('Date range is required for download');
      return;
    }

    if (downloadLoading) return;
    
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
    const showDownload = !['itemsStatus', 'categoryWise'].includes(type);
    return (
      <div className={`relative bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#C72030]">{title}</h3>
          {showDownload && (
            <div
              className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDownload(e);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {downloadLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
              ) : (
                <Download className="w-4 h-4 text-gray-600 hover:text-blue-600" />
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center h-32 text-gray-500">
          No data available
        </div>
        {downloadLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center gap-3 text-white">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm font-medium">Exporting...</span>
            </div>
          </div>
        )}
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
                <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-[#D5DbDB] to-[#C4b89D]"></span>
                <span className="font-medium text-gray-700">Monthly Cost</span>
              </div>
              <div className="text-sm font-semibold text-gray-800">Total: <span className="text-[#C72030]">{currency}{total}</span></div>
            </div>
            <div className="w-full h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 48 }} barCategoryGap={20}>
                  <defs>
                    <linearGradient id="invCostBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D5DbDB" />
                      <stop offset="100%" stopColor="#C4b89D" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    tickLine={false}
                    label={{ value: 'Month', position: 'bottom', offset: 10, fill: '#374151', fontSize: 12 }}
                  />
                  <YAxis
                    domain={yDomain}
                    tickFormatter={(v) => `${currency}${formatNumber(v)}`}
                    tick={{ fontSize: 11 }}
                    width={70}
                    label={{ value: `Cost (${currency})`, angle: -90, position: 'insideLeft', offset: 8, fill: '#374151', fontSize: 12 }}
                  />
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
        if (!localData?.response || !Array.isArray(localData.response)) {
          return <div>No consumption data available</div>;
        }
        // Responsive rendering: cards on small screens, table on >=sm
        return (
          <div className="w-full">
            {/* Mobile: Stacked cards */}
            <div className="block sm:hidden space-y-2">
              {localData.response.map((row: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-md p-3 bg-white">
                  {/* <div className="flex items-center justify-between text-[13px]">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium text-gray-900">{row.date}</span>
                  </div> */}
                  <div className="mt-1 text-[13px]">
                    <div className="text-gray-500">Product</div>
                    <div className="font-medium text-gray-900 break-words">{row.product}</div>
                  </div>
                  <div className="mt-1 grid grid-cols-2 gap-2 text-[13px]">
                    <div>
                      <div className="text-gray-500">Unit</div>
                      <div className="font-medium text-gray-900">{row.unit}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Current Stock</div>
                      <div className="font-medium text-gray-900">{row.current_stock}</div>
                    </div>
                  </div>
                  <div className="mt-1 grid grid-cols-3 gap-2 text-[13px]">
                    <div>
                      <div className="text-gray-500">Opening</div>
                      <div className="font-medium text-gray-900">{row.opening}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Addition</div>
                      <div className="font-medium text-gray-900">{row.addition}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Consumption</div>
                      <div className="font-medium text-gray-900">{row.consumption}</div>
                    </div>
                  </div>
                  <div className="mt-1 grid grid-cols-2 gap-2 text-[13px]">
                    <div>
                      <div className="text-gray-500">Cost/Unit</div>
                      <div className="font-medium text-gray-900">{row.cost_per_unit}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Total Cost</div>
                      <div className="font-medium text-gray-900">{row.cost}</div>
                    </div>
                  </div>
                </div>
              ))}
              {/* {localData?.info?.info && (
                <div className="mt-2 text-xs text-gray-500">{localData.info.info}</div>
              )} */}
            </div>

            {/* Tablet/Desktop: Scrollable table */}
            <div className="hidden sm:block overflow-x-auto">
              <div className="rounded border border-gray-200">
                <table className="min-w-[900px] md:min-w-full table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-28 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Date</th>
                      <th className="w-64 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Product</th>
                      <th className="w-24 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Unit</th>
                      <th className="w-24 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Opening</th>
                      <th className="w-24 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Addition</th>
                      <th className="w-28 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Consumption</th>
                      <th className="w-28 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Current Stock</th>
                      <th className="w-24 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Cost/Unit</th>
                      <th className="w-24 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localData.response.map((row: any, index: number) => (
                      <tr key={index} className="border-t odd:bg-white even:bg-gray-50 hover:bg-gray-100/60 transition-colors">
                        <td className="w-28 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 whitespace-nowrap">{row.date}</td>
                        <td className="w-64 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-800 break-words">{row.product}</td>
                        <td className="w-24 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700">{row.unit}</td>
                        <td className="w-24 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700">{row.opening}</td>
                        <td className="w-24 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700">{row.addition}</td>
                        <td className="w-28 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700">{row.consumption}</td>
                        <td className="w-28 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700">{row.current_stock}</td>
                        <td className="w-24 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700">{row.cost_per_unit}</td>
                        <td className="w-24 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700">{row.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* {data.info?.info && (
                <div className="mt-2 text-xs text-gray-500">{data.info.info}</div>
              )} */}
            </div>
          </div>
        );
      }

      case 'itemsStatus': {
        // Convert status data to chart format with safe fallbacks
        // Chart colors requested: Critical #8B7355, Non-Critical #DBC2A9, Eco-friendly #d1d5db
        const statusChartData = [
          { name: 'Active', value: Number(data?.count_of_active_items) || 0, color: ITEM_STATUS_COLORS.active },
          { name: 'Inactive', value: Number(data?.count_of_inactive_items) || 0, color: ITEM_STATUS_COLORS.inactive },
          { name: 'Critical', value: Number(data?.count_of_critical_items) || 0, color: '#8B7355' },
          { name: 'Non-Critical', value: Number(data?.count_of_non_critical_items) || 0, color: '#DBC2A9' },
          { name: 'Eco-friendly', value: Number(data?.eco_friendly) || 0, color: '#d1d5db' }
        ];
        const total = Number(data?.total_items) || statusChartData.reduce((sum, item) => sum + (item.value || 0), 0);
        const withPct = statusChartData.map((s) => ({
          ...s,
          pct: total > 0 ? Math.round((s.value / total) * 100) : 0,
        }));

        return (
          <div className="w-full h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Donut with centered total */}
              <div className="relative mx-auto">
                <ResponsiveContainer width={240} height={240}>
                  <PieChart>
                    <Pie
                      data={withPct}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      isAnimationActive={false}
                      stroke="#fff"
                    >
                      {withPct.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string, props: any) => [`${value}`, withPct[props.index]?.name]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-gray-900 leading-tight">{total}</div>
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Total Items</div>
                  </div>
                </div>
              </div>

              {/* Legend with counts and tiny progress (includes eco-friendly) */}
              <div className="space-y-3 w-full">
                {withPct.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      <span className="ml-auto text-sm font-semibold text-gray-900">{item.value}</span>
                      <span className="text-xs text-gray-500 w-10 text-right">{item.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded">
                      <div className="h-1.5 rounded" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'categoryWise': {
        // Show a bar chart for category_wise using category_counts
        const categoryData = Array.isArray(localData?.category_counts) ? localData.category_counts : [];
        return (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="group_name"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={80}
                  label={{ value: 'Category', position: 'bottom', offset: 10, fill: '#374151', fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  label={{
                    value: 'Stock Count',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 8,
                    fill: '#374151',
                    fontSize: 12,
                  }}
                />
                <Tooltip />
                <Bar dataKey="item_count" fill="#d1d5db" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4 flex-wrap">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#d1d5db' }}></div>
                  <span className="text-sm font-medium text-gray-700">{item.group_name}: {item.item_count}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'greenConsumption': {
        // Show a table for green_consumption using the API response
        if (!localData?.response || !Array.isArray(localData.response)) {
          return <div>No consumption data available</div>;
        }
        // Responsive rendering: cards on small screens, table on >=sm
        return (
          <div className="w-full">
            {/* Mobile: Stacked cards */}
            <div className="block sm:hidden space-y-2">
              {localData.response.map((row: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-md p-3 bg-white">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium text-gray-900">{row.date}</span>
                  </div>
                  <div className="mt-1 text-[13px]">
                    <div className="text-gray-500">Product</div>
                    <div className="font-medium text-gray-900 break-words">{row.product}</div>
                  </div>
                  <div className="mt-1 grid grid-cols-2 gap-2 text-[13px]">
                    <div>
                      <div className="text-gray-500">Unit</div>
                      <div className="font-medium text-gray-900">{row.unit}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Current Stock</div>
                      <div className="font-medium text-gray-900">{row.current_stock}</div>
                    </div>
                  </div>
                  <div className="mt-1 grid grid-cols-3 gap-2 text-[13px]">
                    <div>
                      <div className="text-gray-500">Opening</div>
                      <div className="font-medium text-gray-900">{row.opening}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Addition</div>
                      <div className="font-medium text-gray-900">{row.addition}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Consumption</div>
                      <div className="font-medium text-gray-900">{row.consumption}</div>
                    </div>
                  </div>
                  <div className="mt-1 grid grid-cols-2 gap-2 text-[13px]">
                    <div>
                      <div className="text-gray-500">Cost/Unit</div>
                      <div className="font-medium text-gray-900">{row.cost_per_unit}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Total Cost</div>
                      <div className="font-medium text-gray-900">{row.cost}</div>
                    </div>
                  </div>
                </div>
              ))}
              {localData?.info?.info && (
                <div className="mt-2 text-xs text-gray-500">{localData.info.info}</div>
              )}
            </div>

            {/* Tablet/Desktop: Scrollable table */}
            <div className="hidden sm:block overflow-x-auto">
              <div className="rounded border border-gray-200">
                <table className="min-w-[900px] md:min-w-full table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-28 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Date</th>
                      <th className="w-64 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Product</th>
                      <th className="w-24 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Unit</th>
                      <th className="w-24 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Opening</th>
                      <th className="w-24 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Addition</th>
                      <th className="w-28 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Consumption</th>
                      <th className="w-28 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Current Stock</th>
                      <th className="w-24 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Cost/Unit</th>
                      <th className="w-24 px-3 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localData.response.map((row: any, index: number) => (
                      <tr key={index} className="border-t odd:bg-white even:bg-gray-50 hover:bg-gray-100/60 transition-colors">
                        <td className="w-28 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 whitespace-nowrap">{row.date}</td>
                        <td className="w-64 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-800 break-words">{row.product}</td>
                        <td className="w-24 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700">{row.unit}</td>
                        <td className="w-24 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700">{row.opening}</td>
                        <td className="w-24 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700">{row.addition}</td>
                        <td className="w-28 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700">{row.consumption}</td>
                        <td className="w-28 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700">{row.current_stock}</td>
                        <td className="w-24 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700">{row.cost_per_unit}</td>
                        <td className="w-24 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700">{row.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* {localData?.info?.info && (
                <div className="mt-2 text-xs text-gray-500">{localData.info.info}</div>
              )} */}
            </div>
          </div>
        );
      }

      case 'consumptionReportGreen': {
        // Show a bar chart and info for consumption_report_green using the API response
        if (!localData?.response || typeof localData.response !== 'object') {
          return <div>No consumption report data available</div>;
        }
        const consumptionData = Object.entries(localData.response).map(([product, value]) => ({
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
                <Bar dataKey="value" fill="#C4B99D" />
              </BarChart>
            </ResponsiveContainer>
            {/* Info section */}
            {localData?.info?.info && (
              <div className="mt-4 text-xs text-gray-500">{localData.info.info}</div>
            )}
          </div>
        );
      }

      case 'currentMinimumStockNonGreen': {
        if (!data.response || !Array.isArray(data.response)) {
          return <div>No minimum stock data available</div>;
        }
        const chartRows = data.response.map((item: any) => {
          const product = Object.keys(item)[0];
          const stock = item[product];
          return {
            product,
            current: Number(stock.Current_Stock) || 0,
            minimum: Number(stock.Minimum_Stock) || 0
          };
        });
        const hasValues = chartRows.some(r => r.current || r.minimum);
        const maxValNG = Math.max(0, ...chartRows.map(r => Math.max(r.current, r.minimum)));
        const yDomainNG = [0, maxValNG === 0 ? 10 : Math.ceil(maxValNG * 1.1)];

        const renderValueLabelNG = (props: any) => {
          const { x, y, value } = props;
          if (value == null) return null;
          if (chartRows.length > 25) return null;
            return <text x={x} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill="#111">{value}</text>;
        };

        return (
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartRows} margin={{ top: 10, right: 30, left: 50, bottom: 50 }}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="product" angle={-30} textAnchor="end" interval={0} height={70} tick={{ fontSize: 12, fill: '#374151' }} />
                <YAxis width={80} domain={yDomainNG} allowDecimals={false} tick={{ fontSize: 12, fill: '#374151' }} label={{ value: 'Stock', angle: -90, position: 'insideLeft', offset: 8, fill: '#374151', fontSize: 12 }} />
                <Tooltip formatter={(v:number) => v} cursor={{ stroke: '#9ca3af', strokeDasharray: '4 4' }} />
                <Legend verticalAlign="bottom" align="center" height={32} iconType="square" wrapperStyle={{ paddingTop: 12 }} />
                <Line type="monotone" dataKey="minimum" name="Minimum Stock" stroke="#D5DbDB" strokeWidth={2} dot={{ r: 4, fill: '#D5DbDB', stroke: '#ffffff', strokeWidth: 1 }} activeDot={{ r: 6 }} strokeDasharray="4 2" label={renderValueLabelNG} />
                <Line type="monotone" dataKey="current" name="Current Stock" stroke={LINE_CHART_COLORS.current} strokeWidth={2} dot={{ r: 5, fill: LINE_CHART_COLORS.current, stroke: '#ffffff', strokeWidth: 1 }} activeDot={{ r: 7 }} label={renderValueLabelNG} />
              </LineChart>
            </ResponsiveContainer>
            {!hasValues && (
              <div className="text-xs text-center text-gray-500 mt-2">All values are zero for the selected range.</div>
            )}
            {data.info?.info && (
              <div className="mt-2 text-xs text-gray-500">{data.info.info}</div>
            )}
          </div>
        );
      }
      case 'currentMinimumStockGreen': {
        if (!data.response || !Array.isArray(data.response)) {
          return <div>No minimum stock data available</div>;
        }
        // Transform into chart-friendly dataset
        const chartRows = data.response.map((item: any) => {
          const product = Object.keys(item)[0];
          const stock = item[product];
          return {
            product,
            current: Number(stock.Current_Stock) || 0,
            minimum: Number(stock.Minimum_Stock) || 0
          };
        });
        const hasValues = chartRows.some(r => r.current || r.minimum);
        const maxVal = Math.max(0, ...chartRows.map(r => Math.max(r.current, r.minimum)));
        const yDomain = [0, maxVal === 0 ? 10 : Math.ceil(maxVal * 1.1)];

        // Custom label renderer (avoid clutter if many points)
        const renderValueLabel = (props: any) => {
          const { x, y, value, index } = props;
          if (value == null) return null;
            // Skip labels if too many points
          if (chartRows.length > 25) return null;
          return (
            <text x={x} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill="#111">{value}</text>
          );
        };

        return (
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartRows} margin={{ top: 10, right: 30, left: 50, bottom: 50 }}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="product" angle={-30} textAnchor="end" interval={0} height={70} tick={{ fontSize: 12, fill: '#374151' }} />
                <YAxis width={80} domain={yDomain} allowDecimals={false} tick={{ fontSize: 12, fill: '#374151' }} label={{ value: 'Stock', angle: -90, position: 'insideLeft', offset: 8, fill: '#374151', fontSize: 12 }} />
                <Tooltip formatter={(v:number) => v} cursor={{ stroke: '#9ca3af', strokeDasharray: '4 4' }} />
                <Legend verticalAlign="bottom" align="center" height={32} iconType="square" wrapperStyle={{ paddingTop: 12 }} />
                <Line type="monotone" dataKey="minimum" name="Minimum Stock" stroke="#D5DbDB" strokeWidth={2} dot={{ r: 4, fill: '#D5DbDB', stroke: '#ffffff', strokeWidth: 1 }} activeDot={{ r: 6 }} strokeDasharray="4 2" label={renderValueLabel} />
                <Line type="monotone" dataKey="current" name="Current Stock" stroke={LINE_CHART_COLORS.current} strokeWidth={2} dot={{ r: 5, fill: LINE_CHART_COLORS.current, stroke: '#ffffff', strokeWidth: 1 }} activeDot={{ r: 7 }} label={renderValueLabel} />
              </LineChart>
            </ResponsiveContainer>
            {!hasValues && (
              <div className="text-xs text-center text-gray-500 mt-2">All values are zero for the selected range.</div>
            )}
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
  <div className={`relative bg-white rounded-lg border border-gray-200 p-4 shadow-sm h-[420px] flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-lg font-bold text-[#C72030]">{title}</h3>
        <div className="flex items-center gap-2">
          {type === 'greenConsumption' && (
            <>
              {/* Info tooltip icon */}
              <div
                className="p-1 rounded hover:bg-gray-100 transition-colors cursor-default"
                title={localData?.info?.info || ''}
              >
                <Info className="w-4 h-4 text-gray-600" />
              </div>
              {/* Refresh icon */}
              <div
                className={`p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer ${refreshLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (refreshLoading) return;
                  try {
                    if (!dateRange) {
                      toast.error('Date range is required to refresh');
                      return;
                    }
                    const baseUrl = localStorage.getItem('baseUrl');
                    const token = localStorage.getItem('token');
                    const siteId = localStorage.getItem('selectedSiteId') || '0';
                    if (!baseUrl || !token) {
                      toast.error('Missing base URL or token');
                      return;
                    }
                    const from = dateRange.startDate.toISOString().slice(0, 10);
                    const to = dateRange.endDate.toISOString().slice(0, 10);
                    const url = `https://${baseUrl}/pms/inventories/inventory_consumption_green.json?site_id=${siteId}&from_date=${from}&to_date=${to}&access_token=${encodeURIComponent(token)}`;
                    setRefreshLoading(true);
                    const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (!resp.ok) throw new Error('Failed to refresh data');
                    const json = await resp.json();
                    setLocalData(json);
                    toast.success('Green Consumption refreshed');
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to refresh');
                  } finally {
                    setRefreshLoading(false);
                  }
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                title="Refresh"
              >
                {refreshLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                )}
              </div>
            </>
          )}
          {type === 'categoryWise' && (
            <>
              {/* Info tooltip icon */}
              <div
                className="p-1 rounded hover:bg-gray-100 transition-colors cursor-default"
                title={localData?.info || ''}
              >
                <Info className="w-4 h-4 text-gray-600" />
              </div>
              {/* Refresh icon */}
              <div
                className={`p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer ${refreshLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (refreshLoading) return;
                  try {
                    if (!dateRange) {
                      toast.error('Date range is required to refresh');
                      return;
                    }
                    const baseUrl = localStorage.getItem('baseUrl');
                    const token = localStorage.getItem('token');
                    const siteId = localStorage.getItem('selectedSiteId') || '0';
                    if (!baseUrl || !token) {
                      toast.error('Missing base URL or token');
                      return;
                    }
                    const from = dateRange.startDate.toISOString().slice(0, 10);
                    const to = dateRange.endDate.toISOString().slice(0, 10);
                    const url = `https://${baseUrl}/pms/inventories/category_wise_items.json?site_id=${siteId}&from_date=${from}&to_date=${to}&access_token=${encodeURIComponent(token)}`;
                    setRefreshLoading(true);
                    const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (!resp.ok) throw new Error('Failed to refresh data');
                    const json = await resp.json();
                    setLocalData(json);
                    toast.success('Category Wise Items refreshed');
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to refresh');
                  } finally {
                    setRefreshLoading(false);
                  }
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                title="Refresh"
              >
                {refreshLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                )}
              </div>
            </>
          )}
          {type === 'inventoryCostOverMonth' && (
            <>
              <div
                className="p-1 rounded hover:bg-gray-100 transition-colors cursor-default"
                title={localData?.info?.info || ''}
              >
                <Info className="w-4 h-4 text-gray-600" />
              </div>
              <div
                className={`p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer ${refreshLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (refreshLoading) return;
                  try {
                    if (!dateRange) {
                      toast.error('Date range is required to refresh');
                      return;
                    }
                    const baseUrl = localStorage.getItem('baseUrl');
                    const token = localStorage.getItem('token');
                    const siteId = localStorage.getItem('selectedSiteId') || '0';
                    if (!baseUrl || !token) {
                      toast.error('Missing base URL or token');
                      return;
                    }
                    const from = dateRange.startDate.toISOString().slice(0, 10);
                    const to = dateRange.endDate.toISOString().slice(0, 10);
                    const url = `https://${baseUrl}/pms/inventories/card_inventory_cost_over_month.json?site_id=${siteId}&from_date=${from}&to_date=${to}&access_token=${encodeURIComponent(token)}`;
                    setRefreshLoading(true);
                    const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (!resp.ok) throw new Error('Failed to refresh data');
                    const json = await resp.json();
                    setLocalData(json);
                    toast.success('Inventory Cost Over Month refreshed');
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to refresh');
                  } finally {
                    setRefreshLoading(false);
                  }
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                title="Refresh"
              >
                {refreshLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                )}
              </div>
            </>
          )}
          {type === 'consumptionReportGreen' && (
            <>
              <div
                className="p-1 rounded hover:bg-gray-100 transition-colors cursor-default"
                title={localData?.info?.info || ''}
              >
                <Info className="w-4 h-4 text-gray-600" />
              </div>
              <div
                className={`p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer ${refreshLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (refreshLoading) return;
                  try {
                    if (!dateRange) {
                      toast.error('Date range is required to refresh');
                      return;
                    }
                    const baseUrl = localStorage.getItem('baseUrl');
                    const token = localStorage.getItem('token');
                    const siteId = localStorage.getItem('selectedSiteId') || '0';
                    if (!baseUrl || !token) {
                      toast.error('Missing base URL or token');
                      return;
                    }
                    const from = dateRange.startDate.toISOString().slice(0, 10);
                    const to = dateRange.endDate.toISOString().slice(0, 10);
                    const url = `https://${baseUrl}/pms/inventories/consumption_report_green.json?site_id=${siteId}&from_date=${from}&to_date=${to}&access_token=${encodeURIComponent(token)}`;
                    setRefreshLoading(true);
                    const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (!resp.ok) throw new Error('Failed to refresh data');
                    const json = await resp.json();
                    setLocalData(json);
                    toast.success('Consumption Report (Green) refreshed');
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to refresh');
                  } finally {
                    setRefreshLoading(false);
                  }
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                title="Refresh"
              >
                {refreshLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                )}
              </div>
            </>
          )}
          {type === 'consumptionReportNonGreen' && (
            <>
              <div
                className="p-1 rounded hover:bg-gray-100 transition-colors cursor-default"
                title={localData?.info?.info || ''}
              >
                <Info className="w-4 h-4 text-gray-600" />
              </div>
              <div
                className={`p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer ${refreshLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (refreshLoading) return;
                  try {
                    if (!dateRange) {
                      toast.error('Date range is required to refresh');
                      return;
                    }
                    const baseUrl = localStorage.getItem('baseUrl');
                    const token = localStorage.getItem('token');
                    const siteId = localStorage.getItem('selectedSiteId') || '0';
                    if (!baseUrl || !token) {
                      toast.error('Missing base URL or token');
                      return;
                    }
                    const from = dateRange.startDate.toISOString().slice(0, 10);
                    const to = dateRange.endDate.toISOString().slice(0, 10);
                    const url = `https://${baseUrl}/pms/inventories/consumption_report_non_green.json?site_id=${siteId}&from_date=${from}&to_date=${to}&access_token=${encodeURIComponent(token)}`;
                    setRefreshLoading(true);
                    const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (!resp.ok) throw new Error('Failed to refresh data');
                    const json = await resp.json();
                    setLocalData(json);
                    toast.success('Consumption Report (Non-Green) refreshed');
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to refresh');
                  } finally {
                    setRefreshLoading(false);
                  }
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                title="Refresh"
              >
                {refreshLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                )}
              </div>
            </>
          )}
          {type === 'currentMinimumStockGreen' && (
            <>
              <div
                className="p-1 rounded hover:bg-gray-100 transition-colors cursor-default"
                title={`${localData?.info?.current_stock_info || ''} ${localData?.info?.minimum_stock_info || ''}`.trim()}
              >
                <Info className="w-4 h-4 text-gray-600" />
              </div>
              <div
                className={`p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer ${refreshLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (refreshLoading) return;
                  try {
                    if (!dateRange) {
                      toast.error('Date range is required to refresh');
                      return;
                    }
                    const baseUrl = localStorage.getItem('baseUrl');
                    const token = localStorage.getItem('token');
                    const siteId = localStorage.getItem('selectedSiteId') || '0';
                    if (!baseUrl || !token) {
                      toast.error('Missing base URL or token');
                      return;
                    }
                    const from = dateRange.startDate.toISOString().slice(0, 10);
                    const to = dateRange.endDate.toISOString().slice(0, 10);
                    const url = `https://${baseUrl}/pms/inventories/current_minimum_stock_green.json?site_id=${siteId}&from_date=${from}&to_date=${to}&access_token=${encodeURIComponent(token)}`;
                    setRefreshLoading(true);
                    const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (!resp.ok) throw new Error('Failed to refresh data');
                    const json = await resp.json();
                    setLocalData(json);
                    toast.success('Current Minimum Stock (Green) refreshed');
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to refresh');
                  } finally {
                    setRefreshLoading(false);
                  }
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                title="Refresh"
              >
                {refreshLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                )}
              </div>
            </>
          )}
          {type === 'currentMinimumStockNonGreen' && (
            <>
              <div
                className="p-1 rounded hover:bg-gray-100 transition-colors cursor-default"
                title={`${localData?.info?.current_stock_info || ''} ${localData?.info?.minimum_stock_info || ''}`.trim()}
              >
                <Info className="w-4 h-4 text-gray-600" />
              </div>
              <div
                className={`p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer ${refreshLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (refreshLoading) return;
                  try {
                    if (!dateRange) {
                      toast.error('Date range is required to refresh');
                      return;
                    }
                    const baseUrl = localStorage.getItem('baseUrl');
                    const token = localStorage.getItem('token');
                    const siteId = localStorage.getItem('selectedSiteId') || '0';
                    if (!baseUrl || !token) {
                      toast.error('Missing base URL or token');
                      return;
                    }
                    const from = dateRange.startDate.toISOString().slice(0, 10);
                    const to = dateRange.endDate.toISOString().slice(0, 10);
                    const url = `https://${baseUrl}/pms/inventories/current_minimum_stock_non_green.json?site_id=${siteId}&from_date=${from}&to_date=${to}&access_token=${encodeURIComponent(token)}`;
                    setRefreshLoading(true);
                    const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (!resp.ok) throw new Error('Failed to refresh data');
                    const json = await resp.json();
                    setLocalData(json);
                    toast.success('Current Minimum Stock (Non-Green) refreshed');
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to refresh');
                  } finally {
                    setRefreshLoading(false);
                  }
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                title="Refresh"
              >
                {refreshLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                )}
              </div>
            </>
          )}
          {type === 'itemsStatus' && (
            <>
              <div
                className="p-1 rounded hover:bg-gray-100 transition-colors cursor-default"
                title={localData?.info || ''}
              >
                <Info className="w-4 h-4 text-gray-600" />
              </div>
              <div
                className={`p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer ${refreshLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (refreshLoading) return;
                  try {
                    if (!dateRange) {
                      toast.error('Date range is required to refresh');
                      return;
                    }
                    const baseUrl = localStorage.getItem('baseUrl');
                    const token = localStorage.getItem('token');
                    const siteId = localStorage.getItem('selectedSiteId') || '0';
                    if (!baseUrl || !token) {
                      toast.error('Missing base URL or token');
                      return;
                    }
                    const from = dateRange.startDate.toISOString().slice(0, 10);
                    const to = dateRange.endDate.toISOString().slice(0, 10);
                    const url = `https://${baseUrl}/pms/inventories/items_status.json?site_id=${siteId}&from_date=${from}&to_date=${to}&access_token=${encodeURIComponent(token)}`;
                    setRefreshLoading(true);
                    const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (!resp.ok) throw new Error('Failed to refresh data');
                    const json = await resp.json();
                    setLocalData(json);
                    toast.success('Items Status refreshed');
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to refresh');
                  } finally {
                    setRefreshLoading(false);
                  }
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                title="Refresh"
              >
                {refreshLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                )}
              </div>
            </>
          )}
          {!['itemsStatus', 'categoryWise'].includes(type) && (
            <div
              className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDownload(e);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {downloadLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
              ) : (
                <Download className="w-4 h-4 text-gray-600 hover:text-blue-600" />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden relative">
        {refreshLoading ? (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-30 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-[#C72030]" />
              <span className="text-sm font-semibold text-gray-700">Refreshing data...</span>
            </div>
          </div>
        ) : null}
        {!refreshLoading && (
          <div className="h-full overflow-y-auto pr-1 custom-scrollbar">
            {renderContent()}
          </div>
        )}
      </div>
      {downloadLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center gap-3 text-white">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm font-medium">Exporting...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryAnalyticsCard;