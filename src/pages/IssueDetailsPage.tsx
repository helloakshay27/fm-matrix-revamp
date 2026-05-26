import { useEffect, useState, useRef, Fragment } from "react";
import { useLayout } from "@/contexts/LayoutContext";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ArrowLeft, ChevronDown, ChevronDownCircle, Eye, PencilIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { Mic, MicOff } from "lucide-react";
import { Mention, MentionsInput } from "react-mentions";
import EditIssueModal from "@/components/EditIssueModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Issue {
    id?: string;
    title?: string;
    description?: string;
    issue_type_name?: string;
    priority?: string;
    status?: string;
    responsible_person?: { name: string };
    responsible_person_id?: string;
    created_by?: { name: string };
    created_at?: string;
    updated_at?: string;
    start_date?: string;
    end_date?: string;
    project_management_name?: string;
    project_management_id?: string;
    milstone_name?: string;
    milestone_id?: string;
    task_management_name?: string;
    task_management_id?: string;
    tags?: string[];
    attachments?: any[];
    comments?: any[];
    issue_allocation_times?: any[];
}

function formatToDDMMYYYY_AMPM(dateString: string | undefined) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = String(hours).padStart(2, "0");
    return `${day} /${month}/${year} ${hoursStr}:${minutes} ${ampm}`;
}

const STATUS_COLORS: Record<string, string> = {
    open: "bg-[#E4636A] text-white",
    in_progress: "bg-[#08AEEA] text-white",
    on_hold: "bg-[#7BD2B5] text-black",
    overdue: "bg-[#FF2733] text-white",
    completed: "bg-[#83D17A] text-white",
    reopen: "bg-yellow-500 text-white",
    closed: "bg-green-700 text-white",
};

const mapStatusToDisplay = (rawStatus: string | undefined) => {
    const statusMap: Record<string, string> = {
        open: "Open",
        in_progress: "In Progress",
        on_hold: "On Hold",
        completed: "Completed",
        reopen: "Reopen",
        closed: "Closed",
    };
    return statusMap[rawStatus?.toLowerCase() || ""] || "Open";
};

const mapDisplayToApiStatus = (displayStatus: string) => {
    const reverseStatusMap: Record<string, string> = {
        Open: "open",
        "In Progress": "in_progress",
        "On Hold": "on_hold",
        Completed: "completed",
        Reopen: "reopen",
        Closed: "closed",
    };
    return reverseStatusMap[displayStatus] || "open";
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

const Attachments = ({ attachments, id, baseUrl, token, getIssue, fetchIssueDetails }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState(attachments);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setFiles(attachments);
    }, [attachments]);

    const handleAttachFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        if (!selectedFiles.length) return;

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("issue[attachments][]", file);
        });

        try {
            setUploading(true);

            await axios.put(`https://${baseUrl}/issues/${id}.json`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchIssueDetails();
            toast.success("Files uploaded successfully.");
        } catch (error) {
            console.error("File upload failed:", error);
            toast.error("Failed to upload file.");
        } finally {
            setUploading(false);
            // reset file input so same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemoveFile = async (fileId: string) => {
        try {
            await axios.delete(`https://${baseUrl}/issues/${id}/remove_attachemnts/${fileId}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("File removed successfully.");
            setFiles(files.filter((f: any) => f.id !== fileId));
        } catch (error) {
            console.error("File deletion failed:", error);
            toast.error("Failed to delete file.");
        }
    };

    return (
        <div className="flex flex-col gap-3 p-5">
            {files && files.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-4">
                        {files.map((file: any, index: number) => {
                            const fileName = file.document_file_name || file.filename || `file-${index}`;
                            const fileUrl = file.document_url || file.url || "#";
                            const fileExt = fileName.split(".").pop()?.toLowerCase() || "";

                            const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileExt);
                            const isPdf = fileExt === "pdf";
                            const isWord = ["doc", "docx"].includes(fileExt);
                            const isExcel = ["xls", "xlsx"].includes(fileExt);

                            return (
                                <div
                                    key={index}
                                    className="border rounded overflow-hidden flex flex-col items-center justify-center text-center shadow-sm bg-white hover:shadow-md transition-shadow group"
                                >
                                    <div className="w-full h-[120px] flex items-center justify-center bg-gray-100 rounded-t overflow-hidden relative group">
                                        {isImage ? (
                                            <img
                                                src={fileUrl}
                                                alt={fileName}
                                                className="object-contain h-full w-full"
                                            />
                                        ) : isPdf ? (
                                            <span className="text-red-600 font-bold text-2xl">PDF</span>
                                        ) : isWord ? (
                                            <span className="text-blue-600 font-bold text-2xl">DOC</span>
                                        ) : isExcel ? (
                                            <span className="text-green-600 font-bold text-2xl">XLS</span>
                                        ) : (
                                            <span className="text-gray-500 font-bold text-2xl">FILE</span>
                                        )}

                                        {/* Button Overlay */}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                            <button
                                                onClick={() => window.open(fileUrl, "_blank")}
                                                className="bg-white text-gray-800 p-2 rounded hover:bg-blue-500 hover:text-white transition-all transform hover:scale-110"
                                                title="View file"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveFile(file.id)}
                                                className="bg-white text-gray-800 p-2 rounded hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"
                                                title="Delete file"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="w-full p-2 flex-1 flex flex-col justify-center">
                                        <a
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download={fileName}
                                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline truncate"
                                            title={fileName}
                                        >
                                            {fileName}
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        className={`bg-[#C72030] h-[40px] w-[240px] text-white px-5 mt-4 flex items-center justify-center ${uploading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={handleAttachFile}
                        disabled={uploading}
                        aria-disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                Uploading...
                            </>
                        ) : (
                            'Attach Files'
                        )}
                    </button>
                </>
            ) : (
                <div className="text-[14px] mt-2">
                    <span>No Documents Attached</span>
                    <div className="text-[#C2C2C2]">Drop or attach relevant documents here</div>
                    <button
                        className={`bg-[#C72030] h-[40px] w-[240px] text-white px-5 mt-4 flex items-center justify-center ${uploading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={handleAttachFile}
                        disabled={uploading}
                        aria-disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                Uploading...
                            </>
                        ) : (
                            'Attach Files'
                        )}
                    </button>
                </div>
            )
            }
            <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                disabled={uploading}
            />
        </div >
    );
};

// Helper to get initials from name
const getInitials = (name: string): string => {
    if (!name) return "U";
    return name.split(" ").map((n) => n.charAt(0)).join("").toUpperCase();
};

// Activity Log Component
const ActivityLog = ({ issueId }: { issueId: string }) => {
    const baseUrl = localStorage.getItem("baseUrl") || "";
    const token = localStorage.getItem("token") || "";
    const [issueSystemLogs, setIssueSystemLogs] = useState<any[]>([]);
    const [userMapping, setUserMapping] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(
                    `https://${baseUrl}/issues/${issueId}/issue_system_logs.json`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIssueSystemLogs(response.data || []);
            } catch (error) {
                console.error("Error fetching activity logs:", error);
            }
        };
        if (issueId) fetchLogs();
    }, [issueId, baseUrl, token]);

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
                    mapping[user.id?.toString() || user.user_id?.toString()] =
                        user.full_name || user.name || "Unknown User";
                });
                setUserMapping(mapping);
            } catch (e) {
                console.error("Error fetching users:", e);
            }
        };
        if (token && baseUrl) fetchUsers();
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
        "created_by_id", "issue_id",
    ]);

    const FIELD_LABELS: Record<string, string> = {
        status: "Status",
        title: "Title",
        description: "Description",
        end_date: "End Date",
        start_date: "Start Date",
        priority: "Priority",
        responsible_person_id: "Assigned To",
        milestone_id: "Milestone",
        project_management_id: "Project",
        task_management_id: "Task",
        issue_type_id: "Issue Type",
    };

    const STATUS_BADGE: Record<string, string> = {
        open: "bg-blue-100 text-blue-700",
        in_progress: "bg-yellow-100 text-yellow-700",
        on_hold: "bg-gray-200 text-gray-700",
        overdue: "bg-red-100 text-red-700",
        completed: "bg-green-100 text-green-700",
        reopen: "bg-yellow-100 text-yellow-700",
        closed: "bg-green-100 text-green-700",
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
                    if (oldVal !== "—") oldVal = userMapping[oldVal] || oldVal;
                    if (newVal !== "—") newVal = userMapping[newVal] || newVal;
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

    if (!issueSystemLogs.length) {
        return (
            <div className="text-center py-8 w-full text-gray-500 text-sm">
                No activity logs available
            </div>
        );
    }

    const sorted = [...issueSystemLogs].sort(
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
                                                {log.log_type?.replace("Issue", "").trim() || "Updated issue"}
                                            </p>
                                        ) : changes.isCreation ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-500 text-base leading-none">✦</span>
                                                <span className="text-[11px] font-semibold text-green-700">Issue Created</span>
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
                                        <div className="rotate-180 w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-gray-400 flex-shrink-0" />
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

const Comments = ({ comments, getIssue, baseUrl, token, id }: any) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const { id: issueId } = useParams();
    const [comment, setComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editedCommentText, setEditedCommentText] = useState("");
    const textareaRef = useRef<any>(null);

    const { isListening, activeId, transcript, supported, startListening, stopListening } = useSpeechToText();
    const fieldId = "issue-comment-input";
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
    // Handle updates for editing transcripts
    useEffect(() => {
        if (isListening && activeId?.startsWith("edit-comment-") && transcript) {
            setEditedCommentText(transcript);
        }
    }, [isListening, activeId, transcript]);

    // Local comments state so we can optimistically prepend new comments
    const [localComments, setLocalComments] = useState<any[]>(sortCommentsDesc(comments || []));

    // Mock data for mentions - replace with actual API calls if needed
    const [mentionUsers, setMentionUsers] = useState<any[]>([]);
    const [mentionTags, setMentionTags] = useState<any[]>([]);

    const fetchMentionUsers = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setMentionUsers(response.data.users || []);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchMentionTags = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/company_tags.json`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setMentionTags(response.data || []);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchMentionUsers();
        fetchMentionTags();
    }, [])

    // keep localComments in sync if parent comments prop changes
    useEffect(() => {
        setLocalComments(sortCommentsDesc(comments || []));
    }, [comments]);

    const mentionData = mentionUsers.length > 0
        ? mentionUsers.map((user: any) => ({
            id: user.id?.toString() || user.user_id?.toString(),
            display: user.full_name || user.name || "Unknown User",
        }))
        : [];

    const tagData = mentionTags.length > 0
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
                    commentable_id: issueId || id,
                    commentable_type: "Issue",
                    commentor_id: currentUser?.id,
                    active: true,
                },
            };

            const resp = await axios.post(`https://${baseUrl}/comments.json`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Prepend new comment from server response if available, otherwise use payload
            const newComment = resp.data.comment || resp.data || {
                id: Date.now().toString(),
                body: comment,
                commentor_full_name: `${currentUser?.firstname || ''} ${currentUser?.lastname || ''}`.trim(),
                created_at: new Date().toISOString(),
            };

            setLocalComments((prev) => [newComment, ...prev]);
            toast.success("Comment added successfully");
            setComment("");
            // keep fetching full issue if needed: getIssue();
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment");
        }
    };

    const handleEdit = (cmt: any) => {
        setEditingCommentId(cmt.id);
        setEditedCommentText(cmt.body || "");
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

            const resp = await axios.put(`https://${baseUrl}/comments/${editingCommentId}.json`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const updated = resp.data.comment || resp.data;
            setLocalComments((prev) => prev.map((c) => (c.id === editingCommentId ? updated : c)));

            toast.success("Comment updated successfully");
            setEditingCommentId(null);
            setEditedCommentText("");
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
            // getIssue();
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
                                {/* <span className="cursor-pointer" onClick={() => handleEdit(cmt)}>
                                    Edit
                                </span>
                                <span className="cursor-pointer" onClick={() => handleDelete(cmt.id)}>
                                    Delete
                                </span> */}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const formatTime = (data) => {
    console.log(data)
    const totalMinutes = data?.reduce(
        (total, item) => total + (item.hours * 60) + item.minutes,
        0
    );

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
        return `${minutes} min`;
    }

    if (minutes === 0) {
        return `${hours} hr`;
    }

    return `${hours} hr ${minutes} min`;
};

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

const IssueDetailsPage = () => {
    const { setCurrentSection } = useLayout();

    const view = localStorage.getItem("selectedView");

    useEffect(() => {
        setCurrentSection(view === "admin" ? "Value Added Services" : "Project Task");
    }, [setCurrentSection]);

    const navigate = useNavigate();
    const { id: issueId } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [issueData, setIssueData] = useState<Issue | null>(null);
    const [loading, setLoading] = useState(false);
    const [isFirstCollapsed, setIsFirstCollapsed] = useState(false);
    const [isSecondCollapsed, setIsSecondCollapsed] = useState(true);
    const [activeTab, setActiveTab] = useState("Comments");
    const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("Open");
    const [openEditModal, setOpenEditModal] = useState(false);

    const statusDropdownRef = useRef<HTMLDivElement>(null);

    // Fetch issue details
    const fetchIssueDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://${baseUrl}/issues/${issueId}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const issueDetail = response.data.issue || response.data;

            // Map API response to Issue interface
            const mappedIssue: Issue = {
                id: issueDetail.id?.toString() || "",
                title: issueDetail.title || "",
                description: issueDetail.description || "",
                issue_type_name: issueDetail.issue_type_name || "",
                priority: issueDetail.priority || "",
                status: issueDetail.status || "open",
                responsible_person: issueDetail.responsible_person || { name: "Unassigned" },
                responsible_person_id: issueDetail.responsible_person_id || issueDetail.assigned_to_id || "",
                created_by: issueDetail.created_by || { name: "Unknown" },
                created_at: issueDetail.created_at || "",
                updated_at: issueDetail.updated_at || "",
                start_date: issueDetail.start_date || "",
                end_date: issueDetail.end_date || issueDetail.target_date || issueDetail.due_date || "",
                project_management_name: issueDetail.project_management_name || "",
                project_management_id: issueDetail.project_management_id || "",
                milstone_name: issueDetail.milstone_name || "",
                milestone_id: issueDetail.milestone_id || "",
                task_management_name: issueDetail.task_management_name || "",
                task_management_id: issueDetail.task_management_id || "",
                tags: issueDetail.task_tags || [],
                attachments: issueDetail.attachments || [],
                comments: sortCommentsDesc(issueDetail.comments || []),
                issue_allocation_times: issueDetail.issue_allocation_times || [],
            };

            setIssueData(mappedIssue);
        } catch (error) {
            console.error("Error fetching issue details:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to load issue"
            );
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (issueId && baseUrl && token) {
            fetchIssueDetails();
        }
    }, [issueId, baseUrl, token, navigate]);

    useEffect(() => {
        if (issueData?.status) {
            setSelectedStatus(mapStatusToDisplay(issueData.status));
        }
    }, [issueData?.status]);

    const handleStatusChange = async (newStatus: string) => {
        setSelectedStatus(newStatus);
        setOpenStatusDropdown(false);
        try {
            const apiStatus = mapDisplayToApiStatus(newStatus);
            await axios.put(
                `https://${baseUrl}/issues/${issueId}.json`,
                { issue: { status: apiStatus } },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Status updated successfully");
            getIssue();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const toggleFirstCollapse = () => {
        setIsFirstCollapsed(!isFirstCollapsed);
    };

    const toggleSecondCollapse = () => {
        setIsSecondCollapsed(!isSecondCollapsed);
    };

    const getIssue = async () => {
        if (issueId && baseUrl && token) {
            try {
                const response = await axios.get(
                    `https://${baseUrl}/issues/${issueId}.json`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const issueDetail = response.data.issue || response.data;

                const mappedIssue: Issue = {
                    id: issueDetail.id?.toString() || "",
                    title: issueDetail.title || "",
                    description: issueDetail.description || "",
                    issue_type_name: issueDetail.issue_type_name || "",
                    priority: issueDetail.priority || "",
                    status: issueDetail.status || "open",
                    responsible_person: issueDetail.responsible_person || { name: "Unassigned" },
                    responsible_person_id: issueDetail.responsible_person_id || "",
                    created_by: issueDetail.created_by || { name: "Unknown" },
                    created_at: issueDetail.created_at || "",
                    updated_at: issueDetail.updated_at || "",
                    start_date: issueDetail.start_date || "",
                    end_date: issueDetail.end_date || "",
                    project_management_name: issueDetail.project_management_name || "",
                    project_management_id: issueDetail.project_management_id || "",
                    milstone_name: issueDetail.milstone_name || "",
                    milestone_id: issueDetail.milestone_id || "",
                    task_management_name: issueDetail.task_management_name || "",
                    task_management_id: issueDetail.task_management_id || "",
                    tags: issueDetail.tags || [],
                    attachments: issueDetail.attachments || [],
                    comments: sortCommentsDesc(issueDetail.comments || []),
                };

                setIssueData(mappedIssue);
            } catch (error) {
                console.error("Error fetching issue:", error);
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setOpenStatusDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div className="m-4">
                <Button variant="ghost" onClick={() => navigate(-1)} className="py-0 !px-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div className="px-4 pt-1">
                    {/* Title skeleton */}
                    <div className="p-3 px-0">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                    </div>

                    <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>

                    {/* Metadata skeletons */}
                    <div className="flex items-center justify-between my-3 text-[12px] gap-4">
                        <div className="flex items-center gap-3 flex-wrap">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)] my-3"></div>

                    {/* Description section skeleton */}
                    <div className="border rounded-[10px] shadow-md p-5 mb-4">
                        <div className="flex items-center gap-4 mb-4">
                            <Skeleton className="h-8 w-8 rounded" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <div className="space-y-3 mt-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>

                    {/* Details section skeleton */}
                    <div className="border rounded-[10px] shadow-md p-5 mb-4">
                        <div className="flex items-center gap-4 mb-4">
                            <Skeleton className="h-8 w-8 rounded" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!issueData) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">Issue not found</div>
            </div>
        );
    }

    return (
        <div className="m-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="py-0 px-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>
            <div className="px-4 pt-1">
                <h2 className="text-[15px] p-3 px-0">
                    <span className="mr-3">Issue-{issueData?.id}</span>
                    <span>{issueData?.title}</span>
                </h2>

                <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
                <div className="flex items-center justify-between my-3 text-[12px]">
                    <div className="flex items-center gap-3 text-[#323232]">
                        <span>Created By : {issueData?.created_by?.name}</span>

                        <span className="h-6 w-[1px] border border-gray-300"></span>

                        <span className="flex items-center gap-3">
                            Created On : {formatToDDMMYYYY_AMPM(issueData?.created_at)}
                        </span>

                        <span className="h-6 w-[1px] border border-gray-300"></span>

                        {/* Status Dropdown */}
                        <span
                            className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md text-sm ${STATUS_COLORS[mapDisplayToApiStatus(selectedStatus).toLowerCase()] ||
                                "bg-gray-400 text-white"
                                }`}
                        >
                            <div className="relative" ref={statusDropdownRef}>
                                <div
                                    className="flex items-center gap-1 cursor-pointer px-2 py-1"
                                    onClick={() => setOpenStatusDropdown(!openStatusDropdown)}
                                    role="button"
                                    aria-haspopup="true"
                                    aria-expanded={openStatusDropdown}
                                    tabIndex={0}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && setOpenStatusDropdown(!openStatusDropdown)
                                    }
                                >
                                    <span className="text-[13px]">{selectedStatus}</span>
                                    <ChevronDown
                                        size={15}
                                        className={`${openStatusDropdown ? "rotate-180" : ""
                                            } transition-transform`}
                                    />
                                </div>
                                <ul
                                    className={`absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden ${openStatusDropdown ? "block" : "hidden"
                                        }`}
                                    role="menu"
                                    style={{
                                        minWidth: "150px",
                                        maxHeight: "400px",
                                        overflowY: "auto",
                                        zIndex: 1000,
                                    }}
                                >
                                    {["Open", "In Progress", "On Hold", "Completed", "Reopen", "Closed"].map(
                                        (option, idx) => (
                                            <li key={idx} role="menuitem">
                                                <button
                                                    className={`w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 ${selectedStatus === option
                                                        ? "bg-gray-100 font-semibold"
                                                        : ""
                                                        }`}
                                                    onClick={() => handleStatusChange(option)}
                                                >
                                                    {option}
                                                </button>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </span>

                        {/* {
                            localStorage.getItem("selectedView") !== "employee" && (
                                <> */}
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => setOpenEditModal(true)}
                        >
                            <PencilIcon size={15} />
                            Edit Issue
                        </span>
                        {/* </>
                            )
                        } */}
                    </div>
                </div>
                <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)] my-3"></div>

                <div className="border rounded-[10px] shadow-md p-5 mb-4 text-[14px]">
                    <div className="font-[600] text-[16px] flex items-center gap-4">
                        <ChevronDownCircle
                            color="#E95420"
                            size={30}
                            className={`${isFirstCollapsed ? "rotate-180" : "rotate-0"} cursor-pointer transition-transform`}
                            onClick={toggleFirstCollapse}
                        />
                        Description
                    </div>
                    <div
                        className="mt-3 overflow-hidden transition-all duration-500"
                        style={{
                            maxHeight: isFirstCollapsed ? "0px" : "1000px",
                            opacity: isFirstCollapsed ? 0 : 1,
                        }}
                    >
                        <p className="whitespace-pre-wrap">{issueData?.description}</p>
                    </div>
                </div>

                <div className="border rounded-[10px] shadow-md p-5 mb-4">
                    <div className="font-[600] text-[16px] flex items-center gap-10">
                        <div className="flex items-center gap-4">
                            <ChevronDownCircle
                                color="#E95420"
                                size={30}
                                className={`${isSecondCollapsed ? "rotate-180" : "rotate-0"} cursor-pointer transition-transform`}
                                onClick={toggleSecondCollapse}
                            />
                            Details
                        </div>
                        {isSecondCollapsed && (
                            <div className="flex items-center gap-6">
                                <div className="flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Responsible Person:
                                    </div>
                                    <div className="text-left text-[12px]">
                                        {issueData?.responsible_person?.name}
                                    </div>
                                </div>

                                <div className="flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">Priority:</div>
                                    <div className="text-left text-[12px]">
                                        {issueData?.priority?.charAt(0).toUpperCase() +
                                            issueData?.priority?.slice(1).toLowerCase() || ""}
                                    </div>
                                </div>

                                <div className="flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">End Date:</div>
                                    <div className="text-left text-[12px]">
                                        {issueData?.end_date?.split("T")[0]}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`mt-3 overflow-hidden transition-all duration-500`}
                        style={{
                            maxHeight: isSecondCollapsed ? "0px" : "1000px",
                            opacity: isSecondCollapsed ? 0 : 1,
                        }}
                    >
                        <div className="flex flex-col">
                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Responsible Person :
                                    </div>
                                    <div className="text-left text-[12px]">
                                        {issueData?.responsible_person?.name}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">Priority :</div>
                                    <div className="text-left text-[12px]">
                                        {issueData?.priority?.charAt(0).toUpperCase() +
                                            issueData?.priority?.slice(1).toLowerCase() || ""}
                                    </div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">Issue Type:</div>
                                    <div className="text-left text-[12px]">{issueData?.issue_type_name}</div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">Project :</div>
                                    <div className="text-left text-[12px]">
                                        {issueData?.project_management_name || ""}
                                    </div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">Start Date :</div>
                                    <div className="text-left text-[12px]">
                                        {issueData?.start_date?.split("T")[0]}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">MileStone :</div>
                                    <div className="text-left text-[12px]">
                                        {issueData?.milstone_name || ""}
                                    </div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">End Date :</div>
                                    <div className="text-left text-[12px]">
                                        {issueData?.end_date?.split("T")[0]}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-semibold]">Task :</div>
                                    <div className="text-left text-[12px]">
                                        {issueData?.task_management_name || ""}
                                    </div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">Efforts Duration :</div>
                                    <div className="text-left text-[12px]">
                                        {formatTime(issueData?.issue_allocation_times)}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-semibold]">
                                        {calculateDuration(
                                            issueData?.start_date,
                                            issueData?.end_date
                                        ).isOverdue
                                            ? "Overdue Time:"
                                            : "Time Left:"}
                                    </div>
                                    <div className="text-left text-[12px]">
                                        <CountdownTimer
                                            startDate={issueData?.start_date}
                                            targetDate={issueData?.end_date}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between my-3">
                        <div className="flex items-center gap-10">
                            {["Comments", "Documents", "Activity Log"].map((item) => (
                                <div
                                    key={item}
                                    className={`text-[14px] font-[400] ${activeTab === item
                                        ? "border-b-2 border-[#E95420] text-[#E95420]"
                                        : "cursor-pointer"
                                        }`}
                                    onClick={() => setActiveTab(item)}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>

                    <div>
                        {activeTab === "Documents" && (
                            <Attachments
                                attachments={issueData?.attachments}
                                id={issueData?.id}
                                baseUrl={baseUrl}
                                token={token}
                                fetchIssueDetails={fetchIssueDetails}
                            />
                        )}
                        {activeTab === "Comments" && (
                            <Comments
                                comments={issueData?.comments}
                                getIssue={getIssue}
                                baseUrl={baseUrl}
                                token={token}
                                id={issueId}
                            />
                        )}
                        {activeTab === "Activity Log" && (
                            <ActivityLog issueId={issueId || ""} />
                        )}
                    </div>
                </div>
            </div>
            {issueData && (
                <EditIssueModal
                    openDialog={openEditModal}
                    handleCloseDialog={() => setOpenEditModal(false)}
                    issueData={issueData}
                    onIssueUpdated={() => {
                        fetchIssueDetails();
                    }}
                />
            )}
        </div>
    );
};

export default IssueDetailsPage;
