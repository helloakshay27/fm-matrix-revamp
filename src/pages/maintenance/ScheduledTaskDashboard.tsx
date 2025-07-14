
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, Play, CheckCircle, XCircle } from 'lucide-react';
import { TaskAdvancedFilterDialog } from '@/components/TaskAdvancedFilterDialog';
import { useNavigate } from 'react-router-dom';
import { StatusCard } from '@/components/maintenance/StatusCard';
import { TaskTable, columns } from '@/components/maintenance/TaskTable';
import { CalendarView } from '@/components/maintenance/CalendarView';
import { FilterSection } from '@/components/maintenance/FilterSection';
import { TableControls } from '@/components/maintenance/TableControls';
import { taskData } from '@/data/taskData';

const statusCards = [
  { 
    title: 'Scheduled', 
    count: 1555, 
    color: 'bg-blue-50', 
    textColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    icon: Clock
  },
  { 
    title: 'Open', 
    count: 174, 
    color: 'bg-green-50', 
    textColor: 'text-green-600',
    iconBg: 'bg-green-100',
    icon: AlertCircle
  },
  { 
    title: 'In Progress', 
    count: 0, 
    color: 'bg-yellow-50', 
    textColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    icon: Play
  },
  { 
    title: 'Closed', 
    count: 0, 
    color: 'bg-gray-50', 
    textColor: 'text-gray-600',
    iconBg: 'bg-gray-100',
    icon: CheckCircle
  },
  { 
    title: 'Overdue', 
    count: 907, 
    color: 'bg-red-50', 
    textColor: 'text-red-600',
    iconBg: 'bg-red-100',
    icon: XCircle
  }
];

export const ScheduledTaskDashboard = () => {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState('01/07/2025');
  const [dateTo, setDateTo] = useState('31/07/2025');
  const [searchTaskId, setSearchTaskId] = useState('');
  const [searchChecklist, setSearchChecklist] = useState('');
  const [activeTab, setActiveTab] = useState('List');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Table control states
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.filter(col => col.key !== 'actions').map(col => col.key).concat(['actions'])
  );
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewTask = (taskId: string) => {
    navigate(`/task-details/${taskId}`);
  };

  const handleAdvancedFilter = (filters: any) => {
    console.log('Advanced filters applied:', filters);
  };

  // Table control handlers
  const handleColumnVisibilityChange = (columnKey: string, visible: boolean) => {
    if (visible) {
      setVisibleColumns([...visibleColumns, columnKey]);
    } else {
      setVisibleColumns(visibleColumns.filter(key => key !== columnKey));
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks([...selectedTasks, taskId]);
    } else {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(taskData.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedTasks([]);
  };

  const handleExport = () => {
    // Export logic
    console.log('Exporting tasks...');
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on ${selectedTasks.length} tasks`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Scheduled Task</span>
            <span>&gt;</span>
            <span>Scheduled Task List</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground uppercase">SCHEDULED TASK</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button 
            variant={activeTab === 'List' ? 'default' : 'ghost'} 
            className={activeTab === 'List' ? 'border-b-2 border-red-500 text-red-500 bg-white' : 'text-gray-600'}
            onClick={() => setActiveTab('List')}
          >
            List
          </Button>
          <Button 
            variant={activeTab === 'Calendar' ? 'default' : 'ghost'} 
            className={activeTab === 'Calendar' ? 'border-b-2 border-red-500 text-red-500 bg-white' : 'text-gray-600'}
            onClick={() => setActiveTab('Calendar')}
          >
            Calendar
          </Button>
        </div>

        {activeTab === 'List' && (
          <>
            <FilterSection
              dateFrom={dateFrom}
              dateTo={dateTo}
              searchTaskId={searchTaskId}
              searchChecklist={searchChecklist}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
              onSearchTaskIdChange={setSearchTaskId}
              onSearchChecklistChange={setSearchChecklist}
              onShowAdvancedFilter={() => setShowAdvancedFilter(true)}
            />

            {/* Status Cards */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              {statusCards.map((card, index) => (
                <StatusCard key={index} {...card} />
              ))}
            </div>

            {/* Table Controls - External to table */}
            <TableControls
              columns={columns}
              visibleColumns={visibleColumns}
              onColumnVisibilityChange={handleColumnVisibilityChange}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSortChange={handleSort}
              onClearSort={() => {
                setSortColumn(null);
                setSortDirection(null);
              }}
              selectedCount={selectedTasks.length}
              totalCount={taskData.length}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onExport={handleExport}
              onBulkAction={handleBulkAction}
            />

            {/* Task Table */}
            <TaskTable 
              tasks={taskData} 
              onViewTask={handleViewTask}
              visibleColumns={visibleColumns}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              selectedTasks={selectedTasks}
              onSelectTask={handleSelectTask}
              onSelectAll={handleSelectAll}
              searchTerm={searchTerm}
            />
          </>
        )}

        {activeTab === 'Calendar' && (
          <CalendarView
            dateFrom={dateFrom}
            dateTo={dateTo}
            selectedDate={selectedDate}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onSelectedDateChange={setSelectedDate}
          />
        )}

        {/* Advanced Filter Dialog */}
        <TaskAdvancedFilterDialog
          open={showAdvancedFilter}
          onOpenChange={setShowAdvancedFilter}
          onApply={handleAdvancedFilter}
        />
      </div>
    </div>
  );
};
