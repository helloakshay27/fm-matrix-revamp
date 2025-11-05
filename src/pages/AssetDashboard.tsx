// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";
// import { fetchAssetsData } from "@/store/slices/assetsSlice";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Plus,
//   Eye,
//   Filter,
//   Package,
//   BarChart3,
//   TrendingUp,
//   Download,
//   Zap,
//   Wrench,
//   AlertTriangle,
//   Activity,
// } from "lucide-react";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { BulkUploadDialog } from "@/components/BulkUploadDialog";
// import { AssetFilterDialog } from "@/components/AssetFilterDialog";
// import { AssetStats } from "@/components/AssetStats";
// import { AssetActions } from "@/components/AssetActions";
// import { AssetDataTable } from "@/components/AssetDataTable";
// import { AssetSelectionPanel } from "@/components/AssetSelectionPanel";
// // Removed MoveAssetDialog and DisposeAssetDialog imports - now using respective pages
// import { AssetSelector } from "@/components/AssetSelector";
// import { RecentAssetsSidebar } from "@/components/RecentAssetsSidebar";
// import { DonutChartGrid } from "@/components/DonutChartGrid";
// import { AssetAnalyticsComponents } from "@/components/AssetAnalyticsComponents";
// import { AssetAnalyticsFilterDialog } from "@/components/AssetAnalyticsFilterDialog";
// import { assetAnalyticsDownloadAPI } from "@/services/assetAnalyticsDownloadAPI";
// import { useAssetSearch } from "@/hooks/useAssetSearch";
// import {
//   API_CONFIG,
//   getFullUrl,
//   getAuthHeader,
//   ENDPOINTS,
// } from "@/config/apiConfig";
// import { toast } from "sonner";
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   rectSortingStrategy,
// } from "@dnd-kit/sortable";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import AssetStatisticsSelector from "@/components/AssetStatisticsSelector";
// import { AssetAnalyticsSelector } from "@/components/AssetAnalyticsSelector";
// import { ca } from "date-fns/locale";

// // Analytics data interfaces are now handled by AssetAnalyticsComponents

// // Sortable Chart Item Component
// const SortableChartItem = ({
//   id,
//   children,
// }: {
//   id: string;
//   children: React.ReactNode;
// }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//   };

//   // Handle pointer down to prevent drag on button/icon clicks
//   const handlePointerDown = (e: React.PointerEvent) => {
//     const target = e.target as HTMLElement;
//     // Check if the click is on a button, icon, or download element
//     if (
//       target.closest("button") ||
//       target.closest("[data-download]") ||
//       target.closest("svg") ||
//       target.tagName === "BUTTON" ||
//       target.tagName === "SVG" ||
//       target.closest(".download-btn")
//     ) {
//       e.stopPropagation();
//       return;
//     }
//     // For other elements, proceed with drag
//     if (listeners?.onPointerDown) {
//       listeners.onPointerDown(e);
//     }
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       onPointerDown={handlePointerDown}
//       className="cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md"
//     >
//       {children}
//     </div>
//   );
// };

// export const AssetDashboard = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();

//   // Redux state
//   const {
//     data,
//     items: assets,
//     loading,
//     error,
//     totalCount,
//     totalPages,
//     filters,
//     totalValue,
//     available_custom_fields: reduxCustomFields,
//   } = useSelector((state: RootState) => state.assets);

//   console.log(assets);

//   console.log(data);
//   // Local state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
//   const [uploadType, setUploadType] = useState<"import" | "update">("import");
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [availableCustomFields, setAvailableCustomFields] = useState<Array<{ key: string; title: string }>>([
//     // Temporary test data to verify the table works
//     {key: "asset_category", title: "Asset Category"},
//     {key: "asset_number", title: "Asset Number"},
//     {key: "building_type", title: "Building Type"},
//     {key: "location", title: "Location"},
//     {key: "ownership_type", title: "Ownership Type"}
//   ]);
//   const [selectedAnalyticsItems, setSelectedAnalyticsItems] = useState<
//     string[]
//   >([
//     "total-available",
//     "assets-in-use",
//     "asset-breakdown",
//     "critical-breakdown",
//   ]);

//   // Analytics filter state with default date range (today to last year)
//   const getDefaultDateRange = () => {
//     const today = new Date();
//     const lastYear = new Date();
//     lastYear.setFullYear(today.getFullYear() - 1);

//     return {
//       fromDate: lastYear,
//       toDate: today,
//     };
//   };

//   const [analyticsDateRange, setAnalyticsDateRange] = useState(
//     getDefaultDateRange()
//   );
//   const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
//   const [selectedAnalyticsTypes, setSelectedAnalyticsTypes] = useState<
//     string[]
//   >(["groupWise", "categoryWise", "statusDistribution", "assetDistributions"]);
//   const [analyticsData, setAnalyticsData] = useState<any>({});
//   const [analyticsLoading, setAnalyticsLoading] = useState(false);
//   // Analytics data state is now handled by AssetAnalyticsComponents
//   const [visibleColumns, setVisibleColumns] = useState({
//     actions: true,
//     serialNumber: true,
//     assetName: true,
//     assetId: true,
//     assetNo: true,
//     assetStatus: true,
//     site: true,
//     building: true,
//     wing: true,
//     floor: true,
//     area: true,
//     room: true,
//     group: true,
//     subGroup: true,
//     assetType: true,
//   });
//   const [chartOrder, setChartOrder] = useState<string[]>([
//     "statusDistribution",
//     "assetDistributions",
//     "categoryWise",
//     "groupWise",
//   ]);

//   // Use search hook for search functionality
//   const {
//     assets: searchAssets,
//     loading: searchLoading,
//     error: searchError,
//     searchAssets: performSearch,
//   } = useAssetSearch();

//   console.log(searchAssets);

//   // Function to get current date in YYYY-MM-DD format
//   const getCurrentDate = () => {
//     return new Date().toISOString().split("T")[0];
//   };

//   // Function to format date for API
//   const formatDateForAPI = (date: Date) => {
//     return date.toISOString().split("T")[0];
//   };

//   // Function to get selected site ID from localStorage
//   const getSelectedSiteId = () => {
//     return localStorage.getItem("selectedSiteId"); // Default to 2189 if not found
//   };

//   // Analytics data will be handled by AssetAnalyticsComponents
//   // Removed duplicate fetch functions to prevent multiple API calls

//   // Analytics handler functions
//   const handleAnalyticsFilterApply = (
//     startDateStr: string,
//     endDateStr: string
//   ) => {
//     const startDate = new Date(startDateStr);
//     const endDate = new Date(endDateStr);
//     setAnalyticsDateRange({ fromDate: startDate, toDate: endDate });
//     // AssetAnalyticsComponents will handle the data fetching automatically
//   };

//   const handleAnalyticsSelectionChange = (selectedTypes: string[]) => {
//     setSelectedAnalyticsTypes(selectedTypes);
//   };

//   const handleAnalyticsDownload = async (type: string) => {
//     try {
//       const fromDate = analyticsDateRange.fromDate;
//       const toDate = analyticsDateRange.toDate;

//       toast.info("Preparing download...");

//       switch (type) {
//         case "groupWise":
//           await assetAnalyticsDownloadAPI.downloadGroupWiseAssetsData(
//             fromDate,
//             toDate
//           );
//           toast.success("Group-wise assets data downloaded successfully!");
//           break;
//         case "categoryWise":
//           await assetAnalyticsDownloadAPI.downloadCategoryWiseAssetsData(
//             fromDate,
//             toDate
//           );
//           toast.success("Category-wise assets data downloaded successfully!");
//           break;
//         case "assetDistribution":
//           await assetAnalyticsDownloadAPI.downloadAssetDistributionsData(
//             fromDate,
//             toDate
//           );
//           toast.success("Asset distribution data downloaded successfully!");
//           break;
//         case "assetsInUse":
//           await assetAnalyticsDownloadAPI.downloadAssetsInUseData(
//             fromDate,
//             toDate
//           );
//           toast.success("Assets in use data downloaded successfully!");
//           break;
//         default:
//           console.warn("Unknown analytics download type:", type);
//           toast.error("Unknown analytics download type.");
//       }
//     } catch (error) {
//       console.error("Error downloading analytics:", error);
//       toast.error("Failed to download analytics data. Please try again.");
//     }
//   };

//   const pagination = {
//     currentPage,
//     totalPages: totalPages || 1,
//     totalCount: totalCount || 0,
//   };

//   // Fetch initial assets data only on component mount
//   useEffect(() => {
//     // Only fetch if we don't have any filters applied and no assets loaded
//     // if (Object.keys(filters).length === 0 && assets.length === 0) {
//     dispatch(fetchAssetsData({ page: currentPage }));
//     // }
//   }, [dispatch]); // Remove currentPage and assets.length from dependencies

//   // Handle page changes separately when filters are applied
//   useEffect(() => {
//     // Only fetch for page changes if we have filters applied
//     if (Object.keys(filters).length > 0) {
//       dispatch(fetchAssetsData({ page: currentPage, filters }));
//     }
//   }, [currentPage, filters, dispatch]);

//   // Analytics data is now handled by AssetAnalyticsComponents
//   // Removed duplicate useEffect hooks to prevent multiple API calls

//   // Update available custom fields when Redux data changes
//   useEffect(() => {
//     if (reduxCustomFields && Array.isArray(reduxCustomFields) && reduxCustomFields.length > 0) {
//       console.log('Setting custom fields from Redux:', reduxCustomFields);
//       setAvailableCustomFields(reduxCustomFields);
//     }
//   }, [reduxCustomFields]);

//   // Transform Redux assets to match the expected Asset interface
//   console.log('Raw assets from Redux:', assets.slice(0, 1)); // Log first asset
//   console.log('Available custom fields:', availableCustomFields);

//   const transformedAssets = assets.map((asset, index) => {
//     // Log the first asset to see its structure
//     if (index === 0) {
//       console.log('First asset structure:', asset);
//       console.log('Asset custom_fields:', asset.custom_fields);
//       console.log('Available custom fields for processing:', availableCustomFields);
//       console.log('Custom field extraction results:', 
//         availableCustomFields.map(field => {
//           let value = "";
//           if (asset.custom_fields && asset.custom_fields[field.key]) {
//             const customFieldObj = asset.custom_fields[field.key];
//             value = customFieldObj.field_value !== null && customFieldObj.field_value !== undefined 
//               ? customFieldObj.field_value 
//               : "";
//           }
//           return { 
//             key: field.key, 
//             title: field.title,
//             value: value,
//             rawCustomField: asset.custom_fields?.[field.key]
//           };
//         })
//       );
//     }

//     return {
//       id: asset.id?.toString() || "",
//       name: asset.name || "",
//       serialNumber: (pagination.currentPage - 1) * 15 + index + 1,
//       assetNumber: asset.asset_number || "",
//       status: asset.status as "in_use" | "in_storage" | "breakdown" | "disposed",
//       siteName: asset.site_name || "",
//       building: asset.building || null,
//       wing: asset.wing || null,
//       area: asset.area || null,
//       pmsRoom: asset.pms_room || null,
//       assetGroup: asset.pms_asset_group || asset.asset_group || "",
//       assetSubGroup: asset.sub_group || asset.asset_sub_group || "",
//       assetType: asset.asset_type,
//       purchaseCost: asset.purchase_cost,
//       currentBookValue: asset.current_book_value,
//       floor: asset.pms_floor || null,
//       category: asset.asset_type_category || "",
//       // Additional required fields
//       purchased_on: asset.purchased_on,
//       supplier_name: asset.supplier_name,
//       purchase_cost: asset.purchase_cost,
//       allocation_type: asset.allocation_type,
//       useful_life: asset.useful_life,
//       depreciation_method: asset.depreciation_method,
//       accumulated_depreciation: asset.accumulated_depreciation,
//       current_book_value: asset.current_book_value,
//       disposal_date: asset.disposal_date,
//       model_number: asset.model_number,
//       manufacturer: asset.manufacturer,
//       critical: asset.critical,
//       commisioning_date: asset.commisioning_date,
//       warranty: asset.warranty,
//       amc: asset.amc,
//       // Include all custom fields dynamically
//       ...availableCustomFields.reduce((acc, field) => {
//         // Handle custom_fields structure: {field_name: "...", field_value: "..."}
//         if (asset.custom_fields && asset.custom_fields[field.key]) {
//           const customFieldObj = asset.custom_fields[field.key];
//           acc[field.key] = customFieldObj.field_value !== null && customFieldObj.field_value !== undefined 
//             ? customFieldObj.field_value 
//             : "";
//         } else {
//           // Fallback to direct property access
//           acc[field.key] = asset[field.key] || "";
//         }
//         return acc;
//       }, {} as Record<string, any>),
//     };
//   });

//   const transformedSearchedAssets = searchAssets.map((asset, index) => ({
//     id: asset.id?.toString() || "",
//     name: asset.name || "",
//     serialNumber: (pagination.currentPage - 1) * 15 + index + 1,
//     assetNumber: asset.assetNumber || "",
//     status: asset.status as "in_use" | "in_storage" | "breakdown" | "disposed",
//     siteName: asset.siteName || "",
//     building: asset.building || null,
//     wing: asset.wing || null,
//     area: asset.area || null,
//     pmsRoom: asset.pmsRoom || null,
//     assetGroup: asset.assetGroup || "",
//     assetSubGroup: asset.assetSubGroup || "",
//     assetType: asset.assetType,
//     floor: null, // Search results don't include floor data
//     category: asset.asset_type_category || "",
//     // Additional required fields for search results
//     purchased_on: asset.purchased_on,
//     supplier_name: asset.supplier_name,
//     purchase_cost: asset.purchase_cost,
//     allocation_type: asset.allocation_type,
//     useful_life: asset.useful_life,
//     depreciation_method: asset.depreciation_method,
//     accumulated_depreciation: asset.accumulated_depreciation,
//     current_book_value: asset.current_book_value,
//     disposal_date: asset.disposal_date,
//     model_number: asset.model_number,
//     manufacturer: asset.manufacturer,
//     critical: asset.critical,
//     commisioning_date: asset.commisioning_date,
//     warranty: asset.warranty,
//     amc: asset.amc,
//     // Include all custom fields dynamically for search results too
//     ...availableCustomFields.reduce((acc, field) => {
//       // Handle custom_fields structure: {field_name: "...", field_value: "..."}
//       if (asset.custom_fields && asset.custom_fields[field.key]) {
//         const customFieldObj = asset.custom_fields[field.key];
//         acc[field.key] = customFieldObj.field_value !== null && customFieldObj.field_value !== undefined 
//           ? customFieldObj.field_value 
//           : "";
//       } else {
//         // Fallback to direct property access
//         acc[field.key] = asset[field.key] || "";
//       }
//       return acc;
//     }, {} as Record<string, any>),
//   }));

//   // Use search results if search term exists, otherwise use Redux assets
//   const displayAssets = searchTerm.trim()
//     ? transformedSearchedAssets
//     : transformedAssets;
//   const isSearchMode = searchTerm.trim().length > 0;

//   // For stats calculation, we need ALL filtered assets, not just current page
//   // If we have filters applied, we should use the total filtered count from API response
//   // For now, let's use displayAssets but note this limitation
//   const allFilteredAssets = displayAssets; // This represents all filtered results

//   // Create pagination object for compatibility

//   // Create stats object based on current displayed assets (filtered or unfiltered)
//   const calculateStats = (assetList: any[]) => {
//     console.log("Calculating stats for assets:", assetList.length, "assets");
//     console.log("Total count from API:", totalCount);
//     console.log(
//       "Sample asset statuses:",
//       assetList.slice(0, 3).map((a) => ({ id: a.id, status: a.status }))
//     );

//     // IMPORTANT: The current implementation only calculates from visible page data
//     // This should ideally be calculated from ALL filtered assets, not just current page
//     const totalAssets = assetList.length;

//     // Check for various status formats from API
//     const inUseAssets = assetList.filter((asset) => {
//       const status = asset.status?.toLowerCase();
//       return (
//         status === "in_use" ||
//         status === "in use" ||
//         status === "active" ||
//         status === "in-use"
//       );
//     }).length;

//     const breakdownAssets = assetList.filter((asset) => {
//       const status = asset.status?.toLowerCase();
//       return (
//         status === "breakdown" || status === "broken" || status === "faulty"
//       );
//     }).length;

//     const inStoreAssets = assetList.filter((asset) => {
//       const status = asset.status?.toLowerCase();
//       return (
//         status === "in_storage" ||
//         status === "in_store" ||
//         status === "in store" ||
//         status === "storage" ||
//         status === "stored"
//       );
//     }).length;

//     const disposeAssets = assetList.filter((asset) => {
//       const status = asset.status?.toLowerCase();
//       return (
//         status === "disposed" || status === "dispose" || status === "discarded"
//       );
//     }).length;

//     const missingAssets = assetList.filter((asset) => {
//       const status = asset.status?.toLowerCase();
//       return status === "missing" || status === "lost";
//     }).length;

//     // Get unique status values for debugging
//     const uniqueStatuses = [...new Set(assetList.map((asset) => asset.status))];
//     console.log("Unique status values found:", uniqueStatuses);
//     console.log("Stats calculated from current page:", {
//       total: totalAssets,
//       inUse: inUseAssets,
//       breakdown: breakdownAssets,
//       inStore: inStoreAssets,
//       dispose: disposeAssets,
//       missing: missingAssets,
//     });

//     // Note: This is a limitation - we're showing stats for current page only
//     // Ideally, the API should return aggregated stats for all filtered results
//     return {
//       total: totalCount || totalAssets, // Use total count from API if available
//       total_value: `${localStorage.getItem("currency")}0.00`,
//       nonItAssets: Math.floor((totalCount || totalAssets) * 0.6),
//       itAssets: Math.floor((totalCount || totalAssets) * 0.4),
//       inUse: inUseAssets,
//       breakdown: breakdownAssets,
//       in_store: inStoreAssets,
//       dispose: disposeAssets,
//     };
//   };

//   // Calculate stats from currently displayed assets (this updates with filters)
//   // const stats = calculateStats(displayAssets);
//   const stats = {
//     ...calculateStats(displayAssets),
//     total_value:
//       totalValue !== undefined && totalValue !== null
//         ? String(totalValue)
//         : `${localStorage.getItem("currency")}0.00`,
//   };

//   console.log("Final stats object:", stats);
//   // Drag and drop sensors
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   // Handle asset stat card clicks
//   const handleStatCardClick = (filterType: string) => {
//     let filters: any = {};

//     switch (filterType) {
//       case "total":
//         // No filters for total - show all assets
//         filters = {};
//         break;
//       case "non_it":
//         filters = { it_asset_eq: false };
//         break;
//       case "it":
//         filters = { it_asset_eq: true };
//         break;
//       case "in_use":
//         filters = { breakdown_eq: false, status_eq: "in_use" };
//         break;
//       case "breakdown":
//         filters = { breakdown_eq: true };
//         break;
//       case "in_store":
//         filters = { status_eq: "in_storage" };
//         break;
//       case "dispose":
//         filters = { status_eq: "disposed" };
//         break;
//       default:
//         filters = {};
//     }

//     // Clear search term when applying filters
//     setSearchTerm("");

//     // Dispatch the filter to fetch filtered assets
//     dispatch(fetchAssetsData({ page: 1, filters }));
//     setCurrentPage(1);
//   };

//   // Handle search with API call
//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//     if (term.trim()) {
//       performSearch(term);
//     }
//   };

//   // Handle refresh - fetch assets from Redux
//   const handleRefresh = () => {
//     // Maintain current filters when refreshing
//     dispatch(fetchAssetsData({ page: currentPage, filters }));
//     // AssetAnalyticsComponents will handle analytics data refreshing automatically
//   };

//   // Handle pagination
//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     // Don't call dispatch here as it's handled by useEffect
//     dispatch(fetchAssetsData({ page, filters }));
//   };

//   // Handle asset selection
//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedAssets(displayAssets.map((asset) => asset.id));
//     } else {
//       setSelectedAssets([]);
//     }
//   };

//   const handleSelectAsset = (assetId: string, checked: boolean) => {
//     if (checked) {
//       setSelectedAssets((prev) => [...prev, assetId]);
//     } else {
//       setSelectedAssets((prev) => prev.filter((id) => id !== assetId));
//     }
//   };

//   // Get selected asset objects with id and name
//   const selectedAssetObjects = displayAssets
//     .filter((asset) => selectedAssets.includes(asset.id))
//     .map((asset) => ({
//       id: asset.id,
//       name: asset.name,
//     }));

//   console.log(selectedAssetObjects);

//   const handleAddAsset = () => {
//     navigate("/maintenance/asset/add");
//   };
//   const handleAddSchedule = () => {
//     navigate("/maintenance/schedule/add?type=Asset");
//   };

//   const handleImport = () => {
//     setUploadType("import");
//     setIsBulkUploadOpen(true);
//   };

//   const handleUpdate = () => {
//     setUploadType("update");
//     setIsBulkUploadOpen(true);
//   };

//   const handleViewAsset = (assetId: string) => {
//     navigate(`/maintenance/asset/details/${assetId}`);
//   };

//   const handleColumnChange = (columns: typeof visibleColumns) => {
//     setVisibleColumns(columns);
//   };

//   // Selection panel handlers
//   const handleMoveAsset = () => {
//     console.log("Move asset clicked for", selectedAssets.length, "assets");
//     const selectedAssetObjects = displayAssets.filter((asset) =>
//       selectedAssets.includes(asset.id)
//     );
//     navigate("/maintenance/asset/move", {
//       state: { selectedAssets: selectedAssetObjects },
//     });
//     // Clear selection to close the panel
//     handleSelectAll(false);
//   };

//   const handleDisposeAsset = () => {
//     console.log("Dispose asset clicked for", selectedAssets.length, "assets");
//     const selectedAssetObjects = displayAssets.filter((asset) =>
//       selectedAssets.includes(asset.id)
//     );
//     console.log(selectedAssetObjects);
//     navigate("/maintenance/asset/dispose", {
//       state: { selectedAssets: selectedAssetObjects },
//     });
//     // Clear selection to close the panel
//     handleSelectAll(false);
//   };

//   const handlePrintQRCode = () => {
//     console.log("Print QR code clicked for", selectedAssets.length, "assets");
//   };

//   const handleCheckIn = () => {
//     console.log("Check in clicked for", selectedAssets.length, "assets");
//   };

//   const handleClearSelection = () => {
//     console.log(
//       "Clear selection called, current selected assets:",
//       selectedAssets.length
//     );
//     handleSelectAll(false);
//     console.log("Selection cleared using handleSelectAll(false)");
//   };

//   // Handle drag end for chart reordering
//   const handleDragEnd = (event: any) => {
//     const { active, over } = event;

//     if (active.id !== over.id) {
//       setChartOrder((items) => {
//         const oldIndex = items.indexOf(active.id);
//         const newIndex = items.indexOf(over.id);

//         return arrayMove(items, oldIndex, newIndex);
//       });
//     }
//   };

//   // Analytics data
//   const statusData = [
//     { name: "In Use", value: stats.inUse, color: "hsl(120, 70%, 50%)" },
//     { name: "Breakdown", value: stats.breakdown, color: "hsl(0, 70%, 50%)" },
//   ];

//   const assetTypeData = [
//     { name: "IT Equipment", value: stats.itAssets, color: "hsl(35, 35%, 75%)" },
//     {
//       name: "Non-IT Equipment",
//       value: stats.nonItAssets,
//       color: "hsl(25, 45%, 55%)",
//     },
//   ];

//   // Process asset status data for donut charts - simplified version using calculated stats
//   const processAssetStatusForCharts = () => {
//     const chartStatusData = [
//       {
//         name: "In Use",
//         value: stats.inUse,
//         color: "#c6b692",
//       },
//       {
//         name: "Breakdown",
//         value: stats.breakdown,
//         color: "#d8dcdd",
//       },
//     ];

//     const chartTypeData = [
//       {
//         name: "IT Equipment",
//         value: stats.itAssets,
//         color: "#d8dcdd",
//       },
//       {
//         name: "Non-IT Equipment",
//         value: stats.nonItAssets,
//         color: "#c6b692",
//       },
//     ];

//     return { chartStatusData, chartTypeData };
//   };

//   const { chartStatusData, chartTypeData } = processAssetStatusForCharts();

//   // Simplified data for charts when analytics data is not available
//   const categoryData = [{ name: "Loading...", value: 0 }];
//   const groupData = [{ name: "Loading...", value: 0 }];

//   const agingMatrixData = [
//     { priority: "P1", "0-1Y": 15, "1-2Y": 8, "2-3Y": 5, "3-4Y": 3, "4-5Y": 2 },
//     { priority: "P2", "0-1Y": 25, "1-2Y": 12, "2-3Y": 8, "3-4Y": 5, "4-5Y": 3 },
//     {
//       priority: "P3",
//       "0-1Y": 35,
//       "1-2Y": 18,
//       "2-3Y": 12,
//       "3-4Y": 8,
//       "4-5Y": 5,
//     },
//   ];

//   return (
//     <div className="p-4 sm:p-6">
//       <Tabs defaultValue="list" className="w-full">
//         <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
//           <TabsTrigger
//             value="list"
//             className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
//           >
//             <svg
//               width="18"
//               height="19"
//               viewBox="0 0 18 19"
//               fill="currentColor"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M1.875 4.25L3 5.375L5.25 3.125M1.875 9.5L3 10.625L5.25 8.375M1.875 14.75L3 15.875L5.25 13.625M7.875 9.5H16.125M7.875 14.75H16.125M7.875 4.25H16.125"
//                 stroke="currentColor"
//                 stroke-width="1.5"
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//               />
//             </svg>
//             Asset List
//           </TabsTrigger>
//           <TabsTrigger
//             value="analytics"
//             className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
//           >
//             <svg
//               width="16"
//               height="15"
//               viewBox="0 0 16 15"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-4 h-4"
//             >
//               <path
//                 d="M7.66681 11.6106C6.59669 11.5192 5.69719 11.0831 4.96831 10.3024C4.23944 9.52162 3.875 8.5875 3.875 7.5C3.875 6.35413 4.27606 5.38019 5.07819 4.57819C5.88019 3.77606 6.85413 3.375 8 3.375C9.0875 3.375 10.0216 3.73825 10.8024 4.46475C11.5831 5.19112 12.0192 6.08944 12.1106 7.15969L10.9179 6.80625C10.7557 6.13125 10.4066 5.57812 9.87031 5.14688C9.33419 4.71563 8.71075 4.5 8 4.5C7.175 4.5 6.46875 4.79375 5.88125 5.38125C5.29375 5.96875 5 6.675 5 7.5C5 8.2125 5.21681 8.8375 5.65044 9.375C6.08406 9.9125 6.636 10.2625 7.30625 10.425L7.66681 11.6106ZM8.56681 14.5946C8.47231 14.6149 8.37788 14.625 8.2835 14.625H8C7.01438 14.625 6.08812 14.438 5.22125 14.064C4.35437 13.69 3.60031 13.1824 2.95906 12.5413C2.31781 11.9002 1.81019 11.1463 1.43619 10.2795C1.06206 9.41275 0.875 8.48669 0.875 7.50131C0.875 6.51581 1.062 5.5895 1.436 4.72237C1.81 3.85525 2.31756 3.101 2.95869 2.45962C3.59981 1.81825 4.35375 1.31044 5.2205 0.936187C6.08725 0.562062 7.01331 0.375 7.99869 0.375C8.98419 0.375 9.9105 0.562062 10.7776 0.936187C11.6448 1.31019 12.399 1.81781 13.0404 2.45906C13.6818 3.10031 14.1896 3.85437 14.5638 4.72125C14.9379 5.58812 15.125 6.51438 15.125 7.5V7.77975C15.125 7.873 15.1149 7.96631 15.0946 8.05969L14 7.725V7.5C14 5.825 13.4187 4.40625 12.2563 3.24375C11.0938 2.08125 9.675 1.5 8 1.5C6.325 1.5 4.90625 2.08125 3.74375 3.24375C2.58125 4.40625 2 5.825 2 7.5C2 9.175 2.58125 10.5938 3.74375 11.7563C4.90625 12.9187 6.325 13.5 8 13.5H8.225L8.56681 14.5946ZM14.1052 14.7332L10.7043 11.325L9.88944 13.7884L8 7.5L14.2884 9.38944L11.825 10.2043L15.2332 13.6052L14.1052 14.7332Z"
//                 fill="currentColor"
//               />
//             </svg>
//             Analytics
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="analytics" className="space-y-6 mt-5">
//           {/* Row 1: Filter and Selector - Justify End */}
//           {/* <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">




//           </div> */}

//           {/* Row 2: Charts and Recent Tickets */}
//           <AssetAnalyticsComponents
//             defaultDateRange={analyticsDateRange}
//             selectedAnalyticsTypes={selectedAnalyticsTypes}
//             onAnalyticsChange={(data) => {
//               // Analytics data is managed internally by AssetAnalyticsComponents
//               console.log("Analytics data updated:", data);
//             }}
//             showFilter={true}
//             showSelector={true}
//             layout="grid"
//           />
//         </TabsContent>

//         <TabsContent value="list" className="space-y-6 mt-6">
//           {error ? (
//             <div className="flex justify-center items-center py-8">
//               <div className="text-red-500">Error: {error}</div>
//             </div>
//           ) : (
//             <>
//               <AssetStats stats={data} onCardClick={handleStatCardClick} />

//               <div className="relative">
//                 <AssetDataTable
//                   assets={displayAssets}
//                   selectedAssets={selectedAssets}
//                   visibleColumns={visibleColumns}
//                   onSelectAll={handleSelectAll}
//                   onSelectAsset={handleSelectAsset}
//                   onViewAsset={handleViewAsset}
//                   handleAddAsset={handleAddAsset}
//                   handleImport={handleImport}
//                   onFilterOpen={() => setIsFilterOpen(true)}
//                   onSearch={handleSearch}
//                   onRefreshData={handleRefresh}
//                   handleAddSchedule={handleAddSchedule}
//                   loading={loading}
//                   availableCustomFields={availableCustomFields}
//                 />

//                 {/* Empty state when no data and filters are applied */}
//                 {!loading &&
//                   displayAssets.length === 0 &&
//                   Object.keys(filters).length > 0 && (
//                     <div className="text-center py-8">
//                       <div className="text-gray-500 text-lg mb-2">
//                         No assets found
//                       </div>
//                       <div className="text-gray-400 text-sm">
//                         Try adjusting your filters to see more results
//                       </div>
//                     </div>
//                   )}

//                 {/* Selection Panel - positioned as overlay within table container */}
//                 {selectedAssets.length > 0 && (
//                   <AssetSelectionPanel
//                     selectedCount={selectedAssets.length}
//                     selectedAssets={selectedAssetObjects}
//                     onMoveAsset={handleMoveAsset}
//                     onDisposeAsset={handleDisposeAsset}
//                     onPrintQRCode={handlePrintQRCode}
//                     onCheckIn={handleCheckIn}
//                     onClearSelection={handleClearSelection}
//                   />
//                 )}
//               </div>

//               {/* API-driven Pagination */}
//               <div className="mt-6">


//                 <Pagination>
//                   <PaginationContent>
//                     {/* Previous Button */}
//                     <PaginationItem>
//                       <PaginationPrevious
//                         onClick={() => {
//                           if (pagination.currentPage > 1) {
//                             handlePageChange(pagination.currentPage - 1);
//                           }
//                         }}
//                         className={
//                           pagination.currentPage === 1
//                             ? "pointer-events-none opacity-50"
//                             : ""
//                         }
//                       />
//                     </PaginationItem>

//                     {/* First Page */}
//                     <PaginationItem>
//                       <PaginationLink
//                         onClick={() => handlePageChange(1)}
//                         isActive={pagination.currentPage === 1}
//                       >
//                         1
//                       </PaginationLink>
//                     </PaginationItem>

//                     {/* Ellipsis before current range */}
//                     {pagination.currentPage > 4 && (
//                       <PaginationItem>
//                         <PaginationEllipsis />
//                       </PaginationItem>
//                     )}

//                     {/* Dynamic middle pages */}
//                     {Array.from(
//                       { length: 3 },
//                       (_, i) => pagination.currentPage - 1 + i
//                     )
//                       .filter(
//                         (page) => page > 1 && page < pagination.totalPages
//                       )
//                       .map((page) => (
//                         <PaginationItem key={page}>
//                           <PaginationLink
//                             onClick={() => handlePageChange(page)}
//                             isActive={pagination.currentPage === page}
//                           >
//                             {page}
//                           </PaginationLink>
//                         </PaginationItem>
//                       ))}

//                     {/* Ellipsis after current range */}
//                     {pagination.currentPage < pagination.totalPages - 3 && (
//                       <PaginationItem>
//                         <PaginationEllipsis />
//                       </PaginationItem>
//                     )}

//                     {/* Last Page (if not same as first) */}
//                     {pagination.totalPages > 1 && (
//                       <PaginationItem>
//                         <PaginationLink
//                           onClick={() =>
//                             handlePageChange(pagination.totalPages)
//                           }
//                           isActive={
//                             pagination.currentPage === pagination.totalPages
//                           }
//                         >
//                           {pagination.totalPages}
//                         </PaginationLink>
//                       </PaginationItem>
//                     )}

//                     {/* Next Button */}
//                     <PaginationItem>
//                       <PaginationNext
//                         onClick={() => {
//                           if (pagination.currentPage < pagination.totalPages) {
//                             handlePageChange(pagination.currentPage + 1);
//                           }
//                         }}
//                         className={
//                           pagination.currentPage === pagination.totalPages
//                             ? "pointer-events-none opacity-50"
//                             : ""
//                         }
//                       />
//                     </PaginationItem>
//                   </PaginationContent>
//                 </Pagination>

//                 <div className="text-center mt-2 text-sm text-gray-600">
//                   Showing page {pagination.currentPage} of{" "}
//                   {pagination.totalPages}({pagination.totalCount} total assets)
//                 </div>
//               </div>
//             </>
//           )}
//         </TabsContent>
//       </Tabs>

//       <BulkUploadDialog
//         open={isBulkUploadOpen}
//         onOpenChange={setIsBulkUploadOpen}
//         title={uploadType === "import" ? "Import Assets" : "Update Assets"}
//       />

//       <AssetFilterDialog
//         isOpen={isFilterOpen}
//         onClose={() => setIsFilterOpen(false)}
//       />

//       <AssetAnalyticsFilterDialog
//         isOpen={isAnalyticsFilterOpen}
//         onClose={() => setIsAnalyticsFilterOpen(false)}
//         onApplyFilters={handleAnalyticsFilterApply}
//       />

//       {/* Removed MoveAssetDialog and DisposeAssetDialog - now using respective pages */}
//     </div>
//   );
// };




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchAssetsData } from '@/store/slices/assetsSlice';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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
} from 'recharts';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { AssetFilterDialog } from '@/components/AssetFilterDialog';
import { AssetStats } from '@/components/AssetStats';
import { AssetActions } from '@/components/AssetActions';
import { AssetDataTable } from '@/components/AssetDataTable';
import { AssetSelectionPanel } from '@/components/AssetSelectionPanel';
import { AssetSelector } from '@/components/AssetSelector';
import { RecentAssetsSidebar } from '@/components/RecentAssetsSidebar';
import { DonutChartGrid } from '@/components/DonutChartGrid';
import { AssetAnalyticsComponents } from '@/components/AssetAnalyticsComponents';
import { AssetAnalyticsFilterDialog } from '@/components/AssetAnalyticsFilterDialog';
import { assetAnalyticsDownloadAPI } from '@/services/assetAnalyticsDownloadAPI';
import { useAssetSearch } from '@/hooks/useAssetSearch';
import {
  API_CONFIG,
  getFullUrl,
  getAuthHeader,
  ENDPOINTS,
} from '@/config/apiConfig';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AssetStatisticsSelector from '@/components/AssetStatisticsSelector';
import { AssetAnalyticsSelector } from '@/components/AssetAnalyticsSelector';
import type { Asset as TableAsset } from '@/hooks/useAssets';
import { DataArray } from '@mui/icons-material';

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

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('[data-download]') ||
      target.closest('svg') ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'SVG' ||
      target.closest('.download-btn')
    ) {
      e.stopPropagation();
      return;
    }
    if (listeners?.onPointerDown) {
      listeners.onPointerDown(e);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onPointerDown={handlePointerDown}
      className="cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md"
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
    available_custom_fields: reduxCustomFields,
  } = useSelector((state: RootState) => state.assets);

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'import' | 'update'>('import');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [availableCustomFields, setAvailableCustomFields] = useState<
    Array<{ key: string; title: string }>
  >([
    { key: 'asset_category', title: 'Asset Category' },
    { key: 'asset_number', title: 'Asset Number' },
    { key: 'building_type', title: 'Building Type' },
    { key: 'location', title: 'Location' },
    { key: 'ownership_type', title: 'Ownership Type' },
  ]);
  const [selectedAnalyticsItems, setSelectedAnalyticsItems] = useState<string[]>([
    'total-available',
    'assets-in-use',
    'asset-breakdown',
    'critical-breakdown',
  ]);
  const [analyticsDateRange, setAnalyticsDateRange] = useState(() => {
    // Default date range: last 7 days from today
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    // Reset time to start of day
    sevenDaysAgo.setHours(0, 0, 0, 0);
    today.setHours(23, 59, 59, 999);
    return { fromDate: sevenDaysAgo, toDate: today };
  });
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
  const [selectedAnalyticsTypes, setSelectedAnalyticsTypes] = useState<string[]>([
    'groupWise',
    'categoryWise',
    'statusDistribution',
    'assetDistributions',
  ]);
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
    'statusDistribution',
    'assetDistributions',
    'categoryWise',
    'groupWise',
  ]);

  // Use search hook
  const { assets: searchedAssets, loading: searchLoading, error: searchError, pagination: searchPagination, searchAssets } =
    useAssetSearch();

  // Function to format date for API
  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Analytics handlers
  const handleAnalyticsFilterApply = (startDateStr: string, endDateStr: string) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    // Set time to start of day for startDate and end of day for endDate
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    setAnalyticsDateRange({ fromDate: startDate, toDate: endDate });
  };

  const handleAnalyticsSelectionChange = (selectedTypes: string[]) => {
    setSelectedAnalyticsTypes(selectedTypes);
  };

  const handleAnalyticsDownload = async (type: string) => {
    try {
      const fromDate = analyticsDateRange.fromDate;
      const toDate = analyticsDateRange.toDate;
      toast.info('Preparing download...');
      switch (type) {
        case 'groupWise':
          await assetAnalyticsDownloadAPI.downloadGroupWiseAssetsData(fromDate, toDate);
          toast.success('Group-wise assets data downloaded successfully!');
          break;
        case 'categoryWise':
          await assetAnalyticsDownloadAPI.downloadCategoryWiseAssetsData(fromDate, toDate);
          toast.success('Category-wise assets data downloaded successfully!');
          break;
        case 'assetDistribution':
          await assetAnalyticsDownloadAPI.downloadAssetDistributionsData(fromDate, toDate);
          toast.success('Asset distribution data downloaded successfully!');
          break;
        case 'assetsInUse':
          await assetAnalyticsDownloadAPI.downloadAssetsInUseData(fromDate, toDate);
          toast.success('Assets in use data downloaded successfully!');
          break;
        default:
          console.warn('Unknown analytics download type:', type);
          toast.error('Unknown analytics download type.');
      }
    } catch (error) {
      console.error('Error downloading analytics:', error);
      toast.error('Failed to download analytics data. Please try again.');
    }
  };

  // Fetch initial assets data on mount
  useEffect(() => {
    if (Object.keys(filters).length === 0 && assets.length === 0 && !searchTerm.trim()) {
      dispatch(fetchAssetsData({ page: currentPage }));
    }
  }, [dispatch]);

  // Handle page changes with filters
  useEffect(() => {
    if (Object.keys(filters).length > 0 && !searchTerm.trim()) {
      dispatch(fetchAssetsData({ page: currentPage, filters }));
    }
  }, [currentPage, filters, dispatch, searchTerm]);

  // Update custom fields
  useEffect(() => {
    if (reduxCustomFields && Array.isArray(reduxCustomFields) && reduxCustomFields.length > 0) {
      setAvailableCustomFields(reduxCustomFields);
    }
  }, [reduxCustomFields]);

  // Transform assets
  const transformedAssets: TableAsset[] = assets.map((asset, index) => ({
    id: asset.id?.toString() || '',
    name: asset.name || '',
    serialNumber: (currentPage - 1) * 15 + index + 1,
    assetNumber: asset.asset_number || '',
    status: asset.status as 'in_use' | 'in_storage' | 'breakdown' | 'disposed',
    siteName: asset.site_name || '',
    building: asset.building || null,
    wing: asset.wing || null,
    area:
      (asset.area && typeof asset.area === 'object')
        ? asset.area
        : (asset.pms_area && typeof asset.pms_area === 'object')
          ? asset.pms_area
          : (typeof asset.area === 'string')
            ? { name: asset.area }
            : (asset.area_name ? { name: asset.area_name } : null),
    pmsRoom: asset.pms_room || null,
    assetGroup: asset.pms_asset_group || asset.asset_group || '',
    assetSubGroup: asset.sub_group || asset.asset_sub_group || '',
    assetType: Boolean(asset.asset_type),
    purchaseCost: asset.purchase_cost || 0,
    currentBookValue: asset.current_book_value || 0,
    floor: asset.pms_floor || null,
    category: asset.asset_type_category || '',
    purchased_on: asset.purchased_on || '',
    supplier_name: asset.supplier_name || '',
    purchase_cost: asset.purchase_cost || 0,
    allocation_type: asset.allocation_type || '',
    useful_life: asset.useful_life || 0,
    depreciation_method: asset.depreciation_method || '',
    accumulated_depreciation: asset.accumulated_depreciation || 0,
    current_book_value: asset.current_book_value || 0,
    disposal_date: asset.disposal_date || '',
    model_number: asset.model_number || '',
    manufacturer: asset.manufacturer || '',
    critical: asset.critical || false,
    commisioning_date: asset.commisioning_date || '',
    warranty: asset.warranty || '',
    amc: asset.amc || '',
    ...availableCustomFields.reduce((acc, field) => {
      const coreKeysToSkip = new Set([
        'id', 'name', 'asset_number', 'status', 'site_name',
        'building', 'wing', 'floor', 'area', 'pms_room',
        'asset_group', 'sub_group', 'asset_type', 'asset_type_category',
        'purchase_cost', 'current_book_value', 'purchased_on', 'supplier_name',
        'allocation_type', 'useful_life', 'depreciation_method',
        'accumulated_depreciation', 'current_book_value', 'disposal_date',
        'model_number', 'manufacturer', 'critical', 'commisioning_date',
        'warranty', 'amc'
      ]);
      if (coreKeysToSkip.has(field.key)) return acc;
      if (asset.custom_fields && asset.custom_fields[field.key]) {
        const customFieldObj = asset.custom_fields[field.key];
        acc[field.key] =
          customFieldObj.field_value !== null && customFieldObj.field_value !== undefined
            ? customFieldObj.field_value
            : '';
      } else {
        acc[field.key] = asset[field.key] || '';
      }
      return acc;
    }, {} as Record<string, any>),
  })) as unknown as TableAsset[];

  const transformedSearchedAssets: TableAsset[] = searchedAssets.map((asset, index) => ({
    id: asset.id?.toString() || '',
    name: asset.name || '',
    serialNumber: (currentPage - 1) * 15 + index + 1,
    assetNumber: asset.assetNumber || '',
    status: asset.status as 'in_use' | 'in_storage' | 'breakdown' | 'disposed',
    siteName: asset.siteName || '',
    building: asset.building || null,
    wing: asset.wing || null,
    area:
      (asset.area && typeof asset.area === 'object')
        ? asset.area
        : (asset.pms_area && typeof asset.pms_area === 'object')
          ? asset.pms_area
          : (typeof asset.area === 'string')
            ? { name: asset.area }
            : (asset.area_name ? { name: asset.area_name } : null),
    pmsRoom: asset.pmsRoom || null,
    assetGroup: asset.assetGroup || '',
    assetSubGroup: asset.assetSubGroup || '',
    assetType: Boolean(asset.assetType),
    floor: null,
    category: asset.asset_type_category || '',
    purchased_on: asset.purchased_on || '',
    supplier_name: asset.supplier_name || '',
    purchase_cost: asset.purchase_cost || 0,
    allocation_type: asset.allocation_type || '',
    useful_life: asset.useful_life || 0,
    depreciation_method: asset.depreciation_method || '',
    accumulated_depreciation: asset.accumulated_depreciation || 0,
    current_book_value: asset.current_book_value || 0,
    disposal_date: asset.disposal_date || '',
    model_number: asset.model_number || '',
    manufacturer: asset.manufacturer || '',
    critical: asset.critical || false,
    commisioning_date: asset.commisioning_date || '',
    warranty: asset.warranty || '',
    amc: asset.amc || '',
    ...availableCustomFields.reduce((acc, field) => {
      const coreKeysToSkip = new Set([
        'id', 'name', 'asset_number', 'status', 'site_name',
        'building', 'wing', 'floor', 'area', 'pms_room',
        'asset_group', 'sub_group', 'asset_type', 'asset_type_category',
        'purchase_cost', 'current_book_value', 'purchased_on', 'supplier_name',
        'allocation_type', 'useful_life', 'depreciation_method',
        'accumulated_depreciation', 'current_book_value', 'disposal_date',
        'model_number', 'manufacturer', 'critical', 'commisioning_date',
        'warranty', 'amc'
      ]);
      if (coreKeysToSkip.has(field.key)) return acc;
      if (asset.custom_fields && asset.custom_fields[field.key]) {
        const customFieldObj = asset.custom_fields[field.key];
        acc[field.key] =
          customFieldObj.field_value !== null && customFieldObj.field_value !== undefined
            ? customFieldObj.field_value
            : '';
      } else {
        acc[field.key] = asset[field.key] || '';
      }
      return acc;
    }, {} as Record<string, any>),
  })) as unknown as TableAsset[];

  // Use search results if search term exists
  const displayAssets: TableAsset[] = searchTerm.trim() ? transformedSearchedAssets : transformedAssets;
  const isSearchMode = searchTerm.trim().length > 0;

  // Use search pagination when in search mode
  const pagination = isSearchMode
    ? {
      currentPage: searchPagination.current_page,
      totalPages: searchPagination.total_pages,
      totalCount: searchPagination.total_count,
    }
    : {
      currentPage,
      totalPages: totalPages || 1,
      totalCount: totalCount || 0,
    };

  const calculateStats = (assetList: any[]) => {
    const totalAssets = assetList.length;
    const inUseAssets = assetList.filter((asset) => {
      const status = asset.status?.toLowerCase();
      return status === 'in_use' || status === 'in use' || status === 'active' || status === 'in-use';
    }).length;
    const breakdownAssets = assetList.filter((asset) => {
      const status = asset.status?.toLowerCase();
      return status === 'breakdown' || status === 'broken' || status === 'faulty';
    }).length;
    const inStoreAssets = assetList.filter((asset) => {
      const status = asset.status?.toLowerCase();
      return (
        status === 'in_storage' ||
        status === 'in_store' ||
        status === 'in store' ||
        status === 'storage' ||
        status === 'stored'
      );
    }).length;
    const disposeAssets = assetList.filter((asset) => {
      const status = asset.status?.toLowerCase();
      return status === 'disposed' || status === 'dispose' || status === 'discarded';
    }).length;

    return {
      total: totalCount || totalAssets,
      total_value: `${localStorage.getItem('currency')}0.00`,
      nonItAssets: Math.floor((totalCount || totalAssets) * 0.6),
      itAssets: Math.floor((totalCount || totalAssets) * 0.4),
      inUse: inUseAssets,
      breakdown: breakdownAssets,
      in_store: inStoreAssets,
      dispose: disposeAssets,
    };
  };

  const stats = {
    ...calculateStats(displayAssets),
    total_value:
      totalValue !== undefined && totalValue !== null
        ? String(totalValue)
        : `${localStorage.getItem('currency')}0.00`,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleStatCardClick = (filterType: string) => {
    let filters: any = {};
    switch (filterType) {
      case 'total':
        filters = {};
        break;
      case 'non_it':
        filters = { it_asset_eq: false };
        break;
      case 'it':
        filters = { it_asset_eq: true };
        break;
      case 'in_use':
        filters = { breakdown_eq: false, status_eq: 'in_use' };
        break;
      case 'breakdown':
        filters = { breakdown_eq: true };
        break;
      case 'in_store':
        filters = { status_eq: 'in_storage' };
        break;
      case 'dispose':
        filters = { status_eq: 'disposed' };
        break;
      default:
        filters = {};
    }
    setSearchTerm('');
    dispatch(fetchAssetsData({ page: 1, filters }));
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      searchAssets(term, currentPage);
    } else {
      setCurrentPage(1); // Reset to page 1 when clearing search
    }
  };

  const handleRefresh = () => {
    if (searchTerm.trim()) {
      searchAssets(searchTerm, currentPage);
    } else {
      dispatch(fetchAssetsData({ page: currentPage, filters }));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (searchTerm.trim()) {
      searchAssets(searchTerm, page);
    } else {
      dispatch(fetchAssetsData({ page, filters }));
    }
  };

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

  const selectedAssetObjects = displayAssets
    .filter((asset) => selectedAssets.includes(asset.id))
    .map((asset) => ({
      id: asset.id,
      name: asset.name,
    }));

  const handleAddAsset = () => {
    navigate('/maintenance/asset/add');
  };

  const handleAddSchedule = () => {
    navigate('/maintenance/schedule/add?type=Asset');
  };

  const handleImport = () => {
    setUploadType('import');
    setIsBulkUploadOpen(true);
  };

  const handleUpdate = () => {
    setUploadType('update');
    setIsBulkUploadOpen(true);
  };

  const handleViewAsset = (assetId: string) => {
    navigate(`/maintenance/asset/details/${assetId}`);
  };

  const handleColumnChange = (columns: typeof visibleColumns) => {
    setVisibleColumns(columns);
  };

  const handleMoveAsset = () => {
    const selectedAssetObjects = displayAssets.filter((asset) => selectedAssets.includes(asset.id));
    navigate('/maintenance/asset/move', {
      state: { selectedAssets: selectedAssetObjects },
    });
    handleSelectAll(false);
  };

  const handleDisposeAsset = () => {
    const selectedAssetObjects = displayAssets.filter((asset) => selectedAssets.includes(asset.id));
    navigate('/maintenance/asset/dispose', {
      state: { selectedAssets: selectedAssetObjects },
    });
    handleSelectAll(false);
  };

  const handlePrintQRCode = () => {
    console.log('Print QR code clicked for', selectedAssets.length, 'assets');
  };

  const handleCheckIn = () => {
    console.log('Check in clicked for', selectedAssets.length, 'assets');
  };

  const handleClearSelection = () => {
    handleSelectAll(false);
  };

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

  // Analytics data (simplified)
  const statusData = [
    { name: 'In Use', value: stats.inUse, color: 'hsl(120, 70%, 50%)' },
    { name: 'Breakdown', value: stats.breakdown, color: 'hsl(0, 70%, 50%)' },
  ];

  const assetTypeData = [
    { name: 'IT Equipment', value: stats.itAssets, color: 'hsl(35, 35%, 75%)' },
    { name: 'Non-IT Equipment', value: stats.nonItAssets, color: 'hsl(25, 45%, 55%)' },
  ];

  const processAssetStatusForCharts = () => {
    const chartStatusData = [
      { name: 'In Use', value: stats.inUse, color: '#c6b692' },
      { name: 'Breakdown', value: stats.breakdown, color: '#d8dcdd' },
    ];
    const chartTypeData = [
      { name: 'IT Equipment', value: stats.itAssets, color: '#d8dcdd' },
      { name: 'Non-IT Equipment', value: stats.nonItAssets, color: '#c6b692' },
    ];
    return { chartStatusData, chartTypeData };
  };

  const { chartStatusData, chartTypeData } = processAssetStatusForCharts();

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
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
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

        <TabsContent value="analytics" className="space-y-6 mt-5">
          <AssetAnalyticsComponents
            defaultDateRange={analyticsDateRange}
            selectedAnalyticsTypes={selectedAnalyticsTypes}
            onAnalyticsChange={(data) => {
              console.log('Analytics data updated:', data);
            }}
            showFilter={true}
            showSelector={true}
            layout="grid"
          />
        </TabsContent>

        <TabsContent value="list" className="space-y-6 mt-6">
          {error || searchError ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-red-500">Error: {error || searchError}</div>
            </div>
          ) : (
            <>
              <AssetStats stats={data} onCardClick={handleStatCardClick} />

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
                  handleAddSchedule={handleAddSchedule}
                  loading={loading || searchLoading}
                  availableCustomFields={availableCustomFields}
                />

                {!loading &&
                  !searchLoading &&
                  displayAssets.length === 0 &&
                  (Object.keys(filters).length > 0 || searchTerm.trim()) && (
                    <div className="text-center py-8">
                      <div className="text-gray-500 text-lg mb-2">No assets found</div>
                      <div className="text-gray-400 text-sm">
                        Try adjusting your filters or search term to see more results
                      </div>
                    </div>
                  )}

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
                        className={pagination.currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>

                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={pagination.currentPage === 1}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>

                    {pagination.currentPage > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {Array.from({ length: 3 }, (_, i) => pagination.currentPage - 1 + i)
                      .filter((page) => page > 1 && page < pagination.totalPages)
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

                    {pagination.currentPage < pagination.totalPages - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

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
                          pagination.currentPage === pagination.totalPages ? 'pointer-events-none opacity-50' : ''
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="text-center mt-2 text-sm text-gray-600">
                  Showing page {pagination.currentPage} of {pagination.totalPages} (
                  {pagination.totalCount} total assets)
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        title={uploadType === 'import' ? 'Import Assets' : 'Update Assets'}
      />

      <AssetFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <AssetAnalyticsFilterDialog
        isOpen={isAnalyticsFilterOpen}
        onClose={() => setIsAnalyticsFilterOpen(false)}
        currentStartDate={analyticsDateRange.fromDate}
        currentEndDate={analyticsDateRange.toDate}
        onApplyFilters={handleAnalyticsFilterApply}
      />
    </div>
  );
};