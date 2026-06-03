import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "./enhanced-table/EnhancedTable"
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Eye, Pause, Play, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { editProjectTask, updateTaskStatus } from "@/store/slices/projectTasksSlice";
import { toast } from "sonner";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useChangeTaskStatus } from "@/hooks/useTasks";
import axios from "axios";
import baseClient from "@/utils/withoutTokenBase";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Search, ChevronDown, ChevronRight } from "lucide-react";

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
        key: "project_management_title",
        label: "Project",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "milestone_title",
        label: "Milestone",
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
        key: "created_by",
        label: "Created By",
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
];

const statusOptions = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" },
]

const STATUS_OPTIONS_WITH_COLORS = [
    { value: "open", label: "Open", color: "bg-blue-500" },
    { value: "in_progress", label: "In Progress", color: "bg-amber-500" },
    { value: "on_hold", label: "On Hold", color: "bg-gray-500" },
    { value: "completed", label: "Completed", color: "bg-teal-500" },
    { value: "overdue", label: "Overdue", color: "bg-red-500" },
]

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

// Pause Reason Modal Component
const PauseReasonModal = ({ isOpen, onClose, onSubmit, onEndTask, isLoading, taskId }: any) => {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setReason('');
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast.error("Please enter a reason");
            return;
        }
        onSubmit(reason, taskId);
    };

    const handleEndTask = () => {
        if (!reason.trim()) {
            toast.error("Please enter a reason");
            return;
        }
        onEndTask(reason, taskId);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Pause Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="reason" className="text-sm font-medium">
                            Reason for pausing
                        </label>
                        <Textarea
                            id="reason"
                            placeholder="Enter reason for pausing this task..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Pausing..." : "Pause"}
                    </Button>
                    <Button variant="destructive" onClick={handleEndTask} disabled={isLoading}>
                        {isLoading ? "Ending..." : "End Task"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Hold Reason Modal Component
const HoldReasonModal = ({ isOpen, onClose, onSubmit, isLoading, taskId }: any) => {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setReason('');
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast.error("Please enter a reason");
            return;
        }
        onSubmit(reason, taskId);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Put Task on Hold</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="reason" className="text-sm font-medium">
                            Reason for holding
                        </label>
                        <Textarea
                            id="reason"
                            placeholder="Enter reason for putting this task on hold..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Holding..." : "Hold"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Overdue Reason Modal Component
const OverdueReasonModal = ({ isOpen, onClose, onSubmit, isLoading }: any) => {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setReason('');
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reason.trim()) {
            toast.error("Please enter a reason");
            return;
        }
        onSubmit(reason);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Task Overdue</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <p className="text-sm text-gray-600">
                        This task is overdue. Please provide a reason for completing it past the target date.
                    </p>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="reason" className="text-sm font-medium">
                            Reason
                        </label>
                        <Textarea
                            id="reason"
                            placeholder="Enter reason for the delay..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ResponsiblePersonReasonModal = ({ isOpen, onClose, onSubmit, isLoading, taskId, pendingResponsiblePersonId = null, users = [] }: any) => {
    const [reason, setReason] = useState('');
    useEffect(() => { if (!isOpen) setReason(''); }, [isOpen]);

    const handleSubmit = () => {
        if (!reason.trim()) { toast.error('Please enter a reason for changing the responsible person'); return; }
        if (taskId && pendingResponsiblePersonId) onSubmit(reason, taskId, pendingResponsiblePersonId);
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[30rem]">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Reason for Responsible Person Change</h2>
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-3">
                        New person: {(users as any[]).find((u: any) => u.id === pendingResponsiblePersonId)?.full_name || 'Unknown'}
                    </p>
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
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                        {isLoading ? 'Submitting...' : 'Change Responsible Person'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const SprintTasks = ({ tasks }) => {
    console.log(tasks)
    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const statusMutation = useChangeTaskStatus();

    const [users, setUsers] = useState([])
    const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
    const [pauseTaskId, setPauseTaskId] = useState<number | null>(null);
    const [isPauseLoading, setIsPauseLoading] = useState(false);
    const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
    const [holdTaskId, setHoldTaskId] = useState<number | null>(null);
    const [isHoldLoading, setIsHoldLoading] = useState(false);
    const [isOverdueModalOpen, setIsOverdueModalOpen] = useState(false);
    const [overdueTaskId, setOverdueTaskId] = useState<number | null>(null);
    const [pendingCompletionPercentage, setPendingCompletionPercentage] = useState<number>(0);
    const [isOverdueLoading, setIsOverdueLoading] = useState(false);
    const [pendingStatusChange, setPendingStatusChange] = useState<{ id: number; status: string } | null>(null);
    const [statuses, setStatuses] = useState([])

    // Filter state
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedResponsible, setSelectedResponsible] = useState<number[]>([]);
    const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [selectedWorkflowStatus, setSelectedWorkflowStatus] = useState<any[]>([]);
    const [filterDates, setFilterDates] = useState({ startDate: '', endDate: '' });
    const [filterDropdowns, setFilterDropdowns] = useState({
        status: false, workflowStatus: false, responsiblePerson: false,
        createdBy: false, project: false, startDate: false, endDate: false,
    });
    const [filterSearchTerms, setFilterSearchTerms] = useState({
        status: '', workflowStatus: '', responsiblePerson: '', createdBy: '', project: '',
    });

    // Responsible person state
    const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);
    const [responsibleTaskId, setResponsibleTaskId] = useState<number | null>(null);
    const [pendingResponsiblePersonId, setPendingResponsiblePersonId] = useState<number | null>(null);
    const [isResponsibleLoading, setIsResponsibleLoading] = useState(false);

    // Derive unique project options from tasks
    const projectOptions = useMemo(() => {
        const seen = new Set<string>();
        return tasks
            .filter(t => t.project_management_title && !seen.has(t.project_management_title) && seen.add(t.project_management_title))
            .map(t => ({ label: t.project_management_title, value: t.project_management_title }));
    }, [tasks]);

    // Derive unique created_by options from tasks
    const createdByOptions = useMemo(() => {
        const seen = new Set<string>();
        return tasks
            .filter(t => t.created_by_name && !seen.has(t.created_by_name) && seen.add(t.created_by_name))
            .map(t => ({ label: t.created_by_name, value: t.created_by_name }));
    }, [tasks]);

    // Frontend filtering
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            if (selectedStatuses.length > 0 && !selectedStatuses.includes(task.status)) return false;
            if (selectedWorkflowStatus.length > 0 && !selectedWorkflowStatus.map(Number).includes(Number(task.project_status_id))) return false;
            if (selectedResponsible.length > 0 && !selectedResponsible.includes(task.responsible_person_id)) return false;
            if (selectedCreators.length > 0 && !selectedCreators.includes(task.created_by_name)) return false;
            if (selectedProjects.length > 0 && !selectedProjects.includes(task.project_management_title)) return false;
            if (filterDates.startDate && task.expected_start_date < filterDates.startDate) return false;
            if (filterDates.endDate && task.target_date > filterDates.endDate) return false;
            return true;
        });
    }, [tasks, selectedStatuses, selectedWorkflowStatus, selectedResponsible, selectedCreators, selectedProjects, filterDates]);

    const toggleFilterDropdown = (key: keyof typeof filterDropdowns) => {
        setFilterDropdowns(prev => {
            const isAlreadyOpen = prev[key];
            return isAlreadyOpen
                ? { ...prev, [key]: false }
                : { status: false, workflowStatus: false, responsiblePerson: false, createdBy: false, project: false, startDate: false, endDate: false, [key]: true };
        });
    };

    const toggleFilterOption = (value: any, selected: any[], setSelected: Function) => {
        setSelected((prev: any[]) => prev.includes(value) ? prev.filter((v: any) => v !== value) : [...prev, value]);
    };

    const renderFilterCheckboxList = (options: any[], selected: any[], setSelected: Function, searchTerm = '') => {
        const filtered = options.filter(opt =>
            typeof opt === 'string'
                ? opt.toLowerCase().includes(searchTerm.toLowerCase())
                : opt.label?.toLowerCase().includes(searchTerm.toLowerCase()) || opt.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return (
            <div className="max-h-40 overflow-y-auto p-2">
                {filtered.map(option => {
                    const label = typeof option === 'string' ? option : (option.label || option.full_name);
                    const color = typeof option === 'string' ? null : option.color;
                    const value = typeof option === 'string' ? option : option.value;
                    return (
                        <label key={value} className="flex items-center justify-between py-2 px-2 text-sm cursor-pointer hover:bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={selected.includes(value)} onChange={() => toggleFilterOption(value, selected, setSelected)} />
                                <span>{label}</span>
                            </div>
                            {color && <span className={`w-2 h-2 rounded-full ${color}`}></span>}
                        </label>
                    );
                })}
                {filtered.length === 0 && <div className="text-center text-gray-400 text-sm py-2">No results found</div>}
            </div>
        );
    };

    const handleClearFilters = () => {
        setSelectedStatuses([]);
        setSelectedResponsible([]);
        setSelectedCreators([]);
        setSelectedProjects([]);
        setSelectedWorkflowStatus([]);
        setFilterDates({ startDate: '', endDate: '' });
        setFilterSearchTerms({ status: '', workflowStatus: '', responsiblePerson: '', createdBy: '', project: '' });
    };

    const activeFilterCount = selectedStatuses.length + selectedResponsible.length + selectedCreators.length + selectedProjects.length + selectedWorkflowStatus.length + (filterDates.startDate ? 1 : 0) + (filterDates.endDate ? 1 : 0);

    const handleView = (id) => {
        navigate(`/vas/tasks/${id}`);
    }

    const handlePlayTask = async (id: number) => {
        try {
            await dispatch(updateTaskStatus({ token, baseUrl, id: String(id), data: { status: 'started' } })).unwrap();
            toast.success("Task started successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to start task");
        }
    }

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
        getUsers();
    }, [getUsers]);

    const handlePauseTaskSubmit = async (reason: string, tid: number) => {
        if (!tid) return;
        setIsPauseLoading(true);
        try {
            await dispatch(updateTaskStatus({ token, baseUrl, id: String(tid), data: { status: 'stopped' } })).unwrap();
            await axios.post(`https://${baseUrl}/comments.json`, {
                comment: {
                    body: `Paused with reason: ${reason}`,
                    commentable_id: tid,
                    commentable_type: 'TaskManagement',
                    commentor_id: JSON.parse(localStorage.getItem('user'))?.id,
                    active: true,
                },
            }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success('Task paused successfully with reason');
            setIsPauseModalOpen(false);
            setPauseTaskId(null);
        } catch (error: any) {
            toast.error(`Failed to pause task: ${error?.response?.data?.error || error?.message || 'Server error'}`);
        } finally {
            setIsPauseLoading(false);
        }
    };

    const handleHoldReasonSubmit = async (reason: string, tid: number) => {
        if (!tid) return;
        setIsHoldLoading(true);
        try {
            await statusMutation.mutateAsync({ id: tid, status: 'on_hold' });
            await axios.post(`https://${baseUrl}/comments.json`, {
                comment: {
                    body: `On hold with reason: ${reason}`,
                    commentable_id: tid,
                    commentable_type: 'TaskManagement',
                    commentor_id: JSON.parse(localStorage.getItem('user'))?.id,
                    active: true,
                },
            }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success('Task put on hold with reason');
            setIsHoldModalOpen(false);
            setHoldTaskId(null);
        } catch (error: any) {
            toast.error(`Failed to put task on hold: ${error?.response?.data?.error || error?.message || 'Server error'}`);
        } finally {
            setIsHoldLoading(false);
        }
    };

    const handleEndTaskSubmit = async (reason: string, tid: number) => {
        if (!tid) return;
        setIsPauseLoading(true);
        try {
            await dispatch(updateTaskStatus({ token, baseUrl, id: String(tid), data: { status: 'completed' } })).unwrap();
            await axios.post(`https://${baseUrl}/comments.json`, {
                comment: {
                    body: `Ended with reason: ${reason}`,
                    commentable_id: tid,
                    commentable_type: 'TaskManagement',
                    commentor_id: JSON.parse(localStorage.getItem('user'))?.id,
                    active: true,
                },
            }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success('Task ended successfully');
            setIsPauseModalOpen(false);
            setPauseTaskId(null);
        } catch (error: any) {
            toast.error(`Failed to end task: ${error?.response?.data?.error || error?.message || 'Server error'}`);
        } finally {
            setIsPauseLoading(false);
        }
    };

    const handleOverdueReasonSubmit = async (reason: string) => {
        if (!pendingStatusChange) return;
        setIsOverdueLoading(true);
        try {
            await statusMutation.mutateAsync({ id: pendingStatusChange.id, status: pendingStatusChange.status });
            await axios.post(`https://${baseUrl}/comments.json`, {
                comment: {
                    body: `Overdue reason: ${reason}`,
                    commentable_id: pendingStatusChange.id,
                    commentable_type: 'TaskManagement',
                    commentor_id: JSON.parse(localStorage.getItem('user'))?.id,
                    active: true,
                },
            }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Task marked as completed");
            setIsOverdueModalOpen(false);
            setPendingStatusChange(null);
        } catch (error: any) {
            toast.error(`Failed to complete task: ${error?.response?.data?.error || error?.message || 'Server error'}`);
        } finally {
            setIsOverdueLoading(false);
        }
    };


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

    const handleStatusChange = async (id: number, status: string) => {
        try {
            // Check if task is being put on hold
            if (status === 'on_hold') {
                setHoldTaskId(id);
                setIsHoldModalOpen(true);
                return;
            }

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

            // Use TanStack Query mutation for status change
            await statusMutation.mutateAsync({ id, status });
            toast.success("Task status changed successfully");
        } catch (error) {
            console.log(error)
        }
    }

    const handleWorkflowStatusChange = async (id: number, status: string) => {
        try {
            await dispatch(editProjectTask({ token, baseUrl, id: String(id), data: { project_status_id: status } })).unwrap();
            toast.success("Task status changed successfully");
        } catch (error) {
            console.log(error)
        }
    }

    function formatHours(hours: number): string {
        if (hours < 1) {
            const minutes = Math.round(hours * 60);
            return `${minutes} min${minutes !== 1 ? 's' : ''}`;
        }

        const wholeHours = Math.floor(hours);
        const remainingMinutes = Math.round((hours - wholeHours) * 60);

        if (remainingMinutes === 0) {
            return `${wholeHours} hr${wholeHours !== 1 ? 's' : ''}`;
        }

        return `${wholeHours} hr${wholeHours !== 1 ? 's' : ''} ${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`;
    }

    const handleUpdateTask = async (id: number, responsible_person_id: number) => {
        setResponsibleTaskId(id);
        setPendingResponsiblePersonId(responsible_person_id);
        setIsResponsibleModalOpen(true);
    }

    const handleResponsiblePersonReasonSubmit = async (reason: string, tid: number, newResponsiblePersonId: number) => {
        if (!tid || !newResponsiblePersonId) return;
        setIsResponsibleLoading(true);
        try {
            const task = tasks.find((t: any) => t.id === tid);
            const oldName = (users as any[]).find(u => u.id === task?.responsible_person_id)?.full_name || 'Unknown';
            const newName = (users as any[]).find(u => u.id === newResponsiblePersonId)?.full_name || `User ${newResponsiblePersonId}`;

            await dispatch(editProjectTask({ token, baseUrl, id: String(tid), data: { responsible_person_id: newResponsiblePersonId } })).unwrap();

            await axios.post(`https://${baseUrl}/comments.json`, {
                comment: {
                    body: `Responsible person changed from ${oldName} to ${newName} with reason: ${reason}`,
                    commentable_id: tid,
                    commentable_type: 'TaskManagement',
                    commentor_id: JSON.parse(localStorage.getItem('user'))?.id,
                    active: true,
                },
            }, { headers: { Authorization: `Bearer ${token}` } });

            toast.success('Responsible person changed with reason');
            setIsResponsibleModalOpen(false);
            setResponsibleTaskId(null);
            setPendingResponsiblePersonId(null);
        } catch (error: any) {
            toast.error(`Failed to update responsible person: ${error?.response?.data?.error || error?.message || 'Server error'}`);
        } finally {
            setIsResponsibleLoading(false);
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
                        <span className="relative text-xs font-semibold text-gray-800">
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
            case "actions":
                return <div className="flex items-center justify-center gap-2">
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
            case "id":
                return <span className="w-[80px]">{isSubtask ? 'S-' : 'T-'}{item.id}</span>
            case "title":
                const isCompleted = item.status === 'Completed';
                const isTaskStarted = item.is_started;
                const hasSubtasks = item.total_sub_tasks > 0;

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
            case "created_by": {
                return item.created_by_name || "-";
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
                return `${formatHours(item?.total_allocated_hours || 0)}`
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
            default:
                return item[columnKey] || "-";
        }
    };

    const leftActions = (
        <Button
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={() => navigate(`/vas/tasks`)}
        >
            <Plus className="w-4 h-4 mr-2" />
            Add
        </Button>
    )

    return (
        <div>
            <EnhancedTable
                columns={columns}
                data={filteredTasks}
                renderCell={renderCell}
                onFilterClick={() => setIsFilterModalOpen(true)}
                leftActions={leftActions}
                pagination={true}
                pageSize={10}
            />

            {/* Filter Modal */}
            {isFilterModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsFilterModalOpen(false)} />
                    <div className="relative bg-white w-full max-w-sm h-full flex flex-col shadow-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold">Filter</h2>
                                {activeFilterCount > 0 && (
                                    <span className="bg-[#C72030] text-white text-xs rounded-full px-2 py-0.5">{activeFilterCount}</span>
                                )}
                            </div>
                            <button onClick={() => setIsFilterModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-xl font-bold">&times;</button>
                        </div>

                        {/* Search Bar */}
                        <div className="px-6 py-4 border-b">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-red-400" size={18} />
                                <input type="text" placeholder="Filter search..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-600" readOnly />
                            </div>
                        </div>

                        {/* Filter Options */}
                        <div className="flex-1 overflow-y-auto divide-y">
                            {/* Status */}
                            <div className="p-6 py-3">
                                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilterDropdown('status')}>
                                    <span className="font-medium text-sm select-none">Status</span>
                                    {filterDropdowns.status ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                                </div>
                                {filterDropdowns.status && (
                                    <div className="mt-4 border">
                                        <div className="relative border-b">
                                            <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                            <input type="text" placeholder="Filter status..." className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none" value={filterSearchTerms.status} onChange={e => setFilterSearchTerms(p => ({ ...p, status: e.target.value }))} />
                                        </div>
                                        {renderFilterCheckboxList(STATUS_OPTIONS_WITH_COLORS, selectedStatuses, setSelectedStatuses, filterSearchTerms.status)}
                                    </div>
                                )}
                            </div>

                            {/* Workflow Status */}
                            <div className="p-6 py-3">
                                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilterDropdown('workflowStatus')}>
                                    <span className="font-medium text-sm select-none">Workflow Status</span>
                                    {filterDropdowns.workflowStatus ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                                </div>
                                {filterDropdowns.workflowStatus && (
                                    <div className="mt-4 border">
                                        <div className="relative border-b">
                                            <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                            <input type="text" placeholder="Filter workflow status..." className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none" value={filterSearchTerms.workflowStatus} onChange={e => setFilterSearchTerms(p => ({ ...p, workflowStatus: e.target.value }))} />
                                        </div>
                                        {renderFilterCheckboxList(
                                            (statuses as any[]).map((s: any) => ({ label: s.status, value: s.id })),
                                            selectedWorkflowStatus,
                                            setSelectedWorkflowStatus,
                                            filterSearchTerms.workflowStatus
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Responsible Person */}
                            <div className="p-6 py-3">
                                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilterDropdown('responsiblePerson')}>
                                    <span className="font-medium text-sm select-none">Responsible Person</span>
                                    {filterDropdowns.responsiblePerson ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                                </div>
                                {filterDropdowns.responsiblePerson && (
                                    <div className="mt-4 border">
                                        <div className="relative border-b">
                                            <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                            <input type="text" placeholder="Filter responsible person..." className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none" value={filterSearchTerms.responsiblePerson} onChange={e => setFilterSearchTerms(p => ({ ...p, responsiblePerson: e.target.value }))} />
                                        </div>
                                        {renderFilterCheckboxList(
                                            (users as any[]).map((u: any) => ({ label: u.full_name, value: u.id })),
                                            selectedResponsible,
                                            setSelectedResponsible,
                                            filterSearchTerms.responsiblePerson
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Created By */}
                            <div className="p-6 py-3">
                                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilterDropdown('createdBy')}>
                                    <span className="font-medium text-sm select-none">Created By</span>
                                    {filterDropdowns.createdBy ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                                </div>
                                {filterDropdowns.createdBy && (
                                    <div className="mt-4 border">
                                        <div className="relative border-b">
                                            <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                            <input type="text" placeholder="Filter created by..." className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none" value={filterSearchTerms.createdBy} onChange={e => setFilterSearchTerms(p => ({ ...p, createdBy: e.target.value }))} />
                                        </div>
                                        {renderFilterCheckboxList(createdByOptions, selectedCreators, setSelectedCreators, filterSearchTerms.createdBy)}
                                    </div>
                                )}
                            </div>

                            {/* Project */}
                            <div className="p-6 py-3">
                                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilterDropdown('project')}>
                                    <span className="font-medium text-sm select-none">Project</span>
                                    {filterDropdowns.project ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                                </div>
                                {filterDropdowns.project && (
                                    <div className="mt-4 border">
                                        <div className="relative border-b">
                                            <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                            <input type="text" placeholder="Filter project..." className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none" value={filterSearchTerms.project} onChange={e => setFilterSearchTerms(p => ({ ...p, project: e.target.value }))} />
                                        </div>
                                        {renderFilterCheckboxList(projectOptions, selectedProjects, setSelectedProjects, filterSearchTerms.project)}
                                    </div>
                                )}
                            </div>

                            {/* Start Date */}
                            <div className="p-6 py-3">
                                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilterDropdown('startDate')}>
                                    <span className="font-medium text-sm select-none">Start Date</span>
                                    {filterDropdowns.startDate ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                                </div>
                                {filterDropdowns.startDate && (
                                    <div className="mt-4">
                                        <input type="date" value={filterDates.startDate} onChange={e => setFilterDates(p => ({ ...p, startDate: e.target.value }))} className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600" />
                                    </div>
                                )}
                            </div>

                            {/* End Date */}
                            <div className="p-6 py-3">
                                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilterDropdown('endDate')}>
                                    <span className="font-medium text-sm select-none">End Date</span>
                                    {filterDropdowns.endDate ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                                </div>
                                {filterDropdowns.endDate && (
                                    <div className="mt-4">
                                        <input type="date" value={filterDates.endDate} onChange={e => setFilterDates(p => ({ ...p, endDate: e.target.value }))} className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center items-center gap-4 px-6 py-3 border-t">
                            <button className="bg-[#C72030] text-white rounded px-10 py-2 text-sm font-semibold hover:bg-[#b71c1c]" onClick={() => setIsFilterModalOpen(false)}>
                                Apply
                            </button>
                            <button className="border border-[#C72030] text-[#C72030] rounded px-10 py-2 text-sm font-semibold hover:bg-red-50" onClick={handleClearFilters}>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <PauseReasonModal
                isOpen={isPauseModalOpen}
                onClose={() => setIsPauseModalOpen(false)}
                onSubmit={handlePauseTaskSubmit}
                onEndTask={handleEndTaskSubmit}
                isLoading={isPauseLoading}
                taskId={pauseTaskId}
            />

            <HoldReasonModal
                isOpen={isHoldModalOpen}
                onClose={() => setIsHoldModalOpen(false)}
                onSubmit={handleHoldReasonSubmit}
                isLoading={isHoldLoading}
                taskId={holdTaskId}
            />

            <OverdueReasonModal
                isOpen={isOverdueModalOpen}
                onClose={() => setIsOverdueModalOpen(false)}
                onSubmit={handleOverdueReasonSubmit}
                isLoading={isOverdueLoading}
            />

            <ResponsiblePersonReasonModal
                isOpen={isResponsibleModalOpen}
                onClose={() => { setIsResponsibleModalOpen(false); setResponsibleTaskId(null); setPendingResponsiblePersonId(null); }}
                onSubmit={handleResponsiblePersonReasonSubmit}
                isLoading={isResponsibleLoading}
                taskId={responsibleTaskId}
                pendingResponsiblePersonId={pendingResponsiblePersonId}
                users={users}
            />

        </div>
    )
}

export default SprintTasks