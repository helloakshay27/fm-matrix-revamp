import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, Play, CheckCircle, XCircle, Plus, Filter as FilterIcon, Download, Calendar as CalendarIcon, List, Settings, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    icon: Settings
  },
  {
    title: 'Open Tasks',
    count: 174,
    icon: AlertCircle
  },
  {
    title: 'In Progress',
    count: 0,
    icon: Play
  },
  {
    title: 'Closed Tasks',
    count: 0,
    icon: CheckCircle
  },
  {
    title: 'Overdue Tasks',
    count: 907,
    icon: XCircle
  }
];

export const ScheduledTaskDashboard = () => {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState('01/07/2025');
  const [dateTo, setDateTo] = useState('31/07/2025');
  const [searchTaskId, setSearchTaskId] = useState('');
  const [searchChecklist, setSearchChecklist] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showSelectionPanel, setShowSelectionPanel] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [taskData, setTaskData] = useState<TaskRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      const apiUrl = getFullUrl('/all_tasks_listing.json?show_all=true');
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
      
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again.');
      // Set empty data on error
      setTaskData([]);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

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
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
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
        </TabsList>

        <TabsContent value="list" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {statusCards.map((card, index) => (
              <div key={index} className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee]">
                <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <card.icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                    {card.count}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">{card.title}</div>
                </div>
              </div>
            ))}
          </div>

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
                  onClick={fetchTasks} 
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
              onFilterClick={() => setShowAdvancedFilter(true)}
              handleExport={handleExport}

              emptyMessage="No scheduled tasks found"
              searchPlaceholder="Search tasks..."
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
      </Tabs>

      {/* Selection Panel */}
      {showSelectionPanel && (
        <SelectionPanel
          actions={selectionActions}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* Advanced Filter Dialog */}
      <TaskAdvancedFilterDialog
        open={showAdvancedFilter}
        onOpenChange={setShowAdvancedFilter}
        onApply={handleAdvancedFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        searchTaskId={searchTaskId}
        searchChecklist={searchChecklist}
      />
    </div>
  );
};
