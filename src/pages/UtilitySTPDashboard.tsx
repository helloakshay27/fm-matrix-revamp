
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Import, RefreshCw, FileDown, Printer, Filter } from 'lucide-react';
import { Package, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { BulkUploadDialog } from '../components/BulkUploadDialog';
import { UtilitySTPFilterDialog } from '../components/UtilitySTPFilterDialog';
import { StatsCard } from '../components/StatsCard';
import { AssetDataTable } from '../components/AssetDataTable';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/utils/apiClient';
import type { Asset } from '@/hooks/useAssets';
import { useSTPAssetSearch, STPAsset } from '@/hooks/useSTPAssetSearch';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// STP Asset response interface
interface STPAssetResponse {
  assets: STPAsset[];
  pagination: {
    current_page: number;
    total_pages?: number; // Optional since API might not always provide this
    total_count: number;
  };
  stats: {
    total: number;
    in_use: number;
    breakdown: number;
    in_storage: number;
    disposed: number;
  };
}

const UtilitySTPDashboard = () => {
  const navigate = useNavigate();

  // STP asset search hook
  const {
    assets: searchAssets,
    loading: searchLoading,
    error: searchError,
    searchSTPAssets: performSearch,
  } = useSTPAssetSearch();

  // State for STP assets
  const [stpAssets, setStpAssets] = useState<STPAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [stats, setStats] = useState({
    total: 0,
    inUse: 0,
    breakdown: 0,
    inStorage: 0,
    disposed: 0,
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // UI state
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'import' | 'update'>('import');

  // Visible columns configuration for STP assets
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

  // Transform STP asset data to Asset interface
  const transformSTPAsset = (asset: STPAsset, index: number): Asset => ({
    id: asset.id?.toString() || "",
    name: asset.name || "",
    serialNumber: (currentPage - 1) * 15 + index + 1,
    assetNumber: asset.asset_number || "",
    status: asset.status,
    siteName: asset.site_name || "",
    building: typeof asset.building === 'string' ? { name: asset.building } : asset.building || null,
    wing: typeof asset.wing === 'string' ? { name: asset.wing } : asset.wing || null,
    area: typeof asset.area === 'string' ? { name: asset.area } : asset.area || null,
    pmsRoom: typeof asset.room === 'string' ? { name: asset.room } : asset.room || null,
    assetGroup: asset.meter_type || "",
    assetSubGroup: asset.asset_type || "",
    assetType: false, // STP assets are typically not IT assets
    purchaseCost: asset.purchase_cost,
    currentBookValue: asset.current_book_value,
    floor: typeof asset.floor === 'string' ? { name: asset.floor } : asset.floor || null,
    category: asset.meter_type || "STP Asset",
  });

  // Fetch STP assets function
  const fetchSTPAssets = useCallback(async (page: number = 1, appliedFilters: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('per_page', '15');

      // Add STP specific filters
      queryParams.append('type', 'Recycle'); // Filter for Recycle assets

      // Apply additional filters
      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(`q[${key}]`, value.toString());
        }
      });

      const response = await apiClient.get(`/pms/assets.json?${queryParams}`);

      if (response.data) {
        setStpAssets(response.data.assets || []);
        setCurrentPage(response.data.pagination?.current_page || 1);
        // Calculate total_pages if not provided, assuming 15 items per page
        const totalPages = response.data.pagination?.total_pages ||
          Math.ceil((response.data.pagination?.total_count || 0) / 15);
        setTotalPages(totalPages);
        setTotalCount(response.data.pagination?.total_count || 0);

        // Set stats
        setStats({
          total: response.data.pagination?.total_count || 0,
          inUse: response.data.in_use_count || 0,
          breakdown: response.data.breakdown_count || 0,
          inStorage: response.data.in_store || 0,
          disposed: response.data.dispose_assets || 0,
        });
      }
    } catch (err: any) {
      console.error('Error fetching STP assets:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch STP assets');
    } finally {
      setLoading(false);
    }
  }, []);

  // Search STP assets function - removed, now using hook

  // Initial data fetch
  useEffect(() => {
    fetchSTPAssets(1);
  }, [fetchSTPAssets]);

  // Handle page changes when filters are applied
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchSTPAssets(currentPage, filters);
    }
  }, [currentPage, filters, fetchSTPAssets]);

  // Transform assets for display
  const transformedAssets = stpAssets.map((asset, index) => transformSTPAsset(asset, index));
  const transformedSearchAssets = searchAssets.map((asset, index) => transformSTPAsset(asset, index));

  // Use search results if search term exists, otherwise use regular assets
  const displayAssets = searchTerm.trim() ? transformedSearchAssets : transformedAssets;
  const isSearchMode = searchTerm.trim().length > 0;

  // Pagination object
  const pagination = {
    currentPage,
    totalPages: totalPages || 1,
    totalCount: totalCount || 0,
  };

  const handleAdd = () => {
    navigate('/utility/stp/add-asset?type=Recycle');
  };

  const handleAddSchedule = () => {
    navigate('/maintenance/schedule/add?type=STPAsset');
  };

  const handleImport = () => {
    setUploadType('import');
    setIsImportOpen(true);
  };

  const handleUpdate = () => {
    setUploadType('update');
    setIsUpdateOpen(true);
  };

  const handleExportAll = async () => {
    try {
      const response = await fetch(
        `https://${localStorage.getItem('baseUrl')}/pms/assets/stp_assets_data_report.xlsx`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export STP assets to Excel");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "stp_assets_data_report.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting STP assets:", error);
      // Fallback to CSV export
      const csvContent = "data:text/csv;charset=utf-8," +
        "Asset Name,Asset ID,Asset Code,Asset No.,Asset Status,Equipment Id,Site,Building,Wing,Floor,Area,Room,Meter Type,Asset Type\n" +
        displayAssets.map(asset =>
          `${asset.name},${asset.id},${asset.assetNumber},${asset.assetNumber},${asset.status},,${asset.siteName},${asset.building?.name || ''},${asset.wing?.name || ''},${asset.floor?.name || ''},${asset.area?.name || ''},${asset.pmsRoom?.name || ''},${asset.assetGroup},${asset.assetSubGroup}`
        ).join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "stp_assets.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrintQR = () => {
    console.log('Printing QR codes for selected STP assets:', selectedAssets);
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

  // Handle refresh
  const handleRefresh = () => {
    fetchSTPAssets(currentPage, filters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchSTPAssets(page, filters);
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
    navigate(`/maintenance/asset/details/${assetId}`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <nav className="text-sm text-gray-600 mb-2">
          Assets &gt; STP Asset List
        </nav>
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">STP ASSET LIST</h1>
      </div>

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
          <div className="flex flex-wrap gap-3">
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
          </div>

          {/* STP Asset Data Table */}
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
                    No STP assets found
                  </div>
                  <div className="text-gray-400 text-sm">
                    Try adjusting your filters to see more results
                  </div>
                </div>
              )}
          </div>

          {/* Pagination - only show when not in search mode and there are multiple pages */}
          {!isSearchMode && pagination.totalPages > 1 && (
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
                  {pagination.currentPage > 4 && pagination.totalPages > 7 && (
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
                      (page) => page > 1 && page < pagination.totalPages && page > 0
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
                  {pagination.currentPage < pagination.totalPages - 3 && pagination.totalPages > 7 && (
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
                {pagination.totalPages} ({pagination.totalCount} total STP assets)
              </div>
            </div>
          )}
        </>
      )}

      {/* Dialogs */}
      <UtilitySTPFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <BulkUploadDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        title="Import STP Assets"
      />
      <BulkUploadDialog
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        title="Update STP Assets"
      />
    </div>
  );
};

export default UtilitySTPDashboard;
