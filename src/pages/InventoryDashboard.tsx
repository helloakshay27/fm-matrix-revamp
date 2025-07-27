import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchInventoryData } from "@/store/slices/inventorySlice";
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
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  BarChart3,
  Download,
  ChevronDown,
  RotateCcw,
  ChevronRight,
  Settings,
  AlertCircle,
  Trash2,
  Leaf,
} from "lucide-react";
import { BulkUploadDialog } from "@/components/BulkUploadDialog";
import { InventoryFilterDialog } from "@/components/InventoryFilterDialog";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventorySelector } from "@/components/InventorySelector";
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
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { toast } from "sonner";

// Map API field names to display field names for backward compatibility
const mapInventoryData = (apiData: any[]) => {
  return apiData.map((item) => {
    const itemId =
      typeof item.id === "string"
        ? item.id
        : item.id?.value || String(item.id || ""); // Handle nested ID or fallback
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
      criticality: item.criticality || "",
      quantity: item.quantity?.toString() || "0",
      active: item.active ? "Active" : "Inactive",
      unit: item.unit || "",
      cost: item.cost?.toString() || "",
      sacHsnCode: item.hsc_hsn_code || "",
      maxStockLevel: item.max_stock_level?.toString() || "",
      minStockLevel: item.min_stock_level?.toString() || "",
      minOrderLevel: item.min_order_level?.toString() || "",
      greenProduct: item.green_product || false, // Add group_product field
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
  } = useSelector((state: RootState) => state.inventory);

  // Calculate derived data from inventory items
  const totalInventories = totalCount;
  const activeCount = inventoryItems.filter(item => item.active).length;
  const inactiveCount = inventoryItems.filter(item => !item.active).length;
  const greenInventories = inventoryItems.filter(item => item.green_product).length;

  // Local state
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [visibleSections, setVisibleSections] = useState<string[]>([
    "statusChart",
    "criticalityChart",
    "categoryChart",
    "agingMatrix",
  ]);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [chartOrder, setChartOrder] = useState<string[]>([
    "statusChart",
    "criticalityChart",
    "categoryChart",
    "agingMatrix",
  ]);
  const [activeTab, setActiveTab] = useState<string>("list");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2020-01-01'),
    endDate: new Date('2025-01-01')
  });
  const [analyticsData, setAnalyticsData] = useState({
    categoryData: [],
    statusData: {
      activeItems: 0,
      inactiveItems: 0,
      criticalItems: 0,
      nonCriticalItems: 0
    }
  });

  const pageSize = 15; // Use larger page size for API data

  // Map API data to display format
  const inventoryData = mapInventoryData(inventoryItems);

  // Fetch inventory data on component mount
  useEffect(() => {
    dispatch(fetchInventoryData({ page: currentPage }));
  }, [dispatch, currentPage]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Use Redux pagination data or calculate from current data
  const totalPages =
    reduxTotalPages || Math.ceil(inventoryData.length / pageSize);
  const startIndex = 0; // API handles pagination, so start from 0
  const paginatedData = inventoryData.slice(startIndex, pageSize); // Show current page data

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

  // Recent inventory items for sidebar
  const recentItems = inventoryData.slice(0, 3).map((item, index) => ({
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
      setSelectedItems(paginatedData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleViewItem = (itemId: string) => {
    if (!itemId || typeof itemId !== "string" || itemId === "[object Object]") {
      return;
    }
    navigate(`/maintenance/inventory/details/${itemId}`);
  };

  const handleAddInventory = () => {
    navigate("/maintenance/inventory/add");
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

  const columns = [
    { key: "actions", label: "Actions", sortable: false },
    { key: "name", label: "Name", sortable: true },
    { key: "id", label: "ID", sortable: true },
    { key: "referenceNumber", label: "Reference Number", sortable: true },
    { key: "code", label: "Code", sortable: true },
    { key: "serialNumber", label: "Serial Number", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "group", label: "Group", sortable: true },
    { key: "subGroup", label: "Sub Group", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "manufacturer", label: "Manufacturer", sortable: true },
    { key: "criticality", label: "Criticality", sortable: true },
    { key: "quantity", label: "Quantity", sortable: true },
    { key: "active", label: "Active", sortable: true },
    { key: "unit", label: "Unit", sortable: true },
    { key: "cost", label: "Cost", sortable: true },
    { key: "sacHsnCode", label: "SAC/HSN Code", sortable: true },
    { key: "maxStockLevel", label: "Max Stock", sortable: true },
    { key: "minStockLevel", label: "Min Stock", sortable: true },
    { key: "minOrderLevel", label: "Min Order", sortable: true },
  ];

  const bulkActions = [
    {
      label: "Print QR Codes",
      icon: FileText,
      onClick: (selectedItems) => {
        alert(`Printing QR codes for ${selectedItems.length} items`);
      },
    },
  ];

  const renderCell = (item: any, columnKey: string) => {
    if (columnKey === "actions") {
      const itemId =
        typeof item.id === "string" ? item.id : String(item.id || "");
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewItem(itemId)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {item.greenProduct && (
            <img
              src={bio}
              alt="Green Product"
              className="w-4 h-4"
              style={{
                filter:
                  "invert(46%) sepia(66%) saturate(319%) hue-rotate(67deg) brightness(95%) contrast(85%)",
              }}
            />
            // <Leaf className="w-4 h-4 text-green-600" />
          )}
        </div>
      );
    }
    if (columnKey === "criticality") {
      return (
        <span
          className={`px-2 py-1 rounded text-xs ${item.criticality === "Critical"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-700"
            }`}
        >
          {item.criticality}
        </span>
      );
    }
    if (columnKey === "active") {
      return (
        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
          {item.active}
        </span>
      );
    }
    return item[columnKey];
  };

  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis or pages 2-3
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show current page area
      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show ellipsis or pages before last
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find((item) => item.key === i)) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i)}
                  isActive={currentPage === i}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => setCurrentPage(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const handleFiltersClick = () => {
    setShowFilter(true);
  };

  const handleActionClick = () => {
    setShowActionPanel(true);
  };

  const handleImportClick = () => {
    setShowBulkUpload(true);
  };

  console.log(inventoryData);
  const renderCustomActions = () => (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={handleActionClick}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
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

      let url = `https://${baseUrl}/pms/inventories/export.xlsx?site_id=${siteId}`;
      if (selectedItems.length > 0) {
        const ids = selectedItems.join(',');
        url += `&ids=${ids}`;
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
      link.download = 'inventories.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      toast.success('Inventory data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export inventory data');
    }
  };

  const fetchAnalyticsData = async () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const siteId = localStorage.getItem('selectedSiteId');

    if (!baseUrl || !token || !siteId) {
      toast.error('Missing base URL, token, or site ID');
      return;
    }

    try {
      const fromDate = dateRange.startDate.toISOString().split('T')[0];
      const toDate = dateRange.endDate.toISOString().split('T')[0];

      // Fetch category wise items
      const categoryResponse = await axios.get(
        `https://${baseUrl}/pms/inventories/category_wise_items.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Fetch items status
      const statusResponse = await axios.get(
        `https://${baseUrl}/pms/inventories/items_status.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAnalyticsData({
        categoryData: categoryResponse.data.category_counts || [],
        statusData: {
          activeItems: statusResponse.data.count_of_active_items || 0,
          inactiveItems: statusResponse.data.count_of_inactive_items || 0,
          criticalItems: statusResponse.data.count_of_critical_items || 0,
          nonCriticalItems: statusResponse.data.count_of_non_critical_items || 0
        }
      });
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      toast.error('Failed to fetch analytics data');
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const handleDateFilter = (dates: { startDate: Date | undefined; endDate: Date | undefined }) => {
    if (dates.startDate && dates.endDate) {
      setDateRange({
        startDate: dates.startDate,
        endDate: dates.endDate
      });
    }
  };

  // Update the analytics section to use dynamic data
  const itemStatusData = [
    { name: "Active", value: analyticsData.statusData.activeItems, fill: "#c6b692" },
    { name: "Inactive", value: analyticsData.statusData.inactiveItems, fill: "#d8dcdd" },
  ];

  const criticalityData = [
    { name: "Critical", value: analyticsData.statusData.criticalItems, fill: "#c6b692" },
    { name: "Non-Critical", value: analyticsData.statusData.nonCriticalItems, fill: "#d8dcdd" },
  ];

  // Group data from API
  const groupChartData = analyticsData.categoryData.map(({ group_name, item_count }) => ({
    name: group_name,
    value: item_count
  }));

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
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current"
            >
              <path
                d="M1.875 4.25L3 5.375L5.25 3.125M1.875 9.5L3 10.625L5.25 8.375M1.875 14.75L3 15.875L5.25 13.625M7.875 9.5H16.125M7.875 14.75H16.125M7.875 4.25H16.125"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:inline">Inventory List</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Charts</span>
          </TabsTrigger>
        </TabsList>
     \
        <TabsContent value="list" className="space-y-4 sm:space-y-6">
          {/* Error handling */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              Error loading inventory data: {error}
            </div>
          )}
          <div className="overflow-x-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 my-6">
              <div className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer" onClick={() =>
                dispatch(fetchInventoryData({}))
              }
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12  flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <Settings
                    className="w-4 h-4 sm:w-6 sm:h-6"
                    style={{ color: "#C72030" }}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                    {totalInventories}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                    Total Inventories
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer" onClick={() =>
                dispatch(fetchInventoryData({ filters: { 'q[active_eq]': true } }))
              }
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12  flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <Settings
                    className="w-4 h-4 sm:w-6 sm:h-6"
                    style={{ color: "#C72030" }}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                    {activeCount}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                    Active Inventory
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer" onClick={() =>
                dispatch(fetchInventoryData({ filters: { 'q[active_eq]': false } }))
              }
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12  flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <Settings
                    className="w-4 h-4 sm:w-6 sm:h-6"
                    style={{ color: "#C72030" }}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                    {inactiveCount}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                    Inactive
                  </div>
                </div>
              </div>
              <div
                className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer"
                onClick={() =>
                  dispatch(
                    fetchInventoryData({
                      filters: { "q[green_product_eq]": true },
                    })
                  )
                }
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12  flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <Settings
                    className="w-4 h-4 sm:w-6 sm:h-6"
                    style={{ color: "#C72030" }}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                    {greenInventories || 0}
                  </div>
                  <div className="text-xs text-green-600 sm:text-sm text-muted-foreground font-medium leading-tight">
                    Ecofriendly
                  </div>
                </div>
              </div>
              {/* <div className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee]">
                <div className="w-8 h-8 sm:w-12 sm:h-12  flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate" >
                    {2}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Closed</div>
                </div>
              </div> */}
            </div>
            {showActionPanel && (
              <SelectionPanel
                onAdd={handleAddInventory}
                onImport={handleImportClick}
                onClearSelection={() => setShowActionPanel(false)}
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
                loading
                  ? "Loading inventory data..."
                  : "No inventory items found"
              }
              leftActions={renderCustomActions()}
              onFilterClick={handleFiltersClick}
            />
          </div>
          {/* Custom Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>
      </Tabs>
      <BulkUploadDialog
        open={showBulkUpload}
        onOpenChange={setShowBulkUpload}
        title="Bulk Upload"
      />
      <InventoryFilterDialog
        open={showFilter}
        onOpenChange={setShowFilter}
        onApply={(filters) => console.log("Applied filters:", filters)}
      />
      <DateFilterModal
        open={showDateFilter}
        onOpenChange={setShowDateFilter}
        onApply={(range) => {
          setDateRange(range);
          dispatch(fetchInventoryData({ filters: { startDate: range.startDate, endDate: range.endDate } }));
        }}
      />
    </div>
  );
};
