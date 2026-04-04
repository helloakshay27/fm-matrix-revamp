import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  format,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  addDays,
  subDays,
} from "date-fns";

export interface UserCalendarItem {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string | null;
  all_day: boolean;
  status: string | null;
  color: string | null;
  calendarable_type: "TaskAllocationTime" | "IssueAllocationTime" | "Todo";
  calendarable_id: number;
  created_at: string;
  updated_at: string;
  url: string;
  redirect_url: string;
  user: {
    id: number;
    name: string;
    email: string;
    mobile: string;
  };
}

interface UseUserCalendarsOptions {
  viewType: "hourly" | "weekly" | "monthly";
  selectedDate?: Date;
}

interface UseUserCalendarsReturn {
  calendars: UserCalendarItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  tasks: UserCalendarItem[];
  todos: UserCalendarItem[];
  issues: UserCalendarItem[];
}

export const useUserCalendars = ({
  viewType,
  selectedDate = new Date(),
}: UseUserCalendarsOptions): UseUserCalendarsReturn => {
  const [calendars, setCalendars] = useState<UserCalendarItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDateRange = useCallback(() => {
    const now = selectedDate;
    let dateFrom: Date;
    let dateTo: Date;

    switch (viewType) {
      case "hourly":
        // For hourly view, get today's data
        dateFrom = startOfDay(now);
        dateTo = endOfDay(now);
        break;
      case "weekly":
        // For weekly view, get current week + next few days
        dateFrom = subDays(now, 3);
        dateTo = addDays(now, 7);
        break;
      case "monthly":
        // For monthly view, get entire month
        dateFrom = startOfMonth(now);
        dateTo = endOfMonth(now);
        break;
      default:
        dateFrom = startOfDay(now);
        dateTo = endOfDay(now);
    }

    return {
      dateFrom: format(dateFrom, "dd/MM/yyyy"),
      dateTo: format(dateTo, "dd/MM/yyyy"),
    };
  }, [viewType, selectedDate]);

  const fetchCalendars = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const baseUrl =
        localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id;

      if (!userId || !token) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      const { dateFrom, dateTo } = getDateRange();

      const response = await axios.get(
        `${protocol}${baseUrl}/user_calendars.json`,
        {
          params: {
            id: userId,
            date_from: dateFrom,
            date_to: dateTo,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const calendarData = response.data?.user_calendars || [];
      setCalendars(calendarData);
    } catch (err) {
      console.error("Failed to fetch user calendars:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch calendar data"
      );
    } finally {
      setIsLoading(false);
    }
  }, [getDateRange]);

  useEffect(() => {
    fetchCalendars();
  }, [fetchCalendars]);

  // Filter calendars by type
  const tasks = calendars.filter(
    (c) => c.calendarable_type === "TaskAllocationTime"
  );
  const todos = calendars.filter((c) => c.calendarable_type === "Todo");
  const issues = calendars.filter(
    (c) => c.calendarable_type === "IssueAllocationTime"
  );

  return {
    calendars,
    isLoading,
    error,
    refetch: fetchCalendars,
    tasks,
    todos,
    issues,
  };
};

// Helper function to group calendars by date
export const groupCalendarsByDate = (calendars: UserCalendarItem[]) => {
  const grouped: Record<string, UserCalendarItem[]> = {};

  calendars.forEach((item) => {
    const dateKey = format(new Date(item.start_at), "yyyy-MM-dd");
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(item);
  });

  return grouped;
};

// Helper function to group calendars by hour
export const groupCalendarsByHour = (calendars: UserCalendarItem[]) => {
  const grouped: Record<number, UserCalendarItem[]> = {};

  calendars.forEach((item) => {
    const hour = new Date(item.start_at).getHours();
    if (!grouped[hour]) {
      grouped[hour] = [];
    }
    grouped[hour].push(item);
  });

  return grouped;
};

// Helper to get task count per hour for today
export const getHourlyTaskCounts = (
  calendars: UserCalendarItem[],
  date: Date
) => {
  const todayStr = format(date, "yyyy-MM-dd");
  const todayItems = calendars.filter(
    (c) => format(new Date(c.start_at), "yyyy-MM-dd") === todayStr
  );

  const hourCounts: Record<number, number> = {};

  todayItems.forEach((item) => {
    const hour = new Date(item.start_at).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  return hourCounts;
};

// Helper to get task count per day for weekly view
export const getDailyTaskCounts = (calendars: UserCalendarItem[]) => {
  const dayCounts: Record<string, number> = {};

  calendars.forEach((item) => {
    const dateKey = format(new Date(item.start_at), "yyyy-MM-dd");
    dayCounts[dateKey] = (dayCounts[dateKey] || 0) + 1;
  });

  return dayCounts;
};
