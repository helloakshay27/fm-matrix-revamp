import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Download, Eye, LogOut, Search } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const MilestoneMobileView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
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

    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch milestones from API
    const fetchMilestones = useCallback(async (page = 1, search = "") => {
        if (!storedToken || !id) {
            console.warn("⚠️ No token or project ID available");
            return;
        }

        try {
            setLoading(true);

            let filters = `q[project_management_id_eq]=${id}&page=${page}`;

            // Add search query if provided
            if (search && search.trim() !== "") {
                filters += `&q[title_or_milestone_code_or_owner_name_cont]=${encodeURIComponent(search.trim())}`;
            }

            const response = await axios.get(
                `https://${baseUrl}/milestones.json?${filters}&token=${storedToken}`,
                {}
            );

            const milestonesData = response.data || [];
            const transformedData = milestonesData.map((milestone: any) => ({
                id: milestone.id,
                milestoneCode: milestone.milestone_code,
                title: milestone.title,
                status: milestone.status,
                owner: milestone.owner_name,
                completionPercent: milestone.completion_percent,
                startDate: milestone.start_date,
                endDate: milestone.end_date,
                priority: milestone.priority,
                totalTasks: milestone.total_task_count,
                totalIssues: milestone.total_issues_count,
            }));

            setMilestones(transformedData);

            const paginationData = response.data?.pagination;
            setHasMore(page < (paginationData?.total_pages || 1));
            setCurrentPage(page);

        } catch (error) {
            console.error("Error fetching milestones:", error);
            toast.error("Failed to load milestones");
        } finally {
            setLoading(false);
        }
    }, [baseUrl, storedToken, id]);

    // Fetch milestones on mount and when search term changes
    useEffect(() => {
        if (storedToken && id) {
            setCurrentPage(1);
            setHasMore(true);
            fetchMilestones(1, searchTerm);
        }
    }, [storedToken, id, searchTerm, fetchMilestones]);

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
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="ghost" className="p-0" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">Milestones</h1>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search milestones..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Milestones List */}
            <div className="space-y-4">
                {loading && milestones.length === 0 ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : milestones.length > 0 ? (
                    milestones.map((milestone) => {
                        const statusColor = getStatusColor(milestone.status);
                        const displayStatus = transformStatus(milestone.status);
                        return (
                            <div
                                key={milestone.id}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                {/* Header with ID and Status */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-pink-200 text-pink-700 px-3 py-1 rounded-full font-semibold text-sm">
                                            #{milestone.id}
                                        </span>
                                    </div>
                                    <span className={`${statusColor.bg} ${statusColor.text} px-4 py-1 rounded-lg font-semibold text-sm`}>
                                        {displayStatus}
                                    </span>
                                </div>

                                {/* Title and Milestone Code */}
                                <div className="mb-4">
                                    <h2 className="text-lg font-bold text-gray-900">{milestone.title}</h2>
                                    <p className="text-sm text-gray-500">Milestone Code : {milestone.milestoneCode || "-"}</p>
                                </div>

                                {/* Owner and Priority */}
                                <div className="mb-4">
                                    <p className="text-sm text-gray-700 mb-1">
                                        <span className="font-semibold">Owner :</span> {milestone.owner || "-"}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Priority :</span> {milestone.priority ? milestone.priority.charAt(0).toUpperCase() + milestone.priority.slice(1) : "-"}
                                    </p>
                                </div>

                                {/* Completion and Dates */}
                                <div className="mb-4 pb-4 border-b border-gray-200">
                                    <p className="text-sm text-gray-700 mb-2">
                                        <span className="font-semibold">Progress :</span> {milestone.completionPercent || 0}%
                                    </p>
                                    <div className="flex gap-2 text-xs text-gray-600">
                                        <span>{milestone.startDate ? new Date(milestone.startDate).toLocaleDateString("en-GB") : "-"}</span>
                                        <span>→</span>
                                        <span>{milestone.endDate ? new Date(milestone.endDate).toLocaleDateString("en-GB") : "-"}</span>
                                    </div>
                                </div>

                                {/* Stats and Actions */}
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-3 text-xs text-gray-600">
                                        <span>✓ {milestone.totalTasks}</span>
                                        <span>⚠️ {milestone.totalIssues}</span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            className="p-0"
                                            onClick={() => navigate(`/mobile-projects/${id}/milestones/${milestone.id}`)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" className="p-0" onClick={() => navigate(`/mobile-projects/${id}/milestones/${milestone.id}/tasks`)}>
                                            <LogOut className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No milestones found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MilestoneMobileView