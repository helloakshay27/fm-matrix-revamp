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

const DependancyBoardCard = ({ task, draggable = true }) => {
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
