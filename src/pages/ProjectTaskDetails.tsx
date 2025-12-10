import { useEffect, useState, forwardRef, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, PencilIcon, Plus, ScrollText, Trash2, X, ChevronDownCircle } from "lucide-react";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useAppDispatch } from "@/store/hooks";
import { updateTaskStatus, fetchProjectTasksById } from "@/store/slices/projectTasksSlice";
import ProjectTaskEditModal from "@/components/ProjectTaskEditModal";
import SubtasksTable from "@/components/SubtasksTable";
import AddSubtaskModal from "@/components/AddSubtaskModal";
import DependencyKanban from "@/components/DependencyKanban";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

// Helper to get initials from name
const getInitials = (name: string): string => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase();
};

// Calculate duration with overdue detection
const calculateDuration = (start: string | undefined, end: string | undefined): { text: string; isOverdue: boolean } => {
  if (!start || !end) return { text: "N/A", isOverdue: false };

  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Set end date to end of the day
  endDate.setHours(23, 59, 59, 999);

  // Check if task hasn't started yet
  if (now < startDate) {
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

// Active Timer Component - shows when task is started
const ActiveTimer = ({ activeTimeTillNow, isStarted }: { activeTimeTillNow?: any; isStarted?: boolean }) => {
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (activeTimeTillNow) {
      setTime({
        hours: activeTimeTillNow.hours || 0,
        minutes: activeTimeTillNow.minutes || 0,
        seconds: activeTimeTillNow.seconds || 0,
      });
    }
  }, [activeTimeTillNow]);

  useEffect(() => {
    if (!isStarted) {
      return;
    }

    const interval = setInterval(() => {
      setTime((prevTime) => {
        let { hours, minutes, seconds } = prevTime;
        seconds += 1;

        if (seconds >= 60) {
          seconds = 0;
          minutes += 1;
        }
        if (minutes >= 60) {
          minutes = 0;
          hours += 1;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted]);

  return (
    <span className="text-[#029464] text-[12px]">
      {time.hours}h {time.minutes}m {time.seconds}s
    </span>
  );
};

// Countdown Timer Component
const CountdownTimer = ({ startDate, targetDate }: { startDate?: string; targetDate?: string }) => {
  const [countdown, setCountdown] = useState(calculateDuration(startDate, targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateDuration(startDate, targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, startDate]);

  const textColor = countdown.isOverdue ? "text-red-600" : "text-[#029464]";
  return <div className={`text-left ${textColor} text-[12px]`}>{countdown.text}</div>;
};

// Comments Component
const Comments = ({ comments, taskId }: { comments?: any[]; taskId?: string }) => {
  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    if (comment.trim()) {
      // TODO: Implement API call to add comment
      setComment("");
      toast.success("Comment added successfully");
    }
  };

  return (
    <div className="text-[14px] flex flex-col gap-4">
      <div className="flex justify-start gap-5">
        <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white text-center p-1.5">
          <span>U</span>
        </div>
        <div className="w-full">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add comment here..."
            className="w-full h-[70px] bg-[#F2F4F4] p-2 border-2 border-[#DFDFDF] rounded focus:outline-none resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={handleAddComment}
          className="bg-[#C72030] text-white px-4 py-2 rounded hover:bg-[#A01B29] transition"
        >
          Add Comment
        </button>
        <button
          onClick={() => setComment("")}
          className="border-2 border-[#C72030] text-[#C72030] px-4 py-2 rounded hover:bg-[#C72030] hover:text-white transition"
        >
          Cancel
        </button>
      </div>

      {comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((cmt: any, idx: number) => (
            <div key={idx} className="flex justify-start gap-5 border-b pb-4">
              <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white text-center p-1.5 flex-shrink-0">
                <span>{getInitials(cmt.commentor_full_name || "U")}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{cmt.commentor_full_name || "Unknown"}</h4>
                <p className="text-sm text-gray-700 mt-1">{cmt.body || ""}</p>
                <span className="text-xs text-gray-500">{formatToDDMMYYYY_AMPM(cmt.created_at || "")}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No comments available</div>
      )}
    </div>
  );
};

// Attachments Component
const Attachments = ({ attachments, taskId }: { attachments?: any[]; taskId?: string }) => {
  const [files, setFiles] = useState<any[]>(attachments || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      // TODO: Implement file upload API
      toast.success("File upload started");
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles(files.filter((f) => f.file_name !== fileName));
    toast.success("File removed");
  };

  return (
    <div className="text-[14px] flex flex-col gap-4">
      <button
        onClick={handleAttachFile}
        className="bg-[#C72030] text-white px-4 py-2 rounded hover:bg-[#A01B29] transition w-fit"
      >
        Attach File
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {files && files.length > 0 ? (
        <div className="space-y-2">
          {files.map((file: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📎</span>
                <div>
                  <p className="font-medium text-sm">{file.file_name || "Unknown File"}</p>
                  <p className="text-xs text-gray-500">{file.created_at ? formatToDDMMYYYY_AMPM(file.created_at) : ""}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFile(file.file_name || "")}
                className="text-red-600 hover:text-red-800 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No attachments available</div>
      )}
    </div>
  );
};

// Activity Log Component
const ActivityLog = ({ taskStatusLogs }: { taskStatusLogs?: any[] }) => {
  const formatTimestamp = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day} ${month} ${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  const getActionFromStatus = (status: string) => {
    if (!status) return "updated the task";
    return `marked as ${status}`;
  };

  return (
    <div className="overflow-x-auto w-full bg-[rgba(247, 247, 247, 0.51)] shadow rounded-lg mt-3 px-4">
      <div className="flex items-center p-2 gap-5 text-[12px] my-3 overflow-x-auto">
        {taskStatusLogs && taskStatusLogs.length > 0 ? (
          taskStatusLogs.map((log: any, index: number) => (
            <div key={index} className="flex flex-col gap-2 min-w-[150px]">
              <span>
                <i>
                  {log.created_by_name || "Unknown"} <span className="text-[#C72030]">{getActionFromStatus(log.status)}</span> task
                </i>
              </span>
              <span>
                <i>{formatTimestamp(log.created_at)}</i>
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 w-full text-gray-500">No activity logs available</div>
        )}
      </div>
    </div>
  );
};

// Workflow Status Component
const WorkflowStatusLog = ({ taskStatusLogs }: { taskStatusLogs?: any[] }) => {
  const formatTimestamp = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day} ${month} ${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex flex-col gap-4">
      {taskStatusLogs && taskStatusLogs.length > 0 ? (
        <div className="space-y-3">
          {taskStatusLogs.map((log: any, idx: number) => (
            <div key={idx} className="flex items-start gap-4 p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex-1">
                <p className="font-medium text-sm">{log.workflow_status || "Unknown Status"}</p>
                <p className="text-xs text-gray-600 mt-1">Changed by: {log.created_by_name || "Unknown"}</p>
                <p className="text-xs text-gray-500 mt-1">{formatTimestamp(log.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No workflow status logs available</div>
      )}
    </div>
  );
};

interface TaskDetails {
  id?: string;
  title?: string;
  description?: string;
  created_by?: string;
  created_on?: string;
  status?: string;
  responsible_person_name?: string;
  priority?: string;
  expected_start_date?: string;
  target_date?: string;
  allocation_date?: string;
  estimated_hour?: number;
  project_title?: string;
  milestone_title?: string;
  observers?: Array<{ user_name: string }>;
  task_tags?: Array<{ company_tag?: { name: string }; name?: string }>;
  workflow_status?: string;
  predecessor_task_ids?: number[];
  successor_task_ids?: number[];
}

export interface Subtask {
  id?: string;
  subtask_title?: string;
  status?: string;
  responsible_person?: string;
  start_date?: string;
  end_date?: string;
  duration?: string;
  priority?: string;
  tags?: string;
}

function formatToDDMMYYYY_AMPM(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = Number(String(hours).padStart(2, "0"));
  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

const STATUS_COLORS = {
  active: "bg-[#E4636A] text-white",
  "in_progress": "bg-[#08AEEA] text-white",
  "on_hold": "bg-[#7BD2B5] text-black",
  overdue: "bg-[#FF2733] text-white",
  completed: "bg-[#83D17A] text-black",
};

const mapStatusToDisplay = (rawStatus) => {
  const statusMap = {
    open: "Open",
    in_progress: "In Progress",
    on_hold: "On Hold",
    overdue: "Overdue",
    completed: "Completed",
  };
  return statusMap[rawStatus?.toLowerCase()] || "Open";
};

const mapDisplayToApiStatus = (displayStatus) => {
  const reverseStatusMap = {
    Active: "active",
    "In Progress": "in_progress",
    "On Hold": "on_hold",
    Overdue: "overdue",
    Completed: "completed",
  };
  return reverseStatusMap[displayStatus] || "open";
};

export const ProjectTaskDetails = () => {
  const navigate = useNavigate();
  const { id, mid, taskId } = useParams<{ id: string; mid: string; taskId: string }>();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const dropdownRef = useRef(null);

  const [taskDetails, setTaskDetails] = useState<TaskDetails>({});
  const [activeTab, setActiveTab] = useState("subtasks");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Open");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [openSubTaskModal, setOpenSubTaskModal] = useState(false);
  const [isFirstCollapsed, setIsFirstCollapsed] = useState(false);
  const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
  const [dependentTasks, setDependentTasks] = useState<any[]>([]);

  const firstContentRef = useRef<HTMLDivElement>(null);
  const secondContentRef = useRef<HTMLDivElement>(null);

  const fetchDependentTasks = async (taskData: TaskDetails) => {
    try {
      const dependencyIds = [
        ...(taskData.predecessor_task_ids || []),
        ...(taskData.successor_task_ids || []),
      ];

      if (dependencyIds.length === 0) {
        setDependentTasks([]);
        return;
      }

      // Fetch details for each dependent task
      const taskPromises = dependencyIds.map((depId) =>
        dispatch(fetchProjectTasksById({ baseUrl, token, id: depId.toString() }))
          .unwrap()
          .catch(() => null)
      );

      const resolvedTasks = await Promise.all(taskPromises);
      const validTasks = resolvedTasks.filter(Boolean);
      setDependentTasks(validTasks);
    } catch (error) {
      console.log("Error fetching dependent tasks:", error);
      setDependentTasks([]);
    }
  };

  const fetchData = async () => {
    try {
      const response = await dispatch(fetchProjectTasksById({ baseUrl, token, id: taskId })).unwrap();
      setTaskDetails(response);
      setSelectedOption(mapStatusToDisplay(response.status) || "Open");
      setSubtasks(response.sub_tasks_managements || []);

      // Fetch dependent tasks
      await fetchDependentTasks(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load task details";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  function formatToDDMMYYYY(dateString: string) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const tabs = [
    { id: "subtasks", label: "Subtasks" },
    { id: "dependency", label: "Dependency" },
    { id: "comments", label: "Comments" },
    { id: "attachments", label: "Attachments" },
    { id: "project_drive", label: "Project Drive" },
    { id: "activity_log", label: "Activity Log" },
    { id: "workflow_status_log", label: "Workflow Status Log" },
  ];

  const dropdownOptions = ["Open", "In Progress", "On Hold", "Overdue", "Completed"];

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    setOpenDropdown(false);

    await dispatch(
      updateTaskStatus({
        baseUrl,
        token,
        id: taskId,
        data: {
          status: mapDisplayToApiStatus(option)
        },
      })
    ).unwrap();
    toast.dismiss();
    toast.success("Status updated successfully");
  };

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    // Refresh task details after edit
    fetchData();
  };

  const toggleFirstCollapse = () => {
    setIsFirstCollapsed(!isFirstCollapsed);
    if (firstContentRef.current) {
      const content = firstContentRef.current;
      if (!isFirstCollapsed) {
        content.style.maxHeight = "0px";
        content.style.overflow = "hidden";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.overflow = "visible";
      }
    }
  };

  const toggleSecondCollapse = () => {
    setIsSecondCollapsed(!isSecondCollapsed);
    if (secondContentRef.current) {
      const content = secondContentRef.current;
      if (!isSecondCollapsed) {
        content.style.maxHeight = "0px";
        content.style.overflow = "hidden";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.overflow = "visible";
      }
    }
  };

  return (
    <div className="my-4 m-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="p-0"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <div className="pt-1">
        <h2 className="text-[15px] p-3 px-0">
          <span className="mr-3 text-[#C72030]">Task-{taskDetails.id}</span>
          <span>{taskDetails.title}</span>
        </h2>
        <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
        <div className="flex items-center justify-between my-3 text-[12px]">
          <div className="flex items-center gap-3 text-[#323232]">
            <span>Created By: {typeof taskDetails?.created_by === 'string' ? taskDetails.created_by : (taskDetails?.created_by as any)?.name}</span>
            <span className="h-6 w-[1px] border border-gray-300"></span>
            <span className="flex items-center gap-3">
              Created On: {formatToDDMMYYYY_AMPM(taskDetails.created_on || "")}
            </span>
            <span className="h-6 w-[1px] border border-gray-300"></span>
            <span className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md text-sm ${STATUS_COLORS[mapDisplayToApiStatus(selectedOption).toLowerCase()] || "bg-gray-400 text-white"}`}>
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center gap-1 cursor-pointer px-2 py-1"
                  onClick={() => setOpenDropdown(!openDropdown)}
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown}
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setOpenDropdown(!openDropdown)
                  }
                >
                  <span className="text-[13px]">{selectedOption}</span>
                  <ChevronDown
                    size={15}
                    className={`${openDropdown ? "rotate-180" : ""
                      } transition-transform`}
                  />
                </div>
                <ul
                  className={`dropdown-menu absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden ${openDropdown ? "block" : "hidden"
                    }`}
                  role="menu"
                  style={{
                    minWidth: "150px",
                    maxHeight: "400px",
                    overflowY: "auto",
                    zIndex: 1000,
                  }}
                >
                  {dropdownOptions.map((option, idx) => (
                    <li key={idx} role="menuitem">
                      <button
                        className={`dropdown-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 ${selectedOption === option
                          ? "bg-gray-100 font-semibold"
                          : ""
                          }`}
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </span>
            <span className="h-6 w-[1px] border border-gray-300"></span>
            <span className="cursor-pointer flex items-center gap-1">
              <ActiveTimer
                activeTimeTillNow={(taskDetails as any)?.active_time_till_now}
                isStarted={(taskDetails as any)?.is_started}
              />
            </span>
            <span className="h-6 w-[1px] border border-gray-300"></span>
            <span
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setOpenEditModal(true)}
            >
              <PencilIcon size={15} />
              <span>Edit Task</span>
            </span>
            <span className="h-6 w-[1px] border border-gray-300"></span>
            <span
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setOpenSubTaskModal(true)}
            >
              <Plus size={15} />
              <span>Add Subtask</span>
            </span>
          </div>
        </div>
        <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6 mt-4">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <ChevronDownCircle
            color="#E95420"
            size={30}
            className={`${isFirstCollapsed ? "rotate-180" : "rotate-0"} transition-transform cursor-pointer`}
            onClick={toggleFirstCollapse}
          />
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Description</h3>
        </div>

        <div className="mt-4 overflow-hidden" ref={firstContentRef}>
          <p className="text-sm text-gray-900">{taskDetails.description}</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <ChevronDownCircle
            color="#E95420"
            size={30}
            className={`${isSecondCollapsed ? "rotate-180" : "rotate-0"} transition-transform cursor-pointer`}
            onClick={toggleSecondCollapse}
          />
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Details</h3>
        </div>

        {/* Collapsed View Summary */}
        {isSecondCollapsed && (
          <div className="flex items-center gap-6 mt-4 flex-wrap text-[12px]">
            <div className="flex items-center justify-start gap-3">
              <div className="text-right font-[500]">Responsible Person:</div>
              <div className="text-left">{taskDetails.responsible_person_name || "-"}</div>
            </div>
            <div className="flex items-center justify-start gap-3">
              <div className="text-right font-[500]">Priority:</div>
              <div className="text-left">{taskDetails.priority || "-"}</div>
            </div>
            <div className="flex items-center justify-start gap-3">
              <div className="text-right font-[500]">End Date:</div>
              <div className="text-left">{formatToDDMMYYYY(taskDetails.target_date || "")}</div>
            </div>
            <div className="flex items-center justify-start gap-3">
              <div className="text-right font-[500]">Efforts Duration:</div>
              <div className="text-left">{taskDetails.estimated_hour || 0} hours</div>
            </div>
          </div>
        )}

        {/* Expanded View */}
        <div
          className={`mt-3 ${isSecondCollapsed ? "overflow-hidden" : ""}`}
          ref={secondContentRef}
        >
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">Responsible Person:</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{taskDetails.responsible_person_name || "-"}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">Priority:</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{taskDetails.priority || "-"}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">Start Date:</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{formatToDDMMYYYY(taskDetails.expected_start_date || "")}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">MileStones:</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{taskDetails.milestone_title || "-"}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">End Date:</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{formatToDDMMYYYY(taskDetails.target_date || "")}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">Tags:</p>
                </div>
                <div className="flex-1">
                  <div className="flex gap-2 flex-wrap">
                    {taskDetails.task_tags && taskDetails.task_tags.length > 0 ? (
                      taskDetails.task_tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#c72030] text-white rounded-full text-xs font-medium"
                        >
                          {tag?.company_tag?.name || tag.name || "Unknown"}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-900">-</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">Efforts Duration:</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{taskDetails.estimated_hour || 0} hours</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">Observer:</p>
                </div>
                <div className="flex-1">
                  {taskDetails.observers && taskDetails.observers.length > 0 ? (
                    <TooltipProvider>
                      <div className="flex gap-2">
                        {taskDetails.observers.map((observer, idx) => (
                          <Tooltip key={idx}>
                            <TooltipTrigger asChild>
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#C72030] text-white text-xs font-medium cursor-default">
                                {getInitials(observer.user_name)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-sm">
                              {observer.user_name}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </TooltipProvider>
                  ) : (
                    <p className="text-sm text-gray-900">-</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">
                    {calculateDuration(taskDetails.expected_start_date, taskDetails.target_date).isOverdue
                      ? "Overdued Time:"
                      : "Time Left:"}
                  </p>
                </div>
                <div className="flex-1">
                  <CountdownTimer startDate={taskDetails.expected_start_date} targetDate={taskDetails.target_date} />
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">Workflow Status:</p>
                </div>
                <div className="flex-1">
                  <Select defaultValue={taskDetails.workflow_status?.toLowerCase()}>
                    <SelectTrigger className="w-[180px] h-9 bg-[#C72030] text-white border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddSubtaskModal openTaskModal={openSubTaskModal} setOpenTaskModal={setOpenSubTaskModal} />

      {/* Tabs Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                  ? "border-[#C72030] text-[#C72030]"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Subtasks Tab */}
          {activeTab === "subtasks" && (
            <SubtasksTable subtasks={subtasks} fetchData={fetchData} />
          )}

          {/* Dependency Tab */}
          {activeTab === "dependency" && (
            <DependencyKanban
              taskId={taskId}
              dependencies={dependentTasks}
              onDependenciesChange={fetchData}
            />
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <Comments comments={(taskDetails as any)?.comments} taskId={taskId} />
          )}

          {/* Attachments Tab */}
          {activeTab === "attachments" && (
            <Attachments attachments={(taskDetails as any)?.attachments} taskId={taskId} />
          )}

          {/* Project Drive Tab */}
          {activeTab === "project_drive" && (
            <div className="text-center py-8 text-gray-500">
              No project drive items available
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === "activity_log" && (
            <ActivityLog taskStatusLogs={(taskDetails as any)?.task_status_logs} />
          )}

          {/* Workflow Status Log Tab */}
          {activeTab === "workflow_status_log" && (
            <WorkflowStatusLog taskStatusLogs={(taskDetails as any)?.workflow_status_logs} />
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        TransitionComponent={Transition}
        maxWidth={false}
      >
        <DialogContent
          className="w-1/2 fixed right-0 top-0 rounded-none bg-[#fff] text-sm overflow-y-auto"
          style={{ margin: 0, maxHeight: "100vh", display: "flex", flexDirection: "column" }}
          sx={{
            padding: "0 !important",
            "& .MuiDialogContent-root": {
              padding: "0 !important",
              overflow: "auto",
            }
          }}
        >
          <div className="sticky top-0 bg-white z-10">
            <h3 className="text-[14px] font-medium text-center mt-8">Edit Project Task</h3>
            <X
              className="absolute top-[26px] right-8 cursor-pointer w-4 h-4"
              onClick={handleCloseEditModal}
            />
            <hr className="border border-[#E95420] mt-4" />
          </div>

          <div className="flex-1 overflow-y-auto">
            <ProjectTaskEditModal
              taskId={taskId}
              onCloseModal={handleCloseEditModal}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTaskDetails;
