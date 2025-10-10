import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Clock,
  AlertCircle,
  Play,
  CheckCircle,
  XCircle,
  Plus,
  Filter as FilterIcon,
  Download,
  Calendar as CalendarIcon,
  List,
  Settings,
  Eye,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import { TaskAdvancedFilterDialog } from "@/components/TaskAdvancedFilterDialog";
import { useNavigate } from "react-router-dom";
import { StatusCard } from "@/components/maintenance/StatusCard";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { ScheduledTaskCalendar } from "@/components/maintenance/ScheduledTaskCalendar";
import { TaskSelectionPanel } from "@/components/TaskSelectionPanel";
import { calendarService, CalendarEvent } from "@/services/calendarService";
import { CalendarFilters } from "@/components/CalendarFilterModal";
import { getToken } from "@/utils/auth";
import { getFullUrl } from "@/config/apiConfig";
import { TaskFilterDialog, TaskFilters } from "@/components/TaskFilterDialog";
import { taskService } from "@/services/taskService";
import {
  taskAnalyticsAPI,
  TechnicalChecklistResponse,
  NonTechnicalChecklistResponse,
  TopTenChecklistResponse,
  SiteWiseChecklistResponse,
} from "@/services/taskAnalyticsAPI";
import { TaskAnalyticsCard } from "@/components/TaskAnalyticsCard";
import { TaskAnalyticsFilterDialog } from "@/components/TaskAnalyticsFilterDialog";
import { TaskAnalyticsSelector } from "@/components/TaskAnalyticsSelector";
import { BarChart3 } from "lucide-react";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
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

// Sortable Chart Item Component for Drag and Drop
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
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Handle pointer down to prevent drag on button/icon clicks
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    // Check if the click is on a button, icon, or download element
    if (
      target.closest("button") ||
      target.closest("[data-download]") ||
      target.closest("svg") ||
      target.tagName === "BUTTON" ||
      target.tagName === "SVG" ||
      target.closest(".download-btn") ||
      target.closest("[data-download-button]")
    ) {
      e.stopPropagation();
      return;
    }
    // For other elements, proceed with drag
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
      className="cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md group relative"
    >
      {/* Drag indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 transition-opacity duration-200 z-10">
        <div className="w-1 h-6 bg-gray-400 rounded-full"></div>
      </div>
      {children}
    </div>
  );
};

interface TaskRecord {
  id: string;
  checklist: string;
  type: string;
  schedule: string;
  assignTo: string;
  status: string;
  scheduleFor: string;
  assetsServices: string;
  site: string;
  location: string;
  supplier: string;
  graceTime: string;
  duration: string;
  percentage: string;
  active: boolean;
}

interface ApiTaskResponse {
  current_page: number;
  pages: number;
  scheduled_count: number;
  open_count: number;
  wip_count: number;
  closed_count: number;
  overdue_count: number;
  asset_task_occurrences: ApiTaskOccurrence[];
}

interface ApiTaskOccurrence {
  scheduled_for: any;
  id: number;
  checklist: string;
  supplier: string | null;
  duration: string;
  percentage: number;
  asset: string;
  asset_id: number;
  asset_code: string;
  latitude: number;
  longitude: number;
  geofence_range: number;
  task_id: number;
  scan_type: string;
  overdue_task_start_status: boolean;
  start_date: string;
  assigned_to_id: number[];
  assigned_to_name: string;
  backup_assigned_user: string | null;
  grace_time: string;
  company_id: number;
  company: string;
  active: boolean | null;
  task_status: string;
  schedule_type: string;
  site_name: string;
  task_approved_at: string | null;
  task_approved_by_id: number | null;
  task_approved_by: string | null;
  task_verified: boolean;
  asset_path: string;
  checklist_responses: any;
  checklist_questions: any[];
  supervisors: any[];
  task_start_time: string | null;
  task_end_time: string | null;
  time_log: string | null;
  created_at: string;
  updated_at: string;
}

const statusCards = [
  {
    title: "Scheduled Tasks",
    count: 1555,
    icon: Settings,
    status: "Scheduled",
  },
  {
    title: "Open Tasks",
    count: 174,
    icon: AlertCircle,
    status: "Open",
  },
  {
    title: "In Progress",
    count: 0,
    icon: Play,
    status: "Work In Progress",
  },
  {
    title: "Closed Tasks",
    count: 0,
    icon: CheckCircle,
    status: "Closed",
  },
  {
    title: "Overdue Tasks",
    count: 907,
    icon: XCircle,
    status: "Overdue",
  },
];

export const ScheduledTaskDashboard = () => {
  const getDefaultDateRange = () => {
    const today = new Date();
    // Create a new date object for one week ago to avoid mutation
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return {
      startDate: formatDate(oneWeekAgo),
      endDate: formatDate(today),
    };
  };
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState("01/07/2025");
  const [dateTo, setDateTo] = useState("31/07/2025");
  const [searchTaskId, setSearchTaskId] = useState("");
  const [searchChecklist, setSearchChecklist] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const [activeTab, setActiveTab] = useState("list");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showSelectionPanel, setShowSelectionPanel] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarFilters, setCalendarFilters] = useState<CalendarFilters>(
    () => {
      // Use the same default date range as analytics (today to one week ago)
      const defaultRange = getDefaultDateRange();
      return {
        dateFrom: defaultRange.startDate,
        dateTo: defaultRange.endDate,
        "s[task_custom_form_schedule_type_eq]": "",
        "s[task_task_of_eq]": "",
      };
    }
  );
  const [taskData, setTaskData] = useState<TaskRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTaskFilter, setShowTaskFilter] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<TaskFilters>({});

  // Analytics states
  const [showAnalyticsFilter, setShowAnalyticsFilter] = useState(false);

  const [analyticsDateRange, setAnalyticsDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>(getDefaultDateRange());
  const [technicalData, setTechnicalData] =
    useState<TechnicalChecklistResponse | null>(null);
  const [nonTechnicalData, setNonTechnicalData] =
    useState<NonTechnicalChecklistResponse | null>(null);
  const [topTenData, setTopTenData] = useState<TopTenChecklistResponse | null>(
    null
  );
  const [siteWiseData, setSiteWiseData] =
    useState<SiteWiseChecklistResponse | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [selectedAnalytics, setSelectedAnalytics] = useState<string[]>([
    "technical",
    "nonTechnical",
    "topTen",
    "siteWise",
  ]);
  const [chartOrder, setChartOrder] = useState<string[]>([
    "technical",
    "nonTechnical",
    "topTen",
    "siteWise",
  ]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showAll, setShowAll] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>("Open");
  const [statusCounts, setStatusCounts] = useState({
    scheduled_count: 0,
    open_count: 0,
    wip_count: 0,
    closed_count: 0,
    overdue_count: 0,
  });

  // Transform API data to TaskRecord format
  const transformApiDataToTaskRecord = (
    apiData: ApiTaskOccurrence[]
  ): TaskRecord[] => {
    if (!apiData || !Array.isArray(apiData)) {
      console.log("No API data or invalid data format:", apiData); // Debug log
      return [];
    }

    console.log("Transforming API data:", apiData.length, "items"); // Debug log

    return apiData.map((task) => ({
      id: task.id.toString(),
      checklist: task.checklist,
      type: task.schedule_type,
      schedule: task.start_date,
      assignTo: task.assigned_to_name,
      status: task.task_status,
      scheduleFor: task.scheduled_for,
      assetsServices: task.asset,
      site: task.site_name,
      location: task.asset_path,
      supplier: task.supplier || "", // Map supplier field from API
      graceTime: task.grace_time,
      duration: task.duration || "", // Map duration field from API
      percentage: task.percentage ? `${task.percentage}%` : "", // Map percentage field from API with % symbol
      active: task.active !== false,
    }));
  };

  // Fetch tasks with filters, pagination, and search
  const fetchTasks = async (
    filters: TaskFilters = {},
    page: number = 1,
    searchTerm: string = "",
    status: string | null = null
  ) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();

      // Build query parameters from filters and pagination
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());

      if (filters.dateFrom)
        queryParams.append("q[start_date_gteq]", filters.dateFrom);
      if (filters.dateTo)
        queryParams.append("q[start_date_lteq]", filters.dateTo);
      if (filters.checklist)
        queryParams.append("q[custom_form_form_name_cont]", filters.checklist);
      if (filters.scheduleType)
        queryParams.append("sch_type", filters.scheduleType);
      if (filters.type)
        queryParams.append("s[custom_form_schedule_type_eq]", filters.type);
      if (filters.assetGroupId)
        queryParams.append(
          "q[asset_pms_asset_group_id_eq]",
          filters.assetGroupId
        );
      if (filters.assetSubGroupId)
        queryParams.append(
          "q[asset_pms_asset_sub_group_id_eq]",
          filters.assetSubGroupId
        );
      if (filters.assignedTo)
        queryParams.append(
          "q[pms_task_assignments_assigned_to_id_eq]",
          filters.assignedTo
        );
      if (filters.supplierId)
        queryParams.append("q[custom_form_supplier_id_eq]", filters.supplierId);
      if (filters.taskId) queryParams.append("q[id_eq]", filters.taskId);

      // Add status filter
      if (status) {
        queryParams.append("type", status);
      } else {
        // Default to 'Open' when no status is selected
        queryParams.append("type", "Open");
      }

      // Add general search functionality for checklist and asset
      if (searchTerm && searchTerm.trim()) {
        // URLSearchParams automatically encodes the values, no need for manual encoding
        queryParams.append("q[custom_form_form_name_cont]", searchTerm.trim());
        // queryParams.append('q[asset_asset_name_cont]', searchTerm.trim());
      }

      // Add specific checklist search from advanced filters
      if (filters.searchChecklist && filters.searchChecklist.trim()) {
        queryParams.append(
          "q[custom_form_form_name_cont]",
          filters.searchChecklist.trim()
        );
      }

      // Add specific task ID search from advanced filters
      if (filters.searchTaskId && filters.searchTaskId.trim()) {
        queryParams.append("q[id_cont]", filters.searchTaskId.trim());
      }

      const apiUrl = getFullUrl(
        `/pms/users/scheduled_tasks.json?&${queryParams.toString()}`
      );
      console.log("API URL:", apiUrl); // Debug log
      console.log("Search term:", searchTerm); // Debug log

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiTaskResponse = await response.json();
      console.log("API Response:", data); // Debug log
      console.log(
        "Search results count:",
        data.asset_task_occurrences?.length || 0
      ); // Debug log

      const transformedData = transformApiDataToTaskRecord(
        data.asset_task_occurrences || []
      );
      console.log("Transformed data:", transformedData.length, "items"); // Debug log
      setTaskData(transformedData);

      // Update status counts
      setStatusCounts({
        scheduled_count: data.scheduled_count || 0,
        open_count: data.open_count || 0,
        wip_count: data.wip_count || 0,
        closed_count: data.closed_count || 0,
        overdue_count: data.overdue_count || 0,
      });

      // Update pagination state (don't update currentPage to avoid infinite loops)
      setTotalPages(data.pages || 1);
      // Use the transformed data length for display
      setTotalCount(transformedData.length);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to fetch tasks. Please try again.");
      // Set empty data on error
      setTaskData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load on component mount
  useEffect(() => {
    fetchTasks();
  }, []); // Only run once on mount

  // Load tasks when filters, search, or status change (reset to page 1)
  useEffect(() => {
    console.log(
      "Effect triggered - debouncedSearchQuery:",
      debouncedSearchQuery
    ); // Debug log
    fetchTasks(currentFilters, 1, debouncedSearchQuery, selectedStatus);
    setCurrentPage(1); // Reset to first page when filters change
  }, [currentFilters, debouncedSearchQuery, selectedStatus, showAll]);

  // Handle filter application
  const handleApplyFilters = (filters: TaskFilters) => {
    setCurrentFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
    console.log("Applied filters:", filters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      fetchTasks(currentFilters, page, debouncedSearchQuery, selectedStatus);
    }
  };

  // Handle show all toggle
  const handleShowAllChange = (checked: boolean) => {
    setShowAll(checked);
    setCurrentPage(1); // Reset to first page when show_all changes
  };

  // Handle search functionality
  const handleSearch = (query: string) => {
    console.log("Search query:", query); // Debug log
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
    // The useEffect will handle the API call when debouncedSearchQuery changes
  };

  // Handle status card click
  const handleStatusCardClick = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page when filtering by status
  };

  // Handle download tasks
  const handleDownloadTasks = async (statusFilter?: string) => {
    try {
      const status = statusFilter !== undefined ? statusFilter : selectedStatus;
      await taskService.downloadTaskExport({ status: status || undefined });
    } catch (error) {
      console.error("Error downloading tasks:", error);
      // You could add a toast notification here if you have one set up
    }
  };

  // Load calendar events
  useEffect(() => {
    const loadCalendarEvents = async () => {
      try {
        // Always send all filter parameters (including empty ones) to the API
        const params: any = {
          "q[start_date_gteq]": calendarFilters.dateFrom,
          "q[start_date_lteq]": calendarFilters.dateTo,
          "s[task_custom_form_schedule_type_eq]":
            calendarFilters["s[task_custom_form_schedule_type_eq]"] || "",
          "s[task_task_of_eq]": calendarFilters["s[task_task_of_eq]"] || "",
        };

        const events = await calendarService.fetchCalendarEvents(params);
        setCalendarEvents(events);
      } catch (error) {
        console.error("Failed to load calendar events:", error);
        // Use sample data as fallback
        setCalendarEvents([
          {
            id: 14482120,
            title: "PPM - LIFT LOBBY CLEANING",
            start: "2025-07-21 07:00:00",
            details_url:
              "/pms/asset_task_occurrences/14482120/asset_task_details",
            color: "#fdbb0b",
            status: "Scheduled",
            custom_form: {
              name: "LIFT LOBBY CLEANING",
              schedule_type: "PPM",
            },
            task: {
              id: 22099,
              task_type: null,
            },
            schedule_task: {
              building: "Test QA",
              wing: null,
              floor: null,
              area: null,
              room: null,
            },
          },
        ]);
      }
    };

    if (activeTab === "calendar") {
      loadCalendarEvents();
    }
  }, [activeTab, calendarFilters]);

  const handleViewTask = (taskId: string) => {
    navigate(`/maintenance/task/task-details/${taskId}`);
  };

  const handleAdvancedFilter = (filters: any) => {
    setDateFrom(filters.dateFrom || dateFrom);
    setDateTo(filters.dateTo || dateTo);
    setSearchTaskId(filters.searchTaskId || "");
    setSearchChecklist(filters.searchChecklist || "");
  };

  const handleAddTask = () => {
    navigate("/maintenance/task/add");
  };

  const handleExport = async () => {
    try {
      // Implementation for exporting tasks
      console.log("Exporting tasks...");
    } catch (error) {
      console.error("Failed to export tasks:", error);
    }
  };

  const downloadTaskExport = async () => {
    try {
      await taskService.downloadTaskExport();
    } catch (error) {
      console.error("Error downloading task export:", error);
      // You might want to show a toast or alert here
    }
  };

  // Analytics functions
  const parseDateFromString = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("/");
    // Create date in UTC to avoid timezone issues
    return new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day))
    );
  };

  const getDateRangeForComponents = () => ({
    startDate: parseDateFromString(analyticsDateRange.startDate),
    endDate: parseDateFromString(analyticsDateRange.endDate),
  });

  const fetchAnalyticsData = async (
    startDate: Date,
    endDate: Date,
    selectedTypes: string[] = selectedAnalytics
  ) => {
    setAnalyticsLoading(true);
    try {
      const promises: Promise<any>[] = [];

      if (selectedTypes.includes("technical")) {
        promises.push(
          taskAnalyticsAPI.getTechnicalChecklistData(startDate, endDate)
        );
      } else {
        promises.push(Promise.resolve(null));
      }

      if (selectedTypes.includes("nonTechnical")) {
        promises.push(
          taskAnalyticsAPI.getNonTechnicalChecklistData(startDate, endDate)
        );
      } else {
        promises.push(Promise.resolve(null));
      }

      if (selectedTypes.includes("topTen")) {
        promises.push(
          taskAnalyticsAPI.getTopTenChecklistData(startDate, endDate)
        );
      } else {
        promises.push(Promise.resolve(null));
      }

      if (selectedTypes.includes("siteWise")) {
        promises.push(
          taskAnalyticsAPI.getSiteWiseChecklistData(startDate, endDate)
        );
      } else {
        promises.push(Promise.resolve(null));
      }

      const [technical, nonTechnical, topTen, siteWise] = await Promise.all(
        promises
      );

      setTechnicalData(technical);
      setNonTechnicalData(nonTechnical);
      setTopTenData(topTen);
      setSiteWiseData(siteWise);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleAnalyticsSelectionChange = (selectedOptions: string[]) => {
    setSelectedAnalytics(selectedOptions);
    const dateRange = getDateRangeForComponents();
    fetchAnalyticsData(dateRange.startDate, dateRange.endDate, selectedOptions);
  };

  const handleAnalyticsFilterApply = (
    startDateStr: string,
    endDateStr: string
  ) => {
    // Handle empty dates (reset case)
    if (!startDateStr || !endDateStr) {
      // Clear all analytics data
      setTechnicalData(null);
      setNonTechnicalData(null);
      setTopTenData(null);
      setSiteWiseData(null);
      // Reset to default date range
      setAnalyticsDateRange(getDefaultDateRange());
      return;
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Convert dates to DD/MM/YYYY format for consistent storage
    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    setAnalyticsDateRange({
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    });
    fetchAnalyticsData(startDate, endDate, selectedAnalytics);
  };

  // Handle drag end for analytics chart reordering
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

  // Load analytics data when tab is selected
  // Load analytics data when tab is selected
  useEffect(() => {
    if (activeTab === "analytics") {
      // Convert DD/MM/YYYY strings to Date objects using UTC to avoid timezone issues
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split("/");
        return new Date(
          Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day))
        );
      };

      const startDate = parseDate(analyticsDateRange.startDate);
      const endDate = parseDate(analyticsDateRange.endDate);

      fetchAnalyticsData(startDate, endDate, selectedAnalytics);
    }
  }, [activeTab]);

  const handleClearSelection = () => {
    setSelectedTasks([]);
    setShowSelectionPanel(false);
  };

  // Get selected task objects with id, checklist, and status
  const selectedTaskObjects = taskData
    .filter((task) => selectedTasks.includes(task.id))
    .map((task) => ({
      id: task.id,
      checklist: task.checklist,
      status: task.status, // Include status for conditional button display
    }));

  // Task selection panel handlers
  const handleSubmitTasks = () => {
    console.log("Submit tasks clicked for", selectedTasks.length, "tasks");
    // Implement task submission logic here
    // You can add navigation to a task submission page or open a modal
    handleClearSelection();
  };

  const handleReassignTasks = () => {
    console.log("Reassign tasks clicked for", selectedTasks.length, "tasks");
    // Implement task reassignment logic here
    // You can add navigation to a reassignment page or open a modal
    handleClearSelection();
  };

  const handleRescheduleTasks = () => {
    console.log("Reschedule tasks clicked for", selectedTasks.length, "tasks");
    // Implement task rescheduling logic here
    // You can add navigation to a rescheduling page or open a modal
    handleClearSelection();
  };

  // Smart pagination rendering function (similar to AMC Dashboard)
  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            className="cursor-pointer"
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show pages 2, 3, 4 if currentPage is 1, 2, or 3
      if (currentPage <= 3) {
        for (let i = 2; i <= 4 && i < totalPages; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                className="cursor-pointer"
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        if (totalPages > 5) {
          items.push(
            <PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
      } else if (currentPage >= totalPages - 2) {
        // Show ellipsis before last 4 pages
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = totalPages - 3; i < totalPages; i++) {
          if (i > 1) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink
                  className="cursor-pointer"
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      } else {
        // Show ellipsis, currentPage-1, currentPage, currentPage+1, ellipsis
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                className="cursor-pointer"
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page if more than 1 page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages if less than or equal to 7
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => handlePageChange(i)}
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

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Header Section */}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="list"
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
          <TabsTrigger
            value="list"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <List className="w-4 h-4" />
            Task List
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <CalendarIcon className="w-4 h-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="list"
          className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
        >
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {statusCards.map((card, index) => {
              const getStatusCount = (status: string) => {
                switch (status) {
                  case "Scheduled":
                    return statusCounts.scheduled_count;
                  case "Open":
                    return statusCounts.open_count;
                  case "Work In Progress":
                    return statusCounts.wip_count;
                  case "Closed":
                    return statusCounts.closed_count;
                  case "Overdue":
                    return statusCounts.overdue_count;
                  default:
                    return 0;
                }
              };

              return (
                <div
                  key={index}
                  className={`bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow ${
                    selectedStatus === card.status
                      ? "shadow-lg transition-shadow shadow-[0px_1px_8px_rgba(45,45,45,0.05)]"
                      : ""
                  }`}
                  onClick={() => handleStatusCardClick(card.status)}
                >
                  <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                    <card.icon className="w-6 h-6 text-[#C72030]" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-[#1A1A1A]">
                      {getStatusCount(card.status)}
                    </div>
                    <div className="text-sm font-medium text-[#1A1A1A]">
                      {card.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Task Table */}
          <div className="rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading tasks...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-red-500">{error}</div>
                <Button
                  onClick={() =>
                    fetchTasks(
                      currentFilters,
                      currentPage,
                      debouncedSearchQuery
                    )
                  }
                  variant="outline"
                  className="ml-4"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <>
                {/* Debug info */}
                {console.log(
                  "Rendering table with data:",
                  taskData.length,
                  "items"
                )}
                {console.log("Search query state:", searchQuery)}{" "}
                {/* Additional debug */}
                <EnhancedTaskTable
                  data={taskData}
                  columns={[
                    {
                      key: "actions",
                      label: "Action",
                      sortable: false,
                      hideable: false,
                      draggable: false,
                    },
                    {
                      key: "id",
                      label: "ID",
                      sortable: true,
                      hideable: true,
                      draggable: true,
                    },
                    {
                      key: "checklist",
                      label: "Checklist",
                      sortable: true,
                      hideable: true,
                      draggable: true,
                    },
                    {
                      key: "type",
                      label: "Type",
                      sortable: true,
                      hideable: true,
                      draggable: true,
                    },
                    {
                      key: "schedule",
                      label: "Schedule",
                      sortable: true,
                      hideable: true,
                      draggable: true,
                    },
                    {
                      key: "assignTo",
                      label: "Assign to",
                      sortable: true,
                      hideable: true,
                      draggable: true,
                    },
                    {
                      key: "status",
                      label: "Status",
                      sortable: true,
                      hideable: true,
                      draggable: true,
                    },
                    {
                      key: "scheduleFor",
                      label: "Schedule For",
                      sortable: true,
                      hideable: true,
                      draggable: true,
                    },
                    {
                      key: "assetsServices",
                      label: "Assets/Services",
                      sortable: true,
                      hideable: true,
                      draggable: true,
                    },
                    {
                      key: "site",
                      label: "Site",
                      sortable: true,
                      hideable: true,
                      draggable: true,
                    },
                    {
                      key: "location",
                      label: "Location",
                      sortable: true,
                      hideable: true,
                      draggable: true,
                    },
                    {
                      key: "supplier",
                      label: "Supplier",
                      sortable: true,
                      hideable: true,
                      draggable: true,
                    },
                    {
                      key: "graceTime",
                      label: "Grace Time",
                      sortable: true,
                      hideable: true,
                      draggable: true,
                    },
                    {
                      key: "duration",
                      label: "Duration",
                      sortable: true,
                      hideable: true,
                      draggable: true,
                    },
                    {
                      key: "percentage",
                      label: "%",
                      sortable: true,
                      hideable: true,
                      draggable: true,
                    },
                  ]}
                  renderRow={(task) => ({
                    actions: (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewTask(task.id);
                        }}
                        className="p-2 h-8 w-8 hover:bg-accent"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    ),
                    id: task.id,
                    checklist: task.checklist,
                    type: task.type,
                    schedule: task.schedule,
                    assignTo: task.assignTo || "-",
                    status: (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600 font-medium">
                        {task.status}
                      </span>
                    ),
                    scheduleFor: task.scheduleFor,
                    assetsServices: task.assetsServices,
                    site: task.site,
                    location: (
                      <div className="max-w-xs truncate" title={task.location}>
                        {task.location}
                      </div>
                    ),
                    supplier: task.supplier || "-",
                    graceTime: task.graceTime,
                    duration: task.duration || "-",
                    percentage: task.percentage || "-",
                  })}
                  enableSearch={true}
                  enableSelection={true}
                  selectable={true}
                  enableExport={true}
                  hideTableSearch={false}
                  storageKey="scheduled-tasks-table"
                  onFilterClick={() => setShowTaskFilter(true)}
                  handleExport={() => handleDownloadTasks(selectedStatus)}
                  searchTerm={searchQuery}
                  onSearchChange={handleSearch}
                  emptyMessage="No scheduled tasks found"
                  searchPlaceholder="Search tasks by checklist..."
                  exportFileName="scheduled-tasks"
                  selectedItems={selectedTasks}
                  getItemId={(task) => task.id}
                  onSelectItem={(taskId, checked) => {
                    const newSelected = checked
                      ? [...selectedTasks, taskId]
                      : selectedTasks.filter((id) => id !== taskId);
                    setSelectedTasks(newSelected);
                    setShowSelectionPanel(newSelected.length > 0);
                  }}
                  onSelectAll={(checked) => {
                    setSelectedTasks(
                      checked ? taskData.map((task) => task.id) : []
                    );
                    setShowSelectionPanel(checked && taskData.length > 0);
                  }}
                />
              </>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
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
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Pagination Info */}
          {totalPages > 1 && (
            <div className="text-center mt-2 text-sm text-gray-600">
              Showing page {currentPage} of {totalPages} ({totalCount} total
              tasks)
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-4 sm:mt-6">
          <ScheduledTaskCalendar
            events={calendarEvents}
            onDateRangeChange={(start, end) => {
              setCalendarFilters((prev) => ({
                ...prev,
                dateFrom: start,
                dateTo: end,
              }));
            }}
            onFiltersChange={(filters) => {
              console.log("Filters changed:", filters);
              setCalendarFilters(filters);
            }}
          />
        </TabsContent>

        <TabsContent
          value="analytics"
          className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
        >
          {/* Header Section with Filter and Selector */}
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
            {/* Drag info indicator */}

            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                onClick={() => setShowAnalyticsFilter(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-gray-300"
              >
                <CalendarIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {analyticsDateRange.startDate} - {analyticsDateRange.endDate}
                </span>
                <FilterIcon className="w-4 h-4 text-gray-600" />
              </Button>
              <TaskAnalyticsSelector
                onSelectionChange={handleAnalyticsSelectionChange}
                dateRange={getDateRangeForComponents()}
              />
            </div>
          </div>

          {analyticsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading analytics...</div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={chartOrder}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {chartOrder.map((analyticsType) => {
                    if (!selectedAnalytics.includes(analyticsType)) return null;

                    if (analyticsType === "technical" && technicalData) {
                      return (
                        <SortableChartItem key="technical" id="technical">
                          <TaskAnalyticsCard
                            title="Technical Checklist"
                            data={technicalData.response}
                            type="technical"
                            dateRange={getDateRangeForComponents()}
                          />
                        </SortableChartItem>
                      );
                    }

                    if (analyticsType === "nonTechnical" && nonTechnicalData) {
                      return (
                        <SortableChartItem key="nonTechnical" id="nonTechnical">
                          <TaskAnalyticsCard
                            title="Non-Technical Checklist"
                            data={nonTechnicalData.response}
                            type="nonTechnical"
                            dateRange={getDateRangeForComponents()}
                          />
                        </SortableChartItem>
                      );
                    }

                    if (analyticsType === "topTen" && topTenData) {
                      return (
                        <SortableChartItem key="topTen" id="topTen">
                          <TaskAnalyticsCard
                            title="Top 10 Checklist Types"
                            data={topTenData.response}
                            type="topTen"
                            dateRange={getDateRangeForComponents()}
                          />
                        </SortableChartItem>
                      );
                    }

                    if (analyticsType === "siteWise" && siteWiseData) {
                      return (
                        <SortableChartItem key="siteWise" id="siteWise">
                          <TaskAnalyticsCard
                            title="Site-wise Checklist Status"
                            data={siteWiseData.response}
                            type="siteWise"
                            dateRange={getDateRangeForComponents()}
                          />
                        </SortableChartItem>
                      );
                    }

                    return null;
                  })}

                  {/* No selection message */}
                  {selectedAnalytics.length === 0 && (
                    <div className="col-span-2 flex items-center justify-center py-12">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No analytics selected. Please select at least one
                          report to view.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </TabsContent>
      </Tabs>

      {/* Task Selection Panel */}
      {showSelectionPanel && selectedTasks.length > 0 && (
        <TaskSelectionPanel
          selectedCount={selectedTasks.length}
          selectedTasks={selectedTaskObjects}
          onSubmit={handleSubmitTasks}
          onReassign={handleReassignTasks}
          onReschedule={handleRescheduleTasks}
          onClearSelection={handleClearSelection}
          onRefreshData={() =>
            fetchTasks(
              currentFilters,
              currentPage,
              debouncedSearchQuery,
              selectedStatus
            )
          }
        />
      )}

      {/* Task Filter Dialog */}
      <TaskFilterDialog
        isOpen={showTaskFilter}
        onClose={() => setShowTaskFilter(false)}
        onApply={handleApplyFilters}
        showAll={showAll}
        onShowAllChange={handleShowAllChange}
      />

      {/* Advanced Filter Dialog - Keep existing for backward compatibility */}
      <TaskAdvancedFilterDialog
        open={showAdvancedFilter}
        onOpenChange={setShowAdvancedFilter}
        onApply={handleAdvancedFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        searchTaskId={searchTaskId}
        searchChecklist={searchChecklist}
      />

      <TaskAnalyticsFilterDialog
        isOpen={showAnalyticsFilter}
        onClose={() => setShowAnalyticsFilter(false)}
        onApplyFilters={handleAnalyticsFilterApply}
        currentStartDate={(() => {
          // Convert DD/MM/YYYY to YYYY-MM-DD
          const [day, month, year] = analyticsDateRange.startDate.split("/");
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        })()}
        currentEndDate={(() => {
          // Convert DD/MM/YYYY to YYYY-MM-DD
          const [day, month, year] = analyticsDateRange.endDate.split("/");
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        })()}
      />
    </div>
  );
};
