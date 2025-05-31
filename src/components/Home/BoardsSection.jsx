import { useEffect, useState, useCallback } from "react";
import Boards from "./Boards";
import TaskCard from "./Task/TaskCard";
import ProjectCard from "./Projects/ProjectCard";
import Xarrow from "react-xarrows";
import { cardsTitle, tasks } from "../../data/Data";
import TaskSubCard from "./Task/TaskSubCard";
import { useDispatch, useSelector, batch } from "react-redux";
import { changeProjectStatus, fetchProjects } from "../../redux/slices/projectSlice";
import { changeTaskStatus, fetchTasks } from "../../redux/slices/taskSlice";
import useDeepCompareEffect from "use-deep-compare-effect";
import { debounce } from "lodash";

const BoardsSection = ({ section }) => {
    const [subCardVisibility, setSubCardVisibility] = useState({});
    const [arrowLinks, setArrowLinks] = useState([]);
    const dispatch = useDispatch()

    const [projects, setProjects] = useState([]);
    const [taskData, setTaskData] = useState([]);

    const [isUpdatingTask, setIsUpdatingTask] = useState(false);
    const [localError, setLocalError] = useState(null);
    const projectState = useSelector((state) => state.fetchProjects.fetchProjects);
    const taskState = useSelector((state) => state.fetchTasks.fetchTasks);


    useEffect(() => {
        batch(() => {
            if (section === "Tasks") {
                dispatch(fetchTasks());
            } else {
                dispatch(fetchProjects());
            }
        });
    }, [dispatch]);

    useDeepCompareEffect(() => {
        setProjects(projectState);
    }, [projectState]);

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
                setLocalError(
                    `Update failed: ${error?.response?.data?.errors || error?.message || "Server error"
                    }`
                );
                dispatch(fetchTasks());
            }
        }, 300),
        [dispatch]
    );

    const handleUpdateTaskFieldCell = useCallback(
        (taskId, fieldName, newValue) => {
            if (isUpdatingTask) return;

            setIsUpdatingTask(true);
            setLocalError(null);

            updateTaskDataField(taskId, fieldName, newValue);
            debouncedUpdateTaskField(taskId, fieldName, newValue);
            setIsUpdatingTask(false);
        },
        [debouncedUpdateTaskField, isUpdatingTask, updateTaskDataField]
    );

    const handleStatusChange = useCallback(
        async ({ id: rowId, payload: newValue }) => {
            const actualProjectId = rowId.replace("P-", "");
            const apiCompatibleValue = newValue.toLowerCase().replace(/\s+/g, "_");

            try {
                await dispatch(
                    changeProjectStatus({
                        id: actualProjectId,
                        payload: { status: apiCompatibleValue },
                    })
                ).unwrap();

                dispatch(fetchProjects());
            } catch (err) {
                console.error(
                    `Failed to update project status for ID ${actualProjectId}:`,
                    err
                );
            }
        },
        [dispatch]
    );

    const handleProjectStatusChange = useCallback(
        ({ id, status }) => {
            setProjects((prev) =>
                prev.map((proj) => (proj.id === id ? { ...proj, status } : proj))
            );
            handleStatusChange({
                id: `P-${id}`,
                payload: status,
            });
        },
        [handleStatusChange]
    );

    const handleDrop = useCallback(
        (item, newStatus) => {
            const { type, id, fromTaskId } = item;

            if (type === "TASK") {
                handleUpdateTaskFieldCell(id, "status", newStatus);
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
                handleUpdateTaskFieldCell(id, "status", newStatus);
            } else if (type === "PROJECT") {
                handleProjectStatusChange({ id, status: newStatus });
            }
        },
        [handleUpdateTaskFieldCell, handleProjectStatusChange]
    );

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
                // Handle both flat array and nested arrays
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
                // Handle both flat array and nested arrays
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

    return (
        <div className="relative">
            <div className="h-[80%] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap" style={{ height: "75vh" }}>
                {cardsTitle.map((card) => {
                    const filteredTasks = taskData.filter((task) => {
                        const cardStatus = card.title.toLowerCase().replace(" ", "_");

                        if (cardStatus === "active") {
                            return task.status === "open";
                        }
                        return task.status === cardStatus;
                    });

                    const filteredProjects = projects.filter(
                        (project) => project.status === card.title.replace(" ", "_").toLocaleLowerCase()
                    );

                    return (
                        <Boards
                            key={card.id}
                            add={card.add}
                            color={card.color}
                            count={
                                section === "Tasks"
                                    ? filteredTasks.length
                                    : filteredProjects.length
                            }
                            title={card.title}
                            onDrop={handleDrop}
                        >
                            {section === "Tasks" ? (
                                filteredTasks.length > 0 ? (
                                    filteredTasks.map((task) => {
                                        const taskId = `task-${task.id}`;
                                        let dependsOnArr = [];

                                        // Process predecessor_task
                                        if (Array.isArray(task.predecessor_task)) {
                                            dependsOnArr = [
                                                ...dependsOnArr,
                                                ...task.predecessor_task.flat().filter(Boolean)
                                            ];
                                        }

                                        // Process successor_task
                                        if (Array.isArray(task.successor_task)) {
                                            dependsOnArr = [
                                                ...dependsOnArr,
                                                ...task.successor_task.flat().filter(Boolean)
                                            ];
                                        }

                                        dependsOnArr = [...new Set(dependsOnArr.filter(id => id && id !== task.id))];
                                        const formattedDependsOn = dependsOnArr.map(dep => `task-${dep}`);

                                        const allLinked =
                                            formattedDependsOn.length > 0 &&
                                            formattedDependsOn.every(depId =>
                                                arrowLinks.some(
                                                    link =>
                                                        (link.sourceId === depId && link.targetId === taskId) ||
                                                        (link.sourceId === taskId && link.targetId === depId)
                                                )
                                            );

                                        console.log("Formatted Depends On:", formattedDependsOn);

                                        // Only show the link icon if there are dependencies
                                        return (
                                            <div key={task.id} id={taskId} className="relative">
                                                <TaskCard
                                                    task={task}
                                                    toggleSubCard={() => toggleSubCard(task.id)}
                                                    {...(formattedDependsOn.length > 0 && {
                                                        handleLink: () => handleLink(taskId, formattedDependsOn),
                                                        iconColor: allLinked ? "#A0A0A0" : "#DA2400"
                                                    })}
                                                />
                                                {task?.sub_tasks_managements.map((subtask) => (
                                                    <TaskSubCard
                                                        key={subtask.id}
                                                        subtask={subtask}
                                                        isVisible={subCardVisibility[task.id] || false}
                                                    />
                                                ))}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <img
                                        src="/draganddrop.svg"
                                        alt="svg"
                                        className="w-full"
                                    />
                                )
                            ) : (
                                filteredProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        id={`project-${project.id}`}
                                        className="relative"
                                    >
                                        <ProjectCard project={project} />
                                    </div>
                                ))
                            )}
                        </Boards>
                    );
                })}
            </div>

            {/* Xarrows */}
            {allArrows.map((link, index) => {
                const isDependencyArrow = dependencyArrows.some(
                    dep =>
                        dep.sourceId === link.sourceId &&
                        dep.targetId === link.targetId
                );

                let dashness = false;
                let strokeWidth = 1.5;
                let color = "#DA2400";

                if (isDependencyArrow) {
                    const dependency = dependencyArrows.find(
                        dep =>
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

export default BoardsSection;