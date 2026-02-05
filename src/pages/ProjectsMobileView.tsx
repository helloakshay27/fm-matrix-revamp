import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState, useCallback, useRef } from "react";
import { Download, Eye, LogOut, Search } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const ProjectsMobileView = () => {
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

    // Fallback to localStorage if token is not in URL
    if (!token) {
        token = localStorage.getItem('token') || sessionStorage.getItem('mobile_token');
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

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch projects from API
    const fetchProjects = useCallback(async (page = 1, search = "") => {
        if (!storedToken) {
            console.warn("⚠️ No token available");
            return;
        }

        try {
            setLoading(true);

            let filters = `page=${page}`;

            // Add search query if provided
            if (search && search.trim() !== "") {
                filters += `&q[title_or_project_code_or_project_owner_name_cont]=${encodeURIComponent(search.trim())}`;
            }

            const response = await axios.get(
                `https://${baseUrl}/project_managements.json?${filters}&token=${token}`
            );

            const projectsData = response.data?.project_managements || [];
            const transformedData = projectsData.map((project: any) => ({
                id: project.id,
                projectCode: project.project_code,
                title: project.title,
                status: project.status,
                projectType: project.project_type_name,
                manager: project.project_owner_name,
                completionPercent: project.completion_percent,
                startDate: project.start_date,
                endDate: project.end_date,
                priority: project.priority,
                totalMilestones: project.total_milestone_count,
                totalTasks: project.total_task_management_count,
                totalSubtasks: project.total_sub_task_management_count,
                totalIssues: project.total_issues_count,
            }));

            setProjects((prevProjects) => {
                return page === 1 ? transformedData : [...prevProjects, ...transformedData];
            });

            const paginationData = response.data?.pagination;
            setHasMore(page < (paginationData?.total_pages || 1));
            // Ensure currentPage is updated here too in case it wasn't by the observer (e.g. initial load)
            // But main driver is the local state if we use observer

        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to load projects");
        } finally {
            setLoading(false);
        }
    }, [baseUrl, storedToken, token]); // Added token to deps as it is used in URL

    // Observer for infinite scroll
    const observer = useRef<IntersectionObserver | null>(null);
    const lastProjectElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                console.log("Load more triggered");
                setCurrentPage(prevPage => {
                    const nextPage = prevPage + 1;
                    fetchProjects(nextPage, searchTerm);
                    return nextPage;
                });
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, fetchProjects, searchTerm]);

    // Fetch projects on mount and when search term changes
    useEffect(() => {
        if (storedToken) {
            setCurrentPage(1);
            setHasMore(true);
            setProjects([]); // Clear projects for new search
            fetchProjects(1, searchTerm);
        }
    }, [storedToken, searchTerm, fetchProjects]);

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
                return { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-600" };
            case "completed":
                return { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-600" };
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
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Projects</h1>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Permits List */}
            <div className="space-y-4">
                {projects.length === 0 && loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : projects.length > 0 ? (
                    <>
                        {projects.map((project: any, index: number) => {
                            const statusColor = getStatusColor(project.status);
                            const displayStatus = transformStatus(project.status);

                            // Attach ref to the last element
                            if (projects.length === index + 1) {
                                return (
                                    <div
                                        ref={lastProjectElementRef}
                                        key={project.id}
                                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                    >
                                        {/* Header with ID and Status */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full font-medium text-xs">
                                                    PROJECT-{project.id}
                                                </span>
                                            </div>
                                            <span className={`${statusColor.bg} ${statusColor.text} pl-2 pr-3 py-1 rounded-full font-medium text-xs flex items-center gap-1.5`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot}`} />
                                                {displayStatus}
                                            </span>
                                        </div>

                                        {/* Title and Project Code */}
                                        <div className="mb-4">
                                            <h2 className="text-lg font-bold text-gray-900">{project.title}</h2>
                                            <p className="text-sm text-gray-500">Project Code : {project.projectCode || "-"}</p>
                                        </div>

                                        {/* Project Type and Manager */}
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-700 mb-1">
                                                <span className="font-semibold">Type :</span> {project.projectType || "-"}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold">Manager :</span> {project.manager}
                                            </p>
                                        </div>

                                        {/* Completion and Dates */}
                                        <div className="mb-4 pb-4 border-b border-gray-200">
                                            <p className="text-sm text-gray-700 mb-2">
                                                <span className="font-semibold">Progress :</span> {project.completionPercent || 0}%
                                            </p>
                                            <div className="flex gap-2 text-xs text-gray-600">
                                                <span>{project.startDate ? new Date(project.startDate).toLocaleDateString("en-GB") : "-"}</span>
                                                <span>→</span>
                                                <span>{project.endDate ? new Date(project.endDate).toLocaleDateString("en-GB") : "-"}</span>
                                            </div>
                                        </div>

                                        {/* Stats and Download */}
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold">Manager :</span> {project.manager}
                                            </p>

                                            <div className="flex items-center gap-4">
                                                <Button variant="ghost" className="p-0" onClick={() => navigate(`/mobile-projects/${project.id}`)}>
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" className="p-0" onClick={() => navigate(`/mobile-projects/${project.id}/milestones`)}>
                                                    <LogOut className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        key={project.id}
                                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                    >
                                        {/* Header with ID and Status */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full font-medium text-xs">
                                                    PROJECT-{project.id}
                                                </span>
                                            </div>
                                            <span className={`${statusColor.bg} ${statusColor.text} pl-2 pr-3 py-1 rounded-full font-medium text-xs flex items-center gap-1.5`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot}`} />
                                                {displayStatus}
                                            </span>
                                        </div>

                                        {/* Title and Project Code */}
                                        <div className="mb-4">
                                            <h2 className="text-lg font-bold text-gray-900">{project.title}</h2>
                                            <p className="text-sm text-gray-500">Project Code : {project.projectCode || "-"}</p>
                                        </div>

                                        {/* Project Type and Manager */}
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-700 mb-1">
                                                <span className="font-semibold">Type :</span> {project.projectType || "-"}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold">Manager :</span> {project.manager}
                                            </p>
                                        </div>

                                        {/* Completion and Dates */}
                                        <div className="mb-4 pb-4 border-b border-gray-200">
                                            <p className="text-sm text-gray-700 mb-2">
                                                <span className="font-semibold">Progress :</span> {project.completionPercent || 0}%
                                            </p>
                                            <div className="flex gap-2 text-xs text-gray-600">
                                                <span>{project.startDate ? new Date(project.startDate).toLocaleDateString("en-GB") : "-"}</span>
                                                <span>→</span>
                                                <span>{project.endDate ? new Date(project.endDate).toLocaleDateString("en-GB") : "-"}</span>
                                            </div>
                                        </div>

                                        {/* Stats and Download */}
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold">Manager :</span> {project.manager}
                                            </p>

                                            <div className="flex items-center gap-4">
                                                <Button variant="ghost" className="p-0" onClick={() => navigate(`/mobile-projects/${project.id}`)}>
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" className="p-0" onClick={() => navigate(`/mobile-projects/${project.id}/milestones`)}>
                                                    <LogOut className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                        {loading && (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No projects found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProjectsMobileView
