import { EnhancedTable } from "./enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Subtask } from "@/pages/ProjectTaskDetails";
import { useAppDispatch } from "@/store/hooks";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";

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

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case "open":
            return "bg-red-100 text-red-800";
        case "in_progress":
            return "bg-blue-100 text-blue-800";
        case "completed":
            return "bg-green-100 text-green-800";
        case "on_hold":
            return "bg-yellow-100 text-yellow-800";
        case "overdue":
            return "bg-orange-100 text-orange-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
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
];

const SubtasksTable = ({ subtasks, fetchData }: { subtasks: Subtask[], fetchData: () => Promise<void> }) => {
    const dispatch = useAppDispatch();
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

    const renderSubtaskCell = (item: any, columnKey: string) => {
        if (columnKey === "status") {
            return (
                <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        item.status || ""
                    )}`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.status?.toLowerCase() === "open"
                            ? "bg-red-500"
                            : item.status?.toLowerCase() === "in_progress"
                                ? "bg-blue-500"
                                : item.status?.toLowerCase() === "completed"
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                            }`}
                    ></span>
                    {item.status}
                </span>
            );
        }
        if (columnKey === "duration") {
            return <CountdownTimer startDate={item.expected_start_date} targetDate={item.target_date} />;
        }
        if (columnKey === "responsible_person") {
            return item?.responsible_person?.name
        }
        return item[columnKey as keyof Subtask] || "-";
    };

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
                canAddRow={true}
                readonlyColumns={["id", "status", "duration"]}
                renderEditableCell={renderEditableCell}
            />
        </div>
    )
}

export default SubtasksTable