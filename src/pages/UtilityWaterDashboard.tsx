
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchWaterAssetsData } from '@/store/slices/waterAssetsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, Import, RefreshCw, FileDown, Printer, Filter } from 'lucide-react';
import { Package, CheckCircle, AlertTriangle } from 'lucide-react';
import { WaterFilterDialog } from '../components/WaterFilterDialog';
import { BulkUploadDialog } from '../components/BulkUploadDialog';
import { AssetDataTable } from '../components/AssetDataTable';
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

  // Transform Redux water assets to match the Asset interface expected by AssetDataTable
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
    assetType: false, // Water assets are typically not IT assets
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
    assetType: false, // Water assets are typically not IT assets
    floor: typeof asset.floor === 'string' ? { name: asset.floor } : asset.floor || null,
    category: asset.meter_type || "Water Asset",
  }));

  // Use search results if search term exists, otherwise use Redux assets
  const displayAssets = searchTerm.trim()
    ? transformedSearchedAssets
    : transformedAssets;

  const isSearchMode = searchTerm.trim().length > 0;

  // Pagination object - using Redux state values that now come from API pagination response
  const pagination = {
    currentPage: currentPage,
    totalPages: totalPages || 1,
    totalCount: totalCount || 0,
  };

  const handleAdd = () => {
    navigate('/utility/water/add-asset?type=Water');
  };

  const handleAddSchedule = () => {
    navigate('/maintenance/schedule/add?type=Water');
  };

  const handleImport = () => {
    setUploadType('import');
    setIsBulkUploadOpen(true);
  };

  const handleUpdate = () => {
    setUploadType('update');
    setIsBulkUploadOpen(true);
  };

  const handleExportAll = async () => {
    try {
      const response = await fetch(
        `https://${localStorage.getItem('baseUrl')}/pms/assets/water_assets_data_report.xlsx`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export water assets to Excel");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "water_assets_data_report.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting water assets:", error);
      // Fallback to CSV export
      const csvContent = "data:text/csv;charset=utf-8," +
        "Asset Name,Asset ID,Asset Code,Asset No.,Asset Status,Equipment Id,Site,Building,Wing,Floor,Area,Room,Meter Type,Asset Type\n" +
        displayAssets.map(asset =>
          `${asset.name},${asset.id},${asset.assetNumber},${asset.assetNumber},${asset.status},,${asset.siteName},${asset.building?.name || ''},${asset.wing?.name || ''},${asset.floor?.name || ''},${asset.area?.name || ''},${asset.pmsRoom?.name || ''},${asset.assetGroup},${asset.assetType ? 'IT' : 'Non-IT'}`
        ).join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "water_assets.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrintQR = () => {
    console.log('Printing QR codes for selected assets:', selectedAssets);
  };

  const handleInActiveAssets = () => {
    navigate('/utility/inactive-assets');
  };

  // Handle search with API call
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      performSearch(term);
    }
  };

  // Handle refresh - fetch water assets from Redux
  const handleRefresh = () => {
    dispatch(fetchWaterAssetsData({ page: currentPage, filters }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    dispatch(fetchWaterAssetsData({ page, filters }));
  };

  // Handle asset selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(displayAssets.map((asset) => asset.id));
    } else {
      setSelectedAssets([]);
    }
  };

  const handleSelectAsset = (assetId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssets((prev) => [...prev, assetId]);
    } else {
      setSelectedAssets((prev) => prev.filter((id) => id !== assetId));
    }
  };

  const handleViewAsset = (assetId: string) => {
    // Find the asset in the current list to get its type
    const asset = waterAssets.find((a) => a.id?.toString() === assetId);
    navigate(`/maintenance/asset/details/${assetId}?type=Water`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Assets &gt; Water Asset List
      </div>

      {/* Page Title */}
      <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">WATER ASSET LIST</h1>

      {error ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-red-500">Error: {error}</div>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Total Asset"
              value={stats.total.toString()}
              icon={<Package className="w-8 h-8" />}
            />
            <StatsCard
              title="In Use"
              value={stats.inUse.toString()}
              icon={<CheckCircle className="w-8 h-8" />}
            />
            <StatsCard
              title="Breakdown"
              value={stats.breakdown.toString()}
              icon={<AlertTriangle className="w-8 h-8" />}
            />
          </div>

          {/* Action Buttons */}
          {/* <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleAdd}
              className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
            <Button
              onClick={handleImport}
              className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
            >
              <Import className="w-4 h-4" />
              Import
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
            >
              <RefreshCw className="w-4 h-4" />
              Update
            </Button>
            <Button
              onClick={handleExportAll}
              className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
            >
              <FileDown className="w-4 h-4" />
              Export All
            </Button>
            <Button
              onClick={handlePrintQR}
              className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
            >
              <Printer className="w-4 h-4" />
              Print QR
            </Button>
            <Button
              onClick={handleInActiveAssets}
              className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
            >
              In-Active Assets
            </Button>
          </div> */}

          {/* Water Asset Data Table */}
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

            {/* Empty state when no data and filters are applied */}
            {!loading && !searchLoading &&
              displayAssets.length === 0 &&
              Object.keys(filters).length > 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg mb-2">
                    No water assets found
                  </div>
                  <div className="text-gray-400 text-sm">
                    Try adjusting your filters to see more results
                  </div>
                </div>
              )}
          </div>

          {/* Pagination - only show when not in search mode */}
          {!isSearchMode && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (pagination.currentPage > 1) {
                          handlePageChange(pagination.currentPage - 1);
                        }
                      }}
                      className={
                        pagination.currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {/* First Page */}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(1)}
                      isActive={pagination.currentPage === 1}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>

                  {/* Ellipsis before current pages */}
                  {pagination.currentPage > 4 && (
                    <PaginationItem>
                      <span className="px-4 py-2">...</span>
                    </PaginationItem>
                  )}

                  {/* Current page and surrounding pages */}
                  {Array.from(
                    { length: 3 },
                    (_, i) => pagination.currentPage - 1 + i
                  )
                    .filter(
                      (page) => page > 1 && page < pagination.totalPages
                    )
                    .map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={pagination.currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                  {/* Ellipsis after current pages */}
                  {pagination.currentPage < pagination.totalPages - 3 && (
                    <PaginationItem>
                      <span className="px-4 py-2">...</span>
                    </PaginationItem>
                  )}

                  {/* Last Page */}
                  {pagination.totalPages > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(pagination.totalPages)}
                        isActive={pagination.currentPage === pagination.totalPages}
                      >
                        {pagination.totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (pagination.currentPage < pagination.totalPages) {
                          handlePageChange(pagination.currentPage + 1);
                        }
                      }}
                      className={
                        pagination.currentPage === pagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="text-center mt-2 text-sm text-gray-600">
                Showing page {pagination.currentPage} of{" "}
                {pagination.totalPages} ({pagination.totalCount} total water assets)
              </div>
            </div>
          )}
        </>
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
    </div>
  );
};

export default UtilityWaterDashboard;
