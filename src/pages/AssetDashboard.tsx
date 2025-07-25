import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAssetsData } from "@/store/slices/assetsSlice";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Eye,
  Filter,
  Package,
  BarChart3,
  TrendingUp,
  Download,
  Zap,
  Wrench,
  AlertTriangle,
  Activity,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BulkUploadDialog } from "@/components/BulkUploadDialog";
import { AssetFilterDialog } from "@/components/AssetFilterDialog";
import { AssetStats } from "@/components/AssetStats";
import { AssetActions } from "@/components/AssetActions";
import { AssetDataTable } from "@/components/AssetDataTable";
import { AssetSelectionPanel } from "@/components/AssetSelectionPanel";
// Removed MoveAssetDialog and DisposeAssetDialog imports - now using respective pages
import { AssetSelector } from "@/components/AssetSelector";
import { RecentAssetsSidebar } from "@/components/RecentAssetsSidebar";
import { DonutChartGrid } from "@/components/DonutChartGrid";
import { useAssetSearch } from "@/hooks/useAssetSearch";
import { BASE_URL, getAuthHeader, ENDPOINTS } from "@/config/apiConfig";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Interface for asset statistics API response
interface AssetStatistics {
  total_assets_count?: {
    info: string;
    total_assets_count: number;
  };
  assets_in_use?: {
    info: string;
    total_assets_in_use: number;
  };
  assets_in_breakdown?: {
    info: string;
    total_assets_in_breakdown: number;
  };
  critical_assets_in_breakdown?: {
    info: string;
    total_assets_in_breakdown: number;
  };
  ppm_conduct_assets_count?: {
    info: string;
    overdue_assets: string;
    total: number;
  };
  average_customer_rating?: {
    info: string;
    avg_rating: number;
  };
}

// Interface for asset status API response
interface AssetStatus {
  // Add proper typing based on the actual API response structure
  [key: string]: any;
}

// Interface for asset distributions API response
interface AssetDistributions {
  success: number;
  message: string;
  info: {
    info: string;
    total_it_assets: number;
    total_non_it_assets: number;
  };
}

// Interface for group-wise assets API response
interface GroupWiseAssets {
  info: string;
  group_wise_assets: {
    group_name: string;
    asset_count: number;
  }[];
}

// Sortable Chart Item Component
const SortableChartItem = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move"
    >
      {children}
    </div>
  );
};

export const AssetDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const {
    data,
    items: assets,
    loading,
    error,
    totalCount,
    totalPages,
    filters,
    totalValue,
  } = useSelector((state: RootState) => state.assets);

  console.log(data);
  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"import" | "update">("import");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedAnalyticsItems, setSelectedAnalyticsItems] = useState<
    string[]
  >([
    "total-available",
    "assets-in-use",
    "asset-breakdown",
    "critical-breakdown",
  ]);
  // Asset statistics state
  const [assetStatistics, setAssetStatistics] = useState<AssetStatistics>({});
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [statisticsError, setStatisticsError] = useState<string | null>(null);
  // Asset status state
  const [assetStatus, setAssetStatus] = useState<AssetStatus>({});
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  // Asset distributions state
  const [assetDistributions, setAssetDistributions] =
    useState<AssetDistributions | null>(null);
  const [distributionsLoading, setDistributionsLoading] = useState(false);
  const [distributionsError, setDistributionsError] = useState<string | null>(
    null
  );
  // Group-wise assets state
  const [groupWiseAssets, setGroupWiseAssets] =
    useState<GroupWiseAssets | null>(null);
  const [groupWiseLoading, setGroupWiseLoading] = useState(false);
  const [groupWiseError, setGroupWiseError] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState({
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
    group: true,
    subGroup: true,
    assetType: true,
  });
  const [chartOrder, setChartOrder] = useState<string[]>([
    "donutCharts",
    "categoryChart",
    "agingMatrix",
    "performanceMetrics",
  ]);

  // Use search hook for search functionality
  const {
    assets: searchAssets,
    loading: searchLoading,
    error: searchError,
    searchAssets: performSearch,
  } = useAssetSearch();

  console.log(searchAssets);

  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Function to get selected site ID from localStorage
  const getSelectedSiteId = () => {
    return localStorage.getItem("selectedSiteId") || "2189"; // Default to 2189 if not found
  };

  // Function to fetch asset statistics from API
  const fetchAssetStatistics = async () => {
    setStatisticsLoading(true);
    setStatisticsError(null);

    try {
      const siteId = getSelectedSiteId();
      const currentDate = getCurrentDate();

      // Build the API URL with parameters
      const url = `${BASE_URL}${
        ENDPOINTS.ASSET_STATISTICS
      }?site_id=${siteId}&from_date=&to_date=&access_token=${getAuthHeader().replace(
        "Bearer ",
        ""
      )}`;

      console.log("Fetching asset statistics from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Asset statistics response:", data);

      setAssetStatistics(data);
    } catch (error) {
      console.error("Error fetching asset statistics:", error);
      setStatisticsError(
        error instanceof Error
          ? error.message
          : "Failed to fetch asset statistics"
      );
    } finally {
      setStatisticsLoading(false);
    }
  };

  // Function to fetch asset status from API
  const fetchAssetStatus = async () => {
    setStatusLoading(true);
    setStatusError(null);

    try {
      const siteId = getSelectedSiteId();
      const currentDate = getCurrentDate();

      // Build the API URL with parameters
      const url = `${BASE_URL}${
        ENDPOINTS.ASSET_STATUS
      }?site_id=${siteId}&from_date=&to_date=&access_token=${getAuthHeader().replace(
        "Bearer ",
        ""
      )}`;

      console.log("Fetching asset status from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Asset status response:", data);

      setAssetStatus(data);
    } catch (error) {
      console.error("Error fetching asset status:", error);
      setStatusError(
        error instanceof Error ? error.message : "Failed to fetch asset status"
      );
    } finally {
      setStatusLoading(false);
    }
  };

  // Function to fetch asset distributions from API
  const fetchAssetDistributions = async () => {
    setDistributionsLoading(true);
    setDistributionsError(null);

    try {
      const siteId = getSelectedSiteId();
      const currentDate = getCurrentDate();

      // Build the API URL with parameters
      const url = `${BASE_URL}${
        ENDPOINTS.ASSET_DISTRIBUTIONS
      }?site_id=${siteId}&from_date=&to_date=&access_token=${getAuthHeader().replace(
        "Bearer ",
        ""
      )}`;

      console.log("Fetching asset distributions from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Asset distributions response:", data);

      setAssetDistributions(data);
    } catch (error) {
      console.error("Error fetching asset distributions:", error);
      setDistributionsError(
        error instanceof Error
          ? error.message
          : "Failed to fetch asset distributions"
      );
    } finally {
      setDistributionsLoading(false);
    }
  };

  // Function to fetch group-wise assets from API
  const fetchGroupWiseAssets = async () => {
    setGroupWiseLoading(true);
    setGroupWiseError(null);

    try {
      const siteId = getSelectedSiteId();

      // Build the API URL with parameters
      const url = `${BASE_URL}/pms/assets/group_wise_assets.json?site_id=${siteId}&from_date=&to_date=&access_token=${getAuthHeader().replace(
        "Bearer ",
        ""
      )}`;

      console.log("Fetching group-wise assets from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Group-wise assets response:", data);

      setGroupWiseAssets(data);
    } catch (error) {
      console.error("Error fetching group-wise assets:", error);
      setGroupWiseError(
        error instanceof Error
          ? error.message
          : "Failed to fetch group-wise assets"
      );
    } finally {
      setGroupWiseLoading(false);
    }
  };
  const pagination = {
    currentPage,
    totalPages: totalPages || 1,
    totalCount: totalCount || 0,
  };

  // Fetch initial assets data
  useEffect(() => {
    if (assets.length === 0) {
      dispatch(fetchAssetsData({ page: currentPage }));
    }
  }, [dispatch, currentPage, assets.length]);

  // Fetch asset statistics when component mounts
  useEffect(() => {
    fetchAssetStatistics();
    fetchAssetStatus();
    fetchAssetDistributions();
    fetchGroupWiseAssets();
  }, []);

  
  // Transform Redux assets to match the expected Asset interface
  const transformedAssets = assets.map((asset, index) => ({
    id: asset.id?.toString() || "",
    name: asset.name || "",
    serialNumber: (pagination.currentPage - 1) * 15 + index + 1,
    assetNumber: asset.asset_number || "",
    status: asset.status as "in_use" | "in_storage" | "breakdown" | "disposed",
    siteName: asset.site_name || "",
    building: asset.building || null,
    wing: asset.wing || null,
    area: asset.area || null,
    pmsRoom: asset.pms_room || null,
    assetGroup: asset.pms_asset_group || "",
    assetSubGroup: asset.sub_group || "",
    assetType: asset.asset_type,
  }));

  const transformedSearchedAssets = searchAssets.map((asset,index) => ({
    id: asset.id?.toString() || "",
    name: asset.name || "",
    serialNumber: (pagination.currentPage - 1) * 15 + index + 1,
    assetNumber: asset.assetNumber || "",
    status: asset.status as "in_use" | "in_storage" | "breakdown" | "disposed",
    siteName: asset.siteName || "",
    building: asset.building || null,
    wing: asset.wing || null,
    area: asset.area || null,
    pmsRoom: asset.pmsRoom || null,
    assetGroup: asset.assetGroup || "",
    assetSubGroup: asset.assetSubGroup || "",
    assetType: asset.assetType,
  }));

  // Use search results if search term exists, otherwise use Redux assets
  const displayAssets = searchTerm.trim()
    ? transformedSearchedAssets
    : transformedAssets;
  const isSearchMode = searchTerm.trim().length > 0;

  // For stats calculation, we need ALL filtered assets, not just current page
  // If we have filters applied, we should use the total filtered count from API response
  // For now, let's use displayAssets but note this limitation
  const allFilteredAssets = displayAssets; // This represents all filtered results

  // Create pagination object for compatibility

  // Create stats object based on current displayed assets (filtered or unfiltered)
  const calculateStats = (assetList: any[]) => {
    console.log("Calculating stats for assets:", assetList.length, "assets");
    console.log("Total count from API:", totalCount);
    console.log(
      "Sample asset statuses:",
      assetList.slice(0, 3).map((a) => ({ id: a.id, status: a.status }))
    );

    // IMPORTANT: The current implementation only calculates from visible page data
    // This should ideally be calculated from ALL filtered assets, not just current page
    const totalAssets = assetList.length;

    // Check for various status formats from API
    const inUseAssets = assetList.filter((asset) => {
      const status = asset.status?.toLowerCase();
      return (
        status === "in_use" ||
        status === "in use" ||
        status === "active" ||
        status === "in-use"
      );
    }).length;

    const breakdownAssets = assetList.filter((asset) => {
      const status = asset.status?.toLowerCase();
      return (
        status === "breakdown" || status === "broken" || status === "faulty"
      );
    }).length;

    const inStoreAssets = assetList.filter((asset) => {
      const status = asset.status?.toLowerCase();
      return (
        status === "in_storage" ||
        status === "in_store" ||
        status === "in store" ||
        status === "storage" ||
        status === "stored"
      );
    }).length;

    const disposeAssets = assetList.filter((asset) => {
      const status = asset.status?.toLowerCase();
      return (
        status === "disposed" || status === "dispose" || status === "discarded"
      );
    }).length;

    const missingAssets = assetList.filter((asset) => {
      const status = asset.status?.toLowerCase();
      return status === "missing" || status === "lost";
    }).length;

    // Get unique status values for debugging
    const uniqueStatuses = [...new Set(assetList.map((asset) => asset.status))];
    console.log("Unique status values found:", uniqueStatuses);
    console.log("Stats calculated from current page:", {
      total: totalAssets,
      inUse: inUseAssets,
      breakdown: breakdownAssets,
      inStore: inStoreAssets,
      dispose: disposeAssets,
      missing: missingAssets,
    });

    // Note: This is a limitation - we're showing stats for current page only
    // Ideally, the API should return aggregated stats for all filtered results
    return {
      total: totalCount || totalAssets, // Use total count from API if available
      total_value: "₹0.00",
      nonItAssets: Math.floor((totalCount || totalAssets) * 0.6),
      itAssets: Math.floor((totalCount || totalAssets) * 0.4),
      inUse: inUseAssets,
      breakdown: breakdownAssets,
      in_store: inStoreAssets,
      dispose: disposeAssets,
    };
  };

  // Calculate stats from currently displayed assets (this updates with filters)
  // const stats = calculateStats(displayAssets);
  const stats = {
    ...calculateStats(displayAssets),
    total_value:
      totalValue !== undefined && totalValue !== null
        ? String(totalValue)
        : "₹0.00",
  };

  console.log("Final stats object:", stats);
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle asset stat card clicks
  const handleStatCardClick = (filterType: string) => {
    let filters: any = {};

    switch (filterType) {
      case "total":
        // No filters for total - show all assets
        filters = {};
        break;
      case "non_it":
        filters = { it_asset_eq: false };
        break;
      case "it":
        filters = { it_asset_eq: true };
        break;
      case "in_use":
        filters = { breakdown_eq: false };
        break;
      case "breakdown":
        filters = { breakdown_eq: true };
        break;
      case "in_store":
        filters = { status_eq: "in_store" };
        break;
      case "dispose":
        filters = { status_eq: "dispose" };
        break;
      default:
        filters = {};
    }

    // Dispatch the filter to fetch filtered assets
    dispatch(fetchAssetsData({ page: 1, filters }));
    setCurrentPage(1);
  };

  // Handle search with API call
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      performSearch(term);
    }
  };

  // Handle refresh - fetch assets from Redux
  const handleRefresh = () => {
    dispatch(fetchAssetsData({ page: currentPage, filters }));
    // Also refresh asset statistics and status
    fetchAssetStatistics();
    fetchAssetStatus();
    fetchAssetDistributions();
    fetchGroupWiseAssets();
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    dispatch(fetchAssetsData({ page, filters }));
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

  // Get selected asset objects with id and name
  const selectedAssetObjects = displayAssets
    .filter((asset) => selectedAssets.includes(asset.id))
    .map((asset) => ({
      id: asset.id,
      name: asset.name,
    }));

  const handleAddAsset = () => {
    navigate("/maintenance/asset/add");
  };

  const handleImport = () => {
    setUploadType("import");
    setIsBulkUploadOpen(true);
  };

  const handleUpdate = () => {
    setUploadType("update");
    setIsBulkUploadOpen(true);
  };

  const handleViewAsset = (assetId: string) => {
    navigate(`/maintenance/asset/details/${assetId}`);
  };

  const handleColumnChange = (columns: typeof visibleColumns) => {
    setVisibleColumns(columns);
  };

  // Selection panel handlers
  const handleMoveAsset = () => {
    console.log("Move asset clicked for", selectedAssets.length, "assets");
    const selectedAssetObjects = displayAssets.filter((asset) =>
      selectedAssets.includes(asset.id)
    );
    navigate("/maintenance/asset/move", {
      state: { selectedAssets: selectedAssetObjects },
    });
    // Clear selection to close the panel
    handleSelectAll(false);
  };

  const handleDisposeAsset = () => {
    console.log("Dispose asset clicked for", selectedAssets.length, "assets");
    const selectedAssetObjects = displayAssets.filter((asset) =>
      selectedAssets.includes(asset.id)
    );
    navigate("/maintenance/asset/dispose", {
      state: { selectedAssets: selectedAssetObjects },
    });
    // Clear selection to close the panel
    handleSelectAll(false);
  };

  const handlePrintQRCode = () => {
    console.log("Print QR code clicked for", selectedAssets.length, "assets");
  };

  const handleCheckIn = () => {
    console.log("Check in clicked for", selectedAssets.length, "assets");
  };

  const handleClearSelection = () => {
    console.log(
      "Clear selection called, current selected assets:",
      selectedAssets.length
    );
    handleSelectAll(false);
    console.log("Selection cleared using handleSelectAll(false)");
  };

  // Handle drag end for chart reordering
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setChartOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Analytics data
  const statusData = [
    { name: "In Use", value: stats.inUse, color: "hsl(120, 70%, 50%)" },
    { name: "Breakdown", value: stats.breakdown, color: "hsl(0, 70%, 50%)" },
  ];

  const assetTypeData = [
    { name: "IT Equipment", value: stats.itAssets, color: "hsl(35, 35%, 75%)" },
    {
      name: "Non-IT Equipment",
      value: stats.nonItAssets,
      color: "hsl(25, 45%, 55%)",
    },
  ];

  // Process asset status data for donut charts
  const processAssetStatusForCharts = () => {
    // If we have asset status data from API, use it, otherwise use stats
    const chartStatusData = [
      {
        name: "In Use",
        value:
          assetStatistics.assets_in_use?.total_assets_in_use || stats.inUse,
        color: "#c6b692",
      },
      {
        name: "Breakdown",
        value:
          assetStatistics.assets_in_breakdown?.total_assets_in_breakdown ||
          stats.breakdown,
        color: "#d8dcdd",
      },
    ];

    // Use API data for asset type distribution if available
    const chartTypeData = assetDistributions
      ? [
          {
            name: "IT Equipment",
            value: assetDistributions.info.total_it_assets,
            color: "#d8dcdd",
          },
          {
            name: "Non-IT Equipment",
            value: assetDistributions.info.total_non_it_assets,
            color: "#c6b692",
          },
        ]
      : [
          {
            name: "IT Equipment",
            value: stats.itAssets,
            color: "#d8dcdd",
          },
          {
            name: "Non-IT Equipment",
            value: stats.nonItAssets,
            color: "#c6b692",
          },
        ];

    return { chartStatusData, chartTypeData };
  };

  const { chartStatusData, chartTypeData } = processAssetStatusForCharts();

  // Process group-wise assets data for category chart
  const categoryData = groupWiseAssets?.group_wise_assets?.map((item) => ({
    name: item.group_name,
    value: item.asset_count,
  })) || [{ name: "Loading...", value: 0 }];

  const agingMatrixData = [
    { priority: "P1", "0-1Y": 15, "1-2Y": 8, "2-3Y": 5, "3-4Y": 3, "4-5Y": 2 },
    { priority: "P2", "0-1Y": 25, "1-2Y": 12, "2-3Y": 8, "3-4Y": 5, "4-5Y": 3 },
    {
      priority: "P3",
      "0-1Y": 35,
      "1-2Y": 18,
      "2-3Y": 12,
      "3-4Y": 8,
      "4-5Y": 5,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="list"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.875 4.25L3 5.375L5.25 3.125M1.875 9.5L3 10.625L5.25 8.375M1.875 14.75L3 15.875L5.25 13.625M7.875 9.5H16.125M7.875 14.75H16.125M7.875 4.25H16.125"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Asset List
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <svg
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
            >
              <path
                d="M7.66681 11.6106C6.59669 11.5192 5.69719 11.0831 4.96831 10.3024C4.23944 9.52162 3.875 8.5875 3.875 7.5C3.875 6.35413 4.27606 5.38019 5.07819 4.57819C5.88019 3.77606 6.85413 3.375 8 3.375C9.0875 3.375 10.0216 3.73825 10.8024 4.46475C11.5831 5.19112 12.0192 6.08944 12.1106 7.15969L10.9179 6.80625C10.7557 6.13125 10.4066 5.57812 9.87031 5.14688C9.33419 4.71563 8.71075 4.5 8 4.5C7.175 4.5 6.46875 4.79375 5.88125 5.38125C5.29375 5.96875 5 6.675 5 7.5C5 8.2125 5.21681 8.8375 5.65044 9.375C6.08406 9.9125 6.636 10.2625 7.30625 10.425L7.66681 11.6106ZM8.56681 14.5946C8.47231 14.6149 8.37788 14.625 8.2835 14.625H8C7.01438 14.625 6.08812 14.438 5.22125 14.064C4.35437 13.69 3.60031 13.1824 2.95906 12.5413C2.31781 11.9002 1.81019 11.1463 1.43619 10.2795C1.06206 9.41275 0.875 8.48669 0.875 7.50131C0.875 6.51581 1.062 5.5895 1.436 4.72237C1.81 3.85525 2.31756 3.101 2.95869 2.45962C3.59981 1.81825 4.35375 1.31044 5.2205 0.936187C6.08725 0.562062 7.01331 0.375 7.99869 0.375C8.98419 0.375 9.9105 0.562062 10.7776 0.936187C11.6448 1.31019 12.399 1.81781 13.0404 2.45906C13.6818 3.10031 14.1896 3.85437 14.5638 4.72125C14.9379 5.58812 15.125 6.51438 15.125 7.5V7.77975C15.125 7.873 15.1149 7.96631 15.0946 8.05969L14 7.725V7.5C14 5.825 13.4187 4.40625 12.2563 3.24375C11.0938 2.08125 9.675 1.5 8 1.5C6.325 1.5 4.90625 2.08125 3.74375 3.24375C2.58125 4.40625 2 5.825 2 7.5C2 9.175 2.58125 10.5938 3.74375 11.7563C4.90625 12.9187 6.325 13.5 8 13.5H8.225L8.56681 14.5946ZM14.1052 14.7332L10.7043 11.325L9.88944 13.7884L8 7.5L14.2884 9.38944L11.825 10.2043L15.2332 13.6052L14.1052 14.7332Z"
                fill="currentColor"
              />
            </svg>
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            {/* Total Assets Available */}
            <div
              className="p-6 rounded-lg flex items-center gap-4"
              style={{ backgroundColor: "#f6f4ee" }}
            >
              <div className="w-14 h-14 bg-[#C4B89D54]  flex items-center justify-center">
                <Package className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-lg font-semibold uppercase text-[#1A1A1A]">
                  {statisticsLoading
                    ? "..."
                    : assetStatistics.total_assets_count?.total_assets_count ||
                      stats.total}
                </div>
                <div className="text-sm text-gray-600">Total Assets</div>
              </div>
            </div>

            {/* Asset In Use */}
            <div
              className="p-6 rounded-lg flex items-center gap-4"
              style={{ backgroundColor: "#f6f4ee" }}
            >
              <div className="w-14 h-14 bg-[#C4B89D54]  flex items-center justify-center">
                <Activity
                  className="w-6 h-6 text-white"
                  style={{ color: "#C72030" }}
                />
              </div>
              <div>
                <div className="text-lg font-semibold uppercase text-[#1A1A1A]">
                  {statisticsLoading
                    ? "..."
                    : assetStatistics.assets_in_use?.total_assets_in_use ||
                      stats.inUse}
                </div>
                <div className="text-sm text-gray-600">Asset In Use</div>
              </div>
            </div>

            {/* Asset In Breakdown */}
            <div
              className="p-6 rounded-lg flex items-center gap-4"
              style={{ backgroundColor: "#f6f4ee" }}
            >
              <div className="w-14 h-14 bg-[#C4B89D54]  flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-lg font-semibold uppercase text-[#1A1A1A]">
                  {statisticsLoading
                    ? "..."
                    : assetStatistics.assets_in_breakdown
                        ?.total_assets_in_breakdown || stats.breakdown}
                </div>
                <div className="text-sm text-gray-600">Asset In Breakdown</div>
              </div>
            </div>

            {/* Critical Assets In Breakdown */}
            <div
              className="p-6 rounded-lg flex items-center gap-4"
              style={{ backgroundColor: "#f6f4ee" }}
            >
              <div className="w-14 h-14 bg-[#C4B89D54]  flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-lg font-semibold uppercase text-[#1A1A1A]">
                  {statisticsLoading
                    ? "..."
                    : assetStatistics.critical_assets_in_breakdown
                        ?.total_assets_in_breakdown || 0}
                </div>
                <div className="text-sm text-gray-600">
                  Critical Assets In Breakdown
                </div>
              </div>
            </div>

            {/* PPM Overdue */}
            <div
              className="p-6 rounded-lg flex items-center gap-4"
              style={{ backgroundColor: "#f6f4ee" }}
            >
              <div className="w-14 h-14 bg-[#C4B89D54]  flex items-center justify-center">
                <Wrench className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-lg font-semibold uppercase text-[#1A1A1A]">
                  {statisticsLoading
                    ? "..."
                    : assetStatistics.ppm_conduct_assets_count?.total || 0}
                </div>
                <div className="text-sm text-gray-600">PPM Overdue</div>
              </div>
            </div>

            {/* Customer Average */}
            <div
              className="p-6 rounded-lg flex items-center gap-4"
              style={{ backgroundColor: "#f6f4ee" }}
            >
              <div className="w-14 h-14 bg-[#C4B89D54]  flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-lg font-semibold uppercase text-[#1A1A1A]">
                  {statisticsLoading
                    ? "..."
                    : assetStatistics.average_customer_rating?.avg_rating || 0}
                </div>
                <div className="text-sm text-gray-600">Customer Average</div>
              </div>
            </div>
          </div>

          {/* Error message for statistics */}
          {statisticsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              <p className="text-sm">
                Failed to load asset statistics: {statisticsError}
              </p>
              <button
                onClick={fetchAssetStatistics}
                className="text-red-800 underline text-sm mt-1 hover:text-red-900"
              >
                Retry
              </button>
            </div>
          )}

          {/* Error message for status */}
          {statusError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              <p className="text-sm">
                Failed to load asset status: {statusError}
              </p>
              <button
                onClick={fetchAssetStatus}
                className="text-red-800 underline text-sm mt-1 hover:text-red-900"
              >
                Retry
              </button>
            </div>
          )}

          {/* Error message for distributions */}
          {distributionsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              <p className="text-sm">
                Failed to load asset distributions: {distributionsError}
              </p>
              <button
                onClick={fetchAssetDistributions}
                className="text-red-800 underline text-sm mt-1 hover:text-red-900"
              >
                Retry
              </button>
            </div>
          )}

          {/* Error message for group-wise assets */}
          {groupWiseError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              <p className="text-sm">
                Failed to load group-wise assets: {groupWiseError}
              </p>
              <button
                onClick={fetchGroupWiseAssets}
                className="text-red-800 underline text-sm mt-1 hover:text-red-900"
              >
                Retry
              </button>
            </div>
          )}

          {/* Header with Asset Selector */}
          <div className="flex justify-end">
            <AssetSelector
              selectedItems={selectedAnalyticsItems}
              onSelectionChange={setSelectedAnalyticsItems}
            />
          </div>

          {/* Main Analytics Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Section - Charts (3 columns) */}
            <div className="lg:col-span-3 space-y-6">
              {/* All Charts with Drag and Drop */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={chartOrder}
                  strategy={rectSortingStrategy}
                >
                  <div className="space-y-6">
                    {chartOrder.map((chartId) => {
                      if (chartId === "donutCharts") {
                        return (
                          <SortableChartItem key={chartId} id={chartId}>
                            <DonutChartGrid
                              assetStatusData={chartStatusData}
                              assetTypeData={chartTypeData}
                              loading={
                                statisticsLoading ||
                                statusLoading ||
                                distributionsLoading ||
                                groupWiseLoading
                              }
                            />
                          </SortableChartItem>
                        );
                      }

                      if (chartId === "categoryChart") {
                        return (
                          <SortableChartItem key={chartId} id={chartId}>
                            <div className="bg-white border border-[hsl(var(--analytics-border))] p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3
                                  className="text-lg font-semibold"
                                  style={{ color: "black" }}
                                >
                                  Category-wise Assets
                                  {groupWiseLoading && (
                                    <span className="ml-2 text-sm text-gray-500">
                                      (Loading...)
                                    </span>
                                  )}
                                </h3>
                                <Download className="w-4 h-4 text-[hsl(var(--analytics-muted))] cursor-pointer" />
                              </div>
                              {groupWiseError ? (
                                <div className="flex items-center justify-center h-64 text-red-500">
                                  <div className="text-center">
                                    <p className="mb-2">
                                      Failed to load category data
                                    </p>
                                    <button
                                      onClick={fetchGroupWiseAssets}
                                      className="text-red-600 underline hover:text-red-800"
                                    >
                                      Retry
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <ResponsiveContainer width="100%" height={250}>
                                  <BarChart data={categoryData}>
                                    <CartesianGrid
                                      strokeDasharray="3 3"
                                      stroke="hsl(var(--analytics-border))"
                                    />
                                    <XAxis
                                      dataKey="name"
                                      tick={{
                                        fill: "hsl(var(--analytics-text))",
                                        fontSize: 12,
                                      }}
                                      interval={0}
                                      angle={-45}
                                      textAnchor="end"
                                      height={80}
                                    />
                                    <YAxis
                                      tick={{
                                        fill: "hsl(var(--analytics-text))",
                                        fontSize: 12,
                                      }}
                                    />
                                    <Tooltip />
                                    <Bar
                                      dataKey="value"
                                      fill="hsl(var(--chart-tan))"
                                    />
                                  </BarChart>
                                </ResponsiveContainer>
                              )}
                            </div>
                          </SortableChartItem>
                        );
                      }

                      // if (chartId === "agingMatrix") {
                      //   return (
                      //     <SortableChartItem key={chartId} id={chartId}>
                      //       <div className="bg-white border border-[hsl(var(--analytics-border))] p-6">
                      //         <div className="flex items-center justify-between mb-4">
                      //           <h3
                      //             className="text-lg font-semibold"
                      //             style={{ color: "black" }}
                      //           >
                      //             Asset Aging Matrix
                      //           </h3>
                      //           <Download className="w-4 h-4 text-[hsl(var(--analytics-muted))] cursor-pointer" />
                      //         </div>
                      //         <div className="overflow-x-auto">
                      //           <table className="w-full border-collapse">
                      //             <thead>
                      //               <tr className="bg-[hsl(var(--analytics-background))]">
                      //                 <th className="border border-[hsl(var(--analytics-border))] p-2 text-left text-sm font-medium text-[hsl(var(--analytics-text))]">
                      //                   Priority
                      //                 </th>
                      //                 <th className="border border-[hsl(var(--analytics-border))] p-2 text-center text-sm font-medium text-[hsl(var(--analytics-text))]">
                      //                   0-1Y
                      //                 </th>
                      //                 <th className="border border-[hsl(var(--analytics-border))] p-2 text-center text-sm font-medium text-[hsl(var(--analytics-text))]">
                      //                   1-2Y
                      //                 </th>
                      //                 <th className="border border-[hsl(var(--analytics-border))] p-2 text-center text-sm font-medium text-[hsl(var(--analytics-text))]">
                      //                   2-3Y
                      //                 </th>
                      //                 <th className="border border-[hsl(var(--analytics-border))] p-2 text-center text-sm font-medium text-[hsl(var(--analytics-text))]">
                      //                   3-4Y
                      //                 </th>
                      //                 <th className="border border-[hsl(var(--analytics-border))] p-2 text-center text-sm font-medium text-[hsl(var(--analytics-text))]">
                      //                   4-5Y
                      //                 </th>
                      //               </tr>
                      //             </thead>
                      //             <tbody>
                      //               {agingMatrixData.map((row, index) => (
                      //                 <tr key={index}>
                      //                   <td className="border border-[hsl(var(--analytics-border))] p-2 font-medium text-[hsl(var(--analytics-text))]">
                      //                     {row.priority}
                      //                   </td>
                      //                   <td className="border border-[hsl(var(--analytics-border))] p-2 text-center text-[hsl(var(--analytics-text))]">
                      //                     {row["0-1Y"]}
                      //                   </td>
                      //                   <td className="border border-[hsl(var(--analytics-border))] p-2 text-center text-[hsl(var(--analytics-text))]">
                      //                     {row["1-2Y"]}
                      //                   </td>
                      //                   <td className="border border-[hsl(var(--analytics-border))] p-2 text-center text-[hsl(var(--analytics-text))]">
                      //                     {row["2-3Y"]}
                      //                   </td>
                      //                   <td className="border border-[hsl(var(--analytics-border))] p-2 text-center text-[hsl(var(--analytics-text))]">
                      //                     {row["3-4Y"]}
                      //                   </td>
                      //                   <td className="border border-[hsl(var(--analytics-border))] p-2 text-center text-[hsl(var(--analytics-text))]">
                      //                     {row["4-5Y"]}
                      //                   </td>
                      //                 </tr>
                      //               ))}
                      //             </tbody>
                      //           </table>
                      //         </div>
                      //       </div>
                      //     </SortableChartItem>
                      //   );
                      // }

                      // if (chartId === "performanceMetrics") {
                      //   return (
                      //     <SortableChartItem key={chartId} id={chartId}>
                      //       <div className="bg-white border border-[hsl(var(--analytics-border))] p-6">
                      //         <div className="flex items-center justify-between mb-4">
                      //           <h3
                      //             className="text-lg font-semibold"
                      //             style={{ color: "black" }}
                      //           >
                      //             Performance Metrics
                      //           </h3>
                      //           <Download className="w-4 h-4 text-[hsl(var(--analytics-muted))] cursor-pointer" />
                      //         </div>
                      //         <div className="space-y-4">
                      //           <div className="flex justify-between items-center p-3 bg-[hsl(var(--analytics-background))] rounded">
                      //             <span className="text-sm text-[hsl(var(--analytics-text))]">
                      //               Average Uptime
                      //             </span>
                      //             <span className="font-semibold text-green-600">
                      //               98.5%
                      //             </span>
                      //           </div>
                      //           <div className="flex justify-between items-center p-3 bg-[hsl(var(--analytics-background))] rounded">
                      //             <span className="text-sm text-[hsl(var(--analytics-text))]">
                      //               Maintenance Cost
                      //             </span>
                      //             <span className="font-semibold text-[hsl(var(--analytics-text))]">
                      //               ₹45,000
                      //             </span>
                      //           </div>
                      //           <div className="flex justify-between items-center p-3 bg-[hsl(var(--analytics-background))] rounded">
                      //             <span className="text-sm text-[hsl(var(--analytics-text))]">
                      //               Asset Utilization
                      //             </span>
                      //             <span className="font-semibold text-blue-600">
                      //               85.2%
                      //             </span>
                      //           </div>
                      //           <div className="flex justify-between items-center p-3 bg-[hsl(var(--analytics-background))] rounded">
                      //             <span className="text-sm text-[hsl(var(--analytics-text))]">
                      //               ROI
                      //             </span>
                      //             <span className="font-semibold text-green-600">
                      //               12.5%
                      //             </span>
                      //           </div>
                      //         </div>
                      //       </div>
                      //     </SortableChartItem>
                      //   );
                      // }

                      return null;
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Right Sidebar - Recent Assets (1 column) */}
            <div className="lg:col-span-1">
              <RecentAssetsSidebar />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-6 mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-lg">Loading assets...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-red-500">Error: {error}</div>
            </div>
          ) : (
            <>
              <AssetStats stats={data} onCardClick={handleStatCardClick} />

              {/* <AssetActions
                searchTerm={searchTerm}
                onSearch={handleSearch}
                onAddAsset={handleAddAsset}
                onImport={handleImport}
                onUpdate={handleUpdate}
                onFilterOpen={() => setIsFilterOpen(true)}
                onRefresh={handleRefresh}
                visibleColumns={visibleColumns}
                onColumnChange={handleColumnChange}
              /> */}

              <div className="relative">
                <AssetDataTable
                  assets={displayAssets}
                  selectedAssets={selectedAssets}
                  visibleColumns={visibleColumns}
                  onSelectAll={handleSelectAll}
                  onSelectAsset={handleSelectAsset}
                  onViewAsset={handleViewAsset}
                  handleAddAsset={handleAddAsset}
                  handleImport={handleImport}
                  onFilterOpen={() => setIsFilterOpen(true)}
                  onSearch={handleSearch}
                  onRefreshData={handleRefresh}
                />

                {/* Empty state when no data and filters are applied */}
                {!loading &&
                  displayAssets.length === 0 &&
                  Object.keys(filters).length > 0 && (
                    <div className="text-center py-8">
                      <div className="text-gray-500 text-lg mb-2">
                        No assets found
                      </div>
                      <div className="text-gray-400 text-sm">
                        Try adjusting your filters to see more results
                      </div>
                    </div>
                  )}

                {/* Selection Panel - positioned as overlay within table container */}
                {selectedAssets.length > 0 && (
                  <AssetSelectionPanel
                    selectedCount={selectedAssets.length}
                    selectedAssets={selectedAssetObjects}
                    onMoveAsset={handleMoveAsset}
                    onDisposeAsset={handleDisposeAsset}
                    onPrintQRCode={handlePrintQRCode}
                    onCheckIn={handleCheckIn}
                    onClearSelection={handleClearSelection}
                  />
                )}
              </div>

              {/* API-driven Pagination */}
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

                    {Array.from(
                      { length: Math.min(pagination.totalPages, 10) },
                      (_, i) => i + 1
                    ).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={pagination.currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {pagination.totalPages > 10 && (
                      <PaginationItem>
                        <PaginationEllipsis />
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
                  {pagination.totalPages}({pagination.totalCount} total assets)
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        title={uploadType === "import" ? "Import Assets" : "Update Assets"}
      />

      <AssetFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      {/* Removed MoveAssetDialog and DisposeAssetDialog - now using respective pages */}
    </div>
  );
};