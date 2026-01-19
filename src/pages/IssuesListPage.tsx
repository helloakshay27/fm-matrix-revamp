import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { cache } from "@/utils/cacheUtils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchIssues, updateIssue } from "@/store/slices/issueSlice";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import AddIssueModal from "@/components/AddIssueModal";
import { FormControl, MenuItem, Select } from "@mui/material";
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

    // Pagination state
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
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

    // Fetch control refs
    const allIssuesFetchInitiatedRef = useRef(false);
    const prevParamsRef = useRef({
        projectId: null,
        projectIdParam: null,
        taskIdParam: null,
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

        // If search is active, use filtered issues
        if (searchQuery.trim()) {
            issuesToDisplay =
                filterSuccess && Array.isArray(filteredIssues) ? filteredIssues : [];
        }
        // If projectId from prop or URL param is provided, use filtered issues
        else if (projectId || projectIdParam || taskIdParam) {
            issuesToDisplay =
                filterSuccess && Array.isArray(filteredIssues) ? filteredIssues : [];
        }
        // Check if localStorage filters are applied
        else if (
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
    ]);

    const issues: Issue[] = displayIssues.map(mapIssueData);

    const [users, setUsers] = useState([]);
    const [issueTypeOptions, setIssueTypeOptions] = useState([]);
    const [openIssueModal, setOpenIssueModal] = useState(false);

    // Helper function to perform filtered fetch - defined early to be used in useEffects
    const performFilteredFetch = useCallback(
        async (filterOrString: any) => {
            try {
                setFilteredLoading(true);
                let queryString: string;

                if (typeof filterOrString === "string") {
                    queryString = filterOrString;
                } else {
                    queryString = qs.stringify(filterOrString);
                }

                // Create cache key for filtered issues - include projectId and taskIdParam to prevent stale cache
                const cacheKey = `issues_filtered_${projectId}_${projectIdParam}_${taskIdParam}_${queryString}`;

                const cachedResult = await cache.getOrFetch(
                    cacheKey,
                    async () => {
                        const response = await axios.get(
                            `https://${baseUrl}/issues.json?${queryString}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        return response.data.issues || [];
                    },
                    1 * 60 * 1000, // Fresh for 1 minute
                    5 * 60 * 1000 // Stale up to 5 minutes
                );

                setFilteredIssues(cachedResult.data);
                setFilterSuccess(true);
            } catch (error) {
                console.error("Error fetching filtered issues:", error);
                toast.error("Failed to fetch filtered issues");
                setFilteredIssues([]);
            } finally {
                setFilteredLoading(false);
            }
        },
        [baseUrl, token, projectId, projectIdParam, taskIdParam]
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

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    // Listen for global issue-created events to force refetch (ensures GET /issues.json runs)
    useEffect(() => {
        const handler = () => {
            allIssuesFetchInitiatedRef.current = false;
            dispatch(fetchIssues({ baseUrl, token, id: projectId }));
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
            prevParamsRef.current.taskIdParam !== taskIdParam;

        if (paramsChanged) {
            allIssuesFetchInitiatedRef.current = false;
            setFilterSuccess(false);
            setFilteredIssues([]);
            setPagination({ pageIndex: 0, pageSize: 10 });
            prevParamsRef.current = { projectId, projectIdParam, taskIdParam };
        }

        // Trigger fetch immediately when parameters are present
        if ((projectId || projectIdParam || taskIdParam) && baseUrl && token) {
            const filter = {
                "q[project_management_id_eq]": projectId || projectIdParam || "",
                "q[task_management_id_eq]": taskIdParam || "",
                page: 1,
                per_page: 10,
            };
            performFilteredFetch(filter);
        }
    }, [projectId, projectIdParam, taskIdParam, baseUrl, token, performFilteredFetch]);

    // Advanced filtering with search
    useEffect(() => {
        if (searchQuery.trim()) {
            // Reset to first page when search query changes
            setPagination((prev) => ({
                ...prev,
                pageIndex: 0,
            }));

            const page = 1;
            const filter = {
                "q[title_or_project_management_title_cont]": searchQuery,
                page,
                per_page: 10,
                ...(projectId && { "q[project_management_id_eq]": projectId }),
                ...(projectIdParam && {
                    "q[project_management_id_eq]": projectIdParam,
                }),
                ...(taskIdParam && { "q[task_management_id_eq]": taskIdParam }),
            };

            performFilteredFetch(filter);
        } else {
            // If search is cleared, reset to initial fetch
            allIssuesFetchInitiatedRef.current = false;
        }
    }, [searchQuery, projectId, projectIdParam, taskIdParam]);

    // Fetch all issues only when no parameters and haven't fetched yet
    useEffect(() => {
        // Only fetch all issues if no projectId/taskId parameters and we haven't already
        if (
            !projectId &&
            !projectIdParam &&
            !taskIdParam &&
            !searchQuery.trim() &&
            !allIssuesFetchInitiatedRef.current &&
            baseUrl &&
            token
        ) {
            dispatch(fetchIssues({ baseUrl, token, id: "" }));
            allIssuesFetchInitiatedRef.current = true;
        }
    }, [dispatch, baseUrl, token, projectId, projectIdParam, taskIdParam, searchQuery]);

    // Handle pagination for search results
    useEffect(() => {
        if (searchQuery.trim() && pagination.pageIndex > 0) {
            const page = pagination.pageIndex + 1;
            const filter = {
                "q[title_or_project_management_title_cont]": searchQuery,
                page,
                per_page: 10,
                ...(projectId && { "q[project_management_id_eq]": projectId }),
                ...(projectIdParam && {
                    "q[project_management_id_eq]": projectIdParam,
                }),
                ...(taskIdParam && { "q[task_management_id_eq]": taskIdParam }),
            };

            performFilteredFetch(filter);
        }
    }, [
        pagination.pageIndex,
        searchQuery,
        projectId,
        projectIdParam,
        taskIdParam,
        performFilteredFetch,
    ]);

    const fetchData = useCallback(async () => {
        try {
            const cachedResult = await cache.getOrFetch(
                "issue_types",
                async () => {
                    const response = await axios.get(
                        `https://${baseUrl}/issue_types.json`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const issueTypes = response.data.issue_types || response.data || [];
                    return issueTypes.map((i: any) => ({
                        value: i.id,
                        label: i.name,
                    }));
                },
                5 * 60 * 1000, // Fresh for 5 minutes
                30 * 60 * 1000 // Stale up to 30 minutes
            );
            setIssueTypeOptions(cachedResult.data);
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
                const newFilter = {
                    "q[status_in][]":
                        item.selectedStatuses?.length > 0 ? item.selectedStatuses : [],
                    "q[created_by_id_eq]":
                        item.selectedCreators?.length > 0 ? item.selectedCreators : [],
                    "q[start_date_eq]": item.dates?.["Start Date"],
                    "q[end_date_eq]": item.dates?.["End Date"],
                    "q[responsible_person_id_in][]":
                        item.selectedResponsible?.length > 0
                            ? item.selectedResponsible
                            : [],
                    "q[issue_type_in][]":
                        item.selectedTypes?.length > 0 ? item.selectedTypes : [],
                    "q[project_management_id_in][]":
                        item.selectedProjects?.length > 0 ? item.selectedProjects : [],
                    "q[task_management_id_in][]":
                        item.selectedTasks?.length > 0 ? item.selectedTasks : [],
                    "q[subtask_management_id_in][]":
                        item.selectedSubtasks?.length > 0 ? item.selectedSubtasks : [],
                    page: pagination.pageIndex + 1,
                    per_page: pagination.pageSize,
                };
                const queryString = qs.stringify(newFilter, { arrayFormat: "repeat" });
                performFilteredFetch(queryString);
            } else if (localStorage.getItem("issueStatus")) {
                const status = localStorage.getItem("issueStatus");
                const filter = {
                    "q[status_eq]": status,
                    page: pagination.pageIndex + 1,
                    per_page: pagination.pageSize,
                };
                performFilteredFetch(filter);
            } else {
                allIssuesFetchInitiatedRef.current = false;
                dispatch(fetchIssues({ baseUrl, token, id: projectId }));
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
            performFilteredFetch(
                projectId ? `q[project_management_id_eq]=${projectId}` : ""
            );
            toast.success("Issue updated successfully");

            // Refresh with appropriate filter
            if (localStorage.getItem("IssueFilters")) {
                const item = JSON.parse(localStorage.getItem("IssueFilters")!);
                const newFilter = {
                    "q[status_in][]":
                        item.selectedStatuses?.length > 0 ? item.selectedStatuses : [],
                    "q[created_by_id_eq]":
                        item.selectedCreators?.length > 0 ? item.selectedCreators : [],
                    "q[start_date_eq]": item.dates?.["Start Date"],
                    "q[end_date_eq]": item.dates?.["End Date"],
                    "q[responsible_person_id_in][]":
                        item.selectedResponsible?.length > 0
                            ? item.selectedResponsible
                            : [],
                    "q[issue_type_in][]":
                        item.selectedTypes?.length > 0 ? item.selectedTypes : [],
                    "q[project_management_id_in][]":
                        item.selectedProjects?.length > 0 ? item.selectedProjects : [],
                    "q[task_management_id_in][]":
                        item.selectedTasks?.length > 0 ? item.selectedTasks : [],
                    "q[subtask_management_id_in][]":
                        item.selectedSubtasks?.length > 0 ? item.selectedSubtasks : [],
                    page: pagination.pageIndex + 1,
                    per_page: pagination.pageSize,
                };
                const queryString = qs.stringify(newFilter, { arrayFormat: "repeat" });
                performFilteredFetch(queryString);
            } else if (localStorage.getItem("issueStatus")) {
                const status = localStorage.getItem("issueStatus");
                const filter = {
                    "q[status_eq]": status,
                    page: pagination.pageIndex + 1,
                    per_page: pagination.pageSize,
                };
                performFilteredFetch(filter);
            } else {
                allIssuesFetchInitiatedRef.current = false;
                dispatch(fetchIssues({ baseUrl, token, id: projectId }));
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
            performFilteredFetch(
                projectId ? `q[project_management_id_eq]=${projectId}` : ""
            );
            toast.success("Issue status updated successfully");

            // Refresh with appropriate filter
            if (localStorage.getItem("IssueFilters")) {
                const item = JSON.parse(localStorage.getItem("IssueFilters")!);
                const newFilter = {
                    "q[status_in][]":
                        item.selectedStatuses?.length > 0 ? item.selectedStatuses : [],
                    "q[created_by_id_eq]":
                        item.selectedCreators?.length > 0 ? item.selectedCreators : [],
                    "q[start_date_eq]": item.dates?.["Start Date"],
                    "q[end_date_eq]": item.dates?.["End Date"],
                    "q[responsible_person_id_in][]":
                        item.selectedResponsible?.length > 0
                            ? item.selectedResponsible
                            : [],
                    "q[issue_type_in][]":
                        item.selectedTypes?.length > 0 ? item.selectedTypes : [],
                    "q[project_management_id_in][]":
                        item.selectedProjects?.length > 0 ? item.selectedProjects : [],
                    "q[task_management_id_in][]":
                        item.selectedTasks?.length > 0 ? item.selectedTasks : [],
                    "q[subtask_management_id_in][]":
                        item.selectedSubtasks?.length > 0 ? item.selectedSubtasks : [],
                    page: pagination.pageIndex + 1,
                    per_page: pagination.pageSize,
                };
                const queryString = qs.stringify(newFilter, { arrayFormat: "repeat" });
                performFilteredFetch(queryString);
            } else if (localStorage.getItem("issueStatus")) {
                const status = localStorage.getItem("issueStatus");
                const filter = {
                    "q[status_eq]": status,
                    page: pagination.pageIndex + 1,
                    per_page: pagination.pageSize,
                };
                performFilteredFetch(filter);
            } else {
                allIssuesFetchInitiatedRef.current = false;
                dispatch(fetchIssues({ baseUrl, token, id: projectId }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const renderCell = (item: any, columnKey: string) => {
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
                <Button
                    className="bg-[#C72030] hover:bg-[#A01020] text-white"
                    onClick={handleOpenDialog}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                </Button>
            )}
        </>
    );

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
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
                emptyMessage={
                    filterSuccess && issues.length === 0
                        ? "Try adjusting the filters."
                        : "No issues found. Create one to get started."
                }
            />

            {/* Add Issue Modal */}
            <AddIssueModal
                openDialog={openIssueModal}
                handleCloseDialog={() => setOpenIssueModal(false)}
                preSelectedProjectId={
                    preSelectedProjectId || projectId || projectIdParam
                }
            />
        </div>
    );
};

export default IssuesListPage;
