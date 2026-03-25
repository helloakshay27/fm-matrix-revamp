import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchWaterAssetsData } from '@/store/slices/waterAssetsSlice';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, Plus, Import, RefreshCw, FileDown, Printer, Filter,
  Package, CheckCircle, AlertTriangle, Droplets, Activity, Settings, Calendar, BarChart3 
} from 'lucide-react';
import { WaterFilterDialog } from '../components/WaterFilterDialog';
import { BulkUploadDialog } from '../components/BulkUploadDialog';
import { AssetDataTable } from '../components/AssetDataTable';
import { AssetStats } from '../components/AssetStats';
import { StatsCard } from '../components/StatsCard';
import { useWaterAssetSearch } from '../hooks/useWaterAssetSearch';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TicketAnalyticsFilterDialog } from "@/components/TicketAnalyticsFilterDialog";
import { SiteWisePowerConsumptionChart } from "@/components/charts/SiteWisePowerConsumptionChart";
import { WaterTimeSeriesChart } from '@/components/charts/WaterTimeSeriesChart';

export const UtilityWaterDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const {
    items: waterAssets,
    loading,
    error,
    totalCount,
    totalPages,
    filters,
    stats,
  } = useSelector((state: RootState) => state.waterAssets);

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'import' | 'update'>('import');

  // Analytics States
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
  const [isChartSelectorOpen, setIsChartSelectorOpen] = useState(false);
  
  // Chart Selection States
  const [selectedCharts, setSelectedCharts] = useState({
    sourceBreakdown: true,
    siteWise: true,
    timeSeries:true,
  });

  const getDefaultDateRange = () => {
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);
    const fmt = (d: Date) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
    return { startDate: fmt(lastYear), endDate: fmt(today) };
  };
  const [analyticsDateRange, setAnalyticsDateRange] = useState(getDefaultDateRange);

  // Water asset search hook
  const {
    assets: searchAssets,
    loading: searchLoading,
    error: searchError,
    searchWaterAssets: performSearch,
  } = useWaterAssetSearch();

  // Visible columns configuration for water assets
  const [visibleColumns] = useState({
    actions: true,
    serialNumber: true,
    assetName: true,
    assetId: true,
    assetNo: true,
    assetStatus: true,
    site: true,
    building: true,
    wing: true,
    floor: true,
    area: true,
    room: true,
    meterType: true,
    assetType: true,
  });

  // Data for Site Wise Domestic Water
  const siteWaterData = [
    { 
      site: 'Lockated Site 2', 
      mains: 560,                  
      dg: 0,                       
      renewable: 0,                
      consumptionPerSqFt: 0.00031, 
      costPerSqFt: null            
    }
  ];

  // Data for Water Source Consumption
  const WaterSourceComsumpton = [
    { 
      site: 'Borewell', 
      mains: 100,       
      dg: 0,                       
      renewable: 0,                
      consumptionPerSqFt: null, 
      costPerSqFt: null            
    }
  ];

  // Fetch initial water assets data
  useEffect(() => {
    dispatch(fetchWaterAssetsData({ page: currentPage }));
  }, [dispatch]);

  // Handle page changes when filters are applied
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      dispatch(fetchWaterAssetsData({ page: currentPage, filters }));
    }
  }, [currentPage, filters, dispatch]);

  useEffect(() => {
    const fetchSiteWaterData = async () => {
      try {
        // API logic goes here for Water Analytics
      } catch (err) {
        console.error("Error fetching water chart data", err);
      }
    };
    fetchSiteWaterData();
  }, []);

  // Transform Redux water assets
  const transformedAssets = waterAssets.map((asset, index) => ({
    id: asset.id?.toString() || "",
    name: asset.name || "",
    serialNumber: (currentPage - 1) * 15 + index + 1,
    assetNumber: asset.asset_number || "",
    status: asset.status as "in_use" | "in_storage" | "breakdown" | "disposed",
    siteName: asset.site_name || "",
    building: typeof asset.building === 'string' ? { name: asset.building } : asset.building || null,
    wing: typeof asset.wing === 'string' ? { name: asset.wing } : asset.wing || null,
    area: typeof asset.area === 'string' ? { name: asset.area } : asset.area || null,
    pmsRoom: typeof asset.room === 'string' ? { name: asset.room } : asset.room || null,
    assetGroup: asset.meter_type || "",
    assetSubGroup: asset.asset_type || "",
    assetType: false,
    purchaseCost: asset.purchase_cost,
    currentBookValue: asset.current_book_value,
    floor: typeof asset.floor === 'string' ? { name: asset.floor } : asset.floor || null,
    category: asset.meter_type || "Water Asset",
  }));

  // Transform search results
  const transformedSearchedAssets = searchAssets.map((asset, index) => ({
    id: asset.id?.toString() || "",
    name: asset.name || "",
    serialNumber: (currentPage - 1) * 15 + index + 1,
    assetNumber: asset.asset_number || "",
    status: asset.status as "in_use" | "in_storage" | "breakdown" | "disposed",
    siteName: asset.site_name || "",
    building: typeof asset.building === 'string' ? { name: asset.building } : asset.building || null,
    wing: typeof asset.wing === 'string' ? { name: asset.wing } : asset.wing || null,
    area: typeof asset.area === 'string' ? { name: asset.area } : asset.area || null,
    pmsRoom: typeof asset.room === 'string' ? { name: asset.room } : asset.room || null,
    assetGroup: asset.meter_type || "",
    assetSubGroup: asset.asset_type || "",
    assetType: false,
    floor: typeof asset.floor === 'string' ? { name: asset.floor } : asset.floor || null,
    category: asset.meter_type || "Water Asset",
  }));

  const displayAssets = searchTerm.trim() ? transformedSearchedAssets : transformedAssets;
  const isSearchMode = searchTerm.trim().length > 0;

  const pagination = {
    currentPage: currentPage,
    totalPages: totalPages || 1,
    totalCount: totalCount || 0,
  };

  const handleAdd = () => navigate('/utility/water/add-asset?type=Water');
  const handleAddSchedule = () => navigate('/maintenance/schedule/add?type=Water');
  const handleImport = () => { setUploadType('import'); setIsBulkUploadOpen(true); };
  const handleUpdate = () => { setUploadType('update'); setIsBulkUploadOpen(true); };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) performSearch(term);
  };

  const handleRefresh = () => dispatch(fetchWaterAssetsData({ page: currentPage, filters }));
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    dispatch(fetchWaterAssetsData({ page, filters }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedAssets(displayAssets.map((asset) => asset.id));
    else setSelectedAssets([]);
  };

  const handleSelectAsset = (assetId: string, checked: boolean) => {
    if (checked) setSelectedAssets((prev) => [...prev, assetId]);
    else setSelectedAssets((prev) => prev.filter((id) => id !== assetId));
  };

  const handleViewAsset = (assetId: string) => navigate(`/maintenance/asset/details/${assetId}?type=Water`);

  // Helper to count active charts for grid styling
  const activeChartCount = Object.values(selectedCharts).filter(Boolean).length;

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen">
      {/* Breadcrumb & Title */}
      <div>
        <div className="text-sm text-gray-600 mb-2">Assets &gt; Water Asset List</div>
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">
          WATER ASSET LIST
        </h1>
      </div>

      {error ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-red-500">Error: {error}</div>
        </div>
      ) : (
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
            <TabsTrigger
              value="list"
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              <Droplets className="w-4 h-4" />
              List
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger> 
          </TabsList>

          {/* ===================== LIST TAB ===================== */}
          <TabsContent value="list" className="mt-6 space-y-6">
            <AssetStats
              stats={{
                total_count: stats.total,
                total_value: 0,
                non_it_assets: stats.total,
                it_assets: 0,
                in_use_count: stats.inUse,
                breakdown_count: stats.breakdown,
                in_store: 0,
                allocated_count: 0,
                dispose_assets: 0,
              }}
            />

            <div className="relative">
              <AssetDataTable
                assets={displayAssets}
                selectedAssets={selectedAssets}
                visibleColumns={visibleColumns}
                onSelectAll={handleSelectAll}
                onSelectAsset={handleSelectAsset}
                onViewAsset={handleViewAsset}
                handleAddAsset={handleAdd}
                handleImport={handleImport}
                onFilterOpen={() => setIsFilterOpen(true)}
                onSearch={handleSearch}
                onRefreshData={handleRefresh}
                handleAddSchedule={handleAddSchedule}
                loading={loading || searchLoading}
              />

              {!loading && !searchLoading && displayAssets.length === 0 && Object.keys(filters).length > 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg mb-2">No water assets found</div>
                  <div className="text-gray-400 text-sm">Try adjusting your filters to see more results</div>
                </div>
              )}
            </div>

            {!isSearchMode && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => pagination.currentPage > 1 && handlePageChange(pagination.currentPage - 1)} 
                        className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : ""} 
                      />
                    </PaginationItem>
                    
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(1)} isActive={pagination.currentPage === 1}>1</PaginationLink>
                    </PaginationItem>
                    
                    {pagination.currentPage > 4 && (
                      <PaginationItem><span className="px-4 py-2">...</span></PaginationItem>
                    )}
                    
                    {Array.from({ length: 3 }, (_, i) => pagination.currentPage - 1 + i)
                      .filter((page) => page > 1 && page < pagination.totalPages)
                      .map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink onClick={() => handlePageChange(page)} isActive={pagination.currentPage === page}>
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                    {pagination.currentPage < pagination.totalPages - 3 && (
                      <PaginationItem><span className="px-4 py-2">...</span></PaginationItem>
                    )}

                    {pagination.totalPages > 1 && (
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(pagination.totalPages)} isActive={pagination.currentPage === pagination.totalPages}>
                          {pagination.totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => pagination.currentPage < pagination.totalPages && handlePageChange(pagination.currentPage + 1)} 
                        className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""} 
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="text-center mt-2 text-sm text-gray-600">
                  Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} total water assets)
                </div>
              </div>
            )}
          </TabsContent>

          {/* ===================== ANALYTICS TAB ===================== */}
          <TabsContent value="analytics" className="space-y-4 mt-6">
            
            {/* 👇 Filters Container: Date and Chart Selectors aligned right and side-by-side */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mb-6">
              
              {/* Date Filter Dropdown */}
              <Button
                variant="outline"
                onClick={() => setIsAnalyticsFilterOpen(true)}
                className="flex items-center justify-between w-full sm:w-[280px] px-4 py-2 bg-white hover:bg-gray-50 border-gray-300"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {analyticsDateRange.startDate} - {analyticsDateRange.endDate}
                  </span>
                </div>
                <Filter className="w-4 h-4 text-gray-600" />
              </Button>

              {/* Custom Chart Selection Dropdown */}
              <div className="relative w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setIsChartSelectorOpen(!isChartSelectorOpen)}
                  className="flex items-center justify-between w-full sm:w-[280px] px-4 py-2 bg-white hover:bg-gray-50 border-gray-300"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Display Charts</span>
                  </div>
                </Button>

                {isChartSelectorOpen && (
                  <div className="absolute right-0 mt-2 w-full sm:w-[280px] bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2">
                    <div className="text-xs font-semibold text-gray-500 mb-2 px-2 uppercase tracking-wider">Select Visible Charts</div>
                    
                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedCharts.sourceBreakdown}
                        onChange={() => setSelectedCharts(prev => ({ ...prev, sourceBreakdown: !prev.sourceBreakdown }))}
                        className="w-4 h-4 rounded border-gray-300 text-[#C72030] focus:ring-[#C72030] cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700">Source Breakdown</span>
                    </label>

                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedCharts.siteWise}
                        onChange={() => setSelectedCharts(prev => ({ ...prev, siteWise: !prev.siteWise }))}
                        className="w-4 h-4 rounded border-gray-300 text-[#C72030] focus:ring-[#C72030] cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700">Site Wise Water</span>
                    </label>

                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedCharts.timeSeries}
                        onChange={() => setSelectedCharts(prev => ({ ...prev, timeSeries: !prev.timeSeries }))}
                        className="w-4 h-4 rounded border-gray-300 text-[#C72030] focus:ring-[#C72030] cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700">Water Consumption Time Series</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Water Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Water Consumption", value: "0 kL", icon: <Droplets className="w-6 h-6 text-[#C72030]" /> },
                { label: "Domestic Total ", value: "0 kL", icon: <Activity className="w-6 h-6 text-[#C72030]" /> },
                { label: "Flushing Total", value: "0 kL", icon: <RefreshCw className="w-6 h-6 text-[#C72030]" /> },
              ].map((item, i) => (
                <div key={i} className="relative bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all duration-300 min-h-[88px]">
                  <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xl font-semibold ">{item.value}</div>
                    <div className="text-sm font-medium text-[#1A1A1A]">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Dynamic Grid layout based on selected charts */}
            <div className={`grid grid-cols-1 gap-6 mt-6 ${activeChartCount > 1 ? 'md:grid-cols-2' : ''}`}>
              
              {selectedCharts.sourceBreakdown && (
                <div className="animate-in fade-in duration-300">
                  <SiteWisePowerConsumptionChart 
                    title="Water Source Consumption" 
                    data={WaterSourceComsumpton} 
                  />
                </div>
              )}

              {selectedCharts.siteWise && (
                <div className="animate-in fade-in duration-300">
                  <SiteWisePowerConsumptionChart 
                    title="Site Wise Domestic Water Consumption" 
                    data={siteWaterData} 
                  />
                </div>
              )}

            </div>

             {/* Placed Time Series outside the 2-column grid so it spans full width */}
            <div className="mt-6">
              {selectedCharts.timeSeries && (
                  <div className="animate-in fade-in duration-300">
                    <WaterTimeSeriesChart 
                      title="Water Consumption - Time Series" 
                    />
                  </div>
                )}
            </div>

            {/* Empty State when no chart is selected */}
            {activeChartCount === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>No charts selected. Please select a chart from the dropdown above.</p>
              </div>
            )}

          </TabsContent>
        </Tabs>
      )}

      {/* Dialogs */}
      <WaterFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        title={uploadType === 'import' ? 'Import Water Assets' : 'Update Water Assets'}
      />

      {/* Analytics Filter Dialog */}
      <TicketAnalyticsFilterDialog
        isOpen={isAnalyticsFilterOpen}
        title="Water"
        onClose={() => setIsAnalyticsFilterOpen(false)}
        onApplyFilters={(filters) => setAnalyticsDateRange(filters)}
        currentStartDate={analyticsDateRange.startDate}
        currentEndDate={analyticsDateRange.endDate}
      />
    </div>
  );
};

export default UtilityWaterDashboard;