import { useEffect, useState } from "react";
import { Plus, Check, Play, Pause, Pencil, Focus, Calendar, Filter, GripVertical } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MobileAddToDoModal from "@/components/MobileAddToDoModal";
import TodoConvertModal from "@/components/TodoConvertModal";
import TodoFilterModal, { TodoFilters } from "@/components/TodoFilterModal";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";
import { toast } from "sonner";
import { Switch } from "@mui/material";
import { Card, CardContent } from "@/components/ui/card";
import MuiMultiSelect from "@/components/MuiMultiSelect";
import EisenhowerMatrix from "@/components/EisenhowerMatrix";
import { useTodos, useToggleTodo } from "@/hooks/useTodos";
import MobilePriorityTodo from "@/components/MobilePriorityTodo";
import { DndContext, DragEndEvent, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";
import { format } from "date-fns";

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
        <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 animate-pulse">
            <div className="w-4 h-4 bg-gray-300 rounded" />
            <div className="flex flex-col flex-1 gap-2">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
        </div>
    );
};

export default function MobileTodo() {
    const { setCurrentSection } = useLayout();
    const view = localStorage.getItem("selectedView");
    const [taskType, setTaskType] = useState<"all" | "my">("my");
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [selectedPriority, setSelectedPriority] = useState<string | null>('P1');

    useEffect(() => {
        setCurrentSection(
            view === "admin" ? "Value Added Services" : "Project Task"
        );
    }, [setCurrentSection]);

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);
    const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
    const [pauseTaskId, setPauseTaskId] = useState<number | null>(null);
    const [isPauseLoading, setIsPauseLoading] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
    const [convertTodoData, setConvertTodoData] = useState(null);
    const [convertTodoId, setConvertTodoId] = useState(null);
    const [users, setUsers] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [isToggleConfirmOpen, setIsToggleConfirmOpen] = useState(false);
    const [todoToToggle, setTodoToToggle] = useState<any>(null);
    const [toggleLoading, setToggleLoading] = useState(false);
    const [priorityFilteredTodos, setPriorityFilteredTodos] = useState<any[]>([]);
    const [isPriorityLoading, setIsPriorityLoading] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<TodoFilters>({
        fromDate: '',
        toDate: '',
        selectedPriorities: [],
        selectedCreators: [],
        creatorSearch: '',
        selectedAssignedTo: [],
        assignedToSearch: '',
    });

    const userIds = selectedUsers.map(u => u.value);
    const assignedToIds = appliedFilters.selectedAssignedTo.map(id => id.toString());
    const creatorIds = appliedFilters.selectedCreators.map(id => id.toString());
    const {
        data: todosData,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    } = useTodos({
        taskType,
        userIds,
        fromDate: appliedFilters.fromDate,
        toDate: appliedFilters.toDate,
        selectedAssignedTo: assignedToIds,
        selectedCreators: creatorIds,
    });

    const todos = todosData?.pages.flatMap(page => page.todos) || [];

    useEffect(() => {
        if (todosData?.pages[0]?.dashboard) {
            setDashboardData(todosData.pages[0].dashboard);
        }
    }, [todosData]);

    const getUsers = async () => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const validUsers = (response.data.users || [])
                .filter((user: any) => user && user.id)
                .map((user: any) => ({
                    ...user
                }));
            setUsers(validUsers);
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const fetchTodosByPriority = async (priority: string | null) => {
        if (!priority) {
            setPriorityFilteredTodos([]);
            setSelectedPriority(null);
            return;
        }

        setIsPriorityLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const userId = taskType === "my" ? user.id : undefined;

            const params = new URLSearchParams();
            params.append("q[priority_eq]", priority);
            if (userId) {
                params.append("q[user_id_eq]", userId);
            }

            const response = await axios.get(
                `https://${baseUrl}/todos.json?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const filteredTodos = Array.isArray(response.data.todos) ? response.data.todos : [];
            setPriorityFilteredTodos(filteredTodos);
            setSelectedPriority(priority);
        } catch (error) {
            console.error("Error fetching todos by priority:", error);
            toast.error("Failed to fetch todos for this priority");
            setPriorityFilteredTodos([]);
        } finally {
            setIsPriorityLoading(false);
        }
    };

    useEffect(() => {
        fetchTodosByPriority("P1");
    }, [taskType])

    const toggleMutation = useToggleTodo();

    const handleMultiSelectChange = (name, selectedOptions) => {
        if (name === "members") {
            setSelectedUsers(selectedOptions);
        }
    };

    const handleApplyFilters = (filters: TodoFilters) => {
        setAppliedFilters(filters);
        refetch();
    };

    const toggleTodo = async (id: number | string) => {
        const todo = todos.find(t => t.id === id);
        setTodoToToggle(todo);
        setIsToggleConfirmOpen(true);
    };

    const handleConfirmToggle = async () => {
        if (!todoToToggle) return;

        setToggleLoading(true);
        try {
            const isCompleted = todoToToggle?.status === "open";
            await toggleMutation.mutateAsync({
                id: todoToToggle.id,
                completed: isCompleted,
            });
            toast.success(isCompleted ? "Task completed successfully" : "Task reopened successfully");
            setIsToggleConfirmOpen(false);
            setTodoToToggle(null);
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
                `https://${baseUrl}/task_managements/${taskId}/update_status.json`,
                {
                    status: "started",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
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
                `https://${baseUrl}/task_managements/${taskId}/update_status.json`,
                {
                    status: "stopped",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const commentPayload = {
                comment: {
                    body: `Paused with reason: ${reason}`,
                    commentable_id: taskId,
                    commentable_type: "TaskManagement",
                    commentor_id: JSON.parse(localStorage.getItem("user"))?.id,
                    active: true,
                },
            };

            await axios.post(`https://${baseUrl}/comments.json`, commentPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Task paused successfully with reason");
            setIsPauseModalOpen(false);
            setPauseTaskId(null);

            refetch();
        } catch (error) {
            console.error("Failed to pause task:", error);
            toast.error(
                `Failed to pause task: ${error?.response?.data?.error || error?.message || "Server error"}`
            );
        } finally {
            setIsPauseLoading(false);
        }
    };

    const handleEditTodo = (todo) => {
        setEditingTodo(todo);
        setIsEditMode(true);
        setIsAddTodoModalOpen(true);
    };

    const handleFlagTodo = async (todo: any) => {
        try {
            const newFlaggedStatus = !todo.is_flagged;
            const payload = {
                todo: {
                    is_flagged: newFlaggedStatus,
                    flagged_at: newFlaggedStatus ? new Date().toISOString() : null,
                },
            };

            await axios.put(
                `https://${baseUrl}/todos/${todo.id}.json`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
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

    const handleCloseModal = () => {
        setIsAddTodoModalOpen(false);
        setEditingTodo(null);
        setIsEditMode(false);
        refetch();
    };

    const handleConvertTodo = (todo) => {
        setConvertTodoData({
            title: todo.title,
            target_date: todo.target_date,
            responsible_person: {
                id: JSON.parse(localStorage.getItem('user'))?.id
            }
        });
        setConvertTodoId(todo.id);
        setIsConvertModalOpen(true);
    };

    const filteredTodosByFilters = todos.filter((todo) => {
        if (appliedFilters.selectedPriorities.length > 0) {
            if (!appliedFilters.selectedPriorities.includes(todo.priority)) return false;
        }
        return true;
    });

    const pendingTodos = filteredTodosByFilters.filter((t) => t.status !== "completed");
    const completedTodos = filteredTodosByFilters.filter((t) => t.status === "completed");

    const groupedCompletedTodos = completedTodos.reduce((groups, todo) => {
        const date = todo.updated_at ? todo.updated_at.split("T")[0] : "No Date";
        if (!groups[date]) {
            groups[date] = [];
        }
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

    const overdueTodos = pendingTodos.filter(
        (t) => t.target_date && t.target_date < today
    );

    const todayTodos = pendingTodos.filter((t) => t.target_date === today);

    const upcomingTodos = pendingTodos.filter(
        (t) => t.target_date && t.target_date > today
    );

    const noDateTodos = pendingTodos.filter((t) => !t.target_date);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const todoId = active.data.current?.todoId;
        const currentStatus = active.data.current?.status;

        try {
            const token = sessionStorage.getItem("mobile_token") || localStorage.getItem("token");
            const baseUrl = localStorage.getItem("baseUrl") || "";

            if (over.id === "pending-section" && currentStatus === "completed") {
                await axios.patch(
                    `https://${baseUrl}/todos/${todoId}.json`,
                    { status: "open" },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Todo moved to open");
                refetch();
            } else if (over.id === "completed-section" && currentStatus !== "completed") {
                await axios.patch(
                    `https://${baseUrl}/todos/${todoId}.json`,
                    { status: "completed" },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Todo marked as completed");
                refetch();
            }

            if (over.id?.toString().startsWith("priority-")) {
                const newPriority = over.id.toString().replace("priority-", "");
                const currentPriority = active.data.current?.priority;

                if (newPriority !== currentPriority) {
                    await axios.patch(
                        `https://${baseUrl}/todos/${todoId}.json`,
                        { priority: newPriority },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    toast.success(`Priority changed to ${newPriority}`);
                    refetch();
                    fetchTodosByPriority(selectedPriority);
                }
            }
        } catch (error) {
            console.error("Drag and drop error:", error);
            toast.error("Failed to update todo");
        }
    };

    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const activeTodo = activeDragId
        ? todos.find(t => `todo-${t.id}` === activeDragId)
        : null;

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={(event) => setActiveDragId(event.active.id.toString())}
            onDragCancel={() => setActiveDragId(null)}
        >
            <div className="p-3 pb-20 space-y-3">
                {/* Mobile Header Controls */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => setIsAddTodoModalOpen(true)}>
                            <Plus size={16} />
                            Add
                        </Button>

                        {/* My Todos Toggle */}
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-xs font-medium text-gray-700">My Todos</span>
                            <Switch
                                checked={taskType === "all"}
                                onChange={() => {
                                    const newTaskType = taskType === "all" ? "my" : "all";
                                    setTaskType(newTaskType);
                                    if (newTaskType === "my") {
                                        setSelectedUsers([]);
                                    }
                                }}
                                size="small"
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#C72030',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#C72030',
                                    },
                                }}
                            />
                            <span className="text-xs font-medium text-gray-700">All Todos</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 p-1 h-auto"
                            onClick={() => setIsFilterModalOpen(true)}
                        >
                            <Filter className="w-3 h-3" />
                        </Button>
                    </div>
                </div>

                {taskType === "all" && (
                    <div className="w-full !mt-4">
                        <MuiMultiSelect
                            label="Members"
                            options={users
                                ?.filter(Boolean)
                                .map((user: any) => ({
                                    label: user.name || user?.full_name || "Unknown",
                                    value: user?.id,
                                    id: user?.id,
                                }))}
                            placeholder="Select Members"
                            value={selectedUsers}
                            onChange={(values) => handleMultiSelectChange("members", values)}
                            maxHeight="36px"
                        />
                    </div>
                )}

                {/* Priority Section - Stacked for Mobile */}
                <div className="space-y-2">
                    <EisenhowerMatrix
                        dashboardData={dashboardData}
                        onQuadrantClick={fetchTodosByPriority}
                        selectedPriority={selectedPriority}
                    />
                </div>

                {/* Priority Filtered Todos */}
                <div className="space-y-2">
                    <MobilePriorityTodo
                        selectedPriority={selectedPriority || undefined}
                        todos={priorityFilteredTodos}
                        isLoading={isPriorityLoading}
                        onTodoToggle={toggleTodo}
                        onEditTodo={handleEditTodo}
                        onFlagTodo={(todo) => handleFlagTodo(todo)}
                        onPlayTask={handlePlayTask}
                        onPauseTask={(taskId) => {
                            setPauseTaskId(taskId);
                            setIsPauseModalOpen(true);
                        }}
                    />
                </div>

                {/* Pending Tasks */}
                <MobilePendingTasksCard
                    pendingTodos={pendingTodos}
                    todayTodos={todayTodos}
                    upcomingTodos={upcomingTodos}
                    overdueTodos={overdueTodos}
                    noDateTodos={noDateTodos}
                    isLoading={isLoading}
                    isFetchingNextPage={isFetchingNextPage}
                    hasNextPage={hasNextPage}
                    fetchNextPage={fetchNextPage}
                    {...{ toggleTodo, handlePlayTask, setPauseTaskId, setIsPauseModalOpen, handleEditTodo, handleConvertTodo, handleFlagTodo, refetch }}
                />

                {/* Completed Tasks */}
                <MobileCompletedTasksCard
                    completedTodos={completedTodos}
                    sortedCompletedDates={sortedCompletedDates}
                    groupedCompletedTodos={groupedCompletedTodos}
                    getCompletionDateLabel={getCompletionDateLabel}
                    isLoading={isLoading}
                    toggleTodo={toggleTodo}
                />
            </div>

            {isAddTodoModalOpen && (
                <MobileAddToDoModal
                    isModalOpen={isAddTodoModalOpen}
                    setIsModalOpen={handleCloseModal}
                    getTodos={refetch}
                    editingTodo={editingTodo}
                    isEditMode={isEditMode}
                />
            )}

            {isConvertModalOpen && (
                <TodoConvertModal
                    isModalOpen={isConvertModalOpen}
                    setIsModalOpen={setIsConvertModalOpen}
                    prefillData={convertTodoData}
                    todoId={convertTodoId}
                    onSuccess={() => {
                        refetch();
                        setIsConvertModalOpen(false);
                    }}
                />
            )}

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

            <TodoFilterModal
                isModalOpen={isFilterModalOpen}
                setIsModalOpen={setIsFilterModalOpen}
                onApplyFilters={handleApplyFilters}
                users={users}
            />

            <DragOverlay>
                {activeTodo ? (
                    <div className="flex items-center gap-2 p-2 rounded-lg border shadow-lg bg-white cursor-grabbing">
                        <div className="flex flex-col flex-1 min-w-0 max-w-xs">
                            <div className="text-xs font-medium truncate">{activeTodo.title}</div>
                            <div className="text-xs text-gray-500">{activeTodo.user}</div>
                        </div>
                        <div className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded">
                            {activeTodo.priority || 'N/A'}
                        </div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

// Mobile Pending Tasks Card
const MobilePendingTasksCard = ({
    pendingTodos,
    todayTodos,
    upcomingTodos,
    overdueTodos,
    noDateTodos,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    toggleTodo,
    handlePlayTask,
    setPauseTaskId,
    setIsPauseModalOpen,
    handleEditTodo,
    handleConvertTodo,
    handleFlagTodo,
    refetch,
}) => {
    const { setNodeRef, isOver } = useDroppable({ id: "pending-section" });

    return (
        <Card ref={setNodeRef} className={`shadow-sm border border-border transition-colors ${isOver ? 'bg-blue-50' : ''}`}>
            <div className="flex items-center gap-2 p-3 bg-[#F6F4EE] border border-[#D9D9D9]">
                <div className="font-semibold w-7 h-7 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030] text-xs">
                    {pendingTodos.length.toString().padStart(2, "0")}
                </div>
                <h3 className="text-xs font-semibold uppercase text-[#1A1A1A]">TO DO</h3>
            </div>
            <CardContent className="py-2 px-2">
                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <TodoSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <>
                        {todayTodos.length > 0 && (
                            <div className="mb-2">
                                <h4 className="text-xs font-semibold text-primary mb-1">Today</h4>
                                {todayTodos.map((todo) => (
                                    <MobileTodoItem
                                        key={todo.id}
                                        todo={todo}
                                        toggleTodo={toggleTodo}
                                        handlePlayTask={handlePlayTask}
                                        setPauseTaskId={setPauseTaskId}
                                        setIsPauseModalOpen={setIsPauseModalOpen}
                                        handleEditTodo={handleEditTodo}
                                        handleConvertTodo={handleConvertTodo}
                                        handleFlagTodo={handleFlagTodo}
                                        refetch={refetch}
                                    />
                                ))}
                            </div>
                        )}

                        {upcomingTodos.length > 0 && (
                            <div className="mb-2">
                                <h4 className="text-xs font-semibold text-blue-600 mb-1">Upcoming</h4>
                                {upcomingTodos.map((todo) => (
                                    <MobileTodoItem
                                        key={todo.id}
                                        todo={todo}
                                        toggleTodo={toggleTodo}
                                        handlePlayTask={handlePlayTask}
                                        setPauseTaskId={setPauseTaskId}
                                        setIsPauseModalOpen={setIsPauseModalOpen}
                                        handleEditTodo={handleEditTodo}
                                        handleConvertTodo={handleConvertTodo}
                                        handleFlagTodo={handleFlagTodo}
                                        refetch={refetch}
                                    />
                                ))}
                            </div>
                        )}

                        {overdueTodos.length > 0 && (
                            <div className="mb-2">
                                <h4 className="text-xs font-semibold text-red-600 mb-1">Overdue</h4>
                                {overdueTodos.map((todo) => (
                                    <MobileTodoItem
                                        key={todo.id}
                                        todo={todo}
                                        toggleTodo={toggleTodo}
                                        handlePlayTask={handlePlayTask}
                                        setPauseTaskId={setPauseTaskId}
                                        setIsPauseModalOpen={setIsPauseModalOpen}
                                        handleEditTodo={handleEditTodo}
                                        handleConvertTodo={handleConvertTodo}
                                        handleFlagTodo={handleFlagTodo}
                                        refetch={refetch}
                                    />
                                ))}
                            </div>
                        )}

                        {noDateTodos.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 mb-1">No Target Date</h4>
                                {noDateTodos.map((todo) => (
                                    <MobileTodoItem
                                        key={todo.id}
                                        todo={todo}
                                        toggleTodo={toggleTodo}
                                        handlePlayTask={handlePlayTask}
                                        setPauseTaskId={setPauseTaskId}
                                        setIsPauseModalOpen={setIsPauseModalOpen}
                                        handleEditTodo={handleEditTodo}
                                        handleConvertTodo={handleConvertTodo}
                                        handleFlagTodo={handleFlagTodo}
                                        refetch={refetch}
                                    />
                                ))}
                            </div>
                        )}

                        {!isLoading && pendingTodos.length === 0 && (
                            <div className="text-center py-4">
                                <p className="text-xs text-muted-foreground">
                                    No pending tasks! You're all caught up.
                                </p>
                            </div>
                        )}

                        {hasNextPage && (
                            <div className="flex justify-center mt-2">
                                <Button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    size="sm"
                                    className="text-xs"
                                >
                                    {isFetchingNextPage ? "Loading..." : "Load More"}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

// Mobile Completed Tasks Card
const MobileCompletedTasksCard = ({
    completedTodos,
    sortedCompletedDates,
    groupedCompletedTodos,
    getCompletionDateLabel,
    isLoading,
    toggleTodo,
}) => {
    const { setNodeRef, isOver } = useDroppable({ id: "completed-section" });

    return (
        <Card ref={setNodeRef} className={`shadow-sm border border-border transition-colors ${isOver ? 'bg-green-50' : ''}`}>
            <div className="flex items-center gap-2 p-3 bg-[#F6F4EE] border border-[#D9D9D9]">
                <div className="font-semibold w-7 h-7 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030] text-xs">
                    {completedTodos.length.toString().padStart(2, "0")}
                </div>
                <h3 className="text-xs font-semibold uppercase text-[#1A1A1A]">Completed</h3>
            </div>
            <CardContent className="py-2 px-2">
                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <TodoSkeleton key={i} />
                        ))}
                    </div>
                ) : completedTodos.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-xs text-muted-foreground">
                            Complete tasks to see them here.
                        </p>
                    </div>
                ) : (
                    sortedCompletedDates.map((date) => (
                        <div key={date} className="space-y-1 mb-2">
                            <h4 className="text-xs font-semibold text-muted-foreground">
                                {getCompletionDateLabel(date)}
                            </h4>
                            {groupedCompletedTodos[date].map((todo) => (
                                <MobileCompletedTodoItem
                                    key={todo.id}
                                    todo={todo}
                                    toggleTodo={toggleTodo}
                                />
                            ))}
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

// Mobile Todo Item
const MobileTodoItem = ({
    todo,
    toggleTodo,
    handlePlayTask,
    setPauseTaskId,
    setIsPauseModalOpen,
    handleEditTodo,
    handleConvertTodo,
    handleFlagTodo,
    refetch,
}) => {
    const navigate = useNavigate();
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `todo-${todo.id}`,
        data: { todoId: todo.id, priority: todo.priority, status: todo.status }
    });

    const handleTaskClick = () => {
        if (todo.task_management_id) {
            navigate(`/vas/tasks/${todo.task_management_id}`);
        }
    };

    const isTaskStarted = todo.task_management?.is_started || false;
    const isCompleted = todo.status === "completed";

    const getPriorityBgColor = () => {
        const priority = todo.priority || '';
        switch (priority) {
            case 'P1':
                return 'border-l-4 border-l-red-500';
            case 'P2':
                return 'border-l-4 border-l-green-500';
            case 'P3':
                return 'border-l-4 border-l-yellow-500';
            case 'P4':
                return 'border-l-4 border-l-gray-400';
            default:
                return 'border-l-4 border-l-gray-300';
        }
    };

    const getPriorityLabel = () => {
        const priority = todo.priority || '';
        switch (priority) {
            case 'P1':
                return 'Q1';
            case 'P2':
                return 'Q2';
            case 'P3':
                return 'Q3';
            case 'P4':
                return 'Q4';
            default:
                return priority;
        }
    };

    const getPriorityTagColor = () => {
        const priority = todo.priority || '';
        switch (priority) {
            case 'P1':
                return 'bg-red-100 text-red-700';
            case 'P2':
                return 'bg-green-100 text-green-700';
            case 'P3':
                return 'bg-yellow-100 text-yellow-700';
            case 'P4':
                return 'bg-gray-200 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={`relative flex items-center gap-2 p-2 rounded-lg transition-colors group mb-1 border text-xs ${getPriorityBgColor()} ${isDragging ? 'opacity-50 ring-2 ring-blue-400' : ''}`}
        >
            <div className="flex items-center gap-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditTodo(todo);
                    }}
                    className="p-0.5 text-gray-600 hover:text-primary transition-colors"
                    title="Edit"
                >
                    <Pencil size={12} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleFlagTodo(todo);
                    }}
                    disabled={isCompleted}
                    className="p-0.5 hover:bg-gray-200 rounded transition disabled:opacity-50"
                    title={todo.is_flagged ? "Unflag" : "Flag"}
                >
                    <Focus
                        size={12}
                        color={todo.is_flagged ? "#fa0202" : "#4b5563"}
                    />
                </button>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-1 truncate">
                    {todo.task_management_id && (
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTaskClick();
                            }}
                            className="text-[#c72030] cursor-pointer hover:underline whitespace-nowrap text-xs"
                        >
                            T-{todo.task_management_id}
                        </span>
                    )}
                    <span className="truncate text-xs">{todo.title}</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                    {todo.user} {todo.target_date && `• Due: ${todo.target_date}`}
                </div>
            </div>

            <div className="flex items-center gap-1">
                {todo.task_management_id &&
                    (isTaskStarted ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setPauseTaskId(todo.task_management_id);
                                setIsPauseModalOpen(true);
                            }}
                            disabled={isCompleted}
                            className="p-0.5 hover:bg-gray-200 rounded transition disabled:opacity-50"
                            title="Pause"
                        >
                            <Pause size={14} className="text-orange-500" />
                        </button>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePlayTask(todo.task_management_id);
                            }}
                            disabled={isCompleted}
                            className="p-0.5 hover:bg-gray-200 rounded transition disabled:opacity-50"
                            title="Play"
                        >
                            <Play size={14} className="text-green-500" />
                        </button>
                    ))}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleTodo(todo.id);
                    }}
                    className="flex-shrink-0 w-4 h-4 border-2 border-primary flex items-center justify-center"
                    title="Toggle"
                >
                    <Check
                        size={12}
                        className="text-primary opacity-0 group-hover:opacity-100"
                    />
                </button>
            </div>

            {/* <div className={`px-1 py-0.5 text-[10px] font-semibold absolute bottom-0.5 right-1 ${getPriorityTagColor()}`}>
        {getPriorityLabel()}
      </div> */}
        </div>
    );
};

// Mobile Completed Todo Item
const MobileCompletedTodoItem = ({ todo, toggleTodo }) => {
    const navigate = useNavigate();

    const getPriorityBgColor = () => {
        const priority = todo.priority || '';
        switch (priority) {
            case 'P1':
                return 'border-l-4 border-l-red-500';
            case 'P2':
                return 'border-l-4 border-l-green-500';
            case 'P3':
                return 'border-l-4 border-l-yellow-500';
            case 'P4':
                return 'border-l-4 border-l-gray-400';
            default:
                return 'border-l-4 border-l-gray-300';
        }
    };

    const getPriorityLabel = () => {
        const priority = todo.priority || '';
        switch (priority) {
            case 'P1':
                return 'Q1';
            case 'P2':
                return 'Q2';
            case 'P3':
                return 'Q3';
            case 'P4':
                return 'Q4';
            default:
                return priority;
        }
    };

    const getPriorityTagColor = () => {
        const priority = todo.priority || '';
        switch (priority) {
            case 'P1':
                return 'bg-red-100 text-red-700';
            case 'P2':
                return 'bg-green-100 text-green-700';
            case 'P3':
                return 'bg-yellow-100 text-yellow-700';
            case 'P4':
                return 'bg-gray-200 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const handleTaskClick = () => {
        if (todo.task_management_id) {
            navigate(`/vas/tasks/${todo.task_management_id}`);
        }
    };

    const isTaskStarted = todo.task_management?.is_started || false;

    return (
        <div className={`relative flex items-center gap-2 p-2 rounded-lg border transition-colors group mb-1 text-xs ${getPriorityBgColor()}`}>
            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-1 truncate">
                    {todo.task_management_id && (
                        <span
                            onClick={handleTaskClick}
                            className="text-[#c72030] cursor-pointer hover:underline whitespace-nowrap text-xs"
                        >
                            T-{todo.task_management_id}
                        </span>
                    )}
                    <span className="truncate text-xs">{todo.title}</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                    {todo.user} {todo.target_date && `• Due: ${todo.target_date}`}
                </div>
            </div>

            <button
                onClick={() => toggleTodo(todo.id)}
                className="flex-shrink-0 w-4 h-4 !bg-[#c72030] !text-white flex items-center justify-center hover:opacity-90 transition-all"
            >
                <Check size={12} color="white" />
            </button>

            {/* <div className={`px-1 py-0.5 text-[10px] font-semibold ${getPriorityTagColor()}`}>
                {getPriorityLabel()}
            </div> */}
        </div>
    );
};

// Pause Reason Modal
const PauseReasonModal = ({ isOpen, onClose, onSubmit, isLoading, taskId }) => {
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-6 bg-[#C72030] rounded-sm"></div>
                    <h2 className="text-base font-bold text-gray-900">
                        Pause Task
                    </h2>
                </div>

                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    Please provide a reason for pausing this task.
                </p>

                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Reason</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C72030] focus:ring-2 focus:ring-[#C72030] focus:ring-opacity-20 resize-none text-xs bg-white"
                        rows={3}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors text-xs"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-3 py-2 bg-[#C72030] text-white font-medium rounded-md hover:bg-[#b01c26] disabled:opacity-50 transition-colors text-xs"
                    >
                        {isLoading ? "Processing..." : "Pause Task"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Toggle Todo Confirmation Modal
const ToggleTodoConfirmModal = ({ isOpen, onClose, onConfirm, isLoading, todo }) => {
    if (!isOpen || !todo) return null;

    const isCompleting = todo?.status === "open";
    const title = isCompleting ? "Complete Todo" : "Reopen Todo";
    const message = isCompleting
        ? `Mark "${todo?.title}" as completed?`
        : `Reopen "${todo?.title}"?`;
    const buttonText = isCompleting ? "Complete" : "Reopen";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-sm border border-gray-200">
                <h2 className="text-base font-bold text-gray-900 mb-2">
                    {title}
                </h2>

                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    {message}
                </p>

                <div className="flex gap-2 justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-xs"
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="text-xs"
                    >
                        {isLoading ? "Processing..." : buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
};