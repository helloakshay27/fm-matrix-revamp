import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Plus, Upload, Eye, Trash2, Loader2, X, BarChart3,
  Calendar, Filter, RefreshCw, Leaf, Activity, Download,
  Droplets, Percent, Package
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { WasteGenerationFilterDialog } from '../components/WasteGenerationFilterDialog';
import { WasteGenerationBulkDialog } from '../components/WasteGenerationBulkDialog';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { fetchWasteGenerations, WasteGeneration, WasteGenerationFilters, WasteGenerationCounts } from '../services/wasteGenerationAPI';
import { useLayout } from '@/contexts/LayoutContext';
import { API_CONFIG, getAuthHeader, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';
import { useUtilityEvents } from '@/components/PostHogUtilityEvents';
import { format, subYears } from 'date-fns';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Analytics Components
import { TicketAnalyticsFilterDialog } from "@/components/TicketAnalyticsFilterDialog";

import { AssetAnalyticsFilterDialog } from '@/components/AssetAnalyticsFilterDialog';

// ─── helpers ────────────────────────────────────────────────────────────────
const toApiDate = (ddmmyyyy: string) => {
  // "DD/MM/YYYY" → "YYYY-MM-DD"
  const [d, m, y] = ddmmyyyy.split('/');
  return `${y}-${m}-${d}`;
};

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(1)}K`
    : `${n}`;

// Palette for dynamic categories
const CHART_PALETTE = [
  '#C6B692', '#8B634B', '#C72030', '#4E9AF1', '#F5A623',
  '#7ED321', '#9B59B6', '#1ABC9C', '#E67E22', '#34495E',
];

// ─── Waste-Category chart (fully dynamic categories) ────────────────────────
interface WasteChartProps {
  data: Record<string, number | string>[];
  isLoading: boolean;
  onDownload: () => void;
  onEye: (categoryName: string) => void;
}

const WasteCategoryChart: React.FC<WasteChartProps> = ({ data, isLoading, onDownload, onEye }) => {
  interface TooltipPayloadEntry { dataKey: string; fill: string; value: number; }
  interface CustomTooltipProps { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string; }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm min-w-[160px]">
          <div className="flex items-center gap-4 mb-2">
            <p className="font-semibold text-gray-800 truncate max-w-[160px]">{label}</p>
          </div>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
            <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: p.fill }} />
            <span className="font-medium">{Number(p.value).toLocaleString('en-IN')} kg</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="shadow-md border-none hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Waste Category Wise Generation Breakdown (KG)
        </CardTitle>
        <button
          onClick={onDownload}
          className="p-1.5 rounded-md text-gray-500 hover:text-[#C72030] hover:bg-[#EDEAE3] transition-colors"
          title="Download CSV"
        >
          <Download className="w-4 h-4" />
        </button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin w-6 h-6 text-[#C72030]" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="site"
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={false}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6B7280' }}
                tickFormatter={fmt}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Waste (kg)" fill="#c4b99d" radius={[4, 4, 0, 0]}
                label={{ position: 'top', fontSize: 10, fill: '#6B7280', formatter: (v: number) => fmt(v) }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

// ─── Site detail modal ────────────────────────────────────────────────────────
interface SiteDetailModalProps {
  siteName: string | null;
  siteData: { category: string; value: number }[];
  onClose: () => void;
}

const SiteDetailModal: React.FC<SiteDetailModalProps> = ({ siteName, siteData, onClose }) => (
  <Dialog open={!!siteName} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{siteName} — Site-wise Breakdown</DialogTitle>
      </DialogHeader>
      <div className="space-y-3 mt-2">
        {siteData.map(({ category, value }) => (
          <div key={category} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
            <span className="text-sm font-medium text-gray-700">{category}</span>
            <span className="text-sm font-semibold text-gray-900">{value.toLocaleString('en-IN')} kg</span>
          </div>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

const UtilityWasteGenerationDashboard = () => {
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useLayout();
  const { shouldShow } = useDynamicPermissions();
  const panelRef = useRef<HTMLDivElement>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<WasteGenerationFilters>({});

  const { onUtilityWasteGenerationDashboardViewed } = useUtilityEvents();

  useEffect(() => {
    onUtilityWasteGenerationDashboardViewed();
  }, [onUtilityWasteGenerationDashboardViewed]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showActionPanel, setShowActionPanel] = useState(false);
  
  // API states
  const [wasteGenerations, setWasteGenerations] = useState<WasteGeneration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<WasteGenerationFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [listCounts, setListCounts] = useState<WasteGenerationCounts | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // ── Analytics States ─────────────────────────────────────────────────────
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);

  // default: today & 1 year ago
  const today = new Date();
  const oneYearAgo = subYears(today, 1);
 const [analyticsDateRange, setAnalyticsDateRange] = useState({
  startDate: oneYearAgo,
  endDate: today,
});

  // KPI card data
  const [kpiData, setKpiData] = useState<{
    total_waste: number; total_recycled: number; dry_waste: number; hazardous_waste: number; wet_waste?: number;
  } | null>(null);
  const [kpiLoading, setKpiLoading] = useState(false);

  // Bar chart data
  const [chartRaw, setChartRaw] = useState<Record<string, [number, string][]>>({});
  const [chartLoading, setChartLoading] = useState(false);

  // Site-detail modal
  const [detailSite, setDetailSite] = useState<string | null>(null);

  // ── API callers ──────────────────────────────────────────────────────────
  const getSiteId = () => localStorage.getItem('selectedSiteId') || '';

  const fetchKpis = async (fromDate: string, toDate: string) => {
    setKpiLoading(true);
    try {
      const siteId = getSiteId();
      const url = `${API_CONFIG.BASE_URL}/utility_dashboard/waste_kpis.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}`;
      const res = await fetch(url, { headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error('KPI fetch failed');
      const json = await res.json();
      if (json.success && json.response) setKpiData(json.response);
    } catch (e) {
      console.error(e);
    } finally {
      setKpiLoading(false);
    }
  };

  const fetchChartData = async (fromDate: string, toDate: string) => {
    setChartLoading(true);
    try {
      const siteId = getSiteId();
      const url = `${API_CONFIG.BASE_URL}/utility_dashboard/site_wise_dry_waste_segregation.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}`;
      const res = await fetch(url, { headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error('Chart fetch failed');
      const json = await res.json();
      if (json.success && json.response) setChartRaw(json.response);
    } catch (e) {
      console.error(e);
    } finally {
      setChartLoading(false);
    }
  };

  const handleDownloadChart = async () => {
    try {
      const siteId = getSiteId();
      const from = format(analyticsDateRange.startDate, "yyyy-MM-dd");
      const to = format(analyticsDateRange.endDate, "yyyy-MM-dd");
      const token = localStorage.getItem('token') || '';
      const url = `${API_CONFIG.BASE_URL}/utility_dashboard/waste_segregation_download?site_id=${siteId}&from_date=${from}&to_date=${to}&token=${token}`;
      const res = await fetch(url, { headers: { Authorization: getAuthHeader() } });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const contentDisposition = res.headers.get('content-disposition') || '';
      const match = contentDisposition.match(/filename="?([^";]+)"?/);
      let filename = match ? match[1] : 'waste_segregation.xlsx';
      if (!filename.toLowerCase().endsWith('.xlsx') && !filename.toLowerCase().endsWith('.xls')) {
        filename = `${filename}.xlsx`;
      }
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(objUrl);
    } catch (e) {
      console.error(e);
    }
  };

  // Build chart data: one row per category, summed across all sites
  // e.g. { category: 'abc', value: 23 }
  const categoryTotals: Record<string, number> = {};
  Object.values(chartRaw).forEach(entries => {
    entries.forEach(([val, cat]) => {
      categoryTotals[cat] = (categoryTotals[cat] || 0) + val;
    });
  });

  const allCategories = Object.keys(categoryTotals);

  // Each row = one category bar on X-axis
  const chartData: Record<string, number | string>[] = allCategories.map(cat => ({
    site: cat,
    value: categoryTotals[cat],
  }));

  // Site detail entries: for clicked category, show each site's value for that category
  const detailEntries = detailSite
    ? Object.entries(chartRaw)
        .map(([siteName, entries]) => {
          const match = entries.find(([, cat]) => cat === detailSite);
          return match ? { category: siteName, value: match[0] } : null;
        })
        .filter((x): x is { category: string; value: number } => x !== null)
    : [];

  // Load analytics when date range changes
 const { startDate: analyticsStart, endDate: analyticsEnd } = analyticsDateRange;

useEffect(() => {
  const from = format(analyticsStart, "yyyy-MM-dd");
  const to = format(analyticsEnd, "yyyy-MM-dd");

  fetchKpis(from, to);
  fetchChartData(from, to);
}, [analyticsStart, analyticsEnd]);

  const loadWasteGenerations = async (page: number = 1, filters?: WasteGenerationFilters) => {
    try {
      setIsLoading(true);
      const response = await fetchWasteGenerations(page, filters);
      setWasteGenerations(response.waste_generations || []);
      if (response.counts) setListCounts(response.counts);
    } catch (err) {
      setWasteGenerations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWasteGenerations(currentPage, activeFilters);
  }, [currentPage, activeFilters]);

  // Handlers
  const handleActionClick = () => setShowActionPanel(!showActionPanel);
  const handleClearSelection = () => setShowActionPanel(false);
  const handleApplyFilters = (filters: WasteGenerationFilters) => { setActiveFilters(filters); setCurrentPage(1); };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filters = activeFilters;
      const queryParts: string[] = [];
      if (filters.commodity_id_eq) queryParts.push(`q[commodity_id_eq]=${encodeURIComponent(filters.commodity_id_eq)}`);
      if (filters.category_id_eq) queryParts.push(`q[category_id_eq]=${encodeURIComponent(filters.category_id_eq)}`);
      if (filters.date_range) queryParts.push(`q[date_range]=${encodeURIComponent(filters.date_range)}`);
      if (filters.created_by_firstname_or_lastname_cont) queryParts.push(`q[created_by_firstname_or_lastname_cont]=${encodeURIComponent(filters.created_by_firstname_or_lastname_cont)}`);
      if (filters.entity_id_eq) queryParts.push(`q[entity_id_eq]=${encodeURIComponent(filters.entity_id_eq)}`);
      if (filters.resource_type_eq) queryParts.push(`q[resource_type_eq]=${encodeURIComponent(filters.resource_type_eq)}`);
      if (filters.status_eq) queryParts.push(`q[status_eq]=${encodeURIComponent(filters.status_eq)}`);
      if (filters.devise_id_cont) queryParts.push(`q[devise_id_cont]=${encodeURIComponent(filters.devise_id_cont)}`);
      const queryString = queryParts.join('&');
      const url = getFullUrl(`/pms/waste_generations.xlsx?${queryString}`);
      const response = await fetch(url, getAuthenticatedFetchOptions('GET'));
      if (!response.ok) { toast.error('Export failed'); return; }
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'waste_generations.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      toast.success('Data exported successfully!');
    } catch { toast.error('Export failed'); }
    finally { setIsExporting(false); }
  };

  const handleView = (id: number) => navigate(`/maintenance/waste/generation/${id}`);

  if (isLoading && wasteGenerations.length === 0) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">Assets &gt; Waste Generation List</div>
          <h1 className="font-semibold text-2xl text-gray-900 uppercase tracking-tight">WASTE GENERATION LIST</h1>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
            <TabsTrigger value="list" className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] font-bold">
              <Trash2 className="w-4 h-4" /> Waste List
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] font-bold">
              <BarChart3 className="w-4 h-4" /> Analytics
            </TabsTrigger>
          </TabsList>

          {/* ===================== LIST TAB ===================== */}
          <TabsContent value="list" className="mt-6 space-y-6">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  label: 'Total Waste',
                  value: listCounts ? `${listCounts.total_waste.toLocaleString('en-IN')} KG` : '—',
                  icon: <Trash2 className="w-6 h-6 text-[#C72030]" />,
                },
                {
                  label: 'Total Recycled',
                  value: listCounts ? `${listCounts.total_recycled.toLocaleString('en-IN')} KG` : '—',
                  icon: <RefreshCw className="w-6 h-6 text-[#C72030]" />,
                },
                {
                  label: 'Wet Waste',
                  value: listCounts ? `${listCounts.recycling_percentage}%` : '—',
                  icon: <Percent className="w-6 h-6 text-[#C72030]" />,
                },
                {
                  label: 'Dry Waste',
                  value: listCounts ? `${listCounts.dry_waste.toLocaleString('en-IN')} KG` : '—',
                  icon: <Package className="w-6 h-6 text-[#C72030]" />,
                },
                {
                  label: 'Hazardous Waste',
                  value: listCounts ? `${listCounts.hazardous_waste.toLocaleString('en-IN')} KG` : '—',
                  icon: <Activity className="w-6 h-6 text-[#C72030]" />,
                },
              ].map((card, i) => (
                <div key={i} className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center shrink-0">
                    {isLoading ? <Loader2 className="animate-spin w-6 h-6 text-[#C72030]" /> : card.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-[#1A1A1A]">{isLoading ? '…' : card.value}</div>
                    <div className="text-sm font-medium text-[#1A1A1A]">{card.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <EnhancedTable
              data={wasteGenerations}
              columns={[
                { key: 'actions', label: 'Actions' },
                { key: 'id', label: 'ID' },
                { key: 'date', label: 'Date' },
                { key: 'time', label: 'Time' },
                { key: 'location', label: 'Location' },
                { key: 'user_type', label: 'User Type' },
                { key: 'client_name', label: 'Client / Tenant Name' },
                { key: 'user_name', label: 'User Name' },
                { key: 'email', label: 'Email Id' },
                { key: 'waste_category', label: 'Waste Category' },
                { key: 'waste_subcategory', label: 'Waste Subcategory' },
                { key: 'no_of_bags', label: 'No. of Bags' },
                { key: 'total_weight', label: 'Total Weight (KG)' },
                { key: 'device_name', label: 'Device Name / Tab ID' },
                { key: 'status', label: 'Status' },
                { key: 'entry_source', label: 'Entry Source' },
                { key: 'recycled_pct', label: 'Recycled %' },
              ]}
              renderCell={(item: WasteGeneration, key: string) => {
                if (key === 'actions') return shouldShow("Waste Generation", "show") ? <Button variant="ghost" onClick={() => handleView(item.id)}><Eye className="h-4 w-4" /></Button> : null;
                if (key === 'id') return item.id ?? '-';
                if (key === 'date') return item.wg_date ? item.wg_date.split('T')[0] : '-';
                if (key === 'time') {
                  if (item.created_at) {
                    try { return new Date(item.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); }
                    catch { return '-'; }
                  }
                  return '-';
                }
                if (key === 'location') return item.location_details || '-';
                if (key === 'user_type') return item.user_type || item.resource_type || '-';
                if (key === 'client_name') return item.client_name || item.vendor?.company_name || item.agency_name || '-';
                if (key === 'user_name') return item.user_name || item.created_by?.full_name || '-';
                if (key === 'email') return item.created_by?.email || '-';
                if (key === 'waste_category') return item.category?.category_name || '-';
                if (key === 'waste_subcategory') return item.commodity?.category_name || '-';
                if (key === 'no_of_bags') return item.bag_counts != null ? item.bag_counts.toString() : '-';
                if (key === 'total_weight') return item.waste_unit != null ? `${item.waste_unit} KG` : '-';
                if (key === 'device_name') return item.device_id != null ? item.device_id.toString() : '-';
                if (key === 'status') return item.status || '-';
                if (key === 'entry_source') return (item as Record<string, unknown>).entry_source as string || '-';
                if (key === 'recycled_pct') {
                  const pct = item.waste_unit > 0 ? Math.round((item.recycled_unit / item.waste_unit) * 100) : 0;
                  return `${pct}%`;
                }
                return '-';
              }}
              getItemId={(item) => item.id.toString()}
              onSearchChange={setSearchTerm}
              onFilterClick={() => setIsFilterModalOpen(true)}
              enableExport={true}
              onExport={handleExport}
              isExporting={isExporting}
              leftActions={
                shouldShow("Waste Generation", "show") ? (
                  <Button className="bg-[#C72030] text-white rounded-none" onClick={handleActionClick}>
                    <Plus className="w-4 h-4 mr-2" /> Action
                  </Button>
                ) : undefined
              }
            />
          </TabsContent>

          {/* ===================== ANALYTICS TAB ===================== */}
          <TabsContent value="analytics" className="space-y-4 mt-6">

            {/* Date Filter */}
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                onClick={() => setIsAnalyticsFilterOpen(true)}
                className="flex items-center justify-between w-[280px] px-4 py-2 bg-white hover:bg-gray-50 border-gray-300"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
  {format(analyticsDateRange.startDate, "dd/MM/yyyy")} - {format(analyticsDateRange.endDate, "dd/MM/yyyy")}
</span>
                </div>
                <Filter className="w-4 h-4 text-gray-600" />
              </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Waste Generated', value: kpiData?.total_waste ?? null, icon: <Trash2 className="w-6 h-6 text-[#C72030]" /> },
                { label: 'Total Recycled',         value: kpiData?.total_recycled ?? null, icon: <RefreshCw className="w-6 h-6 text-[#C72030]" /> },
                { label: 'Dry Waste',              value: kpiData?.dry_waste ?? null, icon: <Leaf className="w-6 h-6 text-[#C72030]" /> },
                { label: 'Hazardous',              value: kpiData?.hazardous_waste ?? null, icon: <Activity className="w-6 h-6 text-[#C72030]" /> },
              ].map((item, i) => (
                <div key={i} className="relative bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 hover:shadow-lg transition-all duration-300 min-h-[88px]">
                  <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    {kpiLoading ? (
                      <Loader2 className="animate-spin w-5 h-5 text-[#C72030]" />
                    ) : (
                      <div className="text-xl font-semibold">
                        {item.value !== null ? `${item.value.toLocaleString('en-IN')} kg` : '—'}
                      </div>
                    )}
                    <div className="text-sm font-medium text-[#1A1A1A]">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bar Chart */}
            <div className="w-full mt-6 animate-in fade-in duration-300">
              <WasteCategoryChart
                data={chartData}
                isLoading={chartLoading}
                onDownload={handleDownloadChart}
                onEye={(categoryName) => setDetailSite(categoryName)}
              />
            </div>

          </TabsContent>
        </Tabs>
      </div>

      {/* Action Panel */}
      {showActionPanel && (
        <div className={`fixed z-50 flex items-end justify-center pb-24 pointer-events-none transition-all duration-300 ${isSidebarCollapsed ? 'left-16' : 'left-64'} right-0 bottom-0`}>
          <div className="pointer-events-auto bg-white border border-gray-200 rounded-lg shadow-2xl p-6 flex gap-12">
            <button onClick={() => navigate('/maintenance/waste/generation/add')} className="flex flex-col items-center hover:text-[#C72030] transition-colors">
              <Plus className="w-6 h-6 mb-1"/><span className="text-xs font-bold uppercase">Add</span>
            </button>
            <button onClick={() => setIsBulkUploadOpen(true)} className="flex flex-col items-center hover:text-[#C72030] transition-colors">
              <Upload className="w-6 h-6 mb-1"/><span className="text-xs font-bold uppercase">Import</span>
            </button>
            <div className="w-px h-8 bg-gray-200" />
            <button onClick={handleClearSelection} className="flex flex-col items-center text-gray-400 hover:text-black transition-colors">
              <X className="w-6 h-6 mb-1"/><span className="text-xs font-bold uppercase">Close</span>
            </button>
          </div>
        </div>
      )}

      <WasteGenerationFilterDialog isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApplyFilters={handleApplyFilters} />
      <WasteGenerationBulkDialog isOpen={isBulkUploadOpen} onClose={() => setIsBulkUploadOpen(false)} type="import" />
  <AssetAnalyticsFilterDialog
  isOpen={isAnalyticsFilterOpen}
  onClose={() => setIsAnalyticsFilterOpen(false)}
  currentStartDate={analyticsDateRange.startDate}
  currentEndDate={analyticsDateRange.endDate}
  onApplyFilters={(startDate, endDate) =>
    setAnalyticsDateRange({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })
  }
/>
      <SiteDetailModal
        siteName={detailSite}
        siteData={detailEntries}
        onClose={() => setDetailSite(null)}
      />
    </>
  );
};

export default UtilityWasteGenerationDashboard;