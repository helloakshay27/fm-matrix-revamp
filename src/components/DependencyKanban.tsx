import { useAppDispatch } from "@/store/hooks";
import {
    DndContext,
    DragEndEvent,
    closestCorners,
    DragStartEvent,
    DragOverlay,
} from "@dnd-kit/core";
import { useCallback, useState, useEffect } from "react";
import KanbanBoard from "./KanbanBoard";
import { editProjectTask } from "@/store/slices/projectTasksSlice";
import Xarrow from "react-xarrows";
import { toast } from "sonner";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export const cardsTitle = [
    {
        id: 1,
        title: "Overdue",
        color: "#FF2733",
        add: false,
    },
    {
        id: 2,
        title: "Open",
        color: "#E4636A",
        add: true,
    },
    {
        id: 3,
        title: "In Progress",
        color: "#08AEEA",
        add: true,
    },
    {
        id: 4,
        title: "On Hold",
        color: "#7BD2B5",
        add: true,
    },
    {
        id: 5,
        title: "Completed",
        color: "#83D17A",
        add: false,
    },
];

interface DependencyTask {
    id?: string;
    title?: string;
    status?: string;
    priority?: string;
    responsible_person_name?: string;
    predecessor_task_ids?: number[];
    successor_task_ids?: number[];
}

interface DependencyKanbanProps {
    taskId?: string;
    dependencies?: DependencyTask[];
    onDependenciesChange?: () => void;
}

const DependencyKanban = ({ taskId, dependencies = [], onDependenciesChange }: DependencyKanbanProps) => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const [arrowLinks, setArrowLinks] = useState([]);
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [droppedTasks, setDroppedTasks] = useState<{ [key: string]: string }>({});
    const [taskData, setTaskData] = useState<DependencyTask[]>([]);

    useEffect(() => {
        setTaskData(dependencies || []);
    }, [dependencies]);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        const activeData = event.active.data.current;
        if (activeData?.type === "TASK") {
            setDraggedTaskId(activeData.taskId?.toString() || null);
        }
    }, []);

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            setDraggedTaskId(null);

            if (!over) return;

            const activeData = active.data.current;
            const overData = over.data.current;

            if (activeData?.type === "TASK" && overData?.type === "KANBAN_COLUMN") {
                const taskId = activeData.taskId;
                const task = activeData.task;
                const newStatus = overData.title;

                if (
                    task.status === newStatus ||
                    (newStatus === "active" && task.status === "open")
                ) {
                    return;
                }

                const statusMap: { [key: string]: string } = {
                    overdue: "overdue",
                    open: "open",
                    in_progress: "in_progress",
                    on_hold: "on_hold",
                    completed: "completed",
                };

                setDroppedTasks((prev) => ({
                    ...prev,
                    [taskId]: statusMap[newStatus] || newStatus,
                }));

                dispatch(
                    editProjectTask({
                        baseUrl,
                        token,
                        id: taskId,
                        data: { status: statusMap[newStatus] || newStatus },
                    })
                )
                    .unwrap()
                    .then(() => {
                        toast.success("Task status updated");
                        onDependenciesChange?.();
                    })
                    .catch((error) => {
                        toast.error(error?.message || "Failed to update status");
                        setDroppedTasks((prev) => {
                            const newState = { ...prev };
                            delete newState[taskId];
                            return newState;
                        });
                    });
            }
        },
        [dispatch, baseUrl, token, onDependenciesChange]
    );

    const toggleArrowLink = useCallback((sourceId: string, targetId: string) => {
        setArrowLinks((prevLinks) => {
            const sourceNum = parseInt(sourceId.replace("task-", ""));
            const targetIds = Array.from(
                new Set([
                    ...prevLinks
                        .filter((link) => link.sourceId === sourceId)
                        .map((link) => parseInt(link.targetId.replace("task-", ""))),
                ])
            );

            if (targetIds.includes(parseInt(targetId.replace("task-", "")))) {
                return prevLinks.filter(
                    (link) => !(link.sourceId === sourceId && link.targetId === targetId)
                );
            } else {
                const newLinks = [
                    parseInt(targetId.replace("task-", "")),
                    ...targetIds,
                ]
                    .filter(
                        (targetNum) =>
                            !prevLinks.some(
                                (link) =>
                                    link.sourceId === sourceId &&
                                    link.targetId === `task-${targetNum}`
                            )
                    )
                    .map((targetNum) => ({ sourceId, targetId: `task-${targetNum}` }));
                return [...prevLinks, ...newLinks];
            }
        });
    }, []);

    const buildDependencyArrows = () => {
        const arrows: any[] = [];

        taskData.forEach((task) => {
            if (task.id) {
                const taskIdNum = parseInt(task.id.toString());

                // Handle predecessor tasks
                if (Array.isArray(task.predecessor_task_ids)) {
                    task.predecessor_task_ids.forEach((predId) => {
                        if (predId) {
                            arrows.push({
                                sourceId: `task-${predId}`,
                                targetId: `task-${taskIdNum}`,
                                type: "predecessor",
                            });
                        }
                    });
                }

                // Handle successor tasks
                if (Array.isArray(task.successor_task_ids)) {
                    task.successor_task_ids.forEach((succId) => {
                        if (succId) {
                            arrows.push({
                                sourceId: `task-${taskIdNum}`,
                                targetId: `task-${succId}`,
                                type: "successor",
                            });
                        }
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
            (dep) =>
                !arrowLinks.some(
                    (link) =>
                        link.sourceId === dep.sourceId && link.targetId === dep.targetId
                )
        ),
    ];

    // if (!taskData || taskData.length === 0) {
    //     return (
    //         <div className="text-center py-12 text-gray-500">
    //             <p className="text-sm">No dependent tasks found</p>
    //         </div>
    //     );
    // }

    return (
        <DndContext
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto pb-4 relative min-h-[400px]">
                {cardsTitle.map((card) => {
                    const filteredTasks = (taskData || []).filter((task) => {
                        const droppedStatus = droppedTasks[task.id || ""];
                        const taskStatus = droppedStatus || task.status;

                        const normalizedCardStatus =
                            card.title.toLowerCase().replace(/\s+/g, "_");
                        const normalizedTaskStatus = (taskStatus || "open")
                            .toLowerCase()
                            .replace(/\s+/g, "_");

                        return normalizedTaskStatus === normalizedCardStatus;
                    });

                    return (
                        <KanbanBoard
                            key={card.id}
                            add={card.add}
                            color={card.color}
                            count={filteredTasks.length}
                            title={card.title}
                        >
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((task) => (
                                    <DependencyTaskCard
                                        key={task.id}
                                        task={task}
                                        isDragging={draggedTaskId === task.id?.toString()}
                                    />
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-32 text-gray-400">
                                    <p className="text-xs">No tasks</p>
                                </div>
                            )}
                        </KanbanBoard>
                    );
                })}

                {allArrows.map((link, index) => {
                    const isDependencyArrow = dependencyArrows.some(
                        (dep) =>
                            dep.sourceId === link.sourceId &&
                            dep.targetId === link.targetId
                    );

                    let dashness: any = false;
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
                            color = "#DA2400";
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
                        />
                    );
                })}
            </div>
        </DndContext>
    );
};

// Simple task card component for dependency kanban
const DependencyTaskCard = ({ task, isDragging }: { task: DependencyTask; isDragging: boolean }) => {
    const statusColors: { [key: string]: string } = {
        overdue: "bg-red-100 border-red-300",
        open: "bg-orange-100 border-orange-300",
        in_progress: "bg-blue-100 border-blue-300",
        on_hold: "bg-green-100 border-green-300",
        completed: "bg-green-200 border-green-400",
    };

    const taskStatus = (task.status || "open").toLowerCase().replace(/\s+/g, "_");
    const cardClass = statusColors[taskStatus] || "bg-gray-100 border-gray-300";

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `task-${task.id}`,
        data: {
            type: "TASK",
            taskId: task.id,
            task: task,
        },
    });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: isDragging ? "grabbing" : "grab",
                transform: CSS.Translate.toString(transform),
            }}
            id={`task-${task.id}`}
            className={`${cardClass} border rounded-lg p-3 mb-2 cursor-move hover:shadow-md transition-shadow`}
            data-task-id={task.id}
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium text-gray-800 flex-1 line-clamp-2">
                        {task.title}
                    </h4>
                </div>

                {task.responsible_person_name && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">
                            {task.responsible_person_name}
                        </span>
                    </div>
                )}

                {task.priority && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-700">
                            Priority: {task.priority}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DependencyKanban;
