import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import { MobileAssetList } from "@/components/mobile/MobileAssetList";
import { MobileAssetDetails } from "@/components/mobile/MobileAssetDetails";
import { MobileAssetBreakdown } from "@/components/mobile/MobileAssetBreakdown";
import { MobileAssetFilters } from "@/components/mobile/MobileAssetFilterDialog";

interface Activity {
  id: number;
  trackable_id: number;
  trackable_type: string;
  owner_id: number;
  owner_type: string;
  key: string;
  parameters: {
    updated_at?: [string, string];
    created_by?: [string, string];
    breakdown?: [boolean, boolean];
    breakdown_date?: [string | null, string | null];
    location_type?: [string, string | null];
    [key: string]: any;
  };
  recipient_id?: number | null;
  recipient_type?: string | null;
  created_at: string;
  updated_at: string;
}

// Mobile Asset Service
interface MobileAsset {
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
  ownerCost?: number;
  association?: string;
  asset_type_category?: string;
  activities?: Activity[];
}

interface AssetApiResponse {
  pagination: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
  total_count: number;
  total_value: number;
  in_use_count: number;
  breakdown_count: number;
  it_assets: number;
  non_it_assets: number;
  in_store: number;
  dispose_assets: number;
  assets: MobileAsset[];
}

const mobileAssetService = {
  async getAssets(token: string, page: number = 1, filters?: MobileAssetFilters): Promise<AssetApiResponse> {
    try {
      // Get base URL from sessionStorage or use default
      let baseUrl =
        sessionStorage.getItem("baseUrl") || "https://oig-api.gophygital.work";
        // sessionStorage.getItem("baseUrl") || "https://fm-uat-api.lockated.com/";

      // Ensure baseUrl doesn't have trailing slash and starts with https://
      baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
      if (!baseUrl.startsWith("http")) {
        baseUrl = `https://${baseUrl}`;
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      
      // Add filter parameters if provided
      if (filters) {
        if (filters.assetName) queryParams.append('q[name_cont]', filters.assetName);
        if (filters.assetId) queryParams.append('q[id_eq]', filters.assetId);
        if (filters.groupId) queryParams.append('q[pms_asset_group_id_eq]', filters.groupId);
        if (filters.subgroupId) queryParams.append('q[pms_asset_sub_group_id_eq]', filters.subgroupId);
        if (filters.siteId) queryParams.append('q[pms_site_id_eq]', filters.siteId);
        if (filters.buildingId) queryParams.append('q[pms_building_id_eq]', filters.buildingId);
        if (filters.wingId) queryParams.append('q[pms_wing_id_eq]', filters.wingId);
        if (filters.areaId) queryParams.append('q[pms_area_id_eq]', filters.areaId);
        if (filters.floorId) queryParams.append('q[pms_floor_id_eq]', filters.floorId);
        if (filters.roomId) queryParams.append('q[pms_room_id_eq]', filters.roomId);
        if (filters.status) queryParams.append('q[status_eq]', filters.status);
        if (filters.breakdown !== undefined) queryParams.append('q[breakdown_eq]', filters.breakdown.toString());
      }

      const url = `${baseUrl}/pms/assets.json?${queryParams.toString()}`;

      console.log("🔍 FETCHING MOBILE ASSETS:");
      console.log(
        "  - Base URL from sessionStorage:",
        sessionStorage.getItem("baseUrl")
      );
      console.log("  - Processed Base URL:", baseUrl);
      console.log("  - Final URL:", url);
      console.log("  - Page:", page);
      console.log("  - Filters:", filters);
      console.log("  - Token:", token?.substring(0, 20) + "...");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AssetApiResponse = await response.json();
      console.log("📦 MOBILE ASSETS API Response:", data);
      console.log("📊 Assets Summary:");
      console.log("  - Total Count:", data.total_count);
      console.log("  - Current Page:", data.pagination.current_page);
      console.log("  - Total Pages:", data.pagination.total_pages);
      console.log("  - In Use:", data.in_use_count);
      console.log("  - Breakdown:", data.breakdown_count);
      console.log("  - Assets in response:", data.assets?.length || 0);

      return data;
    } catch (error) {
      console.error("❌ Error fetching mobile assets:", error);
      throw error;
    }
  },

  async getAssetById(token: string, assetId: string): Promise<MobileAsset> {
    try {
      // Get base URL from sessionStorage or use default
      let baseUrl =
        sessionStorage.getItem("baseUrl") || "https://oig-api.gophygital.work";
        // sessionStorage.getItem("baseUrl") || "https://fm-uat-api.lockated.com/";

      // Ensure baseUrl doesn't have trailing slash and starts with https://
      baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
      if (!baseUrl.startsWith("http")) {
        baseUrl = `https://${baseUrl}`;
      }

      const url = `${baseUrl}/pms/assets/${assetId}.json`;

      console.log("🔍 FETCHING SPECIFIC ASSET:");
      console.log("  - Base URL from sessionStorage:", sessionStorage.getItem("baseUrl"));
      console.log("  - Processed Base URL:", baseUrl);
      console.log("  - Final URL:", url);
      console.log("  - Asset ID:", assetId);
      console.log("  - Token:", token?.substring(0, 20) + "...");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MobileAsset = await response.json();
      console.log("📦 SPECIFIC ASSET API Response:", data);

      return data;
    } catch (error) {
      console.error("❌ Error fetching specific asset:", error);
      throw error;
    }
  },

  async updateAssetStatus(token: string, assetId: string, newStatus: string): Promise<MobileAsset> {
    try {
      // Get base URL from sessionStorage or use default
      let baseUrl =
        sessionStorage.getItem("baseUrl") || "https://oig-api.gophygital.work";
        // sessionStorage.getItem("baseUrl") || "https://fm-uat-api.lockated.com/";

      // Ensure baseUrl doesn't have trailing slash and starts with https://
      baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
      if (!baseUrl.startsWith("http")) {
        baseUrl = `https://${baseUrl}`;
      }

      const url = `${baseUrl}/pms/assets/${assetId}.json`;

      // Prepare the update payload
      const updatePayload = {
        pms_asset: {
          status: newStatus === "breakdown" ? newStatus : newStatus,
          breakdown:
            newStatus === "in_use"
              ? "false"
              : newStatus === "breakdown"
              ? "true"
              : "",
        },
      };

      console.log("🔄 UPDATING ASSET STATUS:");
      console.log("  - Base URL from sessionStorage:", sessionStorage.getItem("baseUrl"));
      console.log("  - Processed Base URL:", baseUrl);
      console.log("  - Final URL:", url);
      console.log("  - Asset ID:", assetId);
      console.log("  - New Status:", newStatus);
      console.log("  - Update Payload:", updatePayload);
      console.log("  - Token:", token?.substring(0, 20) + "...");

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MobileAsset = await response.json();
      console.log("📦 UPDATED ASSET API Response:", data);

      return data;
    } catch (error) {
      console.error("❌ Error updating asset status:", error);
      throw error;
    }
  },
};

export const MobileAssetPage = () => {
  const { assetId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const token = searchParams.get("token");

  // Check if this is a breakdown page based on URL path
  const isBreakdownPage = location.pathname.includes('/breakdown');

  const [assets, setAssets] = useState<MobileAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MobileAsset | null>(null);
  const [loadingAsset, setLoadingAsset] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<MobileAssetFilters>({});

  // Handle token storage and asset fetching
  useEffect(() => {
    const handleTokenAndFetchAssets = async () => {
      console.log("🔍 MOBILE ASSETS PAGE INITIALIZATION:");
      console.log("  - Token from URL:", token?.substring(0, 20) + "...");
      console.log("  - AssetId:", assetId);
      console.log("  - Is Breakdown Page:", isBreakdownPage);
      console.log(
        "  - Current sessionStorage baseUrl:",
        sessionStorage.getItem("baseUrl")
      );

      // Set baseUrl if not already set
      if (!sessionStorage.getItem("baseUrl")) {
        sessionStorage.setItem("baseUrl", "https://oig-api.gophygital.work");
        // sessionStorage.setItem("baseUrl", "https://fm-uat-api.lockated.com");
        console.log("📝 Set default baseUrl in sessionStorage");
      }

      if (token) {
        // Store token in sessionStorage for future use as mobile_token
        sessionStorage.setItem("mobile_token", token);
        console.log("💾 Mobile token stored in sessionStorage");
      }

      // If assetId is present (QR code scan), skip general asset fetching
      // The specific asset will be fetched in the separate useEffect
      if (assetId) {
        console.log("🎯 AssetId present - skipping general asset fetching");
        return;
      }

      // Only fetch all assets if no specific assetId is requested
      const tokenToUse = token || sessionStorage.getItem("mobile_token");
      if (tokenToUse) {
        console.log("📱 Fetching all assets for list view");
        setLoading(true);
        setError(null);

        try {
          const apiResponse = await mobileAssetService.getAssets(tokenToUse, 1);
          setAssets(apiResponse.assets || []);
          setCurrentPage(apiResponse.pagination.current_page);
          setTotalPages(apiResponse.pagination.total_pages);
          setHasMore(
            apiResponse.pagination.current_page <
              apiResponse.pagination.total_pages
          );
          console.log(
            "✅ Assets fetched successfully:",
            apiResponse.assets?.length || 0,
            "assets"
          );
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to fetch assets";
          setError(errorMessage);
          console.error("❌ Failed to fetch assets:", errorMessage);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("⚠️ No token available - cannot fetch assets");
        setError("No authentication token available");
      }
    };

    // Only run this effect when there's no assetId initially, or when token changes
    if (!assetId) {
      handleTokenAndFetchAssets();
    } else if (token) {
      // Just store the token if assetId is present
      sessionStorage.setItem("mobile_token", token);
      console.log("💾 Mobile token stored in sessionStorage (QR code scan)");
    }
  }, [token, assetId, isBreakdownPage]);

  useEffect(() => {
    const findOrFetchAsset = async () => {
      if (assetId) {
        console.log("🎯 Asset ID detected:", assetId);
        
        // For QR code scenario, directly fetch the specific asset
        const tokenToUse = token || sessionStorage.getItem("mobile_token");
        if (tokenToUse) {
          setLoadingAsset(true);
          try {
            console.log("🔍 Fetching specific asset with ID:", assetId);
            // Use direct asset endpoint instead of filtering
            const specificAsset = await mobileAssetService.getAssetById(tokenToUse, assetId);
            setSelectedAsset(specificAsset);
            console.log("🎯 Fetched specific asset:", specificAsset);
          } catch (err) {
            console.error("❌ Failed to fetch specific asset:", err);
            setSelectedAsset(null);
          } finally {
            setLoadingAsset(false);
          }
        }
      } else {
        setSelectedAsset(null);
      }
    };

    findOrFetchAsset();
  }, [assetId, token]);

  // Load more assets for pagination
  const loadMoreAssets = async () => {
    if (loadingMore || !hasMore) return;

    const tokenToUse = token || sessionStorage.getItem("mobile_token");
    if (!tokenToUse) return;

    setLoadingMore(true);

    try {
      const nextPage = currentPage + 1;
      const apiResponse = await mobileAssetService.getAssets(
        tokenToUse,
        nextPage,
        currentFilters
      );      // Append new assets to existing ones
      setAssets((prevAssets) => [...prevAssets, ...(apiResponse.assets || [])]);
      setCurrentPage(apiResponse.pagination.current_page);
      setTotalPages(apiResponse.pagination.total_pages);
      setHasMore(
        apiResponse.pagination.current_page < apiResponse.pagination.total_pages
      );

      console.log(
        "✅ More assets loaded:",
        apiResponse.assets?.length || 0,
        "new assets"
      );
      console.log("📊 Pagination:", {
        current: apiResponse.pagination.current_page,
        total: apiResponse.pagination.total_pages,
        hasMore:
          apiResponse.pagination.current_page <
          apiResponse.pagination.total_pages,
      });
    } catch (err) {
      console.error("❌ Failed to load more assets:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle filter changes
  const handleApplyFilters = async (filters: MobileAssetFilters) => {
    console.log("🔍 APPLYING FILTERS:", JSON.stringify(filters, null, 2));
    setCurrentFilters(filters);
    
    // Reset pagination when filters change
    setCurrentPage(1);
    setAssets([]);
    
    const tokenToUse = token || sessionStorage.getItem("mobile_token");
    if (!tokenToUse) {
      console.error("❌ No token available for filter request");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("📡 Calling mobileAssetService.getAssets with filters...");
      const apiResponse = await mobileAssetService.getAssets(tokenToUse, 1, filters);
      console.log("✅ Filtered API Response:", {
        assetsCount: apiResponse.assets?.length || 0,
        pagination: apiResponse.pagination,
        firstAsset: apiResponse.assets?.[0] ? {
          id: apiResponse.assets[0].id,
          name: apiResponse.assets[0].name
        } : null
      });
      setAssets(apiResponse.assets || []);
      setCurrentPage(apiResponse.pagination.current_page);
      setTotalPages(apiResponse.pagination.total_pages);
      setHasMore(
        apiResponse.pagination.current_page < apiResponse.pagination.total_pages
      );
      console.log("✅ Filtered assets loaded:", apiResponse.assets?.length || 0, "assets");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch filtered assets";
      setError(errorMessage);
      console.error("❌ Failed to fetch filtered assets:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (assetId: string, newStatus: string) => {
    const tokenToUse = token || sessionStorage.getItem("mobile_token");
    if (!tokenToUse) {
      console.error("❌ No token available for status update");
      return;
    }

    setUpdatingStatus(true);

    try {
      console.log("🔄 Updating asset status:", { assetId, newStatus });
      const updatedAsset = await mobileAssetService.updateAssetStatus(tokenToUse, assetId, newStatus);
      
      // Update the selected asset if it's the same asset
      if (selectedAsset && selectedAsset.id.toString() === assetId) {
        setSelectedAsset(updatedAsset);
      }

      // Update the asset in the assets list
      setAssets(prevAssets => 
        prevAssets.map(asset => 
          asset.id.toString() === assetId ? updatedAsset : asset
        )
      );

      console.log("✅ Asset status updated successfully:", updatedAsset);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update asset status";
      console.error("❌ Failed to update asset status:", errorMessage);
      // You might want to show a toast or alert here
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading assets</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  // Route based on URL structure
  // If assetId is present, show details page
  // If no assetId, show asset list
  if (assetId) {
    // Show loading state while fetching specific asset
    if (loadingAsset) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (isBreakdownPage) {
      // Show breakdown page when URL contains /breakdown
      return selectedAsset ? (
        <MobileAssetBreakdown asset={selectedAsset} />
      ) : (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Asset not found</p>
        </div>
      );
    } else {
      // Show details page when assetId is in URL (without /breakdown)
      return selectedAsset ? (
        <MobileAssetDetails asset={selectedAsset} />
      ) : (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Asset not found</p>
        </div>
      );
    }
  }

  // Show asset list by default
  return (
    <MobileAssetList
      assets={assets || []}
      onLoadMore={loadMoreAssets}
      hasMore={hasMore}
      loadingMore={loadingMore}
      onApplyFilters={handleApplyFilters}
      onStatusUpdate={handleStatusUpdate}
      updatingStatus={updatingStatus}
    />
  );
};
