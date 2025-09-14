import { useGSAP } from "@gsap/react";
import {
    ChevronDown,
    ChevronDownCircle,
    PencilIcon,
    Trash2,
} from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    changeTaskStatus,
    createTaskComment,
    editTaskComment,
    taskDetails,
    attachFiles,
    editTask,
    deleteTaskComment,
    resetCommentEdit,
    removeTaskAttachment,
} from "../../redux/slices/taskSlice";
import gsap from "gsap";
import SubtaskTable from "../../components/Home/Task/Modals/subtaskTable";
import DependancyKanban from "../../components/Home/DependancyKanban";
import AddTaskModal from "../../components/Home/Task/AddTaskModal";
import toast, { Toaster } from "react-hot-toast";
import { deleteTask } from "../../redux/slices/taskSlice";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../../redux/slices/userSlice";
import { MentionsInput, Mention } from "react-mentions";
import { fetchStatus } from "../../redux/slices/statusSlice";
import { fetchActiveTags } from "../../redux/slices/tagsSlice";

const mapStatusToDisplay = (rawStatus) => {
    const statusMap = {
        open: "Active",
        in_progress: "In Progress",
        on_hold: "On Hold",
        overdue: "Overdue",
        completed: "Completed",
    };
    return statusMap[rawStatus?.toLowerCase()] || "Active";
};

const mapDisplayToApiStatus = (displayStatus) => {
    const reverseStatusMap = {
        Active: "open",
        "In Progress": "in_progress",
        "On Hold": "on_hold",
        Overdue: "overdue",
        Completed: "completed",
    };
    return reverseStatusMap[displayStatus] || "open"; // Default to "open" if unknown
};

const calculateDuration = (end) => {
    const now = new Date();
    const endDate = new Date(end);

    // Set target to the end of the day (11:59:59 PM)
    endDate.setHours(23, 59, 59, 999);

    const diffMs = endDate - now;
    if (diffMs <= 0) return "0s";

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    return `${days > 0 ? days + "d " : ""}${remainingHours > 0 ? remainingHours + "h " : ""
        }${remainingMinutes > 0 ? remainingMinutes + "m " : ""}${remainingSeconds}s`;
};

const CountdownTimer = ({ targetDate }) => {
    const [countdown, setCountdown] = useState(calculateDuration(targetDate));

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(calculateDuration(targetDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="text-left text-[#029464] text-[12px]">{countdown}</div>
    );
};

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
    hours = String(hours).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

const Status = ({ taskStatusLogs }) => {
    // Format timestamp to "DD MMM YYYY HH:MM AM/PM"
    const formatTimestamp = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        hours = String(hours).padStart(2, "0");
        return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
    };

    // Map status to action verb
    const getActionFromStatus = (status) => {
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

    const calculateDuration = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffMs = Math.abs(endDate - startDate);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        return `${hours} hr ${minutes} mins ${seconds} sec`;
    };

    const activities = taskStatusLogs.map((log) => ({
        id: log.id,
        person: log.created_by_name,
        action: getActionFromStatus(log.status),
        item: "task",
        timestamp: formatTimestamp(log.created_at),
        rawTimestamp: log.created_at,
    }));

    const sortedActivities = [...activities].sort(
        (a, b) => new Date(a.rawTimestamp) - new Date(b.rawTimestamp)
    );

    return (
        <div className="overflow-x-auto w-full bg-[rgba(247, 247, 247, 0.51)] shadow rounded-lg mt-3 px-4">
            <div className="flex items-center p-2 gap-5 text-[12px] my-3 overflow-x-auto">
                {sortedActivities.map((activity, index) => (
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

const WorkflowStatus = ({ taskStatusLogs }) => {
    const formatTimestamp = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        hours = String(hours).padStart(2, "0");
        return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
    };

    // Dynamically generate an action from any status string
    const getActionFromStatus = (status) => {
        if (!status) return "updated the task";
        return `marked as ${status}`;
    };

    const calculateDuration = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffMs = Math.abs(endDate - startDate);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        return `${hours} hr ${minutes} mins ${seconds} sec`;
    };

    const activities = taskStatusLogs.map((log) => ({
        id: log.id,
        person: log.created_by_name,
        action: getActionFromStatus(log.status),
        item: "task",
        timestamp: formatTimestamp(log.created_at),
        rawTimestamp: log.created_at,
    }));

    const sortedActivities = [...activities].sort(
        (a, b) => new Date(a.rawTimestamp) - new Date(b.rawTimestamp)
    );

    return (
        <div className="overflow-x-auto w-full bg-[rgba(247, 247, 247, 0.51)] shadow rounded-lg mt-3 px-4">
            <div className="flex items-center p-2 gap-5 text-[12px] my-3 overflow-x-auto">
                {sortedActivities.map((activity, index) => (
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

const Comments = ({ comments }) => {
    const token = localStorage.getItem("token");
    const { tid } = useParams();

    const [comment, setComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState("");

    const textareaRef = useRef(null);

    const dispatch = useDispatch();
    const { loading, success } = useSelector((state) => state.createTaskComment);
    const { loading: editLoading, success: editSuccess } = useSelector(
        (state) => state.editTaskComment
    );
    const { success: deleteSuccess } = useSelector(
        (state) => state.deleteTaskComment
    );
    const { fetchUsers: name } = useSelector((state) => state.fetchUsers);
    const { fetchActiveTags: tags } = useSelector(
        (state) => state.fetchActiveTags
    );

    useEffect(() => {
        dispatch(fetchUsers({ token }));
        dispatch(fetchActiveTags({ token }));
    }, [dispatch, token]);

    const mentionData = name
        ? name.map((user) => ({
            id: user.id.toString(),
            display: `${user.firstname} ${user.lastname}` || "Unknown User",
        }))
        : [];

    const tagData = tags
        ? tags.map((tag) => ({
            id: tag.id.toString(),
            display: tag.name,
        }))
        : [];

    const handleAddComment = (e) => {
        if (e) e.preventDefault();

        if (!comment?.trim()) {
            toast.error("Comment cannot be empty", { duration: 1000 });
            return;
        }

        const payload = {
            comment: {
                body: comment,
                commentable_id: tid,
                commentable_type: "TaskManagement",
                commentor_id: JSON.parse(localStorage.getItem("user"))?.id,
                active: true,
            },
        };

        dispatch(createTaskComment({ token, payload }));
    };

    const handleEdit = (comment) => {
        setEditingCommentId(comment.id);
        setEditedCommentText(comment.body);
    };

    const handleEditSave = () => {
        if (!editedCommentText.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        const formData = new FormData();
        formData.append("comment[body]", editedCommentText);
        dispatch(
            editTaskComment({ token, id: editingCommentId, payload: formData })
        );
    };

    const handleDelete = (id) => {
        dispatch(deleteTaskComment({ token, id }));
    };

    const handleCancel = () => {
        setEditingCommentId(null);
        setComment("");
        setEditedCommentText("");
    };

    useEffect(() => {
        if (success || editSuccess || deleteSuccess) {
            setComment("");
            setEditingCommentId(null);
            setEditedCommentText("");
            dispatch(taskDetails({ token, id: tid }));
            dispatch(resetCommentEdit());
        }
    }, [success, editSuccess, deleteSuccess, dispatch, tid, token]);

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
                overflowY: "auto",
                borderRadius: "4px",
            },
            item: {
                padding: "5px 10px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
            },
            itemFocused: {
                backgroundColor: "#01569E", // ✅ Highlighted color
                color: "white",
                fontWeight: "bold",
            },
        },
    };

    return (
        <div className="text-[14px] flex flex-col gap-2">
            {/* New Comment Input */}
            <div className="flex justify-start m-2 gap-5">
                <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white text-center p-1.5">
                    <span>CB</span>
                </div>
                <MentionsInput
                    inputRef={textareaRef}
                    value={comment}
                    onChange={(e, newValue) => setComment(newValue)}
                    className="mentions w-[95%] h-[70px] bg-[#F2F4F4] p-2 border-2 border-[#DFDFDF] focus:outline-none"
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
                        displayTransform={(id, display) => `@${display}`}
                        appendSpaceOnAdd
                    />
                    <Mention
                        trigger="#"
                        data={tagData}
                        markup="#[__display__](__id__)"
                        displayTransform={(id, display) => `#${display}`}
                        appendSpaceOnAdd
                    />
                </MentionsInput>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-red text-white h-[30px] px-3 cursor-pointer p-1 mr-2"
                    onClick={handleAddComment}
                    disabled={loading}
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

            {/* Comments List */}
            {comments.map((cmt) => {
                const isEditing = editingCommentId === cmt.id;
                return (
                    <div key={cmt.id} className="relative flex justify-start m-2 gap-5">
                        <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white text-center p-1.5">
                            <span>CB</span>
                        </div>
                        <div className="flex flex-col gap-2 w-full border-b-[2px] pb-3 border-[rgba(190, 190, 190, 1)]">
                            <h1 className="font-bold">{cmt.commentor_full_name}</h1>

                            {isEditing ? (
                                <MentionsInput
                                    value={editedCommentText}
                                    inputRef={(el) => {
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
                                    className="mentions w-full bg-transparent p-0 m-0 border-none outline-none"
                                    style={mentionStyles}
                                >
                                    <Mention
                                        trigger="@"
                                        data={mentionData}
                                        markup="@[__display__](__id__)"
                                        displayTransform={(id, display) => `@${display}`}
                                        appendSpaceOnAdd
                                    />
                                    <Mention
                                        trigger="#"
                                        data={tagData}
                                        markup="#[__display__](__id__)"
                                        displayTransform={(id, display) => `#${display}`}
                                        appendSpaceOnAdd
                                    />
                                </MentionsInput>
                            ) : (
                                <div>
                                    {cmt.body
                                        .replace(/@\[(.*?)\]\(\d+\)/g, "@$1")
                                        .replace(/#\[(.*?)\]\(\d+\)/g, "#$1")}
                                </div>
                            )}

                            <div className="flex gap-2 text-[10px]">
                                <span>{formatToDDMMYYYY_AMPM(cmt.created_at)}</span>
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

const Attachments = ({ attachments, id }) => {
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    const [files, setFiles] = useState(attachments);

    // ✅ Sync props to local state
    useEffect(() => {
        setFiles(attachments);
    }, [attachments]);

    const handleAttachFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const selectedFiles = Array.from(event.target.files);
        if (!selectedFiles.length) return;

        // ✅ Validate file sizes (10MB max per file)
        const oversizedFiles = selectedFiles.filter((file) => file.size > 10 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            const fileNames = oversizedFiles.map((file) => file.name).join(", ");
            toast.error(`File(s) too large: ${fileNames}. Max allowed size is 10MB.`);
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("task_management[attachments][]", file);
        });

        try {
            await dispatch(attachFiles({ token, id, payload: formData })).unwrap();
            await dispatch(taskDetails({ token, id })).unwrap(); // ✅ ensure attachments update in parent too
        } catch (error) {
            console.error("File upload failed:", error);
            toast.error("Failed to upload file.");
        }
    };

    const handleDeleteFile = async (fileId) => {
        try {
            await dispatch(removeTaskAttachment({ token, id, image_id: fileId })).unwrap();
            toast.dismiss();
            toast.success("File removed successfully.");
            await dispatch(taskDetails({ token, id })).unwrap(); // ✅ keep redux + UI in sync
        } catch (error) {
            console.error("File deletion failed:", error);
            toast.error("Failed to delete file.");
        }
    };

    return (
        <div className="flex flex-col gap-3 p-5">
            {files.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-4">
                        {files.map((file, index) => {
                            const fileName = file.document_file_name;
                            const fileUrl = file.document_url;
                            const fileExt = fileName.split(".").pop().toLowerCase();
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
                                        className="absolute top-2 right-2 cursor-pointer"
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
                        className="bg-[#C72030] h-[40px] w-[240px] text-white px-5 mt-4"
                        onClick={handleAttachFile}
                    >
                        Attach Files{" "}
                        <span className="text-[10px]">( Max 10 MB )</span>
                    </button>
                </>
            ) : (
                <div className="text-[14px] mt-2">
                    <span>No Documents Attached</span>
                    <div className="text-[#C2C2C2]">Drop or attach relevant documents here</div>
                    <button
                        className="bg-[#C72030] h-[40px] w-[240px] text-white px-5 mt-4"
                        onClick={handleAttachFile}
                    >
                        Attach Files{" "}
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
            />
        </div>
    );
};

const TaskDetails = () => {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { tid } = useParams();
    const { taskDetails: task } = useSelector((state) => state.taskDetails);
    const { fetchStatus: statuses } = useSelector((state) => state.fetchStatus);
    const { success } = useSelector((state) => state.changeTaskStatus);
    const { success: editSuccess } = useSelector((state) => state.editTask);

    const [isFirstCollapsed, setIsFirstCollapsed] = useState(false);
    const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
    const [tab, setTab] = useState("Subtasks");
    const [openDropdown, setOpenDropdown] = useState(false);
    const [openWorkflowDropdown, setOpenWorkflowDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Active");
    const [selectedWorkflowOption, setSelectedWorkflowOption] = useState("Open");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [bgBTN, setBgBTN] = useState();

    const firstContentRef = useRef(null);
    const secondContentRef = useRef(null);
    const dropdownRef = useRef(null);
    const workflowDropdownRef = useRef(null);

    useEffect(() => {
        if (task?.status) setSelectedOption(mapStatusToDisplay(task.status));
        if (task?.project_status?.status) {
            setSelectedWorkflowOption(task.project_status.status);
            setBgBTN(task.project_status.color_code);
        }
    }, [task]);

    useEffect(() => {
        dispatch(taskDetails({ token, id: tid }));
        dispatch(fetchStatus({ token }));
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDeleteTask = (id) => {
        try {
            dispatch(deleteTask({ token, id }));
            navigate(-1);
        } catch (err) {
            console.log(err);
        }
    };

    const dropdownOptions = [
        "Active",
        "In Progress",
        "On Hold",
        "Overdue",
        "Completed",
    ];

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setOpenDropdown(false);
        dispatch(
            changeTaskStatus({
                token,
                id: tid,
                payload: { status: mapDisplayToApiStatus(option) },
            })
        );
    };

    const handleWorkflowOptionSelect = (option) => {
        setBgBTN(option.color_code);
        setSelectedWorkflowOption(option.status);
        setOpenWorkflowDropdown(false);
        dispatch(
            editTask({
                token,
                id: tid,
                payload: { project_status_id: option.id },
            })
        );
    };

    useEffect(() => {
        if (success || editSuccess) {
            dispatch(taskDetails({ token, id: tid }));
        }
    }, [success, editSuccess]);

    useGSAP(() => {
        gsap.set(firstContentRef.current, { height: "auto" });
        gsap.set(secondContentRef.current, { height: "auto" });
    }, []);

    const toggleFirstCollapse = () => {
        if (isFirstCollapsed) {
            gsap.to(firstContentRef.current, {
                height: "auto",
                opacity: 1,
                duration: 0.5,
                ease: "power2.inOut",
            });
        } else {
            gsap.to(firstContentRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
            });
        }
        setIsFirstCollapsed(!isFirstCollapsed);
    };

    const toggleSecondCollapse = () => {
        if (isSecondCollapsed) {
            gsap.to(secondContentRef.current, {
                height: "auto",
                opacity: 1,
                duration: 0.5,
                ease: "power2.inOut",
            });
        } else {
            gsap.to(secondContentRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
            });
        }
        setIsSecondCollapsed(!isSecondCollapsed);
    };

    return (
        <>
            <div className="m-4">
                <Toaster position="top-center" />
                <div className="px-4 pt-1">
                    <h2 className="text-[15px] p-3 px-0">
                        <span className="mr-3">T-0{task.id}</span>
                        <span>{task.title}</span>
                    </h2>
                    <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
                    <div className="flex items-center justify-between my-3 text-[12px]">
                        <div className="flex items-center gap-3 text-[#323232]">
                            <span>Created By: {task.created_by?.name}</span>
                            <span className="h-6 w-[1px] border border-gray-300"></span>
                            <span className="flex items-center gap-3">
                                Created On: {formatToDDMMYYYY_AMPM(task.created_at)}
                            </span>
                            <span className="h-6 w-[1px] border border-gray-300"></span>
                            <span className="flex relative items-center gap-2 cursor-pointer px-2 py-1 w-[150px] rounded-md text-sm text-white bg-[#C85E68]">
                                <div className="relative w-full" ref={dropdownRef}>
                                    <div
                                        className="flex items-center justify-between gap-1 cursor-pointer px-2 py-1"
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
                                className="cursor-pointer flex items-center gap-1"
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                <PencilIcon className="mx-1" size={15} /> Edit Task
                            </span>
                            <span className="h-6 w-[1px] border border-gray-300"></span>
                            <span
                                className="cursor-pointer flex items-center gap-1"
                                onClick={() => {
                                    handleDeleteTask(task.id);
                                }}
                            >
                                <Trash2 className="mx-1" size={15} /> Delete Task
                            </span>
                        </div>
                    </div>
                    <div className="border-b-[3px] border-grey my-3"></div>
                    <div className="border rounded-md shadow-custom p-5 mb-4 text-[14px]">
                        <div
                            className="font-[600] text-[16px] flex items-center gap-4"
                            onClick={toggleFirstCollapse}
                        >
                            <ChevronDownCircle
                                color="#E95420"
                                size={30}
                                className={`${isFirstCollapsed ? "rotate-180" : "rotate-0"
                                    } transition-transform`}
                            />{" "}
                            Description
                        </div>
                        <div className="mt-3 overflow-hidden" ref={firstContentRef}>
                            <p>{task.description}</p>
                        </div>
                    </div>
                    <div className="border rounded-md shadow-custom p-5 mb-4">
                        <div
                            className="font-[600] text-[16px] flex items-center gap-4"
                            onClick={toggleSecondCollapse}
                        >
                            <ChevronDownCircle
                                color="#E95420"
                                size={30}
                                className={`${isSecondCollapsed ? "rotate-180" : "rotate-0"
                                    } transition-transform`}
                            />{" "}
                            Details
                        </div>
                        <div className="mt-3" ref={secondContentRef}>
                            <div className="flex flex-col">
                                <div className="flex items-center ml-36">
                                    <div className="w-1/2 flex items-center justify-start gap-3">
                                        <div className="text-right text-[12px] font-[500]">
                                            Responsible Person:
                                        </div>
                                        <div className="text-left text-[12px]">
                                            {task.responsible_person?.name}
                                        </div>
                                    </div>
                                    <div className="w-1/2 flex items-center justify-start gap-3">
                                        <div className="text-right text-[12px] font-[500]">
                                            Priority:
                                        </div>
                                        <div className="text-left text-[12px]">
                                            {task.priority?.charAt(0).toUpperCase() +
                                                task.priority?.slice(1).toLowerCase() || ""}
                                        </div>
                                    </div>
                                </div>
                                <span className="border h-[1px] inline-block w-full my-4"></span>
                                <div className="flex items-center ml-36">
                                    <div className="w-1/2 flex items-center justify-start gap-3">
                                        <div className="text-right text-[12px] font-[500]">
                                            Start Date:
                                        </div>
                                        <div className="text-left text-[12px]">
                                            {task?.expected_start_date?.split("T")[0]}
                                        </div>
                                    </div>
                                    <div className="w-1/2 flex items-center justify-start gap-3">
                                        <div className="text-right text-[12px] font-[500]">
                                            MileStones:
                                        </div>
                                        <div className="text-left text-[12px]">0/1</div>
                                    </div>
                                </div>
                                <span className="border h-[1px] inline-block w-full my-4"></span>
                                <div className="flex items-center ml-36">
                                    <div className="w-1/2 flex items-center justify-start gap-3">
                                        <div className="text-right text-[12px] font-[500]">
                                            End Date:
                                        </div>
                                        <div className="text-left text-[12px]">
                                            {task.target_date}
                                        </div>
                                    </div>
                                    <div className="w-1/2 flex items-center justify-start gap-3">
                                        <div className="text-right text-[12px] font-semibold">
                                            Tags:
                                        </div>
                                        <div className="text-left text-[12px] flex items-start">
                                            {task.task_tags?.map((tag) => (
                                                <div
                                                    key={tag.company_tag?.id}
                                                    className="border-2 border-[#c72030] rounded-full py-1 px-2 text-[12px] mx-[2px]"
                                                >
                                                    {tag.company_tag?.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="border h-[1px] inline-block w-full my-4"></span>
                                <div className="flex items-center ml-36">
                                    <div className="w-1/2 flex items-center justify-start gap-3">
                                        <div className="text-right text-[12px] font-[500]">
                                            Duration:
                                        </div>
                                        <CountdownTimer targetDate={task.target_date} />
                                    </div>
                                    <div className="w-1/2 flex items-center justify-start gap-3">
                                        <div className="text-right text-[12px] font-semibold">
                                            Observer:
                                        </div>
                                        <div className="text-left text-[12px] flex items-start">
                                            {task.observers?.map((observer) => (
                                                <div
                                                    key={observer.id}
                                                    className="border-2 border-[#c72030] rounded-full px-2 py-1 text-[12px] mx-[2px]"
                                                >
                                                    {observer.user_name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="border h-[1px] inline-block w-full my-4"></span>
                                <div className="flex items-center ml-36">
                                    <div className="w-1/2 flex items-center justify-start gap-3">
                                        <div className="text-right text-[12px] font-[500]">
                                            Workflow Status:
                                        </div>
                                        <span
                                            className={`flex relative items-center gap-2 cursor-pointer px-2 py-1 w-[150px] rounded-md text-sm text-white`}
                                            style={{ backgroundColor: bgBTN || "#c72030" }}
                                        >
                                            <div
                                                className="relative w-full"
                                                ref={workflowDropdownRef}
                                            >
                                                <div
                                                    className="flex items-center justify-between gap-1 cursor-pointer px-2 py-1"
                                                    onClick={() =>
                                                        setOpenWorkflowDropdown(!openWorkflowDropdown)
                                                    }
                                                    role="button"
                                                    aria-haspopup="true"
                                                    aria-expanded={openWorkflowDropdown}
                                                    tabIndex={0}
                                                    onKeyDown={(e) =>
                                                        e.key === "Enter" &&
                                                        setOpenWorkflowDropdown(!openWorkflowDropdown)
                                                    }
                                                >
                                                    <span className="text-[13px]">
                                                        {selectedWorkflowOption}
                                                    </span>
                                                    <ChevronDown
                                                        size={15}
                                                        className={`${openWorkflowDropdown ? "rotate-180" : ""
                                                            } transition-transform`}
                                                    />
                                                </div>
                                                <ul
                                                    className={`dropdown-menu absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden no-scrollbar ${openWorkflowDropdown ? "block" : "hidden"
                                                        }`}
                                                    role="menu"
                                                    style={{
                                                        minWidth: "150px",
                                                        maxHeight: "200px",
                                                        overflowY: "auto",
                                                        zIndex: 1000,
                                                    }}
                                                >
                                                    {statuses.map((option, idx) => (
                                                        <li key={option.id} role="menuitem">
                                                            <button
                                                                className={`dropdown-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 ${selectedOption === option
                                                                    ? "bg-gray-100 font-semibold"
                                                                    : ""
                                                                    }`}
                                                                onClick={() =>
                                                                    handleWorkflowOptionSelect(option)
                                                                }
                                                            >
                                                                {option.status}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between my-3">
                            <div className="flex items-center gap-10">
                                {[
                                    "Subtasks",
                                    "Dependency",
                                    "Comments",
                                    "Attachments",
                                    "Activity Log",
                                    "Workflow Status Log",
                                ].map((tabName, index) => (
                                    <div
                                        key={index}
                                        id={index + 1}
                                        className={`text-[14px] font-[400] ${tab === tabName ? "selected" : "cursor-pointer"
                                            }`}
                                        onClick={() => setTab(tabName)}
                                    >
                                        {tabName}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
                        <div>
                            {tab === "Subtasks" && <SubtaskTable projectId={task.project_management_id} />}
                            {tab === "Dependency" && <DependancyKanban id={tid} />}
                            {tab === "Comments" && <Comments comments={task?.comments} />}
                            {tab === "Attachments" && (
                                <Attachments attachments={task?.attachments} id={task.id} />
                            )}
                            {tab === "Activity Log" && (
                                <Status taskStatusLogs={task.task_status_logs} />
                            )}
                            {tab === "Workflow Status Log" && (
                                <WorkflowStatus taskStatusLogs={task.workflow_status_logs} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isEditModalOpen && (
                <AddTaskModal
                    isModalOpen={isEditModalOpen}
                    setIsModalOpen={setIsEditModalOpen}
                    title={"Edit Task"}
                    isEdit={true}
                />
            )}
        </>
    );
};

export default TaskDetails;
