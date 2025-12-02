import { Briefcase, CalendarDays, Timer, User2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 76) + 180;
    const g = Math.floor(Math.random() * 76) + 180;
    const b = Math.floor(Math.random() * 76) + 180;
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

const calculateDuration = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Set end date to end of the day
    endDate.setHours(23, 59, 59, 999);

    // Check if task hasn't started yet
    if (now < startDate) {
        return "Not started";
    }

    // Check if task has already ended
    const diffMs = endDate - now;
    if (diffMs <= 0) return "0s";

    // Calculate time differences
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    return `${days > 0 ? days + "d " : ""}${remainingHours > 0 ? remainingHours + "h " : ""}${remainingMinutes > 0 ? remainingMinutes + "m " : ""
        }${remainingSeconds}s`;
};

const CountdownTimer = ({ startDate, targetDate }) => {
    const [countdown, setCountdown] = useState(calculateDuration(startDate, targetDate));

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(calculateDuration(startDate, targetDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="text-left text-[#029464] text-[12px]">{countdown}</div>
    );
};

const MilestoneCard = ({ milestone, toggleTaskCard, hasVisibleTasks, isExpanded }) => {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();

    const [tasks, setTasks] = useState({
        total: 0,
        completed: 0
    })

    useEffect(() => {
        setTasks({
            total: milestone?.task_managements.length,
            completed: milestone?.task_managements.filter((task) => task.status === "completed").length
        })
    }, [])

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `milestone-${milestone.id}`,
        data: {
            type: "MILESTONE",
            projectId: milestone.id,
            project: milestone,
        },
    });

    const navigate = useNavigate();
    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                opacity: isDragging ? 0.4 : 1,
                cursor: isDragging ? "grabbing" : "grab",
                transform: CSS.Translate.toString(transform),
            }}
            className={`w-full h-max bg-white p-2 shadow-xl text-xs flex flex-col space-y-2 mb-2 rounded-sm transition-all duration-200 ${isDragging ? "scale-105 shadow-2xl border-2 border-blue-400" : ""
                }`}
        >
            <p className="mb-2 truncate cursor-pointer" onClick={() => navigate(`${milestone?.id}`)}>
                <span className="text-blue-500">{milestone?.id}</span> {milestone?.title}
            </p>

            <div className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                    <Timer className="text-[#029464] flex-shrink-0" size={14} />
                    <span className="text-[10px] text-[#029464] truncate">
                        <CountdownTimer startDate={milestone.start_date} targetDate={milestone.end_date} />
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Briefcase className="text-[#C72030] flex-shrink-0" size={14} />
                    <span className="text-[10px] truncate">{milestone?.resource_type}</span>
                </div>
                <div className="flex items-start gap-2">
                    <User2 className="text-[#C72030] flex-shrink-0" size={14} />
                    <span className="text-[10px] truncate">{milestone?.owner_name}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-[#C72030] flex-shrink-0" size={14} />
                        <span className="text-[10px]">{milestone?.start_date.split("T")[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-[#C72030] flex-shrink-0" size={14} />
                        <span className="text-[10px]">{milestone?.end_date.split("T")[0]}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3 text-sm">

                {/* Tasks */}
                <div className="flex items-center gap-2">
                    <div className="w-20 font-light text-gray-600">Tasks</div>
                    <div className="w-4 text-center">{tasks.completed}</div>
                    <div className="flex-1 relative bg-gray-200 rounded-full h-4">
                        <div
                            className="absolute top-0 left-0 h-4 rounded-full bg-green-500"
                            style={{
                                width: `${tasks.total > 0
                                    ? (tasks.completed / tasks.total) *
                                    100
                                    : 0
                                    }%`,
                            }}
                        ></div>
                        <div className="absolute w-full text-[10px] text-center text-black font-medium">
                            {tasks.total > 0
                                ? Math.round(
                                    (tasks.completed / tasks.total) * 100
                                ) + "%"
                                : "0%"}
                        </div>
                    </div>
                    <div className="w-4 text-center">{tasks.total}</div>
                </div>

                {/* Issues */}
                {/* <div className="flex items-center gap-2">
                    <div className="w-20 font-light text-gray-600">Issues</div>
                    <div className="w-4 text-center">{project.completed_issues_count}</div>
                    <div className="flex-1 relative bg-gray-200 rounded-full h-4">
                        <div
                            className="absolute top-0 left-0 h-4 rounded-full bg-red-500"
                            style={{
                                width: `${project.total_issues_count > 0
                                    ? (project.completed_issues_count / project.total_issues_count) * 100
                                    : 0
                                    }%`,
                            }}
                        ></div>
                        <div className="absolute w-full text-[10px] text-center text-black font-medium">
                            {project.total_issues_count > 0
                                ? Math.round((project.completed_issues_count / project.total_issues_count) * 100) + "%"
                                : "0%"}
                        </div>
                    </div>
                    <div className="w-4 text-center">{project.total_issues_count}</div>
                </div> */}
            </div>


            <hr className="border border-gray-200 my-2" />

            <div className="flex items-center justify-end gap-2">
                <span
                    className={`flex items-center ${hasVisibleTasks ? 'cursor-pointer' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (hasVisibleTasks) {
                            toggleTaskCard();
                        }
                    }}
                    onPointerDown={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M3.49967 5.25033H6.99967M2.33301 2.91699H4.66634M3.49967 2.91699V9.33366C3.49967 9.48837 3.56113 9.63674 3.67053 9.74614C3.77993 9.85553 3.9283 9.91699 4.08301 9.91699H6.99967M6.99967 4.66699C6.99967 4.51228 7.06113 4.36391 7.17053 4.25451C7.27993 4.14512 7.4283 4.08366 7.58301 4.08366H11.083C11.2377 4.08366 11.3861 4.14512 11.4955 4.25451C11.6049 4.36391 11.6663 4.51228 11.6663 4.66699V5.83366C11.6663 5.98837 11.6049 6.13674 11.4955 6.24614C11.3861 6.35553 11.2377 6.41699 11.083 6.41699H7.58301C7.4283 6.41699 7.27993 6.35553 7.17053 6.24614C7.06113 6.13674 6.99967 5.98837 6.99967 5.83366V4.66699ZM6.99967 9.33366C6.99967 9.17895 7.06113 9.03058 7.17053 8.92118C7.27993 8.81178 7.4283 8.75033 7.58301 8.75033H11.083C11.2377 8.75033 11.3861 8.81178 11.4955 8.92118C11.6049 9.03058 11.6663 9.17895 11.6663 9.33366V10.5003C11.6663 10.655 11.6049 10.8034 11.4955 10.9128C11.3861 11.0222 11.2377 11.0837 11.083 11.0837H7.58301C7.4283 11.0837 7.27993 11.0222 7.17053 10.9128C7.06113 10.8034 6.99967 10.655 6.99967 10.5003V9.33366Z"
                            stroke={`${hasVisibleTasks ? "#DA2400" : "#323232"}`}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className={`ml-1 ${hasVisibleTasks ? 'text-[#DA2400]' : 'text-[#323232]'}`}>
                        {milestone?.task_managements.length}
                    </span>
                </span>
                <div className="flex items-center">
                    <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-gray-800`}
                        style={{ backgroundColor: getRandomColor() }}
                    >
                        {milestone?.owner_name?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MilestoneCard