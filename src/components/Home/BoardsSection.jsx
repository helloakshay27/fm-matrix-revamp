// import { useEffect, useState, useCallback } from "react";
// import Boards from "./Boards";
// import TaskCard from "./Task/TaskCard";
// import ProjectCard from "./Projects/ProjectCard";
// import Xarrow from "react-xarrows";
// import { cardsTitle } from "../../data/Data";
// import TaskSubCard from "./Task/TaskSubCard";
// import { useDispatch, useSelector, batch } from "react-redux";
// import { changeProjectStatus, fetchProjects } from "../../redux/slices/projectSlice";
// import { changeTaskStatus, fetchTasks } from "../../redux/slices/taskSlice";
// import useDeepCompareEffect from "use-deep-compare-effect";
// import { debounce } from "lodash";

// const BoardsSection = ({ section }) => {
//     const [subCardVisibility, setSubCardVisibility] = useState({});
//     const [arrowLinks, setArrowLinks] = useState([]);
//     const dispatch = useDispatch();

//     const [projects, setProjects] = useState([]);
//     const [taskData, setTaskData] = useState([]);

//     const [isUpdatingTask, setIsUpdatingTask] = useState(false);
//     const [localError, setLocalError] = useState(null);
//     const projectState = useSelector((state) => state.fetchProjects.fetchProjects);
//     const taskState = useSelector((state) => state.fetchTasks.fetchTasks);

//     console.log("Task State:", taskState);

//     useEffect(() => {
//         batch(() => {
//             if (section === "Tasks") {
//                 dispatch(fetchTasks());
//             } else {
//                 dispatch(fetchProjects());
//             }
//         });
//     }, [dispatch, section]);

//     useDeepCompareEffect(() => {
//         setProjects(projectState);
//     }, [projectState]);

//     useDeepCompareEffect(() => {
//         setTaskData(taskState);
//     }, [taskState]);

//     const toggleSubCard = useCallback((taskId) => {
//         setSubCardVisibility((prev) => ({
//             ...prev,
//             [taskId]: !prev[taskId],
//         }));
//     }, []);

//     const updateTaskDataField = useCallback((taskId, fieldName, newValue) => {
//         setTaskData((prev) => {
//             let changed = false;
//             const updated = prev.map((task) => {
//                 if (task.id === taskId) {
//                     if (task[fieldName] === newValue) return task;
//                     changed = true;
//                     return { ...task, [fieldName]: newValue };
//                 }
//                 return task;
//             });
//             return changed ? updated : prev;
//         });
//     }, []);

//     const debouncedUpdateTaskField = useCallback(
//         debounce(async (taskId, fieldName, newValue) => {
//             try {
//                 await dispatch(
//                     changeTaskStatus({ id: taskId, payload: { [fieldName]: newValue } })
//                 ).unwrap();
//             } catch (error) {
//                 console.error(`Task update failed for ${taskId}:`, error);
//                 setLocalError(
//                     `Update failed: ${error?.response?.data?.errors || error?.message || "Server error"}`
//                 );
//                 dispatch(fetchTasks());
//             }
//         }, 300),
//         [dispatch]
//     );

//     const handleUpdateTaskFieldCell = useCallback(
//         (taskId, fieldName, newValue) => {
//             if (isUpdatingTask) return;

//             setIsUpdatingTask(true);
//             setLocalError(null);

//             updateTaskDataField(taskId, fieldName, newValue);
//             debouncedUpdateTaskField(taskId, fieldName, newValue);
//             setIsUpdatingTask(false);
//         },
//         [debouncedUpdateTaskField, isUpdatingTask, updateTaskDataField]
//     );

//     const handleStatusChange = useCallback(
//         async ({ id: rowId, payload: newValue }) => {
//             const actualProjectId = rowId.replace("P-", "");
//             const apiCompatibleValue = newValue.toLowerCase().replace(/\s+/g, "_");

//             try {
//                 await dispatch(
//                     changeProjectStatus({
//                         id: actualProjectId,
//                         payload: { status: apiCompatibleValue },
//                     })
//                 ).unwrap();

//                 dispatch(fetchProjects());
//             } catch (err) {
//                 console.error(`Failed to update project status for ID ${actualProjectId}:`, err);
//             }
//         },
//         [dispatch]
//     );

//     const handleProjectStatusChange = useCallback(
//         ({ id, status }) => {
//             setProjects((prev) =>
//                 prev.map((proj) => (proj.id === id ? { ...proj, status } : proj))
//             );
//             handleStatusChange({
//                 id: `P-${id}`,
//                 payload: status,
//             });
//         },
//         [handleStatusChange]
//     );

//     const handleDrop = useCallback(
//         (item, newStatus) => {
//             const { type, id, fromTaskId } = item;

//             if (type === "TASK") {
//                 handleUpdateTaskFieldCell(id, "status", newStatus);
//             } else if (type === "SUBTASK") {
//                 setTaskData((prev) =>
//                     prev.map((task) =>
//                         task.id === fromTaskId
//                             ? {
//                                 ...task,
//                                 sub_tasks_managements: task.sub_tasks_managements.map((subtask) =>
//                                     subtask.id === id ? { ...subtask, status: newStatus } : subtask
//                                 ),
//                             }
//                             : task
//                     )
//                 );
//                 handleUpdateTaskFieldCell(id, "status", newStatus);
//             } else if (type === "PROJECT") {
//                 handleProjectStatusChange({ id, status: newStatus });
//             }
//         },
//         [handleUpdateTaskFieldCell, handleProjectStatusChange]
//     );

//     const handleLink = (sourceId, targetIds = []) => {
//         if (targetIds.length === 0) return;

//         setArrowLinks((prevLinks) => {
//             const areAllLinksActive = targetIds.every((targetId) =>
//                 prevLinks.some((link) => link.sourceId === sourceId && link.targetId === targetId)
//             );

//             if (areAllLinksActive) {
//                 return prevLinks.filter(
//                     (link) => !(link.sourceId === sourceId && targetIds.includes(link.targetId))
//                 );
//             } else {
//                 const newLinks = targetIds
//                     .filter((targetId) => !prevLinks.some((link) => link.sourceId === sourceId && link.targetId === targetId))
//                     .map((targetId) => ({ sourceId, targetId }));
//                 return [...prevLinks, ...newLinks];
//             }
//         });
//     };

//     const buildDependencyArrows = () => {
//         const arrows = [];

//         arrowLinks.forEach((link) => {
//             const sourceNum = parseInt(link.sourceId.replace("task-", ""));
//             const targetNum = parseInt(link.targetId.replace("task-", ""));
//             const sourceTask = taskData.find((t) => t.id === sourceNum);
//             const targetTask = taskData.find((t) => t.id === targetNum);

//             // Predecessor arrows
//             if (targetTask && Array.isArray(targetTask.predecessor_task)) {
//                 const flatPredecessors = targetTask.predecessor_task.flat();
//                 if (flatPredecessors.includes(sourceNum)) {
//                     arrows.push({
//                         sourceId: `task-${sourceNum}`,
//                         targetId: `task-${targetNum}`,
//                         type: "predecessor",
//                     });
//                 }
//             }

//             // Successor arrows
//             if (sourceTask && Array.isArray(sourceTask.successor_task)) {
//                 const flatSuccessors = sourceTask.successor_task.flat();
//                 if (flatSuccessors.includes(targetNum)) {
//                     arrows.push({
//                         sourceId: `task-${sourceNum}`,
//                         targetId: `task-${targetNum}`,
//                         type: "successor",
//                     });
//                 }
//             }
//         });
//         return arrows;
//     };

//     const dependencyArrows = buildDependencyArrows();
//     const allArrows = [
//         ...arrowLinks,
//         ...dependencyArrows.filter(
//             (dep) => !arrowLinks.some((link) => link.sourceId === dep.sourceId && link.targetId === dep.targetId)
//         ),
//     ];

//     return (
//         <div className="relative">
//             <div
//                 className="h-[80%] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap"
//                 style={{ height: "75vh" }}
//             >
//                 {cardsTitle.map((card) => {
//                     const filteredTasks = taskData.filter((task) => {
//                         const cardStatus = card.title.toLowerCase().replace(" ", "_");

//                         if (cardStatus === "active") {
//                             return task.status === "open";
//                         }
//                         return task.status === cardStatus;
//                     });

//                     const filteredProjects = projects.filter(
//                         (project) => project.status === card.title.replace(" ", "_").toLocaleLowerCase()
//                     );

//                     return (
//                         <Boards
//                             key={card.id}
//                             add={card.add}
//                             color={card.color}
//                             count={section === "Tasks" ? filteredTasks.length : filteredProjects.length}
//                             title={card.title}
//                             onDrop={handleDrop}
//                         >
//                             {section === "Tasks" ? (
//                                 filteredTasks.length > 0 ? (
//                                     filteredTasks.map((task) => {
//                                         const taskId = `task-${task.id}`;
//                                         let dependsOnArr = [];

//                                         // Process predecessor_task
//                                         if (Array.isArray(task.predecessor_task)) {
//                                             dependsOnArr = [...dependsOnArr, ...task.predecessor_task.flat().filter(Boolean)];
//                                         }

//                                         // Process successor_task
//                                         if (Array.isArray(task.successor_task)) {
//                                             dependsOnArr = [...dependsOnArr, ...task.successor_task.flat().filter(Boolean)];
//                                         }

//                                         dependsOnArr = [...new Set(dependsOnArr.filter((id) => id && id !== task.id))];
//                                         const formattedDependsOn = dependsOnArr.map((dep) => `task-${dep}`);

//                                         const allLinked =
//                                             formattedDependsOn.length > 0 &&
//                                             formattedDependsOn.every((depId) =>
//                                                 arrowLinks.some(
//                                                     (link) =>
//                                                         (link.sourceId === depId && link.targetId === taskId) ||
//                                                         (link.sourceId === taskId && link.targetId === depId)
//                                                 )
//                                             );

//                                         return (
//                                             <div key={task.id} id={taskId} className="relative">
//                                                 <TaskCard
//                                                     task={task}
//                                                     toggleSubCard={() => toggleSubCard(task.id)}
//                                                     {...(formattedDependsOn.length > 0 && {
//                                                         handleLink: () => handleLink(taskId, formattedDependsOn),
//                                                         iconColor: allLinked ? "#A0A0A0" : "#DA2400",
//                                                     })}
//                                                 />
//                                                 {task?.sub_tasks_managements.map((subtask) => (
//                                                     <div key={subtask.id} className="mb-2">
//                                                         <div
//                                                             className={`text-[8px] font-medium text-gray-500 mb-1 me-2 border-t text-end border-gray-300 pt-1 ${subCardVisibility[task.id] ? "block" : "hidden"}`}
//                                                             style={{ fontStyle: "italic" }}
//                                                         >
//                                                             Subcard of Task-{task.id}
//                                                         </div>
//                                                         <TaskSubCard
//                                                             subtask={subtask}
//                                                             isVisible={subCardVisibility[task.id] || false}
//                                                         />
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         );
//                                     })
//                                 ) : (
//                                     <img src="/draganddrop.svg" alt="svg" className="w-full" />
//                                 )
//                             ) : (
//                                 filteredProjects.map((project) => (
//                                     <div key={project.id} id={`project-${project.id}`} className="relative">
//                                         <ProjectCard project={project} />
//                                     </div>
//                                 ))
//                             )}
//                         </Boards>
//                     );
//                 })}
//             </div>

//             {/* Xarrows */}
//             {allArrows.map((link, index) => {
//                 const isDependencyArrow = dependencyArrows.some(
//                     (dep) => dep.sourceId === link.sourceId && dep.targetId === link.targetId
//                 );

//                 let dashness = false;
//                 let strokeWidth = 1.5;
//                 let color = "#DA2400";

//                 if (isDependencyArrow) {
//                     const dependency = dependencyArrows.find(
//                         (dep) => dep.sourceId === link.sourceId && dep.targetId === link.targetId
//                     );

//                     if (dependency?.type === "predecessor") {
//                         dashness = false;
//                         strokeWidth = 1;
//                         color = "#A0A0A0";
//                     } else if (dependency?.type === "successor") {
//                         dashness = { strokeLen: 8, nonStrokeLen: 6 };
//                         strokeWidth = 1.5;
//                         color = "#DA2400";
//                     }
//                 }

//                 return (
//                     <Xarrow
//                         key={`${link.sourceId}-${link.targetId}-${index}`}
//                         start={link.sourceId}
//                         end={link.targetId}
//                         strokeWidth={strokeWidth}
//                         headSize={6}
//                         curveness={0.3}
//                         color={color}
//                         lineColor={color}
//                         showHead={true}
//                         dashness={dashness}
//                         path="smooth"
//                         className="custom-xarrow"
//                     />
//                 );
//             })}
//         </div>
//     );
// };

// export default BoardsSection;


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
    const dispatch = useDispatch();

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
    }, [dispatch, section]);

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
                // Also update subtask if id matches
                if (task.sub_tasks_managements) {
                    const updatedSubtasks = task.sub_tasks_managements.map((subtask) => {
                        if (subtask.id === taskId && subtask[fieldName] !== newValue) {
                            changed = true;
                            return { ...subtask, [fieldName]: newValue };
                        }
                        return subtask;
                    });
                    if (changed) {
                        return { ...task, sub_tasks_managements: updatedSubtasks };
                    }
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
                    `Update failed: ${error?.response?.data?.errors || error?.message || "Server error"}`
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
                console.error(`Failed to update project status for ID ${actualProjectId}:`, err);
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

    // Handle dropping TASK, SUBTASK or PROJECT
    const handleDrop = useCallback(
        (item, newStatus) => {
            const { type, id, fromTaskId } = item;

            if (type === "TASK") {
                handleUpdateTaskFieldCell(id, "status", newStatus);
            } else if (type === "SUBTASK") {
                // Update subtask in taskData and backend
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
                prevLinks.some((link) => link.sourceId === sourceId && link.targetId === targetId)
            );

            if (areAllLinksActive) {
                return prevLinks.filter(
                    (link) => !(link.sourceId === sourceId && targetIds.includes(link.targetId))
                );
            } else {
                const newLinks = targetIds
                    .filter((targetId) => !prevLinks.some((link) => link.sourceId === sourceId && link.targetId === targetId))
                    .map((targetId) => ({ sourceId, targetId }));
                return [...prevLinks, ...newLinks];
            }
        });
    };

    const buildDependencyArrows = () => {
        const arrows = [];

        arrowLinks.forEach((link) => {
            const sourceNum = parseInt(link.sourceId.replace("task-", ""));
            const targetNum = parseInt(link.targetId.replace("task-", ""));
            const sourceTask = taskData.find((t) => t.id === sourceNum);
            const targetTask = taskData.find((t) => t.id === targetNum);

            // Predecessor arrows
            if (targetTask && Array.isArray(targetTask.predecessor_task)) {
                const flatPredecessors = targetTask.predecessor_task.flat();
                if (flatPredecessors.includes(sourceNum)) {
                    arrows.push({
                        sourceId: `task-${sourceNum}`,
                        targetId: `task-${targetNum}`,
                        type: "predecessor",
                    });
                }
            }

            // Successor arrows
            if (sourceTask && Array.isArray(sourceTask.successor_task)) {
                const flatSuccessors = sourceTask.successor_task.flat();
                if (flatSuccessors.includes(targetNum)) {
                    arrows.push({
                        sourceId: `task-${sourceNum}`,
                        targetId: `task-${targetNum}`,
                        type: "successor",
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
            (dep) => !arrowLinks.some((link) => link.sourceId === dep.sourceId && link.targetId === dep.targetId)
        ),
    ];

    return (
        <div className="relative">
            <div
                className="h-[80%] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap"
                style={{ height: "75vh" }}
            >
                {cardsTitle.map((card) => {
                    const cardStatus = card.title.toLowerCase().replace(" ", "_");

                    // Filter tasks by status, note: 'active' maps to task.status === "open"
                    const filteredTasks = taskData.filter((task) =>
                        cardStatus === "active" ? task.status === "open" : task.status === cardStatus
                    );

                    // Filter subtasks that belong to tasks and have the current status
                    const filteredSubtasks = taskData.flatMap((task) =>
                        (task.sub_tasks_managements || []).filter((subtask) =>
                            cardStatus === "active"
                                ? subtask.status === "open"
                                : subtask.status === cardStatus
                        )
                    );

                    // Filter projects by status
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
                                    ? filteredTasks.length + filteredSubtasks.length
                                    : filteredProjects.length
                            }
                            title={card.title}
                            onDrop={handleDrop}
                        >
                            {section === "Tasks" ? (
                                filteredTasks.length + filteredSubtasks.length > 0 ? (
                                    <>
                                        {/* Render Tasks */}
                                        {filteredTasks.map((task) => {
                                            const taskId = `task-${task.id}`;
                                            let dependsOnArr = [];

                                            if (Array.isArray(task.predecessor_task)) {
                                                dependsOnArr = [...dependsOnArr, ...task.predecessor_task.flat().filter(Boolean)];
                                            }
                                            if (Array.isArray(task.successor_task)) {
                                                dependsOnArr = [...dependsOnArr, ...task.successor_task.flat().filter(Boolean)];
                                            }

                                            dependsOnArr = [...new Set(dependsOnArr.filter((id) => id && id !== task.id))];
                                            const formattedDependsOn = dependsOnArr.map((dep) => `task-${dep}`);

                                            const allLinked =
                                                formattedDependsOn.length > 0 &&
                                                formattedDependsOn.every((depId) =>
                                                    arrowLinks.some(
                                                        (link) =>
                                                            (link.sourceId === depId && link.targetId === taskId) ||
                                                            (link.sourceId === taskId && link.targetId === depId)
                                                    )
                                                );

                                            // Subtasks filtered by current board status
                                            const visibleSubtasks = (task.sub_tasks_managements || []).filter((subtask) =>
                                                cardStatus === "active" ? subtask.status === "open" : subtask.status === cardStatus
                                            );

                                            return (
                                                <div key={task.id} id={taskId} className="relative">
                                                    <TaskCard
                                                        task={task}
                                                        toggleSubCard={() => toggleSubCard(task.id)}
                                                        {...(formattedDependsOn.length > 0 && {
                                                            handleLink: () => handleLink(taskId, formattedDependsOn),
                                                            iconColor: allLinked ? "#A0A0A0" : "#DA2400",
                                                        })}
                                                    />

                                                    {/* Show subtasks only if subCardVisibility is true */}
                                                    {visibleSubtasks.length > 0 && subCardVisibility[task.id] && (
                                                        <div className="ml-5 mt-1">
                                                            <div
                                                                className="text-[8px] font-medium text-gray-500 mb-1 me-2 border-t border-gray-300 pt-1 text-end italic"
                                                            >
                                                                Subcard of Task-{task.id}
                                                            </div>

                                                            {visibleSubtasks.map((subtask) => (
                                                                <div
                                                                    key={subtask.id}
                                                                    draggable
                                                                    onDragStart={(e) => {
                                                                        e.dataTransfer.setData(
                                                                            "application/reactflow",
                                                                            JSON.stringify({ type: "SUBTASK", id: subtask.id, fromTaskId: task.id })
                                                                        );
                                                                        e.dataTransfer.effectAllowed = "move";
                                                                    }}
                                                                    className="mb-2 cursor-move"
                                                                >
                                                                    <TaskSubCard subtask={subtask} isVisible={true} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* Also render subtasks that do NOT belong to any tasks? (Optional) */}
                                        {/* If your subtasks always belong to a parent task, this can be skipped */}
                                    </>
                                ) : (
                                    <img src="/draganddrop.svg" alt="svg" className="w-full" />
                                )
                            ) : (
                                filteredProjects.map((project) => (
                                    <div key={project.id} id={`project-${project.id}`} className="relative">
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
                    (dep) => dep.sourceId === link.sourceId && dep.targetId === link.targetId
                );

                let dashness = false;
                let strokeWidth = 1.5;
                let color = "#DA2400";

                if (isDependencyArrow) {
                    const dependency = dependencyArrows.find(
                        (dep) => dep.sourceId === link.sourceId && dep.targetId === link.targetId
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
