import { useEffect, useState, useCallback } from "react";
import Xarrow from "react-xarrows";
import { CalendarDays, GripHorizontal, Play, Timer, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import useDeepCompareEffect from "use-deep-compare-effect";
import { debounce } from "lodash";
import { sprintTitle } from "../../../data/Data";
import Boards from "../Boards";
import TaskCard from "../Task/TaskCard";
import TaskSubCard from "../Task/TaskSubCard";
import { changeTaskStatus, fetchTasks } from "../../../redux/slices/taskSlice";
import { useDrop } from "react-dnd";
import DraggableTask from "./DraggableTask";
import DraggableSubTask from "./DraggableSubTask";
import { fetchSpirints } from "../../../redux/slices/spirintSlice";
import { useParams } from "react-router-dom";

const SprintBoardSection = ({ section }) => {
    const { id } = useParams();
    const isTaskSection = section === "Tasks";
    const [subCardVisibility, setSubCardVisibility] = useState({});
    const [arrowLinks, setArrowLinks] = useState([]);
    const dispatch = useDispatch();
    const [taskData, setTaskData] = useState([]);
    const [isUpdatingTask, setIsUpdatingTask] = useState(false);
    // const [localError, setLocalError] = useState(null);
    const taskState = useSelector((state) => state.fetchTasks.fetchTasks);
    const selectedProject = useSelector((state) => state.fetchProjects.selectedProject);

    useEffect(() => {
        dispatch(fetchTasks());
        dispatch(fetchSpirints());

    }, [dispatch]);

    useDeepCompareEffect(() => {
        setTaskData(taskState);
    }, [taskState]);

    const toggleSubCard = useCallback((taskId) => {
        setSubCardVisibility((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    }, []);

    const updateTaskDataField = useCallback((taskId, fieldName, newValue) => {
        setTaskData((prev) => {
            let changed = false;
            const updated = prev.map((task) => {
                if (task.id === taskId) {
                    if (task[fieldName] === newValue) return task;
                    changed = true;
                    return { ...task, [fieldName]: newValue };
                }
                return task;
            });
            return changed ? updated : prev;
        });
    }, []);

    const debouncedUpdateTaskField = useCallback(
        debounce(async (taskId, fieldName, newValue) => {
            try {
                await dispatch(
                    changeTaskStatus({ id: taskId, payload: { [fieldName]: newValue } })
                ).unwrap();
            } catch (error) {
                console.error(`Task update failed for ${taskId}:`, error);
                // setLocalError(
                //     `Update failed: ${error?.response?.data?.errors || error?.message || "Server error"
                //     }`
                // );
                dispatch(fetchTasks());
            }
        }, 300),
        [dispatch]
    );

    // const handleUpdateTaskFieldCell = useCallback(
    //     (taskId, fieldName, newValue) => {
    //         if (isUpdatingTask) return;

    //         setIsUpdatingTask(true);
    //         setLocalError && setLocalError(null);

    //         updateTaskDataField(taskId, fieldName, newValue);
    //         debouncedUpdateTaskField(taskId, fieldName, newValue);
    //         setIsUpdatingTask(false);
    //     },
    //     [debouncedUpdateTaskField, isUpdatingTask, updateTaskDataField]
    // );

    const ItemTypes = {
        TASK: "TASK",
        SUBTASK: "SUBTASK",
    };

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: [ItemTypes.TASK, ItemTypes.SUBTASK],
        drop: (item) => {
            console.log("Dropped item:", item);
            handleDrop(item, "sprint");
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    // Local-only handleDrop (no API calls, only updates local state)
    const handleDrop = useCallback(
        (item, newStatus) => {
            const { type, id, fromTaskId } = item;

            if (type === "TASK") {
                setTaskData((prev) =>
                    prev.map((task) =>
                        task.id === id ? { ...task, status: newStatus } : task
                    )
                );
            } else if (type === "SUBTASK") {
                setTaskData((prev) =>
                    prev.map((task) =>
                        task.id === fromTaskId
                            ? {
                                ...task,
                                sub_tasks_managements: task.sub_tasks_managements.map((subtask) =>
                                    subtask.id === id ? { ...subtask, status: newStatus } : subtask
                                ),
                            }
                            : task
                    )
                );
            }
        },
        [taskData]
    );
    console.log("taskData", JSON.stringify(taskData, null, 2));
    const handleLink = (sourceId, targetIds = []) => {
        if (targetIds.length === 0) return;

        setArrowLinks((prevLinks) => {
            const areAllLinksActive = targetIds.every((targetId) =>
                prevLinks.some(link => link.sourceId === sourceId && link.targetId === targetId)
            );

            if (areAllLinksActive) {
                return prevLinks.filter(
                    link => !(link.sourceId === sourceId && targetIds.includes(link.targetId))
                );
            } else {
                const newLinks = targetIds
                    .filter(targetId => !prevLinks.some(link => link.sourceId === sourceId && link.targetId === targetId))
                    .map(targetId => ({ sourceId, targetId }));
                return [...prevLinks, ...newLinks];
            }
        });
    };

    const buildDependencyArrows = () => {
        const arrows = [];

        arrowLinks.forEach(link => {
            const sourceNum = parseInt(link.sourceId.replace("task-", ""));
            const targetNum = parseInt(link.targetId.replace("task-", ""));
            const sourceTask = taskData.find(t => t.id === sourceNum);
            const targetTask = taskData.find(t => t.id === targetNum);

            // Predecessor arrows
            if (
                targetTask &&
                Array.isArray(targetTask.predecessor_task)
            ) {
                const flatPredecessors = targetTask.predecessor_task.flat();
                if (flatPredecessors.includes(sourceNum)) {
                    arrows.push({
                        sourceId: `task-${sourceNum}`,
                        targetId: `task-${targetNum}`,
                        type: "predecessor"
                    });
                }
            }

            // Successor arrows
            if (
                sourceTask &&
                Array.isArray(sourceTask.successor_task)
            ) {
                const flatSuccessors = sourceTask.successor_task.flat();
                if (flatSuccessors.includes(targetNum)) {
                    arrows.push({
                        sourceId: `task-${sourceNum}`,
                        targetId: `task-${targetNum}`,
                        type: "successor"
                    });
                }
            }
        });
        return arrows;
    };

    const dependencyArrows = buildDependencyArrows();
    const allArrows = [
        ...arrowLinks,
        ...dependencyArrows.filter(
            dep =>
                !arrowLinks.some(
                    link =>
                        link.sourceId === dep.sourceId &&
                        link.targetId === dep.targetId
                )
        ),
    ];

    // Helper to get color by index
    const getColor = (index) => {
        const colors = ["#F9C863", "#B4EB77", "#B7E0D4", "#B3B3FF", "#D1A1FF", "#D9B1FF", "#FF9FBF"];
        return colors[index % colors.length];
    };

    const projectState = useSelector((state) => state.fetchProjects.fetchProjects);
    const sprintState = useSelector((state) => state.fetchSpirints?.fetchSpirints || []);
    const [projects, setProjects] = useState([]);
    const [selectedSprint, setSelectedSprint] = useState(null);
    const [countdown, setCountdown] = useState("00d:00h:00m:00s");



    useEffect(() => {
        if (id && sprintState.length) {
            const sprint = sprintState.find((s) => {
                const sprintId = s.id != null ? String(s.id) : '';
                return sprintId === id;
            });
            setSelectedSprint(sprint || null);
        } else {
            setSelectedSprint(null);
        }
    }, [id, sprintState]);

    const calculateCountdown = useCallback(() => {
        if (!selectedSprint?.end_date) {
            setCountdown("00d:00h:00m:00s");
            return;
        }

        const endDate = new Date(selectedSprint.end_date);
        const now = new Date();
        const timeDiff = endDate - now;

        if (timeDiff <= 0) {
            setCountdown("00d:00h:00m:00s");
            return;
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        setCountdown(
            `${String(days).padStart(2, '0')}d:${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m:${String(seconds).padStart(2, '0')}s`
        );
    }, [selectedSprint]);

    useEffect(() => {
        calculateCountdown();
        const interval = setInterval(() => {
            calculateCountdown();
        }, 1000);

        return () => clearInterval(interval);
    }, [calculateCountdown]);

    useDeepCompareEffect(() => {
        if (selectedProject === "Kalpataru customer app : Post sales") {
            setProjects([]);
        } else if (selectedProject === "Project Management Revamp") {
            setProjects(projectState);
        } else {
            setProjects(projectState);
        }
    }, [projectState, selectedProject]);
    const contributors = selectedSprint?.contributors || ["S", "A", "B", "M", "K", "D", "CB"];



    // Main render
    return (
        <div className="relative">
            <div className="h-[80%] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap" style={{ height: "75vh" }}>
                <div className="flex flex-col gap-2 h-full overflow-y-auto no-scrollbar" style={{ minWidth: '300px' }}>
                    <div className="bg-[#DEE6E8] rounded-md px-3 py-4 flex flex-col gap-5 h-full">
                        <div className="w-full relative">
                            <h3 className="text-white py-2 px-4 rounded-md text-xs absolute top-0 left-0 z-10" style={{ backgroundColor: '#88D760' }}>
                                Active
                            </h3>
                            <div className="absolute top-2 right-2">
                                <Play size={15} fill="#000" className="cursor-pointer" />
                            </div>
                        </div>

                        {selectedSprint ? (
                            <div className="text-[13px] space-y-3 mt-6 bg-white p-5 pt-2">
                                <div className="flex justify-center items-center">
                                    <GripHorizontal size={15} fill="#000" className="cursor-pointer" />
                                </div>
                                <p>
                                    <span className="text-[#62bbec] font-medium">
                                        S-{selectedSprint.id}
                                    </span>{" "}
                                    {selectedSprint.name}
                                </p>
                                <div className="flex items-center gap-2 text-[#B00020]">
                                    <CalendarDays size={14} />
                                    <span className="text-black">
                                        {selectedSprint.start_date} to {selectedSprint.end_date}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[#D32F2F]">
                                    <User size={14} />
                                    <span className="text-black">Rahul</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#029464]">
                                    <Timer size={14} />
                                    <span className="text-[11px]">
                                        {countdown}
                                    </span>
                                </div>
                                <div className="border-t border-gray-300 my-4"></div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[xs] mb-1">Contributors</p>
                                    <div className="flex -space-x-2">
                                        {contributors.map((char, i) => (
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
                        ) : (
                            <div className="text-[13px] space-y-3 mt-6 bg-white p-5 pt-2">
                                <div className="flex justify-center items-center">
                                    <GripHorizontal size={15} fill="#000" className="cursor-pointer" />
                                </div>
                                <p>
                                    <span className="text-[#62bbec] font-medium">No Sprint Selected</span>
                                </p>
                                <div className="border-t border-gray-300 my-4"></div>
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
                        )}

                        <div
                            ref={drop}
                            className={`w-full h-max bg-white p-3 shadow-xl text-xs flex flex-col space-y-2 mb-2 w-full h-full rounded-md bg-white flex flex-col items-center justify-start text-center px-2 text-gray-500 text-sm overflow-y-auto no-scrollbar
    ${isOver && canDrop ? "ring-2 ring-blue-400" : ""}
  `}
                            style={{ minHeight: 120 }}
                        >
                            {taskData.filter(task => task.status === "sprint").length === 0 ? (
                                <span className="text-gray-500 mt-3">
                                    Drag from respective statuses<br />and drop your Task here.
                                </span>
                            ) : taskData.sub_tasks_managements ? (
                                taskData.sub_tasks_managements
                                    .filter(task => task.status === "sprint")
                                    .map(task => (
                                        <div key={task.id} className="w-full my-2">
                                            <TaskSubCard
                                                task={task}
                                                toggleSubCard={() => toggleSubCard(task.id)}
                                            />
                                        </div>
                                    ))
                            ) : (
                                taskData
                                    .filter(task => task.status === "sprint")
                                    .map(task => (
                                        <div key={task.id} className="w-full my-2">
                                            <TaskCard
                                                task={task}
                                                toggleSubCard={() => toggleSubCard(task.id)}
                                            />
                                        </div>
                                    ))
                            )}
                        </div>

                    </div>
                </div>

                {/* Dynamic Boards */}
                {sprintTitle.map((card) => {
                    const filteredTasks = taskData.filter((task) => {
                        const cardStatus = card.title.toLowerCase().replace(" ", "_");
                        if (cardStatus === "active") return task.status === "open";
                        return task.status === cardStatus;
                    });

                    return (
                        <Boards
                            key={card.id}
                            add={card.add}
                            color={card.color}
                            count={filteredTasks.length}
                            title={card.title}
                            onDrop={handleDrop}
                        >
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((task) => {
                                    const taskId = `task-${task.id}`;
                                    let dependsOnArr = [];
                                    if (Array.isArray(task.predecessor_task)) {
                                        dependsOnArr = [
                                            ...dependsOnArr,
                                            ...task.predecessor_task.flat().filter(Boolean),
                                        ];
                                    }
                                    if (Array.isArray(task.successor_task)) {
                                        dependsOnArr = [
                                            ...dependsOnArr,
                                            ...task.successor_task.flat().filter(Boolean),
                                        ];
                                    }
                                    dependsOnArr = [...new Set(dependsOnArr.filter(id => id && id !== task.id))];
                                    const formattedDependsOn = dependsOnArr.map(dep => `task-${dep}`);

                                    const allLinked = formattedDependsOn.length > 0 &&
                                        formattedDependsOn.every(depId =>
                                            arrowLinks.some(link =>
                                                (link.sourceId === depId && link.targetId === taskId) ||
                                                (link.sourceId === taskId && link.targetId === depId)
                                            )
                                        );

                                    // DnD drag for task
                                    const subTasks = task?.sub_tasks_managements.map((subtask) => (
                                        <DraggableSubTask
                                            key={subtask.id}
                                            subtask={subtask}
                                            taskId={task.id}
                                            ItemTypes={ItemTypes}
                                            isVisible={subCardVisibility[task.id] || false}
                                        />
                                    ));

                                    return (
                                        <DraggableTask
                                            key={task.id}
                                            task={task}
                                            taskId={taskId}
                                            formattedDependsOn={formattedDependsOn}
                                            allLinked={allLinked}
                                            toggleSubCard={toggleSubCard}
                                            handleLink={handleLink}
                                            subCardVisibility={subCardVisibility}
                                            ItemTypes={ItemTypes}
                                            subTasks={subTasks}
                                        />
                                    );
                                })
                            ) : (
                                <img src="/draganddrop.svg" alt="svg" className="w-full" />
                            )}
                        </Boards>
                    );
                })}
            </div>

            {/* Xarrow Links */}
            {allArrows.map((link, index) => {
                const isDependencyArrow = dependencyArrows.some(
                    (dep) =>
                        dep.sourceId === link.sourceId &&
                        dep.targetId === link.targetId
                );

                let dashness = false;
                let strokeWidth = 1.5;
                let color = "#DA2400";

                if (isDependencyArrow) {
                    const dependency = dependencyArrows.find(
                        (dep) =>
                            dep.sourceId === link.sourceId &&
                            dep.targetId === link.targetId
                    );

                    if (dependency?.type === "predecessor") {
                        dashness = false;
                        strokeWidth = 1;
                        color = "#A0A0A0";
                    } else if (dependency?.type === "successor") {
                        dashness = { strokeLen: 8, nonStrokeLen: 6 };
                        strokeWidth = 1.5;
                        color = "#DA2400";
                    }
                }

                return (
                    <Xarrow
                        key={`${link.sourceId}-${link.targetId}-${index}`}
                        start={link.sourceId}
                        end={link.targetId}
                        strokeWidth={strokeWidth}
                        headSize={6}
                        curveness={0.3}
                        color={color}
                        lineColor={color}
                        showHead={true}
                        dashness={dashness}
                        path="smooth"
                        className="custom-xarrow"
                    />
                );
            })}
        </div>
    );
};

export default SprintBoardSection;