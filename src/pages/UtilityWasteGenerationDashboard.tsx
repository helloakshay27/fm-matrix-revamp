import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Plus, Upload, Eye, Trash2, Loader2, X, BarChart3,
  Calendar, Filter, RefreshCw, Leaf, Activity, Download 
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { WasteGenerationFilterDialog } from '../components/WasteGenerationFilterDialog';
import { WasteGenerationBulkDialog } from '../components/WasteGenerationBulkDialog';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { fetchWasteGenerations, WasteGeneration, WasteGenerationFilters } from '../services/wasteGenerationAPI';
import { useLayout } from '@/contexts/LayoutContext';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { format, subYears } from 'date-fns';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Analytics Components
import { TicketAnalyticsFilterDialog } from "@/components/TicketAnalyticsFilterDialog";

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
        <div className="flex items-center justify-between gap-4 mb-2">
          <p className="font-semibold text-gray-800 truncate max-w-[120px]">{label}</p>
          <button
            className="text-[#C72030] hover:underline text-xs flex items-center gap-1 shrink-0"
            onClick={() => onEye(label ?? '')}
          >
            <Eye className="w-3 h-3" /> View
          </button>
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
  const panelRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionPanel, setShowActionPanel] = useState(false);
  
  // API states
  const [wasteGenerations, setWasteGenerations] = useState<WasteGeneration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<WasteGenerationFilters>({});
  const [currentPage, setCurrentPage] = useState(1);

  // ── Analytics States ─────────────────────────────────────────────────────
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);

  // default: today & 1 year ago
  const today = new Date();
  const oneYearAgo = subYears(today, 1);
  const [analyticsDateRange, setAnalyticsDateRange] = useState({
    startDate: format(oneYearAgo, 'dd/MM/yyyy'),
    endDate: format(today, 'dd/MM/yyyy'),
  });

  // KPI card data
  const [kpiData, setKpiData] = useState<{
    total_waste: number; total_recycled: number; dry_waste: number; hazardous_waste: number;
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
      const from = toApiDate(analyticsDateRange.startDate);
      const to   = toApiDate(analyticsDateRange.endDate);
      const url = `${API_CONFIG.BASE_URL}/utility_dashboard/waste_segregation_download.json?site_id=${siteId}&from_date=${from}&to_date=${to}`;
      const res = await fetch(url, { headers: { Authorization: getAuthHeader() } });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const contentDisposition = res.headers.get('content-disposition') || '';
      const match = contentDisposition.match(/filename="?(.+)"?/);
      const filename = match ? match[1] : 'waste_segregation.csv';
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl; a.download = filename; a.click();
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
    const from = toApiDate(analyticsStart);
    const to   = toApiDate(analyticsEnd);
    fetchKpis(from, to);
    fetchChartData(from, to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyticsStart, analyticsEnd]);

  const loadWasteGenerations = async (page: number = 1, filters?: WasteGenerationFilters) => {
    try {
      setIsLoading(true);
      const response = await fetchWasteGenerations(page, filters);
      setWasteGenerations(response.waste_generations || []);
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
          <TabsContent value="list" className="mt-6">
            <EnhancedTable
              data={wasteGenerations}
              columns={[
                { key: 'actions', label: 'Actions' },
                { key: 'location_details', label: 'Location' },
                { key: 'vendor', label: 'Vendor' },
                { key: 'category', label: 'Category' },
                { key: 'waste_unit', label: 'Generated (KG)' },
                { key: 'wg_date', label: 'Waste Date' },
              ]}
              renderCell={(item: WasteGeneration, key) => {
                if (key === 'actions') return <Button variant="ghost" onClick={() => handleView(item.id)}><Eye className="h-4 w-4" /></Button>;
                if (key === 'vendor') return item.vendor?.company_name || 'N/A';
                if (key === 'category') return item.category?.category_name || 'N/A';
                return item[key] || 'N/A';
              }}
              getItemId={(item) => item.id.toString()}
              onSearchChange={setSearchTerm}
              onFilterClick={() => setIsFilterOpen(true)}
              leftActions={
                <Button className="bg-[#C72030] text-white rounded-none" onClick={handleActionClick}>
                  <Plus className="w-4 h-4 mr-2" /> Action
                </Button>
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
                    {analyticsDateRange.startDate} - {analyticsDateRange.endDate}
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
            <button onClick={() => setIsImportOpen(true)} className="flex flex-col items-center hover:text-[#C72030] transition-colors">
              <Upload className="w-6 h-6 mb-1"/><span className="text-xs font-bold uppercase">Import</span>
            </button>
            <div className="w-px h-8 bg-gray-200" />
            <button onClick={handleClearSelection} className="flex flex-col items-center text-gray-400 hover:text-black transition-colors">
              <X className="w-6 h-6 mb-1"/><span className="text-xs font-bold uppercase">Close</span>
            </button>
          </div>
        </div>
      )}

      <WasteGenerationFilterDialog isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApplyFilters={handleApplyFilters} onExport={() => {}} />
      <WasteGenerationBulkDialog isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} type="import" />
      <TicketAnalyticsFilterDialog
        title='Waste Generation'
        isOpen={isAnalyticsFilterOpen}
        onClose={() => setIsAnalyticsFilterOpen(false)}
        onApplyFilters={(f) => setAnalyticsDateRange(f)}
        currentStartDate={analyticsDateRange.startDate}
        currentEndDate={analyticsDateRange.endDate}
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