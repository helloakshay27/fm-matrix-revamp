import { Flag, GripHorizontal, Timer, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";

const formatCountdown = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const DependancyBoardCard = ({ task, draggable = true, toggleSubCard }) => {
    const [countdown, setCountdown] = useState("");

    const [{ isDragging }, dragRef] = useDrag(
        () => ({
            type: "TASK",
            item: { id: task.id, fromStatus: task.section },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [task.id, task.section]
    );

    const cardRef = draggable ? dragRef : null;

    useEffect(() => {
        if (!task?.target_date) return;

        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(task.target_date);
            const diff = end - now;

            if (diff <= 0) {
                setCountdown("Expired");
                clearInterval(interval);
            } else {
                setCountdown(formatCountdown(diff));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [task.target_date]);

    return (
        <div
            ref={cardRef}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className={`w-full h-max bg-white p-2 shadow-xl text-xs flex flex-col space-y-2 mb-2 ${!draggable ? "cursor-default opacity-90" : ""
                }`}
        >
            <div className="flex items-center justify-center my-1">
                <GripHorizontal size={12} className={draggable ? "cursor-grab" : "cursor-not-allowed"} />
            </div>
            <p className="mb-2 truncate">
                <span className="text-blue-500">{task.id}</span> {task.title}
            </p>
            <div className="flex items-center gap-1">
                <Flag className="text-[#C72030] flex-shrink-0" size={14} />
                <span className="text-[10px] truncate">
                    {typeof task.milestone === "object" && task.milestone !== null
                        ? task.milestone.title || JSON.stringify(task.milestone)
                        : task.milestone}
                </span>
            </div>
            <div className="flex items-start gap-1">
                <User2 className="text-[#C72030] flex-shrink-0" size={14} />
                <span className="text-[10px] truncate">
                    {task?.responsible_person?.name ?? "Unassigned"}
                </span>
            </div>
            <div className="flex items-start gap-1">
                <Timer className="text-[#029464] flex-shrink-0" size={14} />
                <span className="text-[10px] text-[#029464] truncate">{countdown}</span>
            </div>

            <hr className="border border-gray-200 my-2" />

            <div className="flex items-center justify-end gap-2">
                <span
                    className="flex items-center cursor-pointer"
                    onClick={toggleSubCard}
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
                            stroke={`${task.sub_tasks_managements?.length > 0 ? "#DA2400" : "#323232"}`}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    {task.sub_tasks_managements?.length ?? 0}
                </span>
                <div className="flex items-center gap-1">
                    <span className="flex items-center gap-1 text-[8px] cursor-pointer truncate">
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12.1337 4.54779C12.7408 5.81752 ..."
                                fill="#C72030"
                            />
                        </svg>
                        <span className="text-[8px] w-max">30 Nov</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DependancyBoardCard;
