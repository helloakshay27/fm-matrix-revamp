import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, SlidersHorizontal } from "lucide-react";
import { getStatusBadgeColor, formatStatusText } from "@/utils/statusUtils";
import { MobileAssetFilterDialog, MobileAssetFilters } from "./MobileAssetFilterDialog";

interface Asset {
  id: number;
  name: string;
  assetNumber?: string;
  status?: string;
  breakdown?: boolean;
  assetGroup?: string;
  assetSubGroup?: string;
  siteName?: string;
  building?: { name: string } | null;
  wing?: { name: string } | null;
  area?: { name: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

interface MobileAssetListProps {
  assets: Asset[];
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
  loadingMore?: boolean;
  onApplyFilters?: (filters: MobileAssetFilters) => void;
  onStatusUpdate?: (assetId: string, newStatus: string) => Promise<void>;
  updatingStatus?: boolean;
}

export const MobileAssetList: React.FC<MobileAssetListProps> = ({ 
  assets, 
  onLoadMore, 
  hasMore = false, 
  loadingMore = false,
  onApplyFilters,
  onStatusUpdate,
  updatingStatus = false
}) => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<MobileAssetFilters>({});
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<number | null>(null);

  const statusOptions = [
    { value: "in_use", label: "In Use", color: "bg-green-100 text-green-800" },
    { value: "breakdown", label: "Breakdown", color: "bg-red-100 text-red-800" },
    { value: "in_storage", label: "In Store", color: "bg-yellow-100 text-yellow-800" },
    { value: "disposed", label: "Disposed", color: "bg-gray-100 text-gray-800" },
  ];

  // Debug: Log when assets prop changes
  useEffect(() => {
    console.log("📱 MobileAssetList: Assets prop updated:", {
      assetsCount: assets.length,
      firstAsset: assets[0] ? { id: assets[0].id, name: assets[0].name } : null
    });
  }, [assets]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setStatusDropdownOpen(null);
    };

    if (statusDropdownOpen !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [statusDropdownOpen]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAssetClick = (assetId: number) => {
    console.log("🎯 Asset clicked:", assetId);
    navigate(`/mobile/assets/${assetId}${window.location.search}`);
  };

  const handleStatusClick = (e: React.MouseEvent, assetId: number) => {
    e.stopPropagation(); // Prevent asset click
    setStatusDropdownOpen(statusDropdownOpen === assetId ? null : assetId);
  };

  const handleStatusChange = async (assetId: number, newStatus: string) => {
    if (onStatusUpdate) {
      await onStatusUpdate(assetId.toString(), newStatus);
    }
    setStatusDropdownOpen(null);
  };  const handleOpenFilter = () => {
    setIsFilterOpen(true);
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  const handleApplyFilters = (filters: MobileAssetFilters) => {
    setCurrentFilters(filters);
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(currentFilters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "24 Jul 2025";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!onLoadMore || !hasMore || loadingMore) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Load more when user is 100px from bottom
      if (scrollTop + windowHeight >= documentHeight - 100) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, hasMore, loadingMore]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-black" />
            </button>
            <h1 className="text-lg font-semibold text-[#4B003F]">Assets</h1>
          </div>
          <button 
            onClick={handleOpenFilter}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-colors ${
              hasActiveFilters 
                ? 'border-[#4B003F] bg-[#4B003F] text-white' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-sm">
              {hasActiveFilters ? 'Filtered' : 'Filters'}
            </span>
            {hasActiveFilters && (
              <span className="bg-white text-[#4B003F] text-xs px-1.5 py-0.5 rounded-full font-medium">
                {Object.values(currentFilters).filter(v => v !== undefined && v !== null && v !== '').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Asset Cards */}
      <div className="p-4 space-y-4">
        {assets.map((asset) => (
          <div key={asset.id} onClick={() => handleAssetClick(asset.id)} className="bg-[#F2EBE3] rounded-lg p-4 shadow-sm relative">
            {/* Group + Status */}
            <div className="flex items-start justify-between mb-2">
              <div className="text-xs text-gray-600">
                {asset.assetGroup || "Technical"}
              </div>
              <div className="relative">
                <button
                  onClick={(e) => handleStatusClick(e, asset.id)}
                  disabled={updatingStatus}
                  className={`text-xs px-2 py-1 rounded font-medium transition-all ${getStatusBadgeColor(
                    asset.breakdown ? "Breakdown" : asset.status
                  )} ${updatingStatus ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'}`}
                >
                  {updatingStatus ? 'Updating...' : formatStatusText(asset.breakdown ? "Breakdown" : (asset.status || "Breakdown"))}
                </button>
                
                {/* Status Dropdown */}
                {statusDropdownOpen === asset.id && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(asset.id, option.value);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${option.color}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Created Date */}
            <div className="text-xs text-gray-500 mb-2 text-right">
              Created On: {formatDate(asset.createdAt) || "24 May 2025"}
            </div>

            {/* Name + Group */}
            <div className="text-gray-900 font-semibold text-base">
              {asset.name || "Asset Name"}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {asset.assetGroup && asset.assetSubGroup
                ? `${asset.assetGroup}/${asset.assetSubGroup}`
                : "Group/Subgroup"}
            </div>

            {/* Dotted line */}
            <div className="border-t border-dashed border-gray-400 my-3" />

            {/* Location */}
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>
                {asset.siteName ||
                  asset.building?.name ||
                  asset.wing?.name ||
                  asset.area?.name ||
                  "Location"}
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-sm bg-gray-200 px-3 py-1 rounded text-gray-800">
                Updated at: {formatDate(asset.updatedAt)}
              </span>
              <button
                onClick={() => handleAssetClick(asset.id)}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}

        {/* No Assets Fallback */}
        {assets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <MapPin className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500">No assets found</p>
          </div>
        )}

        {/* Load More Indicator */}
        {loadingMore && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B003F] mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading more assets...</p>
          </div>
        )}

        {/* End of List Indicator */}
        {assets.length > 0 && !hasMore && !loadingMore && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No more assets to load</p>
          </div>
        )}
      </div>

      {/* Filter Dialog */}
      <MobileAssetFilterDialog
        isOpen={isFilterOpen}
        onClose={handleCloseFilter}
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      />
    </div>
  );
};
