import React, { useState, useMemo, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { CalendarEvent, calendarService } from '@/services/calendarService';
import { CalendarFilterModal, CalendarFilters } from '@/components/CalendarFilterModal';
import { toast } from 'sonner';

interface ScheduledTaskCalendarProps {
  events?: CalendarEvent[];
  onDateRangeChange?: (start: string, end: string) => void;
  onFiltersChange?: (filters: any) => void;
  isLoading?: boolean;
}

export const ScheduledTaskCalendar: React.FC<ScheduledTaskCalendarProps> = ({
  events = [],
  onDateRangeChange,
  onFiltersChange,
  isLoading = false
}) => {
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek' | 'year'>('dayGridMonth');
  const [date, setDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [weekOffset, setWeekOffset] = useState(0); // Track week offset for 52-week navigation
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isYearLoading, setIsYearLoading] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  
  // Track if user has applied custom filters for 52 Week view
  const [hasAppliedCustomFilters, setHasAppliedCustomFilters] = useState(false);

  // State for event hover/click in weekly view
  const [hoveredEvent, setHoveredEvent] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

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

  // Helper function to get full year range based on today's date (for 52 Week view default)
  const getFullYearRange = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return {
      dateFrom: formatDate(new Date(currentYear, 0, 1)), // Jan 1 of current year
      dateTo: formatDate(new Date(currentYear, 11, 31))  // Dec 31 of current year
    };
  };

  const [activeFilters, setActiveFilters] = useState<CalendarFilters>(() => {
    // Set default date range but keep task filters empty
    const defaultRange = getDefaultDateRange();
    const defaults = calendarService.getDefaultFilters();
    return {
      dateFrom: defaultRange.dateFrom,
      dateTo: defaultRange.dateTo,
      's[task_custom_form_schedule_type_eq]': '', // Always empty
      's[task_task_of_eq]': '' // Always empty
    };
  });
  const navigate = useNavigate();

  // Helper function to parse filter date strings (DD/MM/YYYY format)
  const parseFilterDate = (dateStr: string): Date => {
    if (!dateStr || typeof dateStr !== 'string') {
      return new Date();
    }
    
    const parts = dateStr.trim().split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      
      // Validate the parsed values
      if (!isNaN(day) && !isNaN(month) && !isNaN(year) && 
          day > 0 && day <= 31 && month >= 0 && month <= 11 && year > 1900) {
        return new Date(year, month, day);
      }
    }
    
    // Fallback to current date if parsing fails
    console.warn('Failed to parse date:', dateStr, '- using current date');
    return new Date();
  };

  // Apply default filters on component mount (with default date range)
  useEffect(() => {
    // Parse the initial filter's start date to set calendar date
    const initialStartDate = parseFilterDate(activeFilters.dateFrom);
    setDate(initialStartDate);
    
    // Always apply the initial filters (which include default date range)
    onDateRangeChange?.(activeFilters.dateFrom, activeFilters.dateTo);
    onFiltersChange?.(activeFilters);
  }, []); // Empty dependency array to run only on mount

  const get52WeeksRange = useMemo(() => {
    // For 52 Week view: Show full year (Jan 1 - Dec 31)
    // weekOffset = 0 means current year, +52/-52 moves by years
    const today = moment();
    const currentYear = today.year();
    const targetYear = currentYear + Math.floor(weekOffset / 52);
    
    const startDate = moment(`${targetYear}-01-01`);
    const endDate = moment(`${targetYear}-12-31`);
    
    return { 
      start: startDate.toDate(), 
      end: endDate.toDate(),
      startFormatted: startDate.format('DD/MM/YYYY'),
      endFormatted: endDate.format('DD/MM/YYYY')
    };
  }, [weekOffset]);

  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      id: String(event.id),
      title: event.title,
      start: event.start,
      end: moment(event.start).add(1, 'hour').toISOString(),
      backgroundColor: event.color || '#fdbb0b',
      borderColor: event.color || '#fdbb0b',
      textColor: '#000',
      extendedProps: {
        status: event.status,
        resource: event
      }
    }));
  }, [events]);

  // Track when calendar events are fully processed and rendered
  useEffect(() => {
    if (calendarEvents.length > 0) {
      console.log("📊 Calendar events processed:", calendarEvents.length);
      console.log("✅ Events are ready to render");
    }
  }, [calendarEvents]);

  const handleNavigate = (action: 'next' | 'prev') => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      if (action === 'next') {
        calendarApi.next();
      } else {
        calendarApi.prev();
      }
      setDate(calendarApi.getDate());
    }
  };

  const handleYearNavigate = (action: 'next' | 'prev') => {
    setIsYearLoading(true);
    
    // Parse the current filter dates to determine the year we're viewing
    const currentStartDate = parseFilterDate(activeFilters.dateFrom);
    const currentYear = currentStartDate.getFullYear();
    
    // Navigate to next/previous year
    const targetYear = action === 'next' ? currentYear + 1 : currentYear - 1;
    
    const startDate = moment(`${targetYear}-01-01`);
    const endDate = moment(`${targetYear}-12-31`);

    const startDateFormatted = startDate.format('DD/MM/YYYY');
    const endDateFormatted = endDate.format('DD/MM/YYYY');
    
    console.log(`📅 Navigating ${action} to year ${targetYear}: ${startDateFormatted} - ${endDateFormatted}`);
    
    const filters = { ...activeFilters, dateFrom: startDateFormatted, dateTo: endDateFormatted };

    // Update filters and trigger callbacks
    setActiveFilters(filters);
    onDateRangeChange?.(startDateFormatted, endDateFormatted);
    onFiltersChange?.(filters);

    // Reset loading state after a short delay to allow re-render
    setTimeout(() => setIsYearLoading(false), 300);
  };

  // Removed the weekOffset useEffect as we now handle year navigation directly
  // through handleYearNavigate which properly updates the filter dates

  // Sync calendar API date with state for non-year views
  useEffect(() => {
    if (view !== 'year' && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentCalendarDate = calendarApi.getDate();
      
      // Only update if dates are different (to avoid unnecessary re-renders)
      if (currentCalendarDate.getTime() !== date.getTime()) {
        calendarApi.gotoDate(date);
      }
    }
  }, [date, view]);

  const handleViewChange = (newView: any) => {
    const calendarApi = calendarRef.current?.getApi();

    if (newView === 'year') {
      setIsYearLoading(true);
      
      // When switching to 52 Week view:
      // - If user has NOT applied custom filters, use full year (Jan 1 - Dec 31) based on today's date
      // - If user HAS applied custom filters, respect those filter dates
      if (!hasAppliedCustomFilters) {
        const fullYearRange = getFullYearRange();
        const filters = { 
          ...activeFilters, 
          dateFrom: fullYearRange.dateFrom, 
          dateTo: fullYearRange.dateTo 
        };
        
        console.log('📅 Switching to 52 Week view with FULL YEAR (no custom filters):', fullYearRange.dateFrom, 'to', fullYearRange.dateTo);
        
        setActiveFilters(filters);
        onDateRangeChange?.(fullYearRange.dateFrom, fullYearRange.dateTo);
        onFiltersChange?.(filters);
      } else {
        // User has applied custom filters, use them
        console.log('📅 Switching to 52 Week view with CUSTOM FILTERS:', activeFilters.dateFrom, 'to', activeFilters.dateTo);
        onDateRangeChange?.(activeFilters.dateFrom, activeFilters.dateTo);
        onFiltersChange?.(activeFilters);
      }

      // Reset loading state after a short delay
      setTimeout(() => {
        setIsYearLoading(false);
      }, 300);
    } else {
      // When switching to other views (month, week, day, agenda), 
      // use the current filter's date range (keep existing logic unchanged)
      const filterStartDate = parseFilterDate(activeFilters.dateFrom);
      setDate(filterStartDate);
      
      if (calendarApi) {
        calendarApi.changeView(newView);
        calendarApi.gotoDate(filterStartDate);
      }
      
      // Apply the current filter's date range for these views
      onDateRangeChange?.(activeFilters.dateFrom, activeFilters.dateTo);
      onFiltersChange?.(activeFilters);
    }

    setView(newView);
  };

  const handleApplyFilters = (filters: CalendarFilters) => {
    // Complete replacement of filters, not appending
    console.log('📤 Applying new filters (complete replacement):', filters);
    console.log('🗓️  Filter dates - From:', filters.dateFrom, 'To:', filters.dateTo);
    
    // Mark that user has applied custom filters
    setHasAppliedCustomFilters(true);
    
    const filterStartDate = parseFilterDate(filters.dateFrom);
    
    // Update calendar date to match filter start date
    setDate(filterStartDate);
    
    // Apply the filter's date range for ALL views, including 52 Week view
    // This ensures that custom date ranges (like Jan 2026 - Dec 2026) are respected
    setActiveFilters({ ...filters });
    onDateRangeChange?.(filters.dateFrom, filters.dateTo);
    onFiltersChange?.({ ...filters });
    
    // For non-year views, also update the calendar API
    if (view !== 'year') {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        calendarApi.gotoDate(filterStartDate);
      }
    }
  };

  const handleSelectEvent = (info: any) => {
    if (info.event.id) {
      navigate(`/maintenance/task/task-details/${info.event.id}`);
    }
  };

  // Handle event hover (for weekly view)
  const handleEventMouseEnter = (info: any) => {
    if (view === 'timeGridWeek' || view === 'timeGridDay') {
      setHoveredEvent(info.event);
      setMousePosition({ x: info.jsEvent.clientX, y: info.jsEvent.clientY });
    }
  };

  const handleEventMouseLeave = () => {
    if (view === 'timeGridWeek' || view === 'timeGridDay') {
      setHoveredEvent(null);
    }
  };

  // Handle event click (for weekly view)
  const handleEventClick = (info: any) => {
    if (view === 'timeGridWeek' || view === 'timeGridDay') {
      info.jsEvent.preventDefault();
      setSelectedEvent(info.event);
    }
  };

  // Close modals
  const closeEventModal = () => {
    setSelectedEvent(null);
  };

  const activeFilterCount = Object.entries(activeFilters).filter(([key, value]) => {
    // Count any non-empty filter values
    return value && value.trim() !== '';
  }).length;

  const CustomToolbar = () => {
    const getToolbarTitle = () => {
      if (view === 'year') {
        // Use the active filter dates instead of get52WeeksRange
        // This ensures we show the correct custom date range (e.g., Jan 2026 - Dec 2026)
        const startDate = parseFilterDate(activeFilters.dateFrom);
        const endDate = parseFilterDate(activeFilters.dateTo);
        const startMoment = moment(startDate);
        const endMoment = moment(endDate);
        return `${startMoment.format('MMM DD, YYYY')} - ${endMoment.format('MMM DD, YYYY')}`;
      }
      return moment(date).format('MMMM YYYY');
    };

    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => view === 'year' ? handleYearNavigate('prev') : handleNavigate('prev')}
            className="h-8 w-8 p-0"
            disabled={isYearLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => view === 'year' ? handleYearNavigate('next') : handleNavigate('next')}
            className="h-8 w-8 p-0"
            disabled={isYearLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="text-xl font-semibold">{getToolbarTitle()}</h2>

        <div className="flex items-center gap-2">
          {[
            { key: 'dayGridMonth', label: 'month' },
            { key: 'timeGridWeek', label: 'week' },
            { key: 'timeGridDay', label: 'day' },
            { key: 'listWeek', label: 'agenda' },
            { key: 'year', label: '52 Week' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={view === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewChange(key)}
              className="px-3 py-1 h-8 capitalize"
              disabled={isYearLoading && key === 'year'}
            >
              {isYearLoading && key === 'year' ? (
                <div className="flex items-center gap-2">
                  <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                  <span>{label}</span>
                </div>
              ) : (
                label
              )}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filter Button with Date Range Label */}
      <div className="flex items-center justify-end gap-3">
        {/* Date Range Label */}
        {(activeFilters.dateFrom || activeFilters.dateTo) && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {activeFilters.dateFrom && activeFilters.dateTo
                ? `${activeFilters.dateFrom} - ${activeFilters.dateTo}`
                : activeFilters.dateFrom || activeFilters.dateTo || 'All Dates'}
            </span>
          </div>
        )}

        <Button
          onClick={() => setIsFilterModalOpen(true)}
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 h-10"
        >
          <Filter className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-1 text-xs bg-red-600 text-white rounded-full">
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
      <div className="bg-white border rounded-lg p-4 relative" style={{ height: '700px', overflowY: 'auto' }}>
        {/* Show calendar content */}
        {view === 'year' ? (
          <>
            <CustomToolbar />
            {isYearLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading 52-week calendar...</p>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-y-auto">
                <YearlyView
                  events={calendarEvents.length > 0 ? calendarEvents : []}
                  onSelectEvent={handleSelectEvent}
                  startDate={parseFilterDate(activeFilters.dateFrom)}
                  endDate={parseFilterDate(activeFilters.dateTo)}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <CustomToolbar />
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView={view}
              events={calendarEvents}
              eventClick={view === 'timeGridWeek' || view === 'timeGridDay' ? handleEventClick : handleSelectEvent}
              eventMouseEnter={handleEventMouseEnter}
              eventMouseLeave={handleEventMouseLeave}
              headerToolbar={false} // We're using our custom toolbar
              height="calc(100% - 60px)" // Account for custom toolbar height
              eventDisplay="block"
              dayMaxEvents={3}
              moreLinkClick="popover"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
              allDaySlot={false}
              nowIndicator={true}
              selectable={true}
              selectMirror={true}
              dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
              eventContent={(eventInfo) => (
                <div className="fc-event-content p-1">
                  <div className="fc-event-title text-xs font-medium truncate">
                    {eventInfo.event.title}
                  </div>
                  <div className="fc-event-time text-xs opacity-75">
                    {moment(eventInfo.event.start).format('HH:mm')}
                  </div>
                </div>
              )}
            />
          </>
        )}
        
        {/* Loading Overlay - Shows during API fetch and state mapping */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading calendar events...</p>
              <p className="text-gray-500 text-sm mt-2">Fetching and processing scheduled tasks</p>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <CalendarFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={activeFilters}
        onClearFilters={() => {
          // Reset the custom filter flag when filters are cleared
          setHasAppliedCustomFilters(false);
          console.log('🔄 Custom filter flag reset - will use full year on next 52 Week view switch');
        }}
      />

      {/* Event Hover Tooltip for Weekly View */}
      {hoveredEvent && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-lg border p-3 pointer-events-none"
          style={{
            left: `${mousePosition.x + 10}px`,
            top: `${mousePosition.y - 10}px`,
            maxWidth: '300px'
          }}
        >
          <div className="text-sm font-semibold text-gray-900 mb-1">
            {hoveredEvent.title}
          </div>
          <div className="text-xs text-gray-600 mb-1">
            {moment(hoveredEvent.start).format('MMM DD, YYYY HH:mm')}
          </div>
          {hoveredEvent.extendedProps?.status && (
            <div className="text-xs text-gray-500">
              Status: {hoveredEvent.extendedProps.status}
            </div>
          )}

        </div>
      )}

      {/* Event Details Modal for Weekly View */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden transform transition-all">
            {/* Enhanced Header with form-inspired design */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 ">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Task Details
                      </h3>

                    </div>
                  </div>


                </div>

                <button
                  onClick={closeEventModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable Form-style content */}
            <div className="overflow-y-auto max-h-[60vh]">
              <div className="p-6">
                <div className="space-y-6">
                  {/* Task Title */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Task Title</label>
                    <div className="text-base font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-lg p-3">
                      {selectedEvent.title}
                    </div>
                  </div>

                  {/* Date and Time Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">Date and Time</label>
                      <div className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg p-3">
                        {moment(selectedEvent.start).format('MMMM DD, YYYY')} {moment(selectedEvent.start).format('HH:mm')}

                      </div>
                    </div>
                    <div>
                      {selectedEvent.extendedProps?.status && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2">Status</label>
                          <div className={`
                        inline-flex px-3 py-2 rounded-lg text-sm font-medium border
                        ${selectedEvent.extendedProps.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                              selectedEvent.extendedProps.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                selectedEvent.extendedProps.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                  selectedEvent.extendedProps.status === 'Scheduled' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                    'bg-gray-50 text-gray-700 border-gray-200'}
                      `}>
                            {selectedEvent.extendedProps.status}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status */}




                  {/* Quick Action Link */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" onClick={() => {
                    console.log('Quick navigate to task details:', `/maintenance/task/task-details/${selectedEvent.id}`);
                    closeEventModal();
                    navigate(`/maintenance/task/task-details/${selectedEvent.id}`);
                  }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-blue-900 mb-1">
                          Click to view details
                        </div>

                      </div>
                      <button
                        onClick={() => {
                          console.log('Quick navigate to task details:', `/maintenance/task/task-details/${selectedEvent.id}`);
                          closeEventModal();
                          navigate(`/maintenance/task/task-details/${selectedEvent.id}`);
                        }}
                        className="px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer with action buttons */}


          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Custom 52-Week View Component
const YearlyView: React.FC<{
  events: any[];
  onSelectEvent: (event: any) => void;
  startDate: Date;
  endDate: Date;
}> = ({ events, onSelectEvent, startDate, endDate }) => {
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<any[]>([]);

  // Generate 12 months dynamically based on the date range
  const months = useMemo(() => {
    const monthsArray = [];
    const start = moment(startDate);
    const end = moment(endDate);
    
    // Get the first day of the start month
    let current = start.clone().startOf('month');
    const endMonth = end.clone().endOf('month');

    // Generate months until we reach the end date
    while (current.isSameOrBefore(endMonth, 'month')) {
      const monthStart = current.clone().startOf('month');
      const monthEnd = current.clone().endOf('month');

      // Generate weeks for this month
      const weeks = [];
      let currentWeek = monthStart.clone().startOf('week');

      while (currentWeek.isSameOrBefore(monthEnd, 'month') || currentWeek.month() === monthStart.month()) {
        const weekEnd = currentWeek.clone().endOf('week');
        weeks.push({
          start: currentWeek.clone(),
          end: weekEnd.clone(),
          days: []
        });

        // Generate days for this week
        for (let d = 0; d < 7; d++) {
          const day = currentWeek.clone().add(d, 'days');
          const dayEvents = events.filter(e => {
            const eventDate = moment(e.start);
            return eventDate.isSame(day, 'day');
          });

          weeks[weeks.length - 1].days.push({
            date: day.clone(),
            isCurrentMonth: day.month() === monthStart.month(),
            isToday: day.isSame(moment(), 'day'),
            events: dayEvents
          });
        }

        currentWeek.add(1, 'week');

        // Break if we've gone too far past the month
        if (currentWeek.diff(monthEnd, 'weeks') > 1) break;
      }

      monthsArray.push({
        name: monthStart.format('MMM'),
        fullName: monthStart.format('MMMM'),
        year: monthStart.year(),
        weeks
      });
      
      // Move to next month
      current.add(1, 'month');
      
      // Limit to 12 months maximum for display
      if (monthsArray.length >= 12) break;
    }
    
    return monthsArray;
  }, [events, startDate, endDate]);

  const handleDayHover = (day: any, event: React.MouseEvent) => {
    // Disabled hover tooltip - only show on click
    // setHoveredDay(day.date.format('YYYY-MM-DD'));
    // setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleDayLeave = () => {
    // Disabled hover tooltip
    // setHoveredDay(null);
  };

  const handleDayClick = (day: any) => {
    // Allow clicking on any day to see debug info
    const dayKey = day.date.format('YYYY-MM-DD');
    setSelectedDay(dayKey);
    setSelectedDayEvents(day.events);
  };

  const handleCloseEventList = () => {
    setSelectedDay(null);
    setSelectedDayEvents([]);
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      {/* Debug Panel */}




      <div className="grid grid-cols-3 gap-6">
        {months.map((month, monthIndex) => (
          <div key={`${month.year}-${month.name}`} className="space-y-2 bg-gray-50 p-4 rounded-lg border">
            {/* Month Header */}
            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                {month.name} {month.year}
              </h3>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={index} className="text-xs text-gray-600 text-center py-1 font-medium">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="space-y-1">
                {month.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1">
                    {week.days.map((day, dayIndex) => {
                      const hasEvents = day.events.length > 0;
                      const dayKey = day.date.format('YYYY-MM-DD');
                      const isHovered = hoveredDay === dayKey;

                      return (
                        <div
                          key={dayIndex}
                          className={`
                            relative text-xs text-center py-1 cursor-pointer rounded min-h-[28px] flex items-center justify-center
                            ${day.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                            ${day.isToday ? 'bg-blue-500 text-white font-bold ring-2 ring-blue-200' : ''}
                            ${hasEvents && !day.isToday ? 'bg-blue-100 text-blue-800 font-medium' : ''}
                            ${hasEvents ? 'hover:bg-blue-200 hover:shadow-md' : 'hover:bg-gray-100'}
                            transition-all duration-200
                          `}
                          onClick={() => handleDayClick(day)}
                          title={`${moment(day.date).format('MMMM D, YYYY')} - ${day.events.length} events`}
                        >
                          {day.date.date()}

                          {/* Enhanced Event Count Badge - Only show when there are events */}
                          {hasEvents && (
                            <div className="absolute -top-1 -right-1">
                              <div className={`
                                rounded-full text-xs w-5 h-5 flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-lg
                                bg-red-500 text-white
                                ${day.events.length > 9 ? 'w-6 h-5 text-[9px]' : ''}
                                transition-all duration-200 hover:scale-110
                              `}>
                                {day.events.length > 99 ? '99+' : day.events.length}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Summary at Bottom */}

      {/* Enhanced Hover Tooltip with Debug Info */}
      {hoveredDay && (
        <div
          className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-sm"
          style={{
            left: Math.min(mousePosition.x + 10, window.innerWidth - 320), // Prevent overflow to the right
            top: mousePosition.y > window.innerHeight / 2
              ? mousePosition.y - 300 // Show above cursor if in bottom half
              : mousePosition.y + 10, // Show below cursor if in top half
            pointerEvents: 'none',
            maxHeight: '250px',
            overflowY: 'auto'
          }}
        >
          {(() => {
            const dayEvents = months
              .flatMap(m => m.weeks)
              .flatMap(w => w.days)
              .find(d => d.date.format('YYYY-MM-DD') === hoveredDay)?.events || [];

            return (
              <div className="space-y-3">
                <div className="font-semibold text-gray-800 border-b pb-2">
                  {moment(hoveredDay).format('MMMM D, YYYY')}
                </div>

                {/* Count Display with prominence */}
                <div className="flex items-center justify-between bg-blue-50 p-2 rounded">
                  <span className="text-sm font-medium text-gray-700">Event Count:</span>
                  <div className={`
                    px-2 py-1 rounded-full text-sm font-bold
                    ${dayEvents.length > 0 ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-600'}
                  `}>
                    {dayEvents.length}
                  </div>
                </div>

                {/* Debug Info */}


                {dayEvents.length > 0 ? (
                  <>
                    {dayEvents.slice(0, 5).map((event, idx) => (
                      <div key={idx} className="flex items-start gap-2 py-1">
                        <div
                          className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                          style={{ backgroundColor: event.backgroundColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate">
                            {event.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {moment(event.start).format('HH:mm')} | ID: {event.id}
                          </div>
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 5 && (
                      <div className="text-xs text-blue-600 text-center pt-1 border-t">
                        +{dayEvents.length - 5} more events
                      </div>
                    )}
                    <div className="text-xs text-gray-500 text-center pt-1 border-t">
                      Click to view full events list
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-2">
                    No events scheduled for this day
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Enhanced Events List Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden transform transition-all">
            {/* Enhanced Header with form-inspired design */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {moment(selectedDay).format('dddd, MMMM D, YYYY')}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {moment(selectedDay).format('[Day] DDD [of] YYYY')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">{selectedDayEvents.length} task{selectedDayEvents.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>


                  </div>
                </div>

                <button
                  onClick={handleCloseEventList}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Enhanced Events List */}
            <div className="overflow-y-auto max-h-[60vh]">
              {selectedDayEvents.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {selectedDayEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 group border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        onSelectEvent({ event });
                        handleCloseEventList();
                      }}
                    >
                      <div className="flex items-start gap-4">
                        {/* Form-style radio button indicator */}
                        <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-1">
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center group-hover:border-red-500 transition-colors">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: event.backgroundColor }}
                            />
                          </div>
                          {index < selectedDayEvents.length - 1 && (
                            <div className="w-px h-8 bg-gray-200"></div>
                          )}
                        </div>

                        {/* Task details in form-like layout */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="font-medium text-gray-900 text-base group-hover:text-red-600 transition-colors">
                              {event.title}
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border font-mono">
                              #{event.id}
                            </div>
                          </div>

                          {/* Form-style details grid */}
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="text-sm">
                              <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
                              <div className="text-gray-900">{moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}</div>
                            </div>
                            <div className="text-sm">
                              <label className="block text-xs font-medium text-gray-500 mb-1">Duration</label>
                              <div className="text-gray-900">1 hour</div>
                            </div>
                          </div>

                          {/* Status and metadata in form style */}
                          <div className="flex items-center gap-3 flex-wrap">
                            {event.extendedProps?.status && (
                              <div className="text-sm">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                                <div className={`
                                  inline-flex px-2 py-1 rounded text-xs font-medium border
                                  ${event.extendedProps.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                    event.extendedProps.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                      event.extendedProps.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                        event.extendedProps.status === 'Scheduled' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                          'bg-gray-50 text-gray-700 border-gray-200'}
                                `}>
                                  {event.extendedProps.status}
                                </div>
                              </div>
                            )}

                            <div className="text-sm">
                              <label className="block text-xs font-medium text-gray-500 mb-1">Created</label>
                              <div className="text-gray-900">{moment(event.start).format('MMM D, YYYY')}</div>
                            </div>
                          </div>
                        </div>

                        {/* Simple arrow icon */}
                        <div className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 border">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No tasks scheduled</h4>
                  <p className="text-gray-600 text-sm mb-6">This day is free of scheduled maintenance tasks.</p>

                  {/* Debug info in form style */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left max-w-md mx-auto">
                    <div className="text-sm font-medium text-gray-700 mb-3">Debug Information</div>
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span className="font-medium">Date:</span>
                        <span>{selectedDay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total events:</span>
                        <span>{events.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Events for this day:</span>
                        <span>{selectedDayEvents.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer in form style */}

          </div>
        </div>
      )}
    </div>
  );
};
