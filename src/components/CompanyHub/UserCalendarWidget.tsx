import React, { useState, useMemo } from "react";
import {
  format,
  addDays,
  isToday,
  getDay,
  getDaysInMonth,
  startOfMonth,
  isSameDay,
} from "date-fns";
import {
  Loader2,
  CheckSquare,
  Plus,
  ExternalLink,
  ArrowRightLeft,
} from "lucide-react";
import GlassCard from "./GlassCard";
import {
  useUserCalendars,
  UserCalendarItem,
  getHourlyTaskCounts,
  getDailyTaskCounts,
} from "./hooks/useUserCalendars";
import TodoConvertModal from "../TodoConvertModal";

interface UserCalendarWidgetProps {
  activeTimeView: "hourly" | "weekly" | "monthly";
  setActiveTimeView: (v: "hourly" | "weekly" | "monthly") => void;
  openTaskModal: boolean;
  setOpenTaskModal: (open: boolean) => void;
  openTodoModal: boolean;
  setOpenTodoModal: (open: boolean) => void;
}

const UserCalendarWidget: React.FC<UserCalendarWidgetProps> = ({
  activeTimeView,
  setActiveTimeView,
  setOpenTaskModal,
  setOpenTodoModal,
}) => {
  const [selectedDate] = useState(new Date());
  // Selected filter date - defaults to today
  const [selectedFilterDate, setSelectedFilterDate] = useState<Date>(
    new Date()
  );
  // Selected hour for hourly view filtering
  const [selectedHour, setSelectedHour] = useState<number | null>(
    new Date().getHours()
  );

  // Convert Todo Modal State
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [convertTodoData, setConvertTodoData] = useState<{
    title?: string;
    target_date?: string;
    responsible_person?: { id: string; name?: string };
  } | null>(null);
  const [convertTodoId, setConvertTodoId] = useState<number | string | null>(
    null
  );

  const { calendars, tasks, todos, issues, isLoading, refetch } =
    useUserCalendars({
      viewType: activeTimeView,
      selectedDate,
    });

  // Combine tasks and issues for display
  const allTasks = useMemo(() => [...tasks, ...issues], [tasks, issues]);

  // Get current month/year for monthly view
  const currentMonth = format(selectedDate, "MMMM yyyy");

  // Group calendars by date for different views
  const hourlyTaskCounts = useMemo(
    () => getHourlyTaskCounts(calendars, selectedFilterDate),
    [calendars, selectedFilterDate]
  );
  const dailyTaskCounts = useMemo(
    () => getDailyTaskCounts(calendars),
    [calendars]
  );

  // Generate hourly slots
  const hourlySlots = useMemo(() => {
    const slots = [];
    const currentHour = new Date().getHours();
    const startHour = Math.max(0, currentHour - 2);

    for (let i = 0; i < 10; i++) {
      const hour = (startHour + i) % 24;
      const count = hourlyTaskCounts[hour] || 0;
      slots.push({
        hour,
        label: format(new Date().setHours(hour, 0, 0, 0), "h a"),
        count,
        isActive: hour === currentHour,
        isSelected: hour === selectedHour,
      });
    }
    return slots;
  }, [hourlyTaskCounts, selectedHour]);

  // Generate weekly slots
  const weeklySlots = useMemo(() => {
    const slots = [];
    const startDay = addDays(selectedDate, -2);

    for (let i = 0; i < 10; i++) {
      const day = addDays(startDay, i);
      const dateKey = format(day, "yyyy-MM-dd");
      const dayOfWeek = getDay(day);
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const count = dailyTaskCounts[dateKey] || 0;

      slots.push({
        date: day,
        label: format(day, "EEE"),
        count,
        isToday: isToday(day),
        isWeekend,
        isSelected: isSameDay(day, selectedFilterDate),
      });
    }
    return slots;
  }, [selectedDate, dailyTaskCounts, selectedFilterDate]);

  // Generate monthly calendar days
  const monthlyCalendar = useMemo(() => {
    const firstDay = startOfMonth(selectedDate);
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDayOfWeek = getDay(firstDay);
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days: {
      day: number | null;
      date: Date | null;
      count: number;
      isToday: boolean;
      isSelected: boolean;
    }[] = [];

    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push({
        day: null,
        date: null,
        count: 0,
        isToday: false,
        isSelected: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        i
      );
      const dateKey = format(date, "yyyy-MM-dd");
      const count = dailyTaskCounts[dateKey] || 0;

      days.push({
        day: i,
        date,
        count,
        isToday: isToday(date),
        isSelected: isSameDay(date, selectedFilterDate),
      });
    }

    return days;
  }, [selectedDate, dailyTaskCounts, selectedFilterDate]);

  // Get events for selected date (for monthly view sidebar)
  const selectedDateEvents = useMemo(() => {
    const selectedDateStr = format(selectedFilterDate, "yyyy-MM-dd");
    return calendars
      .filter(
        (c) => format(new Date(c.start_at), "yyyy-MM-dd") === selectedDateStr
      )
      .sort(
        (a, b) =>
          new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
      );
  }, [calendars, selectedFilterDate]);

  const handleItemClick = (item: UserCalendarItem) => {
    if (item.redirect_url) {
      const url = new URL(item.redirect_url);
      const path = url.pathname;
      window.location.href = path;
    }
  };

  const handleDateClick = (date: Date | null) => {
    if (date) {
      setSelectedFilterDate(date);
      setSelectedHour(null);
    }
  };

  const handleHourClick = (hour: number) => {
    setSelectedHour(selectedHour === hour ? null : hour);
  };

  const handleConvertTodo = (todo: UserCalendarItem) => {
    setConvertTodoData({
      title: todo.title,
      target_date: todo.start_at
        ? format(new Date(todo.start_at), "yyyy-MM-dd")
        : undefined,
      responsible_person: {
        id: todo.user_id?.toString(),
        name: todo.user?.name,
      },
    });
    setConvertTodoId(todo.calendarable_id);
    setIsConvertModalOpen(true);
  };

  const getTruncatedTitle = (title: string, maxLength: number = 40) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + "...";
  };

  const getSelectedDateLabel = () => {
    if (isToday(selectedFilterDate)) {
      return "Today";
    }
    return format(selectedFilterDate, "EEE, MMM d");
  };

  return (
    <div
      className={`lg:col-span-6 flex flex-col gap-3 transition-all ${activeTimeView === "monthly" ? "!lg:col-span-12" : ""}`}
    >
      <GlassCard
        className={`px-6 py-4 !bg-white/80 backdrop-blur-sm w-full shadow-sm !border-none !rounded-[20px] flex flex-col overflow-hidden transition-all ${activeTimeView === "monthly" ? "h-[370px]" : "h-[160px]"}`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-bold text-gray-800 tracking-tight">
            {activeTimeView === "monthly"
              ? currentMonth
              : getSelectedDateLabel()}
          </h3>
          <div className="flex items-center gap-0.5 bg-[#F3F0E8] h-8 rounded-[8px] px-1 border border-[#E5DFD0]">
            {["Hourly", "Weekly", "Monthly"].map((v) => (
              <button
                key={v}
                onClick={() => {
                  setActiveTimeView(
                    v.toLowerCase() as "hourly" | "weekly" | "monthly"
                  );
                  setSelectedFilterDate(new Date());
                  setSelectedHour(
                    v.toLowerCase() === "hourly" ? new Date().getHours() : null
                  );
                }}
                className={`px-2.5 h-6 text-[11px] font-semibold rounded-[6px] transition-all ${
                  activeTimeView === v.toLowerCase()
                    ? "bg-white shadow-sm text-gray-900 border border-[#E5DFD0]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {v} View
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        )}

        {!isLoading && activeTimeView === "monthly" && (
          <div className="flex gap-4 flex-1 mt-4 overflow-hidden">
            <div className="flex-1 rounded-xl p-1 h-full overflow-hidden">
              <div className="grid grid-cols-7 gap-1 text-center mb-3">
                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                  <span
                    key={d}
                    className="text-[9px] font-black text-gray-400 opacity-60 px-1"
                  >
                    {d}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1 gap-x-1.5 h-full auto-rows-max">
                {monthlyCalendar.map((item, i) => {
                  if (!item.day) {
                    return <div key={`empty-${i}`} className="h-6" />;
                  }

                  let statusClass =
                    "bg-[#FAF9F6]/80 border-[#E8E4D9] text-gray-500 hover:border-[#DA7756]";

                  if (item.isSelected) {
                    statusClass =
                      "bg-[#DA7756] border-[#DA7756] text-white shadow-md";
                  } else if (item.isToday) {
                    statusClass =
                      "bg-red-50/50 border-red-500 text-red-500 shadow-sm";
                  } else if (item.count > 0) {
                    statusClass =
                      "bg-blue-50/50 border-blue-400 text-blue-500 shadow-sm hover:border-[#DA7756]";
                  }

                  return (
                    <div
                      key={i}
                      onClick={() => handleDateClick(item.date)}
                      className={`aspect-square h-8 w-8 flex flex-col items-center justify-center rounded-[10px] border transition-all cursor-pointer ${statusClass}`}
                    >
                      <span className="text-[10px] font-bold">{item.day}</span>
                      {item.isToday && !item.isSelected && (
                        <span className="text-[6px] font-black mt-[-1px] uppercase opacity-80">
                          Today
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-[260px] bg-[#F9F7F2]/60 rounded-xl p-3 flex flex-col gap-2.5 border border-[#E8E4D9]/40 overflow-y-auto scrollbar-none">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                {format(selectedFilterDate, "EEEE, MMMM d")}
              </div>
              {selectedDateEvents.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-[11px]">
                  No events for this date
                </div>
              ) : (
                selectedDateEvents.map((ev, i) => {
                  const isTask = ev.calendarable_type === "TaskAllocationTime";
                  const isIssue =
                    ev.calendarable_type === "IssueAllocationTime";
                  const dotColor = isTask
                    ? "bg-blue-500"
                    : isIssue
                      ? "bg-red-400"
                      : "bg-green-500";

                  return (
                    <div
                      key={i}
                      onClick={() => handleItemClick(ev)}
                      className="bg-white/90 border border-[#E8E4D9]/50 p-3 rounded-[12px] shadow-sm transition-all hover:shadow-md cursor-pointer"
                    >
                      <div className="flex gap-2 mb-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dotColor}`}
                        />
                        <h4 className="text-[11px] font-black text-gray-800 leading-tight">
                          {getTruncatedTitle(ev.title, 50)}
                        </h4>
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 italic pl-3.5 uppercase tracking-tight">
                        {format(new Date(ev.start_at), "h:mm a")}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {!isLoading && activeTimeView === "hourly" && (
          <div className="grid grid-cols-10 gap-2 flex-1 mt-1 w-full">
            {hourlySlots.map((item, i) => (
              <div
                key={i}
                onClick={() => handleHourClick(item.hour)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer min-w-0"
              >
                <p
                  className={`text-[10px] font-semibold tracking-tight transition-colors truncate w-full text-center ${item.isSelected ? "text-[#DA7756]" : item.isActive ? "text-[#E67E5F]" : "text-gray-400"}`}
                >
                  {item.label}
                </p>
                <div
                  className={`w-[50px] h-[60px] rounded-[10px] border flex items-center justify-center text-[10px] font-semibold transition-all p-1 text-center leading-tight overflow-hidden ${
                    item.isSelected
                      ? "bg-[#DA7756] border-[#DA7756] text-white shadow-md"
                      : item.isActive
                        ? "bg-[#FFF8F5] border-[#E67E5F] text-[#E67E5F] shadow-sm"
                        : item.count > 0
                          ? "bg-[#F0F9FF] border-blue-300 text-blue-500 hover:border-[#DA7756]"
                          : "bg-[#FAF9F6] border-[#E8E4D9] text-gray-400 hover:border-[#DA7756]"
                  }`}
                >
                  {item.count > 0
                    ? `${item.count} task${item.count > 1 ? "s" : ""}`
                    : "—"}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && activeTimeView === "weekly" && (
          <div className="grid grid-cols-10 gap-2 flex-1 mt-1 w-full">
            {weeklySlots.map((item, i) => (
              <div
                key={i}
                onClick={() => handleDateClick(item.date)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer min-w-0"
              >
                <p
                  className={`text-[10px] font-semibold tracking-tight transition-colors truncate w-full text-center ${item.isSelected ? "text-[#DA7756]" : item.isToday ? "text-red-500" : item.isWeekend ? "text-[#E67E5F]" : "text-gray-400"}`}
                >
                  {item.label}
                </p>
                <div
                  className={`w-[50px] h-[60px] rounded-[10px] border flex items-center justify-center text-[10px] font-semibold transition-all p-1 text-center leading-tight overflow-hidden ${
                    item.isSelected
                      ? "bg-[#DA7756] border-[#DA7756] text-white shadow-md"
                      : item.isToday
                        ? "bg-red-50/50 border-red-400 text-red-500 shadow-sm"
                        : item.isWeekend
                          ? "bg-orange-50/50 border-orange-200 text-[#E67E5F]"
                          : item.count > 0
                            ? "bg-[#F0F9FF] border-blue-300 text-blue-500 hover:border-[#DA7756]"
                            : "bg-[#FAF9F6] border-[#E8E4D9] text-gray-400 hover:border-[#DA7756]"
                  }`}
                >
                  {item.isWeekend
                    ? "Weekly Off"
                    : item.count > 0
                      ? `${item.count} task${item.count > 1 ? "s" : ""}`
                      : "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {activeTimeView !== "monthly" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
          <GlassCard className="px-4 pt-3 pb-5 h-[196px] w-full !bg-white shadow-sm !border-none !rounded-[20px] flex flex-col transition-all duration-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-gray-800 tracking-tight">
                Tasks
                <span className="text-[10px] font-normal text-gray-400 ml-2">
                  ({allTasks.length})
                </span>
              </h3>
              <button
                onClick={() => setOpenTaskModal(true)}
                className="bg-[#DA7756] text-white px-4 h-8 rounded-[8px] text-[12px] font-semibold transition-all hover:bg-[#c96a44] active:scale-95 whitespace-nowrap"
              >
                + Create Task
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-none pr-1 space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : allTasks.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-[11px]">
                  No tasks found
                </div>
              ) : (
                allTasks.slice(0, 5).map((task) => {
                  const taskTime = new Date(task.start_at);
                  const timeStr = format(taskTime, "h:mm a");

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleItemClick(task)}
                      className="bg-[#FAF8F2]/90 border-l-4 border-l-[#D5CDBC] border border-[#E8E4D9] rounded-[8px] px-3 py-2 hover:shadow-md transition-all cursor-pointer"
                    >
                      <p className="text-[11px] font-semibold text-gray-800 truncate leading-tight">
                        {getTruncatedTitle(task.title, 45)}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-0.5">
                        {timeStr} - {task.all_day ? "All day" : "1h"}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>

          <GlassCard className="px-5 pt-4 pb-5 h-[196px] w-full !bg-white shadow-sm !border-none !rounded-[20px] flex flex-col transition-all duration-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-gray-800 tracking-tight">
                To-Do
                <span className="text-[10px] font-normal text-gray-400 ml-2">
                  ({todos.length})
                </span>
              </h3>
              <button
                onClick={() => setOpenTodoModal(true)}
                className="bg-[#DA7756] text-white px-4 h-8 rounded-[8px] text-[12px] font-semibold transition-all hover:bg-[#c96a44] active:scale-95 whitespace-nowrap"
              >
                + Create To-do
              </button>
            </div>
            <div className="space-y-1.5 flex-1 overflow-y-auto scrollbar-none pr-1">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : todos.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-[11px]">
                  No to-dos found
                </div>
              ) : (
                todos.slice(0, 4).map((todo) => {
                  const isCompleted = todo.status === "completed";

                  return (
                    <div
                      key={todo.id}
                      className="flex items-center gap-2 bg-white border border-[#ECE6DA] px-3 h-[34px] rounded-[8px] shadow-sm transition-all group cursor-pointer hover:shadow-md"
                    >
                      <div
                        onClick={() => handleItemClick(todo)}
                        className={`w-4 h-4 rounded-[3px] border flex items-center justify-center flex-shrink-0 transition-all ${isCompleted ? "bg-[#FFF6F2] border-[#DA7756]" : "border-gray-300 group-hover:border-[#DA7756]"}`}
                      >
                        {isCompleted ? (
                          <CheckSquare
                            className="w-2.5 h-2.5 text-[#DA7756]"
                            strokeWidth={3}
                          />
                        ) : (
                          <Plus className="w-3 h-3 text-gray-200 group-hover:text-[#DA7756] opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                      <span
                        onClick={() => handleItemClick(todo)}
                        className={`text-[11px] font-medium truncate flex-1 ${isCompleted ? "text-gray-400 line-through" : "text-gray-700"}`}
                      >
                        {getTruncatedTitle(todo.title, 25)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConvertTodo(todo);
                        }}
                        className="p-1 text-gray-300 hover:text-[#DA7756] opacity-0 group-hover:opacity-100 transition-all"
                        title="Convert to Task"
                      >
                        <ArrowRightLeft className="w-3 h-3" />
                      </button>
                      <ExternalLink
                        onClick={() => handleItemClick(todo)}
                        className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      />
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {isConvertModalOpen && convertTodoId && (
        <TodoConvertModal
          isModalOpen={isConvertModalOpen}
          setIsModalOpen={setIsConvertModalOpen}
          prefillData={convertTodoData || {}}
          todoId={convertTodoId}
          onSuccess={() => {
            setIsConvertModalOpen(false);
            setConvertTodoData(null);
            setConvertTodoId(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default UserCalendarWidget;
