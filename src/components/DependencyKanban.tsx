import { useEffect, useState } from "react";
import DependencyTaskCard from "./DependencyTaskCard";
import DependencyKanbanBoard from "./DependencyKanbanBoard";
import {
    DndContext,
    DragEndEvent,
    closestCorners,
    DragStartEvent,
} from "@dnd-kit/core";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjectTasks, fetchProjectTasksById, createTaskDependency, updateTaskDependency, deleteTaskDependency } from "@/store/slices/projectTasksSlice";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface DependencyTask {
    id?: string | number;
    title?: string;
    section?: string;
    priority?: string;
    responsible_person_name?: string;
    milestone?: string | object;
    target_date?: string;
    predecessor_task?: number[];
    successor_task?: number[];
    parent_id?: number;
    sub_tasks_managements?: DependencyTask[];
    milestone_id?: string | number;
    task_dependencies?: any[];
}

interface DependencyKanbanProps {
    currentTask?: DependencyTask;
    dependencies?: DependencyTask[];
    onDependenciesChange?: () => void;
}

const DependencyKanban = ({
    currentTask,
    dependencies = [],
    onDependenciesChange,
}: DependencyKanbanProps) => {
    const { tid, id } = useParams<{ tid?: string; id?: string }>();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl') || '';
    const dispatch = useAppDispatch();

    const { data: tasks = {} } = useAppSelector((state: any) => state.fetchProjectTasks);
    const { data: task } = useAppSelector((state: any) => state.fetchProjectTasksById);

    const [taskData, setTaskData] = useState<DependencyTask[]>([]);
    const [parentTask, setParentTask] = useState<DependencyTask | null>(null);
    const [draggedItem, setDraggedItem] = useState<any>(null);

    // ✅ Fetch milestone tasks only if it's a main task (no parent)
    useEffect(() => {
        if (task?.milestone_id && !task?.parent_id) {
            dispatch(fetchProjectTasks({ baseUrl, token, id: task.milestone_id }));
        }
    }, [dispatch, token, task?.milestone_id, task?.parent_id]);

    // ✅ If current task has a parent, fetch parent details (locally)
    useEffect(() => {
        const getParentTask = async () => {
            if (task?.parent_id) {
                const res = await dispatch(fetchProjectTasksById({ baseUrl, token, id: task.parent_id })).unwrap();
                if (res) {
                    setParentTask(res); // store parent locally
                }
                dispatch(fetchProjectTasksById({ baseUrl, token, id: tid }));
            }
        };
        getParentTask();
    }, [dispatch, token]);

    console.log(task);
    // ✅ Build taskData based on whether it’s a main or subtask
    useEffect(() => {
        // Case 1: Subtask (has parent_id)
        if (task?.parent_id && parentTask?.id) {
            const predecessorIds = (task?.predecessor_task || []).flat();
            const successorIds = (task?.successor_task || []).flat();

            const updatedData = (parentTask?.sub_tasks_managements || []).map((t: DependencyTask) => {
                if (t.id === task.id) {
                    return { ...t, section: 'Main Task' };
                } else if (predecessorIds.includes(Number(t.id))) {
                    return { ...t, section: 'Predecessor' };
                } else if (successorIds.includes(Number(t.id))) {
                    return { ...t, section: 'Successor' };
                } else {
                    return { ...t, section: 'List of Tasks' };
                }
            });

            console.log("Case 1 - Subtask:", updatedData);
            setTaskData(updatedData);
        }

        // Case 2: Main task (no parent)
        else if (tasks.task_managements?.length > 0 && task?.id) {
            const predecessorIds = (task?.predecessor_task || []).flat();
            const successorIds = (task?.successor_task || []).flat();

            const updatedData = (tasks?.task_managements || []).map((t: DependencyTask) => {
                if (t.id === task.id) {
                    return { ...t, section: 'Main Task' };
                } else if (predecessorIds.includes(Number(t.id))) {
                    return { ...t, section: 'Predecessor' };
                } else if (successorIds.includes(Number(t.id))) {
                    return { ...t, section: 'Successor' };
                } else {
                    return { ...t, section: 'List of Tasks' };
                }
            });

            console.log("Case 2 - Main task:", updatedData);
            setTaskData(updatedData);
        }
    }, [tasks, task, parentTask]);



    const handleDragStart = (event: DragStartEvent) => {
        const activeData = event.active.data.current;
        console.log("Drag start:", activeData);
        if (activeData?.type === "TASK") {
            setDraggedItem(activeData.task);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setDraggedItem(null);

        console.log("Drag end:", { active: active?.data.current, over: over?.data.current });

        if (!over || !active) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        if (activeData?.type === "TASK" && overData?.type === "KANBAN_COLUMN") {
            const draggedTaskId = activeData.taskId;
            const newSection = overData.title;

            console.log("Drop detected:", { draggedTaskId, newSection });

            // Update task data with new section
            setTaskData((prev) =>
                prev.map((t) =>
                    t.id === draggedTaskId ? { ...t, section: newSection } : t
                )
            );

            // Handle dependency updates
            if (["Predecessor", "Successor"].includes(newSection) && task?.id) {
                // Find if dependency already exists
                const dependencyId = (task?.task_dependencies as any)?.find(
                    (d: any) => d.dependent_task_id === draggedTaskId
                )?.id;

                const payload = {
                    task_dependency: {
                        task_id: task.id,
                        dependent_task_id: draggedTaskId,
                        active: true,
                        dependence_type: newSection,
                    },
                };

                const predecessorIds = (task?.predecessor_task || []).flat();
                const successorIds = (task?.successor_task || []).flat();

                const alreadyPredecessor = predecessorIds.includes(Number(draggedTaskId));
                const alreadySuccessor = successorIds.includes(Number(draggedTaskId));

                if (alreadyPredecessor || alreadySuccessor) {
                    // Update existing dependency
                    if (dependencyId) {
                        dispatch(
                            updateTaskDependency({
                                token: token || '',
                                baseUrl: baseUrl || '',
                                id: dependencyId.toString(),
                                data: payload,
                            })
                        )
                            .unwrap()
                            .then(() => {
                                toast.success("Dependency updated successfully");
                                onDependenciesChange?.();
                            })
                            .catch((error) => {
                                toast.error(error?.message || "Failed to update dependency");
                            });
                    }
                } else {
                    // Create new dependency
                    dispatch(
                        createTaskDependency({
                            token: token || '',
                            baseUrl: baseUrl || '',
                            data: payload,
                        })
                    )
                        .unwrap()
                        .then(() => {
                            toast.success("Dependency created successfully");
                            onDependenciesChange?.();
                        })
                        .catch((error) => {
                            toast.error(error?.message || "Failed to create dependency");
                        });
                }
            } else if (newSection === "List of Tasks") {
                // Delete dependency
                const dependencyId = (task?.task_dependencies as any)?.find(
                    (d: any) => d.dependent_task_id === draggedTaskId
                )?.id;

                if (dependencyId) {
                    dispatch(
                        deleteTaskDependency({
                            token: token || '',
                            baseUrl: baseUrl || '',
                            id: dependencyId.toString(),
                        })
                    )
                        .unwrap()
                        .then(() => {
                            toast.success("Dependency deleted successfully");
                            onDependenciesChange?.();
                        })
                        .catch((error) => {
                            toast.error(error?.message || "Failed to delete dependency");
                        });
                }
            }
        }
    };

    return (
        <DndContext
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="min-h-[400px] my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap">
                {["List of Tasks", "Predecessor", "Main Task", "Successor"].map((section) => {
                    const filteredTasks = taskData.filter((task) => task.section === section);
                    console.log(filteredTasks)
                    const isDropDisabled = section === "Main Task";

                    console.log(`Section "${section}":`, filteredTasks);

                    return (
                        <DependencyKanbanBoard
                            key={section}
                            title={section}
                            onDrop={isDropDisabled ? undefined : undefined}
                        >
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((task) => (
                                    <div key={task.id} className="w-full">
                                        <DependencyTaskCard
                                            task={task}
                                            draggable={section !== "Main Task"}
                                        />
                                    </div>
                                ))
                            ) : (
                                <img
                                    src="/draganddrop.svg"
                                    alt="svg"
                                    className="w-full"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            )}
                        </DependencyKanbanBoard>
                    );
                })}
            </div>
        </DndContext>
    );
};

export default DependencyKanban;
