import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchIssueById, deleteIssue } from "@/store/slices/issueSlice";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronDownCircle } from "lucide-react";
import { toast } from "sonner";
import AddIssueModal from "@/components/AddIssueModal";
import axios from "axios";

interface Issue {
    id?: string;
    title?: string;
    description?: string;
    issue_type?: string;
    priority?: string;
    status?: string;
    assigned_to?: string;
    assigned_to_id?: string;
    created_by?: string;
    created_at?: string;
    updated_at?: string;
    start_date?: string;
    due_date?: string;
    project_id?: string;
    milestone_id?: string;
    task_id?: string;
    tags?: string[];
    attachments?: any[];
    comments?: any[];
}

const IssueDetailsPage = () => {
    const navigate = useNavigate();
    const { id: issueId } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [issueData, setIssueData] = useState<Issue | null>(null);
    const [loading, setLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(false);
    const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(true);
    const [activeTab, setActiveTab] = useState("Comments");
    const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("Open");

    const descriptionRef = useRef(null);
    const detailsRef = useRef(null);
    const statusDropdownRef = useRef(null);

    // Fetch issue details
    useEffect(() => {
        if (issueId && baseUrl && token) {
            setLoading(true);
            const fetchIssueDetails = async () => {
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
                        issue_type: issueDetail.issue_type || issueDetail.type_name || "",
                        priority: issueDetail.priority || "",
                        status: issueDetail.status || "Open",
                        assigned_to: issueDetail.responsible_person?.full_name || issueDetail.assigned_to || "Unassigned",
                        assigned_to_id: issueDetail.responsible_person_id || issueDetail.assigned_to_id || "",
                        created_by: issueDetail.created_by?.full_name || issueDetail.created_by_name || "",
                        created_at: issueDetail.created_at || "",
                        updated_at: issueDetail.updated_at || "",
                        start_date: issueDetail.start_date || "",
                        due_date: issueDetail.end_date || issueDetail.target_date || issueDetail.due_date || "",
                        project_id: issueDetail.project_management_id || issueDetail.project_id || "",
                        milestone_id: issueDetail.milestone_id || "",
                        task_id: issueDetail.task_management_id || issueDetail.task_id || "",
                        tags: issueDetail.tags || [],
                        attachments: issueDetail.attachments || [],
                        comments: issueDetail.comments || [],
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

            fetchIssueDetails();
        }
    }, [issueId, baseUrl, token, navigate]);

    useEffect(() => {
        if (issueData?.status) {
            setSelectedStatus(issueData.status);
        }
    }, [issueData?.status]);

    const toggleDescriptionCollapse = () => {
        setIsDescriptionCollapsed(!isDescriptionCollapsed);
        if (descriptionRef.current) {
            descriptionRef.current.style.maxHeight = isDescriptionCollapsed ? "0px" : "1000px";
            descriptionRef.current.style.opacity = isDescriptionCollapsed ? "0" : "1";
        }
    };

    const toggleDetailsCollapse = () => {
        setIsDetailsCollapsed(!isDetailsCollapsed);
        if (detailsRef.current) {
            detailsRef.current.style.maxHeight = isDetailsCollapsed ? "0px" : "1000px";
            detailsRef.current.style.opacity = isDetailsCollapsed ? "0" : "1";
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        setSelectedStatus(newStatus);
        setOpenStatusDropdown(false);
        try {
            const response = await axios.put(
                `https://${baseUrl}/issues/${issueId}.json`,
                { issue: { status: newStatus.toLowerCase().replace(" ", "_") } },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Status updated successfully");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
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

    const handleDeleteIssue = async () => {
        if (!window.confirm("Are you sure you want to delete this issue?")) return;

        try {
            await dispatch(deleteIssue({ baseUrl, token, id: issueId! })).unwrap();
            toast.success("Issue deleted successfully");
            navigate(-1);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to delete issue"
            );
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case "urgent":
                return "bg-red-100 text-red-800";
            case "high":
                return "bg-orange-100 text-orange-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            case "low":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "open":
                return "bg-blue-100 text-blue-800";
            case "in_progress":
            case "in progress":
                return "bg-purple-100 text-purple-800";
            case "on_hold":
            case "on hold":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "closed":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

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
                {/* Header with Issue ID and Title */}
                <h2 className="text-[15px] p-3 px-0 font-medium">
                    <span className="mr-3">Issue-{issueData?.id}</span>
                    <span>{issueData?.title || "Untitled Issue"}</span>
                </h2>

                <div className="border-b-[3px] border-gray-300 mb-4"></div>

                {/* Meta Information */}
                <div className="flex items-center justify-between my-3 text-[12px]">
                    <div className="flex items-center gap-3 text-gray-700">
                        <span>Created By: {issueData?.created_by || "Unknown"}</span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span>Created On: {formatDate(issueData?.created_at)}</span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>

                        {/* Status Dropdown */}
                        <div className="relative" ref={statusDropdownRef}>
                            <button
                                onClick={() => setOpenStatusDropdown(!openStatusDropdown)}
                                className="flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                            >
                                <span className="text-[13px] font-medium">{selectedStatus}</span>
                                <ChevronDown
                                    size={15}
                                    className={`transition-transform ${openStatusDropdown ? "rotate-180" : ""}`}
                                />
                            </button>
                            {openStatusDropdown && (
                                <ul className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[150px] max-h-[300px] overflow-y-auto">
                                    {["Open", "In Progress", "On Hold", "Completed", "Closed"].map((status) => (
                                        <li key={status}>
                                            <button
                                                onClick={() => handleStatusChange(status)}
                                                className={`w-full text-left px-4 py-2 text-[13px] hover:bg-gray-100 ${
                                                    selectedStatus === status ? "bg-gray-100 font-semibold" : ""
                                                }`}
                                            >
                                                {status}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-b-[3px] border-gray-300 my-3"></div>

                {/* Description Section */}
                <div className="border rounded-md shadow-sm p-5 mb-4 text-[14px] bg-white">
                    <div className="font-semibold text-[16px] flex items-center gap-4">
                        <ChevronDownCircle
                            color="#E95420"
                            size={28}
                            className={`${isDescriptionCollapsed ? "rotate-180" : ""} transition-transform cursor-pointer`}
                            onClick={toggleDescriptionCollapse}
                        />
                        Description
                    </div>
                    <div className="mt-3 overflow-hidden" ref={descriptionRef} style={{
                        maxHeight: isDescriptionCollapsed ? "0px" : "1000px",
                        opacity: isDescriptionCollapsed ? 0 : 1,
                        transition: "all 0.5s ease"
                    }}>
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {issueData?.description || "No description provided"}
                        </p>
                    </div>
                </div>

                {/* Details Section */}
                <div className="border rounded-md shadow-sm p-5 mb-4 bg-white">
                    <div className="font-semibold text-[16px] flex items-center gap-10 justify-between">
                        <div className="flex items-center gap-4">
                            <ChevronDownCircle
                                color="#E95420"
                                size={28}
                                className={`${isDetailsCollapsed ? "rotate-180" : ""} transition-transform cursor-pointer`}
                                onClick={toggleDetailsCollapse}
                            />
                            Details
                        </div>
                        {isDetailsCollapsed && (
                            <div className="flex items-center gap-6 text-[12px]">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Responsible Person:</span>
                                    <span>{issueData?.assigned_to || "Unassigned"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Priority:</span>
                                    <span>{issueData?.priority || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Due Date:</span>
                                    <span>{formatDate(issueData?.due_date)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`mt-3 overflow-hidden`} ref={detailsRef} style={{
                        maxHeight: isDetailsCollapsed ? "0px" : "1000px",
                        opacity: isDetailsCollapsed ? 0 : 1,
                        transition: "all 0.5s ease"
                    }}>
                        <div className="flex flex-col space-y-4 ml-8">
                            <div className="flex gap-8">
                                <div className="w-1/2 flex items-center gap-3">
                                    <span className="font-medium text-[12px]">Responsible Person:</span>
                                    <span className="text-[12px]">{issueData?.assigned_to || "Unassigned"}</span>
                                </div>
                                <div className="w-1/2 flex items-center gap-3">
                                    <span className="font-medium text-[12px]">Priority:</span>
                                    <span className="text-[12px]">{issueData?.priority || "N/A"}</span>
                                </div>
                            </div>
                            <hr className="border-gray-300" />

                            <div className="flex gap-8">
                                <div className="w-1/2 flex items-center gap-3">
                                    <span className="font-medium text-[12px]">Issue Type:</span>
                                    <span className="text-[12px]">{issueData?.issue_type || "N/A"}</span>
                                </div>
                                <div className="w-1/2 flex items-center gap-3">
                                    <span className="font-medium text-[12px]">Milestone:</span>
                                    <span className="text-[12px]">{issueData?.milestone_id || "N/A"}</span>
                                </div>
                            </div>
                            <hr className="border-gray-300" />

                            <div className="flex gap-8">
                                <div className="w-1/2 flex items-center gap-3">
                                    <span className="font-medium text-[12px]">Start Date:</span>
                                    <span className="text-[12px]">{formatDate(issueData?.start_date)}</span>
                                </div>
                                <div className="w-1/2 flex items-center gap-3">
                                    <span className="font-medium text-[12px]">Task:</span>
                                    <span className="text-[12px]">{issueData?.task_id || "N/A"}</span>
                                </div>
                            </div>
                            <hr className="border-gray-300" />

                            <div className="flex gap-8">
                                <div className="w-1/2 flex items-center gap-3">
                                    <span className="font-medium text-[12px]">End Date:</span>
                                    <span className="text-[12px]">{formatDate(issueData?.due_date)}</span>
                                </div>
                                <div className="w-1/2 flex items-center gap-3">
                                    <span className="font-medium text-[12px]">Project:</span>
                                    <span className="text-[12px]">{issueData?.project_id || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div>
                    <div className="flex items-center gap-10 my-3">
                        {["Comments", "Attachments"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-[14px] font-medium pb-2 border-b-2 transition ${
                                    activeTab === tab
                                        ? "border-orange-600 text-orange-600"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="border-b-[3px] border-gray-300 mb-4"></div>

                    {/* Tab Content */}
                    <div>
                        {activeTab === "Attachments" && issueData?.attachments && Array.isArray(issueData.attachments) && (
                            <div className="flex flex-col gap-3 p-5">
                                {issueData.attachments.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {issueData.attachments.map((attachment, index) => (
                                            <div key={index} className="border rounded p-3 flex flex-col items-center justify-center text-center shadow-sm bg-white relative">
                                                <div className="w-[100px] h-[100px] flex items-center justify-center bg-gray-100 rounded mb-2">
                                                    <span className="text-gray-500 text-sm">📄</span>
                                                </div>
                                                <a
                                                    href="#"
                                                    className="text-xs text-blue-700 hover:underline truncate w-full"
                                                    title={attachment?.name}
                                                >
                                                    {attachment?.name || `Attachment ${index + 1}`}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-[14px] text-gray-500">
                                        <p>No Documents Attached</p>
                                        <p className="text-[#C2C2C2]">Drop or attach relevant documents here</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "Comments" && issueData?.comments && Array.isArray(issueData.comments) && (
                            <div className="text-[14px] flex flex-col gap-2">
                                {issueData.comments.length > 0 ? (
                                    issueData.comments.map((comment, index) => (
                                        <div key={index} className="flex justify-start gap-5 mb-4 pb-4 border-b border-gray-300">
                                            <div className="bg-blue-700 h-[36px] w-[36px] rounded-full text-white flex items-center justify-center text-sm font-semibold">
                                                {comment?.author?.charAt(0) || "U"}
                                            </div>
                                            <div className="flex flex-col gap-2 w-full">
                                                <h3 className="font-bold text-[13px]">{comment?.author || "Anonymous"}</h3>
                                                <p className="text-[12px] text-gray-500">{formatDate(comment?.created_at)}</p>
                                                <p className="text-[13px] text-gray-700">{comment?.body || ""}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No comments yet</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <AddIssueModal
                openDialog={isEditModalOpen}
                handleCloseDialog={() => setIsEditModalOpen(false)}
            />
        </div>
    );
};

export default IssueDetailsPage;
