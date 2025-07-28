import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { MobileAssetList } from "@/components/mobile/MobileAssetList";
import { MobileAssetDetails } from "@/components/mobile/MobileAssetDetails";
import { MobileAssetBreakdown } from "@/components/mobile/MobileAssetBreakdown";

// Mobile Asset Service
interface MobileAsset {
  id: number;
  name: string;
  assetNumber?: string;
  status?: string;
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
  async getAssets(token: string, page: number = 1): Promise<AssetApiResponse> {
    try {
      // Get base URL from sessionStorage or use default
      let baseUrl =
        sessionStorage.getItem("baseUrl") || "https://oig-api.gophygital.work";

      // Ensure baseUrl doesn't have trailing slash and starts with https://
      baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
      if (!baseUrl.startsWith("http")) {
        baseUrl = `https://${baseUrl}`;
      }

      const url = `${baseUrl}/pms/assets.json?page=${page}`;

      console.log("🔍 FETCHING MOBILE ASSETS:");
      console.log(
        "  - Base URL from sessionStorage:",
        sessionStorage.getItem("baseUrl")
      );
      console.log("  - Processed Base URL:", baseUrl);
      console.log("  - Final URL:", url);
      console.log("  - Page:", page);
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
};

export const MobileAssetPage = () => {
  const { assetId } = useParams();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const token = searchParams.get("token");

  const [assets, setAssets] = useState<MobileAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MobileAsset | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Handle token storage and asset fetching
  useEffect(() => {
    const handleTokenAndFetchAssets = async () => {
      console.log("🔍 MOBILE ASSETS PAGE INITIALIZATION:");
      console.log("  - Token from URL:", token?.substring(0, 20) + "...");
      console.log("  - AssetId:", assetId);
      console.log("  - Action:", action);
      console.log(
        "  - Current sessionStorage baseUrl:",
        sessionStorage.getItem("baseUrl")
      );

      // Set baseUrl if not already set
      if (!sessionStorage.getItem("baseUrl")) {
        sessionStorage.setItem("baseUrl", "https://oig-api.gophygital.work");
        console.log("📝 Set default baseUrl in sessionStorage");
      }

      if (token) {
        // Store token in sessionStorage for future use as mobile_token
        sessionStorage.setItem("mobile_token", token);
        console.log("💾 Mobile token stored in sessionStorage");

        // Fetch assets using the token
        setLoading(true);
        setError(null);

        try {
          const apiResponse = await mobileAssetService.getAssets(token, 1);
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
        // Try to get token from sessionStorage
        const storedToken = sessionStorage.getItem("mobile_token");
        if (storedToken) {
          console.log("📱 Using stored token from sessionStorage");
          setLoading(true);
          setError(null);

          try {
            const apiResponse = await mobileAssetService.getAssets(
              storedToken,
              1
            );
            setAssets(apiResponse.assets || []);
            setCurrentPage(apiResponse.pagination.current_page);
            setTotalPages(apiResponse.pagination.total_pages);
            setHasMore(
              apiResponse.pagination.current_page <
                apiResponse.pagination.total_pages
            );
            console.log(
              "✅ Assets fetched with stored token:",
              apiResponse.assets?.length || 0,
              "assets"
            );
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : "Failed to fetch assets";
            setError(errorMessage);
            console.error(
              "❌ Failed to fetch assets with stored token:",
              errorMessage
            );
          } finally {
            setLoading(false);
          }
        } else {
          console.log("⚠️ No token available - cannot fetch assets");
          setError("No authentication token available");
        }
      }
    };

    handleTokenAndFetchAssets();
  }, [token, action, assetId]);

  useEffect(() => {
    if (assetId && assets.length > 0) {
      const asset = assets.find((a) => a.id.toString() === assetId);
      setSelectedAsset(asset || null);
      console.log("🎯 Selected asset:", asset);
    }
  }, [assetId, assets]);

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
        nextPage
      );

      // Append new assets to existing ones
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

  // Route based on action parameter
  switch (action) {
    case "details":
      return selectedAsset ? (
        <MobileAssetDetails asset={selectedAsset} />
      ) : (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Asset not found</p>
        </div>
      );

    case "breakdown":
      return selectedAsset ? (
        <MobileAssetBreakdown asset={selectedAsset} />
      ) : (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Asset not found</p>
        </div>
      );

    default:
      return (
        <MobileAssetList
          assets={assets || []}
          onLoadMore={loadMoreAssets}
          hasMore={hasMore}
          loadingMore={loadingMore}
        />
      );
  }
};
