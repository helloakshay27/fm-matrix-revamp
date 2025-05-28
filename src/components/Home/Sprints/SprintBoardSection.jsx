/* eslint-disable react/jsx-key */
import Boards from "../Boards"
import TaskCard from "../Task/TaskCard";
import TaskSubCard from "../Task/TaskSubCard";
import { sprintTitle, tasks as initialTasks } from "../../../data/Data";
import { CalendarDays, GripHorizontal, Play, Timer, User } from "lucide-react";
import { useState } from "react";

const SprintBoardSection = () => {
    const [subCardVisibility, setSubCardVisibility] = useState({});
    const [tasks, setTasks] = useState(initialTasks);

    const toggleSubCard = (taskId) => {
        setSubCardVisibility((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    };

    const handleDrop = (item, newStatus) => {
        const { type, id, fromTaskId } = item;

        if (type === "TASK") {
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === id ? { ...task, status: newStatus } : task
                )
            );
        } else if (type === "SUBTASK") {
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === fromTaskId
                        ? {
                            ...task,
                            subtasks: task.subtasks.map((subtask) =>
                                subtask.id === id ? { ...subtask, status: newStatus } : subtask
                            ),
                        }
                        : task
                )
            );
        }
    };

    const getColor = (index) => {
        const colors = ["#F9C863", "#B4EB77", "#B7E0D4", "#B3B3FF", "#D1A1FF", "#D9B1FF", "#FF9FBF"];
        return colors[index % colors.length];
    };


    return (
        <div className="h-[80%] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap">
            <div className="flex flex-col gap-2 h-full overflow-y-auto no-scrollbar" style={{ minWidth: "300px" }}>
                <div className="bg-[#DEE6E8] rounded-md px-3 py-4 flex flex-col gap-5 h-full">
                    {/* Header */}
                    <div className="w-full relative">

                        <h3
                            className="text-white py-2 px-4 rounded-md text-xs absolute top-0 left-0 z-10"
                            style={{ backgroundColor: "#88D760" }}
                        >
                            Active
                        </h3>
                        <div className="absolute top-2 right-2">
                            <Play size={15} fill="#000" className="cursor-pointer" />
                        </div>
                    </div>

                    {/* Sprint Info */}
                    <div className="text-[13px] space-y-3 mt-6 bg-white p-5 pt-2">
                        <div className="flex justify-center items-center">
                            <GripHorizontal size={15} fill="#000" className="cursor-pointer" />
                        </div>
                        <p>
                            <span className="text-[#62bbec] font-medium">S-01</span> Developement 1st phase
                        </p>

                        <div className="flex items-center gap-2 text-[#B00020]">
                            <CalendarDays size={14} />
                            <span className="text-black ">15 Jan 2025 to 22 Jan 2025</span>
                        </div>

                        <div className="flex items-center gap-2 text-[#D32F2F]">
                            <User size={14} />
                            <span className="text-black">Sohail Ansari</span>
                        </div>

                        <div className="flex items-center gap-2 text-[#029464]">
                            <Timer size={14} />
                            <span className="text-[11px]">07d : 168h : 00m : 0s</span>
                        </div>
                        <div className="border-t border-gray-300 my-4"></div>

                        {/* Contributors */}
                        <div className="flex justify-between items-center">
                            <p className="text-[xs] mb-1">Contributors</p>
                            <div className="flex -space-x-2">
                                {["S", "A", "B", "M", "K", "D", "CB"].map((char, i) => (
                                    <div
                                        key={i}
                                        className="w-6 h-6 rounded-full text-xs flex items-center justify-center border border-white text-black"
                                        style={{ backgroundColor: getColor(i) }}
                                    >
                                        {char}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                    <div className="w-full h-full rounded-md bg-white flex items-center justify-center text-center px-8 text-gray-400 text-sm">
                        Drag from respective statuses
                        <br />
                        and drop your tasks here.
                    </div>
                </div>
            </div>

            {
                sprintTitle.map(sprint => {
                    return (
                        <Boards
                            add={sprint.add}
                            color={sprint.color}
                            count={tasks.filter((task) => task.status === sprint.title).length}
                            title={sprint.title}
                            className="flex items-start justify-start"
                            onDrop={handleDrop}
                        >
                            {
                                tasks.filter(task => task.status === sprint.title).length > 0 ? (
                                    tasks
                                        .filter(task => task.status === sprint.title)
                                        .map((task) => (
                                            <div key={task.id} className="w-full">
                                                <TaskCard
                                                    task={task}
                                                    toggleSubCard={() => toggleSubCard(task.id)}
                                                />
                                                {/* {task.subtasks.map((subtask) => (
                                                    <TaskSubCard
                                                        key={subtask.id}
                                                        subtask={subtask}
                                                        isVisible={subCardVisibility[task.id] || false}
                                                    />
                                                ))} */}
                                            </div>
                                        ))
                                ) : (
                                    <img src="/draganddrop.svg" alt="svg" className="w-full" />
                                )
                            }
                        </Boards>
                    )
                })
            }

        </div>
    )
}

export default SprintBoardSection