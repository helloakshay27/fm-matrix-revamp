import { useGSAP } from "@gsap/react";
import { ChevronDown, ChevronDownCircle, PencilIcon, Trash2 } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeTaskStatus, createTaskComment, editTaskComment, taskDetails } from "../../redux/slices/taskSlice";
import gsap from "gsap";
import SubtaskTable from "../../components/Home/Task/Modals/subtaskTable";
import DependancyKanban from "../../components/Home/DependancyKanban";
import AddTaskModal from "../../components/Home/Task/AddTaskModal";
import toast, { Toaster } from "react-hot-toast";

const mapStatusToDisplay = (rawStatus) => {
    const statusMap = {
        open: "Active",
        in_progress: "In Progress",
        on_hold: "On Hold",
        overdue: "Overdue",
        completed: "Completed",
    };
    return statusMap[rawStatus?.toLowerCase()] || "Active"; // Default to "Active" if unknown
};

// Utility function to map display status back to API format
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

const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;
    if (diffMs <= 0) return "0 sec";
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? hours + " hr " : ""}${remainingMinutes > 0 ? remainingMinutes + " mins " : ""}${remainingSeconds} sec`;
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

    // Sample calculateDuration function (replace with your own if available)
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
        rawTimestamp: log.created_at, // Keep raw for calculateDuration
    }));

    // Sort activities by timestamp
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
    const { id } = useParams();
    const [comment, setComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const textareaRef = useRef(null);

    const dispatch = useDispatch();
    const { loading, success } = useSelector(state => state.createTaskComment);
    const { loading: editLoading, success: editSuccess } = useSelector(state => state.editTaskComment);

    const handleAddComment = (e) => {
        e.preventDefault();

        if (!comment?.trim()) {
            toast.error("Comment cannot be empty", {
                duration: 1000,
            });
            return;
        };

        if (editingCommentId) {
            const formData = new FormData();
            formData.append("comment[body]", comment);
            return dispatch(editTaskComment({ id: editingCommentId, payload: formData }));
        }
        const payload = {
            comment: {
                body: comment,
                commentable_id: id,
                commentable_type: "TaskManagement",
                commentor_id: 364,
                active: true,
            },
        };

        dispatch(createTaskComment(payload));
    };

    const handleEdit = (comment) => {
        setEditingCommentId(comment.id);
        setComment(comment.body);
        if (textareaRef.current) {
            textareaRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            textareaRef.current.focus();
        }
    };

    const handleCancel = () => {
        setEditingCommentId(null);
        setComment("");
    };

    useEffect(() => {
        if (success || editSuccess) {
            setComment("");
            setEditingCommentId(null);
        }
    }, [success, editSuccess]);

    return (
        <div className="text-[14px] flex flex-col gap-2">
            <div className="flex justify-start m-2 gap-5">
                <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white text-center p-1.5">
                    <span className="">CB</span>
                </div>
                <textarea
                    ref={textareaRef}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-[95%] h-[70px] bg-[#F2F4F4] p-2 border-2 b-[#DFDFDF]"
                    placeholder="Add comment here. Type @ to mentions users. Type # to mention tags"
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-red text-white h-[30px] px-3 cursor-pointer p-1 mr-2"
                    onClick={handleAddComment}
                    disabled={loading || editLoading}
                >
                    {editingCommentId ? "Update Comment" : "Add Comment"}
                </button>
                <button
                    className="border-2 border-[#C72030] h-[30px] cursor-pointer p-1 px-3"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            </div>
            {comments.map((comment) => (
                <div key={comment.id} className="relative flex justify-start m-2 gap-5">
                    <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white text-center p-1.5">
                        <span className="">CB</span>
                    </div>
                    <div className="flex flex-col gap-2 w-full border-b-[2px] pb-3 border-[rgba(190, 190, 190, 1)]">
                        <h1 className="font-bold">{comment.commentor_full_name}</h1>
                        <span>{comment.body}</span>
                        <div className="flex gap-2 text-[10px]">
                            <span>{formatToDDMMYYYY_AMPM(comment.created_at)}</span>
                            <span
                                className="cursor-pointer"
                                onClick={() => handleEdit(comment)}
                            >
                                Edit
                            </span>
                            <span>Delete</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Attachments = () => {
    return (
        <div className="flex justify-start flex-col gap-3 p-5 text-[14px] mt-2">
            <span>No Documents Attached</span>
            <span className="text-[#C2C2C2]">Drop or attach relevant documents here</span>
            <button className="bg-[#C72030] h-[40px] w-[240px] text-white px-5">Attach Files</button>
        </div>
    );
};

const TaskDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { taskDetails: task } = useSelector((state) => state.taskDetails);

    const [isFirstCollapsed, setIsFirstCollapsed] = useState(false);
    const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
    const firstContentRef = useRef(null);
    const secondContentRef = useRef(null);
    const [tab, setTab] = useState("Subtasks");
    const [openDropdown, setOpenDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Active");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (task?.status) {
            setSelectedOption(mapStatusToDisplay(task.status));
        }
    }, [task?.status]);

    useEffect(() => {
        dispatch(taskDetails(id));
    }, [dispatch, id]);

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

    const dropdownOptions = ["Active", "In Progress", "On Hold", "Overdue", "Completed"];

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setOpenDropdown(false);
        // Dispatch status change with API-compatible status
        dispatch(
            changeTaskStatus({
                id,
                payload: { status: mapDisplayToApiStatus(option) },
            })
        );
    };

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
                                        onKeyDown={(e) => e.key === "Enter" && setOpenDropdown(!openDropdown)}
                                    >
                                        <span className="text-[13px]">{selectedOption}</span>
                                        <ChevronDown
                                            size={15}
                                            className={`${openDropdown ? "rotate-180" : ""} transition-transform`}
                                        />
                                    </div>
                                    <ul
                                        className={`dropdown-menu absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden ${openDropdown ? "block" : "hidden"}`}
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
                                                    className={`dropdown-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 ${selectedOption === option ? "bg-gray-100 font-semibold" : ""}`}
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
                            <span className="cursor-pointer flex items-center gap-1" onClick={() => setIsEditModalOpen(true)}>
                                <PencilIcon className="mx-1" size={15} /> Edit Task
                            </span>
                            <span className="h-6 w-[1px] border border-gray-300"></span>
                            <span className="cursor-pointer flex items-center gap-1" onClick={() => dispatch(taskDetails(id))}>
                                <Trash2 className="mx-1" size={15} /> Delete Task
                            </span>
                        </div>
                    </div>
                    <div className="border-b-[3px] border-grey my-3"></div>
                    <div className="border rounded-md shadow-custom p-5 mb-4 text-[14px]">
                        <div className="font-[600] text-[16px] flex items-center gap-4" onClick={toggleFirstCollapse}>
                            <ChevronDownCircle
                                color="#E95420"
                                size={30}
                                className={`${isFirstCollapsed ? "rotate-180" : "rotate-0"} transition-transform`}
                            />{" "}
                            Description
                        </div>
                        <div className="mt-3 overflow-hidden" ref={firstContentRef}>
                            <p>{task.description}</p>
                        </div>
                    </div>
                    <div className="border rounded-md shadow-custom p-5 mb-4">
                        <div className="font-[600] text-[16px] flex items-center gap-4" onClick={toggleSecondCollapse}>
                            <ChevronDownCircle
                                color="#E95420"
                                size={30}
                                className={`${isSecondCollapsed ? "rotate-180" : "rotate-0"} transition-transform`}
                            />{" "}
                            Details
                        </div>
                        <div className="mt-3 overflow-hidden" ref={secondContentRef}>
                            <div className="flex items-center">
                                <div className="w-1/2 flex items-center justify-center gap-3">
                                    <div className="text-right text-[12px] font-[500]">Responsible Person:</div>
                                    <div className="text-left text-[12px]">{task.responsible_person?.name}</div>
                                </div>
                                <div className="w-1/2 flex items-center justify-center gap-3">
                                    <div className="text-right text-[12px] font-[500]">Priority:</div>
                                    <div className="text-left text-[12px]">
                                        {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1).toLowerCase() || ""}
                                    </div>
                                </div>
                            </div>
                            <span className="border h-[1px] inline-block w-full my-4"></span>
                            <div className="flex items-center">
                                <div className="w-1/2 flex items-center justify-center gap-3">
                                    <div className="text-right text-[12px] font-[500]">Start Date:</div>
                                    <div className="text-left text-[12px]">{task.expected_start_date}</div>
                                </div>
                                <div className="w-1/2 flex items-center justify-center gap-3">
                                    <div className="text-right text-[12px] font-[500]">MileStones:</div>
                                    <div className="text-left text-[12px]">0/1</div>
                                </div>
                            </div>
                            <span className="border h-[1px] inline-block w-full my-4"></span>
                            <div className="flex items-center">
                                <div className="w-1/2 flex items-center justify-center gap-3">
                                    <div className="text-right text-[12px] font-[500]">End Date:</div>
                                    <div className="text-left text-[12px]">{task.target_date}</div>
                                </div>
                                <div className="w-1/2 flex items-center justify-center gap-3">
                                    <div className="text-right text-[12px] font-semibold">Tags:</div>
                                    <div className="text-left text-[12px] flex items-start gap-1">
                                        {task.task_tags?.map((tag) => (
                                            <div key={tag.company_tag?.id} className="border-2 border-[#c72030] rounded-full py-1 px-2 text-[12px] mx-1">
                                                {tag.company_tag?.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="border h-[1px] inline-block w-full my-4"></span>
                            <div className="flex items-center">
                                <div className="w-1/2 flex items-center justify-center gap-3">
                                    <div className="text-right text-[12px] font-[500]">Duration:</div>
                                    <div className="text-left text-[#029464] text-[12px]">
                                        {calculateDuration(task.expected_start_date, task.target_date)}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-center gap-3">
                                    <div className="text-right text-[12px] font-semibold">Observer:</div>
                                    <div className="text-left text-[12px] flex items-start gap-1">
                                        {task.observers?.map((observer) => (
                                            <div key={observer.id} className="border-2 border-[#c72030] rounded-full px-2 py-1 text-[12px] mx-2">
                                                {observer.user_name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between my-3">
                            <div className="flex items-center gap-10">
                                {["Subtasks", "Dependency", "Comments", "Attachments", "Activity Log"].map((tabName, index) => (
                                    <div
                                        key={index}
                                        id={index + 1}
                                        className={`text-[14px] font-[400] ${tab === tabName ? "selected" : "cursor-pointer"}`}
                                        onClick={() => setTab(tabName)}
                                    >
                                        {tabName}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
                        <div>
                            {tab === "Subtasks" && <SubtaskTable />}
                            {tab === "Dependency" && <DependancyKanban />}
                            {tab === "Comments" && <Comments comments={task?.comments} />}
                            {tab === "Attachments" && <Attachments />}
                            {tab === "Activity Log" && <Status taskStatusLogs={task.task_status_logs} />}
                        </div>
                    </div>
                </div>
            </div>
            {
                isEditModalOpen && (
                    <AddTaskModal
                        isModalOpen={isEditModalOpen}
                        setIsModalOpen={setIsEditModalOpen}
                        title={"Edit Task"}
                        isEdit={true}
                    />
                )
            }
        </>
    );
};

export default TaskDetails;