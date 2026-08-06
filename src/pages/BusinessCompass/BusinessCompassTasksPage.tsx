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
import { resetUserAvailability } from "@/store/slices/projectTasksSlice";
import { useBusinessCompassTasks } from "@/hooks/useBusinessCompassTasks";
import { useImportTasks } from "@/hooks/useTasks";
import { useDebounce } from "@/hooks/useDebounce";
import {
    ChevronDown,
    Eye,
    Plus,
    X,
    Search,
    ChevronRight,
    Play,
    Pause,
} from "lucide-react";
import { useEffect, useState, useRef, forwardRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    MenuItem,
    Select,
    Slide,
    FormControl,
} from "@mui/material";
import { toast } from "sonner";
import BCTaskCreateModal from "@/components/BusinessCompass/BCTaskCreateModal";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { TransitionProps } from "@mui/material/transitions";
import { useLayout } from "@/contexts/LayoutContext";
import clsx from "clsx";
import axios from "axios";
import { baseClient } from "@/utils/withoutTokenBase";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { CommonImportModal } from "@/components/CommonImportModal";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const columns: ColumnConfig[] = [
    {
        key: "actions",
        label: "Actions",
        sortable: false,
        draggable: true,
        defaultVisible: true,
    },
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
        key: "start_date",
        label: "Start Date",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "due_date",
        label: "Due Date",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "started_time",
        label: "Actual Efforts Taken",
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
        key: "priority",
        label: "Priority",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
];

const STATUS_OPTIONS = [
    { value: "all", label: "All" },
    { value: "open", label: "Open", color: "bg-[#c85e68]" },
    { value: "in_progress", label: "In Progress", color: "bg-yellow-500" },
    { value: "completed", label: "Completed", color: "bg-green-400" },
    { value: "on_hold", label: "On Hold", color: "bg-grey-500" },
    { value: "overdue", label: "Overdue", color: "bg-red-500" },
];

const statusOptions = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" },
];

// Map frontend column keys to backend field names
const COLUMN_TO_BACKEND_MAP: Record<string, string> = {
    id: "id",
    title: "title",
    status: "status",
    responsible: "responsible_person_id",
    start_date: "start_date",
    due_date: "due_date",
    duration: "due_date",
    efforts_duration: "effort_duration",
    priority: "priority",
};

// Utility function to calculate duration between two dates
const calculateDuration = (
    start: string | undefined,
    end: string | undefined
): { text: string; isOverdue: boolean } => {
    if (!end) return { text: "N/A", isOverdue: false };

    const now = new Date();
    const startDate = start ? new Date(start) : now;
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    if (now < startDate) {
        return { text: "Not started", isOverdue: false };
    }

    const diffMs = endDate.getTime() - now.getTime();
    const absDiffMs = Math.abs(diffMs);
    const isOverdue = diffMs <= 0;

    const seconds = Math.floor(absDiffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;

    const timeStr = `${days > 0 ? days + "d " : "0d "}${remainingHours > 0 ? remainingHours + "h " : "0h "}${remainingMinutes > 0 ? remainingMinutes + "m " : "0m"}`;
    return { text: timeStr, isOverdue };
};

const CountdownTimer = ({
    startDate,
    targetDate,
}: {
    startDate?: string;
    targetDate?: string;
}) => {
    const [countdown, setCountdown] = useState(
        calculateDuration(startDate, targetDate)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(calculateDuration(startDate, targetDate));
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate, startDate]);

    const textColor = countdown.isOverdue ? "text-red-600" : "text-[#029464]";
    return (
        <div className={`text-left ${textColor} text-[12px]`}>{countdown.text}</div>
    );
};

// Pause Reason Modal Component
const PauseReasonModal = ({
    isOpen,
    onClose,
    onSubmit,
    onEndTask,
    isLoading,
    taskId,
}) => {
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setReason("");
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast.error("Please enter a reason for pausing the task");
            return;
        }
        onSubmit(reason, taskId);
    };

    const handleEndTask = () => {
        if (!reason.trim()) {
            toast.error("Please enter a reason for ending the task");
            return;
        }
        onEndTask(reason, taskId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-[30rem] mx-4">
                <h2 className="fm-button-fix fm-button-brand px-4 py-2">
                    Reason for Pause/End
                </h2>

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
                        className="fm-button-fix fm-button-brand px-4 py-2"
                    >
                        {isLoading ? "Submitting..." : "End Task"}
                    </Button>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="fm-button-fix fm-button-brand px-4 py-2"
                        >
                            {isLoading ? "Submitting..." : "Pause Task"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Responsible Person Change Modal Component
const ResponsiblePersonReasonModal = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    taskId,
    pendingResponsiblePersonId = null,
    users = [],
}: any) => {
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setReason("");
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast.error("Please enter a reason for changing the responsible person");
            return;
        }
        if (taskId && pendingResponsiblePersonId) {
            onSubmit(reason, taskId, pendingResponsiblePersonId);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-[30rem] mx-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Reason for Responsible Person Change
                </h2>

                <div className="mb-6">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason for changing responsible person..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={4}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? "Submitting..." : "Change Responsible Person"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Hold Reason Modal Component
const HoldReasonModal = ({ isOpen, onClose, onSubmit, isLoading, taskId }) => {
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setReason("");
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast.error("Please enter a reason for putting the task on hold");
            return;
        }
        onSubmit(reason, taskId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-[30rem] mx-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Reason for Hold
                </h2>

                <div className="mb-6">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason for putting task on hold..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        rows={4}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                    >
                        {isLoading ? "Submitting..." : "Put on Hold"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Overdue Reason Modal Component
const OverdueReasonModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setReason("");
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast.error("Please enter a reason for the overdue task");
            return;
        }
        onSubmit(reason);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-[30rem] mx-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Reason for Overdue
                </h2>

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
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="fm-button-fix fm-button-brand px-4 py-2"
                    >
                        {isLoading ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const BusinessCompassTasksPage = () => {
    const { setCurrentSection } = useLayout();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const token =
        sessionStorage.getItem("mobile_token") || localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    useEffect(() => {
        setCurrentSection("Business Compass");
    }, [setCurrentSection]);

    const [users, setUsers] = useState([]);
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [openStatusOptions, setOpenStatusOptions] = useState(false);
    const [selectedFilterOption, setSelectedFilterOption] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Sorting state
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
        null
    );

    // Import modal state
    const [showActionPanel, setShowActionPanel] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Filter Modal State
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedResponsible, setSelectedResponsible] = useState<number[]>([]);
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [dates, setDates] = useState({
        startDate: "",
        endDate: "",
    });
    const [tags, setTags] = useState<any[]>([]);
    const [dropdowns, setDropdowns] = useState({
        status: false,
        responsiblePerson: false,
        tags: false,
        startDate: false,
        endDate: false,
    });
    const [searchTerms, setSearchTerms] = useState({
        status: "",
        responsiblePerson: "",
        tags: "",
    });

    // Pause Modal State
    const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
    const [pauseTaskId, setPauseTaskId] = useState<number | null>(null);
    const [isPauseLoading, setIsPauseLoading] = useState(false);

    // Hold Reason Modal State
    const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
    const [holdTaskId, setHoldTaskId] = useState<number | null>(null);
    const [isHoldLoading, setIsHoldLoading] = useState(false);

    // Responsible Person Change Modal State
    const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);
    const [responsibleTaskId, setResponsibleTaskId] = useState<number | null>(
        null
    );
    const [pendingResponsiblePersonId, setPendingResponsiblePersonId] = useState<
        number | null
    >(null);
    const [isResponsibleLoading, setIsResponsibleLoading] = useState(false);

    // Overdue Reason Modal State
    const [isOverdueModalOpen, setIsOverdueModalOpen] = useState(false);
    const [overdueTaskId, setOverdueTaskId] = useState<number | null>(null);
    const [isOverdueLoading, setIsOverdueLoading] = useState(false);
    const [pendingStatusChange, setPendingStatusChange] = useState<{
        id: number;
        status: string;
    } | null>(null);

    const statusDropdownRef = useRef<HTMLDivElement>(null);

    // Fetch tags from API
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = baseUrl
                    ? await axios.get(`https://${baseUrl}/company_tags.json`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    : await baseClient.get(`/company_tags.json`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                setTags(response.data || []);
            } catch (error) {
                console.log("Error fetching tags:", error);
                setTags([]);
            }
        };

        if (token && baseUrl) {
            fetchTags();
        }
    }, [baseUrl, token]);

    const getUsers = useCallback(async () => {
        try {
            const response = baseUrl
                ? await axios.get(
                    `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                : await baseClient.get(
                    `/pms/users/get_escalate_to_users.json?type=Task`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            setUsers(response.data.users);
        } catch (error) {
            console.log(error);
        }
    }, [baseUrl, token]);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    // Handle click outside for status dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                statusDropdownRef.current &&
                !statusDropdownRef.current.contains(event.target as Node)
            ) {
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

    const toggleDropdown = (key: keyof typeof dropdowns) => {
        setDropdowns((prev) => {
            const isAlreadyOpen = prev[key];
            if (isAlreadyOpen) {
                return { ...prev, [key]: false };
            }
            return {
                status: false,
                responsiblePerson: false,
                tags: false,
                startDate: false,
                endDate: false,
                [key]: true,
            };
        });
    };

    const toggleOption = (
        value: any,
        selected: any[],
        setSelected: (updater: (prev: any[]) => any[]) => void
    ) => {
        setSelected((prev: any[]) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    const renderCheckboxList = (
        options: any[],
        selected: any[],
        setSelected: (updater: (prev: any[]) => any[]) => void,
        searchTerm = ""
    ) => {
        const filtered = options.filter((opt) =>
            typeof opt === "string"
                ? opt.toLowerCase().includes(searchTerm.toLowerCase())
                : opt.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                opt.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="max-h-40 overflow-y-auto p-2">
                {filtered.map((option) => {
                    const label =
                        typeof option === "string"
                            ? option
                            : option.label || option.full_name;
                    const color = typeof option === "string" ? null : option.color;
                    const value = typeof option === "string" ? option : option.value;

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
                            {color && (
                                <span className={clsx("w-2 h-2 rounded-full", color)}></span>
                            )}
                        </label>
                    );
                })}
                {filtered?.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-2">
                        No results found
                    </div>
                )}
            </div>
        );
    };

    const handleApplyFilter = () => {
        setIsFilterModalOpen(false);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSelectedStatuses([]);
        setSelectedResponsible([]);
        setSelectedTags([]);
        setDates({ startDate: "", endDate: "" });
        setSearchTerms({
            status: "",
            responsiblePerson: "",
            tags: "",
        });
        setCurrentPage(1);
    };

    // Handle search input changes
    const handleSearchChange = useCallback((searchValue: string) => {
        setSearchTerm(searchValue);
        setCurrentPage(1);
    }, []);

    // Build filters for useBusinessCompassTasks hook
    const buildFilters = () => {
        const filters: Record<string, any> = {};

        if (selectedFilterOption !== "all") {
            filters["q[status_eq]"] = selectedFilterOption;
        }
        if (selectedStatuses.length > 0) {
            filters["q[status_in][]"] = selectedStatuses;
        }
        if (selectedResponsible.length > 0) {
            filters["q[responsible_person_id_in][]"] = selectedResponsible;
        }
        if (selectedTags.length > 0) {
            filters["q[tag_ids_in][]"] = selectedTags;
        }
        if (dates.startDate) {
            filters["q[start_date_eq]"] = dates.startDate;
        }
        if (dates.endDate) {
            filters["q[due_date_eq]"] = dates.endDate;
        }
        if (debouncedSearchTerm.trim()) {
            filters["q[title_or_description_cont]"] = debouncedSearchTerm.trim();
        }
        if (sortColumn && sortDirection) {
            filters["order_by"] = COLUMN_TO_BACKEND_MAP[sortColumn] || sortColumn;
            filters["order_direction"] = sortDirection;
        }

        return filters;
    };

    // TanStack Query hook for fetching Business Compass tasks
    const filters = buildFilters();
    const {
        data: tasksData,
        isLoading,
        refetch: refetchTasks,
    } = useBusinessCompassTasks({
        page: currentPage,
        filters,
    });

    // Extract tasks and pagination from response
    const tasks = tasksData?.tasks || tasksData?.data?.tasks || [];
    const paginationData =
        tasksData?.meta || tasksData?.pagination || tasksData?.data?.pagination;

    // Mutations
    const importMutation = useImportTasks();

    const handleOpenDialog = () => {
        setOpenTaskModal(true);
    };

    const handleCloseModal = () => {
        setOpenTaskModal(false);
        dispatch(resetUserAvailability());
    };

    const handlePageChange = async (page: number) => {
        if (
            page < 1 ||
            page > (paginationData?.total_pages || 1) ||
            page === currentPage ||
            isLoading
        ) {
            return;
        }
        setCurrentPage(page);
    };

    const renderPaginationItems = () => {
        if (!paginationData?.total_pages || paginationData.total_pages <= 0) {
            return null;
        }
        const items = [];
        const totalPages = paginationData.total_pages;
        const paginationCurrentPage = paginationData.current_page;
        const showEllipsis = totalPages > 7;

        if (showEllipsis) {
            items.push(
                <PaginationItem key={1} className="cursor-pointer">
                    <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={paginationCurrentPage === 1}
                        aria-disabled={isLoading}
                        className={isLoading ? "pointer-events-none opacity-50" : ""}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (paginationCurrentPage > 4) {
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
                                isActive={paginationCurrentPage === i}
                                aria-disabled={isLoading}
                                className={isLoading ? "pointer-events-none opacity-50" : ""}
                            >
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    );
                }
            }

            if (paginationCurrentPage > 3 && paginationCurrentPage < totalPages - 2) {
                for (
                    let i = paginationCurrentPage - 1;
                    i <= paginationCurrentPage + 1;
                    i++
                ) {
                    items.push(
                        <PaginationItem key={i} className="cursor-pointer">
                            <PaginationLink
                                onClick={() => handlePageChange(i)}
                                isActive={paginationCurrentPage === i}
                                aria-disabled={isLoading}
                                className={isLoading ? "pointer-events-none opacity-50" : ""}
                            >
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    );
                }
            }

            if (paginationCurrentPage < totalPages - 3) {
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
                                    isActive={paginationCurrentPage === i}
                                    aria-disabled={isLoading}
                                    className={isLoading ? "pointer-events-none opacity-50" : ""}
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
                            isActive={paginationCurrentPage === totalPages}
                            aria-disabled={isLoading}
                            className={isLoading ? "pointer-events-none opacity-50" : ""}
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
                            isActive={paginationCurrentPage === i}
                            aria-disabled={isLoading}
                            className={isLoading ? "pointer-events-none opacity-50" : ""}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        return items;
    };

    const handleSampleDownload = async () => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/task_import.xlsx`,
                {
                    responseType: "blob",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "sample_task.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Sample format downloaded successfully");
        } catch (error) {
            console.error("Error downloading sample file:", error);
            toast.error("Failed to download sample file. Please try again.");
        }
    };

    const handleImportTasks = async () => {
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            const response = await axios.post(
                `https://${baseUrl}/task_managements/import.json`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.failed && response.data.failed.length > 0) {
                response.data.failed.forEach(
                    (item: { row: number; errors: string[] }) => {
                        const errorMessages = item.errors.join(", ");
                        toast.error(`Row ${item.row}: ${errorMessages}`);
                    }
                );
            } else {
                toast.success("Tasks imported successfully");
                setIsImportModalOpen(false);
                setSelectedFile(null);
                refetchTasks();
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to import tasks");
        }
    };

    const handleView = (id) => {
        navigate(`/business-compass/tasks/${id}`);
    };

    const handleStatusChange = async (id: number, status: string) => {
        try {
            if (status === "on_hold") {
                setHoldTaskId(id);
                setIsHoldModalOpen(true);
                return;
            }

            if (status === "completed") {
                const task = tasks.find((t) => t.id === id);
                if (!task) {
                    toast.error("Task not found");
                    return;
                }

                const isTaskOverdue = (date: string | Date) => {
                    const d = new Date(date);
                    const today = new Date();
                    d.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);
                    return d < today;
                };

                if (isTaskOverdue(new Date(task.due_date))) {
                    setOverdueTaskId(id);
                    setPendingStatusChange({ id, status });
                    setIsOverdueModalOpen(true);
                    return;
                }
            }

            await axios.put(
                `https://${baseUrl}/business_compass/tasks/${id}/update_status.json`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await refetchTasks();
            toast.success("Task status changed successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to change task status");
        }
    };

    const handleUpdateTask = async (
        id: number,
        responsible_person_id: number
    ) => {
        setResponsibleTaskId(id);
        setPendingResponsiblePersonId(responsible_person_id);
        setIsResponsibleModalOpen(true);
    };

    const handleResponsiblePersonReasonSubmit = async (
        reason: string,
        tid: number,
        newResponsiblePersonId: number
    ) => {
        if (!tid || !newResponsiblePersonId) return;

        setIsResponsibleLoading(true);
        try {
            const task = tasks.find((t) => t.id === tid);
            const oldResponsibleName = task?.responsible_person || "Unknown";

            const newResponsibleUser = users.find(
                (u: any) => u.id === newResponsiblePersonId
            );
            const newResponsibleName =
                newResponsibleUser?.full_name || `User ${newResponsiblePersonId}`;

            await axios.put(
                `https://${baseUrl}/business_compass/tasks/${tid}.json`,
                { task: { responsible_person_id: newResponsiblePersonId } },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const commentPayload = {
                comment: {
                    body: `Responsible person changed from ${oldResponsibleName} to ${newResponsibleName} with reason: ${reason}`,
                    commentable_id: tid,
                    commentable_type: "Task",
                    commentor_id: JSON.parse(localStorage.getItem("user"))?.id,
                    active: true,
                },
            };

            await axios.post(`https://${baseUrl}/comments.json`, commentPayload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Responsible person changed with reason");
            setIsResponsibleModalOpen(false);
            setResponsibleTaskId(null);
            setPendingResponsiblePersonId(null);

            refetchTasks();
        } catch (error) {
            console.error("Failed to update responsible person:", error);
            toast.error(
                `Failed to update responsible person: ${error?.response?.data?.error || error?.message || "Server error"}`
            );
        } finally {
            setIsResponsibleLoading(false);
        }
    };

    const handleColumnSort = (columnKey: string) => {
        let newDirection: "asc" | "desc" | null;

        if (sortColumn === columnKey) {
            newDirection =
                sortDirection === "asc"
                    ? "desc"
                    : sortDirection === "desc"
                        ? null
                        : "asc";
        } else {
            newDirection = "asc";
        }

        setSortColumn(newDirection ? columnKey : null);
        setSortDirection(newDirection);
        setCurrentPage(1);
    };

    const handlePauseTaskSubmit = async (reason: string, tid: number) => {
        if (!tid) return;

        setIsPauseLoading(true);
        try {
            await axios.put(
                `https://${baseUrl}/business_compass/tasks/${tid}/update_status.json`,
                { status: "stopped" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const commentPayload = {
                comment: {
                    body: `Paused with reason: ${reason}`,
                    commentable_id: tid,
                    commentable_type: "Task",
                    commentor_id: JSON.parse(localStorage.getItem("user"))?.id,
                    active: true,
                },
            };

            await axios.post(`https://${baseUrl}/comments.json`, commentPayload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Task paused successfully with reason");
            setIsPauseModalOpen(false);
            setPauseTaskId(null);

            refetchTasks();
        } catch (error) {
            console.error("Failed to pause task:", error);
            toast.error(
                `Failed to pause task: ${error?.response?.data?.error || error?.message || "Server error"}`
            );
        } finally {
            setIsPauseLoading(false);
        }
    };

    const handleHoldReasonSubmit = async (reason: string, tid: number) => {
        if (!tid) return;

        setIsHoldLoading(true);
        try {
            await axios.put(
                `https://${baseUrl}/business_compass/tasks/${tid}/update_status.json`,
                { status: "on_hold" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const commentPayload = {
                comment: {
                    body: `On hold with reason: ${reason}`,
                    commentable_id: tid,
                    commentable_type: "Task",
                    commentor_id: JSON.parse(localStorage.getItem("user"))?.id,
                    active: true,
                },
            };

            await axios.post(`https://${baseUrl}/comments.json`, commentPayload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Task put on hold with reason");
            setIsHoldModalOpen(false);
            setHoldTaskId(null);

            refetchTasks();
        } catch (error) {
            console.error("Failed to put task on hold:", error);
            toast.error(
                `Failed to put task on hold: ${error?.response?.data?.error || error?.message || "Server error"}`
            );
        } finally {
            setIsHoldLoading(false);
        }
    };

    const handleEndTaskSubmit = async (reason: string, tid: number) => {
        if (!tid) return;

        setIsPauseLoading(true);
        try {
            await axios.put(
                `https://${baseUrl}/business_compass/tasks/${tid}/update_status.json`,
                { status: "completed" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await refetchTasks();

            const commentPayload = {
                comment: {
                    body: `Ended with reason: ${reason}`,
                    commentable_id: tid,
                    commentable_type: "Task",
                    commentor_id: JSON.parse(localStorage.getItem("user"))?.id,
                    active: true,
                },
            };

            await axios.post(`https://${baseUrl}/comments.json`, commentPayload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Task ended successfully");
            setIsPauseModalOpen(false);
            setPauseTaskId(null);

            refetchTasks();
        } catch (error) {
            console.error("Failed to end task:", error);
            toast.error(
                `Failed to end task: ${error?.response?.data?.error || error?.message || "Server error"}`
            );
        } finally {
            setIsPauseLoading(false);
        }
    };

    const handlePlayTask = async (id: number) => {
        try {
            await axios.put(
                `https://${baseUrl}/business_compass/tasks/${id}/update_status.json`,
                { status: "started" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await refetchTasks();
            toast.success("Task started successfully");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.error || "Failed to start task");
        }
    };

    const handleOverdueReasonSubmit = async (reason: string) => {
        if (!overdueTaskId || !pendingStatusChange) return;

        setIsOverdueLoading(true);
        try {
            await axios.put(
                `https://${baseUrl}/business_compass/tasks/${overdueTaskId}/update_status.json`,
                { status: pendingStatusChange.status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const commentPayload = {
                comment: {
                    body: `Overdue reason: ${reason}`,
                    commentable_id: overdueTaskId,
                    commentable_type: "Task",
                    commentor_id: JSON.parse(localStorage.getItem("user"))?.id,
                    active: true,
                },
            };

            await axios.post(`https://${baseUrl}/comments.json`, commentPayload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            refetchTasks();

            toast.success("Task marked as complete with overdue reason");
            setIsOverdueModalOpen(false);
            setOverdueTaskId(null);
            setPendingStatusChange(null);
        } catch (error) {
            console.log(error);
            toast.error("Failed to update task");
        } finally {
            setIsOverdueLoading(false);
        }
    };

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "actions":
                return (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="p-1"
                            onClick={() => handleView(item.id)}
                            title="View Task Details"
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                    </div>
                );
            case "id":
                return <span className="w-[80px]">T-{item.id}</span>;
            case "title": {
                const isCompleted = item.status === "completed";
                const isTaskStarted = item.is_started;

                return (
                    <div className="flex items-center gap-2 w-[20rem]">
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
                        {!isCompleted &&
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
                                    <Play size={13} color="#22c55e" />
                                </button>
                            ))}
                    </div>
                );
            }
            case "status": {
                const statusColorMap = {
                    open: { dot: "bg-blue-500" },
                    in_progress: { dot: "bg-amber-500" },
                    on_hold: { dot: "bg-gray-500" },
                    completed: { dot: "bg-teal-500" },
                    overdue: { dot: "bg-red-500" },
                };

                const colors =
                    statusColorMap[item.status as keyof typeof statusColorMap] ||
                    statusColorMap.open;

                return (
                    <FormControl variant="standard" sx={{ width: 148 }}>
                        <Select
                            value={item.status}
                            onChange={(e) =>
                                handleStatusChange(item.id, e.target.value as string)
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
                                        {statusOptions.find((opt) => opt.value === value)?.label ||
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
                            {statusOptions.map((opt) => {
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
            case "responsible": {
                return (
                    <FormControl variant="standard" fullWidth sx={{ minWidth: 200 }}>
                        <Select
                            value={item.responsible_person_id ?? ""}
                            onChange={(e) =>
                                handleUpdateTask(item.id, Number(e.target.value))
                            }
                            disableUnderline
                            sx={{
                                fontSize: "0.875rem",
                                cursor: "pointer",
                                "& .MuiSelect-select": { padding: "4px 0" },
                            }}
                        >
                            {users.map((user: any) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.full_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            }
            case "duration": {
                return (
                    <CountdownTimer
                        startDate={item.start_date}
                        targetDate={item.due_date}
                    />
                );
            }
            case "efforts_duration": {
                return item.effort_duration || "-";
            }
            case "priority": {
                return item.priority
                    ? item.priority.charAt(0).toUpperCase() + item.priority.slice(1)
                    : "-";
            }
            case "started_time": {
                return (
                    <ActiveTimer
                        activeTimeTillNow={item?.active_time_till_now}
                        isStarted={item?.is_started}
                    />
                );
            }
            default:
                return item[columnKey] || "-";
        }
    };

    const leftActions = (
        <>
            <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white px-2 sm:px-4"
                onClick={() => setShowActionPanel(true)}
            >
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Action</span>
            </Button>
        </>
    );

    const rightActions = (
        <div className="flex flex-wrap items-center gap-1">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-700 font-medium text-xs whitespace-nowrap">
                    Total:
                </span>
                <span className="text-sm font-bold text-[#C72030]">
                    {paginationData?.total_count || tasks.length || 0}
                </span>
            </div>

            {/* Status Filter */}
            <div className="relative" ref={statusDropdownRef}>
                <button
                    onClick={() => setOpenStatusOptions(!openStatusOptions)}
                    className="flex items-center gap-1 px-2 py-1.5 text-gray-700 hover:bg-gray-100 rounded"
                >
                    <span className="text-[#C72030] font-medium text-xs max-w-[50px] sm:max-w-[80px] truncate">
                        {STATUS_OPTIONS.find(
                            (option) => option.value === selectedFilterOption
                        )?.label || "All"}
                    </span>
                    <ChevronDown className="w-3 h-3 text-gray-600 flex-shrink-0" />
                </button>

                {openStatusOptions && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]">
                        <div className="py-2">
                            {STATUS_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSelectedFilterOption(option.value);
                                        setOpenStatusOptions(false);
                                        setCurrentPage(1);
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
    );

    return (
        <div className="p-3 sm:p-6">
            <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
                <EnhancedTable
                    data={tasks}
                    columns={columns}
                    renderCell={renderCell}
                    leftActions={leftActions}
                    rightActions={rightActions}
                    storageKey="business-compass-tasks-table"
                    onSort={handleColumnSort}
                    onSearchChange={handleSearchChange}
                    onFilterClick={() => setIsFilterModalOpen(true)}
                    loading={isLoading}
                    getItemId={(item: any) => String(item.id)}
                />
            </div>

            <BCTaskCreateModal
                isOpen={openTaskModal}
                onClose={handleCloseModal}
                onSuccess={() => refetchTasks()}
                baseUrl={baseUrl || ""}
                token={token || ""}
            />

            {paginationData && paginationData.total_pages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        handlePageChange(
                                            Math.max(1, paginationData.current_page - 1)
                                        )
                                    }
                                    className={
                                        paginationData.current_page === 1 || isLoading
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>
                            {renderPaginationItems()}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        handlePageChange(
                                            Math.min(
                                                paginationData.total_pages,
                                                paginationData.current_page + 1
                                            )
                                        )
                                    }
                                    className={
                                        paginationData.current_page ===
                                            paginationData.total_pages || isLoading
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
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
                    style={{
                        margin: 0,
                        maxHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                    sx={{
                        padding: "0 !important",
                        "& .MuiDialogContent-root": {
                            padding: "0 !important",
                            overflow: "auto",
                        },
                    }}
                >
                    <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10">
                        <h2 className="text-xl font-semibold">Filter</h2>
                        <X
                            className="cursor-pointer"
                            onClick={() => setIsFilterModalOpen(false)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y">
                        {/* Status */}
                        <div className="p-6 py-3">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleDropdown("status")}
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
                                        <Search
                                            className="absolute left-3 top-2.5 text-red-400"
                                            size={16}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Filter status..."
                                            className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                            value={searchTerms.status}
                                            onChange={(e) =>
                                                setSearchTerms({
                                                    ...searchTerms,
                                                    status: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    {renderCheckboxList(
                                        STATUS_OPTIONS.filter((opt) => opt.value !== "all"),
                                        selectedStatuses,
                                        setSelectedStatuses,
                                        searchTerms.status
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Responsible Person */}
                        <div className="p-6 py-3">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleDropdown("responsiblePerson")}
                            >
                                <span className="font-medium text-sm select-none">
                                    Responsible Person
                                </span>
                                {dropdowns.responsiblePerson ? (
                                    <ChevronDown className="text-gray-400" />
                                ) : (
                                    <ChevronRight className="text-gray-400" />
                                )}
                            </div>
                            {dropdowns.responsiblePerson && (
                                <div className="mt-4 border">
                                    <div className="relative border-b">
                                        <Search
                                            className="absolute left-3 top-2.5 text-red-400"
                                            size={16}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Filter responsible person..."
                                            className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                            value={searchTerms.responsiblePerson}
                                            onChange={(e) =>
                                                setSearchTerms({
                                                    ...searchTerms,
                                                    responsiblePerson: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    {renderCheckboxList(
                                        users.map((u: any) => ({
                                            ...u,
                                            label: u.full_name,
                                            value: u.id,
                                        })),
                                        selectedResponsible,
                                        setSelectedResponsible,
                                        searchTerms.responsiblePerson
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="p-6 py-3">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleDropdown("tags")}
                            >
                                <span className="font-medium text-sm select-none">Tags</span>
                                {dropdowns.tags ? (
                                    <ChevronDown className="text-gray-400" />
                                ) : (
                                    <ChevronRight className="text-gray-400" />
                                )}
                            </div>
                            {dropdowns.tags && (
                                <div className="mt-4 border">
                                    <div className="relative border-b">
                                        <Search
                                            className="absolute left-3 top-2.5 text-red-400"
                                            size={16}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Filter tags..."
                                            className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                            value={searchTerms.tags}
                                            onChange={(e) =>
                                                setSearchTerms({ ...searchTerms, tags: e.target.value })
                                            }
                                        />
                                    </div>
                                    {renderCheckboxList(
                                        tags.map((tag: any) => ({
                                            label: tag.name || tag.label,
                                            value: tag.id,
                                        })),
                                        selectedTags,
                                        setSelectedTags,
                                        searchTerms.tags
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Start Date */}
                        <div className="p-6 py-3">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleDropdown("startDate")}
                            >
                                <span className="font-medium text-sm select-none">
                                    Start Date
                                </span>
                                {dropdowns.startDate ? (
                                    <ChevronDown className="text-gray-400" />
                                ) : (
                                    <ChevronRight className="text-gray-400" />
                                )}
                            </div>
                            {dropdowns.startDate && (
                                <div className="mt-4">
                                    <input
                                        type="date"
                                        value={dates.startDate}
                                        onChange={(e) =>
                                            setDates({ ...dates, startDate: e.target.value })
                                        }
                                        className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                                    />
                                </div>
                            )}
                        </div>

                        {/* End Date */}
                        <div className="p-6 py-3">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleDropdown("endDate")}
                            >
                                <span className="font-medium text-sm select-none">
                                    End Date
                                </span>
                                {dropdowns.endDate ? (
                                    <ChevronDown className="text-gray-400" />
                                ) : (
                                    <ChevronRight className="text-gray-400" />
                                )}
                            </div>
                            {dropdowns.endDate && (
                                <div className="mt-4">
                                    <input
                                        type="date"
                                        value={dates.endDate}
                                        onChange={(e) =>
                                            setDates({ ...dates, endDate: e.target.value })
                                        }
                                        className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                                    />
                                </div>
                            )}
                        </div>

                    </div>

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

            {/* Hold Reason Modal */}
            <HoldReasonModal
                isOpen={isHoldModalOpen}
                onClose={() => {
                    setIsHoldModalOpen(false);
                    setHoldTaskId(null);
                }}
                onSubmit={handleHoldReasonSubmit}
                isLoading={isHoldLoading}
                taskId={holdTaskId}
            />

            {/* Responsible Person Change Reason Modal */}
            <ResponsiblePersonReasonModal
                isOpen={isResponsibleModalOpen}
                onClose={() => {
                    setIsResponsibleModalOpen(false);
                    setResponsibleTaskId(null);
                    setPendingResponsiblePersonId(null);
                }}
                onSubmit={handleResponsiblePersonReasonSubmit}
                isLoading={isResponsibleLoading}
                taskId={responsibleTaskId}
                pendingResponsiblePersonId={pendingResponsiblePersonId}
                users={users}
            />

            {/* Overdue Reason Modal */}
            <OverdueReasonModal
                isOpen={isOverdueModalOpen}
                onClose={() => {
                    setIsOverdueModalOpen(false);
                    setOverdueTaskId(null);
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
                isUploading={importMutation.isPending}
            />
        </div>
    );
};

export default BusinessCompassTasksPage;
