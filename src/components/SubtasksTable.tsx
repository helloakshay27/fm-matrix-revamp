import { EnhancedTable } from "./enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Subtask } from "@/pages/ProjectTaskDetails";
import { useAppDispatch } from "@/store/hooks";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { FormControl, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { updateTaskStatus, editProjectTask } from "@/store/slices/projectTasksSlice";
import { toast } from "sonner";

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

const subtaskColumns: ColumnConfig[] = [
    {
        key: "id",
        label: "ID",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "title",
        label: "Subtask Title",
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
        key: "responsible_person",
        label: "Responsible Person",
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
        key: "tags",
        label: "Tags",
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

const statusOptions = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" },
]

const SubtasksTable = ({ subtasks, fetchData }: { subtasks: Subtask[], fetchData: () => Promise<void> }) => {
    const { id: projectId, mid } = useParams()
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token") || "";
    const baseUrl = localStorage.getItem("baseUrl") || "";
    const navigate = useNavigate();
    const [users, setUsers] = useState([])

    const getUsers = async () => {
        try {
            const response = await dispatch(fetchFMUsers()).unwrap();
            setUsers(response.users);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsers()
    }, [])

    const handleStatusChange = async (id: number, status: string) => {
        try {
            await dispatch(updateTaskStatus({ token, baseUrl, id: String(id), data: { status } })).unwrap();
            fetchData();
            toast.success("Task status changed successfully");
        } catch (error) {
            console.log(error)
        }
    }

    const handleCompletionPercentageChange = async (id: number, completionPercentage: number | string) => {
        const percentage = Number(completionPercentage);

        // Validate percentage
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
            toast.error("Completion percentage must be between 0 and 100");
            return;
        }

        try {
            await dispatch(editProjectTask({
                token,
                baseUrl,
                id: String(id),
                data: { completion_percent: percentage }
            })).unwrap();
            fetchData();
            toast.success("Completion percentage updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update completion percentage");
        }
    }

    const renderSubtaskCell = (item: any, columnKey: string) => {
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

        if (columnKey === "status") {
            return <FormControl
                variant="standard"
                sx={{ width: 128 }} // same as w-32
            >
                <Select
                    value={item.status}
                    onChange={(e) =>
                        handleStatusChange(item.id, e.target.value as string)
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
                    {statusOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        }
        if (columnKey === "duration") {
            return <CountdownTimer startDate={item.expected_start_date} targetDate={item.target_date} />;
        }
        if (columnKey === "responsible_person") {
            return item?.responsible_person?.name
        }
        if (columnKey === "issues") {
            const completed = item.completed_issues || 0;
            const total = item.total_issues || 0;
            return renderProgressBar(completed, total, "bg-[#ff9a9e]");
        }
        if (columnKey === "completion_percentage") {
            return (
                <input
                    type="number"
                    defaultValue={item.completion_percent || 0}
                    className="border border-gray-200 focus:outline-none p-2 w-[4rem]"
                    min="0"
                    max="100"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const target = e.target as HTMLInputElement;
                            const value = target.value;
                            handleCompletionPercentageChange(item.id, value);
                        }
                    }}
                    onBlur={(e) => {
                        const value = e.target.value;
                        if (value && value !== String(item.completion_percent)) {
                            handleCompletionPercentageChange(item.id, value);
                        }
                    }}
                />
            )
        }
        return item[columnKey as keyof Subtask] || "-";
    };

    const handleView = (id) => {
        if (location.pathname.startsWith("/vas/tasks")) {
            navigate(`/vas/tasks/${id}`);
        } else {
            navigate(`/vas/projects/${projectId}/milestones/${mid}/tasks/${id}`)
        }
    }

    const renderActions = (item: any) => (
        <Button
            size="sm"
            variant="ghost"
            className="p-1"
            onClick={() => handleView(item.id)}
            title="View Task Details"
        >
            <Eye className="w-4 h-4" />
        </Button>
    )

    const renderEditableCell = (columnKey: string, value: any, onChange: (val: any) => void) => {
        if (columnKey === "responsible_person") {
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

    return (
        <div>
            <EnhancedTable
                data={subtasks || []}
                columns={subtaskColumns}
                storageKey="task-subtasks-table"
                hideColumnsButton={true}
                hideTableExport={true}
                hideTableSearch={true}
                exportFileName="task-subtasks"
                pagination={true}
                pageSize={10}
                emptyMessage="No Subtask"
                className="min-w-[1200px] h-max"
                renderCell={renderSubtaskCell}
                renderActions={renderActions}
                // canAddRow={true}
                readonlyColumns={["id", "status", "duration"]}
                renderEditableCell={renderEditableCell}
            />
        </div>
    )
}

export default SubtasksTable