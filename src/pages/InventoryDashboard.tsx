import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchInventoryData, setCurrentPage } from "@/store/slices/inventorySlice";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { DateFilterModal } from "@/components/DateFilterModal";
import {
  Upload,
  FileText,
  Filter,
  Eye,
  Plus,
  Package,
  Settings,
  Download,
  BarChart3,
  Pencil,
} from "lucide-react";
// Removed legacy BulkUploadDialog; using new design
import { InventoryBulkUploadDialog } from "@/components/InventoryBulkUploaddialogbox";
import { InventoryFilterDialog } from "@/components/InventoryFilterDialog";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventorySelector } from "@/components/InventorySelector";
import { InventoryAnalyticsSelector } from "@/components/InventoryAnalyticsSelector";
import { InventoryAnalyticsFilterDialog } from "@/components/InventoryAnalyticsFilterDialog";
import { InventoryAnalyticsCard } from "@/components/InventoryAnalyticsCard";
import { inventoryAnalyticsAPI } from "@/services/inventoryAnalyticsAPI";
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
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import bio from "@/assets/bio.png";
import { InventorySelectionPanel } from "@/components/InventorySelectionPanel";
import { toast } from "sonner";

// Map API field names to display field names for backward compatibility
const mapInventoryData = (apiData: any[]) => {
  if (!apiData || !Array.isArray(apiData)) {
    return [];
  }
  return apiData.map((item) => {
    const itemId =
      typeof item.id === "string"
        ? item.id
        : item.id?.value || String(item.id || "");
    return {
      id: itemId,
      name: item.name || "",
      referenceNumber: item.reference_number || "",
      code: item.code || "",
      serialNumber: item.serial_number || "",
      type: item.inventory_type || "",
      group: item.pms_asset_group || "",
      subGroup: item.sub_group || "",
      category: item.category || "",
      manufacturer: item.manufacturer || "",
      criticality: item.criticality !== undefined && item.criticality !== null ? item.criticality : "",
      quantity: item.quantity?.toString() || "0",
      expiryDate: (item as any).expiry_date || (item as any).expiration_date || "",
      active: item.active ? "Active" : "Inactive",
      unit: item.unit || "",
      cost: item.cost?.toString() || "",
      sacHsnCode: item.hsc_hsn_code || "",
      maxStockLevel: item.max_stock_level?.toString() || "",
      minStockLevel: item.min_stock_level?.toString() || "",
      minOrderLevel: item.min_order_level?.toString() || "",
      greenProduct: item.green_product || false,
    };
  });
};

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

export const InventoryDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const {
    items: inventoryItems,
    loading,
    error,
    totalPages: reduxTotalPages,
    totalCount,
    currentPage: reduxCurrentPage,
    activeCount,
    inactiveCount,
    greenInventories,
    totalInventories,
  } = useSelector((state: RootState) => state.inventory);

  // Local state
  const [currentPage, setLocalCurrentPage] = useState(reduxCurrentPage || 1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>([
    "statusChart",
    "criticalityChart",
    "categoryChart",
  ]);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [panelManuallyClosed, setPanelManuallyClosed] = useState(false);
  const [keepOpenWithoutSelection, setKeepOpenWithoutSelection] = useState(false);
  const [chartOrder, setChartOrder] = useState<string[]>([
    "statusChart",
    "criticalityChart",
    "categoryChart",
  ]);
  const [activeTab, setActiveTab] = useState<string>("list");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState({
    // Updated default range per request: 01/07/2025 - 15/08/2025 (DD/MM/YYYY)
    startDate: new Date(2025, 6, 1), // 01 July 2025
    endDate: new Date(2025, 7, 15), // 15 August 2025
  });
  const [inventory, setInventory] = useState([]);
  const [downloadingQR, setDownloadingQR] = useState(false);
  // Track currently applied server-side filters so pagination & refresh honor them
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  // Track last filter signature we already showed a no-results toast for
  const lastNoResultSigRef = useRef<string | null>(null);

  const buildFilterSignature = (obj: Record<string, string>) => {
    const keys = Object.keys(obj || {}).sort();
    return keys.map((k) => `${k}=${String(obj[k])}`).join('&');
  };

  // Snapshot baseline counts when no filters are applied so cards don't fluctuate on filter clicks
  const [baselineCounts, setBaselineCounts] = useState({
    totalInventories: totalInventories || 0,
    activeCount: activeCount || 0,
    inactiveCount: inactiveCount || 0,
    greenInventories: greenInventories || 0,
  });
  useEffect(() => {
    if (!activeFilters || Object.keys(activeFilters).length === 0) {
      setBaselineCounts({
        totalInventories: totalInventories || 0,
        activeCount: activeCount || 0,
        inactiveCount: inactiveCount || 0,
        greenInventories: greenInventories || 0,
      });
    }
  }, [totalInventories, activeCount, inactiveCount, greenInventories, activeFilters]);

  // Analytics state
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
  const [analyticsDateRange, setAnalyticsDateRange] = useState({
    // String form (DD/MM/YYYY) aligned with new default dateRange
    startDate: '01/07/2025',
    endDate: '15/08/2025',
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>({
    statusData: null,
    categoryData: null,
    inventoryCostOverMonth: null,
  });
  const [selectedAnalyticsOptions, setSelectedAnalyticsOptions] = useState<string[]>([
    'items_status',
    'category_wise',
    'green_consumption',
    'consumption_report_green',
    'consumption_report_non_green',
    'current_minimum_stock_green',
    'current_minimum_stock_non_green',
    'inventory_cost_over_month',
  ]);
  // Maintain explicit draggable order for analytics cards
  const [analyticsCardOrder, setAnalyticsCardOrder] = useState<string[]>([]);
  // Load saved order from localStorage on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('inventoryAnalyticsCardOrder');
      if (raw) {
        const parsed: string[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setAnalyticsCardOrder(parsed.filter(Boolean));
        }
      }
    } catch (e) {
      console.warn('[AnalyticsOrder] Failed to parse saved order', e);
    }
  }, []);
  // Fetch analytics data when selected options or date range changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      const newData: any = {};
      const fromDate = dateRange.startDate;
      const toDate = dateRange.endDate;
      try {
        if (selectedAnalyticsOptions.includes('items_status')) {
          newData.statusData = await inventoryAnalyticsAPI.getItemsStatus(fromDate, toDate);
        }
        if (selectedAnalyticsOptions.includes('category_wise')) {
          newData.categoryData = await inventoryAnalyticsAPI.getCategoryWise(fromDate, toDate);
        }
        if (selectedAnalyticsOptions.includes('green_consumption')) {
          newData.greenConsumption = await inventoryAnalyticsAPI.getGreenConsumption(fromDate, toDate);
        }
        if (selectedAnalyticsOptions.includes('inventory_cost_over_month')) {
          try {
            const costOverMonthResp = await inventoryAnalyticsAPI.getInventoryCostOverMonth(fromDate, toDate);
            console.log('[DEBUG] inventory_cost_over_month API response:', costOverMonthResp);
            newData.inventoryCostOverMonth = costOverMonthResp;
          } catch (err) {
            console.error('[DEBUG] Error fetching inventory_cost_over_month:', err);
            newData.inventoryCostOverMonth = null;
          }
        }
        // Add other analytics fetches as needed
      } catch (err) {
        toast.error('Failed to fetch analytics data');
        console.error('[DEBUG] General analytics fetch error:', err);
      } finally {
        setAnalyticsData((prev: any) => ({ ...prev, ...newData }));
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, [selectedAnalyticsOptions, dateRange]);

  // Sync card order when selection changes: keep existing order, append new selections at end
  useEffect(() => {
    setAnalyticsCardOrder((prev) => {
      const filtered = prev.filter((id) => selectedAnalyticsOptions.includes(id));
      selectedAnalyticsOptions.forEach((id) => {
        if (!filtered.includes(id)) filtered.push(id);
      });
      return filtered;
    });
  }, [selectedAnalyticsOptions]);

  // Persist order whenever it changes
  useEffect(() => {
    if (analyticsCardOrder.length) {
      try {
        localStorage.setItem('inventoryAnalyticsCardOrder', JSON.stringify(analyticsCardOrder));
      } catch (e) {
        console.warn('[AnalyticsOrder] Failed to save order', e);
      }
    }
  }, [analyticsCardOrder]);
  const [visibleAnalyticsSections, setVisibleAnalyticsSections] = useState<string[]>([
    'itemsStatus',
    'categoryWise',
    'greenConsumption',
  ]);

  useEffect(() => {
    if (inventoryItems) {
      setInventory(inventoryItems);
    }
  }, [inventoryItems]);

  const pageSize = 15;

  // Map API data to display format
  const inventoryData = mapInventoryData(inventory);

  // Fetch inventory data when page or filters change (preserve filters across pagination)
  useEffect(() => {
    const hasFilters = activeFilters && Object.keys(activeFilters).length > 0;
    dispatch(
      fetchInventoryData({
        page: currentPage,
        pageSize,
        filters: hasFilters ? (activeFilters as any) : undefined,
      })
    );
  }, [dispatch, currentPage, activeFilters]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Pagination calculations
  const totalPages = reduxTotalPages || 1;
  const paginatedData = inventoryData;

  // Analytics calculations
  const totalItems = inventoryData.length;

  // Aging matrix data - simulated based on groups and priorities
  const agingMatrixData = [
    {
      priority: "P1",
      "0-10": 20,
      "11-20": 3,
      "21-30": 4,
      "31-40": 0,
      "41-50": 203,
    },
    {
      priority: "P2",
      "0-10": 2,
      "11-20": 0,
      "21-30": 0,
      "31-40": 0,
      "41-50": 4,
    },
    {
      priority: "P3",
      "0-10": 1,
      "11-20": 0,
      "21-30": 1,
      "31-40": 0,
      "41-50": 7,
    },
    {
      priority: "P4",
      "0-10": 1,
      "11-20": 0,
      "21-30": 0,
      "31-40": 0,
      "41-50": 5,
    },
  ];

  // Recent inventory items for sidebar - with safety check
  const recentItems = (inventoryData || []).slice(0, 3).map((item, index) => ({
    id: item.id,
    title: item.name,
    subtitle: "Category: " + (item.group || "Unassigned"),
    subcategory: "Sub-Category: " + (item.subGroup || "Unassigned"),
    assignee: "Manager: John Doe",
    site: "Site: " + (item.group ? "Warehouse A" : "Warehouse B"),
    status: item.active,
    priority: index === 0 ? "P1" : "P1",
    tat: '"A"',
  }));

  const handleSelectionChange = (visibleSections: string[]) => {
    setVisibleSections(visibleSections);
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems((paginatedData || []).map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Removed auto toggle of action panel so outside-click logic in panel doesn't interfere with multi-select
  // User will open the panel manually via the Action button after selecting rows.
  // Re-enable auto open, but adjust onClearSelection so we don't lose selections; outside click will only hide panel.
  useEffect(() => {
    // Auto open when first item selected (if not manually closed earlier)
    if (selectedItems.length > 0 && !showActionPanel && !panelManuallyClosed) {
      setShowActionPanel(true);
    }
    // Auto-hide only if no selection AND panel was not opened explicitly for Add/Import
    if (selectedItems.length === 0 && showActionPanel && !keepOpenWithoutSelection) {
      setShowActionPanel(false);
      if (panelManuallyClosed) setPanelManuallyClosed(false);
    }
    // If we now have a selection, no need to keep the empty-open flag
    if (selectedItems.length > 0 && keepOpenWithoutSelection) {
      setKeepOpenWithoutSelection(false);
    }
  }, [selectedItems, showActionPanel, panelManuallyClosed, keepOpenWithoutSelection]);

  // Explicit action button to manually open panel (even if no selection yet)
  const handleActionClick = () => {
    setKeepOpenWithoutSelection(true); // allow panel to stay open with zero selection
    setShowActionPanel(true);
  };

  const handleFilter = async (filter: any) => {
    const { name, code, category, criticality, groupId, subGroupId } = filter;
    const newFilters: Record<string, string> = {};
    if (name) newFilters['q[name_cont]'] = name;
    if (code) newFilters['q[code_cont]'] = code;
    if (category) newFilters['q[category_eq]'] = category;
    if (criticality) {
      if (criticality === "1") {
        newFilters['q[criticality_eq]'] = "0";  // Critical items have value 0
      } else {
        newFilters['q[criticality_eq]'] = "2";  // Non-Critical items have value 2
      }
    }
    if (groupId) newFilters['q[pms_asset_pms_asset_group_id_eq]'] = groupId;
    if (subGroupId) newFilters['q[pms_asset_pms_asset_sub_group_id_eq]'] = subGroupId;
    setActiveFilters(newFilters);
    setLocalCurrentPage(1);
  };

  // Toast when any active filters yield zero results (once per unique filter signature)
  useEffect(() => {
    if (loading) return; // wait for fetch to complete
    const currentSig = buildFilterSignature(activeFilters);
    if (!currentSig) return; // only when filters are applied
    const count = Array.isArray(inventoryItems) ? inventoryItems.length : 0;
    if (count === 0 && lastNoResultSigRef.current !== currentSig) {
      toast.info('No records found for the applied filters');
      lastNoResultSigRef.current = currentSig; // prevent duplicate toasts for the same filters
    }
    // If results appear for current filters, allow future toasts if filters change again
    if (count > 0 && lastNoResultSigRef.current === currentSig) {
      lastNoResultSigRef.current = null;
    }
  }, [loading, activeFilters, inventoryItems]);

  const handleViewItem = (itemId: string) => {
    if (!itemId || typeof itemId !== "string" || itemId === "[object Object]") {
      return;
    }
    navigate(`/maintenance/inventory/details/${itemId}`);
  };

  const handleAddInventory = () => {
    navigate("/maintenance/inventory/add");
  };

  // const handleStatusToggle = async (itemId: string) => {
  //   const item = inventoryData.find((i) => i.id === itemId);
  //   if (!item) return;

  //   const newStatus = item.active === "Active" ? false : true;

  //   try {
  //     const baseUrl = localStorage.getItem('baseUrl');
  //     const token = localStorage.getItem('token');
  //     if (!baseUrl || !token) {
  //       toast.error('Missing base URL or token');
  //       return;
  //     }

  //     await axios.patch(
  //       `https://${baseUrl}/pms/inventories/${itemId}.json`,
  //       { inventory: { active: newStatus } },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     toast.success(`Item ${newStatus ? 'activated' : 'deactivated'} successfully`);
  //     // Refresh inventory data
  //     dispatch(fetchInventoryData({ page: currentPage, pageSize }));
  //   } catch (error) {
  //     console.error('Failed to update status:', error);
  //     toast.error('Failed to update item status');
  //   }
  // };

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

  // Drag end for analytics cards
  const handleAnalyticsDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setAnalyticsCardOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleStatusToggle = async (itemId: string) => {
    const item = inventoryData.find((i) => i.id === itemId);
    if (!item) {
      toast.error('Item not found');
      return;
    }

    const newStatus = item.active === "Active" ? false : true;

    try {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      if (!baseUrl || !token) {
        toast.error('Missing base URL or token');
        return;
      }

      const response = await axios.put(
        `https://${baseUrl}/pms/inventories/${itemId}.json`,
        { pms_inventory: { active: newStatus } }, // Changed 'inventory' to 'pms_inventory'
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && typeof response.data.active === 'boolean') {
        toast.success(`Item ${newStatus ? 'activated' : 'deactivated'} successfully`);
        // Refresh inventory data
        dispatch(fetchInventoryData({ page: currentPage, pageSize }));
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update item status');
    }
  };

  const columns = [
    { key: "actions", label: "Actions", sortable: false },
    { key: "name", label: "Name", sortable: true },
    { key: "id", label: "ID", sortable: true },
    { key: "code", label: "Code", sortable: true },
    { key: "serialNumber", label: "Serial Number", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "group", label: "Group", sortable: true },
    { key: "subGroup", label: "Sub Group", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "manufacturer", label: "Manufacturer", sortable: true },
    { key: "criticality", label: "Criticality", sortable: true },
    { key: "quantity", label: "Quantity", sortable: true },
    { key: "expiryDate", label: "Expiry Date", sortable: true },
    { key: "active", label: "Active", sortable: true },
    { key: "unit", label: "Unit", sortable: true },
    { key: "cost", label: "Cost", sortable: true },
    { key: "sacHsnCode", label: "SAC/HSN Code", sortable: true },
    { key: "maxStockLevel", label: "Max Stock", sortable: true },
    { key: "minStockLevel", label: "Min Stock", sortable: true },
    { key: "minOrderLevel", label: "Min Order", sortable: true },
    { key: "referenceNumber", label: "Reference Number", sortable: true },

  ];

  const bulkActions = [
    {
      label: "Print QR Codes",
      icon: FileText,
      onClick: (selectedItems: string[]) => {
        alert(`Printing QR codes for ${selectedItems.length} items`);
      },
    },
  ];

  const renderCell = (item: any, columnKey: string) => {
    if (columnKey === "actions") {
      const itemId = typeof item.id === "string" ? item.id : String(item.id || "");
      return (
        <div className="flex items-center justify-center w-full gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 flex items-center justify-center"
            onClick={() => handleViewItem(itemId)}
            title="View"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 flex items-center justify-center"
            onClick={() => navigate(`/maintenance/inventory/edit/${itemId}`)}
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          {item.greenProduct && (
            <img
              src={bio}
              alt="Green Product"
              className="w-4 h-4"
              style={{
                filter: "invert(46%) sepia(66%) saturate(319%) hue-rotate(67deg) brightness(95%) contrast(85%)",
              }}
            />
          )}
        </div>
      );
    }
    if (columnKey === "expiryDate") {
      const raw = item.expiryDate as string | undefined;
      if (!raw) return "-";
      // Avoid timezone shifts; use the date portion before 'T' when present
      const onlyDate = raw.includes('T') ? raw.split('T')[0] : raw;
      return onlyDate;
    }
    if (columnKey === "criticality") {
      const raw = item.criticality;
      let label = '-';
      if (typeof raw === 'number') {
        label = raw === 0 ? 'Critical' : raw === 2 ? 'Non-Critical' : '-';
      } else if (typeof raw === 'string') {
        const v = raw.trim().toLowerCase();
        if (v === '0' || v === 'critical') label = 'Critical';
        else if (v === '2' || v === 'non-critical' || v === 'non_critical') label = 'Non-Critical';
        else if (v !== '') label = raw || '-'; // Only show raw value if it's not empty
      }
      // Handle the case where raw is exactly the API values
      if (raw === 0 || raw === '0') {
        label = 'Critical';
      } else if (raw === 2 || raw === '2') {
        label = 'Non-Critical';
      }
      const isCritical = label === 'Critical';
      return (
        <span
          className={`px-2 py-1 rounded text-xs ${isCritical ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
        >
          {label}
        </span>
      );
    }
    if (columnKey === "active") {
      return (
        <div className="flex items-center justify-center w-full" onClick={(e) => e.stopPropagation()}>
          <div
            className={`relative inline-flex items-center h-6 w-12 rounded-full cursor-pointer transition-colors ${item.active === "Active" ? 'bg-green-500' : 'bg-gray-300'
              }`}
            onClick={() => handleStatusToggle(item.id)}
          >
            <span
              className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform ${item.active === "Active" ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </div>
        </div>
      );
    }
    if (columnKey === "type") {
      const raw = item.type;
      const code = typeof raw === 'number' ? raw : parseInt(raw, 10);
      let label = '-';
      if (code === 1) label = 'sparse';
      else if (code === 2) label = 'consumable';
      return <span className="capitalize">{label}</span>;
    }
    return item[columnKey];
  };



  const handlePageChange = (page: number) => {
    setLocalCurrentPage(page);
    dispatch(setCurrentPage(page));
    setSelectedItems([]);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Global name search (uses server-side filter q[name_cont])
  const handleGlobalNameSearch = (term: string) => {
    setLocalCurrentPage(1);
    if (term && term.trim()) {
      const nf = { 'q[name_cont]': term.trim() };
      setActiveFilters(nf);
      dispatch(fetchInventoryData({ page: 1, pageSize, filters: nf }));
    } else {
      setActiveFilters({});
      dispatch(fetchInventoryData({ page: 1, pageSize }));
    }
  };

  const handleFiltersClick = () => {
    setShowFilter(true);
  };

  const handleImportClick = () => {
    setShowBulkUpload(true);
  };

  const renderCustomActions = () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button
        onClick={handleActionClick}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        variant="default"
      >
        <Plus className="w-4 h-4" /> Action
      </Button>
    </div>
  );

  const handleExport = async () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const siteId = localStorage.getItem('selectedSiteId');
    try {
      if (!baseUrl || !token || !siteId) {
        toast.error('Missing base URL, token, or site ID');
        return;
      }

      let url = `https://${baseUrl}/pms/inventories.xlsx`;
      const queryParams = new URLSearchParams();

      // Add site_id parameter
      queryParams.append('site_id', siteId);

      // Add active filter parameters to export
      if (activeFilters && Object.keys(activeFilters).length > 0) {
        Object.entries(activeFilters).forEach(([key, value]) => {
          if (value) {
            queryParams.append(key, value);
          }
        });
      }

      // Add selected items if any
      if (selectedItems.length > 0) {
        queryParams.append('ids', selectedItems.join(','));
      }

      // Append query parameters to URL
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await axios.get(url, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data || response.data.size === 0) {
        toast.error('Empty file received from server');
        return;
      }

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Create descriptive filename based on filters
      let filename = 'inventories';
      if (Object.keys(activeFilters).length > 0) {
        filename += '_filtered';
      }
      if (selectedItems.length > 0) {
        filename += '_selected';
      }
      filename += '.xlsx';
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
      const message = Object.keys(activeFilters).length > 0 
        ? 'Filtered inventory data exported successfully'
        : 'Inventory data exported successfully';
      toast.success(message);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export inventory data');
    }
  };

  // Bulk / single QR code PDF download similar to ServiceDashboard pattern
  const handlePrintQR = async () => {
    if (selectedItems.length === 0 || downloadingQR) return;
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    if (!baseUrl || !token) {
      toast.error('Missing base URL or token');
      return;
    }
    try {
      setDownloadingQR(true);
      // API (single existing pattern) used inventory_ids=[id]; extend for multiple by comma joining
      const idsParam = selectedItems.join(',');
      const url = `https://${baseUrl}/pms/inventories/inventory_qr_codes.pdf?inventory_ids=[${idsParam}]`;
      const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!resp.ok) throw new Error('Failed to generate QR PDF');
      const blob = await resp.blob();
      const dlUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = dlUrl;
      link.download = selectedItems.length === 1 ? `inventory-qr-${selectedItems[0]}.pdf` : `inventory-qr-bulk-${selectedItems.length}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(dlUrl);
      toast.success('QR code PDF downloaded');
    } catch (e: any) {
      console.error('QR download error', e);
      toast.error(e.message || 'Failed to download QR codes');
    } finally {
      setDownloadingQR(false);
    }
  };

  const fetchAnalyticsData = async () => {
    setAnalyticsLoading(true);
    try {
      const fromDate = new Date(dateRange.startDate);
      const toDate = new Date(dateRange.endDate);

      const results: any = {};

      // Always fetch inventory_cost_over_month if selected
      if (selectedAnalyticsOptions.includes('inventory_cost_over_month')) {
        try {
          const costOverMonthResp = await inventoryAnalyticsAPI.getInventoryCostOverMonth(fromDate, toDate);
          results.inventoryCostOverMonth = costOverMonthResp;
        } catch (err) {
          console.error('[DEBUG] Error fetching inventory_cost_over_month:', err);
          results.inventoryCostOverMonth = null;
        }
      }

      if (selectedAnalyticsOptions.includes('items_status')) {
        const statusResponse = await inventoryAnalyticsAPI.getItemsStatus(
          fromDate,
          toDate
        );
        results.statusData = statusResponse;
      }

      if (selectedAnalyticsOptions.includes('category_wise')) {
        const categoryResponse = await inventoryAnalyticsAPI.getCategoryWise(
          fromDate,
          toDate
        );
        results.categoryData = categoryResponse;
      }

      if (selectedAnalyticsOptions.includes('green_consumption')) {
        results.greenConsumption = await inventoryAnalyticsAPI.getGreenConsumption(
          fromDate,
          toDate
        );
      }

      if (selectedAnalyticsOptions.includes('inventory_consumption_over_site')) {
        results.inventoryConsumptionOverSite = await inventoryAnalyticsAPI.getInventoryConsumptionOverSite(
          fromDate,
          toDate
        );
      }

      if (selectedAnalyticsOptions.includes('consumption_report_green')) {
        results.consumptionReportGreen =
          await inventoryAnalyticsAPI.getConsumptionReportGreen(fromDate, toDate);
      }

      if (selectedAnalyticsOptions.includes('consumption_report_non_green')) {
        results.consumptionReportNonGreen =
          await inventoryAnalyticsAPI.getConsumptionReportNonGreen(
            fromDate,
            toDate
          );
      }

      if (selectedAnalyticsOptions.includes('current_minimum_stock_green')) {
        results.minimumStockGreen =
          await inventoryAnalyticsAPI.getCurrentMinimumStockGreen(
            fromDate,
            toDate
          );
      }

      if (selectedAnalyticsOptions.includes('current_minimum_stock_non_green')) {
        results.minimumStockNonGreen =
          await inventoryAnalyticsAPI.getCurrentMinimumStockNonGreen(
            fromDate,
            toDate
          );
      }

      setAnalyticsData(results);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      toast.error('Failed to fetch analytics data');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, selectedAnalyticsOptions]);

  const handleDateFilter = (dates: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => {
    if (dates.startDate && dates.endDate) {
      setDateRange({
        startDate: dates.startDate,
        endDate: dates.endDate,
      });
    }
  };

  const itemStatusData = [
    {
      name: "Active",
      value: analyticsData.statusData?.count_of_active_items || 0,
      fill: "#22C55E",
    },
    {
      name: "Inactive",
      value: analyticsData.statusData?.count_of_inactive_items || 0,
      fill: "#EF4444",
    },
    {
      name: "Critical",
      value: analyticsData.statusData?.count_of_critical_items || 0,
      fill: "#F97316",
    },
    {
      name: "Non-Critical",
      value: analyticsData.statusData?.count_of_non_critical_items || 0,
      fill: "#3B82F6",
    },
  ];

  const criticalityData = [
    {
      name: "Critical",
      value: analyticsData.statusData?.count_of_critical_items || 0,
      fill: "#F97316",
    },
    {
      name: "Non-Critical",
      value: analyticsData.statusData?.count_of_non_critical_items || 0,
      fill: "#3B82F6",
    },
  ];

  // Group data from API - with safety check
  const groupChartData = (
    analyticsData.categoryData?.category_counts &&
    Array.isArray(analyticsData.categoryData.category_counts)
  )
    ? analyticsData.categoryData.category_counts.map(
      ({ group_name, item_count }) => ({
        name: group_name,
        value: item_count,
      })
    )
    : [];

  const resetFilters = () => {
    setDateRange({
      // Reset to updated default range
      startDate: new Date(2025, 6, 1),
      endDate: new Date(2025, 7, 15),
    });
    setSelectedItems([]);
    setShowFilter(false);
    setShowDateFilter(false);
    setActiveFilters({});
    setLocalCurrentPage(1);
    dispatch(fetchInventoryData({ page: 1, pageSize }));
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="list"
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="list"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Inventory List</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="analytics"
          className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
        >
          <div className="flex justify-end items-center gap-2">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsAnalyticsFilterOpen(true)}
                variant="outline"
                className="flex items-center gap-2 bg-white border-gray-300 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            <InventoryAnalyticsSelector
              onSelectionChange={(options) => setSelectedAnalyticsOptions(options)}
            />
          </div>

          {analyticsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600">Loading analytics data...</div>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleAnalyticsDragEnd}>
              <SortableContext items={analyticsCardOrder} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {analyticsCardOrder.filter(id => selectedAnalyticsOptions.includes(id)).map((id) => {
                    const config: Record<string, { title: string; data: any; type: any }> = {
                      items_status: { title: 'Items Status', data: analyticsData.statusData, type: 'itemsStatus' },
                      category_wise: { title: 'Category Wise Items', data: analyticsData.categoryData, type: 'categoryWise' },
                      green_consumption: { title: 'Green Consumption', data: analyticsData.greenConsumption, type: 'greenConsumption' },
                      consumption_report_green: { title: 'Consumption Report Green', data: analyticsData.consumptionReportGreen, type: 'consumptionReportGreen' },
                      consumption_report_non_green: { title: 'Consumption Report Non-Green', data: analyticsData.consumptionReportNonGreen, type: 'consumptionReportNonGreen' },
                      current_minimum_stock_green: { title: 'Current Minimum Stock Green', data: analyticsData.minimumStockGreen, type: 'currentMinimumStockGreen' },
                      current_minimum_stock_non_green: { title: 'Current Minimum Stock Non-Green', data: analyticsData.minimumStockNonGreen, type: 'currentMinimumStockNonGreen' },
                      inventory_cost_over_month: { title: 'Inventory Cost Over Month', data: analyticsData.inventoryCostOverMonth, type: 'inventoryCostOverMonth' },
                      inventory_consumption_over_site: { title: 'Inventory Consumption Over Site', data: analyticsData.inventoryConsumptionOverSite, type: 'inventoryConsumptionOverSite' },
                    };
                    const card = config[id];
                    if (!card) return null;
                    return (
                      <SortableChartItem id={id} key={id}>
                        {id === 'inventory_cost_over_month' && !card.data ? (
                          <div className="p-4 border border-gray-200 rounded mb-4 animate-pulse bg-white h-[420px] flex flex-col">
                            <div className="h-5 w-48 bg-gray-200 rounded mb-4" />
                            <div className="flex-1 bg-gray-100 rounded" />
                          </div>
                        ) : card.data ? (
                          <InventoryAnalyticsCard
                            title={card.title}
                            data={card.data}
                            type={card.type}
                            dateRange={dateRange}
                          />
                        ) : null}
                      </SortableChartItem>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </TabsContent>
        <TabsContent value="list" className="space-y-4 sm:space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              Error loading inventory data: {error}
            </div>
          )}
          <div className="overflow-x-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 my-6">
              <div
                className={`p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer ${Object.keys(activeFilters || {}).length === 0 ? 'border-2 border-[#C72030]' : ''}`}
                  onClick={() => {
                    setActiveFilters({});
                    setLocalCurrentPage(1);
                  }}
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <Settings
                    className="w-4 h-4 sm:w-6 sm:h-6"
                    style={{ color: "#C72030" }}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                    {baselineCounts.totalInventories}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                    Total Inventories
                  </div>
                </div>
              </div>
              <div
                className={`p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer ${String((activeFilters as any)['q[active_eq]']) === 'true' ? 'border-2 border-[#C72030]' : ''}`}
                  onClick={() => {
                    const nf = { 'q[active_eq]': true as any } as Record<string, string>;
                    setActiveFilters(nf);
                    setLocalCurrentPage(1);
                  }}
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <Settings
                    className="w-4 h-4 sm:w-6 sm:h-6"
                    style={{ color: "#C72030" }}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                    {baselineCounts.activeCount}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                    Active Inventory
                  </div>
                </div>
              </div>
              <div
                className={`p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer ${String((activeFilters as any)['q[active_eq]']) === 'false' ? 'border-2 border-[#C72030]' : ''}`}
                  onClick={() => {
                    const nf = { 'q[active_eq]': false as any } as Record<string, string>;
                    setActiveFilters(nf);
                    setLocalCurrentPage(1);
                  }}
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <Settings
                    className="w-4 h-4 sm:w-6 sm:h-6"
                    style={{ color: "#C72030" }}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                    {baselineCounts.inactiveCount}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                    Inactive
                  </div>
                </div>
              </div>
              <div
                className={`p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer ${String((activeFilters as any)['q[green_product_eq]']) === 'true' ? 'border-2 border-[#C72030]' : ''}`}
                  onClick={() => {
                    const nf = { 'q[green_product_eq]': true as any } as Record<string, string>;
                    setActiveFilters(nf);
                    setLocalCurrentPage(1);
                  }}
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <img
                    src={bio}
                    alt="Green Product"
                    className="w-6 h-6 sm:w-8 sm:h-8"
                    style={{
                      filter:
                        "invert(46%) sepia(66%) saturate(319%) hue-rotate(67deg) brightness(95%) contrast(85%)",
                    }}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                    {baselineCounts.greenInventories}
                  </div>
                  <div className="text-xs sm:text-sm text-green-600 font-medium leading-tight">
                    Ecofriendly
                  </div>
                </div>
              </div>
            </div>
            {showActionPanel && (
              <InventorySelectionPanel
                selectedIds={selectedItems}
                printing={downloadingQR}
                onPrintQR={handlePrintQR}
                onAddConsumable={() => {
                  const firstId = selectedItems[0];
                  if (!firstId) return;
                  const now = new Date();
                  const year = now.getFullYear();
                  const month = String(now.getMonth() + 1).padStart(2, '0');
                  const day = String(now.getDate()).padStart(2, '0');
                  const startDateStr = `${year}-${month}-01`;
                  const endDateStr = `${year}-${month}-${day}`;
                  navigate(`/maintenance/inventory-consumption/view/${firstId}?start_date=${startDateStr}&end_date=${endDateStr}`);
                }}
                onAdd={handleAddInventory}
                onImport={handleImportClick}
                onClose={() => {
                  // Close panel and clear selection as requested
                  setShowActionPanel(false);
                  setSelectedItems([]); // unselect all checkboxes
                  setPanelManuallyClosed(false);
                  setKeepOpenWithoutSelection(false); // reset manual open state
                }}
              />
            )}
            <EnhancedTable
              handleExport={handleExport}
              data={paginatedData}
              columns={columns}
              renderCell={renderCell}
              bulkActions={bulkActions}
              showBulkActions={true}
              selectable={true}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
              onSelectAll={handleSelectAll}
              pagination={false}
              enableExport={true}
              exportFileName="inventory"
              onRowClick={handleViewItem}
              storageKey="inventory-table"
              loading={loading}
              emptyMessage={
                loading ? "Loading inventory data..." : "No inventory items found"
              }
              leftActions={renderCustomActions()}
              onFilterClick={handleFiltersClick}
              enableGlobalSearch={true}
              onGlobalSearch={handleGlobalNameSearch}
              searchPlaceholder="Search name..."
            />
          </div>
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={
                      currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </TabsContent>
      </Tabs>
      <InventoryBulkUploadDialog
        open={showBulkUpload}
        onOpenChange={setShowBulkUpload}
        title="Bulk Upload"
        onImported={() => dispatch(fetchInventoryData({ page: currentPage, pageSize, filters: activeFilters }))}
      />
      <InventoryFilterDialog
        open={showFilter}
        onOpenChange={setShowFilter}
        onApply={handleFilter}
      />
      <DateFilterModal
        open={showDateFilter}
        onOpenChange={setShowDateFilter}
        onApply={(range) => {
          setDateRange(range);
          dispatch(
            fetchInventoryData({
              filters: { startDate: range.startDate, endDate: range.endDate },
            })
          );
        }}
      />
      <InventoryAnalyticsFilterDialog
        isOpen={isAnalyticsFilterOpen}
        onClose={() => setIsAnalyticsFilterOpen(false)}
        onApplyFilters={(filters) => {
          // Parse DD/MM/YYYY to Date objects
          const [startDay, startMonth, startYear] = filters.startDate.split('/').map(Number);
          const [endDay, endMonth, endYear] = filters.endDate.split('/').map(Number);
          const startDate = new Date(startYear, startMonth - 1, startDay);
          const endDate = new Date(endYear, endMonth - 1, endDay);
          setDateRange({ startDate, endDate });
        }}
      />
    </div>
  );
};