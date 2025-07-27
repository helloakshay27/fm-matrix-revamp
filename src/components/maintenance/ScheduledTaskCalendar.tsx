import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent } from '@/services/calendarService';
import { CalendarFilterModal, CalendarFilters } from '@/components/CalendarFilterModal';
const localizer = momentLocalizer(moment);
interface ScheduledTaskCalendarProps {
  events?: CalendarEvent[];
  onDateRangeChange?: (start: string, end: string) => void;
  onFiltersChange?: (filters: any) => void;
}
export const ScheduledTaskCalendar: React.FC<ScheduledTaskCalendarProps> = ({
  events = [],
  onDateRangeChange,
  onFiltersChange
}) => {
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda' | 'work_week' | 'year'>('month');
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<CalendarFilters>({
    dateFrom: '01/07/2025',
    dateTo: '31/07/2025',
    formName: '',
    scheduleType: ''
  });

  // Convert API events to calendar events
  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(moment(event.start).add(1, 'hour').toISOString()),
      // Default 1 hour duration
      color: event.color,
      status: event.status,
      resource: event
    }));
  }, [events]);
  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };
  const handleViewChange = (newView: any) => {
    setView(newView);
  };
  const handleApplyFilters = async (filters: CalendarFilters) => {
    setActiveFilters(filters);
    if (onDateRangeChange) {
      onDateRangeChange(filters.dateFrom, filters.dateTo);
    }
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };

  const handleExport = () => {
    console.log('Export calendar data');
  };

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).filter(value => 
    value !== '' && value !== '01/07/2025' && value !== '31/07/2025'
  ).length;

  // Handle event click to navigate to task detail
  const handleSelectEvent = (event: any) => {
    const taskId = event.resource?.task?.id || event.id;
    if (taskId) {
      navigate(`/task-details/${taskId}`);
    }
  };

  // Custom event style
  const eventStyleGetter = (event: any) => {
    const backgroundColor = event.color || '#fdbb0b';
    return {
      style: {
        backgroundColor,
        borderColor: backgroundColor,
        color: '#000',
        fontSize: '11px',
        padding: '2px 4px',
        borderRadius: '2px',
        border: 'none',
        cursor: 'pointer'
      }
    };
  };

  // Custom toolbar
  const CustomToolbar = ({
    label,
    onNavigate,
    onView
  }: any) => <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onNavigate('PREV')} className="h-8 w-8 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate('NEXT')} className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      
      </div>
      
      <h2 className="text-xl font-semibold">{label}</h2>
      
      <div className="flex items-center gap-2">
        <Button variant={view === 'month' ? 'default' : 'outline'} size="sm" onClick={() => onView('month')} className="px-3 py-1 h-8">
          month
        </Button>
        <Button variant={view === 'week' ? 'default' : 'outline'} size="sm" onClick={() => onView('week')} className="px-3 py-1 h-8">
          week
        </Button>
        <Button variant={view === 'work_week' ? 'default' : 'outline'} size="sm" onClick={() => onView('work_week')} className="px-3 py-1 h-8">
          52-week
        </Button>
        <Button variant={view === 'day' ? 'default' : 'outline'} size="sm" onClick={() => onView('day')} className="px-3 py-1 h-8">
          Today
        </Button>
       
        <Button variant={view === 'agenda' ? 'default' : 'outline'} size="sm" onClick={() => onView('agenda')} className="px-3 py-1 h-8">
          list
        </Button>
      </div>
    </div>;
  return <div className="space-y-6">
      {/* Breadcrumb */}
      

      {/* Title */}
      

      {/* Tab Navigation */}
      

      {/* Filter Button */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setIsFilterModalOpen(true)}
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 h-10"
        >
          <Filter className="h-4 w-4" />
          Filter
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-1 text-xs bg-purple-600 text-white rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
        
        <Button 
          onClick={handleExport} 
          variant="outline" 
          className="px-4 py-2 h-10"
        >
          Export
        </Button>
      </div>

      {/* Legends */}
      <div className="flex items-center gap-6 text-sm">
        <span className="font-medium">Legends</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded"></div>
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-pink-500 rounded"></div>
          <span>Open</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Closed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Overdue</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white border rounded-lg p-4" style={{
      height: '600px'
    }}>
        <Calendar 
          localizer={localizer} 
          events={calendarEvents} 
          startAccessor="start" 
          endAccessor="end" 
          style={{ height: '100%' }} 
          view={view} 
          onView={handleViewChange} 
          date={date} 
          onNavigate={handleNavigate} 
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter} 
          components={{ toolbar: CustomToolbar }}
          views={[Views.MONTH, Views.WEEK, Views.WORK_WEEK, Views.DAY, Views.AGENDA]}
          step={60} 
          showMultiDayTimes 
          formats={{
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }: any) => 
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
            agendaTimeFormat: 'HH:mm',
            agendaTimeRangeFormat: ({ start, end }: any) => 
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`
          }} 
        />
      </div>

      {/* Filter Modal */}
      <CalendarFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>;
};