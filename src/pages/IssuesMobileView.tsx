import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState, useCallback, useRef } from "react";
import { Download, Eye, LogOut, Search, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const IssuesMobileView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");

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

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Fetch issues from API
    const fetchIssues = useCallback(async (page = 1, search = "", append = false) => {
        const tokenToUse = token || storedToken;
        if (!tokenToUse) {
            console.warn("⚠️ No token available");
            return;
        }

        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            let filters = `page=${page}`;

            // Add search query if provided
            if (search && search.trim() !== "") {
                filters += `&q[title_or_description_or_issue_type_name_cont]=${encodeURIComponent(search.trim())}`;
            }

            const response = await axios.get(
                `https://${baseUrl}/issues.json?${filters}&token=${tokenToUse}`
            );

            const issuesData = response.data?.issues || [];
            const transformedData = issuesData.map((issue: any) => ({
                id: issue.id,
                title: issue.title,
                description: issue.description,
                status: issue.status,
                issueType: issue.issue_type_name,
                priority: issue.priority,
                assignedTo: issue.responsible_person?.name || issue.assigned_to,
                createdBy: issue.created_by?.name || "-",
                createdAt: issue.created_at,
                updatedAt: issue.updated_at,
                startDate: issue.start_date,
                dueDate: issue.due_date || issue.end_date,
                projectName: issue.project_management_name,
                milestoneName: issue.milstone_name,
                taskName: issue.task_management_name,
            }));

            if (append) {
                setIssues((prevIssues) => [...prevIssues, ...transformedData]);
            } else {
                setIssues(transformedData);
            }

            const paginationData = response.data?.pagination;
            setTotalPages(paginationData?.total_pages || 1);
            setHasMore(page < (paginationData?.total_pages || 1));
            setCurrentPage(page);

        } catch (error) {
            console.error("Error fetching issues:", error);
            toast.error("Failed to load issues");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [baseUrl, token, storedToken]);

    // Handle infinite scroll
    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

        // If scrolled near bottom and not already loading more
        if (scrollHeight - scrollTop - clientHeight < 500 && !loadingMore && hasMore) {
            fetchIssues(currentPage + 1, searchTerm, true);
        }
    }, [currentPage, searchTerm, loadingMore, hasMore, fetchIssues]);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
            return () => scrollContainer.removeEventListener("scroll", handleScroll);
        }
    }, [handleScroll]);

    // Fetch issues on mount and when search term changes
    useEffect(() => {
        const tokenToUse = token || storedToken;
        if (tokenToUse) {
            setCurrentPage(1);
            setHasMore(true);
            fetchIssues(1, searchTerm);
        }
    }, [token, storedToken, searchTerm, fetchIssues]);

    // Transform status to match card display
    const transformStatus = (status: string): string => {
        const statusMap: Record<string, string> = {
            "open": "OPEN",
            "in_progress": "IN PROGRESS",
            "closed": "CLOSED",
            "on_hold": "ON HOLD",
            "resolved": "RESOLVED",
            "pending": "PENDING",
        };
        return statusMap[status] || status.toUpperCase();
    };

    // Transform priority
    const transformPriority = (priority: string): string => {
        const priorityMap: Record<string, string> = {
            "high": "HIGH",
            "medium": "MEDIUM",
            "low": "LOW",
            "critical": "CRITICAL",
        };
        return priorityMap[priority] || priority.toUpperCase();
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "open":
                return { bg: "bg-red-500", text: "text-white" };
            case "in_progress":
                return { bg: "bg-blue-500", text: "text-white" };
            case "closed":
                return { bg: "bg-green-600", text: "text-white" };
            case "resolved":
                return { bg: "bg-green-500", text: "text-white" };
            case "on_hold":
                return { bg: "bg-orange-400", text: "text-white" };
            case "pending":
                return { bg: "bg-yellow-400", text: "text-white" };
            default:
                return { bg: "bg-gray-400", text: "text-white" };
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case "critical":
                return { bg: "bg-red-600", text: "text-white" };
            case "high":
                return { bg: "bg-orange-500", text: "text-white" };
            case "medium":
                return { bg: "bg-yellow-500", text: "text-white" };
            case "low":
                return { bg: "bg-green-500", text: "text-white" };
            default:
                return { bg: "bg-gray-400", text: "text-white" };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 flex flex-col">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
                <button
                    onClick={() => navigate('/mobile-issues/add')}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors"
                    title="Add Issue"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Issues List - Scrollable Container */}
            <div ref={scrollContainerRef} className="flex-1 space-y-4 overflow-y-auto pr-1"
                style={{ scrollBehavior: 'smooth' }}>
                {loading && issues.length === 0 ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : issues.length > 0 ? (
                    <>
                        {issues.map((issue) => {
                            const statusColor = getStatusColor(issue.status);
                            const priorityColor = getPriorityColor(issue.priority);
                            const displayStatus = transformStatus(issue.status);
                            const displayPriority = transformPriority(issue.priority);

                            return (
                                <div
                                    key={issue.id}
                                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                >
                                    {/* Header with ID and Status */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-pink-200 text-pink-700 px-3 py-1 rounded-full font-semibold text-sm">
                                                #{issue.id}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`${statusColor.bg} ${statusColor.text} px-3 py-1 rounded-lg font-semibold text-xs`}>
                                                {displayStatus}
                                            </span>
                                            <span className={`${priorityColor.bg} ${priorityColor.text} px-3 py-1 rounded-lg font-semibold text-xs`}>
                                                {displayPriority}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title and Description */}
                                    <div className="mb-4">
                                        <h2 className="text-lg font-bold text-gray-900">{issue.title}</h2>
                                        {issue.description && (
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{issue.description}</p>
                                        )}
                                    </div>

                                    {/* Issue Type and Assigned To */}
                                    <div className="mb-4">
                                        {issue.issueType && (
                                            <p className="text-sm text-gray-700 mb-1">
                                                <span className="font-semibold">Type :</span> {issue.issueType}
                                            </p>
                                        )}
                                        {issue.status && (
                                            <p className="text-sm text-gray-700 mb-1">
                                                <span className="font-semibold">Status :</span> {transformStatus(issue.status)}
                                            </p>
                                        )}
                                        {issue.priority && (
                                            <p className="text-sm text-gray-700 mb-1">
                                                <span className="font-semibold">Priority :</span> {transformPriority(issue.priority)}
                                            </p>
                                        )}
                                        {issue.assignedTo && (
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold">Assigned To :</span> {issue.assignedTo}
                                            </p>
                                        )}
                                    </div>

                                    {/* Project, Milestone, Task Info */}
                                    {(issue.projectName || issue.milestoneName || issue.taskName) && (
                                        <div className="mb-4 pb-4 border-b border-gray-200">
                                            {issue.projectName && (
                                                <p className="text-sm text-gray-600 mb-1">
                                                    <span className="font-semibold">Project :</span> {issue.projectName}
                                                </p>
                                            )}
                                            {issue.milestoneName && (
                                                <p className="text-sm text-gray-600 mb-1">
                                                    <span className="font-semibold">Milestone :</span> {issue.milestoneName}
                                                </p>
                                            )}
                                            {issue.taskName && (
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-semibold">Task :</span> {issue.taskName}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Dates */}
                                    <div className="mb-4 pb-4 border-b border-gray-200">
                                        <div className="flex gap-4 text-xs text-gray-600">
                                            {issue.startDate && (
                                                <span>Start: {new Date(issue.startDate).toLocaleDateString("en-GB")}</span>
                                            )}
                                            {issue.dueDate && (
                                                <span>Due: {new Date(issue.dueDate).toLocaleDateString("en-GB")}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-500">
                                            Created: {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString("en-GB") : "-"}
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <Button variant="ghost" className="p-0" onClick={() => navigate(`/mobile-issues/${issue.id}`)}>
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Loading More Indicator */}
                        {loadingMore && (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        )}

                        {/* End of List Message */}
                        {!hasMore && issues.length > 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No more issues to load</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No issues found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default IssuesMobileView
