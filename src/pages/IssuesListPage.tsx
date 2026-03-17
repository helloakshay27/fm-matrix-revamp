import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { cache } from "@/utils/cacheUtils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchIssues, updateIssue } from "@/store/slices/issueSlice";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Filter } from "lucide-react";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import AddIssueModal from "@/components/AddIssueModal";
import IssueFilterModal from "@/components/IssueFilterModal";
import { FormControl, MenuItem, Select, Switch, Dialog, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { useLayout } from "@/contexts/LayoutContext";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import qs from "qs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { CommonImportModal } from "@/components/CommonImportModal";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface Issue {
    id?: string;
    project_name?: string;
    milestone_name?: string;
    task_name?: string;
    sub_task_name?: string;
    title?: string;
    description?: string;
    issue_type?: string;
    priority?: string;
    status?: string;
    assigned_to?: string;
    raised_by?: string;
    created_by?: string;
    created_at?: string;
    updated_at?: string;
    start_date?: string;
    due_date?: string;
    project_id?: string;
    milestone_id?: string;
    task_id?: string;
    comment?: string;
}

const columns: ColumnConfig[] = [
    {
        key: "id",
        label: "ID",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "project_name",
        label: "Project Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "milestone_name",
        label: "Milestone Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "task_name",
        label: "Task Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "sub_task_name",
        label: "Subtask Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "title",
        label: "Title",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "issue_type",
        label: "Type",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "priority",
        label: "Priority",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "status",
        label: "Status",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "assigned_to",
        label: "Responsible Person",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "raised_by",
        label: "Raised By",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "start_date",
        label: "Start Date",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "due_date",
        label: "End Date",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "comment",
        label: "Comment",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
];

const ISSUSE_STATUS = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "reopen", label: "Reopen" },
    { value: "closed", label: "Closed" },
];

const IssuesListPage = ({
    preSelectedProjectId,
}: { preSelectedProjectId?: string } = {}) => {
    const { setCurrentSection } = useLayout();
    const navigate = useNavigate();
    const location = useLocation();
    const { shouldShow } = useDynamicPermissions();
    const { id: projectId } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    // URL search params
    const searchParams = new URLSearchParams(location.search);
    const projectIdParam = searchParams.get("project_id");
    const milestoneIdParam = searchParams.get("milestone_id");
    const taskIdParam = searchParams.get("task_id");

    const view = localStorage.getItem("selectedView");

    useEffect(() => {
        setCurrentSection(
            view === "admin" ? "Value Added Services" : "Project Task"
        );
    }, [setCurrentSection]);

    const { data, loading } = useAppSelector(
        (state) => state.fetchIssues || { data: { issues: [] }, loading: false }
    );
    const rawIssues = Array.isArray((data as any)?.issues)
        ? (data as any).issues
        : [];

    // Filter and search state - Declare early to avoid usage before declaration
    const [filterSuccess, setFilterSuccess] = useState(false);
    const [filteredIssues, setFilteredIssues] = useState<any[]>([]);
    const [filteredLoading, setFilteredLoading] = useState(false);
    const [showMyIssuesOnly, setShowMyIssuesOnly] = useState(true);
    const [appliedFilters, setAppliedFilters] = useState(""); // For IssueFilterModal
    const [showActionPanel, setShowActionPanel] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [importErrors, setImportErrors] = useState<Array<{ row: number; errors: string[] }>>([]);
    const [importResults, setImportResults] = useState({ created: 0, failed: 0 });
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_count: 0,
        total_pages: 0,
    });

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [columnOrder, setColumnOrder] = useState<string[]>(() => {
        const savedOrder = localStorage.getItem("issuesTableColumnOrder");
        return savedOrder
            ? JSON.parse(savedOrder)
            : [
                "id",
                "project_name",
                "milestone_name",
                "task_name",
                "sub_task_name",
                "title",
                "issue_type",
                "priority",
                "status",
                "assigned_to",
                "start_date",
                "due_date",
            ];
    });

    // Extract pagination data from Redux response
    useEffect(() => {
        if (data && typeof data === 'object') {
            const paginationData = {
                current_page: (data as any).pagination?.current_page || 1,
                total_count: (data as any).pagination?.total_count || 0,
                total_pages: (data as any).pagination?.total_pages || 0,
            };
            setPagination(paginationData);
        }
    }, [data]);

    console.log(pagination)

    // Fetch control refs
    const allIssuesFetchInitiatedRef = useRef(false);
    const prevParamsRef = useRef({
        projectId: null,
        projectIdParam: null,
        taskIdParam: null,
        milestoneIdParam: null,
    });

    // Map API response to table format
    const mapIssueData = (issue: any): Issue => {
        return {
            id: issue.id?.toString() || "",
            project_name: issue.project_management_name || "Not Selected",
            milestone_name: issue.milstone_name || "Not Selected",
            task_name: issue.task_management_name || "Not Selected",
            sub_task_name: issue.sub_task_management_name || "Not Selected",
            title: issue.title || "",
            description: issue.description || "",
            issue_type: issue.issue_type || "",
            priority: issue.priority || "",
            status: issue.status || "Open",
            assigned_to: issue.responsible_person_id,
            raised_by: issue?.created_by?.name,
            created_by: issue.created_by?.full_name || issue.created_by_name || "",
            created_at: issue.created_at || "",
            updated_at: issue.updated_at || "",
            start_date: issue.start_date
                ? new Date(issue.start_date).toLocaleDateString()
                : "",
            due_date: issue.end_date
                ? new Date(issue.end_date).toLocaleDateString()
                : issue.target_date
                    ? new Date(issue.target_date).toLocaleDateString()
                    : "",
            project_id: issue.project_management_id || issue.project_id || "",
            milestone_id: issue.milestone_id || "",
            task_id: issue.task_management_id || issue.task_id || "",
            comment: issue.comments[issue.comments.length - 1]?.body || "",
        };
    };

    // Determine which issues to display based on filters/search
    const displayIssues = useMemo(() => {
        let issuesToDisplay;

        // If showing my issues only, use filtered issues
        if (showMyIssuesOnly) {
            issuesToDisplay =
                filterSuccess && Array.isArray(filteredIssues) ? filteredIssues : [];
        }
        // If search is active, use filtered issues
        else if (searchQuery.trim()) {
            issuesToDisplay =
                filterSuccess && Array.isArray(filteredIssues) ? filteredIssues : [];
        }
        // If projectId from prop or URL param is provided, use filtered issues
        else if (projectId || projectIdParam || taskIdParam || milestoneIdParam) {
            issuesToDisplay =
                filterSuccess && Array.isArray(filteredIssues) ? filteredIssues : [];
        }
        // Check if filters are applied (either from modal or localStorage)
        else if (
            appliedFilters ||
            localStorage.getItem("IssueFilters") ||
            localStorage.getItem("issueStatus")
        ) {
            issuesToDisplay =
                filterSuccess && Array.isArray(filteredIssues) ? filteredIssues : [];
        } else {
            issuesToDisplay = rawIssues;
        }

        return Array.isArray(issuesToDisplay) ? issuesToDisplay : [];
    }, [
        rawIssues,
        filteredIssues,
        filterSuccess,
        searchQuery,
        projectId,
        projectIdParam,
        taskIdParam,
        milestoneIdParam,
        showMyIssuesOnly,
        appliedFilters,
    ]);

    const issues: Issue[] = displayIssues.map(mapIssueData);

    const [users, setUsers] = useState([]);
    const [issueTypeOptions, setIssueTypeOptions] = useState([]);
    const [projects, setProjects] = useState([]);
    const [openIssueModal, setOpenIssueModal] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    // Helper function to perform filtered fetch - defined early to be used in useEffects
    const performFilteredFetch = useCallback(
        async (filterOrString: any, page: number = 1) => {
            try {
                setFilteredLoading(true);
                let filterString: string;

                if (typeof filterOrString === "string") {
                    filterString = filterOrString;
                } else {
                    let filter = filterOrString;
                    // Add responsible_person_id_eq if showing my issues only
                    if (showMyIssuesOnly) {
                        const user = JSON.parse(localStorage.getItem("user") || "{}");
                        if (user.id) {
                            filter["q[responsible_person_id_eq]"] = user.id.toString();
                        }
                    }
                    filterString = qs.stringify(filter);
                }

                // Add responsible_person_id_eq if showing my issues only and not already in string
                if (showMyIssuesOnly && !filterString.includes("responsible_person_id_eq")) {
                    const user = JSON.parse(localStorage.getItem("user") || "{}");
                    if (user.id) {
                        filterString += (filterString ? "&" : "") + `q[responsible_person_id_eq]=${user.id.toString()}`;
                    }
                }

                // Build the complete query string with page parameter upfront
                const queryString = `page=${page}${filterString ? `&${filterString}` : ""}`;

                // Fetch filtered issues directly without caching
                const response = await axios.get(
                    `https://${baseUrl}/issues.json?${queryString}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setFilteredIssues(response.data.issues || []);
                setPagination({
                    current_page: response.data.pagination.current_page || page,
                    total_count: response.data.pagination.total_count || 0,
                    total_pages: response.data.pagination.total_pages || 0,
                });
                setFilterSuccess(true);
            } catch (error) {
                console.error("Error fetching filtered issues:", error);
                toast.error("Failed to fetch filtered issues");
                setFilteredIssues([]);
                setPagination({
                    current_page: 1,
                    total_count: 0,
                    total_pages: 0,
                });
            } finally {
                setFilteredLoading(false);
            }
        },
        [baseUrl, token, projectId, projectIdParam, taskIdParam, milestoneIdParam, showMyIssuesOnly]
    );

    const getUsers = useCallback(async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data.users);
        } catch (error) {
            console.log(error);
        }
    }, [baseUrl, token]);

    const getProjects = useCallback(async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/project_managements.json`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const projectsList = response.data?.project_managements || response.data?.data?.project_managements || [];
            setProjects(projectsList);
        } catch (error) {
            console.log("Error fetching projects:", error);
        }
    }, [baseUrl, token]);

    useEffect(() => {
        if (token && baseUrl) {
            getUsers();
            getProjects();
        }
    }, [token, baseUrl, getUsers, getProjects]);

    // Handle showMyIssuesOnly toggle
    useEffect(() => {
        if (!projectId && !projectIdParam && !taskIdParam && !milestoneIdParam && !searchQuery.trim()) {
            allIssuesFetchInitiatedRef.current = false;
            setFilterSuccess(false);
            setFilteredIssues([]);
        }
    }, [showMyIssuesOnly, projectId, projectIdParam, taskIdParam, milestoneIdParam, searchQuery]);

    // Listen for global issue-created events to force refetch (ensures GET /issues.json runs)
    useEffect(() => {
        const handler = () => {
            allIssuesFetchInitiatedRef.current = false;
            dispatch(fetchIssues({ baseUrl, token, id: projectId, page: pagination.current_page }));
        };
        window.addEventListener("issues:created", handler as EventListener);
        return () =>
            window.removeEventListener("issues:created", handler as EventListener);
    }, [dispatch, baseUrl, token, projectId]);

    // Immediately fetch when parameters change or on initial mount with parameters
    useEffect(() => {
        const paramsChanged =
            prevParamsRef.current.projectId !== projectId ||
            prevParamsRef.current.projectIdParam !== projectIdParam ||
            prevParamsRef.current.taskIdParam !== taskIdParam ||
            prevParamsRef.current.milestoneIdParam !== milestoneIdParam;

        if (paramsChanged) {
            allIssuesFetchInitiatedRef.current = false;
            setFilterSuccess(false);
            setFilteredIssues([]);
            prevParamsRef.current = { projectId, projectIdParam, taskIdParam, milestoneIdParam };
        }

        // Trigger fetch immediately when parameters are present
        if ((projectId || projectIdParam || taskIdParam || milestoneIdParam) && baseUrl && token) {
            const filter = {
                "q[project_management_id_eq]": projectId || projectIdParam || "",
                "q[task_management_id_eq]": taskIdParam || "",
                "q[milestone_id_eq]": milestoneIdParam || "",
            };
            performFilteredFetch(filter, 1);
            setPagination((prev) => ({ ...prev, current_page: 1 }));
        }
    }, [projectId, projectIdParam, taskIdParam, milestoneIdParam, baseUrl, token, performFilteredFetch]);

    // Advanced filtering with search
    useEffect(() => {
        if (searchQuery.trim()) {
            const filter = {
                "q[title_or_project_management_title_cont]": searchQuery,
                ...(projectId && { "q[project_management_id_eq]": projectId }),
                ...(projectIdParam && {
                    "q[project_management_id_eq]": projectIdParam,
                }),
                ...(taskIdParam && { "q[task_management_id_eq]": taskIdParam }),
                ...(milestoneIdParam && { "q[milestone_id_eq]": milestoneIdParam }),
            };

            performFilteredFetch(filter, 1);
            setPagination((prev) => ({ ...prev, current_page: 1 }));
        } else {
            // If search is cleared, reset to initial fetch
            allIssuesFetchInitiatedRef.current = false;
        }
    }, [searchQuery, projectId, projectIdParam, taskIdParam, milestoneIdParam, performFilteredFetch]);

    // Fetch all issues only when no parameters and haven't fetched yet
    useEffect(() => {
        // Only fetch all issues if no projectId/taskId parameters and we haven't already
        if (
            !projectId &&
            !projectIdParam &&
            !taskIdParam &&
            !milestoneIdParam &&
            !searchQuery.trim() &&
            !allIssuesFetchInitiatedRef.current &&
            baseUrl &&
            token
        ) {
            if (showMyIssuesOnly) {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                if (user.id) {
                    const filter = {
                        "q[responsible_person_id_eq]": user.id.toString(),
                    };
                    performFilteredFetch(filter, 1);
                    setPagination((prev) => ({ ...prev, current_page: 1 }));
                }
            } else {
                dispatch(fetchIssues({ baseUrl, token, id: "", page: pagination.current_page }));
            }
            allIssuesFetchInitiatedRef.current = true;
        }
    }, [dispatch, baseUrl, token, projectId, projectIdParam, taskIdParam, milestoneIdParam, searchQuery, showMyIssuesOnly, performFilteredFetch]);



    // Handle applied filters from IssueFilterModal
    useEffect(() => {
        if (appliedFilters !== "") {
            performFilteredFetch(appliedFilters, 1);
            setPagination((prev) => ({ ...prev, current_page: 1 }));
        }
    }, [appliedFilters, performFilteredFetch]);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/issue_types.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const issueTypes = response.data || [];
            const mappedTypes = issueTypes.map((i: any) => ({
                value: i.id,
                label: i.name,
            }));
            setIssueTypeOptions(mappedTypes);
        } catch (error) {
            console.error("Error fetching issue types:", error);
            toast.error("Failed to load issue types.");
        }
    }, [baseUrl, token]);

    useEffect(() => {
        if (baseUrl && token) {
            fetchData();
        }
    }, [baseUrl, token]);

    const handleOpenDialog = () => setOpenIssueModal(true);

    const renderActions = (item: any) => (
        <div className="flex items-center justify-center gap-2">
            {shouldShow("employee_project_issues", "show") && (
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => navigate(`/vas/issues/${item.id}`)}
                    title="View Issue Details"
                >
                    <Eye className="w-4 h-4" />
                </Button>
            )}
        </div>
    );

    const handleIssueTypeChange = async (issueId: string, newType: string) => {
        try {
            await dispatch(
                updateIssue({
                    baseUrl,
                    token,
                    id: issueId,
                    data: { issue_type: newType },
                })
            ).unwrap();
            // Invalidate cache after issue type update
            cache.invalidatePattern("issues_*");
            toast.success("Issue type updated successfully");

            // Refresh with appropriate filter
            if (localStorage.getItem("IssueFilters")) {
                const item = JSON.parse(localStorage.getItem("IssueFilters")!);
                const newFilter: any = {};

                if (item.selectedStatuses?.length > 0) {
                    newFilter["q[status_eq]"] = item.selectedStatuses[0];
                }
                if (item.selectedPriority?.length > 0) {
                    newFilter["q[priority_eq]"] = item.selectedPriority[0];
                }
                if (item.selectedTypes?.length > 0) {
                    newFilter["q[issue_type_id_eq]"] = item.selectedTypes[0];
                }
                if (item.selectedProjects?.length > 0) {
                    newFilter["q[project_management_id_in][]"] = item.selectedProjects;
                }
                if (item.selectedResponsible?.length > 0) {
                    newFilter["q[responsible_person_id_in][]"] = item.selectedResponsible;
                }
                if (item.selectedCreators?.length > 0) {
                    newFilter["q[created_by_id_in][]"] = item.selectedCreators;
                }

                const queryString = qs.stringify(newFilter, { arrayFormat: "repeat" });
                performFilteredFetch(queryString, 1);
                setPagination((prev) => ({ ...prev, current_page: 1 }));
            } else if (localStorage.getItem("issueStatus")) {
                const status = localStorage.getItem("issueStatus");
                const filter = {
                    "q[status_eq]": status,
                };
                performFilteredFetch(filter, 1);
                setPagination((prev) => ({ ...prev, current_page: 1 }));
            } else {
                allIssuesFetchInitiatedRef.current = false;
                dispatch(fetchIssues({ baseUrl, token, id: projectId, page: pagination.current_page }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleIssueUpdate = async (issueId: string, assignedToId: string) => {
        try {
            await dispatch(
                updateIssue({
                    baseUrl,
                    token,
                    id: issueId,
                    data: { responsible_person_id: assignedToId },
                })
            ).unwrap();
            // Invalidate cache after issue update
            cache.invalidatePattern("issues_*");
            if (projectId) {
                performFilteredFetch(`q[project_management_id_eq]=${projectId}`, 1);
                setPagination((prev) => ({ ...prev, current_page: 1 }));
            }
            toast.success("Issue updated successfully");

            // Refresh with appropriate filter
            if (localStorage.getItem("IssueFilters")) {
                const item = JSON.parse(localStorage.getItem("IssueFilters")!);
                const newFilter: any = {};

                if (item.selectedStatuses?.length > 0) {
                    newFilter["q[status_eq]"] = item.selectedStatuses[0];
                }
                if (item.selectedPriority?.length > 0) {
                    newFilter["q[priority_eq]"] = item.selectedPriority[0];
                }
                if (item.selectedTypes?.length > 0) {
                    newFilter["q[issue_type_id_eq]"] = item.selectedTypes[0];
                }
                if (item.selectedProjects?.length > 0) {
                    newFilter["q[project_management_id_in][]"] = item.selectedProjects;
                }
                if (item.selectedResponsible?.length > 0) {
                    newFilter["q[responsible_person_id_in][]"] = item.selectedResponsible;
                }
                if (item.selectedCreators?.length > 0) {
                    newFilter["q[created_by_id_in][]"] = item.selectedCreators;
                }

                const queryString = qs.stringify(newFilter, { arrayFormat: "repeat" });
                performFilteredFetch(queryString, 1);
                setPagination((prev) => ({ ...prev, current_page: 1 }));
            } else if (localStorage.getItem("issueStatus")) {
                const status = localStorage.getItem("issueStatus");
                const filter = {
                    "q[status_eq]": status,
                };
                performFilteredFetch(filter, 1);
                setPagination((prev) => ({ ...prev, current_page: 1 }));
            } else {
                allIssuesFetchInitiatedRef.current = false;
                dispatch(fetchIssues({ baseUrl, token, id: projectId, page: pagination.current_page }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleIssueStatusChange = async (
        issueId: string,
        newStatus: string
    ) => {
        try {
            await dispatch(
                updateIssue({
                    baseUrl,
                    token,
                    id: issueId,
                    data: { status: newStatus },
                })
            ).unwrap();
            // Invalidate cache after issue status update
            cache.invalidatePattern("issues_*");
            if (projectId) {
                performFilteredFetch(`q[project_management_id_eq]=${projectId}`, 1);
                setPagination((prev) => ({ ...prev, current_page: 1 }));
            }
            toast.success("Issue status updated successfully");

            // Refresh with appropriate filter
            if (localStorage.getItem("IssueFilters")) {
                const item = JSON.parse(localStorage.getItem("IssueFilters")!);
                const newFilter: any = {};

                if (item.selectedStatuses?.length > 0) {
                    newFilter["q[status_eq]"] = item.selectedStatuses[0];
                }
                if (item.selectedPriority?.length > 0) {
                    newFilter["q[priority_eq]"] = item.selectedPriority[0];
                }
                if (item.selectedTypes?.length > 0) {
                    newFilter["q[issue_type_id_eq]"] = item.selectedTypes[0];
                }
                if (item.selectedProjects?.length > 0) {
                    newFilter["q[project_management_id_in][]"] = item.selectedProjects;
                }
                if (item.selectedResponsible?.length > 0) {
                    newFilter["q[responsible_person_id_in][]"] = item.selectedResponsible;
                }
                if (item.selectedCreators?.length > 0) {
                    newFilter["q[created_by_id_in][]"] = item.selectedCreators;
                }

                const queryString = qs.stringify(newFilter, { arrayFormat: "repeat" });
                performFilteredFetch(queryString, 1);
                setPagination((prev) => ({ ...prev, current_page: 1 }));
            } else if (localStorage.getItem("issueStatus")) {
                const status = localStorage.getItem("issueStatus");
                const filter = {
                    "q[status_eq]": status,
                };
                performFilteredFetch(filter, 1);
                setPagination((prev) => ({ ...prev, current_page: 1 }));
            } else {
                allIssuesFetchInitiatedRef.current = false;
                dispatch(fetchIssues({ baseUrl, token, id: projectId, page: pagination.current_page }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSampleDownload = async () => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/assets/sample_issue.xlsx`,
                {
                    responseType: 'blob',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'sample_issues.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Sample format downloaded successfully');
        } catch (error) {
            console.error('Error downloading sample file:', error);
            toast.error('Failed to download sample file. Please try again.');
        }
    };

    const handleImportIssues = async () => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            const response = await axios.post(`https://${baseUrl}/issues/import_issues.json`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Parse the response
            const data = response.data;
            const importResult = data.import_result;

            const created = importResult?.created || 0;
            const failed = importResult?.failed || [];

            setImportResults({ created, failed: failed.length });

            // If there are errors, show error modal
            if (failed && failed.length > 0) {
                setImportErrors(failed);
                setIsErrorModalOpen(true);
            } else {
                // Success case - show toast and fetch data
                toast.success(`Successfully imported ${created} issues`);
                setIsImportModalOpen(false);
                setSelectedFile(null);

                // Invalidate cache and fetch fresh data
                cache.invalidatePattern("issues*");
                dispatch(fetchIssues({ baseUrl: baseUrl || "", token: token || "", id: "", page: 1 }));
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to import issues");
        } finally {
            setIsUploading(false);
        }
    };

    const renderCell = (item: any, columnKey: string) => {
        if (columnKey === "title") {
            return (
                <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap" title={item.title}>
                    {item.title}
                </div>
            )
        }
        if (columnKey === "priority") {
            return item[columnKey];
        }
        if (columnKey === "status") {
            const statusColorMap = {
                open: { dot: "bg-blue-500" },
                in_progress: { dot: "bg-amber-500" },
                on_hold: { dot: "bg-gray-500" },
                completed: { dot: "bg-teal-500" },
                reopen: { dot: "bg-orange-500" },
                closed: { dot: "bg-red-500" },
            };

            const colors =
                statusColorMap[item.status as keyof typeof statusColorMap] ||
                statusColorMap.open;

            return (
                <FormControl
                    variant="standard"
                    sx={{ width: 148 }} // same as w-32
                >
                    <Select
                        value={item.status}
                        onChange={(e) =>
                            handleIssueStatusChange(item.id, e.target.value as string)
                        }
                        disableUnderline
                        renderValue={(value) => (
                            <div
                                style={{ display: "flex", alignItems: "center", gap: "8px" }}
                            >
                                <span
                                    className={`inline-block w-2 h-2 rounded-full ${colors.dot}`}
                                ></span>
                                <span>
                                    {ISSUSE_STATUS.find((opt) => opt.value === value)?.label ||
                                        value}
                                </span>
                            </div>
                        )}
                        sx={{
                            fontSize: "0.875rem",
                            cursor: "pointer",
                            "& .MuiSelect-select": {
                                padding: "4px 0",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            },
                        }}
                    >
                        {ISSUSE_STATUS.map((opt) => {
                            const optColors =
                                statusColorMap[opt.value as keyof typeof statusColorMap];
                            return (
                                <MenuItem
                                    key={opt.value}
                                    value={opt.value}
                                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                                >
                                    <span
                                        className={`inline-block w-2 h-2 rounded-full ${optColors?.dot || "bg-gray-500"}`}
                                    ></span>
                                    <span>{opt.label}</span>
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            );
        }
        if (columnKey === "issue_type") {
            return (
                <FormControl
                    variant="standard"
                    sx={{ width: 128 }} // same as w-32
                >
                    <Select
                        value={item.issue_type}
                        onChange={(e) =>
                            handleIssueTypeChange(item.id, e.target.value as string)
                        }
                        disableUnderline
                        sx={{
                            fontSize: "0.875rem",
                            cursor: "pointer",
                            "& .MuiSelect-select": {
                                padding: "4px 0",
                            },
                        }}
                    >
                        {issueTypeOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }
        if (columnKey === "assigned_to") {
            return (
                <FormControl
                    variant="standard"
                    sx={{ width: 188 }} // same as w-32
                >
                    <Select
                        value={item.assigned_to}
                        onChange={(e) =>
                            handleIssueUpdate(item.id, e.target.value as string)
                        }
                        disableUnderline
                        sx={{
                            fontSize: "0.875rem",
                            cursor: "pointer",
                            "& .MuiSelect-select": {
                                padding: "4px 0",
                            },
                        }}
                    >
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.full_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }
        if (columnKey === "comment") {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="max-w-[10rem] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer">
                                {item.comment || "No comment"}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[20rem] rounded-[5px] text-wrap">
                            <p className="mx-2">{item.comment || "No comment"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        }
        return item[columnKey];
    };

    const leftActions = (
        <>
            {shouldShow("employee_project_issues", "create") && (
                // <Button
                //     className="bg-[#C72030] hover:bg-[#A01020] text-white"
                //     onClick={handleOpenDialog}
                // >
                //     <Plus className="w-4 h-4 mr-2" />
                //     Add
                // </Button>
                <Button
                    className="bg-[#C72030] hover:bg-[#A01020] text-white"
                    onClick={() => setShowActionPanel(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Action
                </Button>
            )}

            <div className="flex items-center gap-2 px-4 py-1 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-700 font-medium text-sm">Total Issues:</span>
                <span className="text-lg font-bold text-[#C72030]">
                    {pagination?.total_count || 0}
                </span>
            </div>
        </>
    );

    const rightActions = (
        <div className="flex items-center gap-1 mr-4">
            <span className="text-gray-700 font-medium text-sm">My Issues</span>
            <Switch
                checked={!showMyIssuesOnly}
                onChange={() => setShowMyIssuesOnly(!showMyIssuesOnly)}
                sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#C72030',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#C72030',
                    },
                }}
            />
            <span className="text-gray-700 font-medium text-sm">All Issues</span>
        </div>
    )

    const handlePageChange = async (page: number) => {
        if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading || filteredLoading) {
            return;
        }

        try {
            setPagination((prev) => ({ ...prev, current_page: page }));

            // Determine which filter/search applies
            if (searchQuery.trim()) {
                const filter = {
                    "q[title_or_project_management_title_cont]": searchQuery,
                    ...(projectId && { "q[project_management_id_eq]": projectId }),
                    ...(projectIdParam && {
                        "q[project_management_id_eq]": projectIdParam,
                    }),
                    ...(taskIdParam && { "q[task_management_id_eq]": taskIdParam }),
                    ...(milestoneIdParam && { "q[milestone_id_eq]": milestoneIdParam }),
                };
                await performFilteredFetch(filter, page);
            } else if (appliedFilters) {
                await performFilteredFetch(appliedFilters, page);
            } else if (projectId || projectIdParam || taskIdParam || milestoneIdParam) {
                const filter = {
                    "q[project_management_id_eq]": projectId || projectIdParam || "",
                    "q[task_management_id_eq]": taskIdParam || "",
                    "q[milestone_id_eq]": milestoneIdParam || "",
                };
                await performFilteredFetch(filter, page);
            } else if (showMyIssuesOnly) {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                const filter = user.id ? { "q[responsible_person_id_eq]": user.id.toString() } : {};
                await performFilteredFetch(filter, page);
            } else {
                // No filters/search, fetch all issues with page parameter
                dispatch(fetchIssues({ baseUrl, token, id: "", page }));
            }
        } catch (error) {
            console.error("Error changing page:", error);
            toast.error("Failed to load page data. Please try again.");
        }
    };

    const renderPaginationItems = () => {
        if (!pagination.total_pages || pagination.total_pages <= 0) {
            return null;
        }
        const items = [];
        const totalPages = pagination.total_pages;
        const currentPage = pagination.current_page;
        const showEllipsis = totalPages > 7;

        if (showEllipsis) {
            items.push(
                <PaginationItem key={1} className="cursor-pointer">
                    <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={currentPage === 1}
                        aria-disabled={loading || filteredLoading}
                        className={loading || filteredLoading ? "pointer-events-none opacity-50" : ""}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (currentPage > 4) {
                items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            } else {
                for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
                    items.push(
                        <PaginationItem key={i} className="cursor-pointer">
                            <PaginationLink
                                onClick={() => handlePageChange(i)}
                                isActive={currentPage === i}
                                aria-disabled={loading || filteredLoading}
                                className={loading || filteredLoading ? "pointer-events-none opacity-50" : ""}
                            >
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    );
                }
            }

            if (currentPage > 3 && currentPage < totalPages - 2) {
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    items.push(
                        <PaginationItem key={i} className="cursor-pointer">
                            <PaginationLink
                                onClick={() => handlePageChange(i)}
                                isActive={currentPage === i}
                                aria-disabled={loading || filteredLoading}
                                className={loading || filteredLoading ? "pointer-events-none opacity-50" : ""}
                            >
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    );
                }
            }

            if (currentPage < totalPages - 3) {
                items.push(
                    <PaginationItem key="ellipsis2">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            } else {
                for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
                    if (!items.find((item) => item.key === i.toString())) {
                        items.push(
                            <PaginationItem key={i} className="cursor-pointer">
                                <PaginationLink
                                    onClick={() => handlePageChange(i)}
                                    isActive={currentPage === i}
                                    aria-disabled={loading || filteredLoading}
                                    className={loading || filteredLoading ? "pointer-events-none opacity-50" : ""}
                                >
                                    {i}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }
                }
            }

            if (totalPages > 1) {
                items.push(
                    <PaginationItem key={totalPages} className="cursor-pointer">
                        <PaginationLink
                            onClick={() => handlePageChange(totalPages)}
                            isActive={currentPage === totalPages}
                            aria-disabled={loading || filteredLoading}
                            className={loading || filteredLoading ? "pointer-events-none opacity-50" : ""}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i} className="cursor-pointer">
                        <PaginationLink
                            onClick={() => handlePageChange(i)}
                            isActive={currentPage === i}
                            aria-disabled={loading || filteredLoading}
                            className={loading || filteredLoading ? "pointer-events-none opacity-50" : ""}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        return items;
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <EnhancedTable
                data={issues}
                columns={columns}
                renderActions={renderActions}
                searchTerm={searchQuery}
                onSearchChange={() => handleSearchChange(searchQuery)}
                renderCell={renderCell}
                loading={loading || filteredLoading}
                leftActions={leftActions}
                onFilterClick={() => setIsFilterModalOpen(true)}
                rightActions={rightActions}
                emptyMessage={
                    filterSuccess && issues.length === 0
                        ? "Try adjusting the filters."
                        : "No issues found. Create one to get started."
                }
            />

            {showActionPanel && (
                <SelectionPanel
                    onAdd={handleOpenDialog}
                    onImport={() => setIsImportModalOpen(true)}
                    onClearSelection={() => setShowActionPanel(false)}
                />
            )}

            {/* Issue Filter Modal */}
            <IssueFilterModal
                isModalOpen={isFilterModalOpen}
                setIsModalOpen={setIsFilterModalOpen}
                onApplyFilters={(filterString) => {
                    setAppliedFilters(filterString);
                }}
                issueTypes={issueTypeOptions}
                users={users}
                projects={projects}
            />

            {/* Add Issue Modal */}
            <AddIssueModal
                openDialog={openIssueModal}
                handleCloseDialog={() => setOpenIssueModal(false)}
                preSelectedProjectId={
                    preSelectedProjectId || projectId || projectIdParam
                }
            />

            <CommonImportModal
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                open={isImportModalOpen}
                onOpenChange={setIsImportModalOpen}
                title="Import Issues"
                entityType="issues"
                onSampleDownload={handleSampleDownload}
                onImport={handleImportIssues}
                isUploading={isUploading}
            />

            {/* Import Error Modal */}
            <Dialog
                open={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600, fontSize: "18px", borderBottom: "2px solid #E95420" }}>
                    Import Summary
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <div className="space-y-4">
                        {/* Summary Stats */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 p-3 bg-green-50 border border-green-200 rounded">
                                <div className="text-xs text-gray-600">Successfully Created</div>
                                <div className="text-2xl font-bold text-green-600">{importResults.created}</div>
                            </div>
                            <div className="flex-1 p-3 bg-red-50 border border-red-200 rounded">
                                <div className="text-xs text-gray-600">Failed Records</div>
                                <div className="text-2xl font-bold text-red-600">{importResults.failed}</div>
                            </div>
                        </div>

                        {/* Error Details */}
                        {importErrors.length > 0 && (
                            <div className="bg-gray-50 rounded border border-gray-200 p-4 max-h-96 overflow-y-auto">
                                <div className="text-sm font-semibold mb-3 text-gray-700">Error Details:</div>
                                <div className="space-y-3">
                                    {importErrors.map((error, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                                            <div className="text-xs font-semibold text-gray-600 mb-1">
                                                Row {error.row}
                                            </div>
                                            <div className="text-sm text-red-600 space-y-1">
                                                {error.errors?.map((err, errIdx) => (
                                                    <div key={errIdx} className="flex items-start gap-2">
                                                        <span className="text-red-500 mt-0.5">•</span>
                                                        <span>{err}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsErrorModalOpen(false);
                                    setIsImportModalOpen(false);
                                    setSelectedFile(null);
                                    // Fetch data anyway to show what was created
                                    cache.invalidatePattern("issues*");
                                    dispatch(fetchIssues({ baseUrl: baseUrl || "", token: token || "", id: "", page: 1 }));
                                }}
                            >
                                Close & Refresh
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="flex justify-center mt-6">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                                className={pagination.current_page === 1 || loading || filteredLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                        {renderPaginationItems()}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                                className={pagination.current_page === pagination.total_pages || loading || filteredLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default IssuesListPage;
