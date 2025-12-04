import { EnhancedTable } from "./enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Subtask } from "@/pages/ProjectTaskDetails";

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
        key: "subtask_title",
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
        key: "start_date",
        label: "Start Date",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "end_date",
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
    const renderSubtaskCell = (item: Subtask, columnKey: string) => {
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
        if (columnKey === "responsible_person") {
            return item?.responsible_person?.name
        }
        return item[columnKey as keyof Subtask] || "-";
    };

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
            />
        </div>
    )
}

export default SubtasksTable