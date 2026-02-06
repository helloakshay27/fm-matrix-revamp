import { useEffect, useState, forwardRef, useRef, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronDown,
  PencilIcon,
  Plus,
  Trash2,
  X,
  ChevronDownCircle,
  CircleCheckBig,
  Mic,
  MicOff,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { Mention, MentionsInput } from "react-mentions";
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
import {
  Dialog,
  DialogContent,
  FormControl,
  MenuItem,
  Slide,
  Select as MuiSelect,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useAppDispatch } from "@/store/hooks";
import {
  updateTaskStatus,
  fetchProjectTasksById,
  editProjectTask,
} from "@/store/slices/projectTasksSlice";
import ProjectTaskEditModal from "@/components/ProjectTaskEditModal";
import SubtasksTable from "@/components/SubtasksTable";
import AddSubtaskModal from "@/components/AddSubtaskModal";
import DependencyKanban from "@/components/DependencyKanban";
import { fetchProjectStatuses } from "@/store/slices/projectStatusSlice";
import { useLayout } from "@/contexts/LayoutContext";

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

// Helper to sort comments newest-first by created_at
const sortCommentsDesc = (arr: any[] | undefined) => {
  if (!Array.isArray(arr)) return [];
  const time = (c: any) => {
    const t = c?.created_at || c?.createdAt || c?.created || null;
    const parsed = t ? Date.parse(t) : NaN;
    return Number.isNaN(parsed) ? 0 : parsed;
  };
  return [...arr].sort((a, b) => time(b) - time(a));
};

// Calculate duration with overdue detection
const calculateDuration = (
  start: string | undefined,
  end: string | undefined
): { text: string; isOverdue: boolean } => {
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
export const ActiveTimer = ({ activeTimeTillNow, isStarted }) => {
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (activeTimeTillNow) {
      setTime({
        hours: activeTimeTillNow.hours,
        minutes: activeTimeTillNow.minutes,
        seconds: activeTimeTillNow.seconds,
      });
    }
  }, [activeTimeTillNow]);

  useEffect(() => {
    // Only run timer if task is started
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
    <div className="text-left text-[12px] text-green-600 font-medium">
      {String(time.hours).padStart(2, "0")}h{" "}
      {String(time.minutes).padStart(2, "0")}m{" "}
      {String(time.seconds).padStart(2, "0")}s
    </div>
  );
};

// Countdown Timer Component
const CountdownTimer = ({
  startDate,
  targetDate,
}: {
  startDate?: string;
  targetDate?: string;
}) => {
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

// Comments Component
const Comments = ({
  comments,
  taskId,
  getTask,
}: {
  comments?: any[];
  taskId?: string;
  getTask?: () => void;
}) => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const dispatch = useAppDispatch();

  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const textareaRef = useRef<any>(null);

  const { isListening, activeId, transcript, supported, startListening, stopListening } = useSpeechToText();
  const fieldId = "task-comment-input";
  const isActive = isListening && activeId === fieldId;

  // Update comment state when transcript changes
  useEffect(() => {
    if (isActive && transcript) {
      setComment(transcript);
    }
  }, [isActive, transcript]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isActive) {
      stopListening();
    } else {
      startListening(fieldId);
    }
  };

  // Local comments state so we can optimistically prepend new comments and show newest-first
  const [localComments, setLocalComments] = useState<any[]>(
    sortCommentsDesc(comments || [])
  );

  // Mock data for mentions - replace with actual API calls if needed
  const [mentionUsers, setMentionUsers] = useState<any[]>([]);
  const [mentionTags, setMentionTags] = useState<any[]>([]);

  // keep localComments in sync if parent comments prop changes
  useEffect(() => {
    setLocalComments(sortCommentsDesc(comments || []));
  }, [comments]);

  // Handle updates for editing transcripts
  useEffect(() => {
    if (isListening && activeId?.startsWith("edit-comment-") && transcript) {
      setEditedCommentText(transcript);
    }
  }, [isListening, activeId, transcript]);

  const fetchMentionUsers = async () => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMentionUsers(response.data.users || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMentionTags = async () => {
    try {
      const response = await axios.get(`https://${baseUrl}/company_tags.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMentionTags(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMentionUsers();
    fetchMentionTags();
  }, []);

  const mentionData =
    mentionUsers.length > 0
      ? mentionUsers.map((user: any) => ({
        id: user.id?.toString() || user.user_id?.toString(),
        display: user.full_name || user.name || "Unknown User",
      }))
      : [];

  const tagData =
    mentionTags.length > 0
      ? mentionTags.map((tag: any) => ({
        id: tag.id?.toString(),
        display: tag.name,
      }))
      : [];

  const handleAddComment = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!comment?.trim()) {
      toast.error("Comment cannot be empty", { duration: 1000 });
      return;
    }

    try {
      const payload = {
        comment: {
          body: comment,
          commentable_id: taskId,
          commentable_type: "TaskManagement",
          commentor_id: currentUser?.id,
          active: true,
        },
      };

      // Create comment on server and use response (if any) to prepend locally
      const resp = await axios.post(
        `https://${baseUrl}/comments.json`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newComment = resp?.data?.comment ||
        resp?.data || {
        id: Date.now().toString(),
        body: comment,
        commentor_full_name:
          `${currentUser?.firstname || ""} ${currentUser?.lastname || ""}`.trim(),
        created_at: new Date().toISOString(),
      };

      setLocalComments((prev) => [newComment, ...prev]);
      toast.success("Comment added successfully");
      setComment("");

      // Refresh parent if available
      if (getTask) {
        getTask();
      } else if (taskId) {
        await dispatch(
          fetchProjectTasksById({ baseUrl, token, id: taskId })
        ).unwrap();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleEdit = (cmt: any) => {
    setEditingCommentId(cmt.id);
    setEditedCommentText(cmt.body);
  };

  const handleEditSave = async () => {
    if (!editedCommentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const payload = {
        comment: {
          body: editedCommentText,
        },
      };

      // Update comment on server and use response to update local list
      const resp = await axios.put(
        `https://${baseUrl}/comments/${editingCommentId}.json`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updated = resp?.data?.comment || resp?.data;
      setLocalComments((prev) =>
        prev.map((c) => (c.id === editingCommentId ? updated : c))
      );

      toast.success("Comment updated successfully");
      setEditingCommentId(null);
      setEditedCommentText("");

      if (getTask) {
        getTask();
      } else if (taskId) {
        await dispatch(
          fetchProjectTasksById({ baseUrl, token, id: taskId })
        ).unwrap();
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await axios.delete(`https://${baseUrl}/comments/${commentId}.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // remove locally
      setLocalComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted successfully");
      if (getTask) {
        getTask();
      } else if (taskId) {
        await dispatch(
          fetchProjectTasksById({ baseUrl, token, id: taskId })
        ).unwrap();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const handleCancel = () => {
    setEditingCommentId(null);
    setComment("");
    setEditedCommentText("");
  };

  const mentionStyles = {
    control: {
      fontSize: 14,
      backgroundColor: "transparent",
      border: "none",
      outline: "none",
      padding: 0,
      margin: 0,
    },
    highlighter: { overflow: "hidden" },
    input: {
      font: "inherit",
      backgroundColor: "transparent",
      border: "none",
      padding: 0,
      margin: 0,
      outline: "none",
    },
    suggestions: {
      list: {
        backgroundColor: "white",
        border: "1px solid #ccc",
        fontSize: 14,
        zIndex: 100,
        maxHeight: "150px",
        overflowY: "auto" as const,
        borderRadius: "4px",
      },
      item: {
        padding: "5px 10px",
        borderBottom: "1px solid #eee",
        cursor: "pointer",
      },
      itemFocused: {
        backgroundColor: "#01569E",
        color: "white",
        fontWeight: "bold",
      },
    },
  };

  return (
    <div className="text-[14px] flex flex-col gap-2">
      <div className="flex justify-start m-2 gap-5">
        <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white text-center p-1.5">
          <span>
            {`${currentUser?.firstname?.charAt(0) || ""}${currentUser?.lastname?.charAt(0) || ""}`}
          </span>
        </div>
        <div className="relative w-[95%]">
          <MentionsInput
            inputRef={textareaRef}
            value={comment}
            onChange={(e, newValue) => setComment(newValue)}
            className="mentions w-full h-[70px] bg-[#F2F4F4] p-2 border-2 border-[#DFDFDF] focus:outline-none pr-10"
            placeholder="Add comment here. Type @ to mention users. Type # to mention tags"
            style={{
              control: {
                backgroundColor: "#F2F4F4",
                fontSize: 14,
                fontWeight: "normal",
              },
              highlighter: {
                overflow: "hidden",
              },
              input: {
                margin: 0,
                padding: "8px",
                outline: "none",
              },
              suggestions: {
                list: {
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  fontSize: 14,
                  zIndex: 100,
                  position: "absolute",
                  bottom: "100%",
                  left: 0,
                  width: "200px",
                  maxHeight: "150px",
                  overflowY: "auto",
                  borderRadius: "4px",
                  marginBottom: "4px",
                },
                item: {
                  padding: "5px 10px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                },
                itemFocused: {
                  backgroundColor: "#f5f5f5",
                },
              },
            }}
          >
            <Mention
              trigger="@"
              data={mentionData}
              markup="@[__display__](__id__)"
              displayTransform={(id, display) => `@${display} `}
              appendSpaceOnAdd
            />
            <Mention
              trigger="#"
              data={tagData}
              markup="#[__display__](__id__)"
              displayTransform={(id, display) => `#${display} `}
              appendSpaceOnAdd
            />
          </MentionsInput>
          {supported && (
            <button
              onClick={toggleListening}
              className={`absolute right-2 top-2 p-1 rounded-full transition-all ${isActive ? "bg-red-100 text-red-600 animate-pulse" : "text-gray-400 hover:bg-gray-200"
                }`}
              title={isActive ? "Stop recording" : "Start voice input"}
            >
              {isActive ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[#C72030] text-white h-[30px] px-3 cursor-pointer p-1 mr-2"
          onClick={handleAddComment}
        >
          Add Comment
        </button>
        <button
          className="border-2 border-[#C72030] h-[30px] cursor-pointer p-1 px-3"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>

      {localComments?.map((cmt: any) => {
        const isEditing = editingCommentId === cmt.id;
        return (
          <div key={cmt.id} className="relative flex justify-start m-2 gap-5">
            <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white text-center p-1.5">
              <span>
                {cmt?.commentor_full_name
                  ?.split(" ")
                  .map((n: string) => n.charAt(0))
                  .join("")}
              </span>
            </div>
            <div className="flex flex-col gap-2 w-full border-b-[2px] pb-3 border-[rgba(190, 190, 190, 1)]">
              <h1 className="font-bold">{cmt.commentor_full_name}</h1>

              {isEditing ? (
                <div className="relative w-full">
                  <MentionsInput
                    value={editedCommentText}
                    inputRef={(el: any) => {
                      if (el) {
                        const val = el.value;
                        el.focus();
                        el.setSelectionRange(val.length, val.length);
                      }
                    }}
                    onChange={(e, newValue) => setEditedCommentText(newValue)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setTimeout(() => {
                          handleEditSave();
                        }, 100);
                      }
                    }}
                    onBlur={handleEditSave}
                    className="mentions w-full bg-transparent p-0 m-0 border-none outline-none pr-10"
                    style={mentionStyles}
                  >
                    <Mention
                      trigger="@"
                      data={mentionData}
                      markup="@[__display__](__id__)"
                      displayTransform={(id, display) => `@${display} `}
                      appendSpaceOnAdd
                    />
                    <Mention
                      trigger="#"
                      data={tagData}
                      markup="#[__display__](__id__)"
                      displayTransform={(id, display) => `#${display} `}
                      appendSpaceOnAdd
                    />
                  </MentionsInput>
                  {supported && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // For editing, we use a unique ID for each comment or just a general one
                        const editFieldId = `edit-comment-${cmt.id}`;
                        if (isListening && activeId === editFieldId) {
                          stopListening();
                        } else {
                          startListening(editFieldId);
                        }
                      }}
                      className={`absolute right-0 top-0 p-1 rounded-full transition-all ${isListening && activeId === `edit-comment-${cmt.id}`
                        ? "bg-red-100 text-red-600 animate-pulse"
                        : "text-gray-400 hover:bg-gray-200"
                        }`}
                    >
                      {isListening && activeId === `edit-comment-${cmt.id}` ? <Mic size={16} /> : <MicOff size={16} />}
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {cmt.body
                    .replace(/@\[(.*?)\]\(\d+\)/g, "@$1")
                    .replace(/#\[(.*?)\]\(\d+\)/g, "#$1")}
                </div>
              )}

              <div className="flex gap-2 text-[10px]">
                <span>{formatToDDMMYYYY_AMPM(cmt.created_at)}</span>
                {cmt.updated_at && cmt.updated_at !== cmt.created_at && (
                  <span className="text-gray-500 italic">(edited)</span>
                )}
                <span
                  className="cursor-pointer"
                  onClick={() => handleEdit(cmt)}
                >
                  Edit
                </span>
                <span
                  className="cursor-pointer"
                  onClick={() => handleDelete(cmt.id)}
                >
                  Delete
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Attachments Component
const Attachments = ({
  attachments,
  taskId,
  fetchData,
}: {
  attachments?: any[];
  taskId?: string;
  fetchData: () => void;
}) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const [files, setFiles] = useState<any[]>(attachments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFiles(attachments || []);
  }, [attachments]);

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;

    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map((file) => file.name).join(", ");
      toast.error(`File(s) too large: ${fileNames}. Max allowed size is 10MB.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("task_management[attachments][]", file);
      });

      await axios.put(
        `https://${baseUrl}/task_managements/${taskId}.json`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("File(s) uploaded successfully");
      fetchData();
    } catch (error: any) {
      console.error("File upload failed:", error);
      toast.error("Failed to upload file.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    setIsSubmitting(true);
    try {
      await axios.delete(
        `https://${baseUrl}/task_managements/${taskId}/remove_attachemnts/${fileId}.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("File removed successfully.");
      setFiles(files.filter((f) => f.id !== fileId));
      if (taskId) {
        const taskResponse = await dispatch(
          fetchProjectTasksById({ baseUrl, token, id: taskId })
        ).unwrap();
        setFiles(taskResponse?.attachments || []);
      }
    } catch (error: any) {
      console.error("File deletion failed:", error);
      toast.error("Failed to delete file.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-5">
      {files.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-4">
            {files.map((file, index) => {
              const fileName = file.document_file_name || file.file_name;
              const fileUrl = file.document_url || file.file_url;
              const fileExt = fileName?.split(".").pop()?.toLowerCase();
              const isImage = [
                "jpg",
                "jpeg",
                "png",
                "gif",
                "bmp",
                "webp",
              ].includes(fileExt || "");
              const isPdf = fileExt === "pdf";
              const isWord = ["doc", "docx"].includes(fileExt || "");
              const isExcel = ["xls", "xlsx"].includes(fileExt || "");

              return (
                <div
                  key={index}
                  className="border rounded p-2 flex flex-col items-center justify-center text-center shadow-sm bg-white relative"
                >
                  <Trash2
                    size={20}
                    color="#C72030"
                    className="absolute top-2 right-2 cursor-pointer hover:opacity-70 transition"
                    onClick={() => handleDeleteFile(file.id)}
                  />
                  <div className="w-full h-[100px] flex items-center justify-center bg-gray-100 rounded mb-2 overflow-hidden">
                    {isImage ? (
                      <img
                        src={fileUrl}
                        alt={fileName}
                        className="object-contain h-full"
                      />
                    ) : isPdf ? (
                      <span className="text-red-600 font-bold">PDF</span>
                    ) : isWord ? (
                      <span className="text-blue-600 font-bold">DOC</span>
                    ) : isExcel ? (
                      <span className="text-green-600 font-bold">XLS</span>
                    ) : (
                      <span className="text-gray-500 font-bold">FILE</span>
                    )}
                  </div>

                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={fileName}
                    className="text-xs text-blue-700 hover:underline truncate w-full"
                    title={fileName}
                  >
                    {fileName}
                  </a>
                </div>
              );
            })}
          </div>

          <button
            className="bg-[#C72030] h-[40px] w-[240px] text-white px-5 mt-4 disabled:opacity-50"
            onClick={handleAttachFile}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Attach Files"}{" "}
            <span className="text-[10px]">( Max 10 MB )</span>
          </button>
        </>
      ) : (
        <div className="text-[14px] mt-2">
          <span>No Documents Attached</span>
          <div className="text-[#C2C2C2]">
            Drop or attach relevant documents here
          </div>
          <button
            className="bg-[#C72030] h-[40px] w-[240px] text-white px-5 mt-4 disabled:opacity-50"
            onClick={handleAttachFile}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Attach Files"}{" "}
            <span className="text-[10px]">( Max 10 MB )</span>
          </button>
        </div>
      )}

      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        disabled={isSubmitting}
      />
    </div>
  );
};

// Activity Log Component
const ActivityLog = ({ taskStatusLogs }: { taskStatusLogs?: any[] }) => {
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const hoursStr = String(hours).padStart(2, "0");
    return `${day} ${month} ${year} ${hoursStr}:${minutes} ${ampm}`;
  };

  const getActionFromStatus = (status: string) => {
    switch (status) {
      case "open":
        return "opened";
      case "on_hold":
        return "put on hold";
      case "in_progress":
        return "started progress on";
      case "completed":
        return "completed";
      default:
        return "updated to " + status.replace(/_/g, " ");
    }
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${hours} hr ${minutes} mins ${seconds} sec`;
  };

  if (!taskStatusLogs || taskStatusLogs.length === 0) {
    return (
      <div className="text-center py-8 w-full text-gray-500">
        No activity logs available
      </div>
    );
  }

  const activities = taskStatusLogs.map((log: any) => ({
    id: log.id,
    person: log.created_by_name,
    action: getActionFromStatus(log.status),
    item: "task",
    timestamp: formatTimestamp(log.created_at),
    rawTimestamp: log.created_at,
  }));

  const sortedActivities = [...activities].sort(
    (a, b) =>
      new Date(a.rawTimestamp).getTime() - new Date(b.rawTimestamp).getTime()
  );

  return (
    <div className="overflow-x-auto w-full bg-[rgba(247, 247, 247, 0.51)] shadow rounded-lg mt-3 px-4">
      <div className="flex items-center p-2 gap-5 text-[12px] my-3 overflow-x-auto">
        {sortedActivities.map((activity: any, index: number) => (
          <Fragment key={activity.id}>
            <div className="flex flex-col gap-2 min-w-[150px]">
              <span>
                <i>
                  {activity.person}{" "}
                  <span className="text-[#C72030]">{activity.action}</span>{" "}
                  {activity.item}
                </i>
              </span>
              <span>
                <i>{activity.timestamp}</i>
              </span>
            </div>
            {index < sortedActivities.length - 1 && (
              <div className="flex flex-col items-center min-w-[100px]">
                <h1 className="text-[12px] text-center">
                  {calculateDuration(
                    activity.rawTimestamp,
                    sortedActivities[index + 1].rawTimestamp
                  )}
                </h1>
                <img src="/arrow.png" alt="arrow" className="mt-1" />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

// Workflow Status Component
const WorkflowStatusLog = ({ taskStatusLogs }: { taskStatusLogs?: any[] }) => {
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const hoursStr = String(hours).padStart(2, "0");
    return `${day} ${month} ${year} ${hoursStr}:${minutes} ${ampm}`;
  };

  const getActionFromStatus = (status: string) => {
    if (!status) return "updated the task";
    return `marked as ${status}`;
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${hours} hr ${minutes} mins ${seconds} sec`;
  };

  if (!taskStatusLogs || taskStatusLogs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No workflow status logs available
      </div>
    );
  }

  const activities = taskStatusLogs.map((log: any) => ({
    id: log.id,
    person: log.created_by_name,
    action: getActionFromStatus(log.status),
    item: "task",
    timestamp: formatTimestamp(log.created_at),
    rawTimestamp: log.created_at,
  }));

  const sortedActivities = [...activities].sort(
    (a, b) =>
      new Date(a.rawTimestamp).getTime() - new Date(b.rawTimestamp).getTime()
  );

  return (
    <div className="overflow-x-auto w-full bg-[rgba(247, 247, 247, 0.51)] shadow rounded-lg mt-3 px-4">
      <div className="flex items-center p-2 gap-5 text-[12px] my-3 overflow-x-auto">
        {sortedActivities.map((activity: any, index: number) => (
          <Fragment key={activity.id}>
            <div className="flex flex-col gap-2 min-w-[150px]">
              <span>
                <i>
                  {activity.person}{" "}
                  <span className="text-[#C72030]">{activity.action}</span>{" "}
                  {activity.item}
                </i>
              </span>
              <span>
                <i>{activity.timestamp}</i>
              </span>
            </div>
            {index < sortedActivities.length - 1 && (
              <div className="flex flex-col items-center min-w-[100px]">
                <h1 className="text-[12px] text-center">
                  {calculateDuration(
                    activity.rawTimestamp,
                    sortedActivities[index + 1].rawTimestamp
                  )}
                </h1>
                <img src="/arrow.png" alt="arrow" className="mt-1" />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

interface TaskDetails {
  id?: string;
  title?: string;
  description?: string;
  created_by?: string;
  created_at?: string;
  status?: string;
  parent_task_title?: string;
  responsible_person?: {
    name?: string;
  };
  priority?: string;
  expected_start_date?: string;
  parent_id?: number;
  target_date?: string;
  allocation_date?: string;
  estimated_hour?: number;
  project_title?: string;
  todo_converted?: boolean;
  milestone?: {
    title?: string;
  };
  observers?: Array<{ user_name: string }>;
  task_tags?: Array<{ company_tag?: { name: string }; name?: string }>;
  workflow_status?: string;
  predecessor_task_ids?: number[];
  successor_task_ids?: number[];
  project_status_id?: string;
}

export interface Subtask {
  id?: string;
  subtask_title?: string;
  status?: string;
  responsible_person?: {
    name?: string;
  };
  expected_start_date?: string;
  target_date?: string;
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
  in_progress: "bg-[#08AEEA] text-white",
  on_hold: "bg-[#7BD2B5] text-black",
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
  const { setCurrentSection } = useLayout();

  const view = localStorage.getItem("selectedView");

  useEffect(() => {
    setCurrentSection(
      view === "admin" ? "Value Added Services" : "Project Task"
    );
  }, [setCurrentSection]);

  const navigate = useNavigate();
  const { id, mid, taskId } = useParams<{
    id: string;
    mid: string;
    taskId: string;
  }>();
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
  const [addingTodo, setAddingTodo] = useState(false);
  const [statuses, setStatuses] = useState([]);

  const firstContentRef = useRef<HTMLDivElement>(null);
  const secondContentRef = useRef<HTMLDivElement>(null);

  const getStatuses = async () => {
    try {
      const response = await dispatch(fetchProjectStatuses()).unwrap();
      setStatuses(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStatuses();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openDropdown]);

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
        dispatch(
          fetchProjectTasksById({ baseUrl, token, id: depId.toString() })
        )
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
      const response = await dispatch(
        fetchProjectTasksById({ baseUrl, token, id: taskId })
      ).unwrap();
      setTaskDetails(response);
      setSelectedOption(mapStatusToDisplay(response.status) || "Open");
      setSubtasks(response.sub_tasks_managements || []);

      // Fetch dependent tasks
      await fetchDependentTasks(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load task details";
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

  const dropdownOptions = [
    "Open",
    "In Progress",
    "On Hold",
    "Overdue",
    "Completed",
  ];

  const handleAddToDo = async () => {
    if (addingTodo) return;
    setAddingTodo(true);
    try {
      const payload = {
        todo: {
          title: taskDetails.title,
          task_management_id: taskDetails.id,
          status: "open",
          target_date: taskDetails.target_date,
        },
      };

      await axios.post(`https://${baseUrl}/todos.json`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("To-Do added successfully.");
      fetchData();
    } catch (error) {
      console.log(error);
      const errorData = error.response.data;
      Object.keys(errorData).forEach((key) => {
        toast.error(`${key} ${errorData[key]} for todo`);
      });
    } finally {
      setAddingTodo(false);
    }
  };

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    setOpenDropdown(false);

    await dispatch(
      updateTaskStatus({
        baseUrl,
        token,
        id: taskId,
        data: {
          status: mapDisplayToApiStatus(option),
        },
      })
    ).unwrap();
    fetchData();
    toast.dismiss();
    toast.success("Status updated successfully");
  };

  const handleWorkflowChange = async (newStatusId: string) => {
    try {
      await dispatch(
        editProjectTask({
          token,
          baseUrl,
          id: String(taskId),
          data: { project_status_id: newStatusId },
        })
      ).unwrap();
      fetchData();
      toast.success("Task status changed successfully");
    } catch (error) {
      console.log(error);
    }
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

  useEffect(() => {
    if (activeTab === "subtasks" && taskDetails?.parent_id) {
      setActiveTab("dependency");
    }
  }, [activeTab, taskDetails?.parent_id]);

  return (
    <div className="my-4 m-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
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
            <span>
              Created By:{" "}
              {typeof taskDetails?.created_by === "string"
                ? taskDetails.created_by
                : (taskDetails?.created_by as any)?.name}
            </span>
            <span className="h-6 w-[1px] border border-gray-300"></span>
            <span className="flex items-center gap-3">
              Created On: {formatToDDMMYYYY_AMPM(taskDetails.created_at || "")}
            </span>
            <span className="h-6 w-[1px] border border-gray-300"></span>
            <span
              className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md text-sm ${STATUS_COLORS[mapDisplayToApiStatus(selectedOption).toLowerCase()] || "bg-gray-400 text-white"}`}
            >
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
            {taskDetails.todo_converted ? (
              <span
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => navigate(`/vas/todo`)}
              >
                <CircleCheckBig size={15} />
                <span>Added To Do</span>
              </span>
            ) : (
              <span
                className="flex items-center gap-1 cursor-pointer"
                onClick={handleAddToDo}
              >
                <CircleCheckBig size={15} />
                <span>Add To Do</span>
              </span>
            )}
            <span className="h-6 w-[1px] border border-gray-300"></span>
            <span
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setOpenEditModal(true)}
            >
              <PencilIcon size={15} />
              {taskDetails.parent_id ? "Edit Subtask" : "Edit Task"}
            </span>
            {!taskDetails.parent_id && (
              <>
                <span className="h-6 w-[1px] border border-gray-300"></span>
                <span
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => setOpenSubTaskModal(true)}
                >
                  <Plus size={15} />
                  <span>Add Subtask</span>
                </span>
              </>
            )}
          </div>
        </div>
        <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-[10px] shadow-md border border-gray-200 mb-6 p-6 mt-4">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <ChevronDownCircle
            color="#E95420"
            size={30}
            className={`${isFirstCollapsed ? "rotate-180" : "rotate-0"} transition-transform cursor-pointer`}
            onClick={toggleFirstCollapse}
          />
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Description
          </h3>
        </div>

        <div className="mt-4 overflow-hidden" ref={firstContentRef}>
          <p className="text-sm text-gray-900">{taskDetails.description}</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white rounded-[10px] shadow-md border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <ChevronDownCircle
            color="#E95420"
            size={30}
            className={`${isSecondCollapsed ? "rotate-180" : "rotate-0"} transition-transform cursor-pointer`}
            onClick={toggleSecondCollapse}
          />
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Details
          </h3>
        </div>

        {/* Collapsed View Summary */}
        {isSecondCollapsed && (
          <div className="flex items-center gap-6 mt-4 flex-wrap text-[12px]">
            <div className="flex items-center justify-start gap-3">
              <div className="text-right font-[500]">Responsible Person:</div>
              <div className="text-left">
                {taskDetails.responsible_person.name || "-"}
              </div>
            </div>
            <div className="flex items-center justify-start gap-3">
              <div className="text-right font-[500]">Priority:</div>
              <div className="text-left">{taskDetails.priority || "-"}</div>
            </div>
            <div className="flex items-center justify-start gap-3">
              <div className="text-right font-[500]">End Date:</div>
              <div className="text-left">
                {formatToDDMMYYYY(taskDetails.target_date || "")}
              </div>
            </div>
            <div className="flex items-center justify-start gap-3">
              <div className="text-right font-[500]">Efforts Duration:</div>
              <div className="text-left">
                {taskDetails.estimated_hour || 0} hours
              </div>
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
                  <p className="text-sm font-medium text-gray-600">
                    Responsible Person:
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {taskDetails?.responsible_person?.name || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">Priority:</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {taskDetails.priority || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">
                    Start Date:
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {formatToDDMMYYYY(taskDetails.expected_start_date || "")}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                {/* <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">Milestone:</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{taskDetails?.milestone?.title || "-"}</p>
                </div> */}

                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">
                    {taskDetails.parent_id ? "Task" : "Milestones"}:
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {taskDetails.parent_id
                      ? taskDetails.parent_task_title
                      : taskDetails.milestone?.title}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">End Date:</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {formatToDDMMYYYY(taskDetails.target_date || "")}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">Tags:</p>
                </div>
                <div className="flex-1">
                  <div className="flex gap-1 flex-wrap">
                    {taskDetails.task_tags &&
                      taskDetails.task_tags.length > 0 ? (
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
                  <p className="text-sm font-medium text-gray-600">
                    Efforts Duration:
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {taskDetails.estimated_hour || 0} hours
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">Observer:</p>
                </div>
                <div className="flex-1">
                  {taskDetails.observers && taskDetails.observers.length > 0 ? (
                    <TooltipProvider>
                      <div className="flex gap-1">
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
                    {calculateDuration(
                      taskDetails.expected_start_date,
                      taskDetails.target_date
                    ).isOverdue
                      ? "Overdued Time:"
                      : "Time Left:"}
                  </p>
                </div>
                <div className="flex-1">
                  <CountdownTimer
                    startDate={taskDetails.expected_start_date}
                    targetDate={taskDetails.target_date}
                  />
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[200px]">
                  <p className="text-sm font-medium text-gray-600">
                    Workflow Status:
                  </p>
                </div>
                <div className="flex-1">
                  <Select
                    value={
                      taskDetails.project_status_id
                        ? String(taskDetails.project_status_id)
                        : "1"
                    }
                    onValueChange={(value) => handleWorkflowChange(value)}
                  >
                    <SelectTrigger className="w-[180px] h-9 bg-[#C72030] text-white border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status: any) => (
                        <SelectItem key={status.id} value={String(status.id)}>
                          {status.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddSubtaskModal
        openTaskModal={openSubTaskModal}
        setOpenTaskModal={setOpenSubTaskModal}
        fetchData={fetchData}
      />

      {/* Tabs Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs
              .filter(
                (tabName) =>
                  !(tabName.label === "Subtasks" && taskDetails?.parent_id)
              )
              .map((tab) => (
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
          {activeTab === "subtasks" && !taskDetails?.parent_id && (
            <SubtasksTable subtasks={subtasks} fetchData={fetchData} />
          )}

          {/* Dependency Tab */}
          {activeTab === "dependency" && (
            <DependencyKanban
              currentTask={taskDetails}
              dependencies={dependentTasks}
              onDependenciesChange={fetchData}
            />
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <Comments
              comments={(taskDetails as any)?.comments}
              taskId={taskId}
              getTask={fetchData}
            />
          )}

          {/* Attachments Tab */}
          {activeTab === "attachments" && (
            <Attachments
              attachments={(taskDetails as any)?.attachments}
              taskId={taskId}
              fetchData={fetchData}
            />
          )}

          {/* Project Drive Tab */}
          {activeTab === "project_drive" && (
            <div className="text-center py-8 text-gray-500">
              No project drive items available
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === "activity_log" && (
            <ActivityLog
              taskStatusLogs={(taskDetails as any)?.task_status_logs}
            />
          )}

          {/* Workflow Status Log Tab */}
          {activeTab === "workflow_status_log" && (
            <WorkflowStatusLog
              taskStatusLogs={(taskDetails as any)?.workflow_status_logs}
            />
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
          style={{
            margin: 0,
            maxHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
          sx={{
            padding: "0 !important",
            "& .MuiDialogContent-root": {
              padding: "0 !important",
              overflow: "auto",
            },
          }}
        >
          <div className="sticky top-0 bg-white z-10">
            <h3 className="text-[14px] font-medium text-center mt-8">
              Edit Project Task
            </h3>
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
