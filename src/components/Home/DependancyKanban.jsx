import { useCallback, useEffect, useState } from "react";
import DependancyBoardCard from "../Home/DependancyBoardCard";
import DependancyKanbanBoard from "../Home/DependancyKanbanBoard";
import { useDispatch, useSelector } from 'react-redux';
import { createDependancy, fetchTasksOfProject, updateDependancy } from "../../redux/slices/taskSlice";
import DependancyBoardSubCard from "./DependancyBoardSubCard";

const DependancyKanban = () => {
    const dispatch = useDispatch();

    const { fetchTasksOfProject: tasks = [] } = useSelector(state => state.fetchTasksOfProject);
    const { taskDetails: task } = useSelector(state => state.taskDetails);

    const [taskData, setTaskData] = useState([]);
    const [subCardVisibility, setSubCardVisibility] = useState({});

    useEffect(() => {
        if (task?.project_management_id) {
            dispatch(fetchTasksOfProject(task.project_management_id));
        }
    }, [dispatch, task?.project_management_id]);

    useEffect(() => {
        if (tasks.length > 0 && task?.id) {
            const predecessorIds = (task?.predecessor_task || []).flat();
            const successorIds = (task?.successor_task || []).flat();

            const updatedData = tasks.map(t => {
                let section = "List of Tasks";

                if (t.id === task.id) {
                    section = "Main Task";
                } else if (predecessorIds.includes(t.id)) {
                    section = "Predecessor";
                } else if (successorIds.includes(t.id)) {
                    section = "Successor";
                }

                const updatedSubtasks = t.sub_tasks_managements?.map(sub => {
                    let subSection = "List of Tasks";
                    if (predecessorIds.includes(sub.id)) {
                        subSection = "Predecessor";
                    } else if (successorIds.includes(sub.id)) {
                        subSection = "Successor";
                    }
                    return { ...sub, section: subSection };
                });

                return {
                    ...t,
                    section,
                    sub_tasks_managements: updatedSubtasks || [],
                };
            });

            setTaskData(updatedData);
        }
    }, [tasks, task]);

    const handleDrop = async (item, newStatus) => {
        const { id: draggedId, isSubtask, fromTaskId } = item;

        // Update taskData state
        setTaskData(prev =>
            prev.map(task => {
                if (isSubtask && task.id === fromTaskId) {
                    return {
                        ...task,
                        sub_tasks_managements: task.sub_tasks_managements?.map(subtask =>
                            subtask.id === draggedId ? { ...subtask, section: newStatus } : subtask
                        ) || [],
                    };
                } else if (!isSubtask && task.id === draggedId) {
                    return { ...task, section: newStatus };
                }
                return task;
            })
        );

        // Handle dependency creation/update
        if (["Predecessor", "Successor"].includes(newStatus) && task?.id) {
            const payload = {
                task_dependency: {
                    task_id: task.id,
                    dependent_task_id: draggedId,
                    active: true,
                    project_management_id: task.project_management_id,
                    dependence_type: newStatus,
                    is_subtask: isSubtask, // Include isSubtask in payload
                },
            };

            // Find existing dependency
            const dependancyId = task?.task_dependencies?.find(d =>
                d.dependent_task_id === draggedId && d.is_subtask === isSubtask
            )?.id;

            const predecessorIds = (task?.predecessor_task || []).flat();
            const successorIds = (task?.successor_task || []).flat();

            const alreadyPredecessor = predecessorIds.includes(draggedId);
            const alreadySuccessor = successorIds.includes(draggedId);

            try {
                if (dependancyId && (alreadyPredecessor || alreadySuccessor)) {
                    await dispatch(updateDependancy({ id: dependancyId, payload })).unwrap();
                } else {
                    await dispatch(createDependancy({ payload })).unwrap();
                }
            } catch (error) {
                console.error("Failed to update/create dependency:", error);
                // Optionally revert state update on failure
                setTaskData(prev =>
                    prev.map(task => {
                        if (isSubtask && task.id === fromTaskId) {
                            return {
                                ...task,
                                sub_tasks_managements: task.sub_tasks_managements?.map(subtask =>
                                    subtask.id === draggedId ? { ...subtask, section: item.fromStatus || "List of Tasks" } : subtask
                                ) || [],
                            };
                        } else if (!isSubtask && task.id === draggedId) {
                            return { ...task, section: item.fromStatus || "List of Tasks" };
                        }
                        return task;
                    })
                );
            }
        }
    };

    const toggleSubCard = useCallback((taskId) => {
        setSubCardVisibility((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    }, []);

    return (
        <div className="min-h-[400px] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap">
            {["List of Tasks", "Predecessor", "Main Task", "Successor"].map(card => {
                const filteredTasks = taskData.filter(task => task.section === card);

                const independentSubtasks = taskData.flatMap(task =>
                    (task.sub_tasks_managements || [])
                        .filter(sub => sub.section === card)
                        .map(sub => ({ ...sub, parentTask: task }))
                );

                return (
                    <DependancyKanbanBoard title={card} onDrop={handleDrop} key={card}>
                        {(filteredTasks.length > 0 || independentSubtasks.length > 0) ? (
                            <>
                                {filteredTasks.map(task => (
                                    <div key={task.id}>
                                        <div className="w-full">
                                            <DependancyBoardCard
                                                task={task}
                                                draggable={card !== "Main Task"}
                                                toggleSubCard={() => toggleSubCard(task.id)}
                                            />
                                        </div>
                                        {subCardVisibility[task.id] &&
                                            (task.sub_tasks_managements || [])
                                                .filter(sub => sub.section === card)
                                                .map(subtask => (
                                                    <DependancyBoardSubCard
                                                        key={subtask.id}
                                                        subtask={subtask}
                                                        isVisible={true}
                                                        draggable={card !== "Main Task"}
                                                        item={{
                                                            id: subtask.id,
                                                            isSubtask: true,
                                                            fromTaskId: subtask.parent_id,
                                                        }}
                                                    />
                                                ))}
                                    </div>
                                ))}

                                {independentSubtasks.map(subtask => (
                                    <DependancyBoardSubCard
                                        key={subtask.id}
                                        subtask={subtask}
                                        isVisible={true}
                                        draggable={card !== "Main Task"}
                                        item={{
                                            id: subtask.id,
                                            isSubtask: true,
                                            fromTaskId: subtask.parent_id,
                                        }}
                                    />
                                ))}
                            </>
                        ) : (
                            <img src="/draganddrop.svg" alt="svg" className="w-full" />
                        )}
                    </DependancyKanbanBoard>
                );
            })}
        </div>
    );
};

export default DependancyKanban;
