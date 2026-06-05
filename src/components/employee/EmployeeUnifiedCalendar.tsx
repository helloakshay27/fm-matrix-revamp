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
  Ticket,
  RefreshCw,
} from "lucide-react";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { getToken, getBaseUrl } from "@/utils/auth";

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

const selectFieldSx = {
  height: 36,
  "& .MuiInputBase-input, & .MuiSelect-select": { padding: "8px 12px" },
};

interface UnifiedCalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  type:
    | "Task"
    | "Issue"
    | "Meeting"
    | "Facility"
    | "Todo"
    | "Google Calendar"
    | "Ticket";
  status?: string;
  color?: string;
  description?: string;
  location?: string;
  redirectUrl?: string;
}

interface EmployeeUnifiedCalendarProps {
  onNavigateToDetails?: (type: string, id: string) => void;
}

export const EmployeeUnifiedCalendar: React.FC<
  EmployeeUnifiedCalendarProps
> = ({ onNavigateToDetails }) => {
  const [view, setView] = useState<
    | "dayGridMonth"
    | "timeGridWeek"
    | "timeGridDay"
    | "listWeek"
    | "year"
    | "schedule"
  >("schedule");
  const [date, setDate] = useState(new Date());
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isYearLoading, setIsYearLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAppliedCustomFilters, setHasAppliedCustomFilters] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const navigate = useNavigate();

  // Default date range = current month
  const getDefaultDateRange = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const fmt = (d: Date) => {
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return { dateFrom: fmt(firstDay), dateTo: fmt(lastDay) };
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
      showTasks: true,
      showIssues: true,
      showMeetings: true,
      showFacilities: true,
      showTodos: true,
      showGoogleCalendar: true,
      showTickets: true,
    };
  });

  // State for events fetched from API
  const [events, setEvents] = useState<UnifiedCalendarEvent[]>([]);

  // Helper function to get color based on event type
  const getColorForType = (type: string) => {
    switch (type) {
      case "Task":
        return "#3b82f6"; // blue
      case "Issue":
        return "#ef4444"; // red
      case "Meeting":
        return "#ec4899"; // pink
      case "Facility":
        return "#22c55e"; // green
      case "Todo":
        return "#f59e0b"; // orange
      case "Google Calendar":
        return "#8b5cf6"; // purple
      case "Ticket":
        return "#f97316"; // dark orange
      default:
        return "#6b7280"; // gray
    }
  };

  const userId = localStorage.getItem("userId") || "87989";

  // ── User list for attendees in Create Event modal ───────────────────────
  const [userList, setUserList] = useState<
    { id: number; full_name: string; email?: string }[]
  >([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getToken();
        const baseUrl = getBaseUrl();
        if (!token || !baseUrl) return;
        const res = await fetch(
          `${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setUserList(data.users || []);
      } catch {
        // silently ignore
      }
    };
    fetchUsers();
  }, []);

  // Fetch calendar data from API
  const fetchCalendarData = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const baseUrl = getBaseUrl();
      if (!token || !baseUrl) throw new Error("Not authenticated");

      // Build API URL with date filter parameters
      let apiUrl = `${baseUrl}/user_calendars.json?access_token=${token}&id=${userId}`;

      // Add date filters to API call
      if (activeFilters.dateFrom) {
        apiUrl += `&date_from=${activeFilters.dateFrom}`;
      }
      if (activeFilters.dateTo) {
        apiUrl += `&date_to=${activeFilters.dateTo}`;
      }

      console.log("📅 Fetching calendar data with filters:", {
        dateFrom: activeFilters.dateFrom,
        dateTo: activeFilters.dateTo,
        apiUrl,
      });

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch calendar data");
      }

      const data = await response.json();

      // ── Step 1: classify each item ──────────────────────────────────────────
      const rawItems = (data.user_calendars || []) as Array<
        Record<string, unknown>
      >;

      type RawItem = {
        id: number | string;
        title?: string;
        calendarable_type?: string;
        created_at?: string;
        start_at?: string;
        end_at?: string;
        duration_minutes?: number;
        status?: string;
        description?: string;
        color?: string;
        location?: string;
        redirect_url?: string;
      };

      const classified = rawItems.map(
        (item): RawItem & { eventType: string } => {
          const it = item as RawItem;
          let eventType = "Todo";
          switch (it.calendarable_type) {
            case "Todo":
              eventType = "Todo";
              break;
            case "GoogleCalendarEvent":
              eventType = "Google Calendar";
              break;
            case "Meeting":
              eventType = "Meeting";
              break;
            case "FacilityBooking":
            case "Facility Booking":
              eventType = "Facility";
              break;
            case "TaskManagement":
            case "Task Management":
            case "TaskAllocationTime":
            case "Task":
              eventType = "Task";
              break;
            case "Ticket":
              eventType = "Ticket";
              break;
            case "IssueAllocationTime":
            case "Issue":
              eventType = "Issue";
              break;
            default:
              eventType = "Todo";
          }
          return { ...it, eventType };
        }
      );

      // ── Step 2: group by calendar DATE (use start_at — the actual calendar day) ──
      const byDate: Record<string, typeof classified> = {};
      classified.forEach((it) => {
        const dateKey = moment(it.start_at || it.created_at).format(
          "YYYY-MM-DD"
        );
        if (!byDate[dateKey]) byDate[dateKey] = [];
        byDate[dateKey].push(it);
      });

      // ── Step 3: sort within each day by created_at, then assign slots ────
      // Day schedule starts at 09:00. Each task duration = duration_minutes || 30 min.
      const mappedEvents: UnifiedCalendarEvent[] = [];

      Object.entries(byDate).forEach(([dateKey, items]) => {
        // Sort by created_at ascending so oldest appears first
        const sorted = [...items].sort(
          (a, b) =>
            moment(a.created_at || a.start_at).valueOf() -
            moment(b.created_at || b.start_at).valueOf()
        );

        // Rolling cursor starting at 09:00 for this date
        const cursor = moment(`${dateKey}T09:00:00`);

        sorted.forEach((it) => {
          const durationMin =
            typeof it.duration_minutes === "number" && it.duration_minutes > 0
              ? it.duration_minutes
              : 30;

          const start = cursor.clone().toISOString();
          const end = cursor.clone().add(durationMin, "minutes").toISOString();

          mappedEvents.push({
            id: String(it.id),
            title: it.title || "Untitled Event",
            start,
            end,
            type: it.eventType as UnifiedCalendarEvent["type"],
            status: it.status,
            description: it.description,
            color: it.color || getColorForType(it.eventType),
            location: it.location,
            redirectUrl: it.redirect_url,
          });

          cursor.add(durationMin, "minutes");
        });
      });

      // ── Fetch Google Calendar events ────────────────────────────────────
      try {
        const gcParams = new URLSearchParams({
          range_type: "monthly",
          access_token: token || "",
        });
        const gcRes = await fetch(
          `${baseUrl}/api/google_calendar_events?${gcParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        if (gcRes.ok) {
          const gcData = await gcRes.json();
          const gcItems: UnifiedCalendarEvent[] = (
            gcData.google_calendar_events ||
            gcData.events ||
            gcData.data ||
            []
          ).map((ev: Record<string, unknown>) => ({
            id: `gc-${ev.id}`,
            title: String(ev.title || ev.summary || "Google Event"),
            start: String(ev.start_time || ev.start || ""),
            end:
              ev.end_time || ev.end ? String(ev.end_time || ev.end) : undefined,
            type: "Google Calendar" as const,
            color: "#8b5cf6",
            description: String(ev.description || ""),
            location: String(ev.location || ""),
            redirectUrl: String(ev.google_calendar_link || ""),
          }));
          mappedEvents.push(...gcItems);
        }
      } catch {
        // Google Calendar fetch failure is non-fatal
      }

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      toast.error("Failed to load calendar events");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch calendar data on mount and when filters change
  useEffect(() => {
    fetchCalendarData();
  }, [userId, activeFilters.dateFrom, activeFilters.dateTo]);

  // Event hover/click states
  const [hoveredEvent, setHoveredEvent] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Create Google Calendar Event modal state
  const [createEventModal, setCreateEventModal] = useState(false);
  const [createEventForm, setCreateEventForm] = useState({
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
    all_day: false,
    attendees: [] as { id: number; name: string; email: string }[],
    attendeeInput: "",
    calendar_email: "",
  });
  const [createEventLoading, setCreateEventLoading] = useState(false);

  // ── Find a time: availability for attendees ─────────────────────────────
  const [findTimeOpen, setFindTimeOpen] = useState(false);
  const [attendeeAvailability, setAttendeeAvailability] = useState<
    Record<
      number,
      { name: string; events: { title: string; start: string; end: string }[] }
    >
  >({});
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const fetchAttendeeAvailability = async (
    attendees: { id: number; name: string; email: string }[]
  ) => {
    if (!attendees.length) return;
    setAvailabilityLoading(true);
    const token = getToken();
    const baseUrl = getBaseUrl();
    if (!token || !baseUrl) {
      setAvailabilityLoading(false);
      return;
    }

    const results: typeof attendeeAvailability = {};

    await Promise.all(
      attendees.map(async (attendee) => {
        try {
          const params = new URLSearchParams({
            range_type: "monthly",
            user_id: String(attendee.id),
            access_token: token,
          });
          const res = await fetch(
            `${baseUrl}/api/google_calendar_events?${params.toString()}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();
          const rawEvs: Record<string, unknown>[] = Array.isArray(data.data)
            ? data.data
            : data.google_calendar_events || data.events || [];
          const evs = rawEvs.map((ev) => ({
            title: String(ev.title || ev.summary || "Busy"),
            start: String(ev.start_time || ev.start || ""),
            end: String(ev.end_time || ev.end || ""),
          }));
          results[attendee.id] = { name: attendee.name, events: evs };
        } catch {
          results[attendee.id] = { name: attendee.name, events: [] };
        }
      })
    );

    setAttendeeAvailability(results);
    setAvailabilityLoading(false);
  };

  const openCreateEventModal = (start: string, end?: string) => {
    setCreateEventForm({
      title: "",
      description: "",
      location: "",
      start_time: start,
      end_time: end || moment(start).add(1, "hour").format("YYYY-MM-DDTHH:mm"),
      all_day: false,
      attendees: [],
      attendeeInput: "",
      calendar_email: "",
    });
    setFindTimeOpen(false);
    setAttendeeAvailability({});
    setCreateEventModal(true);
  };

  const handleCreateEvent = async () => {
    if (!createEventForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setCreateEventLoading(true);
    try {
      const token = getToken();
      const baseUrl = getBaseUrl();
      if (!token || !baseUrl) {
        toast.error("Not authenticated");
        return;
      }
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const calendarEmail = user?.email || "";
      const payload = {
        google_calendar_event: {
          title: createEventForm.title,
          description: createEventForm.description,
          location: createEventForm.location,
          start_time: createEventForm.all_day
            ? moment(createEventForm.start_time).startOf("day").toISOString()
            : moment(createEventForm.start_time).toISOString(),
          end_time: createEventForm.all_day
            ? moment(createEventForm.start_time).endOf("day").toISOString()
            : moment(createEventForm.end_time).toISOString(),
          all_day: createEventForm.all_day,
          attendees: createEventForm.attendees.map((a) => a.email),
          calendar_email: calendarEmail,
        },
      };
      const res = await fetch(
        `${baseUrl}/api/google_calendar_events?access_token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create event");
      toast.success("Event created on Google Calendar");
      if (data?.google_calendar_link) {
        window.open(data.google_calendar_link, "_blank");
      }
      setCreateEventModal(false);
      fetchCalendarData();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create event"
      );
    } finally {
      setCreateEventLoading(false);
    }
  };

  // Helper function to parse filter date strings (DD/MM/YYYY format)
  const parseFilterDate = (dateStr: string): Date => {
    if (!dateStr || typeof dateStr !== "string") {
      return new Date();
    }

    const parts = dateStr.trim().split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS
      const year = parseInt(parts[2], 10);
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
      // Filter by event type
      if (!activeFilters.showTasks && event.type === "Task") return false;
      if (!activeFilters.showIssues && event.type === "Issue") return false;
      if (!activeFilters.showMeetings && event.type === "Meeting") return false;
      if (!activeFilters.showFacilities && event.type === "Facility")
        return false;
      if (!activeFilters.showTodos && event.type === "Todo") return false;
      if (!activeFilters.showGoogleCalendar && event.type === "Google Calendar")
        return false;
      if (!activeFilters.showTickets && event.type === "Ticket") return false;

      // Filter by date range
      if (activeFilters.dateFrom && activeFilters.dateTo) {
        const eventDate = moment(event.start);
        const filterDateFrom = moment(
          activeFilters.dateFrom,
          "DD/MM/YYYY"
        ).startOf("day");
        const filterDateTo = moment(activeFilters.dateTo, "DD/MM/YYYY").endOf(
          "day"
        );

        // Check if event date is within the filter range
        if (!eventDate.isBetween(filterDateFrom, filterDateTo, null, "[]")) {
          return false;
        }
      }

      return true;
    });
  }, [events, activeFilters]);

  // Transform events for FullCalendar (always timed, never all-day)
  const calendarEvents = useMemo(() => {
    return filteredEvents.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end || moment(event.start).add(30, "minutes").toISOString(),
      allDay: false,
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
    if (calendarApi && newView !== "year" && newView !== "schedule") {
      calendarApi.changeView(newView);
    }
  };

  const handleSelectEvent = (info: any) => {
    const eventType = info.event.extendedProps?.type;
    const eventId = info.event.id;
    const redirectUrl = info.event.extendedProps?.resource?.redirectUrl;

    // First priority: use redirect_url from API if available
    if (redirectUrl) {
      // Extract the path from the full URL
      try {
        const url = new URL(redirectUrl);
        navigate(url.pathname);
        return;
      } catch (e) {
        // If it's already a path, use it directly
        if (redirectUrl.startsWith("/")) {
          navigate(redirectUrl);
          return;
        }
      }
    }

    // Second priority: use onNavigateToDetails callback if provided
    if (onNavigateToDetails) {
      onNavigateToDetails(eventType, eventId);
    } else {
      // Fallback: Default navigation logic based on event type
      switch (eventType) {
        case "Task":
          navigate(`/vas/tasks/${eventId}`);
          break;
        case "Issue":
          navigate(`/vas/tickets/${eventId}`);
          break;
        case "Ticket":
          navigate(`/vas/tickets/${eventId}`);
          break;
        case "Meeting":
          navigate(`/employee/meetings/${eventId}`);
          break;
        case "Google Calendar":
          // Google Calendar events typically use redirect_url
          console.log("Google Calendar event:", eventId);
          break;
        case "Facility":
          navigate(`/employee/facilities/${eventId}`);
          break;
        case "Todo":
          navigate(`/vas/todo`);
          break;
        default:
          console.warn("Unknown event type:", eventType);
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
      case "Task":
        return <CheckSquare className="w-4 h-4" />;
      case "Issue":
        return <Ticket className="w-4 h-4" />;
      case "Ticket":
        return <Ticket className="w-4 h-4" />;
      case "Meeting":
        return <Users className="w-4 h-4" />;
      case "Google Calendar":
        return <Calendar className="w-4 h-4" />;
      case "Facility":
        return <Calendar className="w-4 h-4" />;
      case "Todo":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "Task":
        return "Task";
      case "Issue":
        return "Issue";
      case "Ticket":
        return "Ticket";
      case "Meeting":
        return "Meeting";
      case "Google Calendar":
        return "Google Calendar";
      case "Facility":
        return "Facility";
      case "Todo":
        return "To-Do";
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
    const titleLabel =
      view === "timeGridDay"
        ? moment(date).format("dddd, MMMM D, YYYY")
        : view === "timeGridWeek"
          ? `${moment(date).startOf("week").format("MMM D")} – ${moment(date).endOf("week").format("MMM D, YYYY")}`
          : moment(date).format("MMMM YYYY");

    return (
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
        {/* Left: Today + arrows + title */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setDate(new Date());
              const api = calendarRef.current?.getApi();
              if (api) api.today();
            }}
            className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => handleNavigate("prev")}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleNavigate("next")}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
          <span className="text-base font-semibold text-gray-800 ml-1">
            {titleLabel}
          </span>
        </div>

        {/* Right: view switcher */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-0.5">
          {(
            [
              { key: "schedule", label: "Schedule" },
              { key: "timeGridDay", label: "Day" },
              { key: "timeGridWeek", label: "Week" },
              { key: "dayGridMonth", label: "Month" },
              { key: "listWeek", label: "Agenda" },
              { key: "year", label: "52 Week" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleViewChange(key)}
              disabled={isYearLoading && key === "year"}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                view === key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {isYearLoading && key === "year" ? (
                <div className="flex items-center gap-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                  {label}
                </div>
              ) : (
                label
              )}
            </button>
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
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg flex-wrap">
            <span className="text-sm font-medium text-gray-700">Show:</span>
            <button
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  showTasks: !prev.showTasks,
                }))
              }
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeFilters.showTasks
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-gray-100 text-gray-500 border border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1">
                <CheckSquare className="w-3 h-3" />
                Tasks
              </div>
            </button>
            <button
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  showIssues: !prev.showIssues,
                }))
              }
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeFilters.showIssues
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-gray-100 text-gray-500 border border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1">
                <Ticket className="w-3 h-3" />
                Issues
              </div>
            </button>
            <button
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  showTickets: !prev.showTickets,
                }))
              }
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeFilters.showTickets
                  ? "bg-orange-100 text-orange-700 border border-orange-300"
                  : "bg-gray-100 text-gray-500 border border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1">
                <Ticket className="w-3 h-3" />
                Tickets
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
            <button
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  showGoogleCalendar: !prev.showGoogleCalendar,
                }))
              }
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeFilters.showGoogleCalendar
                  ? "bg-purple-100 text-purple-700 border border-purple-300"
                  : "bg-gray-100 text-gray-500 border border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Google Calendar
              </div>
            </button>
            <button
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  showFacilities: !prev.showFacilities,
                }))
              }
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeFilters.showFacilities
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-gray-100 text-gray-500 border border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Facilities
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
                  ? "bg-amber-100 text-amber-700 border border-amber-300"
                  : "bg-gray-100 text-gray-500 border border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                Todos
              </div>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sync Google Calendar */}
          <Button
            onClick={async () => {
              const user = JSON.parse(localStorage.getItem("user") || "{}");
              const email =
                user?.email ||
                localStorage.getItem("userEmail") ||
                localStorage.getItem("email");
              if (!email) {
                toast.error("User email not found. Please log in again.");
                return;
              }
              try {
                toast.info("Checking Google Calendar connection...");
                const domain = getBaseUrl()?.replace(/^https?:\/\//, "") || "";
                const statusRes = await fetch(
                  `https://${domain}/google_calander/status?email=${encodeURIComponent(email)}`
                );
                if (!statusRes.ok) throw new Error("Failed to check status");
                const statusData = await statusRes.json();
                if (statusData.connected === true) {
                  toast.info("Syncing Google Calendar events...");
                  const syncRes = await fetch(
                    `https://${domain}/google_calander/sync?email=${encodeURIComponent(email)}`
                  );
                  if (syncRes.ok) {
                    toast.success("Google Calendar synced!");
                    fetchCalendarData();
                  } else toast.error("Failed to sync");
                } else {
                  toast.info("Opening Google Calendar connection...");
                  window.open(
                    `https://${domain}/google_oauth/connect?email=${encodeURIComponent(email)}`,
                    "_blank"
                  );
                }
              } catch {
                toast.error("Failed to process Google Calendar request");
              }
            }}
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 h-10"
          >
            <RefreshCw className="h-4 w-4" />
            Sync Google Calendar
          </Button>
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
      </div>

      {/* Legends */}
      <div className="flex items-center gap-6 text-sm flex-wrap">
        <span className="font-medium">Legends</span>
        {[
          ["#3b82f6", "Tasks", <CheckSquare className="w-3 h-3" />],
          ["#ef4444", "Issues", <Ticket className="w-3 h-3" />],
          ["#f97316", "Tickets", <Ticket className="w-3 h-3" />],
          ["#ec4899", "Meetings", <Users className="w-3 h-3" />],
          ["#8b5cf6", "Google Calendar", <Calendar className="w-3 h-3" />],
          ["#22c55e", "Facilities", <Calendar className="w-3 h-3" />],
          ["#f59e0b", "Todos", <Briefcase className="w-3 h-3" />],
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
        className="bg-white border border-gray-200 rounded-xl relative overflow-hidden"
        style={{ minHeight: "640px" }}
      >
        <div className="px-4 pt-4">
          <CustomToolbar />
        </div>

        {view === "year" ? (
          isYearLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mb-3" />
                <p className="text-gray-500 text-sm">
                  Loading 52-week calendar…
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 overflow-y-auto" style={{ maxHeight: "600px" }}>
              <YearlyView
                events={calendarEvents}
                onSelectEvent={handleSelectEvent}
                startDate={parseFilterDate(activeFilters.dateFrom)}
                endDate={parseFilterDate(activeFilters.dateTo)}
              />
            </div>
          )
        ) : view === "schedule" ? (
          <GoogleScheduleView
            events={filteredEvents}
            date={date}
            onEventClick={(ev) =>
              setSelectedEvent({
                ...ev,
                backgroundColor: ev.color,
                extendedProps: {
                  type: ev.type,
                  status: ev.status,
                  description: ev.description,
                  location: ev.location,
                  resource: ev,
                },
              })
            }
            getColorForType={getColorForType}
            getEventTypeIcon={getEventTypeIcon}
            getEventTypeLabel={getEventTypeLabel}
          />
        ) : (
          <div className="px-2 pb-2" style={{ height: "590px" }}>
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
              height="100%"
              eventDisplay="block"
              dayMaxEvents={3}
              moreLinkClick="popover"
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }}
              slotLabelFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }}
              allDaySlot={false}
              slotMinTime="08:00:00"
              slotMaxTime="22:00:00"
              slotDuration="00:30:00"
              nowIndicator={true}
              selectable={true}
              selectMirror={true}
              dateClick={(info) => {
                const start = moment(info.dateStr).format("YYYY-MM-DDTHH:mm");
                const end = moment(info.dateStr)
                  .add(1, "hour")
                  .format("YYYY-MM-DDTHH:mm");
                openCreateEventModal(start, end);
              }}
              select={(info) => {
                const start = moment(info.startStr).format("YYYY-MM-DDTHH:mm");
                const end = moment(info.endStr).format("YYYY-MM-DDTHH:mm");
                openCreateEventModal(start, end);
              }}
              dayHeaderFormat={{ weekday: "short", day: "numeric" }}
              eventContent={(eventInfo) => {
                const dur = moment(eventInfo.event.end).diff(
                  moment(eventInfo.event.start),
                  "minutes"
                );
                const showEnd = dur >= 30;
                return (
                  <div className="flex items-start gap-1 px-1.5 py-1 h-full overflow-hidden">
                    <div
                      className="w-[3px] rounded-full flex-shrink-0 self-stretch"
                      style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold leading-tight truncate">
                        {eventInfo.event.title}
                      </div>
                      <div className="text-[10px] opacity-80 mt-0.5">
                        {moment(eventInfo.event.start).format("h:mm a")}
                        {showEnd &&
                          ` – ${moment(eventInfo.event.end).format("h:mm a")}`}
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mb-3" />
              <p className="text-gray-500 text-sm font-medium">
                Loading events…
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

      {/* ── Create Google Calendar Event Modal ── */}
      {createEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">New Event</h2>
              <button
                onClick={() => setCreateEventModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
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

            {/* Body — 2-column layout */}
            <div className="flex gap-0 divide-x divide-gray-100">
              {/* ── Left column: form fields ── */}
              <div className="flex-1 px-6 py-5 space-y-4 min-w-0">
                {/* Title */}
                <input
                  type="text"
                  placeholder="Add title"
                  value={createEventForm.title}
                  onChange={(e) =>
                    setCreateEventForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full text-xl font-medium border-0 border-b-2 border-blue-500 focus:outline-none pb-1 placeholder-gray-300"
                  autoFocus
                />

                {/* All Day */}
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={createEventForm.all_day}
                    onChange={(e) =>
                      setCreateEventForm((f) => ({
                        ...f,
                        all_day: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600"
                  />
                  All day
                </label>

                {/* Date / Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Start
                    </label>
                    <input
                      type={createEventForm.all_day ? "date" : "datetime-local"}
                      value={
                        createEventForm.all_day
                          ? createEventForm.start_time.slice(0, 10)
                          : createEventForm.start_time
                      }
                      onChange={(e) =>
                        setCreateEventForm((f) => ({
                          ...f,
                          start_time: e.target.value,
                        }))
                      }
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  {!createEventForm.all_day && (
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        End
                      </label>
                      <input
                        type="datetime-local"
                        value={createEventForm.end_time}
                        onChange={(e) =>
                          setCreateEventForm((f) => ({
                            ...f,
                            end_time: e.target.value,
                          }))
                        }
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 mt-2 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Add location"
                    value={createEventForm.location}
                    onChange={(e) =>
                      setCreateEventForm((f) => ({
                        ...f,
                        location: e.target.value,
                      }))
                    }
                    className="flex-1 text-sm border-0 border-b border-gray-200 focus:outline-none focus:border-blue-400 py-1"
                  />
                </div>

                {/* Description */}
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 mt-2 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  <textarea
                    placeholder="Add description"
                    value={createEventForm.description}
                    onChange={(e) =>
                      setCreateEventForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="flex-1 text-sm border-0 border-b border-gray-200 focus:outline-none focus:border-blue-400 py-1 resize-none"
                  />
                </div>
              </div>

              {/* ── Right column: attendees ── */}
              <div className="w-64 flex-shrink-0 px-5 py-5 space-y-3">
                {/* Section header */}
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Guests
                </div>

                {/* Guests dropdown — same style as TaskFilterDialog */}
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel shrink>Add Guest</InputLabel>
                  <MuiSelect
                    value=""
                    label="Add Guest"
                    displayEmpty
                    MenuProps={selectMenuProps}
                    sx={selectFieldSx}
                    onChange={(e) => {
                      const uid = Number(e.target.value);
                      if (!uid) return;
                      const user = userList.find((u) => u.id === uid);
                      if (!user) return;
                      if (createEventForm.attendees.some((a) => a.id === uid))
                        return;
                      setCreateEventForm((f) => ({
                        ...f,
                        attendees: [
                          ...f.attendees,
                          {
                            id: user.id,
                            name: user.full_name,
                            email: user.email || "",
                          },
                        ],
                      }));
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select guest…</em>
                    </MenuItem>
                    {userList
                      .filter(
                        (u) =>
                          !createEventForm.attendees.some((a) => a.id === u.id)
                      )
                      .map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.full_name}
                          {u.email ? ` (${u.email})` : ""}
                        </MenuItem>
                      ))}
                  </MuiSelect>
                </FormControl>

                {/* Selected attendees */}
                {createEventForm.attendees.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {createEventForm.attendees.map((att) => (
                      <span
                        key={att.id}
                        className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-1"
                      >
                        <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                          {att.name[0]?.toUpperCase()}
                        </span>
                        {att.name}
                        <button
                          type="button"
                          onClick={() =>
                            setCreateEventForm((f) => ({
                              ...f,
                              attendees: f.attendees.filter(
                                (a) => a.id !== att.id
                              ),
                            }))
                          }
                          className="ml-0.5 text-blue-400 hover:text-blue-700 leading-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Find a time button */}
                {createEventForm.attendees.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const opening = !findTimeOpen;
                      setFindTimeOpen(opening);
                      if (opening) {
                        fetchAttendeeAvailability(createEventForm.attendees);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {findTimeOpen ? "Hide availability" : "Find a time"}
                  </button>
                )}
              </div>
            </div>

            {/* ── Find a time panel (Google Calendar style) ── */}
            {findTimeOpen && createEventForm.attendees.length > 0 && (
              <div className="mx-6 mb-4 border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#C72030]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs font-semibold text-gray-800">
                      Scheduling assistant
                    </span>
                    {/* Day navigation */}
                    <div className="flex items-center gap-1 ml-3">
                      <button
                        type="button"
                        onClick={() => {
                          const prev = moment(
                            createEventForm.start_time
                          ).subtract(1, "day");
                          const startT = moment(
                            createEventForm.start_time
                          ).format("HH:mm");
                          const endT = moment(createEventForm.end_time).format(
                            "HH:mm"
                          );
                          const d = prev.format("YYYY-MM-DD");
                          setCreateEventForm((f) => ({
                            ...f,
                            start_time: `${d}T${startT}`,
                            end_time: `${d}T${endT}`,
                          }));
                        }}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500"
                      >
                        ‹
                      </button>
                      <span className="text-xs font-medium text-gray-700 min-w-[80px] text-center">
                        {moment(createEventForm.start_time).format(
                          "ddd, MMM D"
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = moment(createEventForm.start_time).add(
                            1,
                            "day"
                          );
                          const startT = moment(
                            createEventForm.start_time
                          ).format("HH:mm");
                          const endT = moment(createEventForm.end_time).format(
                            "HH:mm"
                          );
                          const d = next.format("YYYY-MM-DD");
                          setCreateEventForm((f) => ({
                            ...f,
                            start_time: `${d}T${startT}`,
                            end_time: `${d}T${endT}`,
                          }));
                        }}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      fetchAttendeeAvailability(createEventForm.attendees)
                    }
                    className="text-[10px] text-[#C72030] hover:underline flex items-center gap-1 font-medium"
                  >
                    {availabilityLoading ? (
                      <svg
                        className="w-3 h-3 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                    ) : (
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
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    )}
                    Refresh
                  </button>
                </div>

                {availabilityLoading ? (
                  <div className="flex items-center justify-center py-8 text-xs text-gray-400 gap-2">
                    <svg
                      className="w-4 h-4 animate-spin text-[#C72030]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Checking availability…
                  </div>
                ) : (
                  (() => {
                    const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8–20
                    const dateBase = moment(createEventForm.start_time).format(
                      "YYYY-MM-DD"
                    );
                    const dayStart = moment(`${dateBase}T08:00`);
                    const dayEnd = moment(`${dateBase}T20:00`);
                    const totalMin = dayEnd.diff(dayStart, "minutes"); // 720

                    const toLeft = (m: moment.Moment) =>
                      `${Math.max(0, Math.min(100, (m.diff(dayStart, "minutes") / totalMin) * 100))}%`;
                    const toWidth = (s: moment.Moment, e: moment.Moment) =>
                      `${Math.max(0.5, Math.min(100 - parseFloat(toLeft(s)), (e.diff(s, "minutes") / totalMin) * 100))}%`;

                    const evStart = moment(createEventForm.start_time);
                    const evEnd = moment(
                      createEventForm.end_time || createEventForm.start_time
                    ).add(
                      moment(createEventForm.end_time).isValid() ? 0 : 1,
                      "hour"
                    );

                    // Filter each attendee's events to this day
                    const evsByAttendee: Record<
                      number,
                      { title: string; start: string; end: string }[]
                    > = {};
                    createEventForm.attendees.forEach((att) => {
                      const info = attendeeAvailability[att.id];
                      evsByAttendee[att.id] = (info?.events || []).filter(
                        (ev) =>
                          moment(ev.start).format("YYYY-MM-DD") === dateBase
                      );
                    });

                    const ROW_H = 32; // px

                    return (
                      <div className="px-0 pb-0">
                        {/* Time grid */}
                        <div className="flex">
                          {/* Name column */}
                          <div className="flex-shrink-0 w-[110px] border-r border-gray-100">
                            {/* spacer for hour header */}
                            <div style={{ height: 28 }} />
                            {createEventForm.attendees.map((att) => (
                              <div
                                key={att.id}
                                style={{ height: ROW_H }}
                                className="flex items-center px-3 border-t border-gray-100"
                              >
                                <div className="w-6 h-6 rounded-full bg-[#C72030]/10 flex items-center justify-center text-[10px] font-bold text-[#C72030] flex-shrink-0">
                                  {att.name[0]?.toUpperCase()}
                                </div>
                                <span
                                  className="ml-1.5 text-[10px] text-gray-700 font-medium truncate"
                                  title={att.name}
                                >
                                  {att.name.split(" ")[0]}
                                </span>
                              </div>
                            ))}
                            {/* Your event row label */}
                            <div
                              style={{ height: ROW_H }}
                              className="flex items-center px-3 border-t border-gray-100 bg-[#C72030]/5"
                            >
                              <div className="w-6 h-6 rounded-full bg-[#C72030] flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <span className="ml-1.5 text-[10px] text-[#C72030] font-semibold truncate">
                                Your event
                              </span>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="flex-1 overflow-x-auto">
                            {/* Hour header */}
                            <div
                              className="flex border-b border-gray-200 bg-gray-50"
                              style={{ height: 28 }}
                            >
                              {HOURS.map((h) => (
                                <div
                                  key={h}
                                  className="flex-1 text-center text-[9px] text-gray-400 font-medium flex items-center justify-center border-r border-gray-100 last:border-r-0"
                                >
                                  {h === 12
                                    ? "12 PM"
                                    : h < 12
                                      ? `${h} AM`
                                      : `${h - 12} PM`}
                                </div>
                              ))}
                            </div>

                            {/* Attendee rows */}
                            {createEventForm.attendees.map((att) => {
                              const hasFetched = att.id in attendeeAvailability;
                              const dayEvs = evsByAttendee[att.id] || [];
                              return (
                                <div
                                  key={att.id}
                                  style={{ height: ROW_H }}
                                  className="relative border-t border-gray-100"
                                >
                                  {/* Hour grid lines */}
                                  <div className="absolute inset-0 flex pointer-events-none">
                                    {HOURS.map((h) => (
                                      <div
                                        key={h}
                                        className="flex-1 border-r border-gray-50 last:border-r-0"
                                      />
                                    ))}
                                  </div>

                                  {!hasFetched && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div
                                        className="h-3 rounded bg-gray-100 animate-pulse"
                                        style={{ width: "60%" }}
                                      />
                                    </div>
                                  )}
                                  {hasFetched && dayEvs.length === 0 && (
                                    <div className="absolute inset-0 flex items-center pl-2">
                                      <span className="text-[9px] text-emerald-600 font-medium">
                                        Free
                                      </span>
                                    </div>
                                  )}
                                  {dayEvs.map((ev, i) => {
                                    const evS = moment(ev.start);
                                    const evE = moment(ev.end);
                                    if (!evS.isValid() || !evE.isValid())
                                      return null;
                                    return (
                                      <div
                                        key={i}
                                        title={`${ev.title}\n${evS.format("h:mma")} – ${evE.format("h:mma")}`}
                                        className="absolute top-1 bottom-1 rounded flex items-center overflow-hidden"
                                        style={{
                                          left: toLeft(evS),
                                          width: toWidth(evS, evE),
                                          backgroundColor: "#C72030",
                                          opacity: 0.75,
                                        }}
                                      >
                                        <span className="text-white text-[8px] font-medium px-1 truncate leading-none">
                                          {ev.title}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}

                            {/* Your event row */}
                            <div
                              style={{ height: ROW_H }}
                              className="relative border-t border-gray-200 bg-[#C72030]/5"
                            >
                              <div className="absolute inset-0 flex pointer-events-none">
                                {HOURS.map((h) => (
                                  <div
                                    key={h}
                                    className="flex-1 border-r border-[#C72030]/10 last:border-r-0"
                                  />
                                ))}
                              </div>
                              {evStart.format("YYYY-MM-DD") === dateBase && (
                                <div
                                  className="absolute top-1 bottom-1 rounded flex items-center overflow-hidden"
                                  style={{
                                    left: toLeft(evStart),
                                    width: toWidth(evStart, evEnd),
                                    backgroundColor: "#C72030",
                                  }}
                                >
                                  <span className="text-white text-[8px] font-semibold px-1 truncate leading-none">
                                    {createEventForm.title || "New Event"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Footer legend */}
                        <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-100 bg-gray-50 text-[9px] text-gray-500">
                          <div className="flex items-center gap-1">
                            <div
                              className="w-3 h-2.5 rounded-sm"
                              style={{
                                backgroundColor: "#C72030",
                                opacity: 0.75,
                              }}
                            />
                            Busy
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-2.5 rounded-sm bg-emerald-100 border border-emerald-300" />
                            Free
                          </div>
                          <div className="flex items-center gap-1">
                            <div
                              className="w-3 h-2.5 rounded-sm"
                              style={{ backgroundColor: "#C72030" }}
                            />
                            Your event
                          </div>
                          <span className="ml-auto text-gray-400">
                            Use ‹ › to navigate days
                          </span>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setCreateEventModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                disabled={createEventLoading}
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg transition-colors flex items-center gap-2"
              >
                {createEventLoading && (
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                )}
                Save
              </button>
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
                    key: "showTasks",
                    label: "Tasks",
                    icon: <CheckSquare className="w-4 h-4" />,
                  },
                  {
                    key: "showIssues",
                    label: "Issues",
                    icon: <Ticket className="w-4 h-4" />,
                  },
                  {
                    key: "showTickets",
                    label: "Tickets",
                    icon: <Ticket className="w-4 h-4" />,
                  },
                  {
                    key: "showMeetings",
                    label: "Meetings",
                    icon: <Users className="w-4 h-4" />,
                  },
                  {
                    key: "showGoogleCalendar",
                    label: "Google Calendar",
                    icon: <Calendar className="w-4 h-4" />,
                  },
                  {
                    key: "showFacilities",
                    label: "Facilities",
                    icon: <Calendar className="w-4 h-4" />,
                  },
                  {
                    key: "showTodos",
                    label: "To-Do Items",
                    icon: <Briefcase className="w-4 h-4" />,
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
                    showTasks: true,
                    showIssues: true,
                    showTickets: true,
                    showMeetings: true,
                    showGoogleCalendar: true,
                    showFacilities: true,
                    showTodos: true,
                  });
                  setHasAppliedCustomFilters(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  setIsFilterModalOpen(false);
                  setHasAppliedCustomFilters(true);
                }}
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

// ── Google Calendar-style Schedule View ────────────────────────────────────
interface ScheduleViewProps {
  events: UnifiedCalendarEvent[];
  date: Date;
  onEventClick: (event: UnifiedCalendarEvent) => void;
  getColorForType: (type: string) => string;
  getEventTypeIcon: (type: string) => React.ReactNode;
  getEventTypeLabel: (type: string) => string;
}

const GoogleScheduleView: React.FC<ScheduleViewProps> = ({
  events,
  date,
  onEventClick,
  getColorForType,
  getEventTypeIcon,
  getEventTypeLabel,
}) => {
  // Schedule: today at top, descending into the past (up to 90 days back)
  const windowStart = moment().subtract(90, "days").startOf("day");
  const windowEnd = moment().endOf("day");

  // Group events by date key (YYYY-MM-DD from their start time)
  const byDate = useMemo(() => {
    const map: Record<string, UnifiedCalendarEvent[]> = {};
    events.forEach((ev) => {
      const key = moment(ev.start).format("YYYY-MM-DD");
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    });
    return map;
  }, [events]);

  // Build descending list: today first → oldest last; always include today
  const days = useMemo(() => {
    const set = new Set<string>(Object.keys(byDate));
    set.add(moment().format("YYYY-MM-DD")); // always show today
    return Array.from(set)
      .filter((k) => {
        const m = moment(k);
        return (
          m.isSameOrAfter(windowStart, "day") &&
          m.isSameOrBefore(windowEnd, "day")
        );
      })
      .sort((a, b) => (a < b ? 1 : -1)); // descending: today → past
  }, [byDate, windowStart, windowEnd]);

  const formatTime = (ev: UnifiedCalendarEvent) => {
    const s = moment(ev.start);
    const e = ev.end ? moment(ev.end) : null;
    if (!e) return s.format("h:mm a");
    return `${s.format("h:mm")} – ${e.format("h:mm a")}`;
  };

  if (days.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Calendar className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm font-medium">No events this month</p>
        <p className="text-xs mt-1">Try adjusting the date range in Filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto" style={{ maxHeight: "570px" }}>
      {days.map((dateKey) => {
        const isToday = dateKey === moment().format("YYYY-MM-DD");
        const dayEvents = (byDate[dateKey] || [])
          .slice()
          .sort(
            (a, b) => moment(a.start).valueOf() - moment(b.start).valueOf()
          );

        return (
          <div
            key={dateKey}
            className={`flex border-b border-gray-100 last:border-0 ${isToday ? "bg-blue-50/30" : ""}`}
          >
            {/* Date column */}
            <div className="flex-shrink-0 w-24 px-3 py-4 flex flex-col items-center gap-0.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isToday ? "bg-blue-600 text-white" : "text-gray-700"
                }`}
              >
                {moment(dateKey).format("D")}
              </div>
              <div
                className={`text-[11px] font-semibold uppercase tracking-wide ${isToday ? "text-blue-600" : "text-gray-400"}`}
              >
                {moment(dateKey).format("ddd")}
              </div>
              <div className="text-[10px] text-gray-400">
                {moment(dateKey).format("MMM")}
              </div>
            </div>

            {/* Events column */}
            <div className="flex-1 py-2 pr-4 min-w-0 space-y-1.5">
              {dayEvents.length === 0 ? (
                <div className="py-3 text-xs text-gray-400 italic">
                  No events
                </div>
              ) : (
                dayEvents.map((ev) => {
                  const color = ev.color || getColorForType(ev.type);
                  const durMin = ev.end
                    ? moment(ev.end).diff(moment(ev.start), "minutes")
                    : 30;
                  return (
                    <div
                      key={ev.id}
                      onClick={() => onEventClick(ev)}
                      className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white hover:shadow-sm transition-all group"
                    >
                      {/* Color bar */}
                      <div
                        className="w-1 rounded-full flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: color, minHeight: "36px" }}
                      />
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                            {ev.title}
                          </span>
                          <span
                            className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white leading-none"
                            style={{ backgroundColor: color }}
                          >
                            {getEventTypeLabel(ev.type)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            {getEventTypeIcon(ev.type)}
                            {formatTime(ev)}
                          </span>
                          <span className="text-gray-300">·</span>
                          <span>{durMin} min</span>
                          {ev.status && (
                            <>
                              <span className="text-gray-300">·</span>
                              <span className="capitalize bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                                {ev.status}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
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
