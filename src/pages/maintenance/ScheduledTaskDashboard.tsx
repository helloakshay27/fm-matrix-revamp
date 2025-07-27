import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, Play, CheckCircle, XCircle, Plus, Filter as FilterIcon, Download, Calendar as CalendarIcon, List, Settings, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebounce } from '@/hooks/useDebounce';
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
import { TaskAdvancedFilterDialog } from '@/components/TaskAdvancedFilterDialog';
import { useNavigate } from 'react-router-dom';
import { StatusCard } from '@/components/maintenance/StatusCard';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { ScheduledTaskCalendar } from '@/components/maintenance/ScheduledTaskCalendar';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { calendarService, CalendarEvent } from '@/services/calendarService';
import { getToken } from '@/utils/auth';
import { getFullUrl } from '@/config/apiConfig';
import { TaskFilterDialog, TaskFilters } from '@/components/TaskFilterDialog';
import { taskService } from '@/services/taskService';
import { taskAnalyticsAPI, TechnicalChecklistResponse, NonTechnicalChecklistResponse, TopTenChecklistResponse, SiteWiseChecklistResponse } from '@/services/taskAnalyticsAPI';
import { TaskAnalyticsCard } from '@/components/TaskAnalyticsCard';
import { TaskAnalyticsFilterDialog } from '@/components/TaskAnalyticsFilterDialog';
import { TaskAnalyticsSelector } from '@/components/TaskAnalyticsSelector';
import { BarChart3 } from 'lucide-react';


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
  id: number;
  checklist: string;
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
    title: 'Scheduled Tasks',
    count: 1555,
    icon: Settings,
    status: 'Scheduled'
  },
  {
    title: 'Open Tasks',
    count: 174,
    icon: AlertCircle,
    status: 'Open'
  },
  {
    title: 'In Progress',
    count: 0,
    icon: Play,
    status: 'Work In Progress'
  },
  {
    title: 'Closed Tasks',
    count: 0,
    icon: CheckCircle,
    status: 'Closed'
  },
  {
    title: 'Overdue Tasks',
    count: 907,
    icon: XCircle,
    status: 'Overdue'
  }
];

export const ScheduledTaskDashboard = () => {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState('01/07/2025');
  const [dateTo, setDateTo] = useState('31/07/2025');
  const [searchTaskId, setSearchTaskId] = useState('');
  const [searchChecklist, setSearchChecklist] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 800);
  const [activeTab, setActiveTab] = useState('list');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showSelectionPanel, setShowSelectionPanel] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [taskData, setTaskData] = useState<TaskRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTaskFilter, setShowTaskFilter] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<TaskFilters>({});

  // Analytics states
  const [showAnalyticsFilter, setShowAnalyticsFilter] = useState(false);
  const [analyticsDateRange, setAnalyticsDateRange] = useState({
    startDate: new Date(new Date().getFullYear() - 1, 0, 1),
    endDate: new Date()
  });
  const [technicalData, setTechnicalData] = useState<TechnicalChecklistResponse | null>(null);
  const [nonTechnicalData, setNonTechnicalData] = useState<NonTechnicalChecklistResponse | null>(null);
  const [topTenData, setTopTenData] = useState<TopTenChecklistResponse | null>(null);
  const [siteWiseData, setSiteWiseData] = useState<SiteWiseChecklistResponse | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [selectedAnalytics, setSelectedAnalytics] = useState<string[]>(['technical', 'nonTechnical', 'topTen', 'siteWise']);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showAll, setShowAll] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [statusCounts, setStatusCounts] = useState({
    scheduled_count: 0,
    open_count: 0,
    wip_count: 0,
    closed_count: 0,
    overdue_count: 0
  });

  // Transform API data to TaskRecord format
  const transformApiDataToTaskRecord = (apiData: ApiTaskOccurrence[]): TaskRecord[] => {
    return apiData.map(task => ({
      id: task.id.toString(),
      checklist: task.checklist,
      type: task.schedule_type,
      schedule: task.start_date,
      assignTo: task.assigned_to_name,
      status: task.task_status === 'Scheduled' ? 'Open' : task.task_status,
      scheduleFor: 'Service', // Default value as mentioned
      assetsServices: task.asset,
      site: task.site_name,
      location: task.asset_path,
      supplier: '', // Not available in API
      graceTime: task.grace_time,
      duration: '', // Not available in API
      percentage: '', // Not available in API
      active: task.active !== false
    }));
  };

  // Fetch tasks with filters, pagination, and search
  const fetchTasks = async (filters: TaskFilters = {}, page: number = 1, searchTerm: string = '', status: string | null = null) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();

      // Build query parameters from filters and pagination
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());

      if (filters.dateFrom) queryParams.append('q[start_date_gteq]', filters.dateFrom);
      if (filters.dateTo) queryParams.append('q[start_date_lteq]', filters.dateTo);
      if (filters.checklist) queryParams.append('q[custom_form_form_name_cont]', filters.checklist);
      if (filters.scheduleType) queryParams.append('sch_type', filters.scheduleType);
      if (filters.type) queryParams.append('s[custom_form_schedule_type_eq]', filters.type);
      if (filters.assetGroupId) queryParams.append('q[asset_pms_asset_group_id_eq]', filters.assetGroupId);
      if (filters.assetSubGroupId) queryParams.append('q[asset_pms_asset_sub_group_id_eq]', filters.assetSubGroupId);
      if (filters.assignedTo) queryParams.append('q[pms_task_assignments_assigned_to_id_eq]', filters.assignedTo);
      if (filters.supplierId) queryParams.append('q[custom_form_supplier_id_eq]', filters.supplierId);
      if (filters.taskId) queryParams.append('q[id_eq]', filters.taskId);

      // Add status filter
      if (status) {
        queryParams.append('q[task_status_eq]', status);
      }

      // Add general search functionality for checklist and asset
      if (searchTerm) {
        queryParams.append('q[checklist_or_asset_cont]', searchTerm);
      }

      const apiUrl = getFullUrl(`/all_tasks_listing.json?${queryParams.toString()}`);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiTaskResponse = await response.json();
      const transformedData = transformApiDataToTaskRecord(data.asset_task_occurrences);
      setTaskData(transformedData);

      // Update status counts
      setStatusCounts({
        scheduled_count: data.scheduled_count || 0,
        open_count: data.open_count || 0,
        wip_count: data.wip_count || 0,
        closed_count: data.closed_count || 0,
        overdue_count: data.overdue_count || 0
      });

      // Update pagination state
      setCurrentPage(data.current_page || 1);
      setTotalPages(data.pages || 1);
      setTotalCount(data.asset_task_occurrences?.length || 0);

    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again.');
      // Set empty data on error
      setTaskData([]);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on component mount and when filters change
  useEffect(() => {
    fetchTasks(currentFilters, currentPage, debouncedSearchQuery, selectedStatus);
  }, [currentFilters, showAll, debouncedSearchQuery, selectedStatus]);

  // Handle filter application
  const handleApplyFilters = (filters: TaskFilters) => {
    setCurrentFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
    console.log('Applied filters:', filters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTasks(currentFilters, page, debouncedSearchQuery, selectedStatus);
  };

  // Handle show all toggle
  const handleShowAllChange = (checked: boolean) => {
    setShowAll(checked);
    setCurrentPage(1); // Reset to first page when show_all changes
  };

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle status card click
  const handleStatusCardClick = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page when filtering by status
  };

  // Load calendar events
  useEffect(() => {
    const loadCalendarEvents = async () => {
      try {
        const events = await calendarService.fetchCalendarEvents({
          start_date: dateFrom,
          end_date: dateTo
        });
        setCalendarEvents(events);
      } catch (error) {
        console.error('Failed to load calendar events:', error);
        // Use sample data as fallback
        setCalendarEvents([
          {
            id: 14482120,
            title: "PPM - LIFT LOBBY CLEANING",
            start: "2025-07-21 07:00:00",
            details_url: "/pms/asset_task_occurrences/14482120/asset_task_details",
            color: "#fdbb0b",
            status: "Scheduled",
            custom_form: {
              name: "LIFT LOBBY CLEANING",
              schedule_type: "PPM"
            },
            task: {
              id: 22099,
              task_type: null
            },
            schedule_task: {
              building: "Test QA",
              wing: null,
              floor: null,
              area: null,
              room: null
            }
          }
        ]);
      }
    };

    if (activeTab === 'calendar') {
      loadCalendarEvents();
    }
  }, [activeTab, dateFrom, dateTo]);

  const handleViewTask = (taskId: string) => {
    navigate(`/task-details/${taskId}`);
  };

  const handleAdvancedFilter = (filters: any) => {
    setDateFrom(filters.dateFrom || dateFrom);
    setDateTo(filters.dateTo || dateTo);
    setSearchTaskId(filters.searchTaskId || '');
    setSearchChecklist(filters.searchChecklist || '');
  };

  const handleAddTask = () => {
    navigate('/maintenance/task/add');
  };

  const handleExport = async () => {
    try {
      // Implementation for exporting tasks
      console.log('Exporting tasks...');
    } catch (error) {
      console.error('Failed to export tasks:', error);
    }
  };

  const downloadTaskExport = async () => {
    try {
      await taskService.downloadTaskExport();
    } catch (error) {
      console.error('Error downloading task export:', error);
      // You might want to show a toast or alert here
    }
  };

  // Analytics functions
  const fetchAnalyticsData = async (startDate: Date, endDate: Date, selectedTypes: string[] = selectedAnalytics) => {
    setAnalyticsLoading(true);
    try {
      const promises: Promise<any>[] = [];
      
      if (selectedTypes.includes('technical')) {
        promises.push(taskAnalyticsAPI.getTechnicalChecklistData(startDate, endDate));
      } else {
        promises.push(Promise.resolve(null));
      }
      
      if (selectedTypes.includes('nonTechnical')) {
        promises.push(taskAnalyticsAPI.getNonTechnicalChecklistData(startDate, endDate));
      } else {
        promises.push(Promise.resolve(null));
      }
      
      if (selectedTypes.includes('topTen')) {
        promises.push(taskAnalyticsAPI.getTopTenChecklistData(startDate, endDate));
      } else {
        promises.push(Promise.resolve(null));
      }
      
      if (selectedTypes.includes('siteWise')) {
        promises.push(taskAnalyticsAPI.getSiteWiseChecklistData(startDate, endDate));
      } else {
        promises.push(Promise.resolve(null));
      }

      const [technical, nonTechnical, topTen, siteWise] = await Promise.all(promises);

      setTechnicalData(technical);
      setNonTechnicalData(nonTechnical);
      setTopTenData(topTen);
      setSiteWiseData(siteWise);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleAnalyticsSelectionChange = (selectedOptions: string[]) => {
    setSelectedAnalytics(selectedOptions);
    fetchAnalyticsData(analyticsDateRange.startDate, analyticsDateRange.endDate, selectedOptions);
  };

  const handleAnalyticsFilterApply = (startDateStr: string, endDateStr: string) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    setAnalyticsDateRange({ startDate, endDate });
    fetchAnalyticsData(startDate, endDate, selectedAnalytics);
  };

  // Load analytics data when tab is selected
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalyticsData(analyticsDateRange.startDate, analyticsDateRange.endDate, selectedAnalytics);
    }
  }, [activeTab]);

  const selectionActions = [
    { label: 'Assign Task', icon: Play },
    { label: 'Change Status', icon: CheckCircle },
    { label: 'Export Selected', icon: Download }
  ];

  const handleClearSelection = () => {
    setSelectedTasks([]);
    setShowSelectionPanel(false);
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="list" className="w-full">
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

        <TabsContent value="list" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {statusCards.map((card, index) => {
              const getStatusCount = (status: string) => {
                switch (status) {
                  case 'Scheduled': return statusCounts.scheduled_count;
                  case 'Open': return statusCounts.open_count;
                  case 'Work In Progress': return statusCounts.wip_count;
                  case 'Closed': return statusCounts.closed_count;
                  case 'Overdue': return statusCounts.overdue_count;
                  default: return 0;
                }
              };

              return (
                <div 
                  key={index} 
                  className={`p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 cursor-pointer transition-all duration-200 ${
                    selectedStatus === card.status 
                      ? 'bg-[#f6f4ee] hover:bg-[#e6e2da]'
                      : 'bg-[#f6f4ee] hover:bg-[#e6e2da]'
                  }`}
                  onClick={() => handleStatusCardClick(card.status)}
                >
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 ${
                    selectedStatus === card.status ? 'bg-[#C4B89D54]' : 'bg-[#C4B89D54]'
                  }`}>
                    <card.icon 
                      className="w-4 h-4 sm:w-6 sm:h-6" 
                      style={{ color: selectedStatus === card.status ?  '#C72030': '#C72030' }} 
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                      {getStatusCount(card.status)}
                    </div>
                    <div className={`text-xs sm:text-sm font-medium leading-tight ${
                      selectedStatus === card.status ? 'text-muted-foreground': 'text-muted-foreground'
                    }`}>
                      {card.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clear Filter Button */}
          {selectedStatus && (
            <div className="flex justify-start">
              <Button 
                variant="outline" 
                onClick={() => setSelectedStatus(null)}
                className="bg-white border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
              >
                Clear Filter
              </Button>
            </div>
          )}

          {/* Task Table */}
          <div className="bg-white rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading tasks...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-red-500">{error}</div>
                <Button
                  onClick={() => fetchTasks(currentFilters, currentPage, debouncedSearchQuery)}
                  variant="outline"
                  className="ml-4"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <EnhancedTable
                data={taskData}
                columns={[
                  { key: 'actions', label: 'Action', sortable: false, hideable: false, draggable: false },
                  { key: 'id', label: 'ID', sortable: true, hideable: true, draggable: true },
                  { key: 'checklist', label: 'Checklist', sortable: true, hideable: true, draggable: true },
                  { key: 'type', label: 'Type', sortable: true, hideable: true, draggable: true },
                  { key: 'schedule', label: 'Schedule', sortable: true, hideable: true, draggable: true },
                  { key: 'assignTo', label: 'Assign to', sortable: true, hideable: true, draggable: true },
                  { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
                  { key: 'scheduleFor', label: 'Schedule For', sortable: true, hideable: true, draggable: true },
                  { key: 'assetsServices', label: 'Assets/Services', sortable: true, hideable: true, draggable: true },
                  { key: 'site', label: 'Site', sortable: true, hideable: true, draggable: true },
                  { key: 'location', label: 'Location', sortable: true, hideable: true, draggable: true },
                  { key: 'supplier', label: 'Supplier', sortable: true, hideable: true, draggable: true },
                  { key: 'graceTime', label: 'Grace Time', sortable: true, hideable: true, draggable: true },
                  { key: 'duration', label: 'Duration', sortable: true, hideable: true, draggable: true },
                  { key: 'percentage', label: '%', sortable: true, hideable: true, draggable: true }
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
                  assignTo: task.assignTo || '-',
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
                  supplier: task.supplier || '-',
                  graceTime: task.graceTime,
                  duration: task.duration || '-',
                  percentage: task.percentage || '-'
                })}
                enableSearch={true}
                enableSelection={true}
                enableExport={true}
                storageKey="scheduled-tasks-table"
                onFilterClick={() => setShowTaskFilter(true)}
                handleExport={() => downloadTaskExport()}
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
                    : selectedTasks.filter(id => id !== taskId);
                  setSelectedTasks(newSelected);
                  setShowSelectionPanel(newSelected.length > 0);
                }}
                onSelectAll={(checked) => {
                  setSelectedTasks(checked ? taskData.map(task => task.id) : []);
                  setShowSelectionPanel(checked && taskData.length > 0);
                }}
              />
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: Math.min(totalPages, 10) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {totalPages > 10 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="text-center mt-2 text-sm text-gray-600">
                Showing page {currentPage} of {totalPages} ({totalCount} total tasks)
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-4 sm:mt-6">
          <ScheduledTaskCalendar
            events={calendarEvents}
            onDateRangeChange={(start, end) => {
              setDateFrom(start);
              setDateTo(end);
            }}
            onFiltersChange={(filters) => {
              console.log('Filters changed:', filters);
            }}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Header Section with Filter and Selector */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">Task Analytics</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Analyze task performance and checklist completion across different categories
              </p>
            </div>
            <div className="flex gap-2">
              <TaskAnalyticsSelector
                onSelectionChange={handleAnalyticsSelectionChange}
                dateRange={analyticsDateRange}
              />
              <Button
                variant="outline"
                onClick={() => setShowAnalyticsFilter(true)}
                className="flex items-center gap-2"
              >
                <FilterIcon className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </div>

          {analyticsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading analytics...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Technical Checklist */}
              {selectedAnalytics.includes('technical') && technicalData && (
                <TaskAnalyticsCard
                  title="Technical Checklist"
                  data={technicalData.response}
                  type="technical"
                />
              )}

              {/* Non-Technical Checklist */}
              {selectedAnalytics.includes('nonTechnical') && nonTechnicalData && (
                <TaskAnalyticsCard
                  title="Non-Technical Checklist"
                  data={nonTechnicalData.response}
                  type="nonTechnical"
                />
              )}

              {/* Top Ten Checklist */}
              {selectedAnalytics.includes('topTen') && topTenData && (
                <TaskAnalyticsCard
                  title="Top 10 Checklist Types"
                  data={topTenData.response}
                  type="topTen"
                />
              )}

              {/* Site Wise Checklist */}
              {selectedAnalytics.includes('siteWise') && siteWiseData && (
                <TaskAnalyticsCard
                  title="Site-wise Checklist Status"
                  data={siteWiseData.response}
                  type="siteWise"
                />
              )}
              
              {/* No selection message */}
              {selectedAnalytics.length === 0 && (
                <div className="col-span-2 flex items-center justify-center py-12">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No analytics selected. Please select at least one report to view.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Selection Panel */}
      {showSelectionPanel && (
        <SelectionPanel
          actions={selectionActions}
          onClearSelection={handleClearSelection}
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
      />
    </div>
  );
};
