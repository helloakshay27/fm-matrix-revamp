import { useEffect, useState, useCallback } from "react";
import Boards from "./Boards";
import TaskCard from "./Task/TaskCard";
import ProjectCard from "./Projects/ProjectCard";
import Xarrow from "react-xarrows";
import { cardsTitle } from "../../data/Data";
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
    // Selectors with memoization (assuming createSelector in slice, else plain)
    const projectState = useSelector((state) => state.fetchProjects.fetchProjects);
    const taskState = useSelector((state) => state.fetchTasks.fetchTasks);

    // Local state



    useEffect(() => {
        batch(() => {
            if (section === "Tasks") {
                dispatch(fetchTasks());
            } else {
                dispatch(fetchProjects());
            }
        });
    }, [dispatch]);

    // Sync projects with deep comparison to avoid unnecessary sets/rerenders
    useDeepCompareEffect(() => {
        setProjects(projectState);
    }, [projectState]);

    // Sync tasks similarly
    useDeepCompareEffect(() => {
        setTaskData(taskState);
    }, [taskState]);

    // Toggle subtask visibility
    const toggleSubCard = useCallback((taskId) => {
        setSubCardVisibility((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    }, []);

    // Update local task field only if value changed
    const updateTaskDataField = useCallback((taskId, fieldName, newValue) => {
        setTaskData((prev) => {
            let changed = false;
            const updated = prev.map((task) => {
                if (task.id === taskId) {
                    if (task[fieldName] === newValue) return task; // no change
                    changed = true;
                    return { ...task, [fieldName]: newValue };
                }
                return task;
            });
            return changed ? updated : prev;
        });
    }, []);

    // Debounced dispatch for task update to reduce backend calls on rapid changes
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

    // Optimistic Task Field Update handler
    const handleUpdateTaskFieldCell = useCallback(
        (taskId, fieldName, newValue) => {
            if (isUpdatingTask) return;

            setIsUpdatingTask(true);
            setLocalError(null);

            // Optimistic update locally
            updateTaskDataField(taskId, fieldName, newValue);

            // Debounced backend update
            debouncedUpdateTaskField(taskId, fieldName, newValue);

            // Release lock immediately (debounced call handles backend)
            setIsUpdatingTask(false);
        },
        [debouncedUpdateTaskField, isUpdatingTask, updateTaskDataField]
    );

    // Optimistic Project Status Update
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

                dispatch(fetchProjects()); // Re-sync project list after update
            } catch (err) {
                console.error(
                    `Failed to update project status for ID ${actualProjectId}:`,
                    err
                );
            }
        },
        [dispatch]
    );

    // Optimistically update project status locally
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

    // Handle Drop for Task, Subtask, Project
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

                console.log("Subtask dropped:", id, "New Status:", newStatus);
                handleUpdateTaskFieldCell(id, "status", newStatus);
            } else if (type === "PROJECT") {
                handleProjectStatusChange({ id, status: newStatus });
                console.log("Project dropped:", id, "New Status:", newStatus);
            }
        },
        [handleUpdateTaskFieldCell, handleProjectStatusChange]
    );




    // NEW: Handle multiple arrow toggle per task
    const handleLink = (sourceId, targetIds = []) => {
        if (targetIds.length === 0) return;

        setArrowLinks((prevLinks) => {
            const areAllLinksActive = targetIds.every((targetId) =>
                prevLinks.some(link => link.sourceId === sourceId && link.targetId === targetId)
            );

            if (areAllLinksActive) {
                // Remove all current arrows from this task
                return prevLinks.filter(
                    link => !(link.sourceId === sourceId && targetIds.includes(link.targetId))
                );
            } else {
                // Add missing arrows
                const newLinks = targetIds
                    .filter(targetId => !prevLinks.some(link => link.sourceId === sourceId && link.targetId === targetId))
                    .map(targetId => ({ sourceId, targetId }));
                return [...prevLinks, ...newLinks];
            }
        });
    };



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


                    console.log("filter", filteredTasks)
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
                                        const dependsOnArr = Array.isArray(task.dependsOn)
                                            ? task.dependsOn
                                            : task.dependsOn
                                                ? [task.dependsOn]
                                                : [];

                                        const formattedDependsOn = dependsOnArr.map(dep => `task-${dep}`);

                                        const allLinked = formattedDependsOn.length > 0 &&
                                            formattedDependsOn.every(depId =>
                                                arrowLinks.some(link => link.sourceId === taskId && link.targetId === depId)
                                            );

                                        return (
                                            <div key={task.id} id={taskId} className="relative">
                                                <TaskCard
                                                    task={task}
                                                    toggleSubCard={() => toggleSubCard(task.id)}
                                                    handleLink={() => {
                                                        handleLink(taskId, formattedDependsOn);
                                                    }}
                                                    iconColor={allLinked ? "#DA2400" : "#A0A0A0"}
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
            {arrowLinks.map((link, index) => (
                <Xarrow
                    key={`${link.sourceId}-${link.targetId}`}
                    start={link.sourceId}
                    end={link.targetId}
                    strokeWidth={1.5}
                    headSize={6}
                    curveness={0.3}
                    color="#DA2400"
                    lineColor="#DA2400"
                    showHead={true}
                    dashness={false}
                    path="smooth"
                    // zIndex={1000 + index} // ensures higher layer for newer arrows
                    // labels={
                    //     <div className="text-xs text-red-700 bg-white p-1 rounded shadow">
                    //         {${link.sourceId.replace('task-', '')} ➜ ${link.targetId.replace('task-', '')}}
                    //     </div>
                    // }
                    className="custom-xarrow"
                />
            ))}

        </div>
    );
};

export default BoardsSection;