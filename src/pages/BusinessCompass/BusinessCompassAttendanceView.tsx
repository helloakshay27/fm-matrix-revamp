import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

type AttendanceStatus = "present" | "absent" | "half_day" | "leave" | "weekend";

interface AttendanceRecord {
  id?: string | number;
  date?: string;
  attendance_date?: string;
  day?: string;
  punched_in_time?: string;
  punched_out_time?: string;
  duration?: string;
  status?: string;
  attendance_status?: string;
  leave_type?: string;
}

interface CalendarDay {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  status: AttendanceStatus | "none";
}

const STATUS_META: Record<
  AttendanceStatus,
  { label: string; dot: string; bg?: string }
> = {
  present: { label: "Present", dot: "#41d77a" },
  absent: { label: "Absent", dot: "#ef4444" },
  half_day: { label: "Half Day", dot: "#f5b62f" },
  leave: { label: "Leave", dot: "#3b82f6" },
  weekend: { label: "Weekend/Holiday", dot: "#d9d9d9" },
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseAttendanceDate = (value?: string) => {
  if (!value) return null;

  if (value.includes("/")) {
    const [day, month, year] = value.split("/").map(Number);
    if (day && month && year) return new Date(year, month - 1, day);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

const normalizeStatus = (
  record: AttendanceRecord | undefined,
  date: Date,
  today: Date
): AttendanceStatus | "none" => {
  if (!record) {
    if (isWeekend(date)) return "weekend";
    if (date < today) return "absent";
    return "none";
  }

  const raw = (
    record.status ||
    record.attendance_status ||
    record.leave_type ||
    ""
  )
    .toLowerCase()
    .replace(/\s+/g, "_");

  if (raw.includes("leave")) return "leave";
  if (raw.includes("half")) return "half_day";
  if (raw.includes("absent")) return "absent";
  if (raw.includes("holiday") || raw.includes("weekend")) return "weekend";
  if (raw.includes("present") || record.punched_in_time || record.punched_out_time) {
    return "present";
  }

  if (isWeekend(date)) return "weekend";
  return date < today ? "absent" : "none";
};

const BusinessCompassAttendanceView = () => {
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const token = localStorage.getItem("token") || "";
  const userId = JSON.parse(localStorage.getItem("user") || "{}").id || "";
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("monthly");
  const [selectedMonth] = useState(() => new Date());

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!baseUrl || !token || !userId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `https://${baseUrl}/pms/attendances/${userId}.json?page=1&per_page=500`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAttendanceData(response.data.attendances || []);
      } catch (error) {
        console.error("Failed to fetch attendance data", error);
        toast.error("Failed to fetch attendance data");
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [baseUrl, token, userId]);

  const recordsByDate = useMemo(() => {
    return attendanceData.reduce<Record<string, AttendanceRecord>>((acc, record) => {
      const date = parseAttendanceDate(record.date || record.attendance_date);
      if (date) acc[toDateKey(date)] = record;
      return acc;
    }, {});
  }, [attendanceData]);

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOffset = (start.getDay() + 6) % 7;
    const days: CalendarDay[] = [];

    for (let i = 0; i < startOffset; i += 1) {
      const date = new Date(year, month, 1 - startOffset + i);
      days.push({
        date,
        dayNumber: date.getDate(),
        inCurrentMonth: false,
        status: "none",
      });
    }

    for (let day = 1; day <= end.getDate(); day += 1) {
      const date = new Date(year, month, day);
      const key = toDateKey(date);
      days.push({
        date,
        dayNumber: day,
        inCurrentMonth: true,
        status: normalizeStatus(recordsByDate[key], date, today),
      });
    }

    if (viewMode === "weekly") {
      const todayKey = toDateKey(today);
      const todayIndex = days.findIndex((day) => toDateKey(day.date) === todayKey);
      const safeIndex = todayIndex >= 0 ? todayIndex : startOffset;
      const weekStart = Math.max(0, safeIndex - ((days[safeIndex].date.getDay() + 6) % 7));
      return days.slice(weekStart, weekStart + 7);
    }

    return days;
  }, [recordsByDate, selectedMonth, viewMode]);

  const currentMonthDays = calendarDays.filter((day) => day.inCurrentMonth);
  const elapsedWorkingDays = currentMonthDays.filter((day) => {
    const date = new Date(day.date);
    date.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today && day.status !== "weekend";
  }).length;
  const presentCount = currentMonthDays.filter((day) => day.status === "present").length;
  const absentCount = currentMonthDays.filter((day) => day.status === "absent").length;
  const leaveCount = currentMonthDays.filter((day) => day.status === "leave").length;
  const kpi = elapsedWorkingDays
    ? Math.round((presentCount / elapsedWorkingDays) * 100)
    : 0;

  const monthLabel = selectedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const summaryCards = [
    { label: "KPI", value: `${kpi}%`, bg: "bg-[#eeedfb]" },
    { label: "Issues", value: absentCount, bg: "bg-[#f8dddd]" },
    { label: "Leave", value: `${leaveCount}/${elapsedWorkingDays}`, bg: "bg-[#dcedff]" },
    { label: "Present", value: `${presentCount}/${elapsedWorkingDays}`, bg: "bg-[#e8f5f0]" },
  ];

  return (
    <div className="space-y-5 rounded-2xl bg-white p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`${card.bg} flex min-h-[92px] flex-col items-center justify-center rounded-xl px-4 py-4 text-center sm:px-5`}
          >
            <p className="text-sm font-medium text-[#444]">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold leading-none text-black sm:text-3xl">
              {loading ? "..." : card.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:flex-wrap">
          <div>
            <h3 className="text-base font-bold text-[#1a1a1a]">Calendar View</h3>
            <p className="mt-1 text-xs text-gray-500">{monthLabel}</p>
          </div>

          <div className="inline-flex rounded-lg bg-[#f5f1ed] p-1 shadow-sm">
            {(["weekly", "monthly"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`h-8 rounded-md px-4 text-xs font-semibold capitalize transition-colors ${
                  viewMode === mode
                    ? "bg-[#DA7756] text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
        <div className="grid min-w-[420px] grid-cols-7 gap-2 sm:min-w-0 sm:gap-3">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-center text-[11px] font-medium text-gray-500"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((day, index) => {
            const status = day.status !== "none" ? STATUS_META[day.status] : null;

            return (
              <div
                key={`${toDateKey(day.date)}-${index}`}
                className={`flex h-14 flex-col items-center justify-center rounded-lg border border-[#e8e4de] bg-[#f4f1ed] text-sm font-medium ${
                  day.inCurrentMonth ? "text-black" : "text-gray-300"
                }`}
              >
                <span>{day.dayNumber}</span>
                <span
                  className="mt-2 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: status?.dot || "transparent" }}
                />
              </div>
            );
          })}
        </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-[#e8f1fa] px-4 py-3">
        {Object.entries(STATUS_META).map(([status, meta]) => (
          <div key={status} className="flex items-center gap-2 text-xs text-gray-600">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: meta.dot }}
            />
            {meta.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessCompassAttendanceView;
