import { useEffect, useState } from "react";
import { Plus, Check, Play, Pause, Pencil, RefreshCw, ArrowRightLeft, Focus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddToDoModal from "@/components/AddToDoModal";
import TodoConvertModal from "@/components/TodoConvertModal";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";
import { toast } from "sonner";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";
import { Switch } from "@mui/material";
import { Card, CardContent } from "@/components/ui/card";
import MuiMultiSelect from "@/components/MuiMultiSelect";
import EisenhowerMatrix from "@/components/EisenhowerMatrix";
import { useTodos, useToggleTodo } from "@/hooks/useTodos";

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

  // Use toggle mutation hook for better cache management
  const toggleMutation = useToggleTodo();

  const handleMultiSelectChange = (name, selectedOptions) => {
    if (name === "members") {
      setSelectedUsers(selectedOptions);
    }
  };

  const toggleTodo = async (id: number | string) => {
    const todo = todos.find(t => t.id === id);
    const isCompleted = todo?.status === "open";

    try {
      await toggleMutation.mutateAsync({
        id,
        completed: isCompleted,
      });
      toast.success("Task updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task");
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

  const pendingTodos = todos.filter((t) => t.status !== "completed");
  const completedTodos = todos.filter((t) => t.status === "completed");

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

  return (
    <div className="p-6">
      <div className="space-y-4">
        {/* Eisenhower Matrix */}
        <EisenhowerMatrix dashboardData={dashboardData} />

        <div className="flex items-center justify-end gap-3">
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
          {
            taskType === "all" && (
              <div className="w-full max-w-[24rem]">
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
          <Button
            onClick={() => setIsAddTodoModalOpen(true)}
            className="text-[12px] flex items-center justify-center gap-1 bg-red text-white px-3 py-2 w-max"
          >
            <Plus size={18} />
            Add To-Do
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ------------------------------------
                        Pending Tasks Section
                    ------------------------------------ */}
          <Card className="shadow-sm border border-border">
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
                          refetch={refetch}
                        />
                      ))}
                    </div>
                  )}

                  {noDateTodos.length > 0 && (
                    <div>
                      <h3 className="text-gray-500 font-semibold mb-2">
                        No Target Date
                      </h3>
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

          {/* ------------------------------------
                        Completed Section
                    ------------------------------------ */}
          <Card className="shadow-sm border border-border">
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
                sortedCompletedDates.map((date) => (
                  <div key={date} className="space-y-2">
                    <h3 className="font-semibold text-muted-foreground mb-2">
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
    </div>
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
      <div className="bg-white rounded-lg shadow-lg p-6 w-[30rem]">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Reason for Pause
        </h2>

        <div className="mb-6">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for pausing this task..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            rows={4}
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Pause Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------
// Separate Todo Item Component (Cleaner UI)
// ----------------------------------------------
const TodoItem = ({
  todo,
  toggleTodo,
  deleteTodo,
  handlePlayTask,
  setPauseTaskId,
  setIsPauseModalOpen,
  handleEditTodo,
  handleConvertTodo,
  refetch,
}) => {
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const handleTaskClick = () => {
    if (todo.task_management_id) {
      // Navigate to task details page
      navigate(`/vas/tasks/${todo.task_management_id}`);
    }
  };

  const handleFlagTodo = async () => {
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
        newFlaggedStatus ? "Todo flagged for focus" : "Todo unflagged"
      );
      refetch();
    } catch (error) {
      console.error("Failed to flag todo:", error);
      toast.error("Failed to update focus status");
    }
  };

  // Check if task is started from the nested task_management object
  const isTaskStarted = todo.task_management?.is_started || false;
  const isCompleted = todo.status === "completed";

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors group mb-2 ${todo.is_flagged
      ? 'bg-red-50 border-l-4 border-red-500'
      : 'bg-[rgba(213,219,219,0.7)]'
      }`}>
      <div className="flex items-center gap-1">
        <button
          onClick={() => toggleTodo(todo.id)}
          className="flex-shrink-0 w-4 h-4 border-2 border-primary flex items-center justify-center"
        >
          <Check
            size={16}
            className="text-primary opacity-0 group-hover:opacity-100"
          />
        </button>
        <button
          onClick={() => handleEditTodo(todo)}
          className="flex-shrink-0 p-1 text-gray-600 hover:text-primary transition-colors"
          title="Edit todo"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => handleConvertTodo(todo)}
          className="flex-shrink-0 p-1 text-gray-600 hover:text-primary transition-colors disabled:opacity-50"
          title="Convert to Task"
          disabled={!!todo.task_management_id}
        >
          <ArrowRightLeft size={14} />
        </button>
      </div>

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
            onClick={() => {
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
            onClick={() => handlePlayTask(todo.task_management_id)}
            disabled={isCompleted}
            className="p-1 hover:bg-gray-200 rounded transition disabled:opacity-50"
            title="Play task"
          >
            <Play size={16} className="text-green-500" />
          </button>
        ))}

      {/* Focus button */}
      <button
        onClick={handleFlagTodo}
        disabled={isCompleted}
        className="p-1 hover:bg-gray-200 rounded transition disabled:opacity-50"
        title={todo.is_flagged ? "Remove from focus" : "Add to focus"}
      >
        <Focus
          size={16}
          className={todo.is_flagged ? "text-red-600" : "text-gray-400"}
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

  const handleTaskClick = () => {
    if (todo.task_management_id) {
      navigate(`/vas/tasks/${todo.task_management_id}`);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(213,219,219,0.7)] transition-colors group mb-2">
      <button
        onClick={() => toggleTodo(todo.id)}
        className="flex-shrink-0 w-5 h-5 bg-accent flex items-center justify-center hover:opacity-90 transition-all"
      >
        <Check size={16} className="text-accent-foreground" />
      </button>
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
    </div>
  );
};
