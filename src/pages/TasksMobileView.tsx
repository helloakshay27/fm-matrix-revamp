import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState, useCallback, useRef } from "react";
import { ArrowLeft, Eye, Search, X, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

const TasksMobileView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [storedToken, setStoredToken] = useState<string | null>(null);
    const searchDebounceRef = useRef<NodeJS.Timeout>();

    // Extract token, org_id, and user_id from URL query params
    const token = searchParams.get('token') || searchParams.get('access_token');
    const orgId = searchParams.get('org_id');
    const userId = searchParams.get('user_id');

    // Check for token in hash as fallback (for OAuth/implicit flow)
    let hashToken: string | null = null;
    let hashOrgId: string | null = null;
    let hashUserId: string | null = null;

    if (!token && location.hash) {
        const hash = location.hash.replace(/^#/, '');
        const hashParams = new URLSearchParams(hash);
        hashToken = hashParams.get('token') || hashParams.get('access_token');
        hashOrgId = hashParams.get('org_id');
        hashUserId = hashParams.get('user_id');
    }

    const finalToken = token || hashToken;
    const finalOrgId = orgId || hashOrgId;
    const finalUserId = userId || hashUserId;

    // Store token, org_id, and user_id in storage AND in state
    useEffect(() => {
        console.log("🔍 Token extraction effect started", { finalToken, finalOrgId, finalUserId });
        if (finalToken) {
            sessionStorage.setItem('mobile_token', finalToken);
            localStorage.setItem('token', finalToken);
            setStoredToken(finalToken);
            console.log("✅ Mobile token stored and set in state:", finalToken);
        } else {
            // Try to get from storage if not in URL
            const existingToken = sessionStorage.getItem('mobile_token') || localStorage.getItem('token');
            if (existingToken) {
                setStoredToken(existingToken);
                console.log("✅ Existing token loaded from storage:", existingToken);
            } else {
                console.warn("⚠️ No token found in URL or storage!");
            }
        }
        if (finalOrgId) {
            sessionStorage.setItem('org_id', finalOrgId);
            console.log("✅ org_id stored in sessionStorage:", finalOrgId);
        }
        if (finalUserId) {
            sessionStorage.setItem('user_id', finalUserId);
            localStorage.setItem('user_id', finalUserId);
            console.log("✅ user_id stored in sessionStorage and localStorage:", finalUserId);
        }
    }, [finalToken, finalOrgId, finalUserId]);

    // Get baseUrl
    const baseUrl = localStorage.getItem("baseUrl") ?? "lockated-api.gophygital.work";

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPage, setNextPage] = useState<number | null>(2);
    const [totalCount, setTotalCount] = useState(0);

    // Overdue Modal State
    const [isOverdueModalOpen, setIsOverdueModalOpen] = useState(false);
    const [overdueTaskId, setOverdueTaskId] = useState<number | null>(null);
    const [pendingCompletionPercentage, setPendingCompletionPercentage] = useState<number>(0);
    const [isOverdueLoading, setIsOverdueLoading] = useState(false);

    // Fetch tasks from API
    const fetchTasks = useCallback(async (page = 1, search = "", append = false) => {
        if (!storedToken) {
            console.warn("⚠️ No token available, skipping fetch");
            return;
        }

        console.log(`📥 Fetching tasks - Page: ${page}, Append: ${append}, Search: "${search}", Token: ${storedToken ? "✅" : "❌"}, BaseUrl: ${baseUrl}`);

        try {
            if (!append) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            let filters = `page=${page}`;

            // Add search query if provided
            if (search && search.trim() !== "") {
                filters += `&q[title_or_task_code_or_responsible_person_name_cont]=${encodeURIComponent(search.trim())}`;
            }

            const url = `https://${baseUrl}/task_managements.json?${filters}&token=${storedToken}`;
            console.log("🌐 API URL:", url);

            const response = await axios.get(url);

            const tasksData = response.data?.task_managements || [];
            const transformedData = tasksData.map((task: any) => ({
                id: task.id,
                taskCode: task.task_code,
                title: task.title,
                status: task.status,
                projectStatus: task.project_status_name,
                responsible: task.responsible_person_name,
                completionPercent: task.completion_percentage,
                startDate: task.expected_start_date,
                endDate: task.target_date,
                priority: task.priority,
                totalSubtasks: task.total_sub_task_count,
                totalIssues: task.total_issues_count,
                duration: task.duration,
                estimatedHours: task.estimated_hour,
                projectName: task.project_management_title,
                milestoneName: task.milestone_title,
            }));

            if (append) {
                setTasks(prevTasks => [...prevTasks, ...transformedData]);
            } else {
                setTasks(transformedData);
            }

            const paginationData = response.data?.pagination;
            setCurrentPage(paginationData?.current_page || page);
            setNextPage(paginationData?.next_page || null);
            setTotalCount(paginationData?.total_count || 0);
            setHasMore(paginationData?.next_page !== null && paginationData?.next_page !== undefined);

            console.log(`✅ Tasks loaded successfully:`, {
                tasksCount: transformedData.length,
                currentPage: paginationData?.current_page,
                nextPage: paginationData?.next_page,
                totalCount: paginationData?.total_count,
                hasMore: paginationData?.next_page !== null
            });

        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [baseUrl, storedToken]);

    // Debounce search term (wait 500ms after user stops typing)
    useEffect(() => {
        console.log("📝 Search term changed:", searchTerm);

        // Clear previous timeout
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }

        // Set new timeout
        searchDebounceRef.current = setTimeout(() => {
            console.log("🔍 Debounced search triggered:", searchTerm);
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        // Cleanup on unmount
        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
        };
    }, [searchTerm]);

    // Fetch tasks on mount and when debounced search term changes
    useEffect(() => {
        console.log("📍 Fetch useEffect triggered", { storedToken, debouncedSearchTerm });
        if (storedToken) {
            console.log("✅ Token available, fetching tasks");
            setCurrentPage(1);
            setNextPage(2);
            setHasMore(true);
            fetchTasks(1, debouncedSearchTerm);
        } else {
            console.warn("⚠️ Waiting for token...");
        }
    }, [storedToken, debouncedSearchTerm, fetchTasks]);

    // Handle infinite scroll - Use a simpler approach without all dependencies
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (loading || loadingMore || !hasMore || !nextPage) {
                return;
            }

            const { scrollTop, scrollHeight, clientHeight } = container;
            const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

            console.log('📊 Scroll:', {
                scrollTop,
                scrollHeight,
                clientHeight,
                distanceFromBottom,
                hasMore,
                nextPage,
                canLoad: distanceFromBottom < 300
            });

            // Trigger fetch when within 300px of bottom
            if (distanceFromBottom < 300) {
                console.log('🔄 Loading page:', nextPage);
                fetchTasks(nextPage, debouncedSearchTerm, true);
            }
        };

        // Use passive listener for better performance
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [loading, loadingMore, hasMore, nextPage, debouncedSearchTerm, fetchTasks]);

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

            const response = await axios.patch(
                `https://${baseUrl}/task_managements/${id}.json?token=${storedToken}`,
                payload,
                {}
            );

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
            "active": "APPROVED",
            "in_progress": "IN PROGRESS",
            "completed": "CLOSED",
            "on_hold": "ON HOLD",
            "overdue": "OVERDUE",
        };
        return statusMap[status] || status.toUpperCase();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return { bg: "bg-yellow-400", text: "text-white" };
            case "completed":
                return { bg: "bg-green-600", text: "text-white" };
            case "in_progress":
                return { bg: "bg-blue-500", text: "text-white" };
            case "on_hold":
                return { bg: "bg-orange-400", text: "text-white" };
            case "overdue":
                return { bg: "bg-red-500", text: "text-white" };
            default:
                return { bg: "bg-gray-400", text: "text-white" };
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
                <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
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

            {/* Tasks List - Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {loading && tasks.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
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
                                        <span className="bg-pink-200 text-pink-700 px-3 py-1 rounded-full font-semibold text-sm">
                                            #{task.id}
                                        </span>
                                    </div>
                                    <span className={`${statusColor.bg} ${statusColor.text} px-4 py-1 rounded-lg font-semibold text-sm`}>
                                        {displayStatus}
                                    </span>
                                </div>

                                {/* Title and Task Code */}
                                <div className="mb-4">
                                    <h2 className="text-lg font-bold text-gray-900">{task.title}</h2>
                                    <p className="text-sm text-gray-500">Task Code : {task.taskCode || "-"}</p>
                                </div>

                                {/* Project and Milestone Info */}
                                {(task.projectName || task.milestoneName) && (
                                    <div className="mb-4 pb-4 border-t border-gray-200 pt-4">
                                        {task.projectName && (
                                            <p className="text-xs text-gray-600 mb-1">
                                                <span className="font-semibold">Project:</span> {task.projectName}
                                            </p>
                                        )}
                                        {task.milestoneName && (
                                            <p className="text-xs text-gray-600">
                                                <span className="font-semibold">Milestone:</span> {task.milestoneName}
                                            </p>
                                        )}
                                    </div>
                                )}

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
                                        <span>📋 {task.totalSubtasks || 0}</span>
                                        <span>⚠️ {task.totalIssues || 0}</span>
                                        <span>⏱️ {task.estimatedHours || 0}h</span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            className="p-0"
                                            onClick={() => navigate(`/mobile-tasks/${task.id}`)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No tasks found</p>
                    </div>
                )}

                {/* Loading More Indicator */}
                {loadingMore && (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {/* No More Tasks Message */}
                {!hasMore && tasks.length > 0 && (
                    <div className="text-center py-4">
                        <p className="text-gray-400 text-sm">No more tasks to load</p>
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

export default TasksMobileView
