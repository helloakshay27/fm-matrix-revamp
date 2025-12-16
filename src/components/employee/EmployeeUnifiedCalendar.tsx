import React, { useState, useMemo, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  CheckSquare,
  Users,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface UnifiedCalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  type: "project" | "booking" | "todo" | "meeting";
  status?: string;
  color?: string;
  description?: string;
  location?: string;
}

interface EmployeeUnifiedCalendarProps {
  onNavigateToDetails?: (type: string, id: string) => void;
}

export const EmployeeUnifiedCalendar: React.FC<
  EmployeeUnifiedCalendarProps
> = ({ onNavigateToDetails }) => {
  const [view, setView] = useState<
    "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek" | "year"
  >("dayGridMonth");
  const [date, setDate] = useState(new Date());
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isYearLoading, setIsYearLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAppliedCustomFilters, setHasAppliedCustomFilters] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const navigate = useNavigate();

  // Helper function to get default date range (today to one week ago)
  const getDefaultDateRange = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return {
      dateFrom: formatDate(oneWeekAgo),
      dateTo: formatDate(today),
    };
  };

  // Helper function to get full year range based on today's date (for 52 Week view default)
  const getFullYearRange = () => {
    const today = new Date();
    const currentYear = today.getFullYear();

    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return {
      dateFrom: formatDate(new Date(currentYear, 0, 1)), // Jan 1 of current year
      dateTo: formatDate(new Date(currentYear, 11, 31)), // Dec 31 of current year
    };
  };

  // Filter states
  const [activeFilters, setActiveFilters] = useState(() => {
    const defaultRange = getDefaultDateRange();
    return {
      dateFrom: defaultRange.dateFrom,
      dateTo: defaultRange.dateTo,
      showProjects: true,
      showBookings: true,
      showTodos: true,
      showMeetings: true,
    };
  });

  // Mock data - Replace with actual API calls
  const [events, setEvents] = useState<UnifiedCalendarEvent[]>([
    {
      id: "1",
      title: "Project Review Meeting",
      start: moment().add(1, "day").hours(10).minutes(0).toISOString(),
      end: moment().add(1, "day").hours(11).minutes(0).toISOString(),
      type: "project",
      status: "In Progress",
      color: "#3b82f6",
      description: "Quarterly project review",
    },
    {
      id: "2",
      title: "Conference Room A Booking",
      start: moment().add(2, "days").hours(14).minutes(0).toISOString(),
      end: moment().add(2, "days").hours(15).minutes(30).toISOString(),
      type: "booking",
      status: "Confirmed",
      color: "#22c55e",
      location: "Floor 3, Wing A",
    },
    {
      id: "3",
      title: "Complete Report Submission",
      start: moment().add(3, "days").hours(17).minutes(0).toISOString(),
      type: "todo",
      status: "Pending",
      color: "#f59e0b",
    },
    {
      id: "4",
      title: "Team Standup",
      start: moment().hours(9).minutes(30).toISOString(),
      end: moment().hours(10).minutes(0).toISOString(),
      type: "meeting",
      status: "Scheduled",
      color: "#ec4899",
      location: "Meeting Room B",
    },
  ]);

  // Event hover/click states
  const [hoveredEvent, setHoveredEvent] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Helper function to parse filter date strings (DD/MM/YYYY format)
  const parseFilterDate = (dateStr: string): Date => {
    if (!dateStr || typeof dateStr !== "string") {
      return new Date();
    }

    const parts = dateStr.trim().split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);

      // Validate the parsed values
      if (
        !isNaN(day) &&
        !isNaN(month) &&
        !isNaN(year) &&
        day > 0 &&
        day <= 31 &&
        month >= 0 &&
        month <= 11 &&
        year > 1900
      ) {
        return new Date(year, month, day);
      }
    }

    // Fallback to current date if parsing fails
    console.warn("Failed to parse date:", dateStr, "- using current date");
    return new Date();
  };

  // Filter events based on active filters
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (!activeFilters.showProjects && event.type === "project") return false;
      if (!activeFilters.showBookings && event.type === "booking") return false;
      if (!activeFilters.showTodos && event.type === "todo") return false;
      if (!activeFilters.showMeetings && event.type === "meeting") return false;
      return true;
    });
  }, [events, activeFilters]);

  // Transform events for FullCalendar
  const calendarEvents = useMemo(() => {
    return filteredEvents.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end || moment(event.start).add(1, "hour").toISOString(),
      backgroundColor: event.color,
      borderColor: event.color,
      textColor: "#fff",
      extendedProps: {
        type: event.type,
        status: event.status,
        description: event.description,
        location: event.location,
        resource: event,
      },
    }));
  }, [filteredEvents]);

  const handleNavigate = (action: "next" | "prev") => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      if (action === "next") {
        calendarApi.next();
      } else {
        calendarApi.prev();
      }
      setDate(calendarApi.getDate());
    }
  };

  const handleViewChange = (newView: any) => {
    // When switching to 52 Week view, automatically set date range to full year
    if (newView === "year") {
      setIsYearLoading(true);

      // If user has applied custom filters, use those dates
      if (!hasAppliedCustomFilters) {
        // Otherwise, default to showing the full current year
        const fullYearRange = getFullYearRange();
        setActiveFilters((prev) => ({
          ...prev,
          dateFrom: fullYearRange.dateFrom,
          dateTo: fullYearRange.dateTo,
        }));
        console.log(
          "📅 Switching to 52 Week view with FULL YEAR (no custom filters):",
          fullYearRange.dateFrom,
          "to",
          fullYearRange.dateTo
        );
      } else {
        // Keep custom filters if user has applied them
        console.log(
          "📅 Switching to 52 Week view with CUSTOM FILTERS:",
          activeFilters.dateFrom,
          "to",
          activeFilters.dateTo
        );
      }

      // Small delay to show loading state
      setTimeout(() => {
        setIsYearLoading(false);
      }, 300);
    }

    setView(newView);

    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi && newView !== "year") {
      calendarApi.changeView(newView);
    }
  };

  const handleSelectEvent = (info: any) => {
    const eventType = info.event.extendedProps?.type;
    const eventId = info.event.id;

    if (onNavigateToDetails) {
      onNavigateToDetails(eventType, eventId);
    } else {
      // Default navigation logic
      switch (eventType) {
        case "project":
          navigate(`/employee/projects/${eventId}`);
          break;
        case "booking":
          navigate(`/bookings/${eventId}`);
          break;
        case "todo":
          navigate(`/employee/tasks/${eventId}`);
          break;
        case "meeting":
          navigate(`/bookings/${eventId}`);
          break;
      }
    }
  };

  const handleEventMouseEnter = (info: any) => {
    if (view === "timeGridWeek" || view === "timeGridDay") {
      setHoveredEvent(info.event);
      setMousePosition({ x: info.jsEvent.clientX, y: info.jsEvent.clientY });
    }
  };

  const handleEventMouseLeave = () => {
    if (view === "timeGridWeek" || view === "timeGridDay") {
      setHoveredEvent(null);
    }
  };

  const handleEventClick = (info: any) => {
    if (view === "timeGridWeek" || view === "timeGridDay") {
      info.jsEvent.preventDefault();
      setSelectedEvent(info.event);
    } else {
      handleSelectEvent(info);
    }
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Briefcase className="w-4 h-4" />;
      case "booking":
        return <Calendar className="w-4 h-4" />;
      case "todo":
        return <CheckSquare className="w-4 h-4" />;
      case "meeting":
        return <Users className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "project":
        return "Project";
      case "booking":
        return "Booking";
      case "todo":
        return "To-Do";
      case "meeting":
        return "Meeting";
      default:
        return "Event";
    }
  };

  const activeFilterCount = Object.entries(activeFilters).filter(
    ([key, value]) => {
      if (key.startsWith("show")) return !value; // Count disabled filters
      return false;
    }
  ).length;

  const CustomToolbar = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigate("prev")}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigate("next")}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="text-xl font-semibold">
          {moment(date).format("MMMM YYYY")}
        </h2>

        <div className="flex items-center gap-2">
          {[
            { key: "dayGridMonth", label: "month" },
            { key: "timeGridWeek", label: "week" },
            { key: "timeGridDay", label: "day" },
            { key: "listWeek", label: "agenda" },
            { key: "year", label: "52 Week" },
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={view === key ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewChange(key)}
              className="px-3 py-1 h-8 capitalize"
              disabled={isYearLoading && key === "year"}
            >
              {isYearLoading && key === "year" ? (
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
      {/* Filter Button with Active Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Quick filter toggles */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Show:</span>
            <button
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  showProjects: !prev.showProjects,
                }))
              }
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeFilters.showProjects
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-gray-100 text-gray-500 border border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                Projects
              </div>
            </button>
            <button
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  showBookings: !prev.showBookings,
                }))
              }
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeFilters.showBookings
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-gray-100 text-gray-500 border border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Bookings
              </div>
            </button>
            <button
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  showTodos: !prev.showTodos,
                }))
              }
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeFilters.showTodos
                  ? "bg-orange-100 text-orange-700 border border-orange-300"
                  : "bg-gray-100 text-gray-500 border border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1">
                <CheckSquare className="w-3 h-3" />
                To-Do
              </div>
            </button>
            <button
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  showMeetings: !prev.showMeetings,
                }))
              }
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeFilters.showMeetings
                  ? "bg-pink-100 text-pink-700 border border-pink-300"
                  : "bg-gray-100 text-gray-500 border border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Meetings
              </div>
            </button>
          </div>
        </div>

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
          ["#3b82f6", "Projects", <Briefcase className="w-3 h-3" />],
          ["#22c55e", "Bookings", <Calendar className="w-3 h-3" />],
          ["#f59e0b", "To-Do", <CheckSquare className="w-3 h-3" />],
          ["#ec4899", "Meetings", <Users className="w-3 h-3" />],
        ].map(([color, label, icon]) => (
          <div key={label as string} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: color as string }}
            ></div>
            {icon}
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Calendar View */}
      <div
        className="bg-white border rounded-lg p-4 relative"
        style={{ height: "700px", overflowY: "auto" }}
      >
        {view === "year" ? (
          <>
            <CustomToolbar />
            {isYearLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                  <p className="text-gray-600 font-medium">
                    Loading 52-week calendar...
                  </p>
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
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                interactionPlugin,
              ]}
              initialView={view}
              events={calendarEvents}
              eventClick={handleEventClick}
              eventMouseEnter={handleEventMouseEnter}
              eventMouseLeave={handleEventMouseLeave}
              headerToolbar={false}
              height="calc(100% - 60px)"
              eventDisplay="block"
              dayMaxEvents={3}
              moreLinkClick="popover"
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}
              slotLabelFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}
              allDaySlot={false}
              nowIndicator={true}
              selectable={true}
              selectMirror={true}
              dayHeaderFormat={{ weekday: "short", day: "numeric" }}
              eventContent={(eventInfo) => (
                <div className="fc-event-content p-1">
                  <div className="flex items-center gap-1">
                    {getEventTypeIcon(eventInfo.event.extendedProps?.type)}
                    <div className="fc-event-title text-xs font-medium truncate">
                      {eventInfo.event.title}
                    </div>
                  </div>
                  <div className="fc-event-time text-xs opacity-75">
                    {moment(eventInfo.event.start).format("HH:mm")}
                  </div>
                </div>
              )}
            />
          </>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading calendar events...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Event Hover Tooltip */}
      {hoveredEvent && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-lg border p-3 pointer-events-none"
          style={{
            left: `${mousePosition.x + 10}px`,
            top: `${mousePosition.y - 10}px`,
            maxWidth: "300px",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            {getEventTypeIcon(hoveredEvent.extendedProps?.type)}
            <span className="text-xs font-semibold text-gray-500 uppercase">
              {getEventTypeLabel(hoveredEvent.extendedProps?.type)}
            </span>
          </div>
          <div className="text-sm font-semibold text-gray-900 mb-1">
            {hoveredEvent.title}
          </div>
          <div className="text-xs text-gray-600 mb-1">
            {moment(hoveredEvent.start).format("MMM DD, YYYY HH:mm")}
          </div>
          {hoveredEvent.extendedProps?.status && (
            <div className="text-xs text-gray-500">
              Status: {hoveredEvent.extendedProps.status}
            </div>
          )}
          {hoveredEvent.extendedProps?.location && (
            <div className="text-xs text-gray-500">
              Location: {hoveredEvent.extendedProps.location}
            </div>
          )}
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden transform transition-all">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center border"
                      style={{
                        backgroundColor: `${selectedEvent.backgroundColor}20`,
                        borderColor: selectedEvent.backgroundColor,
                      }}
                    >
                      {getEventTypeIcon(selectedEvent.extendedProps?.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getEventTypeLabel(selectedEvent.extendedProps?.type)}{" "}
                        Details
                      </h3>
                      <p className="text-xs text-gray-500">
                        {selectedEvent.extendedProps?.status}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={closeEventModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[60vh]">
              <div className="p-6">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                      Title
                    </label>
                    <div className="text-base font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-lg p-3">
                      {selectedEvent.title}
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">
                        Date
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg p-3">
                        {moment(selectedEvent.start).format("MMM DD, YYYY")}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">
                        Time
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg p-3">
                        {moment(selectedEvent.start).format("HH:mm")}
                        {selectedEvent.end &&
                          ` - ${moment(selectedEvent.end).format("HH:mm")}`}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  {selectedEvent.extendedProps?.location && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">
                        Location
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg p-3">
                        {selectedEvent.extendedProps.location}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {selectedEvent.extendedProps?.description && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">
                        Description
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg p-3">
                        {selectedEvent.extendedProps.description}
                      </div>
                    </div>
                  )}

                  {/* Quick Action */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-blue-900 mb-1">
                          View Full Details
                        </p>
                        <p className="text-xs text-blue-600">
                          Click to see complete information
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          closeEventModal();
                          handleSelectEvent({ event: selectedEvent });
                        }}
                        className="px-3 py-2 bg-[#C72030] text-white text-xs font-medium rounded hover:bg-[#a01828] transition-colors flex items-center gap-1"
                      >
                        View Details
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filter Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Calendar Filters
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Date Range */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    From
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={moment(activeFilters.dateFrom, "DD/MM/YYYY").format(
                      "YYYY-MM-DD"
                    )}
                    onChange={(e) =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        dateFrom: moment(e.target.value).format("DD/MM/YYYY"),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">To</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={moment(activeFilters.dateTo, "DD/MM/YYYY").format(
                      "YYYY-MM-DD"
                    )}
                    onChange={(e) =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        dateTo: moment(e.target.value).format("DD/MM/YYYY"),
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Event Type Filters */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Show Event Types
              </label>
              <div className="space-y-3">
                {[
                  {
                    key: "showProjects",
                    label: "Projects",
                    icon: <Briefcase className="w-4 h-4" />,
                  },
                  {
                    key: "showBookings",
                    label: "Bookings",
                    icon: <Calendar className="w-4 h-4" />,
                  },
                  {
                    key: "showTodos",
                    label: "To-Do Items",
                    icon: <CheckSquare className="w-4 h-4" />,
                  },
                  {
                    key: "showMeetings",
                    label: "Meetings",
                    icon: <Users className="w-4 h-4" />,
                  },
                ].map(({ key, label, icon }) => (
                  <div key={key} className="flex items-center gap-3">
                    <Checkbox
                      checked={
                        activeFilters[
                          key as keyof typeof activeFilters
                        ] as boolean
                      }
                      onCheckedChange={(checked) =>
                        setActiveFilters((prev) => ({
                          ...prev,
                          [key]: checked,
                        }))
                      }
                      className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                    />
                    <div className="flex items-center gap-2">
                      {icon}
                      <label className="text-sm font-medium">{label}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => {
                  setActiveFilters({
                    dateFrom: moment().subtract(7, "days").format("DD/MM/YYYY"),
                    dateTo: moment().format("DD/MM/YYYY"),
                    showProjects: true,
                    showBookings: true,
                    showTodos: true,
                    showMeetings: true,
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-4 py-2 bg-[#C72030] text-white rounded-md hover:bg-[#a01828] transition-colors text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ✅ Custom 52-Week View Component (Memoized for performance)
const YearlyView: React.FC<{
  events: any[];
  onSelectEvent: (event: any) => void;
  startDate: Date;
  endDate: Date;
}> = React.memo(
  ({ events, onSelectEvent, startDate, endDate }) => {
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
      const current = start.clone().startOf("month");
      const endMonth = end.clone().endOf("month");

      // Generate months until we reach the end date
      while (current.isSameOrBefore(endMonth, "month")) {
        const monthStart = current.clone().startOf("month");
        const monthEnd = current.clone().endOf("month");

        // Generate weeks for this month
        const weeks = [];
        const currentWeek = monthStart.clone().startOf("week");

        while (
          currentWeek.isSameOrBefore(monthEnd, "month") ||
          currentWeek.month() === monthStart.month()
        ) {
          const weekEnd = currentWeek.clone().endOf("week");
          weeks.push({
            start: currentWeek.clone(),
            end: weekEnd.clone(),
            days: [],
          });

          // Generate days for this week
          for (let d = 0; d < 7; d++) {
            const day = currentWeek.clone().add(d, "days");
            const dayEvents = events.filter((e) => {
              const eventDate = moment(e.start);
              return eventDate.isSame(day, "day");
            });

            weeks[weeks.length - 1].days.push({
              date: day.clone(),
              isCurrentMonth: day.month() === monthStart.month(),
              isToday: day.isSame(moment(), "day"),
              events: dayEvents,
            });
          }

          currentWeek.add(1, "week");

          // Break if we've gone too far past the month
          if (currentWeek.diff(monthEnd, "weeks") > 1) break;
        }

        monthsArray.push({
          name: monthStart.format("MMM"),
          fullName: monthStart.format("MMMM"),
          year: monthStart.year(),
          weeks,
        });

        // Move to next month
        current.add(1, "month");

        // Limit to 12 months maximum for display
        if (monthsArray.length >= 12) break;
      }

      return monthsArray;
    }, [events, startDate, endDate]);

    const handleDayClick = (day: any) => {
      const dayKey = day.date.format("YYYY-MM-DD");
      setSelectedDay(dayKey);
      setSelectedDayEvents(day.events);
    };

    const handleCloseEventList = () => {
      setSelectedDay(null);
      setSelectedDayEvents([]);
    };

    return (
      <div className="bg-white p-6 rounded-lg border">
        <div className="grid grid-cols-3 gap-6">
          {months.map((month, monthIndex) => (
            <div
              key={`${month.year}-${month.name}`}
              className="space-y-2 bg-gray-50 p-4 rounded-lg border"
            >
              {/* Month Header */}
              <div className="text-center">
                <h3 className="text-base font-semibold text-gray-800 mb-3">
                  {month.name} {month.year}
                </h3>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div
                      key={index}
                      className="text-xs text-gray-600 text-center py-1 font-medium"
                    >
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
                        const dayKey = day.date.format("YYYY-MM-DD");

                        return (
                          <div
                            key={dayIndex}
                            className={`
                                                        relative text-xs text-center py-1 cursor-pointer rounded min-h-[28px] flex items-center justify-center
                                                        ${day.isCurrentMonth ? "text-gray-800" : "text-gray-400"}
                                                        ${day.isToday ? "bg-blue-500 text-white font-bold ring-2 ring-blue-200" : ""}
                                                        ${hasEvents && !day.isToday ? "bg-blue-100 text-blue-800 font-medium" : ""}
                                                        ${hasEvents ? "hover:bg-blue-200 hover:shadow-md" : "hover:bg-gray-100"}
                                                        transition-all duration-200
                                                    `}
                            onClick={() => handleDayClick(day)}
                            title={`${moment(day.date).format("MMMM D, YYYY")} - ${day.events.length} events`}
                          >
                            {day.date.date()}

                            {/* Event Count Badge */}
                            {hasEvents && (
                              <div className="absolute -top-1 -right-1">
                                <div
                                  className={`
                                                                rounded-full text-xs w-5 h-5 flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-lg
                                                                bg-red-500 text-white
                                                                ${day.events.length > 9 ? "w-6 h-5 text-[9px]" : ""}
                                                                transition-all duration-200 hover:scale-110
                                                            `}
                                >
                                  {day.events.length > 99
                                    ? "99+"
                                    : day.events.length}
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

        {/* Events List Modal */}
        {selectedDay && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden transform transition-all">
              {/* Header */}
              <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
                        <Calendar className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {moment(selectedDay).format("dddd, MMMM D, YYYY")}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {moment(selectedDay).format("[Day] DDD [of] YYYY")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">
                            {selectedDayEvents.length} event
                            {selectedDayEvents.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCloseEventList}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Events List */}
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
                          <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-1">
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center group-hover:border-red-500 transition-colors">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor: event.backgroundColor,
                                }}
                              />
                            </div>
                            {index < selectedDayEvents.length - 1 && (
                              <div className="w-px h-8 bg-gray-200"></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="font-medium text-gray-900 text-base group-hover:text-red-600 transition-colors">
                                {event.title}
                              </div>
                              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border font-mono">
                                #{event.id}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div className="text-sm">
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                  Time
                                </label>
                                <div className="text-gray-900">
                                  {moment(event.start).format("HH:mm")}
                                  {event.end &&
                                    ` - ${moment(event.end).format("HH:mm")}`}
                                </div>
                              </div>
                              <div className="text-sm">
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                  Type
                                </label>
                                <div className="text-gray-900 capitalize">
                                  {event.extendedProps?.type || "Event"}
                                </div>
                              </div>
                            </div>

                            {event.extendedProps?.status && (
                              <div className="flex items-center gap-3 flex-wrap">
                                <div className="text-sm">
                                  <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Status
                                  </label>
                                  <div
                                    className={`
                                                                    inline-flex px-2 py-1 rounded text-xs font-medium border
                                                                    ${
                                                                      event
                                                                        .extendedProps
                                                                        .status ===
                                                                      "Completed"
                                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                                        : event
                                                                              .extendedProps
                                                                              .status ===
                                                                            "In Progress"
                                                                          ? "bg-blue-50 text-blue-700 border-blue-200"
                                                                          : event
                                                                                .extendedProps
                                                                                .status ===
                                                                              "Confirmed"
                                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                                            : event
                                                                                  .extendedProps
                                                                                  .status ===
                                                                                "Pending"
                                                                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                                              : event
                                                                                    .extendedProps
                                                                                    .status ===
                                                                                  "Scheduled"
                                                                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                                                                : "bg-gray-50 text-gray-700 border-gray-200"
                                                                    }
                                                                `}
                                  >
                                    {event.extendedProps.status}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors">
                              <svg
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
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
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No events scheduled
                    </h4>
                    <p className="text-gray-600 text-sm mb-6">
                      This day is free of scheduled events.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for memo
    return (
      prevProps.events.length === nextProps.events.length &&
      prevProps.startDate.getTime() === nextProps.startDate.getTime() &&
      prevProps.endDate.getTime() === nextProps.endDate.getTime() &&
      JSON.stringify(prevProps.events) === JSON.stringify(nextProps.events)
    );
  }
);
