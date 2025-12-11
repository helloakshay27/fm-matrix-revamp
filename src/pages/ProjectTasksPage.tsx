import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useAppDispatch } from "@/store/hooks";
import { createProjectTask, fetchProjectTasks, filterTasks } from "@/store/slices/projectTasksSlice";
import { ChartNoAxesColumn, ChevronDown, Edit, Eye, List, Plus, X } from "lucide-react";
import { useEffect, useState, useRef, forwardRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Dialog, DialogContent, MenuItem, Select, Slide, TextField, Switch } from "@mui/material";
import { toast } from "sonner";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import ProjectTaskCreateModal from "@/components/ProjectTaskCreateModal";
import TaskManagementKanban from "@/components/TaskManagementKanban";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { TransitionProps } from "@mui/material/transitions";

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
        key: "duration",
        label: "Duration",
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
];

const STATUS_OPTIONS = [
    {
        value: "all",
        label: "All"
    },
    {
        value: "open",
        label: "Open"
    },
    {
        value: "in_progress",
        label: "In Progress"
    },
    {
        value: "completed",
        label: "Completed"
    },
    {
        value: "on_hold",
        label: "On Hold"
    },
    {
        value: "overdue",
        label: "Overdue"
    }
]

// Utility function to calculate duration between two dates (matching task_management)
const calculateDuration = (start: string | undefined, end: string | undefined): { text: string; isOverdue: boolean } => {
    if (!start || !end) return { text: "N/A", isOverdue: false };

    const now = new Date();
    const startDate = new Date(start);
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

const ProjectTasksPage = () => {
    const { id, mid } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [tasks, setTasks] = useState([])
    const [users, setUsers] = useState([])
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [selectedView, setSelectedView] = useState<"Kanban" | "List">("List");
    const [isOpen, setIsOpen] = useState(false);
    const [openStatusOptions, setOpenStatusOptions] = useState(false)
    const [selectedFilterOption, setSelectedFilterOption] = useState("all")
    const [isMyTasks, setIsMyTasks] = useState(() => {
        return localStorage.getItem('myTasks') === 'true'
    });
    const [taskType, setTaskType] = useState<"all" | "my">("all");
    const [pagination, setPagination] = useState({
        current_page: 1,
        next_page: null as number | null,
        prev_page: null as number | null,
        total_pages: 1,
        total_count: 0,
    })
    const [loading, setLoading] = useState(false)

    const fetchData = async (page: number = 1) => {
        try {
            setLoading(true);

            // Determine if we're in milestone context or standalone tasks
            const isMilestoneContext = mid !== undefined && mid !== null;

            let filters: any = { page };

            if (selectedFilterOption !== "all") {
                filters["q[status_eq]"] = selectedFilterOption;
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
    };

    const getUsers = async () => {
        try {
            const response = await dispatch(fetchFMUsers()).unwrap();
            setUsers(response.users);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData(1);
    }, [selectedFilterOption, taskType, mid]);

    useEffect(() => {
        getUsers();
    }, [])

    const handleOpenDialog = () => {
        setOpenTaskModal(true);
    };

    const handleCloseModal = () => {
        setOpenTaskModal(false);
        fetchData();
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
        // Validate all required fields
        if (!data.title?.trim()) {
            toast.error("Task title is required");
            return;
        }
        if (!data.expected_start_date || !data.start_date) {
            toast.error("Start date is required");
            return;
        }
        if (!data.target_date || !data.end_date) {
            toast.error("End date is required");
            return;
        }

        // Validate date range
        const dateValidation = validateDateRange(
            data.expected_start_date || data.start_date,
            data.target_date || data.end_date
        );
        if (!dateValidation.valid) {
            toast.error(dateValidation.error);
            return;
        }

        const payload = {
            task_management: {
                title: data.title,
                expected_start_date: data.expected_start_date || data.start_date,
                target_date: data.target_date || data.end_date,
                status: data.status || "open",
                priority: data.priority || "Medium",
                active: true,
                responsible_person_id: data.responsible || data.responsible_person_id,
                ...(id && { project_management_id: id }),
                ...(mid && { milestone_id: mid })
            }
        }
        try {
            await dispatch(createProjectTask({ token, baseUrl, data: payload })).unwrap();
            toast.success("Task created successfully");
            await fetchData();
        } catch (error) {
            console.log(error)
            toast.error(String(error) || "Failed to create task")
        }
    };

    const renderActions = (item: any) => (
        <div className="flex items-center justify-center gap-2">
            <Button
                size="sm"
                variant="ghost"
                className="p-1"
                onClick={() => navigate(`/vas/projects/${id}/milestones/${mid}/tasks/${item.id}`)}
                title="View Task Details"
            >
                <Eye className="w-4 h-4" />
            </Button>
            {/* <Button
                size="sm"
                variant="ghost"
                className="p-1"
                title="Edit Task"
            >
                <Edit className="w-4 h-4" />
            </Button> */}
        </div>
    );

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "status": {
                const statusColors: { [key: string]: string } = {
                    open: "bg-red-100 text-red-800",
                    in_progress: "bg-yellow-100 text-yellow-800",
                    completed: "bg-green-100 text-green-800",
                    on_hold: "bg-blue-100 text-blue-800",
                    overdue: "bg-red-100 text-red-800"
                };

                const statusDotColors: { [key: string]: string } = {
                    open: "bg-red-500",
                    in_progress: "bg-yellow-500",
                    completed: "bg-green-500",
                    on_hold: "bg-blue-500",
                    overdue: "bg-red-500"
                };

                const status = item.status || "open";
                return (
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors.open}`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusDotColors[status] || statusDotColors.open}`}
                        ></span>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                    </span>
                );
            }
            case "responsible": {
                return item.responsible_person?.name || item.responsible_person?.full_name || "-";
            }
            case "duration": {
                return <CountdownTimer startDate={item.expected_start_date} targetDate={item.target_date} />;
            }
            case "priority": {
                const priorityColors: { [key: string]: string } = {
                    High: "bg-red-100 text-red-800",
                    Medium: "bg-yellow-100 text-yellow-800",
                    Low: "bg-green-100 text-green-800"
                };

                const priorityDotColors: { [key: string]: string } = {
                    High: "bg-red-500",
                    Medium: "bg-yellow-500",
                    Low: "bg-green-500"
                };

                const priority = item.priority || "Medium";
                return (
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority] || priorityColors.Medium}`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priorityDotColors[priority] || priorityDotColors.Medium}`}
                        ></span>
                        {priority}
                    </span>
                );
            }
            case "predecessor": {
                return item.predecessor_task?.length || "-";
            }
            case "successor": {
                return item.successor_task?.length || "-";
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
            <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={handleOpenDialog}
            >
                <Plus className="w-4 h-4 mr-2" />
                Add
            </Button>
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

            {/* Status Filter */}
            <div className="relative">
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
                        <div className="relative">
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
                                        {STATUS_OPTIONS.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setSelectedFilterOption(option.value);
                                                    setOpenStatusOptions(false);
                                                }}
                                                className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                                            >
                                                <span className="text-gray-700">{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <TaskManagementKanban />
            </div>
        );
    }

    return (
        <div className="p-6">
            <EnhancedTable
                data={tasks}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
                rightActions={rightActions}
                storageKey="projects-table"
                onFilterClick={() => { }}
                canAddRow={true}
                readonlyColumns={["id", "duration", "predecessor", "successor"]}
                onAddRow={(newRowData) => {
                    handleSubmit(newRowData)
                }}
                renderEditableCell={renderEditableCell}
                newRowPlaceholder="Click to add new task"
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
                        <h3 className="text-[14px] font-medium text-center mt-8">Add Project Task</h3>
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
        </div>
    );
}

export default ProjectTasksPage