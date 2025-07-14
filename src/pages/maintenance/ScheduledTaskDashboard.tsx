
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, Play, CheckCircle, XCircle } from 'lucide-react';
import { TaskAdvancedFilterDialog } from '@/components/TaskAdvancedFilterDialog';
import { useNavigate } from 'react-router-dom';
import { StatusCard } from '@/components/maintenance/StatusCard';
import { TaskTable } from '@/components/maintenance/TaskTable';
import { CalendarView } from '@/components/maintenance/CalendarView';
import { FilterSection } from '@/components/maintenance/FilterSection';
import { taskData } from '@/data/taskData';

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
  const [activeTab, setActiveTab] = useState('List');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleViewTask = (taskId: string) => {
    navigate(`/task-details/${taskId}`);
  };

  const handleAdvancedFilter = (filters: any) => {
    console.log('Advanced filters applied:', filters);
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
              {statusCards.map((card, index) => (
                <StatusCard key={index} {...card} />
              ))}
            </div>

            {/* Task Table */}
            <TaskTable tasks={taskData} onViewTask={handleViewTask} />
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
