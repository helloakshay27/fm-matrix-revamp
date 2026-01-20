import { useEffect, useState } from "react";
import { Plus, Check, Play, Pause, Pencil, RefreshCw } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddToDoModal from "@/components/AddToDoModal";
import TodoConvertModal from "@/components/TodoConvertModal";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";
import { toast } from "sonner";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";

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

export default function Todo() {
  const { setCurrentSection } = useLayout();

  const view = localStorage.getItem("selectedView");

  useEffect(() => {
    setCurrentSection(
      view === "admin" ? "Value Added Services" : "Project Task"
    );
  }, [setCurrentSection]);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [pauseTaskId, setPauseTaskId] = useState<number | null>(null);
  const [isPauseLoading, setIsPauseLoading] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [convertTodoData, setConvertTodoData] = useState(null);
  const [convertTodoId, setConvertTodoId] = useState(null);

  const getTodos = async () => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/todos.json`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTodos(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const toggleTodo = async (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? { ...todo, status: todo.status === "open" ? "completed" : "open" }
        : todo
    );

    setTodos(updatedTodos);

    const updatedTodo = updatedTodos.find((t) => t.id === id);

    try {
      await axios.put(
        `https://${baseUrl}/todos/${id}.json`,
        {
          todo: {
            status: updatedTodo.status,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
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
      getTodos(); // Refresh todos to get updated task status
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
      getTodos();
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

  // ------------------------------
  // DATE GROUPING
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
        <div className="flex items-center justify-end">
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
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-[#c72030] rounded-full" />
              <h2 className="text-2xl font-bold text-foreground">TO DO</h2>
              <span className="ml-auto bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                {pendingTodos.length}
              </span>
            </div>

            <div className="flex-1 bg-white rounded-lg border border-border shadow-sm p-4 space-y-6 min-h-96 overflow-auto">
              {/* Overdue */}
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
                    />
                  ))}
                </div>
              )}

              {/* Today */}
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
                    />
                  ))}
                </div>
              )}

              {/* Upcoming */}
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
                    />
                  ))}
                </div>
              )}

              {/* No Target Date */}
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
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {pendingTodos.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground text-center">
                    No pending tasks! You're all caught up.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ------------------------------------
                        Completed Section
                    ------------------------------------ */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-green-600 rounded-full" />
              <h2 className="text-2xl font-bold text-foreground">Completed</h2>
              <span className="ml-auto bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                {completedTodos.length}
              </span>
            </div>

            <div className="flex-1 bg-white rounded-lg border border-border shadow-sm p-4 space-y-2 min-h-96 overflow-auto">
              {completedTodos.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground text-center">
                    Complete tasks to see them here.
                  </p>
                </div>
              ) : (
                completedTodos.map((todo) => (
                  <CompletedTodoItem
                    key={todo.id}
                    todo={todo}
                    toggleTodo={toggleTodo}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {isAddTodoModalOpen && (
        <AddToDoModal
          isModalOpen={isAddTodoModalOpen}
          setIsModalOpen={handleCloseModal}
          getTodos={getTodos}
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
            getTodos();
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
}) => {
  const navigate = useNavigate();

  const handleTaskClick = () => {
    if (todo.task_management_id) {
      // Navigate to task details page
      navigate(`/vas/tasks/${todo.task_management_id}`);
    }
  };

  // Check if task is started from the nested task_management object
  const isTaskStarted = todo.task_management?.is_started || false;
  const isCompleted = todo.status === "completed";

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group">
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleEditTodo(todo)}
          className="flex-shrink-0 p-1 text-gray-600 hover:text-primary transition-colors"
          title="Edit todo"
        >
          <Pencil size={14} />
        </button>
        {!todo.task_management_id && (
          <button
            onClick={() => handleConvertTodo(todo)}
            className="flex-shrink-0 p-1 text-gray-600 hover:text-primary transition-colors"
            title="Convert to Task"
          >
            <RefreshCw size={14} />
          </button>
        )}
        <button
          onClick={() => toggleTodo(todo.id)}
          className="flex-shrink-0 w-4 h-4 border-2 border-primary flex items-center justify-center"
        >
          <Check
            size={16}
            className="text-primary opacity-0 group-hover:opacity-100"
          />
        </button>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2">
          {todo.task_management_id && (
            <span
              onClick={handleTaskClick}
              className="text-sm font-semibold text-[#c72030] cursor-pointer hover:underline"
            >
              T-{todo.task_management_id}
            </span>
          )}
          <span className="text-base text-foreground">{todo.title}</span>
        </div>
        {todo.target_date && (
          <span className="text-xs text-muted-foreground">
            Due: {todo.target_date}
          </span>
        )}
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

      {/* <button
                onClick={() => deleteTodo(todo.id)}
                className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
            >
                <Trash2 size={18} />
            </button> */}
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
    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors group">
      <button
        onClick={() => toggleTodo(todo.id)}
        className="flex-shrink-0 w-5 h-5 bg-accent flex items-center justify-center hover:opacity-90 transition-all"
      >
        <Check size={16} className="text-accent-foreground" />
      </button>
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2">
          {todo.task_management_id && (
            <span
              onClick={handleTaskClick}
              className="text-sm font-semibold text-[#c72030] cursor-pointer hover:underline"
            >
              T-{todo.task_management_id}
            </span>
          )}
          <span className="text-base text-foreground">{todo.title}</span>
        </div>
        {todo.target_date && (
          <span className="text-xs text-muted-foreground">
            Due: {todo.target_date}
          </span>
        )}
      </div>
    </div>
  );
};
