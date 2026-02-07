import { useEffect, useState, useRef } from "react";
import { useLayout } from "@/contexts/LayoutContext";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ChevronDown, ChevronDownCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { Mic, MicOff } from "lucide-react";
import { Mention, MentionsInput } from "react-mentions";

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
    milstone_name?: string;
    task_management_name?: string;
    tags?: string[];
    attachments?: any[];
    comments?: any[];
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
            await axios.delete(`https://${baseUrl}/issues/${id}/attachments/${fileId}.json`, {
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
                                    className="border rounded p-2 flex flex-col items-center justify-center text-center shadow-sm bg-white relative"
                                >
                                    <Trash2
                                        size={20}
                                        color="#C72030"
                                        className="absolute top-2 right-2 cursor-pointer hover:opacity-75"
                                        onClick={() => handleRemoveFile(file.id)}
                                    />
                                    <div className="w-[100px] h-[100px] flex items-center justify-center bg-gray-100 rounded mb-2 overflow-hidden">
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
            )}
            <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                disabled={uploading}
            />
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
                milstone_name: issueDetail.milstone_name || "",
                task_management_name: issueDetail.task_management_name || "",
                tags: issueDetail.tags || [],
                attachments: issueDetail.attachments || [],
                comments: sortCommentsDesc(issueDetail.comments || []),
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
                    milstone_name: issueDetail.milstone_name || "",
                    task_management_name: issueDetail.task_management_name || "",
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
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">Loading issue details...</div>
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

                        <span className="h-6 w-[1px] border border-gray-300"></span>
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
                                    <div className="text-right text-[12px] font-[500]">MileStone :</div>
                                    <div className="text-left text-[12px]">
                                        {issueData?.milstone_name || ""}
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
                                    <div className="text-right text-[12px] font-semibold]">Task :</div>
                                    <div className="text-left text-[12px]">
                                        {issueData?.task_management_name || ""}
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
                                    <div className="text-right text-[12px] font-[500]">Project :</div>
                                    <div className="text-left text-[12px]">
                                        {issueData?.project_management_name || ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between my-3">
                        <div className="flex items-center gap-10">
                            {["Comments", "Documents"].map((item) => (
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetailsPage;
