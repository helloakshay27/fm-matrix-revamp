import Boards from "../Boards"
import TaskCard from "../Task/TaskCard";
import TaskSubCard from "../Task/TaskSubCard";
import { sprintTitle, tasks as initialTasks } from "../../../data/Data";
import { Circle, Play, Timer } from "lucide-react";
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

    return (
        <div className="h-[80%] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap">
            <div className="flex flex-col gap-2 h-full overflow-y-auto no-scrollbar" style={{ minWidth: "300px" }}>
                {
                    [1, 1].map(item => (
                        <div
                            className={`bg-[#DEE6E8] h-max rounded-md px-2 py-3 flex flex-col gap-14`}
                            style={{ minWidth: "300px" }}
                        >
                            <div className="w-full relative">
                                <h3
                                    className="text-white py-2 px-4 rounded-md text-xs w-max absolute top-0 left-0 z-10"
                                    style={{ backgroundColor: "#88D760" }}
                                >
                                    Active
                                </h3>

                                <div className="flex items-center gap-4 absolute top-2 right-0">
                                    <Play size={15} fill="#000" className="cursor-pointer" />

                                    <Circle size={15} />
                                </div>
                            </div>

                            <div className="h-full overflow-y-auto no-scrollbar w-full text-[13px] space-y-3">
                                <p>
                                    <span className="text-[#006BA4]">S1</span> Sprint 1
                                </p>
                                <div className="flex items-center justify-between">
                                    <div>Sohail Ansari</div>
                                    <div>High</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>15/01/2025</div>
                                    <div>to</div>
                                    <div>15/01/2025</div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Timer className="text-[#029464]" size={15} />{" "}
                                    <span className="text-[11px] text-[#029464]">07d : 168 h : 00 m : 00 </span>
                                </div>

                                <div className="w-full h-[10rem] rounded-md bg-white flex items-center justify-center text-center px-8 text-gray-400">
                                    Drag from respective statuses
                                    and drop your tasks here.
                                </div>
                            </div>
                        </div>
                    ))
                }
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