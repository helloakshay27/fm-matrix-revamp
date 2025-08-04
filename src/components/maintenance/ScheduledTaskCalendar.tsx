import React, { useState, useMemo, useEffect } from 'react';
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
  const [date, setDate] = useState(new Date());
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Helper function to get default date range (today to one week ago)
  const getDefaultDateRange = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    
    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    
    return {
      dateFrom: formatDate(oneWeekAgo),
      dateTo: formatDate(today)
    };
  };
  
  const [activeFilters, setActiveFilters] = useState<CalendarFilters>(() => {
    const defaultRange = getDefaultDateRange();
    return {
      dateFrom: defaultRange.dateFrom,
      dateTo: defaultRange.dateTo,
      's[task_custom_form_schedule_type_eq]': '',
      's[task_task_of_eq]': ''
    };
  });
  const navigate = useNavigate();

  // Apply default filters on component mount
  useEffect(() => {
    const defaultRange = getDefaultDateRange();
    onDateRangeChange?.(defaultRange.dateFrom, defaultRange.dateTo);
    onFiltersChange?.(activeFilters);
  }, []); // Empty dependency array to run only on mount

  const get52WeeksRange = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 52 * 7);
    return { start: startDate, end: today };
  };

  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(moment(event.start).add(1, 'hour').toISOString()),
      color: event.color,
      status: event.status,
      resource: event
    }));
  }, [events]);

  const handleNavigate = (action: 'NEXT' | 'PREV') => {
    const newDate = moment(date)[action === 'NEXT' ? 'add' : 'subtract'](1, view === 'year' ? 'year' : 'month').toDate();
    setDate(newDate);
  };

  const handleViewChange = (newView: any) => {
    setView(newView);

    if (newView === 'work_week') {
      const { start, end } = get52WeeksRange();
      const startFormatted = moment(start).format('DD/MM/YYYY');
      const endFormatted = moment(end).format('DD/MM/YYYY');
      const filters = { ...activeFilters, dateFrom: startFormatted, dateTo: endFormatted };
      setActiveFilters(filters);
      onDateRangeChange?.(startFormatted, endFormatted);
      onFiltersChange?.(filters);
    }

    if (newView === 'year') {
      const startOfYear = moment().startOf('year').format('DD/MM/YYYY');
      const endOfYear = moment().endOf('year').format('DD/MM/YYYY');
      const filters = { ...activeFilters, dateFrom: startOfYear, dateTo: endOfYear };
      setActiveFilters(filters);
      onDateRangeChange?.(startOfYear, endOfYear);
      onFiltersChange?.(filters);
    }
  };

  const handleApplyFilters = (filters: CalendarFilters) => {
    setActiveFilters(filters);
    onDateRangeChange?.(filters.dateFrom, filters.dateTo);
    onFiltersChange?.(filters);
  };

  const handleSelectEvent = (event: any) => {
    if (event.id) {
      navigate(`/task-details/${event.id}`);
    }
  };

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

  const activeFilterCount = Object.entries(activeFilters).filter(([key, value]) => {
    const defaultRange = getDefaultDateRange();
    // Exclude default date values and empty strings from filter count
    if (key === 'dateFrom' && value === defaultRange.dateFrom) return false;
    if (key === 'dateTo' && value === defaultRange.dateTo) return false;
    return value !== '';
  }).length;

  const CustomToolbar = () => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => handleNavigate('PREV')} className="h-8 w-8 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleNavigate('NEXT')} className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <h2 className="text-xl font-semibold">{moment(date).format('MMMM YYYY')}</h2>

      <div className="flex items-center gap-2">
        {['month', 'week', 'day', 'agenda', 'year'].map(v => (
          <Button
            key={v}
            variant={view === v ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewChange(v)}
            className="px-3 py-1 h-8 capitalize"
          >
            {v === 'year' ? '52-week' : v}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filter Button */}
      <div className="flex items-center justify-end">
        <Button
          onClick={() => setIsFilterModalOpen(true)}
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 h-10"
        >
          <Filter className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-1 text-xs bg-purple-600 text-white rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Legends */}
      <div className="flex items-center gap-6 text-sm">
        <span className="font-medium">Legends</span>
        {[
          ['#facc15', 'Scheduled'],
          ['#ec4899', 'Open'],
          ['#3b82f6', 'In Progress'],
          ['#22c55e', 'Closed'],
          ['#ef4444', 'Overdue']
        ].map(([color, label]) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: color }}></div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Calendar/Year View with Toolbar */}
      <div className="bg-white border rounded-lg p-4" style={{ height: '600px', overflowY: 'auto' }}>
        {view === 'year' ? (
          <>
            <CustomToolbar />
            <YearlyView events={calendarEvents} onSelectEvent={handleSelectEvent} />
          </>
        ) : (
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            view={view}
            onView={handleViewChange}
            date={date}
            onNavigate={setDate}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            components={{
              toolbar: CustomToolbar
            }}
            views={['month', 'week', 'day', 'agenda', 'work_week']}
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
        )}
      </div>

      {/* Filter Modal */}
      <CalendarFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

// ✅ Custom Year View Component
const YearlyView: React.FC<{
  events: any[];
  onSelectEvent: (event: any) => void;
}> = ({ events, onSelectEvent }) => {
  const months = Array.from({ length: 12 }, (_, i) => moment().month(i).startOf('month'));

  return (
    <div className="grid grid-cols-3 gap-4">
      {months.map(month => {
        const monthEvents = events.filter(e => moment(e.start).isSame(month, 'month'));
        return (
          <div key={month.format('MMMM')} className="border rounded p-2 bg-gray-50 h-[200px] overflow-y-auto">
            <h3 className="text-sm font-bold mb-2">{month.format('MMMM YYYY')}</h3>
            <ul className="space-y-1 text-xs">
              {monthEvents.length === 0 && <li className="text-gray-400 italic">No Tasks</li>}
              {monthEvents.map(event => (
                <li
                  key={event.id}
                  className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                  onClick={() => onSelectEvent(event)}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: event.color }}
                  ></span>
                  <span className="text-gray-800">{event.title}</span>
                  <div className="text-gray-500 ml-4">
                    {moment(event.start).format('MMM D, HH:mm')}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
