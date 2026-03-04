import { useEffect, useState } from "react";
import { Plus, Check, Play, Pause, Pencil, RefreshCw, ArrowRightLeft, Focus, Calendar, Filter } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddToDoModal from "@/components/AddToDoModal";
import TodoConvertModal from "@/components/TodoConvertModal";
import TodoFilterModal, { TodoFilters } from "@/components/TodoFilterModal";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";
import { toast } from "sonner";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";
import { Switch } from "@mui/material";
import { Card, CardContent } from "@/components/ui/card";
import MuiMultiSelect from "@/components/MuiMultiSelect";
import EisenhowerMatrix from "@/components/EisenhowerMatrix";
import { useTodos, useToggleTodo } from "@/hooks/useTodos";
import PriorityTodo from "@/components/PriorityTodo";
import { DndContext, DragEndEvent, useDraggable, useDroppable, DragOverlay, Active } from "@dnd-kit/core";

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
    // If end date is missing, return N/A
    if (!end) return { text: "N/A", isOverdue: false };

    const now = new Date();
    // Use provided start date or today if not provided
    const startDateObj = start ? new Date(start) : now;
    const endDate = new Date(end);

    // Set end date to end of the day
    endDate.setHours(23, 59, 59, 999);

    // Check if task hasn't started yet
    if (now < startDateObj) {
      return { text: "Not started", isOverdue: false };
    }

    // Calculate time differences (use absolute value to show overdue time)
    const diffMs = endDate.getTime() - now.getTime();
    const absDiffMs = Math.abs(diffMs);
    const isOverdue = diffMs <= 0;

    // Calculate time differences
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

export default function Todo() {
  const { setCurrentSection } = useLayout();

  const view = localStorage.getItem("selectedView");
  const [taskType, setTaskType] = useState<"all" | "my">("my");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string | null>('P1');

  // Date filter state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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
  });

  // Use React Query hook for infinite pagination
  const userIds = selectedUsers.map(u => u.value);
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
    fromDate,
    toDate,
  });

  // Combine all pages into a single todos array
  const todos = todosData?.pages.flatMap(page => page.todos) || [];

  // Extract dashboard data from first page
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
      // Filter out any undefined/null users and map roles
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

  // Function to fetch todos by priority
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

      // Build query parameters
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

  // Use toggle mutation hook for better cache management
  const toggleMutation = useToggleTodo();

  const handleMultiSelectChange = (name, selectedOptions) => {
    if (name === "members") {
      setSelectedUsers(selectedOptions);
    }
  };

  // Handle filter application
  const handleApplyFilters = (filters: TodoFilters) => {
    setAppliedFilters(filters);
    // Apply filters to the todos list
    // The filtering will be applied through the useTodos hook and local filtering
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

  const deleteTodo = (id: number | string) => {
    // Deletion handled by React Query
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
      refetch(); // Refresh todos to get updated task status
    } catch (error) {
      console.error("Failed to start task:", error);
      toast.error("Failed to start task");
    }
  };

  const handlePauseTaskSubmit = async (reason: string, taskId: number) => {
    if (!taskId) return;

    setIsPauseLoading(true);
    try {
      // Update task status to "stopped" (paused)
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

      // Add comment with pause reason
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

      // Refresh todos to get updated task status
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
    refetch(); // Refresh todos after modal closes
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

  // Apply active filters to todos
  const filteredTodosByFilters = todos.filter((todo) => {
    // Filter by date range
    if (appliedFilters.fromDate && todo.created_at) {
      const todoDate = new Date(todo.created_at).toISOString().split('T')[0];
      if (todoDate < appliedFilters.fromDate) return false;
    }
    if (appliedFilters.toDate && todo.created_at) {
      const todoDate = new Date(todo.created_at).toISOString().split('T')[0];
      if (todoDate > appliedFilters.toDate) return false;
    }
    // Filter by priority
    if (appliedFilters.selectedPriorities.length > 0) {
      if (!appliedFilters.selectedPriorities.includes(todo.priority)) return false;
    }
    // Filter by created by
    if (appliedFilters.selectedCreators.length > 0) {
      if (!appliedFilters.selectedCreators.includes(todo.created_by_id)) return false;
    }
    return true;
  });

  const pendingTodos = filteredTodosByFilters.filter((t) => t.status !== "completed");
  const completedTodos = filteredTodosByFilters.filter((t) => t.status === "completed");

  // Group completed todos by updated_at date
  const groupedCompletedTodos = completedTodos.reduce((groups, todo) => {
    const date = todo.updated_at ? todo.updated_at.split("T")[0] : "No Date";
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(todo);
    return groups;
  }, {} as Record<string, any[]>);

  // Get sorted dates (descending)
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

  // ------------------------------
  // DATE GROUPING (Pending Todos)
  // ------------------------------
  const today = new Date().toISOString().split("T")[0];

  const overdueTodos = pendingTodos.filter(
    (t) => t.target_date && t.target_date < today
  );

  const todayTodos = pendingTodos.filter((t) => t.target_date === today);

  const upcomingTodos = pendingTodos.filter(
    (t) => t.target_date && t.target_date > today
  );

  // fallback group if any todo has no target date
  const noDateTodos = pendingTodos.filter((t) => !t.target_date);

  // Handle drag and drop
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const todoId = active.data.current?.todoId;
    const currentStatus = active.data.current?.status;

    try {
      const token = sessionStorage.getItem("mobile_token") || localStorage.getItem("token");
      const baseUrl = localStorage.getItem("baseUrl") || "";

      // Handle status change (open <-> completed)
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

      // Handle priority change (drag to Eisenhower quadrant)
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
    ? todos.find(t => `todo-${t.id}` === activeDragId)
    : null;

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={(event) => setActiveDragId(event.active.id.toString())}
      onDragCancel={() => setActiveDragId(null)}
    >
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-stretch gap-2 w-full h-[19.5rem]">
            {/* Eisenhower Matrix */}
            <div className="w-1/2 h-full">
              <EisenhowerMatrix
                dashboardData={dashboardData}
                onQuadrantClick={fetchTodosByPriority}
                selectedPriority={selectedPriority}
              />
            </div>
            <div className="w-1/2 h-full">
              <PriorityTodo
                selectedPriority={selectedPriority || undefined}
                todos={priorityFilteredTodos}
                isLoading={isPriorityLoading}
                onTodoToggle={toggleTodo}
                onEditTodo={handleEditTodo}
                onConvertTodo={handleConvertTodo}
                onFlagTodo={(todo) => handleFlagTodo(todo)}
              />
            </div>
          </div>

          <div className="flex items-end justify-between gap-6 flex-wrap">
            {/* Date Filters - Left Side */}
            <div className="flex items-end gap-4 flex-shrink-0">
              <Button
                onClick={() => setIsAddTodoModalOpen(true)}
              // className="text-[12px] flex items-center justify-center gap-1 bg-red text-white px-3 py-2"
              >
                <Plus size={18} />
                Add
              </Button>
              {/* <div className="flex flex-col gap-1">
                <label htmlFor="fromDate" className="text-xs font-semibold text-gray-600">From Date</label>
                <div className="relative flex items-center">
                  <Calendar size={14} className="absolute left-2.5 text-[#C72030]" />
                  <input
                    id="fromDate"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="pl-8 pr-2.5 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="toDate" className="text-xs font-semibold text-gray-600">To Date</label>
                <div className="relative flex items-center">
                  <Calendar size={14} className="absolute left-2.5 text-[#C72030]" />
                  <input
                    id="toDate"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="pl-8 pr-2.5 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
                  />
                </div>
              </div> */}
            </div>

            {/* Existing Controls - Right Side */}
            <div className="flex items-center gap-3">
              {
                taskType === "all" && (
                  <div className="w-64">
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
                )
              }
              <div className="flex items-center px-4 py-2">
                <span className="text-gray-700 font-medium text-sm">My Todos</span>
                <Switch
                  checked={taskType === "all"}
                  onChange={() => {
                    const newTaskType = taskType === "all" ? "my" : "all";
                    setTaskType(newTaskType);
                    if (newTaskType === "my") {
                      setSelectedUsers([]);
                    }
                  }}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#C72030',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#C72030',
                    },
                  }}
                />
                <span className="text-gray-700 font-medium text-sm">All Todos</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 flex items-center gap-2"
                title='Filter'
                onClick={() => setIsFilterModalOpen(true)}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ------------------------------------
                        Pending Tasks Section
                    ------------------------------------ */}
            <PendingTasksCard
              pendingTodos={pendingTodos}
              todayTodos={todayTodos}
              upcomingTodos={upcomingTodos}
              overdueTodos={overdueTodos}
              noDateTodos={noDateTodos}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              {...{ toggleTodo, deleteTodo, handlePlayTask, setPauseTaskId, setIsPauseModalOpen, handleEditTodo, handleConvertTodo, handleFlagTodo, refetch }}
            />

            {/* ------------------------------------
                        Completed Section
                    ------------------------------------ */}
            <CompletedTasksCard
              completedTodos={completedTodos}
              sortedCompletedDates={sortedCompletedDates}
              groupedCompletedTodos={groupedCompletedTodos}
              getCompletionDateLabel={getCompletionDateLabel}
              isLoading={isLoading}
              toggleTodo={toggleTodo}
            />
          </div>
        </div>

        {isAddTodoModalOpen && (
          <AddToDoModal
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

        {/* Todo Filter Modal */}
        <TodoFilterModal
          isModalOpen={isFilterModalOpen}
          setIsModalOpen={setIsFilterModalOpen}
          onApplyFilters={handleApplyFilters}
          users={users}
        />

        {/* Drag Overlay - shows preview of dragged item */}
        <DragOverlay>
          {activeTodo ? (
            <div className={`flex items-center gap-3 p-3 rounded-lg border shadow-lg bg-white cursor-grabbing`}>
              <div className="flex flex-col flex-1 min-w-0 max-w-sm">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 font-medium truncate">{activeTodo.title}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-gray-500">{activeTodo.user}</span>
                  {activeTodo.target_date && (
                    <>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">Due: {activeTodo.target_date}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded">
                {activeTodo.priority || 'N/A'}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

// Pause Reason Modal Component
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[32rem] border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-[#C72030] rounded-sm"></div>
          <h2 className="text-lg font-bold text-gray-900">
            Pause Task
          </h2>
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
const ToggleTodoConfirmModal = ({ isOpen, onClose, onConfirm, isLoading, todo }) => {
  if (!isOpen || !todo) return null;

  const isCompleting = todo?.status === "open";
  const title = isCompleting ? "Complete Todo" : "Reopen Todo";
  const message = isCompleting
    ? `Are you sure you want to mark "${todo?.title}" as completed?`
    : `Are you sure you want to reopen "${todo?.title}"?`;
  const buttonText = isCompleting ? "Complete" : "Reopen";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[32rem] border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            {title}
          </h2>
        </div>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Separate Todo Item Component (Cleaner UI)
// ----------------------------------------------
// ----------------------------------------------
// Pending Tasks Card (with droppable zone)
const PendingTasksCard = ({
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
  deleteTodo,
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
      <div className="flex items-center gap-3 p-4 bg-[#F6F4EE] border border-[#D9D9D9]">
        <div className="font-semibold w-8  h-8 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
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
                {todayTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
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
              <div>
                <h3 className="text-blue-600 font-semibold mb-2">Upcoming</h3>
                {upcomingTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
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
              <div>
                <h3 className="text-red-600 font-semibold mb-2">Overdue</h3>
                {overdueTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
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
                <h3 className="text-gray-500 font-semibold mb-2">No Target Date</h3>
                {noDateTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
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
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-center">
                  No pending tasks! You're all caught up.
                </p>
              </div>
            )}

            {hasNextPage && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
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

// Completed Tasks Card (with droppable zone)
const CompletedTasksCard = ({
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
      <div className="flex items-center gap-3 p-4 bg-[#F6F4EE] border border-[#D9D9D9]">
        <div className="font-semibold w-8  h-8 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
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
          sortedCompletedDates.map((date, idx) => (
            <div key={date} className="space-y-2">
              <h3 className={`font-semibold text-muted-foreground mb-2 mt-3 ${idx === 0 ? 'first:mt-0' : ''}`}>
                {getCompletionDateLabel(date)}
              </h3>
              {groupedCompletedTodos[date].map((todo) => (
                <CompletedTodoItem
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

const TodoItem = ({
  todo,
  toggleTodo,
  deleteTodo,
  handlePlayTask,
  setPauseTaskId,
  setIsPauseModalOpen,
  handleEditTodo,
  handleConvertTodo,
  handleFlagTodo,
  refetch,
}) => {
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  // Make this todo item draggable
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `todo-${todo.id}`,
    data: { todoId: todo.id, priority: todo.priority, status: todo.status }
  });

  const handleTaskClick = () => {
    if (todo.task_management_id) {
      // Navigate to task details page
      navigate(`/vas/tasks/${todo.task_management_id}`);
    }
  };

  // Check if task is started from the nested task_management object
  const isTaskStarted = todo.task_management?.is_started || false;
  const isCompleted = todo.status === "completed";

  // Get background color based on priority
  const getPriorityBgColor = () => {
    // If flagged, use flagged styling
    // if (todo.is_flagged) {
    //   return 'bg-orange-100 border-l-4 border-orange-500';
    // }

    const priority = todo.priority || '';

    switch (priority) {
      case 'P1':
        return 'border-l-4 border-l-red-500';
      case 'P2':
        return 'border-l-4 border-l-green-500';
      case 'P3':
        return 'border-l-4 border-l-yellow-500';
      case 'P4':
        return 'border-l-4 border-l-blue-500';
      default:
        return 'border-l-4 border-l-gray-400';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors group mb-2 border ${getPriorityBgColor()} ${isDragging ? 'opacity-50 ring-2 ring-blue-400' : ''}`}
    >
      <div className="flex items-center gap-1">
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
            handleConvertTodo(todo);
          }}
          className="flex-shrink-0 p-1 text-gray-600 hover:text-primary transition-colors disabled:opacity-50"
          title="Convert to Task"
          disabled={!!todo.task_management_id}
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
          <Focus
            size={14}
            color={todo.is_flagged ? "#fa0202" : "#4b5563"}
          />
        </button>
      </div>

      <div
        {...listeners}
        {...attributes}
        className="flex flex-col flex-1 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground">
            {todo.task_management_id && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskClick();
                }}
                className="text-sm font-semibold text-[#c72030] cursor-pointer hover:underline"
              >
                T-{todo.task_management_id}
              </span>
            )} {todo.title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {
            todo.created_by !== todo.user && (
              <>
                <span className="text-xs text-muted-foreground">
                  Assigned By : {todo.created_by}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
              </>
            )
          }
          <span className="text-xs text-muted-foreground">
            {todo.user}
          </span>
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

      {/* Time Left and Active Timer for tasks only */}
      {todo.task_management_id && (
        <div className="flex flex-col items-end gap-1 text-[12px] min-w-max">
          {/* Time Left */}
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-600 font-medium">
              Time Left:
            </span>
            <CountdownTimer
              startDate={todo.task_management?.expected_start_date}
              targetDate={todo.target_date}
            />
          </div>

          {/* Active Timer */}
          {isTaskStarted && (
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-600 font-medium">
                Started:
              </span>
              <ActiveTimer
                activeTimeTillNow={todo.task_management?.active_time_till_now}
                isStarted={isTaskStarted}
              />
            </div>
          )}
        </div>
      )}

      {/* Play/Pause buttons for tasks converted from task management */}
      {todo.task_management_id &&
        (isTaskStarted ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPauseTaskId(todo.task_management_id);
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
              handlePlayTask(todo.task_management_id);
            }}
            disabled={isCompleted}
            className="p-1 hover:bg-gray-200 rounded transition disabled:opacity-50"
            title="Play task"
          >
            <Play size={16} className="text-green-500" />
          </button>
        ))}

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleTodo(todo.id);
        }}
        className="flex-shrink-0 w-4 h-4 border-2 border-primary flex items-center justify-center"
      >
        <Check
          size={16}
          className="text-primary opacity-0 group-hover:opacity-100"
        />
      </button>
    </div>
  );
};

// ----------------------------------------------
// Completed Todo Item Component
// ----------------------------------------------
const CompletedTodoItem = ({ todo, toggleTodo }) => {
  const navigate = useNavigate();

  const getPriorityBgColor = () => {
    // If flagged, use flagged styling
    // if (todo.is_flagged) {
    //   return 'bg-orange-100 border-l-4 border-orange-500';
    // }

    const priority = todo.priority || '';

    switch (priority) {
      case 'P1':
        return 'border-l-4 border-l-red-500';
      case 'P2':
        return 'border-l-4 border-l-green-500';
      case 'P3':
        return 'border-l-4 border-l-yellow-500';
      case 'P4':
        return 'border-l-4 border-l-blue-500';
      default:
        return 'border-l-4 border-l-gray-400';
    }
  };

  const handleTaskClick = () => {
    if (todo.task_management_id) {
      navigate(`/vas/tasks/${todo.task_management_id}`);
    }
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors group mb-2 ${getPriorityBgColor()}`}>
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground">
            {todo.task_management_id && (
              <span
                onClick={handleTaskClick}
                className="text-sm font-semibold text-[#c72030] cursor-pointer hover:underline"
              >
                T-{todo.task_management_id}
              </span>
            )} {todo.title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {
            todo.created_by !== todo.user && (
              <>
                <span className="text-xs text-muted-foreground">
                  Assigned By : {todo.created_by}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
              </>
            )
          }
          <span className="text-xs text-muted-foreground">
            {todo.user}
          </span>
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
      <button
        onClick={() => toggleTodo(todo.id)}
        className="flex-shrink-0 w-4 h-4 !bg-[#c72030] !text-white flex items-center justify-center hover:opacity-90 transition-all"
      >
        <Check size={15} color="white" />
      </button>
    </div>
  );
};
