import { useAppDispatch } from "@/store/hooks";
import { fetchTargetDateTasks, editProjectTask } from "@/store/slices/projectTasksSlice";
import {
    ChevronUp,
    ChevronDown,
    Calendar,
    CalendarCheck2,
    Timer,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";

const calculateDuration = (end: string) => {
    const now = new Date();
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    const diffMs = endDate.getTime() - now.getTime();
    if (diffMs <= 0) return "0s";
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    return `${days > 0 ? days + "d" : ""} : ${remainingHours > 0 ? remainingHours + "h" : ""} : ${remainingMinutes > 0 ? remainingMinutes + "m" : ""}`;
};

const CountdownTimer = ({ targetDate }) => {
    const [countdown, setCountdown] = useState(calculateDuration(targetDate));
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(calculateDuration(targetDate));
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);
    return (
        <div className="text-left text-xs">{countdown}</div>
    );
};

// ===================== TaskCard =====================
const TaskCard = ({ task, selectedDate, isDragging, setDraggedTask }) => {
    const date = `${selectedDate.year}-${String(selectedDate.month + 1).padStart(
        2,
        "0"
    )}-${String(selectedDate.date).padStart(2, "0")}`;

    // Calculate today's total allocation
    const todayAllocation = (task.allocation_times || [])
        .filter(a => a.date === date)
        .reduce(
            (acc, a) => {
                const totalMins = acc.minutes + (a.minutes || 0);
                const totalHours = acc.hours + (a.hours || 0) + Math.floor(totalMins / 60);
                return { hours: totalHours, minutes: totalMins % 60 };
            },
            { hours: 0, minutes: 0 }
        );

    const hours = String(todayAllocation?.hours ?? 0).padStart(2, "0");
    const minutes = String(todayAllocation?.minutes ?? 0).padStart(2, "0");

    return (
        <div
            draggable
            onDragStart={(e) => {
                setDraggedTask(task);
                e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => setDraggedTask(null)}
            className={`p-3 mb-2 border-l-4 cursor-move ${task.priority === "High" ? "border-[#C72030]" : task.priority === "Medium" ? "border-[#ED9017]" : "border-[#1FCFB3]"} bg-[#D5DBDB] ${isDragging ? "opacity-50" : "hover:opacity-80"
                } transition-opacity`}
        >
            <div className="text-xs font-medium text-gray-800 mb-2 text-ellipsis whitespace-nowrap overflow-hidden">{task.title}</div>
            <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{task.target_date}</span>
                </div>
                <div className="flex items-center gap-1">
                    <CalendarCheck2 className="w-4 h-4" />
                    <span>{`${hours}:${minutes} Hrs`}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    <CountdownTimer targetDate={task.target_date} />
                </div>
                <div className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    <span>{`${task.estimated_hour} Hrs`}</span>
                </div>
            </div>
        </div>
    );
};

// ===================== DroppableDay =====================
const DroppableDay = ({ dateInfo, onDrop, assignedTasks, onDateClick, draggedTask }) => {
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (draggedTask) {
            onDrop(draggedTask, dateInfo);
        }
    };

    const calculationHrs = (typeof dateInfo.allocated_hours_num !== 'undefined')
        ? dateInfo.allocated_hours_num
        : parseFloat(String(dateInfo.hours).split(" ")[0]) || 0;
    const durationPercentage = (calculationHrs / 8) * 100;

    const bgClass = dateInfo.isSelected
        ? "bg-blue-50"
        : dateInfo.overloaded
            ? "bg-red-100"
            : assignedTasks[dateInfo.fullDate]
                ? "bg-[#D5DBDB]"
                : "hover:bg-gray-50";

    const handleClick = () => {
        onDateClick(dateInfo.fullDate);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`relative grid grid-cols-3 border-t border-b border-r border-dashed border-gray-400 items-center px-3 py-[19px] ${bgClass} cursor-pointer transition-colors`}
        >
            <span
                className={`absolute left-0 top-0 h-full w-[4px] ${durationPercentage <= 33
                    ? "bg-[#1FCFB3]"
                    : durationPercentage <= 66
                        ? "bg-[#ED9017]"
                        : "bg-[#C72030]"
                    }`}
            />
            <div className="font-medium text-xs text-left">{dateInfo.day}</div>
            <div className="text-xs text-gray-600 text-left">{dateInfo.date}</div>
            <div className="font-semibold text-xs text-right">{dateInfo.hours}</div>
            {dateInfo.isPending && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-yellow-50 text-yellow-800 text-xs px-2 py-1 rounded">Processing...</div>
                </div>
            )}
        </div>
    );
};

// ===================== CalendarWeekView =====================
const CalendarWeekView = ({
    selectedDate,
    weekDates,
    onScroll,
    onDrop,
    assignedTasks,
    onDateClick,
    draggedTask,
}) => {
    return (
        <div className="bg-white border-gray-300 relative">
            {/* Scroll Up */}
            <div className="flex items-center justify-center absolute -top-[23px] left-[50%] translate-x-[-50%] z-10">
                <button
                    type="button"
                    onClick={() => onScroll("up")}
                    className="p-1 rounded"
                >
                    <ChevronUp className="w-5 h-5" />
                </button>
            </div>

            {/* Week Days */}
            <div className="space-y-1 my-4">
                {weekDates.map((dateInfo) => (
                    <DroppableDay
                        key={dateInfo.fullDate}
                        dateInfo={dateInfo}
                        onDrop={onDrop}
                        assignedTasks={assignedTasks}
                        onDateClick={onDateClick}
                        draggedTask={draggedTask}
                    />
                ))}
            </div>

            {/* Scroll Down */}
            <div className="flex items-center justify-center absolute -bottom-[25px] left-[50%] translate-x-[-50%] z-10">
                <button
                    type="button"
                    onClick={() => onScroll("down")}
                    className="p-1 rounded"
                >
                    <ChevronDown className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

// ===================== TasksOfDate =====================
const TasksOfDate = ({ selectedDate, onClose, tasks, userAvailability, selectedUser }) => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const [dateStartIndex, setDateStartIndex] = useState(null);
    const [assignedTasks, setAssignedTasks] = useState({});
    const [availabilityUpdates, setAvailabilityUpdates] = useState({});
    const [pendingDrops, setPendingDrops] = useState({});
    const [taskStartIndex, setTaskStartIndex] = useState(0);
    const [currentTasks, setCurrentTasks] = useState([]);
    const [draggedTask, setDraggedTask] = useState(null);

    useEffect(() => {
        if (tasks.length > 0) {
            setCurrentTasks(tasks);
        }
    }, [tasks]);

    const visibleTasksCount = 3;
    const visibleDaysCount = 3;

    // ✅ Build weekDates directly from userAvailability
    const weekDates = useMemo(() => {
        if (!userAvailability || userAvailability.length === 0) return [];

        const sorted = [...userAvailability].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const selectedFullDate = selectedDate
            ? `${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, "0")}-${String(selectedDate.date).padStart(2, "0")}`
            : new Date().toISOString().split("T")[0];

        // Initialize dateStartIndex based on selected date position on first load
        if (dateStartIndex === null) {
            const selectedIndex = sorted.findIndex(u => u.date === selectedFullDate);
            setDateStartIndex(selectedIndex !== -1 ? selectedIndex : 0);
            return [];
        }

        const visible = sorted.slice(
            dateStartIndex,
            dateStartIndex + visibleDaysCount
        );

        // helper to format hours string (shows decimals if needed)
        const formatHoursString = (h) => {
            if (Number.isInteger(h)) return `${String(h).padStart(2, "0")} hrs`;
            return `${h.toFixed(2)} hrs`;
        };

        return visible.map((u) => {
            const d = new Date(u.date);
            const day = dayNames[d.getDay()];
            const month = d.toLocaleString("default", { month: "short" });
            const date = d.getDate();

            // apply any local availability updates for this date
            const added = availabilityUpdates[u.date] || 0;
            const hoursNum = (Number(u.allocated_hours) || 0) + added;

            return {
                day,
                date: `${date} ${month}`,
                hours: formatHoursString(hoursNum),
                allocated_hours_num: hoursNum,
                fullDate: u.date,
                isSelected: u.date === selectedFullDate,
                overloaded: u.overloaded,
                isPending: !!pendingDrops[u.date],
            };
        });
    }, [userAvailability, dateStartIndex, visibleDaysCount, selectedDate, availabilityUpdates, pendingDrops]);

    const handleScroll = (direction) => {
        if (direction === "up" && dateStartIndex > 0) {
            setDateStartIndex(dateStartIndex - 1);
        } else if (
            direction === "down" &&
            dateStartIndex + visibleDaysCount < userAvailability.length
        ) {
            setDateStartIndex(dateStartIndex + 1);
        }
    };

    const handleDrop = async (task, dateInfo) => {
        const fullDate = dateInfo.fullDate;
        if (assignedTasks[fullDate] || pendingDrops[fullDate]) return;

        const formatedSelectedDate = `${selectedDate.year}-${(
            selectedDate.month + 1
        )
            .toString()
            .padStart(2, "0")}-${selectedDate.date.toString().padStart(2, "0")}`;

        // compute hours to add for the target date from this task's allocation entries
        const addedHours = (task.allocation_times || [])
            .filter((t) => t.date == formatedSelectedDate)
            .reduce((acc, t) => {
                const hrs = Number(t.hours || 0);
                const mins = Number(t.minutes || 0);
                return acc + hrs + mins / 60;
            }, 0);

        try {
            // mark as pending so UI doesn't show assignment until success
            setPendingDrops((p) => ({ ...p, [fullDate]: true }));

            await dispatch(
                editProjectTask({
                    token,
                    baseUrl,
                    id: task.id,
                    data: {
                        ...(task.target_date == formatedSelectedDate && {
                            target_date: fullDate,
                            allocation_date: fullDate,
                        }),
                        task_allocation_times_attributes: task.allocation_times.map((t) =>
                            t.date == formatedSelectedDate
                                ? { ...t, date: fullDate }
                                : t
                        ),
                    },
                })
            ).unwrap();

            // only after success update local UI state
            setAssignedTasks((prev) => ({ ...prev, [fullDate]: task }));
            setAvailabilityUpdates((prev) => ({
                ...prev,
                [fullDate]: (prev[fullDate] || 0) + addedHours,
            }));
            setCurrentTasks((prev) => prev.filter((t) => t.id !== task.id));
        } catch (err) {
            console.error("Failed to update task on drop:", err);
            // optionally inform user - minimal handling here
            toast.error("Could not move task. Please try again.");
        } finally {
            setPendingDrops((p) => {
                const copy = { ...p };
                delete copy[fullDate];
                return copy;
            });
        }
    };

    const handleTaskScroll = (direction) => {
        if (
            direction === "down" &&
            taskStartIndex + visibleTasksCount < currentTasks.length
        ) {
            setTaskStartIndex(taskStartIndex + 1);
        } else if (direction === "up" && taskStartIndex > 0) {
            setTaskStartIndex(taskStartIndex - 1);
        }
    };

    const handleDateClick = async (dateString) => {
        if (!selectedUser) {
            toast.error("No user selected");
            return;
        }

        try {
            const result = await dispatch(
                fetchTargetDateTasks({
                    baseUrl,
                    token,
                    id: selectedUser,
                    date: dateString,
                })
            ).unwrap();

            // Update current tasks with fetched tasks from the clicked date
            setCurrentTasks([...result.tasks, ...result.issues]);
            setTaskStartIndex(0);
        } catch (err) {
            console.error("Failed to fetch tasks for date:", err);
            toast.error("Could not load tasks for this date");
        }
    };

    const hasMoreTasks = taskStartIndex + visibleTasksCount < currentTasks.length;
    const hasPreviousTasks = taskStartIndex > 0;

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const selectedDateString = `${selectedDate.year}-${String(selectedDate.month + 1).padStart(
        2,
        "0"
    )}-${String(selectedDate.date).padStart(2, "0")}`;

    // Calculate the day name from the selected date
    const selectedDateObj = new Date(selectedDate.year, selectedDate.month, selectedDate.date);
    const selectedDayName = dayNames[selectedDateObj.getDay()];

    const selectedDayAvailability = userAvailability?.find(
        (u) => u.date === selectedDateString
    );

    const formatHoursString = (h) => {
        if (Number.isInteger(h)) return `${String(h).padStart(2, "0")} hrs`;
        return `${h.toFixed(2)} hrs`;
    };

    const selectedHoursNum = (Number(selectedDayAvailability?.allocated_hours) || 0) + (availabilityUpdates[selectedDateString] || 0);
    const totalTaskHours = formatHoursString(selectedHoursNum);

    return (
        <div className="bg-white mt-3">
            {/* Header */}
            <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="font-semibold">
                        {selectedDayName}
                    </span>
                    <span>
                        {selectedDate?.date || "10"}{" "}
                        {monthNames[selectedDate?.month || 9]}
                    </span>
                </div>
                <div className="font-semibold">
                    Total Task Hours: {totalTaskHours}
                </div>
            </div>

            {/* Content */}
            <div className="py-4 grid grid-cols-3 gap-3">
                {/* Left: Task List */}
                <div className="col-span-2 relative">
                    {hasPreviousTasks && (
                        <div className="flex justify-center mb-1 absolute -top-[18px] left-[50%] translate-x-[-50%] z-10">
                            <button
                                className="rounded"
                                type="button"
                                onClick={() => handleTaskScroll("up")}
                            >
                                <ChevronUp className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>
                    )}

                    <div
                        className="space-y-2 overflow-hidden"
                        style={{ height: `${visibleTasksCount * 72}px` }}
                    >
                        <div
                            className="transition-transform duration-300 ease-in-out space-y-2"
                            style={{
                                transform: `translateY(-${taskStartIndex * 72}px)`,
                            }}
                        >
                            {currentTasks.length > 0 ? (
                                currentTasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        selectedDate={selectedDate}
                                        isDragging={draggedTask?.id === task.id}
                                        setDraggedTask={setDraggedTask}
                                    />
                                ))
                            ) : (
                                <div className="text-center text-gray-500 text-sm">
                                    No tasks available
                                </div>
                            )}
                        </div>
                    </div>

                    {hasMoreTasks && (
                        <div className="flex justify-center mt-1 absolute -bottom-[16px] left-[50%] translate-x-[-50%] z-10">
                            <button
                                className="rounded"
                                type="button"
                                onClick={() => handleTaskScroll("down")}
                            >
                                <ChevronDown className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Right: Calendar View */}
                <div className="col-span-1">
                    <CalendarWeekView
                        selectedDate={selectedDate}
                        weekDates={weekDates}
                        onScroll={handleScroll}
                        onDrop={handleDrop}
                        assignedTasks={assignedTasks}
                        onDateClick={handleDateClick}
                        draggedTask={draggedTask}
                    />
                </div>
            </div>
        </div>
    );
};

export default TasksOfDate;
