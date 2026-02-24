import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    DndContext,
    DragEndEvent,
    closestCorners,
    DragStartEvent,
    DragOverlay,
} from "@dnd-kit/core";
import { useCallback, useState, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import KanbanBoard from "./KanbanBoard";
import { editProjectTask, fetchKanbanTasksOfProject } from "@/store/slices/projectTasksSlice";
import TaskCard from "./TaskCard";
import SubtaskCard from "./SubtaskCard";
import Xarrow from "react-xarrows";
import { toast } from "sonner";
import { useLocation, useParams } from "react-router-dom";

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

interface VirtualizedColumnProps {
    card: typeof cardsTitle[0];
    filteredTasks: any[];
    cardStatus: string;
    subCardVisibility: Record<number, boolean>;
    droppedSubtasks: Record<number, string>;
    arrowLinks: any[];
    toggleSubCard: (taskId: number) => void;
    handleLink: (sourceId: string, targetIds: string[]) => void;
}

const VirtualizedTaskColumn = ({
    card,
    filteredTasks,
    cardStatus,
    subCardVisibility,
    droppedSubtasks,
    arrowLinks,
    toggleSubCard,
    handleLink,
}: VirtualizedColumnProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const virtualizer = useVirtualizer({
        count: filteredTasks.length,
        getScrollElement: () => containerRef.current,
        estimateSize: () => 180,
        overscan: 5,
    });

    const virtualItems = virtualizer.getVirtualItems();

    return (
        <KanbanBoard
            key={card.id}
            add={card.add}
            color={card.color}
            count={filteredTasks.length}
            title={card.title}
            onDrop={() => {}}
        >
            {filteredTasks.length > 0 ? (
                <div
                    ref={containerRef}
                    style={{
                        height: "500px",
                        overflow: "auto",
                        width: "100%",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                    className="scrollbar-hide"
                >
                    <div
                        style={{
                            height: `${virtualizer.getTotalSize()}px`,
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        {virtualItems.map((virtualItem) => {
                            const task = filteredTasks[virtualItem.index];
                            if (!task) return null;

                            let dependsOnArr = [];
                            const currentTaskKey = `task-${task.id}`;

                            if (Array.isArray(task.predecessor_task)) {
                                dependsOnArr = [...dependsOnArr, ...task.predecessor_task.flat().filter(Boolean)];
                            }
                            if (Array.isArray(task.successor_task)) {
                                dependsOnArr = [...dependsOnArr, ...task.predecessor_task.flat().filter(Boolean)];
                            }

                            dependsOnArr = [...new Set(dependsOnArr.filter((id) => id && id !== task.id))];
                            const formattedDependsOn = dependsOnArr.map((dep) => `task-${dep}`);

                            const allLinked =
                                formattedDependsOn.length > 0 &&
                                formattedDependsOn.every((depId) =>
                                    arrowLinks.some(
                                        (link) =>
                                            (link.sourceId === depId && link.targetId === currentTaskKey) ||
                                            (link.sourceId === currentTaskKey && link.targetId === depId)
                                    )
                                );

                            const visibleSubtasks = (task.sub_tasks_managements || []).filter(
                                (subtask) => {
                                    const overrideStatus = droppedSubtasks[subtask.id];
                                    const effectiveStatus = overrideStatus || subtask.status;
                                    const normalizedCardStatus = cardStatus === "open" ? "open" : cardStatus;
                                    return effectiveStatus === normalizedCardStatus;
                                }
                            );

                            const allSubtasks = task.sub_tasks_managements || [];

                            return (
                                <div
                                    key={task.id}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        transform: `translateY(${virtualItem.start}px)`,
                                    }}
                                >
                                    <div id={`task-${task.id}`} className="relative">
                                        <TaskCard
                                            task={task}
                                            count={allSubtasks.length}
                                            toggleSubCard={() => toggleSubCard(task.id)}
                                            {...(formattedDependsOn.length > 0 && {
                                                handleLink: () => handleLink(currentTaskKey, formattedDependsOn),
                                                iconColor: allLinked ? "#A0A0A0" : "#DA2400",
                                            })}
                                        />
                                        {allSubtasks.length > 0 && subCardVisibility[task.id] && (
                                            <div className="ml-5 mt-1">
                                                {visibleSubtasks.map((subtask) => (
                                                    <div
                                                        key={`subtask-${subtask.id}`}
                                                        id={`subtask-${subtask.id}`}
                                                        draggable
                                                        onDragStart={(e) => {
                                                            console.log(
                                                                "Dragging subtask:",
                                                                subtask.id,
                                                                "from task:",
                                                                task.id
                                                            );
                                                            e.dataTransfer.setData(
                                                                "application/reactflow",
                                                                JSON.stringify({
                                                                    type: "SUBTASK",
                                                                    id: subtask.id,
                                                                    fromTaskId: task.id,
                                                                })
                                                            );
                                                            e.dataTransfer.effectAllowed = "move";
                                                        }}
                                                        className="mb-2 cursor-move relative"
                                                        style={{ pointerEvents: "auto" }}
                                                    >
                                                        <SubtaskCard subtask={subtask} isVisible={true} />
                                                        <div className="text-[8px] font-medium text-gray-500 mb-1 me-2 pt-1 text-end italic">
                                                            Subcard of Task-{task.id}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <svg
                    width="235"
                    height="290"
                    viewBox="0 0 264 290"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g>
                        <rect width="121.359" height="69" rx="2" fill="#F9F9F9" />
                    </g>
                </svg>
            )}
        </KanbanBoard>
    );
};

const TaskManagementKanban = ({ fetchData }) => {
    const { id } = useParams();
    const { data } = useAppSelector((state) => state.fetchKanbanTasksOfProject);
    const taskList = Array.isArray(data)
        ? data
        : [];

    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const [arrowLinks, setArrowLinks] = useState([]);
    const [subCardVisibility, setSubCardVisibility] = useState({});
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [droppedTasks, setDroppedTasks] = useState<{ [key: string]: string }>({});
    const [droppedSubtasks, setDroppedSubtasks] = useState<{ [key: string]: string }>({});

    // Fetch Kanban tasks when component mounts or project_id changes
    useEffect(() => {
        if (token && baseUrl) {
            dispatch(fetchKanbanTasksOfProject({ baseUrl, token, id }));
        }
    }, [dispatch, token, baseUrl, id]);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        const activeData = event.active.data.current;
        if (activeData?.type === "TASK") {
            setDraggedTaskId(activeData.taskId.toString());
        }
    }, []);

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            console.log(active);
            setDraggedTaskId(null);

            if (!over) return;

            const activeData = active.data.current;
            const overData = over.data.current;

            // Check if we're dragging a project over a kanban column
            if (activeData?.type === "TASK" && overData?.type === "KANBAN_COLUMN") {
                const taskId = activeData.taskId;
                const task = activeData.task;
                const newStatus = overData.title;

                // Don't update if dropping in the same column
                if (
                    task.status === newStatus ||
                    (newStatus === "active" && task.status === "open")
                ) {
                    return;
                }

                // Update local state to show visual feedback immediately
                const statusMap: { [key: string]: string } = {
                    overdue: "overdue",
                    open: "active",
                    in_progress: "in_progress",
                    on_hold: "on_hold",
                    completed: "completed",
                };

                const apiStatus = statusMap[newStatus] || newStatus;

                // Store the dropped project with its new status for optimistic update
                setDroppedTasks((prev) => ({
                    ...prev,
                    [taskId]: apiStatus,
                }));

                console.log(taskId);

                // Call API to update project status with optimistic rollback on error
                if (token && baseUrl && taskId) {
                    dispatch(editProjectTask({
                        token,
                        baseUrl,
                        id: taskId.toString(),
                        data: { status: apiStatus },
                    })).then(() => {
                        fetchData();
                    })
                }
            }
        },
        [dispatch, token, baseUrl]
    );

    // Handle native HTML5 drag-and-drop for subtasks (status change on column drop)
    const handleSubtaskStatusDrop = useCallback(
        (dragData, newStatus: string) => {
            if (!dragData || dragData.type !== "SUBTASK") return;

            const subtaskId = dragData.id;
            if (!subtaskId || !token || !baseUrl) return;

            // Map column status to API status for subtasks
            const statusMap: { [key: string]: string } = {
                overdue: "overdue",
                open: "open",
                in_progress: "in_progress",
                on_hold: "on_hold",
                completed: "completed",
            };

            const apiStatus = statusMap[newStatus] || newStatus;

            // Optimistic update for UI
            setDroppedSubtasks((prev) => ({
                ...prev,
                [subtaskId]: apiStatus,
            }));

            dispatch(
                editProjectTask({
                    token,
                    baseUrl,
                    id: subtaskId.toString(),
                    data: { status: apiStatus },
                })
            )
                .unwrap()
                .catch((error) => {
                    // revert optimistic update
                    setDroppedSubtasks((prev) => {
                        const updated = { ...prev };
                        delete updated[subtaskId];
                        return updated;
                    });
                    toast.error(error?.response?.data?.error || "Failed to drop the subtask");
                });
        },
        [baseUrl, token, dispatch]
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
            const sourceTask = taskList.find((t) => t.id === sourceNum);
            const targetTask = taskList.find((t) => t.id === targetNum);

            if (targetTask && Array.isArray(targetTask.predecessor_task_ids)) {
                const flatPredecessors = targetTask.predecessor_task_ids.flat();
                if (flatPredecessors.includes(sourceNum)) {
                    arrows.push({
                        sourceId: `task-${sourceNum}`,
                        targetId: `task-${targetNum}`,
                        type: "predecessor",
                    });
                }
            }

            if (sourceTask && Array.isArray(sourceTask.successor_task_ids)) {
                const flatSuccessors = sourceTask.successor_task_ids.flat();
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

    const toggleSubCard = useCallback((taskId) => {
        setSubCardVisibility((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    }, []);

    return (
        <div className="relative">
            <DndContext
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div
                    className="h-[80%] my-3 flex items-start gap-2 max-w-full overflow-x-auto overflow-y-auto flex-nowrap"
                    style={{
                        height: "75vh",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    {cardsTitle.map((card) => {
                        const cardStatus = card.title.toLowerCase().replace(" ", "_");

                        const filteredTasks = taskList.filter((task) => {
                            const droppedStatus = droppedTasks[task.id];
                            const projectStatus = droppedStatus || task.status;
                            const normalizedCardStatus =
                                cardStatus === "open" ? "open" : cardStatus;

                            const hasSubtaskInColumn = (task.sub_tasks_managements || []).some(
                                (subtask) => {
                                    const overrideStatus = droppedSubtasks[subtask.id];
                                    const effectiveStatus = overrideStatus || subtask.status;
                                    return effectiveStatus === normalizedCardStatus;
                                }
                            );

                            return projectStatus === normalizedCardStatus || hasSubtaskInColumn;
                        });

                        return (
                            <VirtualizedTaskColumn
                                key={card.id}
                                card={card}
                                filteredTasks={filteredTasks}
                                cardStatus={cardStatus}
                                subCardVisibility={subCardVisibility}
                                droppedSubtasks={droppedSubtasks}
                                arrowLinks={arrowLinks}
                                toggleSubCard={toggleSubCard}
                                handleLink={handleLink}
                            />
                        );
                    })}
                </div>
                {allArrows.map((link, index) => {
                    const isDependencyArrow = dependencyArrows.some(
                        (dep) => dep.sourceId === link.sourceId && dep.targetId === link.targetId
                    );

                    let dashness: boolean | { strokeLen: number; nonStrokeLen: number } = false;
                    let strokeWidth = 1.5;
                    let color = "#DA2400";

                    if (isDependencyArrow) {
                        const dependency = dependencyArrows.find(
                            (dep) => dep.sourceId === link.sourceId && dep.targetId === link.targetId
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
                <DragOverlay>
                    {draggedTaskId ? (
                        taskList.find((task) => task.id.toString() === draggedTaskId) ? (
                            <div className="w-60 opacity-100">
                                <TaskCard
                                    task={taskList.find(
                                        (task) => task.id.toString() === draggedTaskId
                                    )}
                                />
                            </div>
                        ) : null
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default TaskManagementKanban;
