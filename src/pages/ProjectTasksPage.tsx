import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useAppDispatch } from "@/store/hooks";
import { createProjectTask, editProjectTask, filterTasks, updateTaskStatus } from "@/store/slices/projectTasksSlice";
import { ChartNoAxesColumn, ChevronDown, Eye, List, Plus, X, Search, ChevronRight, Play, Pause, ArrowLeft } from "lucide-react";
import { useEffect, useState, useRef, forwardRef, useCallback } from "react";
import { cache } from "@/utils/cacheUtils";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Dialog, DialogContent, MenuItem, Select, Slide, TextField, Switch, FormControl } from "@mui/material";
import { toast } from "sonner";
import ProjectTaskCreateModal from "@/components/ProjectTaskCreateModal";
import TaskManagementKanban from "@/components/TaskManagementKanban";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { TransitionProps } from "@mui/material/transitions";
import { useLayout } from "@/contexts/LayoutContext";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import clsx from "clsx";
import axios from "axios";
import { baseClient } from "@/utils/withoutTokenBase";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { CommonImportModal } from "@/components/CommonImportModal";
import { useSearchParams } from "react-router-dom";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const columns: ColumnConfig[] = [
    {
        key: "id",
        label: "Task ID",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "task_code",
        label: "Task Code",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "title",
        label: "Task Title",
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
        key: "workflowStatus",
        label: "Workflow Status",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "responsible",
        label: "Responsible Person",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "expected_start_date",
        label: "Start Date",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "target_date",
        label: "End Date",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "started_time",
        label: "Started Time",
        sortable: false,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "duration",
        label: "Time Left",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "efforts_duration",
        label: "Efforts Duration",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "subtasks",
        label: "Subtasks",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "issues",
        label: "Issues",
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
        key: "predecessor",
        label: "Predecessor",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "successor",
        label: "Successor",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "completion_percentage",
        label: "Completion Percentage",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
];

const STATUS_OPTIONS = [
    {
        value: "all",
        label: "All"
    },
    {
        value: "open",
        label: "Open",
        color: "bg-[#c85e68]"
    },
    {
        value: "in_progress",
        label: "In Progress",
        color: "bg-yellow-500"
    },
    {
        value: "completed",
        label: "Completed",
        color: "bg-green-400"
    },
    {
        value: "on_hold",
        label: "On Hold",
        color: "bg-grey-500"
    },
    {
        value: "overdue",
        label: "Overdue",
        color: "bg-red-500"
    }
]

// Map frontend column keys to backend field names
const COLUMN_TO_BACKEND_MAP: Record<string, string> = {
    id: "id",
    task_code: "task_code",
    title: "title",
    status: "status",
    workflowStatus: "project_status_id",
    responsible: "responsible_person_id",
    expected_start_date: "expected_start_date",
    target_date: "target_date",
    duration: "target_date",
    efforts_duration: "estimated_hour",
    subtasks: "total_sub_tasks",
    issues: "total_issues",
    priority: "priority",
    predecessor: "predecessor_task",
    successor: "successor_task",
    completion_percentage: "completion_percent",
};

// Utility function to calculate duration between two dates (matching task_management)
const calculateDuration = (start: string | undefined, end: string | undefined): { text: string; isOverdue: boolean } => {
    // If end date is missing, return N/A
    if (!end) return { text: "N/A", isOverdue: false };

    const now = new Date();
    // Use provided start date or today if not provided
    const startDate = start ? new Date(start) : now;
    const endDate = new Date(end);

    // Set end date to end of the day
    endDate.setHours(23, 59, 59, 999);

    // Check if task hasn't started yet
    if (now < startDate) {
        return { text: "Not started", isOverdue: false };
    }

    // Calculate time differences (use absolute value to show overdue time)
    const diffMs = endDate.getTime() - now.getTime();
    const absDiffMs = Math.abs(diffMs);
    const isOverdue = diffMs <= 0;

    // Calculate time differences
    const seconds = Math.floor(absDiffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    const timeStr = `${days > 0 ? days + "d " : "0d "}${remainingHours > 0 ? remainingHours + "h " : "0h "}${remainingMinutes > 0 ? remainingMinutes + "m " : "0m"}`;
    return {
        text: isOverdue ? `${timeStr}` : timeStr,
        isOverdue: isOverdue,
    };
};

// Countdown timer component with real-time updates
const CountdownTimer = ({ startDate, targetDate }: { startDate?: string; targetDate?: string }) => {
    const [countdown, setCountdown] = useState(calculateDuration(startDate, targetDate));

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(calculateDuration(startDate, targetDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate, startDate]);

    const textColor = countdown.isOverdue ? "text-red-600" : "text-[#029464]";
    return <div className={`text-left ${textColor} text-[12px]`}>{countdown.text}</div>;
};

// Validation helper for date ranges
const validateDateRange = (startDate: string, endDate: string): { valid: boolean; error?: string } => {
    if (!startDate) return { valid: false, error: "Start date is required" };
    if (!endDate) return { valid: false, error: "End date is required" };

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
        return { valid: false, error: "End date must be after start date" };
    }

    return { valid: true };
};

const statusOptions = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" },
]

// Pause Reason Modal Component
const PauseReasonModal = ({ isOpen, onClose, onSubmit, onEndTask, isLoading, taskId }) => {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setReason('');
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast.error('Please enter a reason for pausing the task');
            return;
        }
        onSubmit(reason, taskId);
    };

    const handleEndTask = () => {
        if (!reason.trim()) {
            toast.error('Please enter a reason for ending the task');
            return;
        }
        onEndTask(reason, taskId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[30rem]">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Reason for Pause/End</h2>

                <div className="mb-6">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        rows={4}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex gap-3 justify-between">
                    <Button
                        onClick={handleEndTask}
                        disabled={isLoading}
                        className="px-4 py-2 !bg-red-600 !text-white rounded-md !hover:bg-red-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Submitting...' : 'End Task'}
                    </Button>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Submitting...' : 'Pause Task'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Reason for Overdue</h2>

                <div className="mb-6">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason for overdue..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        rows={4}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ProjectTasksPage = () => {
    const { setCurrentSection } = useLayout();
    const [searchParams] = useSearchParams();
    const { shouldShow } = useDynamicPermissions();

    const view = localStorage.getItem("selectedView");
    const urlToken = searchParams.get("token");
    const urlOrgId = searchParams.get("org_id");
    const urlUserId = searchParams.get("user_id");

    // Initialize mobile token, org_id, and user_id from URL if available
    useEffect(() => {
        if (urlToken) {
            sessionStorage.setItem("mobile_token", urlToken);
            localStorage.setItem("token", urlToken);
        }
        if (urlOrgId) {
            sessionStorage.setItem("org_id", urlOrgId);
        }
        if (urlUserId) {
            sessionStorage.setItem("user_id", urlUserId);
        }
    }, [urlToken, urlOrgId, urlUserId]);

    // Determine token source: prefer sessionStorage (mobile) over localStorage (web)
    const token =
        sessionStorage.getItem("mobile_token") ||
        localStorage.getItem("token");

    // For baseUrl: use localStorage for web, or will be resolved by baseClient for mobile
    let baseUrl = localStorage.getItem("baseUrl");

    // If mobile flow and no baseUrl, will be resolved by baseClient interceptor
    if (!baseUrl && urlToken) {
        console.log("📱 Mobile flow detected - baseUrl will be resolved by baseClient interceptor");
    }

    useEffect(() => {
        setCurrentSection(view === "admin" ? "Value Added Services" : "Project Task");
    }, [setCurrentSection]);

    const { id: projectId, mid } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const [tasks, setTasks] = useState([])
    const [users, setUsers] = useState([])
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [selectedView, setSelectedView] = useState<"Kanban" | "List">("List");
    const [isOpen, setIsOpen] = useState(false);
    const [openStatusOptions, setOpenStatusOptions] = useState(false)
    const [selectedFilterOption, setSelectedFilterOption] = useState("all")
    const [statuses, setStatuses] = useState([])
    const [taskType, setTaskType] = useState<"all" | "my">("all");
    const [pagination, setPagination] = useState({
        current_page: 1,
        next_page: null as number | null,
        prev_page: null as number | null,
        total_pages: 1,
        total_count: 0,
    })
    const [loading, setLoading] = useState(false)

    // Sorting state
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);

    // Import modal state
    const [showActionPanel, setShowActionPanel] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Filter Modal State
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedResponsible, setSelectedResponsible] = useState<number[]>([]);
    const [selectedCreators, setSelectedCreators] = useState<number[]>([]);
    const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
    const [selectedWorkflowStatus, setSelectedWorkflowStatus] = useState<string[]>([]);
    const [dates, setDates] = useState({ startDate: '', endDate: '' });
    const [projectOptions, setProjectOptions] = useState<any[]>([]);
    const [dropdowns, setDropdowns] = useState({
        status: false,
        workflowStatus: false,
        responsiblePerson: false,
        createdBy: false,
        project: false,
    });
    const [searchTerms, setSearchTerms] = useState({
        status: '',
        workflowStatus: '',
        responsiblePerson: '',
        createdBy: '',
        project: '',
    });

    // Pause Modal State
    const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
    const [pauseTaskId, setPauseTaskId] = useState<number | null>(null);
    const [isPauseLoading, setIsPauseLoading] = useState(false);

    // Overdue Reason Modal State
    const [isOverdueModalOpen, setIsOverdueModalOpen] = useState(false);
    const [overdueTaskId, setOverdueTaskId] = useState<number | null>(null);
    const [pendingCompletionPercentage, setPendingCompletionPercentage] = useState<number>(0);
    const [isOverdueLoading, setIsOverdueLoading] = useState(false);
    const [pendingStatusChange, setPendingStatusChange] = useState<{ id: number; status: string } | null>(null);

    const viewDropdownRef = useRef<HTMLDivElement>(null);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const filterModalRef = useRef<HTMLDivElement>(null);

    // Handle click outside for view dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (viewDropdownRef.current && !viewDropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isOpen]);

    // Handle click outside for status dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setOpenStatusOptions(false);
            }
        };

        if (openStatusOptions) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [openStatusOptions]);

    const getStatuses = async () => {
        try {
            const response = baseUrl
                ? await axios.get(`https://${baseUrl}/project_statuses.json?q[active_eq]=true`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                : await baseClient.get(`/project_statuses.json?q[active_eq]=true`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            setStatuses(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getStatuses()
    }, [])

    // Fetch projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = baseUrl
                    ? await axios.get(`https://${baseUrl}/project_managements.json`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    : await baseClient.get(`/project_managements.json`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                if (response.data && Array.isArray(response.data.project_managements)) {
                    setProjectOptions(
                        response.data.project_managements.map((project: any) => ({
                            label: project.name || project.title,
                            value: project.id,
                        }))
                    );
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        if (token && baseUrl) {
            fetchProjects();
        }
    }, [token, baseUrl]);

    // Save filter state to localStorage whenever it changes
    useEffect(() => {
        const filters = {
            selectedStatuses,
            selectedResponsible,
            selectedCreators,
            selectedProjects,
            selectedWorkflowStatus,
            dates,
            statusSearch: searchTerms.status,
            workflowStatusSearch: searchTerms.workflowStatus,
            ResponsiblePersonSearch: searchTerms.responsiblePerson,
            creatorSearch: searchTerms.createdBy,
            projectSearch: searchTerms.project,
        };
        if (
            selectedStatuses?.length > 0 ||
            selectedResponsible?.length > 0 ||
            selectedCreators?.length > 0 ||
            selectedProjects?.length > 0 ||
            selectedWorkflowStatus?.length > 0 ||
            dates.startDate ||
            dates.endDate
        ) {
            localStorage.setItem('taskFilters', JSON.stringify(filters));
        }
    }, [
        selectedStatuses,
        selectedResponsible,
        selectedCreators,
        selectedProjects,
        selectedWorkflowStatus,
        dates,
        searchTerms,
    ]);

    const toggleDropdown = (key: keyof typeof dropdowns) => {
        setDropdowns((prev) => {
            const isAlreadyOpen = prev[key];
            if (isAlreadyOpen) {
                return { ...prev, [key]: false };
            }
            return {
                status: false,
                workflowStatus: false,
                responsiblePerson: false,
                createdBy: false,
                project: false,
                [key]: true,
            };
        });
    };

    const toggleOption = (value: any, selected: any[], setSelected: Function) => {
        setSelected((prev: any[]) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    const renderCheckboxList = (options: any[], selected: any[], setSelected: Function, searchTerm = '') => {
        const filtered = options.filter((opt) =>
            typeof opt === 'string'
                ? opt.toLowerCase().includes(searchTerm.toLowerCase())
                : opt.label?.toLowerCase().includes(searchTerm.toLowerCase()) || opt.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="max-h-40 overflow-y-auto p-2">
                {filtered.map((option) => {
                    const label = typeof option === 'string' ? option : (option.label || option.full_name);
                    const color = typeof option === 'string' ? null : option.color;
                    const value = typeof option === 'string' ? option : option.value;

                    return (
                        <label
                            key={value}
                            className="flex items-center justify-between py-2 px-2 text-sm cursor-pointer hover:bg-gray-50 rounded"
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(value)}
                                    onChange={() => toggleOption(value, selected, setSelected)}
                                />
                                <span>{label}</span>
                            </div>
                            {color && <span className={clsx('w-2 h-2 rounded-full', color)}></span>}
                        </label>
                    );
                })}
                {filtered?.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-2">No results found</div>
                )}
            </div>
        );
    };

    const handleApplyFilter = () => {
        try {
            const params: any = { page: 1 };

            if (selectedStatuses.length > 0) {
                params['q[status_in][]'] = selectedStatuses;
            }
            if (selectedWorkflowStatus.length > 0) {
                params['q[project_status_id_in][]'] = selectedWorkflowStatus;
            }
            if (selectedResponsible.length > 0) {
                params['q[responsible_person_id_in][]'] = selectedResponsible;
            }
            if (selectedCreators.length > 0) {
                params['q[created_by_id_in][]'] = selectedCreators;
            }
            if (selectedProjects.length > 0) {
                params['q[project_management_id_in][]'] = selectedProjects;
            }
            if (dates.startDate) {
                params['q[start_date_eq]'] = dates.startDate;
            }
            if (dates.endDate) {
                params['q[end_date_eq]'] = dates.endDate;
            }
            if (mid) {
                params['q[milestone_id_eq]'] = mid;
            }

            dispatch(filterTasks({ token, baseUrl, params })).then(() => {
                setIsFilterModalOpen(false);
            });
        } catch (e) {
            console.log(e);
        }
    };

    const handleClearFilters = () => {
        setSelectedStatuses([]);
        setSelectedResponsible([]);
        setSelectedCreators([]);
        setSelectedProjects([]);
        setSelectedWorkflowStatus([]);
        setDates({ startDate: '', endDate: '' });
        setSearchTerms({ status: '', workflowStatus: '', responsiblePerson: '', createdBy: '', project: '' });
        localStorage.removeItem('taskFilters');

        const params: any = { page: 1 };
        if (mid) {
            params['q[milestone_id_eq]'] = mid;
        }

        dispatch(filterTasks({ token, baseUrl, params })).then(() => {
            setIsFilterModalOpen(false);
        });
    };


    const fetchData = useCallback(async (page: number = 1, orderBy: string | null = sortColumn, orderDirection: "asc" | "desc" | null = sortDirection) => {
        try {
            setLoading(true);
            const searchParams = new URLSearchParams(location.search);
            const urlProjectId = searchParams.get('project_id');

            // Determine if we're in milestone context or standalone tasks
            const isMilestoneContext = mid !== undefined && mid !== null;

            const filters: any = { page };

            if (selectedFilterOption !== "all") {
                filters["q[status_eq]"] = selectedFilterOption;
            }

            if (urlProjectId) {
                filters["q[project_management_id_eq]"] = urlProjectId;
            }

            // Add sorting parameters if provided
            if (orderBy && orderDirection) {
                const backendFieldName = COLUMN_TO_BACKEND_MAP[orderBy] || orderBy;
                filters["order_by"] = backendFieldName;
                filters["order_direction"] = orderDirection;
            }

            let response;

            // Handle URL-based context
            if (isMilestoneContext) {
                // In milestone context - show all tasks for that milestone
                filters["q[milestone_id_eq]"] = mid;

                response = await dispatch(
                    filterTasks({ token, baseUrl, params: filters })
                ).unwrap();
            } else {
                // Standalone tasks view - distinguish between all tasks and my tasks
                if (taskType === "my") {
                    // My Tasks - use dedicated endpoint with page param
                    const params = new URLSearchParams();
                    params.append("page", page.toString());
                    if (selectedFilterOption !== "all") {
                        params.append("status", selectedFilterOption);
                    }

                    // Add sorting parameters for my tasks
                    if (orderBy && orderDirection) {
                        const backendFieldName = COLUMN_TO_BACKEND_MAP[orderBy] || orderBy;
                        params.append("order_by", backendFieldName);
                        params.append("order_direction", orderDirection);
                    }

                    response = await fetch(
                        `https://${baseUrl}/task_managements/my_tasks.json?${params.toString()}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    ).then(res => res.json());
                } else {
                    // All Tasks - use filter endpoint
                    response = await dispatch(
                        filterTasks({ token, baseUrl, params: filters })
                    ).unwrap();
                }
            }

            setTasks(response.task_managements || response.data?.task_managements || []);
            setPagination({
                current_page: response.pagination?.current_page || response.data?.pagination?.current_page || 1,
                next_page: response.pagination?.next_page || response.data?.pagination?.next_page || null,
                prev_page: response.pagination?.prev_page || response.data?.pagination?.prev_page || null,
                total_pages: response.pagination?.total_pages || response.data?.pagination?.total_pages || 1,
                total_count: response.pagination?.total_count || response.data?.pagination?.total_count || 0,
            });
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    }, [selectedFilterOption, taskType, mid, dispatch, token, baseUrl, projectId, location.search, sortColumn, sortDirection]);

    const getUsers = useCallback(async () => {
        try {
            const response = baseUrl
                ? await axios.get(`https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                : await baseClient.get(`/pms/users/get_escalate_to_users.json?type=Task`, {
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
        fetchData(1);
    }, [selectedFilterOption, taskType, mid, projectId, location.search, fetchData]);

    useEffect(() => {
        getUsers();
    }, [getUsers])

    const handleOpenDialog = () => {
        setOpenTaskModal(true);
    };

    const handleCloseModal = () => {
        setOpenTaskModal(false);
    };

    const handlePageChange = async (page: number) => {
        if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) {
            return;
        }
        await fetchData(page);
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
                        aria-disabled={loading}
                        className={loading ? "pointer-events-none opacity-50" : ""}
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
                                aria-disabled={loading}
                                className={loading ? "pointer-events-none opacity-50" : ""}
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
                                aria-disabled={loading}
                                className={loading ? "pointer-events-none opacity-50" : ""}
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
                    if (!items.find((item: any) => item.key === i.toString())) {
                        items.push(
                            <PaginationItem key={i} className="cursor-pointer">
                                <PaginationLink
                                    onClick={() => handlePageChange(i)}
                                    isActive={currentPage === i}
                                    aria-disabled={loading}
                                    className={loading ? "pointer-events-none opacity-50" : ""}
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
                            aria-disabled={loading}
                            className={loading ? "pointer-events-none opacity-50" : ""}
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
                            aria-disabled={loading}
                            className={loading ? "pointer-events-none opacity-50" : ""}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        return items;
    };

    const handleSubmit = async (data: any) => {
        console.log(data)
        // Validate all required fields
        if (!data.title?.trim()) {
            toast.error("Task title is required");
            return;
        }
        if (!data.expected_start_date) {
            toast.error("Start date is required");
            return;
        }
        if (!data.target_date) {
            toast.error("End date is required");
            return;
        }

        // Validate date range
        const dateValidation = validateDateRange(
            data.expected_start_date,
            data.target_date
        );
        if (!dateValidation.valid) {
            toast.error(dateValidation.error);
            return;
        }

        const generateAllocationDates = (start, end) => {
            const result = [];
            const current = new Date(start);
            const endDate = new Date(end);

            while (current <= endDate) {
                const formatted = current.toISOString().split("T")[0];

                result.push({
                    date: formatted,
                    hours: 8,
                    minutes: 0,
                });

                // move to next day
                current.setDate(current.getDate() + 1);
            }

            return result;
        };

        const allocation = generateAllocationDates(
            data.expected_start_date,
            data.target_date
        );

        const payload = {
            task_management: {
                title: data.title,
                expected_start_date: data.expected_start_date,
                target_date: data.target_date,
                status: data.status || "open",
                priority: data.priority || "Medium",
                active: true,
                responsible_person_id: data.responsible || data.responsible_person_id,
                ...(projectId && { project_management_id: projectId }),
                ...(mid && { milestone_id: mid }),
                task_allocation_times_attributes: allocation,
                estimated_hour: 8 * allocation.length,
            }
        }
        try {
            await dispatch(createProjectTask({ token, baseUrl, data: payload })).unwrap();

            toast.success("Task created successfully");
            await fetchData();
        } catch (error) {
            console.log(error)
            // toast.error(String(error) || "Failed to create task")
            const fullError = error.response.data
            Object.keys(fullError).forEach((key) => {
                toast.error(`${key} ${fullError[key]}`);
            })
        }
    };

    const handleSampleDownload = async () => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/assets/task_import.xlsx`,
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
            link.setAttribute('download', 'sample_task.xlsx');
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

    const handleImportTasks = async () => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            const response = await axios.post(`https://${baseUrl}/task_managements/import.json`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            // toast.success("Tasks imported successfully");
            // setIsImportModalOpen(false);
            // setSelectedFile(null);
            // fetchData();
            if (response.data.failed && response.data.failed.length > 0) {
                response.data.failed.forEach((item: { row: number; errors: string[] }) => {
                    const errorMessages = item.errors.join(', ');
                    toast.error(`Row ${item.row}: ${errorMessages}`);
                });
            } else {
                toast.success("Tasks imported successfully");
                setIsImportModalOpen(false);
                setSelectedFile(null);
                fetchData();
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to import tasks");
        } finally {
            setIsUploading(false);
        }
    };

    const handleView = (id) => {
        if (location.pathname.startsWith("/mobile-projects")) {
            navigate(`${id}`);
        } else if (location.pathname.startsWith("/vas/tasks")) {
            navigate(`/vas/tasks/${id}`);
        } else {
            navigate(`/vas/projects/${projectId}/milestones/${mid}/tasks/${id}`)
        }
    }

    const renderActions = (item: any) => (
        <div className="flex items-center justify-center gap-2">
            {shouldShow("employee_project_tasks", "show") && (
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => handleView(item.id)}
                    title="View Task Details"
                >
                    <Eye className="w-4 h-4" />
                </Button>
            )}
        </div>
    );

    const handleStatusChange = async (id: number, status: string) => {
        try {
            // Check if task is being marked as completed and if it's overdue
            if (status === 'completed') {
                const task = tasks.find(t => t.id === id);
                if (!task) {
                    toast.error("Task not found");
                    return;
                }

                // Check if task is overdue using the target_date
                const isTaskOverdue = (date: string | Date) => {
                    const d = new Date(date);
                    const today = new Date();

                    d.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);

                    return d < today;
                };

                if (isTaskOverdue(new Date(task.target_date))) {
                    // Show overdue reason modal for status change
                    setOverdueTaskId(id);
                    setPendingStatusChange({ id, status });
                    setIsOverdueModalOpen(true);
                    return;
                }
            }

            // If not overdue or not being marked as complete, proceed normally
            await dispatch(updateTaskStatus({ token, baseUrl, id: String(id), data: { status } })).unwrap();

            fetchData(1, sortColumn, sortDirection);
            toast.success("Task status changed successfully");
        } catch (error) {
            console.log(error)
        }
    }

    const handleWorkflowStatusChange = async (id: number, status: string) => {
        try {
            await dispatch(editProjectTask({ token, baseUrl, id: String(id), data: { project_status_id: status } })).unwrap();

            fetchData(1, sortColumn, sortDirection);
            toast.success("Task status changed successfully");
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdateTask = async (id: number, responsible_person_id: number) => {
        try {
            await dispatch(editProjectTask({ token, baseUrl, id: String(id), data: { responsible_person_id } })).unwrap();

            fetchData(1, sortColumn, sortDirection);
            toast.success("Task updated successfully");
        } catch (error) {
            console.log(error)
        }
    }

    // Handle column sort
    const handleColumnSort = (columnKey: string) => {
        let newDirection: "asc" | "desc" | null;

        // Cycle through: asc -> desc -> null -> asc
        if (sortColumn === columnKey) {
            newDirection = sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc";
        } else {
            newDirection = "asc";
        }

        setSortColumn(newDirection ? columnKey : null);
        setSortDirection(newDirection);

        // Fetch with new sort
        fetchData(1, newDirection ? columnKey : null, newDirection);
    };

    const handlePauseTaskSubmit = async (reason: string, tid: number) => {
        if (!tid) return;

        setIsPauseLoading(true);
        try {
            // Update task status to "on_hold" (paused)
            await dispatch(updateTaskStatus({ token, baseUrl, id: String(tid), data: { status: 'stopped' } })).unwrap();

            // Update local state immediately for instant UI feedback
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === tid ? { ...task, is_started: false } : task
                )
            );

            const commentPayload = {
                comment: {
                    body: `Paused with reason: ${reason}`,
                    commentable_id: tid,
                    commentable_type: 'TaskManagement',
                    commentor_id: JSON.parse(localStorage.getItem('user'))?.id,
                    active: true,
                },
            };

            await axios.post(`https://${baseUrl}/comments.json`, commentPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Task paused successfully with reason');
            setIsPauseModalOpen(false);
            setPauseTaskId(null);

            // Refresh task list in background
            fetchData();
        } catch (error) {
            console.error('Failed to pause task:', error);
            toast.error(
                `Failed to pause task: ${error?.response?.data?.error || error?.message || 'Server error'}`
            );
        } finally {
            setIsPauseLoading(false);
        }
    };

    const handleEndTaskSubmit = async (reason: string, tid: number) => {
        if (!tid) return;

        setIsPauseLoading(true);
        try {
            // Update task status to "completed"
            await dispatch(updateTaskStatus({ token, baseUrl, id: String(tid), data: { status: 'completed' } })).unwrap();

            // Update local state
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === tid ? { ...task, status: 'completed', is_started: false } : task
                )
            );

            const commentPayload = {
                comment: {
                    body: `Ended with reason: ${reason}`,
                    commentable_id: tid,
                    commentable_type: 'TaskManagement',
                    commentor_id: JSON.parse(localStorage.getItem('user'))?.id,
                    active: true,
                },
            };

            await axios.post(`https://${baseUrl}/comments.json`, commentPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Task ended successfully');
            setIsPauseModalOpen(false);
            setPauseTaskId(null);

            // Refresh task list in background
            fetchData();
        } catch (error) {
            console.error('Failed to end task:', error);
            toast.error(
                `Failed to end task: ${error?.response?.data?.error || error?.message || 'Server error'}`
            );
        } finally {
            setIsPauseLoading(false);
        }
    };

    const handlePlayTask = async (id: number) => {
        try {
            await dispatch(updateTaskStatus({ token, baseUrl, id: String(id), data: { status: 'started' } })).unwrap();

            // Update local state immediately for instant UI feedback
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === id ? { ...task, is_started: true } : task
                )
            );

            toast.success("Task started successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to start task");
        }
    }

    const handleCompletionPercentageChange = async (id: number, completionPercentage: number | string) => {
        const percentage = Number(completionPercentage);

        // Validate percentage
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
            toast.error("Completion percentage must be between 0 and 100");
            return;
        }

        if (percentage > 100) {
            toast.error("Completion percentage must be less than 100");
            return;
        }

        // Find the task to check if it's overdue
        const task = tasks.find(t => t.id === id);
        if (!task) {
            toast.error("Task not found");
            return;
        }

        // Check if task is overdue using the target_date
        const isTaskOverdue = (date: string | Date) => {
            const d = new Date(date);
            const today = new Date();

            d.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            return d < today;
        };

        if (isTaskOverdue(new Date(task.target_date))) {
            // Show overdue reason modal
            setOverdueTaskId(id);
            setPendingCompletionPercentage(percentage);
            setIsOverdueModalOpen(true);
        } else {
            // Directly save the percentage if not overdue
            try {
                await dispatch(editProjectTask({
                    token,
                    baseUrl,
                    id: String(id),
                    data: { completion_percent: percentage }
                })).unwrap();
                toast.success("Completion percentage updated successfully");
                fetchData();
            } catch (error) {
                console.log(error);
                toast.error("Failed to update completion percentage");
            }
        }
    }

    const handleOverdueReasonSubmit = async (reason: string) => {
        if (!overdueTaskId) return;

        setIsOverdueLoading(true);
        try {
            // If this is a status change (marking as complete)
            if (pendingStatusChange) {
                await dispatch(updateTaskStatus({
                    token,
                    baseUrl,
                    id: String(overdueTaskId),
                    data: { status: pendingStatusChange.status }
                })).unwrap();
            } else {
                // Otherwise it's a completion percentage change
                await dispatch(editProjectTask({
                    token,
                    baseUrl,
                    id: String(overdueTaskId),
                    data: { completion_percent: pendingCompletionPercentage }
                })).unwrap();
            }

            // Save the overdue reason as a comment
            const commentPayload = {
                comment: {
                    body: `Overdue reason: ${reason}`,
                    commentable_id: overdueTaskId,
                    commentable_type: 'TaskManagement',
                    commentor_id: JSON.parse(localStorage.getItem('user'))?.id,
                    active: true,
                },
            };

            await axios.post(`https://${baseUrl}/comments.json`, commentPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchData();

            const message = pendingStatusChange
                ? 'Task marked as complete with overdue reason'
                : 'Completion percentage updated with overdue reason';

            toast.success(message);
            setIsOverdueModalOpen(false);
            setOverdueTaskId(null);
            setPendingCompletionPercentage(0);
            setPendingStatusChange(null);
        } catch (error) {
            console.log(error);
            toast.error('Failed to update task');
        } finally {
            setIsOverdueLoading(false);
        }
    }

    const renderCell = (item: any, columnKey: string, isSubtask: boolean = false) => {
        const renderProgressBar = (
            completed: number,
            total: number,
            color: string,
            type?: string
        ) => {
            const progress = total > 0 ? (completed / total) * 100 : 0;
            return (
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() =>
                        type === "issues"
                            ? navigate(`/vas/issues?task_id=${item.id}`)
                            : null
                    }
                >
                    <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
                        {completed}
                    </span>
                    <div className="relative w-[8rem] bg-gray-200 rounded-full h-4 overflow-hidden flex items-center !justify-center">
                        <div
                            className={`absolute top-0 left-0 h-6 ${color} rounded-full transition-all duration-300`}
                            style={{ width: `${progress}%` }}
                        ></div>
                        <span className="relative z-10 text-xs font-semibold text-gray-800">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
                        {total}
                    </span>
                </div>
            );
        };

        switch (columnKey) {
            case "id":
                return <span className="w-[80px]">{isSubtask ? 'S-' : 'T-'}{item.id}</span>
            case "title":
                const isCompleted = item.status === 'completed';
                const isTaskStarted = item.is_started;
                const hasSubtasks = item.total_sub_tasks > 0;

                return (
                    <div className="flex items-center gap-2 w-full">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="w-full truncate">{item.title}</span>
                                </TooltipTrigger>
                                <TooltipContent className="rounded-[5px]">
                                    <p>{item.title}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        {!hasSubtasks && !isCompleted &&
                            (isTaskStarted ? (
                                <button
                                    onClick={() => {
                                        setPauseTaskId(item.id);
                                        setIsPauseModalOpen(true);
                                    }}
                                    disabled={isCompleted}
                                    className="p-1 hover:bg-gray-200 rounded transition disabled:opacity-50"
                                    title="Pause task"
                                >
                                    <Pause size={13} className="text-orange-500" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handlePlayTask(item.id)}
                                    disabled={isCompleted}
                                    className="p-1 hover:bg-gray-200 rounded transition disabled:opacity-50"
                                    title="Play task"
                                >
                                    <Play size={13} className="text-green-500" />
                                </button>
                            ))}
                    </div>
                );
            case "status": {
                const statusColorMap = {
                    open: { dot: "bg-blue-500" },
                    in_progress: { dot: "bg-amber-500" },
                    on_hold: { dot: "bg-gray-500" },
                    completed: { dot: "bg-teal-500" },
                    overdue: { dot: "bg-red-500" },
                };

                const colors = statusColorMap[item.status as keyof typeof statusColorMap] || statusColorMap.open;

                return <FormControl
                    variant="standard"
                    sx={{ width: 148 }} // same as w-32
                >
                    <Select
                        value={item.status}
                        onChange={(e) =>
                            handleStatusChange(item.id, e.target.value as string)
                        }
                        // disabled
                        disableUnderline
                        renderValue={(value) => (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span className={`inline-block w-2 h-2 rounded-full ${colors.dot}`}></span>
                                <span>{statusOptions.find(opt => opt.value === value)?.label || value}</span>
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
                            // "&.Mui-disabled": {
                            //     color: "#000",
                            // },
                            // // For the selected value text
                            // "&.Mui-disabled .MuiSelect-select": {
                            //     color: "#000",
                            //     WebkitTextFillColor: "#000",
                            // },
                        }}
                    >
                        {statusOptions.map((opt) => {
                            const optColors = statusColorMap[opt.value as keyof typeof statusColorMap];
                            return (
                                <MenuItem key={opt.value} value={opt.value} sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span className={`inline-block w-2 h-2 rounded-full ${optColors?.dot || "bg-gray-500"}`}></span>
                                    <span>{opt.label}</span>
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            }
            case "workflowStatus": {
                return <FormControl
                    variant="standard"
                    sx={{ width: 128 }} // same as w-32
                >
                    <Select
                        value={item.project_status_id ?? "1"}
                        onChange={(e) =>
                            handleWorkflowStatusChange(item.id, e.target.value as string)
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
                        {statuses.map((opt) => (
                            <MenuItem key={opt.id} value={opt.id}>
                                {opt.status}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            }
            case "responsible": {
                return <FormControl
                    variant="standard"
                    fullWidth
                    sx={{
                        minWidth: 200,
                    }}
                >
                    <Select
                        value={item.responsible_person_id ?? ""}
                        onChange={(e) =>
                            handleUpdateTask(item.id, Number(e.target.value))
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
            }
            case "subtasks": {
                const completed = item.completed_sub_tasks || 0;
                const total = item.total_sub_tasks || 0;
                return renderProgressBar(completed, total, "bg-[#b4e7ff]", "subtasks");
            }
            case "issues": {
                const completed = item.completed_issues || 0;
                const total = item.total_issues || 0;
                return renderProgressBar(completed, total, "bg-[#ff9a9e]", "issues");
            }
            case "duration": {
                return <CountdownTimer startDate={item.expected_start_date} targetDate={item.target_date} />;
            }
            case "efforts_duration": {
                return `${item.estimated_hour || 0} hours`
            }
            case "priority": {
                return item.priority.charAt(0).toUpperCase() + item.priority.slice(1) || "-";
            }
            case "started_time": {
                return <ActiveTimer activeTimeTillNow={item?.active_time_till_now} isStarted={item?.is_started} />;
            }
            case "predecessor": {
                return item.predecessor_task?.length || "0";
            }
            case "successor": {
                return item.successor_task?.length || "0";
            }
            case "completion_percentage": {
                const loggedInUserId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

                if (item.responsible_person_id === loggedInUserId) {
                    return (
                        <input
                            type="number"
                            defaultValue={item.completion_percent || 0}
                            className="border border-gray-200 focus:outline-none p-2 w-[4rem]"
                            min={0}
                            max={100}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    const value = (e.target as HTMLInputElement).value;
                                    if (value < item.completion_percent) {
                                        toast.error(`Completion percentage must be greater than or equal to the current completion percentage (${item.completion_percent}%)`);
                                        return;
                                    }
                                    handleCompletionPercentageChange(item.id, value);
                                }
                            }}
                            onBlur={(e) => {
                                const value = e.target.value;
                                if (value !== String(item.completion_percent)) {
                                    if (value < item.completion_percent) {
                                        toast.error(`Completion percentage must be greater than or equal to the current completion percentage (${item.completion_percent}%)`);
                                        return;
                                    }
                                    handleCompletionPercentageChange(item.id, value);
                                }
                            }}
                        />
                    );
                }

                return <input
                    type="number"
                    defaultValue={item.completion_percent || 0}
                    className="border border-gray-200 focus:outline-none p-2 w-[4rem]"
                    min={0}
                    max={100}
                    readOnly
                />
            }
            default:
                return item[columnKey] || "-";
        }
    };

    const renderEditableCell = (columnKey: string, value: any, onChange: (val: any) => void) => {
        if (columnKey === "status") {
            return (
                <Select
                    value={value || "open"}
                    onChange={(e) => onChange(e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{ minWidth: 120 }}
                >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="on_hold">On Hold</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                </Select>
            );
        }
        if (columnKey === "responsible") {
            return (
                <Select
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="">
                        <em>Select Responsible Person</em>
                    </MenuItem>
                    {
                        users.map((user: any) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.full_name || user.name}
                            </MenuItem>
                        ))
                    }
                </Select>
            );
        }
        if (columnKey === "expected_start_date") {
            return (
                <TextField
                    type="date"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    size="small"
                    sx={{ minWidth: 130 }}
                    InputLabelProps={{ shrink: true }}
                />
            );
        }
        if (columnKey === "target_date") {
            return (
                <TextField
                    type="date"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    size="small"
                    sx={{ minWidth: 130 }}
                    InputLabelProps={{ shrink: true }}
                />
            );
        }
        if (columnKey === "priority") {
            return (
                <Select
                    value={value || "Medium"}
                    onChange={(e) => onChange(e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{ minWidth: 110 }}
                >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                </Select>
            );
        }
        if (columnKey === "title") {
            return (
                <TextField
                    type="text"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter task title"
                    size="small"
                    sx={{ minWidth: 200 }}
                />
            );
        }
        return null;
    }

    const leftActions = (
        <>
            {shouldShow("employee_project_tasks", "create") && (
                <Button
                    className="bg-[#C72030] hover:bg-[#A01020] text-white"
                    onClick={() => setShowActionPanel(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Action
                </Button>
            )}
        </>
    );

    const rightActions = (
        <div className="flex items-center gap-1">
            {/* Task Type Toggle - Only show when NOT in milestone context */}
            {!mid && (
                <div className="flex items-center px-4 py-2">
                    <span className="text-gray-700 font-medium text-sm">All task</span>
                    <Switch
                        checked={taskType === "my"}
                        onChange={() => setTaskType(taskType === "all" ? "my" : "all")}
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#C72030',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#C72030',
                            },
                        }}
                    />
                    <span className="text-gray-700 font-medium text-sm">My Task</span>
                </div>
            )}

            {/* View Type Selector */}
            <div className="relative" ref={viewDropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                    <span className="text-[#C72030] font-medium flex items-center gap-2">
                        {selectedView === "Kanban" ? (
                            <ChartNoAxesColumn className="w-4 h-4 rotate-180 text-[#C72030]" />
                        ) : (
                            <List className="w-4 h-4 text-[#C72030]" />
                        )}
                        {selectedView}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {isOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                        <div className="py-2">
                            <button
                                onClick={() => {
                                    setSelectedView("Kanban");
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                            >
                                <div className="w-4 flex justify-center">
                                    <ChartNoAxesColumn className="rotate-180 text-[#C72030]" />
                                </div>
                                <span className="text-gray-700">Kanban</span>
                            </button>

                            <button
                                onClick={() => {
                                    setSelectedView("List");
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                            >
                                <div className="w-4 flex justify-center">
                                    <List className="w-4 h-4 text-[#C72030]" />
                                </div>
                                <span className="text-gray-700">List</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Status Filter */}
            <div className="relative" ref={statusDropdownRef}>
                <button
                    onClick={() => setOpenStatusOptions(!openStatusOptions)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                    <span className="text-[#C72030] font-medium flex items-center gap-2">
                        {STATUS_OPTIONS.find((option) => option.value === selectedFilterOption)?.label || "All"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {openStatusOptions && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                        <div className="py-2">
                            {
                                STATUS_OPTIONS.map((option) => (
                                    <button
                                        onClick={() => {
                                            setSelectedFilterOption(option.value);
                                            setOpenStatusOptions(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                                    >
                                        <span className="text-gray-700">{option.label}</span>
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                )}
            </div>

        </div>
    );

    if (selectedView === "Kanban") {
        return (
            <div className="p-6">
                {
                    location.pathname.includes("projects") && (
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="px-0 mb-2"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    )
                }
                <div className="flex items-center justify-between">
                    <Button
                        className="bg-[#C72030] hover:bg-[#A01020] text-white"
                        onClick={handleOpenDialog}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                    <div className="flex items-center gap-2">
                        {/* Task Type Toggle - Only show when NOT in milestone context */}
                        {!mid && (
                            <div className="flex items-center gap-2 px-4 py-2">
                                <span className="text-gray-700 font-medium text-sm">All task</span>
                                <Switch
                                    checked={taskType === "my"}
                                    onChange={() => setTaskType(taskType === "all" ? "my" : "all")}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#C72030',
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#C72030',
                                        },
                                    }}
                                />
                                <span className="text-gray-700 font-medium text-sm">My Task</span>
                            </div>
                        )}

                        <div className="relative">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            >
                                <span className="text-[#C72030] font-medium flex items-center gap-2">
                                    {selectedView === "Kanban" ? (
                                        <ChartNoAxesColumn className="w-4 h-4 rotate-180 text-[#C72030]" />
                                    ) : (
                                        <List className="w-4 h-4 text-[#C72030]" />
                                    )}
                                    {selectedView}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                            </button>

                            {isOpen && (
                                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                                    <div className="py-2">
                                        <button
                                            onClick={() => {
                                                setSelectedView("Kanban");
                                                setIsOpen(false);
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                                        >
                                            <div className="w-4 flex justify-center">
                                                <ChartNoAxesColumn className="rotate-180 text-[#C72030]" />
                                            </div>
                                            <span className="text-gray-700">Kanban</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSelectedView("List");
                                                setIsOpen(false);
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                                        >
                                            <div className="w-4 flex justify-center">
                                                <List className="w-4 h-4 text-[#C72030]" />
                                            </div>
                                            <span className="text-gray-700">List</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <TaskManagementKanban fetchData={fetchData} />

                <Dialog
                    open={openTaskModal}
                    onClose={handleCloseModal}
                    TransitionComponent={Transition}
                    maxWidth={false}
                >
                    <DialogContent
                        className="w-1/2 fixed right-0 top-0 rounded-none bg-[#fff] text-sm overflow-y-auto"
                        style={{ margin: 0, maxHeight: "100vh", display: "flex", flexDirection: "column" }}
                        sx={{
                            padding: "0 !important",
                            "& .MuiDialogContent-root": {
                                padding: "0 !important",
                                overflow: "auto",
                            }
                        }}
                    >
                        <div className="sticky top-0 bg-white z-10">
                            <h3 className="text-[14px] font-medium text-center mt-8">Add Task</h3>
                            <X
                                className="absolute top-[26px] right-8 cursor-pointer w-4 h-4"
                                onClick={handleCloseModal}
                            />
                            <hr className="border border-[#E95420] mt-4" />
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <ProjectTaskCreateModal
                                isEdit={false}
                                onCloseModal={handleCloseModal}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    // Render subtasks as collapsible child rows
    const renderChildrenRows = (children: any[], parentId: string) => {
        return (
            <>
                {children.map((subtask, idx) => (
                    <tr
                        key={`${parentId}-subtask-${idx}`}
                        className="bg-blue-50 hover:bg-blue-100 border-b border-gray-200"
                    >
                        {/* Collapse column (empty for subtasks) */}
                        <td className="p-4 text-center w-12 min-w-12"></td>

                        {/* Indented actions cell */}
                        <td className="p-4 text-center w-16 min-w-16">
                            <div className="flex justify-center items-center gap-2 ml-4">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="p-1"
                                    onClick={() => handleView(subtask.id)}
                                    title="View Subtask Details"
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                            </div>
                        </td>

                        {/* Subtask data in same columns */}
                        {columns.map((column) => (
                            <td key={`${parentId}-subtask-${idx}-${column.key}`} className="p-4 text-left min-w-32">
                                {renderCell(subtask, column.key, true)}
                            </td>
                        ))}
                    </tr>
                ))}
            </>
        );
    };

    return (
        <div className="p-6">
            {
                location.pathname.includes("projects") && (
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="px-0 mb-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                )
            }
            <EnhancedTable
                data={tasks}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
                rightActions={rightActions}
                storageKey="projects-table"
                onSort={handleColumnSort}
                onFilterClick={() => setIsFilterModalOpen(true)}
                canAddRow={true}
                loading={loading}
                readonlyColumns={["id", "duration", "predecessor", "successor"]}
                onAddRow={(newRowData) => {
                    handleSubmit(newRowData)
                }}
                renderEditableCell={renderEditableCell}
                newRowPlaceholder="Click to add new task"
                collapsible={true}
                getChildrenKey={() => "sub_tasks_managements"}
                renderChildrenRows={renderChildrenRows}
            />

            <Dialog
                open={openTaskModal}
                onClose={handleCloseModal}
                TransitionComponent={Transition}
                maxWidth={false}
            >
                <DialogContent
                    className="w-1/2 fixed right-0 top-0 rounded-none bg-[#fff] text-sm overflow-y-auto"
                    style={{ margin: 0, maxHeight: "100vh", display: "flex", flexDirection: "column" }}
                    sx={{
                        padding: "0 !important",
                        "& .MuiDialogContent-root": {
                            padding: "0 !important",
                            overflow: "auto",
                        }
                    }}
                >
                    <div className="sticky top-0 bg-white z-10">
                        <h3 className="text-[14px] font-medium text-center mt-8">Add Task</h3>
                        <X
                            className="absolute top-[26px] right-8 cursor-pointer w-4 h-4"
                            onClick={handleCloseModal}
                        />
                        <hr className="border border-[#E95420] mt-4" />
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <ProjectTaskCreateModal
                            isEdit={false}
                            onCloseModal={handleCloseModal}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {pagination.total_pages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                                    className={pagination.current_page === 1 || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                            {renderPaginationItems()}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                                    className={pagination.current_page === pagination.total_pages || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {/* Advanced Filter Modal */}
            <Dialog
                open={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                TransitionComponent={Transition}
                maxWidth={false}
            >
                <DialogContent
                    className="w-full max-w-sm fixed right-0 top-0 rounded-none bg-[#fff] text-sm overflow-y-auto h-full"
                    style={{ margin: 0, maxHeight: "100vh", display: "flex", flexDirection: "column" }}
                    sx={{
                        padding: "0 !important",
                        "& .MuiDialogContent-root": {
                            padding: "0 !important",
                            overflow: "auto",
                        }
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10">
                        <h2 className="text-xl font-semibold">Filter</h2>
                        <X className="cursor-pointer" onClick={() => setIsFilterModalOpen(false)} />
                    </div>

                    {/* Search Bar */}
                    <div className="px-6 py-4 border-b">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-red-400" size={18} />
                            <input
                                type="text"
                                placeholder="Filter search..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                            />
                        </div>
                    </div>

                    {/* Filter Options */}
                    <div className="flex-1 overflow-y-auto divide-y">
                        {/* Project - Only show when NOT in project view */}
                        {!location.pathname.includes('/projects/') && (
                            <div className="p-6 py-3">
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleDropdown('project')}
                                >
                                    <span className="font-medium text-sm select-none">Project</span>
                                    {dropdowns.project ? (
                                        <ChevronDown className="text-gray-400" />
                                    ) : (
                                        <ChevronRight className="text-gray-400" />
                                    )}
                                </div>
                                {dropdowns.project && (
                                    <div className="mt-4 border">
                                        <div className="relative border-b">
                                            <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                            <input
                                                type="text"
                                                placeholder="Filter project..."
                                                className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                                value={searchTerms.project}
                                                onChange={(e) => setSearchTerms({ ...searchTerms, project: e.target.value })}
                                            />
                                        </div>
                                        {renderCheckboxList(
                                            projectOptions,
                                            selectedProjects,
                                            setSelectedProjects,
                                            searchTerms.project
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Status */}
                        <div className="p-6 py-3">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleDropdown('status')}
                            >
                                <span className="font-medium text-sm select-none">Status</span>
                                {dropdowns.status ? (
                                    <ChevronDown className="text-gray-400" />
                                ) : (
                                    <ChevronRight className="text-gray-400" />
                                )}
                            </div>
                            {dropdowns.status && (
                                <div className="mt-4 border">
                                    <div className="relative border-b">
                                        <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Filter status..."
                                            className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                            value={searchTerms.status}
                                            onChange={(e) => setSearchTerms({ ...searchTerms, status: e.target.value })}
                                        />
                                    </div>
                                    {renderCheckboxList(
                                        STATUS_OPTIONS.filter(opt => opt.value !== 'all'),
                                        selectedStatuses,
                                        setSelectedStatuses,
                                        searchTerms.status
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Workflow Status */}
                        <div className="p-6 py-3">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleDropdown('workflowStatus')}
                            >
                                <span className="font-medium text-sm select-none">Workflow Status</span>
                                {dropdowns.workflowStatus ? (
                                    <ChevronDown className="text-gray-400" />
                                ) : (
                                    <ChevronRight className="text-gray-400" />
                                )}
                            </div>
                            {dropdowns.workflowStatus && (
                                <div className="mt-4 border">
                                    <div className="relative border-b">
                                        <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Filter workflow status..."
                                            className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                            value={searchTerms.workflowStatus}
                                            onChange={(e) => setSearchTerms({ ...searchTerms, workflowStatus: e.target.value })}
                                        />
                                    </div>
                                    {renderCheckboxList(
                                        statuses,
                                        selectedWorkflowStatus,
                                        setSelectedWorkflowStatus,
                                        searchTerms.workflowStatus
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Responsible Person */}
                        <div className="p-6 py-3">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleDropdown('responsiblePerson')}
                            >
                                <span className="font-medium text-sm select-none">Responsible Person</span>
                                {dropdowns.responsiblePerson ? (
                                    <ChevronDown className="text-gray-400" />
                                ) : (
                                    <ChevronRight className="text-gray-400" />
                                )}
                            </div>
                            {dropdowns.responsiblePerson && (
                                <div className="mt-4 border">
                                    <div className="relative border-b">
                                        <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Filter responsible person..."
                                            className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                            value={searchTerms.responsiblePerson}
                                            onChange={(e) => setSearchTerms({ ...searchTerms, responsiblePerson: e.target.value })}
                                        />
                                    </div>
                                    {renderCheckboxList(
                                        users.map(u => ({ ...u, label: u.full_name, value: u.id })),
                                        selectedResponsible,
                                        setSelectedResponsible,
                                        searchTerms.responsiblePerson
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Created By */}
                        <div className="p-6 py-3">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleDropdown('createdBy')}
                            >
                                <span className="font-medium text-sm select-none">Created By</span>
                                {dropdowns.createdBy ? (
                                    <ChevronDown className="text-gray-400" />
                                ) : (
                                    <ChevronRight className="text-gray-400" />
                                )}
                            </div>
                            {dropdowns.createdBy && (
                                <div className="mt-4 border">
                                    <div className="relative border-b">
                                        <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Filter created by..."
                                            className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                            value={searchTerms.createdBy}
                                            onChange={(e) => setSearchTerms({ ...searchTerms, createdBy: e.target.value })}
                                        />
                                    </div>
                                    {renderCheckboxList(
                                        users.map(u => ({ ...u, label: u.full_name, value: u.id })),
                                        selectedCreators,
                                        setSelectedCreators,
                                        searchTerms.createdBy
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Date Range */}
                        <div className="p-6 py-3">
                            <div className="space-y-3">
                                <div>
                                    <label className="font-medium text-sm select-none block mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={dates.startDate}
                                        onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
                                        className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                                    />
                                </div>
                                <div>
                                    <label className="font-medium text-sm select-none block mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={dates.endDate}
                                        onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
                                        className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center items-center gap-4 px-6 py-3 border-t sticky bottom-0 bg-white">
                        <button
                            className="bg-[#C72030] text-white rounded px-10 py-2 text-sm font-semibold hover:bg-[#b71c1c]"
                            onClick={handleApplyFilter}
                        >
                            Apply
                        </button>
                        <button
                            className="border border-[#C72030] text-[#C72030] rounded px-10 py-2 text-sm font-semibold hover:bg-red-50"
                            onClick={handleClearFilters}
                        >
                            Reset
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Pause Reason Modal */}
            <PauseReasonModal
                isOpen={isPauseModalOpen}
                onClose={() => {
                    setIsPauseModalOpen(false);
                    setPauseTaskId(null);
                }}
                onSubmit={handlePauseTaskSubmit}
                onEndTask={handleEndTaskSubmit}
                isLoading={isPauseLoading}
                taskId={pauseTaskId}
            />

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

            {showActionPanel && (
                <SelectionPanel
                    onAdd={handleOpenDialog}
                    onImport={() => setIsImportModalOpen(true)}
                    onClearSelection={() => setShowActionPanel(false)}
                />
            )}

            <CommonImportModal
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                open={isImportModalOpen}
                onOpenChange={setIsImportModalOpen}
                title="Import Tasks"
                entityType="tasks"
                onSampleDownload={handleSampleDownload}
                onImport={handleImportTasks}
                isUploading={isUploading}
            />
        </div>
    );
}

export default ProjectTasksPage