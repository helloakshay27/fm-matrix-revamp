import { useEffect, useState, forwardRef, useRef, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowLeft,
    ChevronDown,
    PencilIcon,
    Trash2,
    X,
    ChevronDownCircle,
    Mic,
    MicOff,
    Copy,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { Mention, MentionsInput } from "react-mentions";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLayout } from "@/contexts/LayoutContext";
import BCTaskEditModal from "@/components/BusinessCompass/BCTaskEditModal";

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

    endDate.setHours(23, 59, 59, 999);

    if (now < startDate) {
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

function formatToDDMMYYYY_AMPM(dateString) {
    if (!dateString) return "-";
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

function formatToDDMMYYYY(dateString: string) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

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

    const [comment, setComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editedCommentText, setEditedCommentText] = useState("");
    const textareaRef = useRef<any>(null);

    const {
        isListening,
        activeId,
        transcript,
        supported,
        startListening,
        stopListening,
    } = useSpeechToText();
    const fieldId = "task-comment-input";
    const isActive = isListening && activeId === fieldId;

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

    const [localComments, setLocalComments] = useState<any[]>(
        sortCommentsDesc(comments || [])
    );

    const [mentionUsers, setMentionUsers] = useState<any[]>([]);
    const [mentionTags, setMentionTags] = useState<any[]>([]);

    useEffect(() => {
        setLocalComments(sortCommentsDesc(comments || []));
    }, [comments]);

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
                    commentable_type: "Task",
                    commentor_id: currentUser?.id,
                    active: true,
                },
            };

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

            getTask?.();
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

            getTask?.();
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

            setLocalComments((prev) => prev.filter((c) => c.id !== commentId));
            toast.success("Comment deleted successfully");
            getTask?.();
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
            width: "100%",
        },
        highlighter: {
            overflow: "hidden",
            padding: "8px",
            border: "none",
        },
        input: {
            font: "inherit",
            backgroundColor: "transparent",
            border: "none",
            padding: "8px",
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
                        className="mentions w-full min-h-[70px] bg-[#F2F4F4] p-0 border-2 border-[#DFDFDF] focus-within:border-[#01569E] outline-none pr-10"
                        placeholder="Add comment here. Type @ to mention users. Type # to mention tags"
                        style={{
                            control: {
                                backgroundColor: "#F2F4F4",
                                fontSize: 14,
                                fontWeight: "normal",
                                minHeight: 70,
                                width: "100%",
                            },
                            highlighter: {
                                overflow: "hidden",
                                border: "none",
                                padding: "8px",
                            },
                            input: {
                                margin: 0,
                                padding: "8px",
                                outline: "none",
                                border: "none",
                                minHeight: 70,
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
                            className={`absolute right-2 top-2 p-1 rounded-full transition-all ${isActive
                                ? "bg-red-100 text-red-600 animate-pulse"
                                : "text-gray-400 hover:bg-gray-200"
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
                                            {isListening && activeId === `edit-comment-${cmt.id}` ? (
                                                <Mic size={16} />
                                            ) : (
                                                <MicOff size={16} />
                                            )}
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
                formData.append("task[attachments][]", file);
            });

            await axios.put(
                `https://${baseUrl}/business_compass/tasks/${taskId}`,
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
                `https://${baseUrl}/business_compass/tasks/${taskId}/remove_attachemnts/${fileId}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("File removed successfully.");
            setFiles(files.filter((f) => f.id !== fileId));
            fetchData();
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
const ActivityLog = ({ taskId }: { taskId: string }) => {
    const baseUrl = localStorage.getItem("baseUrl") || "";
    const token = localStorage.getItem("token") || "";
    const [taskStatusLogs, setTaskStatusLogs] = useState<any[]>([]);
    const [userMapping, setUserMapping] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(
                    `https://${baseUrl}/business_compass/tasks/${taskId}/task_system_logs.json`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setTaskStatusLogs(response.data || []);
            } catch (e) {
                console.error(e);
            }
        };
        fetchLogs();
    }, [taskId]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const users = response.data?.users || [];
                const mapping: Record<string, string> = {};
                users.forEach((user: any) => {
                    mapping[user.id?.toString() || user.user_id?.toString()] = user.full_name || user.name || "Unknown User";
                });
                setUserMapping(mapping);
            } catch (e) {
                console.error("Error fetching users:", e);
            }
        };

        if (token && baseUrl) {
            fetchUsers();
        }
    }, [baseUrl, token]);

    const formatTimestamp = (dateString: string) => {
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

    const calcDuration = (start: string, end: string) => {
        const diffMs = Math.abs(new Date(end).getTime() - new Date(start).getTime());
        const h = Math.floor(diffMs / 3600000);
        const m = Math.floor((diffMs % 3600000) / 60000);
        const s = Math.floor((diffMs % 60000) / 1000);
        if (h > 0) return `${h}h ${m}m`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    };

    const SKIP_FIELDS = new Set([
        "id", "created_at", "updated_at", "resource_id", "resource_type",
        "created_by_id", "task_management_id",
    ]);

    const FIELD_LABELS: Record<string, string> = {
        status: "Status",
        title: "Title",
        description: "Description",
        due_date: "End Date",
        start_date: "Start Date",
        priority: "Priority",
        responsible_person_id: "Assigned To",
        effort_duration: "Efforts Duration",
        completed_at: "Completed At",
        source: "Source",
    };

    const STATUS_BADGE: Record<string, string> = {
        open: "bg-blue-100 text-blue-700",
        in_progress: "bg-yellow-100 text-yellow-700",
        on_hold: "bg-gray-200 text-gray-700",
        overdue: "bg-red-100 text-red-700",
        completed: "bg-green-100 text-green-700",
        nil: "bg-gray-100 text-gray-400",
    };

    const parseChanges = (changed_attr: Record<string, any> | null) => {
        if (!changed_attr || Object.keys(changed_attr).length === 0) return null;

        if ("id" in changed_attr) return { isCreation: true, fields: [] };

        const fields = Object.entries(changed_attr)
            .filter(([key]) => !SKIP_FIELDS.has(key))
            .map(([key, value]) => {
                const arr = Array.isArray(value) ? value : [null, value];
                let oldVal: string;
                let newVal: string;

                if (arr.length >= 3) {
                    oldVal = arr[0] === "nil" || arr[0] === null ? "—" : String(arr[0]);
                    newVal = String(arr[arr.length - 1]);
                } else {
                    oldVal = arr[0] === "nil" || arr[0] === null ? "—" : String(arr[0]);
                    newVal = arr[1] === "nil" || arr[1] === null ? "—" : String(arr[1]);
                }

                if (key === "responsible_person_id") {
                    if (oldVal !== "—") {
                        oldVal = userMapping[oldVal] || oldVal;
                    }
                    if (newVal !== "—") {
                        newVal = userMapping[newVal] || newVal;
                    }
                }

                if (key === "description") {
                    oldVal = oldVal === "—" ? "—" : oldVal.replace(/<[^>]+>/g, "").trim().slice(0, 60) + (oldVal.length > 60 ? "…" : "");
                    newVal = newVal === "—" ? "—" : newVal.replace(/<[^>]+>/g, "").trim().slice(0, 60) + (newVal.length > 60 ? "…" : "");
                }

                return {
                    key,
                    label: FIELD_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                    old: oldVal,
                    new: newVal,
                    isStatus: key === "status",
                };
            });

        return { isCreation: false, fields };
    };

    if (!taskStatusLogs.length) {
        return (
            <div className="text-center py-8 w-full text-gray-500 text-sm">
                No activity logs available
            </div>
        );
    }

    const sorted = [...taskStatusLogs].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return (
        <div className="overflow-x-auto w-full bg-gray-50 rounded-xl shadow-inner mt-3 p-6">
            <div className="flex items-start min-w-max">
                {[...sorted].reverse().map((log: any, index: number) => {
                    const changes = parseChanges(log.changed_attr);
                    const initials = getInitials(log.changed_by || "");
                    const isLast = index === sorted.length - 1;

                    return (
                        <Fragment key={log.id}>
                            <div className="flex flex-col items-center">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 shadow-md ring-2 ring-white z-10"
                                    style={{ background: changes?.isCreation ? "#16a34a" : "#C72030" }}
                                    title={log.changed_by || "System"}
                                >
                                    {initials}
                                </div>

                                <div className="w-px h-4 border-l-2 border-dashed border-gray-300" />

                                <div className="w-[215px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="px-3 pt-2.5 pb-2 border-b border-gray-100">
                                        <p className="text-[11px] font-semibold text-gray-800 truncate leading-snug">
                                            {log.changed_by || "System"}
                                        </p>
                                        <p className="text-[9px] text-gray-400 mt-0.5">
                                            {formatTimestamp(log.created_at)}
                                        </p>
                                    </div>

                                    <div className="px-3 py-2.5 space-y-2.5">
                                        {!changes || (!changes.isCreation && changes.fields.length === 0) ? (
                                            <p className="text-[10px] text-gray-400 italic">
                                                {log.log_type?.replace("Task", "").trim() || "Updated task"}
                                            </p>
                                        ) : changes.isCreation ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-500 text-base leading-none">✦</span>
                                                <span className="text-[11px] font-semibold text-green-700">Task Created</span>
                                            </div>
                                        ) : (
                                            changes.fields.map((field) => (
                                                <div key={field.key}>
                                                    <p className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                                        {field.label}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        {field.isStatus ? (
                                                            <>
                                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium capitalize ${STATUS_BADGE[field.old] || "bg-gray-100 text-gray-500"}`}>
                                                                    {field.old === "—" ? "—" : field.old.replace(/_/g, " ")}
                                                                </span>
                                                                <span className="text-gray-400 text-[10px] font-bold">→</span>
                                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium capitalize ${STATUS_BADGE[field.new] || "bg-gray-100 text-gray-500"}`}>
                                                                    {field.new === "—" ? "—" : field.new.replace(/_/g, " ")}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <div className="flex items-center gap-1 w-full">
                                                                <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[70px]" title={field.old}>
                                                                    {field.old}
                                                                </span>
                                                                <span className="text-gray-400 text-[10px] font-bold flex-shrink-0">→</span>
                                                                <span className="text-[9px] text-gray-800 font-semibold bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[70px]" title={field.new}>
                                                                    {field.new}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!isLast && (
                                <div className="flex flex-col items-center flex-shrink-0 min-w-[80px] px-1">
                                    <span className="text-[9px] text-gray-400 whitespace-nowrap text-center mt-1 mb-1 leading-none">
                                        {calcDuration(log.created_at, sorted[index + 1].created_at)}
                                    </span>
                                    <div className="relative w-full flex items-center">
                                        <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-gray-400 flex-shrink-0 rotate-180" />
                                        <div className="flex-1 h-[1.5px] bg-gray-300" />
                                    </div>
                                </div>
                            )}
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};

interface BCTaskDetails {
    id?: string;
    title?: string;
    description?: string;
    created_at?: string;
    status?: string;
    responsible_person?: string;
    responsible_person_id?: number;
    priority?: string;
    start_date?: string;
    due_date?: string;
    effort_duration?: string;
    is_started?: boolean;
    active_time_till_now?: { hours: number; minutes: number; seconds: number };
    observer_ids?: number[];
    tag_ids?: number[];
    comments?: any[];
    attachments?: any[];
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
        Open: "open",
        "In Progress": "in_progress",
        "On Hold": "on_hold",
        Overdue: "overdue",
        Completed: "completed",
    };
    return reverseStatusMap[displayStatus] || "open";
};

const BusinessCompassTaskDetailsPage = () => {
    const { setCurrentSection } = useLayout();

    useEffect(() => {
        setCurrentSection("Business Compass");
    }, [setCurrentSection]);

    const navigate = useNavigate();
    const { taskId } = useParams<{ taskId: string }>();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const dropdownRef = useRef(null);

    const [taskDetails, setTaskDetails] = useState<BCTaskDetails>({});
    const [activeTab, setActiveTab] = useState("comments");
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Open");
    const [openDropdown, setOpenDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isFirstCollapsed, setIsFirstCollapsed] = useState(false);
    const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);

    const firstContentRef = useRef<HTMLDivElement>(null);
    const secondContentRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !(dropdownRef.current as any).contains(event.target as Node)
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

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `https://${baseUrl}/business_compass/tasks/${taskId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = response.data?.task || response.data;
            setTaskDetails(data);
            setSelectedOption(mapStatusToDisplay(data?.status) || "Open");
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to load task details";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (taskId) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId]);

    // Fetch users (for observer name resolution)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUsers(response.data?.users || []);
            } catch (error) {
                console.log(error);
            }
        };
        if (token && baseUrl) fetchUsers();
    }, [baseUrl, token]);

    // Fetch tags (for tag name resolution)
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(`https://${baseUrl}/company_tags.json`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTags(response.data || []);
            } catch (error) {
                console.log(error);
            }
        };
        if (token && baseUrl) fetchTags();
    }, [baseUrl, token]);

    const tabs = [
        { id: "comments", label: "Comments" },
        { id: "attachments", label: "Attachments" },
        { id: "activity_log", label: "Activity Log" },
    ];

    const dropdownOptions = [
        "Open",
        "In Progress",
        "On Hold",
        "Overdue",
        "Completed",
    ];

    const handleOptionSelect = async (option: string) => {
        setSelectedOption(option);
        setOpenDropdown(false);

        try {
            await axios.put(
                `https://${baseUrl}/business_compass/tasks/${taskId}/update_status.json`,
                { status: mapDisplayToApiStatus(option) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
            toast.dismiss();
            toast.success("Status updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update status");
        }
    };

    const handleOpenEditModal = () => {
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
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

    const resolvedTags = (taskDetails.tag_ids || [])
        .map((id) => tags.find((t: any) => t.id === id))
        .filter(Boolean);

    const resolvedObservers = (taskDetails.observer_ids || [])
        .map((id) => users.find((u: any) => u.id === id))
        .filter(Boolean);

    return (
        <div className="my-4 m-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            <div className="pt-1">
                {isLoading ? (
                    <>
                        <div className="p-3 px-0">
                            <Skeleton className="h-[30px] w-1/3 mb-4" />
                        </div>
                        <Skeleton className="h-[3px] w-full mb-4" />

                        <div className="space-y-3 my-3">
                            <Skeleton className="h-[20px] w-full" />
                            <Skeleton className="h-[20px] w-4/5" />
                        </div>
                        <Skeleton className="h-[3px] w-full mb-4" />

                        <div className="bg-white rounded-[10px] shadow-md border border-gray-200 mb-6 p-6 mt-4">
                            <Skeleton className="h-[30px] w-1/4 mb-4" />
                            <div className="space-y-3">
                                <Skeleton className="h-[20px] w-full" />
                                <Skeleton className="h-[20px] w-full" />
                                <Skeleton className="h-[20px] w-3/4" />
                            </div>
                        </div>

                        <div className="bg-white rounded-[10px] shadow-md border border-gray-200 mb-6 p-6">
                            <Skeleton className="h-[30px] w-1/4 mb-6" />
                            <div className="grid grid-cols-2 gap-6">
                                {Array(8)
                                    .fill(0)
                                    .map((_, i) => (
                                        <div key={i} className="flex items-start">
                                            <Skeleton className="h-[20px] w-[200px] mr-4" />
                                            <Skeleton className="h-[20px] flex-1" />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="cursor-pointer text-[15px] p-3 px-0">
                            <span className="mr-3 text-[#C72030]">Task-{taskDetails.id}</span>
                            <span>
                                {taskDetails.title}
                                <Button
                                    variant="ghost"
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText(window.location.href);
                                            toast.success("Link copied to clipboard!");
                                        } catch (err) {
                                            console.error("Failed to copy:", err);
                                        }
                                    }}
                                >
                                    <Copy size={15} />
                                </Button>
                            </span>
                        </h2>
                        <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
                        <div className="flex items-center justify-between my-3 text-[12px]">
                            <div className="flex items-center gap-3 text-[#323232] flex-wrap">
                                <span className="flex items-center gap-3">
                                    Created On:{" "}
                                    {formatToDDMMYYYY_AMPM(taskDetails.created_at || "")}
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
                                <span
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={handleOpenEditModal}
                                >
                                    <PencilIcon size={15} />
                                    Edit Task
                                </span>
                            </div>
                        </div>
                        <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>

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
                                <div
                                    className="prose prose-sm max-w-none quill-content"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            taskDetails?.description ||
                                            "<p>No description provided</p>",
                                    }}
                                />
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
                                        <div className="text-right font-[500]">
                                            Responsible Person:
                                        </div>
                                        <div className="text-left">
                                            {taskDetails.responsible_person || "-"}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-start gap-3">
                                        <div className="text-right font-[500]">Priority:</div>
                                        <div className="text-left capitalize">
                                            {taskDetails.priority || "-"}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-start gap-3">
                                        <div className="text-right font-[500]">End Date:</div>
                                        <div className="text-left">
                                            {formatToDDMMYYYY(taskDetails.due_date || "")}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-start gap-3">
                                        <div className="text-right font-[500]">
                                            Efforts Duration:
                                        </div>
                                        <div className="text-left">
                                            {taskDetails.effort_duration || "-"}
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
                                                    {taskDetails?.responsible_person || "-"}
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
                                                    {formatToDDMMYYYY(taskDetails.start_date || "")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="min-w-[200px]">
                                                <p className="text-sm font-medium text-gray-600">
                                                    End Date:
                                                </p>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900">
                                                    {formatToDDMMYYYY(taskDetails.due_date || "")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="min-w-[200px]">
                                                <p className="text-sm font-medium text-gray-600">
                                                    Tags:
                                                </p>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex gap-1 flex-wrap">
                                                    {resolvedTags.length > 0 ? (
                                                        resolvedTags.map((tag: any, index: number) => (
                                                            <span
                                                                key={index}
                                                                className="px-3 py-1 bg-[#c72030] text-white rounded-full text-xs font-medium"
                                                            >
                                                                {tag.name || tag.label || "Unknown"}
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
                                                    {taskDetails.effort_duration || "-"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="min-w-[200px]">
                                                <p className="text-sm font-medium text-gray-600">
                                                    Observer:
                                                </p>
                                            </div>
                                            <div className="flex-1">
                                                {resolvedObservers.length > 0 ? (
                                                    <TooltipProvider>
                                                        <div className="flex gap-1">
                                                            {resolvedObservers.map((observer: any, idx: number) => (
                                                                <Tooltip key={idx}>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#C72030] text-white text-xs font-medium cursor-default">
                                                                            {getInitials(observer.full_name || observer.name)}
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent
                                                                        side="top"
                                                                        className="text-sm"
                                                                    >
                                                                        {observer.full_name || observer.name}
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
                                                    Actual Efforts Taken:
                                                </p>
                                            </div>
                                            <div className="flex-1">
                                                <ActiveTimer
                                                    activeTimeTillNow={taskDetails?.active_time_till_now}
                                                    isStarted={taskDetails?.is_started}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="min-w-[200px]">
                                                <p className="text-sm font-medium text-gray-600">
                                                    {calculateDuration(
                                                        taskDetails.start_date,
                                                        taskDetails.due_date
                                                    ).isOverdue
                                                        ? "Overdue Time:"
                                                        : "Time Left:"}
                                                </p>
                                            </div>
                                            <div className="flex-1">
                                                <CountdownTimer
                                                    startDate={taskDetails.start_date}
                                                    targetDate={taskDetails.due_date}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="min-w-[200px]">
                                                <p className="text-sm font-medium text-gray-600">
                                                    Priority:
                                                </p>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900 capitalize">
                                                    {taskDetails.priority || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

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
                    {/* Comments Tab */}
                    {activeTab === "comments" && (
                        <Comments
                            comments={taskDetails?.comments}
                            taskId={taskId}
                            getTask={fetchData}
                        />
                    )}

                    {/* Attachments Tab */}
                    {activeTab === "attachments" && (
                        <Attachments
                            attachments={taskDetails?.attachments}
                            taskId={taskId}
                            fetchData={fetchData}
                        />
                    )}

                    {/* Activity Log Tab */}
                    {activeTab === "activity_log" && <ActivityLog taskId={taskId} />}
                </div>
            </div>

            {/* Edit Task Modal */}
            <BCTaskEditModal
                isOpen={openEditModal}
                onClose={handleCloseEditModal}
                onSuccess={fetchData}
                baseUrl={baseUrl || ""}
                token={token || ""}
                editData={taskDetails}
            />
        </div>
    );
};

export default BusinessCompassTaskDetailsPage;
