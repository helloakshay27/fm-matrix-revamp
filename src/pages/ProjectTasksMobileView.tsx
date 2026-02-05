import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Download, Eye, Search, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Overdue Reason Modal Component
const OverdueReasonModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setReason('');
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast.error('Please enter a reason for the overdue task');
            return;
        }
        onSubmit(reason);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[30rem]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Task Overdue</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">This task is overdue. Please provide a reason for the overdue status.</p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    rows={4}
                />
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ProjectTasksMobileView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id, mid } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [milestoneTitle, setMilestoneTitle] = useState("");

    // Extract token, org_id, and user_id from URL
    let token: string | null = null;
    let orgId: string | null = null;
    let userId: string | null = null;

    const searchParams = new URLSearchParams(location.search);
    token = searchParams.get('token') || searchParams.get('access_token');
    orgId = searchParams.get('org_id');
    userId = searchParams.get('user_id');

    if (!token && location.hash) {
        const hash = location.hash.replace(/^#/, '');
        const hashParams = new URLSearchParams(hash);
        token = hashParams.get('token') || hashParams.get('access_token');
        orgId = hashParams.get('org_id');
        userId = hashParams.get('user_id');
    }

    // Store token, org_id, and user_id in storage
    useEffect(() => {
        if (token) {
            sessionStorage.setItem('mobile_token', token);
            localStorage.setItem('token', token);
            console.log("✅ Mobile token stored in sessionStorage and localStorage");
        }
        if (orgId) {
            sessionStorage.setItem('org_id', orgId);
            console.log("✅ org_id stored in sessionStorage:", orgId);
        }
        if (userId) {
            sessionStorage.setItem('user_id', userId);
            localStorage.setItem('user_id', userId);
            console.log("✅ user_id stored in sessionStorage and localStorage:", userId);
        }
    }, [token, orgId, userId]);

    // Get baseUrl
    const baseUrl = localStorage.getItem("baseUrl") ?? "lockated-api.gophygital.work";
    const storedToken = sessionStorage.getItem("mobile_token") || localStorage.getItem("token");

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Overdue Modal State
    const [isOverdueModalOpen, setIsOverdueModalOpen] = useState(false);
    const [overdueTaskId, setOverdueTaskId] = useState<number | null>(null);
    const [pendingCompletionPercentage, setPendingCompletionPercentage] = useState<number>(0);
    const [isOverdueLoading, setIsOverdueLoading] = useState(false);

    // Fetch tasks from API
    const fetchTasks = useCallback(async (page = 1, search = "") => {
        if (!storedToken || !mid) {
            console.warn("⚠️ No token or milestone ID available");
            return;
        }

        try {
            setLoading(true);

            let filters = `q[milestone_id_eq]=${mid}&page=${page}`;

            // Add search query if provided
            if (search && search.trim() !== "") {
                filters += `&q[title_or_task_code_or_responsible_person_name_cont]=${encodeURIComponent(search.trim())}`;
            }

            const response = await axios.get(
                `https://${baseUrl}/task_managements.json?${filters}&token=${storedToken}`
            );

            const tasksData = response.data?.task_managements || [];
            const transformedData = tasksData.map((task: any) => ({
                id: task.id,
                taskCode: task.task_code,
                title: task.title,
                status: task.status,
                projectStatus: task.project_status_name,
                responsible: task.responsible_person,
                completionPercent: task.completion_percentage,
                startDate: task.expected_start_date,
                endDate: task.target_date,
                priority: task.priority,
                totalSubtasks: task.total_sub_task_count,
                totalIssues: task.total_issues_count,
                duration: task.duration,
                estimatedHours: task.estimated_hour,
            }));

            setTasks(transformedData);

            const paginationData = response.data?.pagination;
            setHasMore(page < (paginationData?.total_pages || 1));
            setCurrentPage(page);

        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, [baseUrl, storedToken, mid]);

    // Fetch context details (Project & Milestone titles)
    const fetchContextDetails = useCallback(async () => {
        if (!storedToken) return;
        try {
            if (id) {
                const projectRes = await axios.get(
                    `https://${baseUrl}/project_managements/${id}.json?token=${storedToken}`
                );
                setProjectTitle(projectRes.data?.title || "");
            }
            if (mid) {
                const milestoneRes = await axios.get(
                    `https://${baseUrl}/milestones/${mid}.json?token=${storedToken}`
                );
                setMilestoneTitle(milestoneRes.data?.title || "");
            }
        } catch (error) {
            console.error("Error fetching context details:", error);
        }
    }, [baseUrl, storedToken, id, mid]);

    // Fetch tasks on mount and when search term changes
    useEffect(() => {
        if (storedToken && mid) {
            setCurrentPage(1);
            setHasMore(true);
            setHasMore(true);
            fetchTasks(1, searchTerm);
            fetchContextDetails();
        }
    }, [storedToken, mid, searchTerm, fetchTasks, fetchContextDetails]);

    // Check if task is overdue
    const isTaskOverdue = (date: string | Date) => {
        const now = new Date();
        const taskDate = typeof date === 'string' ? new Date(date) : date;
        taskDate.setHours(23, 59, 59, 999);
        return now > taskDate;
    };

    // Handle completion percentage change
    const handleCompletionPercentageChange = async (id: number, completionPercentage: number | string) => {
        const percentage = Number(completionPercentage);

        // Validate percentage
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
            toast.error('Please enter a valid percentage (0-100)');
            return;
        }

        // Find the task to check if it's overdue
        const task = tasks.find(t => t.id === id);
        if (!task) {
            toast.error('Task not found');
            return;
        }

        // Check if task is overdue
        if (isTaskOverdue(new Date(task.endDate))) {
            setOverdueTaskId(id);
            setPendingCompletionPercentage(percentage);
            setIsOverdueModalOpen(true);
        } else {
            await updateTaskCompletion(id, percentage, null);
        }
    };

    // Update task completion
    const updateTaskCompletion = async (id: number, percentage: number, overdueReason: string | null) => {
        try {
            const payload: any = {
                task_management: {
                    completion_percentage: percentage,
                }
            };

            if (overdueReason) {
                payload.task_management.overdue_reason = overdueReason;
            }

            const response = baseUrl
                ? await axios.patch(
                    `https://${baseUrl}/task_managements/${id}.json?token=${storedToken}`,
                    payload,
                    {}
                )
                : null;

            if (response) {
                toast.success('Task completion updated successfully');
                // Update local state
                setTasks((prev) =>
                    prev.map((task) =>
                        task.id === id ? { ...task, completionPercent: percentage } : task
                    )
                );
            }
        } catch (error) {
            console.error('Error updating task completion:', error);
            toast.error('Failed to update task completion');
        }
    };

    // Handle overdue reason submission
    const handleOverdueReasonSubmit = async (reason: string) => {
        if (!overdueTaskId) return;

        setIsOverdueLoading(true);
        try {
            await updateTaskCompletion(overdueTaskId, pendingCompletionPercentage, reason);
            setIsOverdueModalOpen(false);
            setOverdueTaskId(null);
            setPendingCompletionPercentage(0);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsOverdueLoading(false);
        }
    };

    // Transform status to match card display
    const transformStatus = (status: string): string => {
        const statusMap: Record<string, string> = {
            "open": "OPEN",
            "in_progress": "IN PROGRESS",
            "completed": "CLOSED",
            "on_hold": "ON HOLD",
            "overdue": "OVERDUE",
        };
        return statusMap[status] || status.toUpperCase();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "open":
                return { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-600" };
            case "completed":
                return { bg: "bg-green-600", text: "text-white" };
            case "in_progress":
                return { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-600" };
            case "on_hold":
                return { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-600" };
            case "overdue":
                return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-600" };
            default:
                return { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-600" };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="ghost" className="p-0" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                </div>

                {/* Breadcrumbs */}
                <div className="mb-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => navigate('/mobile-projects')}>
                                    {projectTitle || "Projects"}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            {milestoneTitle && (
                                <>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink onClick={() => navigate(`/mobile-projects/${id}/milestones`)}>{milestoneTitle}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                </>
                            )}
                            <BreadcrumbItem>
                                <BreadcrumbPage>Tasks</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {loading && tasks.length === 0 ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : tasks.length > 0 ? (
                    tasks.map((task) => {
                        const statusColor = getStatusColor(task.status);
                        const displayStatus = transformStatus(task.status);
                        return (
                            <div
                                key={task.id}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                {/* Header with ID and Status */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full font-medium text-xs">
                                            TASK-{task.id}
                                        </span>
                                    </div>
                                    <span className={`${statusColor.bg} ${statusColor.text} pl-2 pr-3 py-1 rounded-full font-medium text-xs flex items-center gap-1.5`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot}`} />
                                        {displayStatus}
                                    </span>
                                </div>

                                {/* Title and Task Code */}
                                <div className="mb-4">
                                    <h2 className="text-lg font-bold text-gray-900">{task.title}</h2>
                                    <p className="text-sm text-gray-500">Task Code : {task.taskCode || "-"}</p>
                                </div>

                                {/* Responsible and Priority */}
                                <div className="mb-4">
                                    <p className="text-sm text-gray-700 mb-1">
                                        <span className="font-semibold">Responsible :</span> {task.responsible || "-"}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Priority :</span> {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : "-"}
                                    </p>
                                </div>

                                {/* Completion and Dates */}
                                <div className="mb-4 pb-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-700">
                                            <span className="font-semibold">Progress :</span> {task.completionPercent || 0}%
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={task.completionPercent || 0}
                                            onChange={(e) => handleCompletionPercentageChange(task.id, e.target.value)}
                                            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="flex gap-2 text-xs text-gray-600">
                                        <span>{task.startDate ? new Date(task.startDate).toLocaleDateString("en-GB") : "-"}</span>
                                        <span>→</span>
                                        <span>{task.endDate ? new Date(task.endDate).toLocaleDateString("en-GB") : "-"}</span>
                                    </div>
                                </div>

                                {/* Stats and Actions */}
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-3 text-xs text-gray-600">
                                        <span>⏱️ {task.estimatedHours || 0}h</span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            className="p-0"
                                            onClick={() => navigate(`/mobile-projects/${id}/milestones/${mid}/tasks/${task.id}`)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No tasks found</p>
                    </div>
                )}
            </div>

            {/* Overdue Reason Modal */}
            <OverdueReasonModal
                isOpen={isOverdueModalOpen}
                onClose={() => {
                    setIsOverdueModalOpen(false);
                    setOverdueTaskId(null);
                    setPendingCompletionPercentage(0);
                }}
                onSubmit={handleOverdueReasonSubmit}
                isLoading={isOverdueLoading}
            />
        </div>
    )
}

export default ProjectTasksMobileView