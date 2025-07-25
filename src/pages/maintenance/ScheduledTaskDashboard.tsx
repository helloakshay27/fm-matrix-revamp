
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, Play, CheckCircle, XCircle, Plus, Filter as FilterIcon, Download, Calendar as CalendarIcon, List } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskAdvancedFilterDialog } from '@/components/TaskAdvancedFilterDialog';
import { useNavigate } from 'react-router-dom';
import { StatusCard } from '@/components/maintenance/StatusCard';
import { TaskTable } from '@/components/maintenance/TaskTable';
import { ScheduledTaskCalendar } from '@/components/maintenance/ScheduledTaskCalendar';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { taskData } from '@/data/taskData';
import { calendarService, CalendarEvent } from '@/services/calendarService';

const statusCards = [
  { 
    title: 'Scheduled', 
    count: 1555, 
    color: 'bg-rose-50', 
    textColor: 'text-red-600',
    iconBg: 'bg-rose-100',
    icon: Clock
  },
  { 
    title: 'Open', 
    count: 174, 
    color: 'bg-rose-50', 
    textColor: 'text-red-600',
    iconBg: 'bg-rose-100',
    icon: AlertCircle
  },
  { 
    title: 'In Progress', 
    count: 0, 
    color: 'bg-rose-50', 
    textColor: 'text-red-600',
    iconBg: 'bg-rose-100',
    icon: Play
  },
  { 
    title: 'Closed', 
    count: 0, 
    color: 'bg-rose-50', 
    textColor: 'text-red-600',
    iconBg: 'bg-rose-100',
    icon: CheckCircle
  },
  { 
    title: 'Overdue', 
    count: 907, 
    color: 'bg-rose-50', 
    textColor: 'text-red-600',
    iconBg: 'bg-rose-100',
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
    console.log('Advanced filters applied:', filters);
    setDateFrom(filters.dateFrom || dateFrom);
    setDateTo(filters.dateTo || dateTo);
    setSearchTaskId(filters.searchTaskId || '');
    setSearchChecklist(filters.searchChecklist || '');
  };

  const handleAddTask = () => {
    console.log('Add new task');
  };

  const handleExport = () => {
    console.log('Export tasks');
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
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground uppercase">SCHEDULED TASK</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-fit grid-cols-2 bg-muted/50">
              <TabsTrigger value="list" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary">
                <List className="w-4 h-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary">
                <CalendarIcon className="w-4 h-4" />
                Calendar
              </TabsTrigger>
            </TabsList>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleAddTask}
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
              <Button 
                onClick={() => setShowAdvancedFilter(true)}
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10 flex items-center gap-2"
              >
                <FilterIcon className="w-4 h-4" />
                Filter
              </Button>
              <Button 
                onClick={handleExport}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          <TabsContent value="list" className="mt-0">
            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
              {statusCards.map((card, index) => (
                <StatusCard key={index} {...card} />
              ))}
            </div>

            {/* Task Table */}
            <TaskTable 
              tasks={taskData} 
              onViewTask={handleViewTask}
              selectedTasks={selectedTasks}
              onTaskSelection={(taskIds) => {
                setSelectedTasks(taskIds);
                setShowSelectionPanel(taskIds.length > 0);
              }}
            />
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
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
    </div>
  );
};
