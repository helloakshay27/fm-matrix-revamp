import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Eye,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Settings,
  PauseCircle,
  Calendar as CalendarIcon,
  ChevronDown,
  XCircle,
  Pencil,
  RotateCcw,
  Ban,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { StatsCard } from "@/components/StatsCard";
import { PermitFilterModal } from "@/components/PermitFilterModal";
import { AssetAnalyticsCard } from "@/components/AssetAnalyticsCard";
import { AssetAnalyticsFilterDialog } from "@/components/AssetAnalyticsFilterDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { RecentPermitsSidebar } from "@/components/RecentPermitsSidebar";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { debounce } from "lodash";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { usePermitEvents } from "@/components/PostHogPermitEvents";

// Type definitions for permit data
interface Permit {
  id: number;
  created_at: string;
  updated_at: string;
  status: string;
  permit_for: string;
  reference_number: string;
  permit_type: string;
  location: string;
  requested_by: string;
  jsa_submitted: boolean;
  form_submitted: string | null;
  department_name: string;
  status_color_code: string;
  jsa_data: any;
  permit_jsa_url: string;
  print_jsa: any;
  vender_name?: string;
  expiry_date?: string;
}

interface PaginationInfo {
  current_page: number;
  total_count: number;
  total_pages: number;
}

interface PermitsResponse {
  total_permits: number;
  permits: Permit[];
  pagination: PaginationInfo;
}

// Type definition for permit counts response
interface PermitCounts {
  total: number;
  draft: number;
  hold: number;
  open: number;
  approved: number;
  rejected: number;
  extended: number;
  closed: number;
  expired: number;
}

// Column configuration for EnhancedTable
const permitColumns = [
  {
    key: 'srNo',
    label: 'Sr. No.',
    sortable: false,
    draggable: false,
    defaultVisible: true
  },
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },

  {
    key: 'reference_number',
    label: 'Ref No',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'permit_type',
    label: 'Permit Type',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'permit_for',
    label: 'Permit For',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'requested_by',
    label: 'Created By',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'department_name',
    label: 'Designation',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'status',
    label: 'Status',
    sortable: false,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'location',
    label: 'Location',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'vender_name',
    label: 'Vendor Name',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'created_at',
    label: 'Created On',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'expiry_date',
    label: 'Permit Expiry/Extend Date',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'label',
    label: 'Label',
    sortable: false,
    draggable: true,
    defaultVisible: true
  }
];

// API function to fetch permits
const fetchPermits = async (page: number = 1, filters?: string): Promise<PermitsResponse> => {
  let url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PERMITS}?page=${page}`;

  if (filters) {
    url += `&${filters}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch permits');
  }

  return await response.json();
};

// API function to fetch permit counts
const fetchPermitCounts = async (): Promise<PermitCounts> => {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PERMIT_COUNTS}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch permit counts');
  }

  return await response.json();
};

const calculateStats = (permits: Permit[]) => {
  return {
    total: permits.length,
    active: permits.filter(p => p.status === "Active").length,
    pending: permits.filter(p => p.status === "Pending Approval").length,
    completed: permits.filter(p => p.status === "Completed").length,
    expired: permits.filter(p => p.status === "Expired").length,
    draft: permits.filter(p => p.status === "Draft").length,
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-[#C7EDDA] text-[#2c2c2c]";
    case "Pending Approval": return "bg-[#F2EBC9] text-[#2c2c2c]";
    case "Completed": return "bg-[#CECBF6] text-[#2c2c2c]";
    case "Expired": return "bg-[#F2C8C4] text-[#2c2c2c]";
    default: return "bg-[#E5E0D8] text-[#2c2c2c]";
  }
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "High": return "bg-[#F2C8C4] text-[#2c2c2c]";
    case "Medium": return "bg-[#F2EBC9] text-[#2c2c2c]";
    case "Low": return "bg-[#C7EDDA] text-[#2c2c2c]";
    default: return "bg-[#E5E0D8] text-[#2c2c2c]";
  }
};

const PERMIT_TYPE_PALETTE = [
  { bg: '#F2EBC9', text: '#2c2c2c' },
  { bg: '#F8E4C7', text: '#2c2c2c' },
  { bg: '#C7EDDA', text: '#2c2c2c' },
  { bg: '#F2C8C4', text: '#2c2c2c' },
  { bg: '#CECBF6', text: '#2c2c2c' },
  { bg: 'rgba(218, 119, 86, 0.18)', text: '#DA7756' },
  { bg: '#9EC8BA', text: '#2c2c2c' },
];

const getPermitTypeStyle = (permitType: string) => {
  const name = (permitType || '').trim().toLowerCase();
  if (!name) {
    return { backgroundColor: '#E5E0D8', color: '#2c2c2c' };
  }
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash + name.charCodeAt(i) * (i + 1)) % PERMIT_TYPE_PALETTE.length;
  }
  const palette = PERMIT_TYPE_PALETTE[hash];
  return { backgroundColor: palette.bg, color: palette.text };
};

// Utility: get current site ID from localStorage or URL params
const getCurrentSiteId = (): string => {
  return localStorage.getItem('selectedSiteId') ||
    new URLSearchParams(window.location.search).get('site_id') || '';
};

// Utility: format date for API calls (YYYY-MM-DD)
const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// API: fetch site-wise permits report (bar chart)
const fetchSiteWisePermitsReport = async (fromDate: Date, toDate: Date) => {
  const siteId = getCurrentSiteId();
  const fromDateStr = formatDateForAPI(fromDate);
  const toDateStr = formatDateForAPI(toDate);
  const url = `${API_CONFIG.BASE_URL}/pms/permits/site_wise_permits_report.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch site-wise permits report');
  }

  return await response.json();
};

// API: fetch permits status data (pie chart)
const fetchPermitsStatusData = async (fromDate: Date, toDate: Date) => {
  const siteId = getCurrentSiteId();
  const fromDateStr = formatDateForAPI(fromDate);
  const toDateStr = formatDateForAPI(toDate);
  const url = `${API_CONFIG.BASE_URL}/pms/permits/permits_status_data.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch permits status data');
  }

  return await response.json();
};

// Download: site-wise permits download
const downloadSiteWisePermits = async (fromDate: Date, toDate: Date) => {
  const siteId = getCurrentSiteId();
  const fromDateStr = formatDateForAPI(fromDate);
  const toDateStr = formatDateForAPI(toDate);
  const url = `${API_CONFIG.BASE_URL}/pms/permits/site_wise_permits_download.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `site-wise-permits-${fromDateStr}-to-${toDateStr}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error downloading site-wise permits:', error);
    throw error;
  }
};

// Download: permits status download
const downloadPermitsStatus = async (fromDate: Date, toDate: Date) => {
  const siteId = getCurrentSiteId();
  const fromDateStr = formatDateForAPI(fromDate);
  const toDateStr = formatDateForAPI(toDate);
  const url = `${API_CONFIG.BASE_URL}/pms/permits/permits_status_download.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `permits-status-${fromDateStr}-to-${toDateStr}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error downloading permits status:', error);
    throw error;
  }
};

// Sortable chart wrapper — same pattern as IncidentDashboard
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
      target.closest("button") ||
      target.closest("[data-no-drag]") ||
      target.tagName === "BUTTON"
    ) {
      e.stopPropagation();
      return;
    }
    if (listeners?.onPointerDown) listeners.onPointerDown(e);
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

// Analytics options for permits
const PERMIT_ANALYTICS_OPTIONS = [
  { value: "permitSiteWise", label: "Permit Site Wise Report" },
  { value: "permitStatus", label: "Permit Status" },
];

export const PermitToWorkDashboard = () => {
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [permits, setPermits] = useState<Permit[]>([]);
  const [originalPermits, setOriginalPermits] = useState<Permit[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [permitCounts, setPermitCounts] = useState<PermitCounts>({
    total: 0,
    draft: 0,
    hold: 0,
    open: 0,
    approved: 0,
    rejected: 0,
    extended: 0,
    closed: 0,
    expired: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    onPermitListViewed,
    onPermitStatusTileClicked,
    onPermitSearchPerformed,
    onPermitListExported
  } = usePermitEvents();

  // Filter state to maintain filters across page navigation
  const [currentFilters, setCurrentFilters] = useState<string>('');
  // Search state to maintain search term across page navigation
  const [currentSearchParam, setCurrentSearchParam] = useState<string>('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get('page')) || 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(20);

  // Analytics tab state
  const getDefaultAnalyticsDateRange = () => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    return { fromDate: oneYearAgo, toDate: today };
  };
  const formatDateForDisplay = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const [analyticsDateRange, setAnalyticsDateRange] = useState(
    getDefaultAnalyticsDateRange()
  );
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
  const [selectedAnalyticsTypes, setSelectedAnalyticsTypes] = useState<string[]>(
    PERMIT_ANALYTICS_OPTIONS.map((o) => o.value)
  );
  const [isAnalyticsDropdownOpen, setIsAnalyticsDropdownOpen] = useState(false);

  // Drag-and-drop for chart cards
  const [chartOrder, setChartOrder] = useState<string[]>(["permitSiteWise", "permitStatus"]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const handleChartDragEnd = (event: DragEndEvent) => {
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;

    if (overId && activeId !== overId) {
      setChartOrder((items) => {
        const oldIndex = items.indexOf(activeId);
        const newIndex = items.indexOf(overId);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAnalyticsFilterApply = (startDateStr: string, endDateStr: string) => {
    setAnalyticsDateRange({
      fromDate: new Date(startDateStr),
      toDate: new Date(endDateStr),
    });
  };

  const toggleAnalyticsType = (value: string) => {
    setSelectedAnalyticsTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Analytics data state — site-wise permits (bar chart)
  const [siteWiseRefreshKey, setSiteWiseRefreshKey] = useState(0);
  const handleRefreshSiteWise = () => setSiteWiseRefreshKey((k) => k + 1);

  const [siteWisePermitsData, setSiteWisePermitsData] = useState<{ name: string; value: number }[]>([]);
  const [siteWisePermitsInfo, setSiteWisePermitsInfo] = useState<string>("");
  const [siteWisePermitsLoading, setSiteWisePermitsLoading] = useState(false);

  // Analytics data state — permits status (pie chart)
  const [permitsStatusRefreshKey, setPermitsStatusRefreshKey] = useState(0);
  const handleRefreshPermitsStatus = () => setPermitsStatusRefreshKey((k) => k + 1);

  const [permitsStatusData, setPermitsStatusData] = useState<{ name: string; value: number }[]>([]);
  const [permitsStatusInfo, setPermitsStatusInfo] = useState<string>("");
  const [permitsStatusLoading, setPermitsStatusLoading] = useState(false);

  // Fetch site-wise permits report independently
  useEffect(() => {
    const load = async () => {
      setSiteWisePermitsLoading(true);
      try {
        const result = await fetchSiteWisePermitsReport(
          analyticsDateRange.fromDate,
          analyticsDateRange.toDate
        );
        if (result.success === 1 && result.response) {
          const chartData: { name: string; value: number }[] = [];
          for (const [, items] of Object.entries(result.response)) {
            if (Array.isArray(items)) {
              for (const item of items) {
                if (Array.isArray(item) && item.length >= 2) {
                  chartData.push({ name: `${item[1]}`, value: item[0] as number });
                }
              }
            }
          }
          setSiteWisePermitsData(chartData);
          setSiteWisePermitsInfo(result.info?.info || "Site wise permits distribution");
        }
      } catch (err) {
        console.error("Error fetching site-wise permits report:", err);
      } finally {
        setSiteWisePermitsLoading(false);
      }
    };
    load();
  }, [analyticsDateRange, siteWiseRefreshKey]);

  // Fetch permits status data independently
  useEffect(() => {
    const load = async () => {
      setPermitsStatusLoading(true);
      try {
        const result = await fetchPermitsStatusData(
          analyticsDateRange.fromDate,
          analyticsDateRange.toDate
        );
        if (result.success === 1 && result.response) {
          const chartData: { name: string; value: number }[] = [];
          for (const [key, val] of Object.entries(result.response)) {
            if (key !== "Total" && typeof val === "number") {
              chartData.push({ name: key, value: val });
            }
          }
          setPermitsStatusData(chartData);
          setPermitsStatusInfo(result.info?.info || "Distribution of permits by status");
        }
      } catch (err) {
        console.error("Error fetching permits status data:", err);
      } finally {
        setPermitsStatusLoading(false);
      }
    };
    load();
  }, [analyticsDateRange, permitsStatusRefreshKey]);

  // Download handlers for analytics charts
  const handleSiteWisePermitsDownload = async () => {
    try {
      await downloadSiteWisePermits(analyticsDateRange.fromDate, analyticsDateRange.toDate);
      toast.success("Site wise permits report downloaded successfully");
    } catch (err) {
      toast.error("Failed to download site wise permits report");
    }
  };

  const handlePermitsStatusDownload = async () => {
    try {
      await downloadPermitsStatus(analyticsDateRange.fromDate, analyticsDateRange.toDate);
      toast.success("Permits status report downloaded successfully");
    } catch (err) {
      toast.error("Failed to download permits status report");
    }
  };

  // Fetch permits on component mount and when page/filters change
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Combine filters and search parameters
        let combinedParams = currentFilters;
        if (currentSearchParam) {
          combinedParams = combinedParams
            ? `${combinedParams}&${currentSearchParam}`
            : currentSearchParam;
        }

        // Fetch both permits and counts in parallel
        const [permitsResponse, countsResponse] = await Promise.all([
          fetchPermits(currentPage, combinedParams),
          fetchPermitCounts()
        ]);

        setPermits(permitsResponse.permits);
        // Only update originalPermits if no filters are applied
        if (!combinedParams) {
          setOriginalPermits(permitsResponse.permits);
        }
        setPermitCounts(countsResponse);

        onPermitListViewed({
          status_mix: Array.from(new Set(permitsResponse.permits.map(p => p.status))),
          result_count: permitsResponse.pagination?.total_count || permitsResponse.permits.length
        });

        // Update pagination info
        if (permitsResponse.pagination) {
          setTotalPages(permitsResponse.pagination.total_pages || 1);
          setTotalCount(permitsResponse.pagination.total_count || 0);
        } else {
          setTotalPages(1);
          setTotalCount(permitsResponse.permits?.length || 0);
        }

        setError(null);
      } catch (err) {
        setError('Failed to load permit data');
        console.error('Error fetching permit data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, currentFilters, currentSearchParam]); // Add currentSearchParam to dependencies

  const debouncedSearch = useCallback(
    debounce(async (searchValue: string) => {
      // Reset to first page when search changes
      setCurrentPage(1);

      // Store search parameter in state
      if (searchValue) {
        onPermitSearchPerformed({ query_length: searchValue.length, returned_zero: false });
        const searchParam = `q[reference_number_or_permit_type_name_cont]=${encodeURIComponent(searchValue)}`;
        setCurrentSearchParam(searchParam);
      } else {
        setCurrentSearchParam('');
      }

      // Mark filter as applied if there's a search value or existing filters
      setIsFilterApplied(!!searchValue || !!currentFilters);
    }, 500), // 500ms debounce delay
    [currentFilters]
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const stats = calculateStats(permits);

  const handleAddPermit = () => {
    navigate("/safety/permit/add");
  };

  const handleViewPermit = (permitId: number) => {
    navigate(`/safety/permit/details/${permitId}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Refresh permits data
  const handleRefresh = async () => {
    try {
      setLoading(true);

      // Fetch both permits and counts in parallel
      const [permitsResponse, countsResponse] = await Promise.all([
        fetchPermits(currentPage),
        fetchPermitCounts()
      ]);

      setPermits(permitsResponse.permits);
      setOriginalPermits(permitsResponse.permits);
      setPermitCounts(countsResponse);

      // Update pagination info
      if (permitsResponse.pagination) {
        setTotalPages(permitsResponse.pagination.total_pages || 1);
        setTotalCount(permitsResponse.pagination.total_count || 0);
      } else {
        setTotalPages(1);
        setTotalCount(permitsResponse.permits?.length || 0);
      }

      setError(null);
      setIsFilterApplied(false);
    } catch (err) {
      setError('Failed to load permit data');
      console.error('Error fetching permit data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filtered results from the filter modal
  // Handle Excel export
  const handleExcelExport = async () => {
    onPermitListExported({ row_count: permits.length, after_filter: isFilterApplied });
    try {
      setLoading(true);
      const exportUrl = `${API_CONFIG.BASE_URL}/pms/permits/export.xlsx`;

      let url = exportUrl;
      if (currentFilters) {
        url += `?${currentFilters}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a URL for the blob
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Set the filename for the download
      const currentDate = new Date().toISOString().split('T')[0];
      link.download = `permits-export-${currentDate}.xlsx`;

      // Append link to document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error exporting permits:', error);
      setError('Failed to export permits');
    } finally {
      setLoading(false);
    }
  };

  const handleFilteredResults = (filteredPermits: Permit[], paginationInfo?: PaginationInfo, filterString?: string) => {
    setPermits(filteredPermits);
    setIsFilterApplied(true);

    // Store the filter string to maintain filters across page navigation
    setCurrentFilters(filterString || '');

    // Clear search when applying filters from modal
    setCurrentSearchParam('');
    setSearchTerm('');

    // Reset to page 1 when applying new filters
    setCurrentPage(1);

    // Update pagination info if provided
    if (paginationInfo) {
      setCurrentPage(paginationInfo.current_page || 1);
      setTotalPages(paginationInfo.total_pages || 1);
      setTotalCount(paginationInfo.total_count || 0);
    } else {
      // Reset pagination to single page if no pagination info provided
      setCurrentPage(1);
      setTotalPages(1);
      setTotalCount(filteredPermits.length);
    }
  };

  // Clear filters and restore original data
  const handleClearFilters = () => {
    setPermits(originalPermits);
    setIsFilterApplied(false);

    // Clear both filters and search parameters
    setCurrentFilters('');
    setCurrentSearchParam('');
    setSearchTerm(''); // Also clear the search term in the UI

    // Reset pagination to reflect the original data
    // This will trigger a refresh from the server
    setCurrentPage(1);
  };

  // Navigation functions for StatCards
  const handleStatCardClick = async (status?: string) => {
    if (status) onPermitStatusTileClicked({ status });
    try {
      setLoading(true);
      setCurrentPage(1); // Reset to first page when filtering

      let filters = '';
      if (status) {
        filters = `q[status_eq]=${status}`;
      }

      // Update current filters state and clear search
      setCurrentFilters(filters);
      setCurrentSearchParam('');
      setSearchTerm('');

      const permitsResponse = await fetchPermits(1, filters);

      setPermits(permitsResponse.permits || []);

      // Update pagination info
      if (permitsResponse.pagination) {
        setTotalPages(permitsResponse.pagination.total_pages || 1);
        setTotalCount(permitsResponse.pagination.total_count || 0);
      } else {
        setTotalPages(1);
        setTotalCount(permitsResponse.permits?.length || 0);
      }

      setIsFilterApplied(!!status); // Set filter applied if status is provided
      setError(null);
    } catch (err) {
      setError('Failed to load permit data');
      console.error('Error fetching filtered permits:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change for pagination
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || loading) return;
    setCurrentPage(newPage);
  };

  useEffect(() => {
    navigate(`${location.pathname}?page=${currentPage}`, { replace: true });
  }, [currentPage]);

  // Render cell content for EnhancedTable
  const renderCell = (permit: Permit, columnKey: string) => {
    switch (columnKey) {
      case 'srNo': {
        // Find index of permit in current page
        const index = permits.findIndex(p => p.id === permit.id);
        // Use 10 records per page for serial number calculation
        return <span className="font-medium">{(currentPage - 1) * 10 + index + 1}</span>;
      }
      case 'id':
        return <span className="font-medium">{permit.id}</span>;
      case 'label':
        const color = permit["color"] || '#E5E7EB';
        if (color.toLowerCase() === '#6c3483') {
          return 'Permit To Complete';
        } else if (color.toLowerCase() === '#008081') {
          return 'Awaiting Closure';
        } else {
          return '-';
        }
      case 'reference_number':
        return permit.reference_number;
      case 'permit_type': {
        const bgColor = permit["color"] || '#E5E7EB';
        const textColor = (bgColor.toLowerCase() === '#6c3483' || bgColor.toLowerCase() === '#008081') ? '#fff' : '#222';

        return (
          <span
            className="px-2.5 py-0.5 rounded text-xs font-medium inline-flex items-center"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            {permit.permit_type}
          </span>
        );
      }
      case 'permit_for':
        return <div className="w-[200px] text-ellipsis overflow-hidden">{permit.permit_for}</div>;
      case 'requested_by':
        return permit.requested_by;
      case 'department_name':
        return permit.department_name;
      case 'status':
        return (
          <Badge
            className="text-white"
            style={{ backgroundColor: permit.status_color_code }}
          >
            {permit.status}
          </Badge>
        );
      case 'location':
        return (
          <span className="max-w-xs truncate block" title={permit.location}>
            {permit.location}
          </span>
        );
      case 'vendor_name':
        return permit.vender_name || '-';
      case 'created_at':
        return formatDate(permit.created_at);
      case 'expiry_date':
        return permit.expiry_date ? formatDate(permit.expiry_date) : '-';
      default:
        return permit[columnKey as keyof Permit] || '-';
    }
  };

  // Render actions for each row
  const renderActions = (permit: Permit) => (
    <div className="flex items-center gap-2">
      {shouldShow("Permit", "show") && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-[#C72030] hover:bg-[#C72030]/10 hover:text-[#C72030]"
          title="View permit details"
          onClick={(e) => {
            e.stopPropagation();
            handleViewPermit(permit.id);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className={currentPage === 1 ? "bg-[#C72030] text-white" : ""}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is far from start
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and neighbors
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={currentPage === i ? "bg-[#C72030] text-white" : ""}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              className={currentPage === totalPages ? "bg-[#C72030] text-white" : ""}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={currentPage === i ? "bg-[#C72030] text-white" : ""}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const iconClass = "w-6 h-6 sm:w-8 sm:h-8 text-brand";

  const permitStatCards = [
    { title: "Total Permits", value: permitCounts.total, icon: <FileText className={iconClass} />, status: undefined as string | undefined },
    { title: "Approved", value: permitCounts.approved, icon: <CheckCircle className={iconClass} />, status: "Approved" },
    { title: "Open", value: permitCounts.open, icon: <Clock className={iconClass} />, status: "Open" },
    { title: "Closed", value: permitCounts.closed, icon: <XCircle className={iconClass} />, status: "Closed" },
    { title: "Draft", value: permitCounts.draft, icon: <Pencil className={iconClass} />, status: "Draft" },
    { title: "Hold", value: permitCounts.hold, icon: <PauseCircle className={iconClass} />, status: "Hold" },
    { title: "Rejected", value: permitCounts.rejected, icon: <Ban className={iconClass} />, status: "Rejected" },
    { title: "Extended", value: permitCounts.extended, icon: <RotateCcw className={iconClass} />, status: "Extended" },
    { title: "Expired", value: permitCounts.expired, icon: <AlertTriangle className={iconClass} />, status: "Expired" },
  ];

  const leftActions = (
    <div className="flex items-center gap-2">
      {shouldShow("Permit", "create") && (
        <Button
          onClick={handleAddPermit}
          className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Permit
        </Button>
      )}
    </div>
  )

  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="list"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-brand data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <FileText className="w-4 h-4" />
            List
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-brand data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <Settings className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mb-6">
            {permitStatCards.map((card) => (
              <StatsCard
                key={card.title}
                title={card.title}
                value={card.value}
                icon={card.icon}
                onClick={() => handleStatCardClick(card.status)}
              />
            ))}
          </div>



          <EnhancedTable
            data={permits}
            columns={permitColumns}
            renderCell={renderCell}
            renderActions={renderActions}
            onRowClick={(permit) => handleViewPermit(permit.id)}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search permits..."
            enableExport={true}
            handleExport={handleExcelExport}
            exportFileName="permits-export"
            pagination={false} // Keep client-side pagination disabled since we handle server-side
            pageSize={pageSize}
            loading={loading}
            onFilterClick={() => setIsFilterModalOpen(true)}
            emptyMessage={error || "No permits found"}
            storageKey="permit-dashboard-table"
            leftActions={leftActions}

          />

          {/* Standard pagination like AMC/Asset dashboards */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-700">
                {(() => {
                  const pageSize = 10;
                  const start = ((currentPage - 1) * pageSize) + 1;
                  const end = Math.min(currentPage * pageSize, totalCount);
                  if (totalCount === 0) {
                    return "No results";
                  }
                  return `Showing ${start} to ${end} of ${totalCount} results`;
                })()}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          {/* Toolbar: Date Filter + Analytics Selector Popover */}
          <div className="flex justify-end items-center gap-3 mb-6">
            {/* Date range filter button */}
            <Button
              onClick={() => setIsAnalyticsFilterOpen(true)}
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 rounded-none border border-[#DA7756] bg-[#fffaf6] hover:bg-[#fdf0ea] text-[#DA7756]"
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {formatDateForDisplay(analyticsDateRange.fromDate)} &ndash;{" "}
                {formatDateForDisplay(analyticsDateRange.toDate)}
              </span>
              <Filter className="w-4 h-4" />
            </Button>

            {/* Analytics Selector Popover */}
            <Popover
              open={isAnalyticsDropdownOpen}
              onOpenChange={setIsAnalyticsDropdownOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 min-w-[200px] justify-between px-4 py-2 rounded-none border border-[#DA7756] bg-[#fffaf6] hover:bg-[#fdf0ea] text-[#DA7756]"
                >
                  <span className="text-sm font-medium">
                    {selectedAnalyticsTypes.length === 0
                      ? "Select Analytics"
                      : selectedAnalyticsTypes.length === PERMIT_ANALYTICS_OPTIONS.length
                        ? "All Analytics Selected"
                        : `${selectedAnalyticsTypes.length} / ${PERMIT_ANALYTICS_OPTIONS.length} Selected`}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Select Analytics</h4>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() =>
                          setSelectedAnalyticsTypes(
                            PERMIT_ANALYTICS_OPTIONS.map((o) => o.value)
                          )
                        }
                      >
                        All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => setSelectedAnalyticsTypes([])}
                      >
                        None
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Charts
                    </p>
                    <div className="space-y-2">
                      {PERMIT_ANALYTICS_OPTIONS.map((opt) => (
                        <div key={opt.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`permit-opt-${opt.value}`}
                            checked={selectedAnalyticsTypes.includes(opt.value)}
                            onCheckedChange={() => toggleAnalyticsType(opt.value)}
                          />
                          <label
                            htmlFor={`permit-opt-${opt.value}`}
                            className="text-sm cursor-pointer"
                          >
                            {opt.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Grid Layout: Charts (left) + Recent Permits Sidebar (right) */}
          <div className="flex flex-col xl:flex-row gap-6 min-h-[calc(100vh-200px)]">
            <div className="flex-1 min-w-0 space-y-6">
              {/* Chart Grid — draggable, only show selected charts */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleChartDragEnd}
              >
                <SortableContext
                  items={chartOrder.filter((k) => selectedAnalyticsTypes.includes(k))}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {chartOrder
                      .filter((key) => selectedAnalyticsTypes.includes(key))
                      .map((key) => {
                        if (key === "permitSiteWise") {
                          return (
                            <SortableChartItem key="permitSiteWise" id="permitSiteWise">
                              <AssetAnalyticsCard
                                title="Permit Site Wise Report"
                                type="groupWise"
                                data={siteWisePermitsData}
                                dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                                onDownload={handleSiteWisePermitsDownload}
                                onRefresh={handleRefreshSiteWise}
                                isLoading={siteWisePermitsLoading}
                              />
                            </SortableChartItem>
                          );
                        }
                        if (key === "permitStatus") {
                          return (
                            <SortableChartItem key="permitStatus" id="permitStatus">
                              <AssetAnalyticsCard
                                title="Permit Status"
                                type="categoryWise"
                                data={permitsStatusData}
                                dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                                onDownload={handlePermitsStatusDownload}
                                onRefresh={handleRefreshPermitsStatus}
                                isLoading={permitsStatusLoading}
                              />
                            </SortableChartItem>
                          );
                        }
                        return null;
                      })}

                    {selectedAnalyticsTypes.length === 0 && (
                      <div className="col-span-2 flex flex-col items-center justify-center py-16 text-gray-400">
                        <Settings className="w-12 h-12 mb-4 opacity-30" />
                        <p className="text-lg font-medium">No analytics selected</p>
                        <p className="text-sm mt-1">Use the selector above to choose which charts to display.</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </div>{/* end xl:col-span-8 */}

            {/* Recent Permits Sidebar */}
            <div className="flex-shrink-0 self-stretch">
              <RecentPermitsSidebar permits={permits} loading={loading} />
            </div>
          </div>{/* end xl:grid-cols-12 */}

          {/* Date filter dialog */}
          <AssetAnalyticsFilterDialog
            isOpen={isAnalyticsFilterOpen}
            onClose={() => setIsAnalyticsFilterOpen(false)}
            onApplyFilters={handleAnalyticsFilterApply}
            currentStartDate={analyticsDateRange.fromDate}
            currentEndDate={analyticsDateRange.toDate}
          />
        </TabsContent>
      </Tabs>

      <PermitFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleFilteredResults}
        onLoadingChange={setLoading}
        onReset={handleClearFilters}
      />
    </div>
  );
};