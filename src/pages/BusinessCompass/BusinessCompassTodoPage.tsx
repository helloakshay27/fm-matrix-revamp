import { useEffect, useState, useMemo } from "react";
import { Plus, Check, Play, Pause, Pencil, ArrowRightLeft, Focus, Filter, GripVertical, Eye, ChevronDown, ChevronRight, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BCTodoCreateModal from "@/components/BusinessCompass/BCTodoCreateModal";
import BCTodoEditModal from "@/components/BusinessCompass/BCTodoEditModal";
import TodoDetailsModal from "@/components/TodoDetailsModal";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";
import { toast } from "sonner";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";
import { Switch } from "@mui/material";
import { Dialog, DialogContent } from "@mui/material";
import { Card, CardContent } from "@/components/ui/card";
import EisenhowerMatrix from "@/components/EisenhowerMatrix";
import PriorityTodo from "@/components/PriorityTodo";
import { useBusinessCompassTodos } from "@/hooks/useBusinessCompassTodos";
import { DndContext, DragEndEvent, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";

// Business Compass todos use the same P1-P4 Eisenhower priority scheme as VAS todos.
// Business Compass tasks, however, use a separate low/medium/high priority scheme, so
// converting a todo into a task needs this one-way mapping.
const TODO_PRIORITY_TO_TASK_PRIORITY: Record<string, string> = {
    P1: "high",
    P2: "medium",
    P3: "medium",
    P4: "low",
};

// Countdown timer component with real-time updates
const CountdownTimer = ({
    startDate,
    targetDate,
}: {
    startDate?: string;
    targetDate?: string;
}) => {
    const calculateDuration = (
        start: string | undefined,
        end: string | undefined
    ): { text: string; isOverdue: boolean } => {
        if (!end) return { text: "N/A", isOverdue: false };

        const now = new Date();
        const startDateObj = start ? new Date(start) : now;
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);

        if (now < startDateObj) {
            return { text: "Not started", isOverdue: false };
        }

        const diffMs = endDate.getTime() - now.getTime();
        const absDiffMs = Math.abs(diffMs);
        const isOverdue = diffMs <= 0;

        const seconds = Math.floor(absDiffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        const remainingHours = hours % 24;
        const remainingMinutes = minutes % 60;

        const timeStr = `${days > 0 ? days + "d " : "0d "}${remainingHours > 0 ? remainingHours + "h " : "0h "}${remainingMinutes > 0 ? remainingMinutes + "m " : "0m"}`;
        return {
            text: isOverdue ? `${timeStr}` : timeStr,
            isOverdue: isOverdue,
        };
    };

    const [countdown, setCountdown] = useState(
        calculateDuration(startDate, targetDate)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(calculateDuration(startDate, targetDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate, startDate]);

    const textColor = countdown.isOverdue ? "text-red-600" : "text-[#029464]";
    return (
        <div className={`text-left ${textColor} text-[12px]`}>{countdown.text}</div>
    );
};

// Skeleton Loader Component
const TodoSkeleton = () => {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 animate-pulse">
            <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-300 rounded" />
                <div className="w-4 h-4 bg-gray-300 rounded" />
                <div className="w-4 h-4 bg-gray-300 rounded border-2" />
            </div>

            <div className="flex flex-col flex-1 gap-2">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>

            <div className="flex flex-col items-end gap-1 min-w-max">
                <div className="h-3 bg-gray-300 rounded w-20" />
                <div className="h-3 bg-gray-300 rounded w-16" />
            </div>

            <div className="w-4 h-4 bg-gray-300 rounded" />
        </div>
    );
};

// Pause Reason Modal Component
const PauseReasonModal = ({ isOpen, onClose, onSubmit, isLoading, taskId }: any) => {
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setReason("");
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast.error("Please enter a reason for pausing the task");
            return;
        }
        onSubmit(reason, taskId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-[32rem] max-w-[calc(100vw-2rem)] border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-[#C72030] rounded-sm"></div>
                    <h2 className="text-lg font-bold text-gray-900">Pause Task</h2>
                </div>

                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Please provide a reason for pausing this task. This will help track the pause history.
                </p>

                <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Reason</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason for pausing this task..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#C72030] focus:ring-2 focus:ring-[#C72030] focus:ring-opacity-20 resize-none text-sm bg-white"
                        rows={4}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-5 py-2.5 bg-[#C72030] text-white font-medium rounded-md hover:bg-[#b01c26] disabled:opacity-50 transition-colors text-sm"
                    >
                        {isLoading ? "Processing..." : "Pause Task"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Toggle Todo Confirmation Modal Component
const ToggleTodoConfirmModal = ({ isOpen, onClose, onConfirm, isLoading, todo }: any) => {
    if (!isOpen || !todo) return null;

    const isCompleting = todo?.status === "open";
    const title = isCompleting ? "Complete Todo" : "Reopen Todo";
    const message = isCompleting
        ? `Are you sure you want to mark "${todo?.title}" as completed?`
        : `Are you sure you want to reopen "${todo?.title}"?`;
    const buttonText = isCompleting ? "Complete" : "Reopen";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-[32rem] max-w-[calc(100vw-2rem)] border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                </div>

                <p className="text-sm text-gray-600 mb-6 leading-relaxed">{message}</p>

                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? "Processing..." : buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const priorityBgColorMap: Record<string, string> = {
    P1: "border-l-4 border-l-red-500",
    P2: "border-l-4 border-l-green-500",
    P3: "border-l-4 border-l-yellow-500",
    P4: "border-l-4 border-l-gray-400",
};

const priorityTagColorMap: Record<string, string> = {
    P1: "bg-red-100 text-red-700",
    P2: "bg-green-100 text-green-700",
    P3: "bg-yellow-100 text-yellow-700",
    P4: "bg-gray-200 text-gray-700",
};

// ----------------------------------------------
// Pending Tasks Card (with droppable zone)
// ----------------------------------------------
const PendingTasksCard = ({
    pendingTodos,
    todayTodos,
    upcomingTodos,
    overdueTodos,
    noDateTodos,
    isLoading,
    hasMore,
    isLoadingMore,
    fetchMore,
    toggleTodo,
    handlePlayTask,
    setPauseTaskId,
    setIsPauseModalOpen,
    handleEditTodo,
    handleConvertTodo,
    handleFlagTodo,
    handleViewTodo,
}: any) => {
    const { setNodeRef, isOver } = useDroppable({ id: "pending-section" });

    return (
        <Card ref={setNodeRef} className={`shadow-sm border border-border transition-colors ${isOver ? "bg-blue-50" : ""}`}>
            <div className="flex items-center gap-3 p-4 bg-[#F6F4EE] border border-[#D9D9D9]">
                <div className="font-semibold w-8 h-8 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                    {pendingTodos.length.toString().padStart(2, "0")}
                </div>
                <h3 className="text-sm font-semibold uppercase text-[#1A1A1A]">TO DO</h3>
            </div>
            <CardContent className="py-4 !px-3">
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <TodoSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <>
                        {todayTodos.length > 0 && (
                            <div>
                                <h3 className="text-primary font-semibold mb-2">Today</h3>
                                {todayTodos.map((todo: any) => (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        toggleTodo={toggleTodo}
                                        handlePlayTask={handlePlayTask}
                                        setPauseTaskId={setPauseTaskId}
                                        setIsPauseModalOpen={setIsPauseModalOpen}
                                        handleEditTodo={handleEditTodo}
                                        handleConvertTodo={handleConvertTodo}
                                        handleFlagTodo={handleFlagTodo}
                                        handleViewTodo={handleViewTodo}
                                    />
                                ))}
                            </div>
                        )}

                        {upcomingTodos.length > 0 && (
                            <div>
                                <h3 className="text-blue-600 font-semibold mb-2">Upcoming</h3>
                                {upcomingTodos.map((todo: any) => (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        toggleTodo={toggleTodo}
                                        handlePlayTask={handlePlayTask}
                                        setPauseTaskId={setPauseTaskId}
                                        setIsPauseModalOpen={setIsPauseModalOpen}
                                        handleEditTodo={handleEditTodo}
                                        handleConvertTodo={handleConvertTodo}
                                        handleFlagTodo={handleFlagTodo}
                                        handleViewTodo={handleViewTodo}
                                    />
                                ))}
                            </div>
                        )}

                        {overdueTodos.length > 0 && (
                            <div>
                                <h3 className="text-red-600 font-semibold mb-2">Overdue</h3>
                                {overdueTodos.map((todo: any) => (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        toggleTodo={toggleTodo}
                                        handlePlayTask={handlePlayTask}
                                        setPauseTaskId={setPauseTaskId}
                                        setIsPauseModalOpen={setIsPauseModalOpen}
                                        handleEditTodo={handleEditTodo}
                                        handleConvertTodo={handleConvertTodo}
                                        handleFlagTodo={handleFlagTodo}
                                        handleViewTodo={handleViewTodo}
                                    />
                                ))}
                            </div>
                        )}

                        {noDateTodos.length > 0 && (
                            <div>
                                <h3 className="text-gray-500 font-semibold mb-2">No Target Date</h3>
                                {noDateTodos.map((todo: any) => (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        toggleTodo={toggleTodo}
                                        handlePlayTask={handlePlayTask}
                                        setPauseTaskId={setPauseTaskId}
                                        setIsPauseModalOpen={setIsPauseModalOpen}
                                        handleEditTodo={handleEditTodo}
                                        handleConvertTodo={handleConvertTodo}
                                        handleFlagTodo={handleFlagTodo}
                                        handleViewTodo={handleViewTodo}
                                    />
                                ))}
                            </div>
                        )}

                        {!isLoading && pendingTodos.length === 0 && (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-muted-foreground text-center">
                                    No pending tasks! You're all caught up.
                                </p>
                            </div>
                        )}

                        {hasMore && (
                            <div className="flex justify-center mt-4">
                                <Button
                                    onClick={fetchMore}
                                    disabled={isLoadingMore}
                                    className="text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                                >
                                    {isLoadingMore ? "Loading..." : "Load More"}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

// ----------------------------------------------
// Completed Tasks Card (with droppable zone)
// ----------------------------------------------
const CompletedTasksCard = ({
    completedTodos,
    sortedCompletedDates,
    groupedCompletedTodos,
    getCompletionDateLabel,
    isLoading,
    toggleTodo,
    handleViewTodo,
}: any) => {
    const { setNodeRef, isOver } = useDroppable({ id: "completed-section" });

    return (
        <Card ref={setNodeRef} className={`shadow-sm border border-border transition-colors ${isOver ? "bg-green-50" : ""}`}>
            <div className="flex items-center gap-3 p-4 bg-[#F6F4EE] border border-[#D9D9D9]">
                <div className="font-semibold w-8 h-8 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                    {completedTodos.length.toString().padStart(2, "0")}
                </div>
                <h3 className="text-sm font-semibold uppercase text-[#1A1A1A]">Completed</h3>
            </div>
            <CardContent className="py-4 !px-3">
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <TodoSkeleton key={i} />
                        ))}
                    </div>
                ) : completedTodos.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-center">
                            Complete tasks to see them here.
                        </p>
                    </div>
                ) : (
                    sortedCompletedDates.map((date: string, idx: number) => (
                        <div key={date} className="space-y-2">
                            <h3 className={`font-semibold text-muted-foreground mb-2 mt-3 ${idx === 0 ? "first:mt-0" : ""}`}>
                                {getCompletionDateLabel(date)}
                            </h3>
                            {groupedCompletedTodos[date].map((todo: any) => (
                                <CompletedTodoItem
                                    key={todo.id}
                                    todo={todo}
                                    toggleTodo={toggleTodo}
                                    handleViewTodo={handleViewTodo}
                                />
                            ))}
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

const TodoItem = ({
    todo,
    toggleTodo,
    handlePlayTask,
    setPauseTaskId,
    setIsPauseModalOpen,
    handleEditTodo,
    handleConvertTodo,
    handleFlagTodo,
    handleViewTodo,
}: any) => {
    const navigate = useNavigate();

    // Make this todo item draggable
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `todo-${todo.id}`,
        data: { todoId: todo.id, priority: todo.priority, status: todo.status },
    });

    const linkedTask = todo.task_management;

    const handleTaskClick = () => {
        if (linkedTask?.id) {
            navigate(`/business-compass/tasks/${linkedTask.id}`);
        }
    };

    // Check if task is started from the nested task_management object
    const isTaskStarted = linkedTask?.is_started || false;
    const isCompleted = todo.status === "completed";
    const priority = todo.priority || "";

    const getPriorityLabel = () => {
        const priorityMap: Record<string, string> = { P1: "Q1", P2: "Q2", P3: "Q3", P4: "Q4" };
        return priorityMap[todo.priority] || todo.priority || "";
    };

    return (
        <div
            ref={setNodeRef}
            className={`relative flex flex-col gap-2 p-3 pb-7 pt-5 sm:flex-row sm:items-center sm:gap-3 sm:pb-5 rounded-lg transition-colors group mb-2 border ${priorityBgColorMap[priority] || "border-l-4 border-l-gray-300"} ${isDragging ? "opacity-50 ring-2 ring-blue-400" : ""}`}
        >
            {todo.created_by && (
                <div className="absolute top-0 right-3">
                    <span className="text-xs text-end text-muted-foreground">
                        Assigned By : {todo.created_by}
                    </span>
                </div>
            )}
            <div className="flex w-full items-center gap-0.5 sm:w-auto">
                <button
                    {...listeners}
                    {...attributes}
                    className="flex-shrink-0 p-1 text-gray-600 hover:text-primary transition-colors cursor-grab active:cursor-grabbing"
                    title="Drag todo"
                >
                    <GripVertical size={14} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditTodo(todo);
                    }}
                    className="flex-shrink-0 p-1 text-gray-600 hover:text-primary transition-colors"
                    title="Edit todo"
                >
                    <Pencil size={14} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (linkedTask?.id) {
                            handleTaskClick();
                        } else {
                            handleViewTodo(todo);
                        }
                    }}
                    className="flex-shrink-0 p-1 text-gray-600 hover:text-primary transition-colors"
                    title="View todo"
                >
                    <Eye size={14} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleConvertTodo(todo);
                    }}
                    className="flex-shrink-0 p-1 text-gray-600 hover:text-primary transition-colors disabled:opacity-50"
                    title="Convert to Task"
                    disabled={!!linkedTask?.id}
                >
                    <ArrowRightLeft size={14} />
                </button>

                {/* Focus button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleFlagTodo(todo);
                    }}
                    disabled={isCompleted}
                    className="p-1 hover:bg-gray-200 rounded transition disabled:opacity-50"
                    title={todo.is_flagged ? "Remove from focus" : "Add to focus"}
                >
                    <Focus size={14} color={todo.is_flagged ? "#fa0202" : "#4b5563"} />
                </button>
            </div>

            <div className="flex w-full flex-col min-w-0 sm:flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground cursor-pointer break-words leading-snug">
                        {linkedTask?.id && (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleTaskClick();
                                }}
                                className="text-sm font-semibold text-[#c72030] cursor-pointer hover:underline"
                            >
                                T-{linkedTask.id}
                            </span>
                        )} {todo.title}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5">
                        <span className="text-xs text-muted-foreground">{todo.user}</span>
                        {todo.target_date && (
                            <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                    Due: {todo.target_date}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:flex-col sm:items-end sm:gap-2 sm:pb-2">
                {/* Time Left and Active Timer for linked tasks only */}
                {linkedTask?.id && (
                    <div className="flex min-w-0 flex-col items-start text-[12px] sm:items-end">
                        <div className="flex flex-wrap gap-1.5 items-end justify-start sm:justify-end">
                            <span className="text-xs text-gray-600 font-medium">Time Left:</span>
                            <CountdownTimer
                                startDate={linkedTask?.start_date}
                                targetDate={todo.target_date}
                            />
                        </div>
                    </div>
                )}

                <div className="ml-auto flex items-center justify-end gap-3">
                    {/* Play/Pause buttons for todos converted to a task */}
                    {linkedTask?.id &&
                        (isTaskStarted ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPauseTaskId(linkedTask.id);
                                    setIsPauseModalOpen(true);
                                }}
                                disabled={isCompleted}
                                className="p-1 hover:bg-gray-200 rounded transition disabled:opacity-50"
                                title="Pause task"
                            >
                                <Pause size={16} className="text-orange-500" />
                            </button>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlayTask(linkedTask.id);
                                }}
                                disabled={isCompleted}
                                className="p-1 hover:bg-gray-200 rounded transition disabled:opacity-50"
                                title="Play task"
                            >
                                <Play size={16} className="text-green-500" />
                            </button>
                        ))}

                    <div className="flex flex-col items-end gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleTodo(todo);
                            }}
                            className="flex-shrink-0 !w-4 !h-4 !min-h-0 !p-0 aspect-square self-center overflow-hidden rounded-[3px] border-2 border-primary flex items-center justify-center leading-none"
                        >
                            <Check
                                size={16}
                                className="text-primary opacity-0 group-hover:opacity-100"
                            />
                        </button>
                    </div>
                </div>

                {linkedTask?.id && isTaskStarted && (
                    <div className="min-w-0">
                        <div className="flex flex-wrap gap-2 items-end">
                            <span className="text-xs text-gray-600 font-medium">Started:</span>
                            <ActiveTimer
                                activeTimeTillNow={linkedTask?.active_time_till_now}
                                isStarted={isTaskStarted}
                            />
                        </div>
                    </div>
                )}
                <div className={`px-1 py-0.5 text-[10px] font-semibold absolute bottom-1 right-3 ${priorityTagColorMap[priority] || "bg-gray-100 text-gray-700"}`}>
                    {getPriorityLabel()}
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------
// Completed Todo Item Component
// ----------------------------------------------
const CompletedTodoItem = ({ todo, toggleTodo, handleViewTodo }: any) => {
    const navigate = useNavigate();
    const priority = todo.priority || "";
    const linkedTask = todo.task_management;

    const getPriorityLabel = () => {
        const priorityMap: Record<string, string> = { P1: "Q1", P2: "Q2", P3: "Q3", P4: "Q4" };
        return priorityMap[todo.priority] || todo.priority || "";
    };

    const handleTaskClick = () => {
        if (linkedTask?.id) {
            navigate(`/business-compass/tasks/${linkedTask.id}`);
        }
    };

    const isTaskStarted = linkedTask?.is_started || false;

    return (
        <div className={`relative flex flex-col gap-2 p-3 pb-7 pt-5 sm:flex-row sm:items-center sm:gap-3 sm:pb-5 rounded-lg border transition-colors group mb-2 ${priorityBgColorMap[priority] || "border-l-4 border-l-gray-300"}`}>
            {todo.created_by && (
                <div className="absolute top-0 right-3">
                    <span className="text-xs text-end text-muted-foreground">
                        Assigned By : {todo.created_by}
                    </span>
                </div>
            )}
            <div className="flex w-full items-center gap-0.5 sm:hidden">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (linkedTask?.id) {
                            handleTaskClick();
                        } else {
                            handleViewTodo(todo);
                        }
                    }}
                    className="flex-shrink-0 p-1 text-gray-600 hover:text-primary transition-colors"
                    title="View todo"
                >
                    <Eye size={14} />
                </button>
            </div>
            <div className="flex w-full flex-col min-w-0 sm:flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground cursor-pointer break-words leading-snug">
                        {linkedTask?.id && (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleTaskClick();
                                }}
                                className="text-sm font-semibold text-[#c72030] cursor-pointer hover:underline"
                            >
                                T-{linkedTask.id}
                            </span>
                        )} {todo.title}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (linkedTask?.id) {
                                handleTaskClick();
                            } else {
                                handleViewTodo(todo);
                            }
                        }}
                        className="hidden sm:inline-flex flex-shrink-0 p-1 text-gray-600 hover:text-primary transition-colors"
                        title="View todo"
                    >
                        <Eye size={14} />
                    </button>
                </div>
                <div className="flex items-center justify-between gap-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5">
                        <span className="text-xs text-muted-foreground">{todo.user}</span>
                        {todo.target_date && (
                            <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                    Due: {todo.target_date}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:flex-col sm:items-end sm:gap-2 sm:pb-2">
                {linkedTask?.id && (
                    <div className="flex min-w-0 flex-col items-start text-[12px] sm:items-end">
                        <div className="flex flex-wrap gap-1.5 items-end justify-start sm:justify-end">
                            <span className="text-xs text-gray-600 font-medium">Time Left:</span>
                            <CountdownTimer
                                startDate={linkedTask?.start_date}
                                targetDate={todo.target_date}
                            />
                        </div>
                    </div>
                )}

                <div className="ml-auto flex items-center justify-end gap-3">
                    <button
                        onClick={() => toggleTodo(todo)}
                        className="flex-shrink-0 !w-4 !h-4 !min-h-0 !p-0 overflow-hidden !bg-[#c72030] !text-white flex items-center justify-center leading-none hover:opacity-90 transition-all"
                    >
                        <Check size={15} color="white" />
                    </button>
                </div>

                {linkedTask?.id && isTaskStarted && (
                    <div className="min-w-0">
                        <div className="flex flex-wrap gap-2 items-end">
                            <span className="text-xs text-gray-600 font-medium">Started:</span>
                            <ActiveTimer
                                activeTimeTillNow={linkedTask?.active_time_till_now}
                                isStarted={isTaskStarted}
                            />
                        </div>
                    </div>
                )}
                <div className={`px-1 py-0.5 text-[10px] font-semibold absolute bottom-1 right-3 ${priorityTagColorMap[priority] || "bg-gray-100 text-gray-700"}`}>
                    {getPriorityLabel()}
                </div>
            </div>
        </div>
    );
};

const BusinessCompassTodoPage = () => {
    const { setCurrentSection } = useLayout();

    useEffect(() => {
        setCurrentSection("Business Compass");
    }, [setCurrentSection]);

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const currentUserId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

    const [taskType, setTaskType] = useState<"all" | "my">("my");
    const [selectedQuadrant, setSelectedQuadrant] = useState<string | null>("P1");
    const [currentPage, setCurrentPage] = useState(1);
    const [accumulatedTodos, setAccumulatedTodos] = useState<any[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);
    const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
    const [pauseTaskId, setPauseTaskId] = useState<number | null>(null);
    const [isPauseLoading, setIsPauseLoading] = useState(false);
    const [editingTodo, setEditingTodo] = useState<any>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isToggleConfirmOpen, setIsToggleConfirmOpen] = useState(false);
    const [todoToToggle, setTodoToToggle] = useState<any>(null);
    const [toggleLoading, setToggleLoading] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
    const [dates, setDates] = useState({ startDate: "", endDate: "" });
    const [dropdowns, setDropdowns] = useState({ priority: false, startDate: false, endDate: false });
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<any>(null);

    const buildFilters = () => {
        const filters: Record<string, string> = {};
        if (taskType === "my" && currentUserId) {
            filters["q[user_id_eq]"] = String(currentUserId);
        }
        if (selectedPriorities.length > 0) {
            selectedPriorities.forEach((p, i) => {
                filters[`q[priority_in][${i}]`] = p;
            });
        }
        if (dates.startDate) {
            filters["q[target_date_gteq]"] = dates.startDate;
        }
        if (dates.endDate) {
            filters["q[target_date_lteq]"] = dates.endDate;
        }
        return filters;
    };

    const {
        data: todosData,
        isLoading,
        refetch,
    } = useBusinessCompassTodos({
        page: currentPage,
        filters: buildFilters(),
    });

    const pagination = todosData?.meta || todosData?.pagination || {};
    const hasMore = currentPage < (pagination?.total_pages || 1);

    // Accumulate pages locally to emulate infinite scroll (the BC todos hook is
    // a plain paginated query, not an infinite query like the VAS useTodos hook).
    useEffect(() => {
        const page = todosData?.todos || [];
        if (currentPage === 1) {
            setAccumulatedTodos(page);
        } else {
            setAccumulatedTodos((prev) => {
                const existingIds = new Set(prev.map((t: any) => t.id));
                const newOnes = page.filter((t: any) => !existingIds.has(t.id));
                return [...prev, ...newOnes];
            });
        }
        setIsLoadingMore(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [todosData]);

    // Reset accumulation when scope/filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [taskType, selectedPriorities, dates.startDate, dates.endDate]);

    const todosById = useMemo(() => {
        const map: Record<string, any> = {};
        accumulatedTodos.forEach((t: any) => {
            map[String(t.id)] = t;
        });
        return map;
    }, [accumulatedTodos]);

    const fetchMore = () => {
        if (!hasMore || isLoadingMore) return;
        setIsLoadingMore(true);
        setCurrentPage((p) => p + 1);
    };

    // Dashboard counts for the Eisenhower Matrix, computed client-side from
    // whatever's been loaded so far (no server-side aggregate for BC todos).
    const dashboardData = useMemo(() => {
        const counts = { p1_count: 0, p2_count: 0, p3_count: 0, p4_count: 0 };
        accumulatedTodos.forEach((t: any) => {
            if (t.priority === "P1") counts.p1_count++;
            else if (t.priority === "P2") counts.p2_count++;
            else if (t.priority === "P3") counts.p3_count++;
            else if (t.priority === "P4") counts.p4_count++;
        });
        return counts;
    }, [accumulatedTodos]);

    const toggleDropdown = (key: keyof typeof dropdowns) => {
        setDropdowns((prev) => {
            const isAlreadyOpen = prev[key];
            if (isAlreadyOpen) return { ...prev, [key]: false };
            return { priority: false, startDate: false, endDate: false, [key]: true };
        });
    };

    const togglePriority = (value: string) => {
        setSelectedPriorities((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    const handleClearFilters = () => {
        setSelectedPriorities([]);
        setDates({ startDate: "", endDate: "" });
    };

    const handleApplyFilters = () => {
        setIsFilterModalOpen(false);
        refetch();
    };

    const toggleTodo = (todo: any) => {
        const original = todosById[String(todo.id)] || todo;
        setTodoToToggle(original);
        setIsToggleConfirmOpen(true);
    };

    const handleConfirmToggle = async () => {
        if (!todoToToggle) return;

        setToggleLoading(true);
        try {
            const isCompleting = todoToToggle?.status === "open";
            await axios.put(
                `https://${baseUrl}/business_compass/todos/${todoToToggle.id}`,
                { todo: { status: isCompleting ? "completed" : "open" } },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(isCompleting ? "Task completed successfully" : "Task reopened successfully");
            setIsToggleConfirmOpen(false);
            setTodoToToggle(null);
            refetch();
        } catch (error) {
            console.log(error);
            toast.error("Failed to update task");
        } finally {
            setToggleLoading(false);
        }
    };

    const handlePlayTask = async (taskId: number) => {
        try {
            await axios.put(
                `https://${baseUrl}/business_compass/tasks/${taskId}/update_status.json`,
                { status: "started" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Task started successfully");
            refetch();
        } catch (error) {
            console.error("Failed to start task:", error);
            toast.error("Failed to start task");
        }
    };

    const handlePauseTaskSubmit = async (reason: string, taskId: number) => {
        if (!taskId) return;

        setIsPauseLoading(true);
        try {
            await axios.put(
                `https://${baseUrl}/business_compass/tasks/${taskId}/update_status.json`,
                { status: "stopped" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const commentPayload = {
                comment: {
                    body: `Paused with reason: ${reason}`,
                    commentable_id: taskId,
                    commentable_type: "Task",
                    commentor_id: JSON.parse(localStorage.getItem("user") || "{}")?.id,
                    active: true,
                },
            };

            await axios.post(`https://${baseUrl}/comments.json`, commentPayload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Task paused successfully with reason");
            setIsPauseModalOpen(false);
            setPauseTaskId(null);
            refetch();
        } catch (error) {
            console.error("Failed to pause task:", error);
            toast.error("Failed to pause task");
        } finally {
            setIsPauseLoading(false);
        }
    };

    const handleEditTodo = (todo: any) => {
        const original = todosById[String(todo.id)] || todo;
        setEditingTodo(original);
        setIsEditMode(true);
        setIsAddTodoModalOpen(true);
    };

    const handleViewTodo = (todo: any) => {
        const original = todosById[String(todo.id)] || todo;
        setSelectedTodo(original);
        setIsDetailsModalOpen(true);
    };

    const handleFlagTodo = async (todo: any) => {
        const original = todosById[String(todo.id)] || todo;
        try {
            const newFlaggedStatus = !original.is_flagged;
            const payload = {
                todo: {
                    is_flagged: newFlaggedStatus,
                    flagged_at: newFlaggedStatus ? new Date().toISOString() : null,
                },
            };

            await axios.put(
                `https://${baseUrl}/business_compass/todos/${original.id}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(
                newFlaggedStatus ? "Todo flagged for focus" : "Todo unflagged from focus"
            );
            refetch();
        } catch (error) {
            console.error("Failed to flag todo:", error);
            toast.error("Failed to update focus status");
        }
    };

    // Convert a todo directly into a Business Compass task (single click, since
    // there is no BC equivalent of the VAS Project/Milestone/Subtask/Opportunity
    // conversion picker).
    const handleConvertTodo = async (todo: any) => {
        const original = todosById[String(todo.id)] || todo;
        if (original.task_management?.id) return;

        try {
            const payload = {
                task: {
                    title: original.title,
                    description: original.description || "",
                    responsible_person_id: original.responsible_person_id || currentUserId,
                    start_date: new Date().toISOString().split("T")[0],
                    due_date: original.target_date,
                    priority: TODO_PRIORITY_TO_TASK_PRIORITY[original.priority] || "medium",
                    status: "open",
                },
            };

            const response = await axios.post(
                `https://${baseUrl}/business_compass/tasks`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newTaskId = response?.data?.task?.id || response?.data?.id;

            if (newTaskId) {
                await axios.put(
                    `https://${baseUrl}/business_compass/todos/${original.id}`,
                    { todo: { task_management_id: newTaskId } },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            toast.success("Task created successfully from todo!");
            refetch();
        } catch (error) {
            console.error("Failed to convert todo to task:", error);
            toast.error("Failed to convert todo to task");
        }
    };

    const handleCloseModal = () => {
        setIsAddTodoModalOpen(false);
        setEditingTodo(null);
        setIsEditMode(false);
        refetch();
    };

    // Apply active priority filters (client side, in addition to the server filter)
    const filteredTodosByFilters = accumulatedTodos;

    const pendingTodos = filteredTodosByFilters.filter((t: any) => t.status !== "completed");
    const completedTodos = filteredTodosByFilters.filter((t: any) => t.status === "completed");

    const groupedCompletedTodos = completedTodos.reduce((groups: Record<string, any[]>, todo: any) => {
        const date = todo.updated_at ? todo.updated_at.split("T")[0] : "No Date";
        if (!groups[date]) groups[date] = [];
        groups[date].push(todo);
        return groups;
    }, {} as Record<string, any[]>);

    const sortedCompletedDates = Object.keys(groupedCompletedTodos).sort((a, b) => {
        if (a === "No Date") return 1;
        if (b === "No Date") return -1;
        return new Date(b).getTime() - new Date(a).getTime();
    });

    const getCompletionDateLabel = (dateStr: string) => {
        if (dateStr === "No Date") return "No Completion Date";

        const todayStr = new Date().toISOString().split("T")[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (dateStr === todayStr) return "Today";
        if (dateStr === yesterdayStr) return "Yesterday";

        return new Date(dateStr).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const today = new Date().toISOString().split("T")[0];
    const overdueTodos = pendingTodos.filter((t: any) => t.target_date && t.target_date < today);
    const todayTodos = pendingTodos.filter((t: any) => t.target_date === today);
    const upcomingTodos = pendingTodos.filter((t: any) => t.target_date && t.target_date > today);
    const noDateTodos = pendingTodos.filter((t: any) => !t.target_date);

    // Handle drag and drop
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const todoId = active.data.current?.todoId;
        const currentStatus = active.data.current?.status;
        const original = todosById[String(todoId)];
        if (!original) return;

        try {
            if (over.id === "pending-section" && currentStatus === "completed") {
                await axios.put(
                    `https://${baseUrl}/business_compass/todos/${todoId}`,
                    { todo: { status: "open" } },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Todo moved to open");
                refetch();
            } else if (over.id === "completed-section" && currentStatus !== "completed") {
                await axios.put(
                    `https://${baseUrl}/business_compass/todos/${todoId}`,
                    { todo: { status: "completed" } },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Todo marked as completed");
                refetch();
            }

            // Handle priority change (drag to Eisenhower quadrant)
            if (over.id?.toString().startsWith("priority-")) {
                const newPriority = over.id.toString().replace("priority-", "");
                const currentPriority = original.priority || "";

                if (newPriority && newPriority !== currentPriority) {
                    await axios.put(
                        `https://${baseUrl}/business_compass/todos/${todoId}`,
                        { todo: { priority: newPriority } },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    toast.success(`Priority changed to ${newPriority}`);
                    refetch();
                }
            }
        } catch (error) {
            console.error("Drag and drop error:", error);
            toast.error("Failed to update todo");
        }
    };

    // State for drag overlay
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const activeTodo = activeDragId
        ? accumulatedTodos.find((t: any) => `todo-${t.id}` === activeDragId)
        : null;

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={(event) => setActiveDragId(event.active.id.toString())}
            onDragCancel={() => setActiveDragId(null)}
        >
            <div className="p-3 sm:p-6 max-w-full overflow-x-hidden">
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3 sm:gap-6 flex-wrap">
                        <div className="flex items-end gap-4 flex-shrink-0">
                            <Button onClick={() => setIsAddTodoModalOpen(true)}>
                                <Plus size={18} />
                                Add
                            </Button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center px-4 py-2">
                                <span className="text-gray-700 font-medium text-sm">My Todos</span>
                                <Switch
                                    checked={taskType === "all"}
                                    onChange={() => {
                                        setTaskType(taskType === "all" ? "my" : "all");
                                    }}
                                    sx={{
                                        "& .MuiSwitch-switchBase.Mui-checked": { color: "#C72030" },
                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                            backgroundColor: "#C72030",
                                        },
                                    }}
                                />
                                <span className="text-gray-700 font-medium text-sm">All Todos</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 flex items-center gap-2"
                                title="Filter"
                                onClick={() => setIsFilterModalOpen(true)}
                            >
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch gap-2 w-full md:h-[19.5rem] !mt-1">
                        {/* Eisenhower Matrix */}
                        <div className="w-full md:w-1/2 h-[19.5rem] md:h-full">
                            <EisenhowerMatrix
                                dashboardData={dashboardData}
                                onQuadrantClick={setSelectedQuadrant}
                                selectedPriority={selectedQuadrant}
                            />
                        </div>
                        <div className="w-full md:w-1/2 h-[22rem] md:h-full">
                            <PriorityTodo
                                selectedPriority={selectedQuadrant || undefined}
                                todos={accumulatedTodos}
                                isLoading={isLoading && currentPage === 1}
                                onTodoToggle={(id: number | string) => toggleTodo({ id })}
                                onEditTodo={handleEditTodo}
                                onViewTodo={handleViewTodo}
                                onConvertTodo={handleConvertTodo}
                                onFlagTodo={handleFlagTodo}
                                hasNextPage={hasMore}
                                isFetchingNextPage={isLoadingMore}
                                fetchNextPage={fetchMore}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        <PendingTasksCard
                            pendingTodos={pendingTodos}
                            todayTodos={todayTodos}
                            upcomingTodos={upcomingTodos}
                            overdueTodos={overdueTodos}
                            noDateTodos={noDateTodos}
                            isLoading={isLoading && currentPage === 1}
                            hasMore={hasMore}
                            isLoadingMore={isLoadingMore}
                            fetchMore={fetchMore}
                            toggleTodo={toggleTodo}
                            handlePlayTask={handlePlayTask}
                            setPauseTaskId={setPauseTaskId}
                            setIsPauseModalOpen={setIsPauseModalOpen}
                            handleEditTodo={handleEditTodo}
                            handleConvertTodo={handleConvertTodo}
                            handleFlagTodo={handleFlagTodo}
                            handleViewTodo={handleViewTodo}
                        />

                        <CompletedTasksCard
                            completedTodos={completedTodos}
                            sortedCompletedDates={sortedCompletedDates}
                            groupedCompletedTodos={groupedCompletedTodos}
                            getCompletionDateLabel={getCompletionDateLabel}
                            isLoading={isLoading && currentPage === 1}
                            toggleTodo={toggleTodo}
                            handleViewTodo={handleViewTodo}
                        />
                    </div>
                </div>

                {isAddTodoModalOpen && !isEditMode && (
                    <BCTodoCreateModal
                        isOpen={isAddTodoModalOpen}
                        onClose={handleCloseModal}
                        onSuccess={() => refetch()}
                    />
                )}

                {isAddTodoModalOpen && isEditMode && (
                    <BCTodoEditModal
                        isOpen={isAddTodoModalOpen}
                        onClose={handleCloseModal}
                        onSuccess={() => refetch()}
                        editData={editingTodo}
                    />
                )}

                {/* Pause Reason Modal */}
                <PauseReasonModal
                    isOpen={isPauseModalOpen}
                    onClose={() => {
                        setIsPauseModalOpen(false);
                        setPauseTaskId(null);
                    }}
                    onSubmit={handlePauseTaskSubmit}
                    isLoading={isPauseLoading}
                    taskId={pauseTaskId}
                />

                {/* Toggle Todo Confirmation Modal */}
                <ToggleTodoConfirmModal
                    isOpen={isToggleConfirmOpen}
                    onClose={() => {
                        setIsToggleConfirmOpen(false);
                        setTodoToToggle(null);
                    }}
                    onConfirm={handleConfirmToggle}
                    isLoading={toggleLoading}
                    todo={todoToToggle}
                />

                {/* Todo Details Modal */}
                <TodoDetailsModal
                    isModalOpen={isDetailsModalOpen}
                    setIsModalOpen={setIsDetailsModalOpen}
                    todo={selectedTodo}
                    onEditClick={() => handleEditTodo(selectedTodo)}
                />

                {/* Filter Modal */}
                <Dialog
                    open={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    maxWidth={false}
                >
                    <DialogContent className="w-full max-w-sm bg-white text-sm" style={{ padding: 0 }}>
                        <div className="flex items-center justify-between px-6 py-5 border-b">
                            <h2 className="text-xl font-semibold">Filter</h2>
                            <X className="cursor-pointer" onClick={() => setIsFilterModalOpen(false)} />
                        </div>

                        <div className="divide-y">
                            {/* Priority */}
                            <div className="p-6 py-3">
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleDropdown("priority")}
                                >
                                    <span className="font-medium text-sm select-none">Priority</span>
                                    {dropdowns.priority ? (
                                        <ChevronDown className="text-gray-400" />
                                    ) : (
                                        <ChevronRight className="text-gray-400" />
                                    )}
                                </div>
                                {dropdowns.priority && (
                                    <div className="mt-4 border p-2">
                                        {[
                                            { value: "P1", label: "P1 - Urgent & Important" },
                                            { value: "P2", label: "P2 - Important, Not Urgent" },
                                            { value: "P3", label: "P3 - Urgent, Not Important" },
                                            { value: "P4", label: "P4 - Not Urgent or Important" },
                                        ].map((opt) => (
                                            <label
                                                key={opt.value}
                                                className="flex items-center gap-2 py-2 px-2 text-sm cursor-pointer hover:bg-gray-50 rounded"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPriorities.includes(opt.value)}
                                                    onChange={() => togglePriority(opt.value)}
                                                />
                                                {opt.label}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Start Date */}
                            <div className="p-6 py-3">
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleDropdown("startDate")}
                                >
                                    <span className="font-medium text-sm select-none">From Date</span>
                                    {dropdowns.startDate ? (
                                        <ChevronDown className="text-gray-400" />
                                    ) : (
                                        <ChevronRight className="text-gray-400" />
                                    )}
                                </div>
                                {dropdowns.startDate && (
                                    <div className="mt-4">
                                        <input
                                            type="date"
                                            value={dates.startDate}
                                            onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
                                            className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* End Date */}
                            <div className="p-6 py-3">
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleDropdown("endDate")}
                                >
                                    <span className="font-medium text-sm select-none">To Date</span>
                                    {dropdowns.endDate ? (
                                        <ChevronDown className="text-gray-400" />
                                    ) : (
                                        <ChevronRight className="text-gray-400" />
                                    )}
                                </div>
                                {dropdowns.endDate && (
                                    <div className="mt-4">
                                        <input
                                            type="date"
                                            value={dates.endDate}
                                            onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
                                            className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center items-center gap-4 px-6 py-3 border-t">
                            <button
                                className="bg-[#C72030] text-white rounded px-10 py-2 text-sm font-semibold hover:bg-[#b71c1c]"
                                onClick={handleApplyFilters}
                            >
                                Apply
                            </button>
                            <button
                                className="border border-[#C72030] text-[#C72030] rounded px-10 py-2 text-sm font-semibold hover:bg-red-50"
                                onClick={handleClearFilters}
                            >
                                Reset
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Drag Overlay - shows preview of dragged item */}
                <DragOverlay>
                    {activeTodo ? (
                        <div className="flex items-center gap-3 p-3 rounded-lg border shadow-lg bg-white cursor-grabbing">
                            <div className="flex flex-col flex-1 min-w-0 max-w-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700 font-medium truncate">{activeTodo.title}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    {activeTodo.target_date && (
                                        <span className="text-gray-500">Due: {activeTodo.target_date}</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded capitalize">
                                {activeTodo.priority || "N/A"}
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
};

export default BusinessCompassTodoPage;
