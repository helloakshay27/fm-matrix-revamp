import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "./enhanced-table/EnhancedTable"
import { Button } from "./ui/button";
import { ArrowLeft, ChartNoAxesColumn, ChartNoAxesGantt, ChevronDown, Eye, List, LogOut, Plus } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createMilestone, fetchMilestones, updateMilestoneStatus } from "@/store/slices/projectMilestoneSlice";
import { useNavigate, useParams } from "react-router-dom";
import { FormControl, MenuItem, Select, TextField } from "@mui/material";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { toast } from "sonner";
import { SelectionPanel } from "./water-asset-details/PannelTab";
import axios from "axios";
import { baseClient } from "@/utils/withoutTokenBase";
import { useSearchParams } from "react-router-dom";
import { CommonImportModal } from "./CommonImportModal";

const columns: ColumnConfig[] = [
    {
        key: "id",
        label: "ID",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "milestone_code",
        label: "Milestone Code",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "title",
        label: "Milestone Title",
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
        key: "owner",
        label: "Owner",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "completion_percent",
        label: "Completion Percentage",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "tasks",
        label: "Tasks",
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
];

const statusOptions = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" },
]

// Map frontend column keys to backend field names
const COLUMN_TO_BACKEND_MAP: Record<string, string> = {
    id: "id",
    milestone_code: "milestone_code",
    title: "title",
    status: "status",
    owner: "owner_name",
    completion_percent: "completion_percent",
    tasks: "total_tasks",
    issues: "total_issues",
    start_date: "start_date",
    end_date: "end_date",
};

const MilestoneList = ({ selectedView, setSelectedView, setOpenDialog }) => {
    const { id } = useParams()
    const [searchParams] = useSearchParams();

    // ========== MOBILE TOKEN HANDLING ==========
    // Extract token, org_id, and user_id from URL (mobile flow)
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

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([])
    const [owners, setOwners] = useState([])
    const [showActionPanel, setShowActionPanel] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false)

    const statusColorMap = {
        open: { dot: "bg-blue-500" },
        in_progress: { dot: "bg-amber-500" },
        on_hold: { dot: "bg-gray-500" },
        completed: { dot: "bg-teal-500" },
        overdue: { dot: "bg-red-500" },
    };

    const getMilestones = async (
        orderBy: string | null = sortColumn,
        orderDirection: "asc" | "desc" | null = sortDirection
    ) => {
        setLoading(true)
        try {
            const response = await dispatch(fetchMilestones({
                token,
                baseUrl,
                id,
                orderBy: orderBy ? (COLUMN_TO_BACKEND_MAP[orderBy] || orderBy) : undefined,
                orderDirection: orderDirection || undefined
            })).unwrap();
            setData(response)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getOwners = async () => {
        try {
            // Use baseClient for mobile flow (when baseUrl not available)
            // Use direct axios call for web flow
            const response = baseUrl
                ? await axios.get(
                    `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                : await baseClient.get(
                    `/pms/users/get_escalate_to_users.json?type=Task`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            setOwners(response.data.users);
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    }

    const handleStatusChange = async (milestoneId: number, status: string) => {
        try {
            await dispatch(updateMilestoneStatus({
                token,
                baseUrl,
                id: String(milestoneId),
                payload: { milestone: { status } }
            })).unwrap();
            getMilestones(sortColumn, sortDirection);
            toast.success("Milestone status updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update milestone status");
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
        getMilestones(newDirection ? columnKey : null, newDirection);
    };

    useEffect(() => {
        getMilestones(sortColumn, sortDirection);
        getOwners();
    }, [sortColumn, sortDirection])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen])

    const handleSubmit = async (data) => {
        try {
            const payload = {
                milestone: {
                    title: data.title,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    status: "open",
                    owner_id: data.owner,
                    project_management_id: id,
                },
            }
            await dispatch(createMilestone({ token, baseUrl, data: payload })).unwrap();
            toast.success("Milestone created successfully");
            getMilestones();
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    };

    const handleSampleDownload = async () => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/assets/milestone_import.xlsx`,
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
            link.setAttribute('download', 'sample_milestone.xlsx');
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

    const handleImport = async () => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            const response = await axios.post(`https://${baseUrl}/milestones/import.json`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response.data.failed && response.data.failed.length > 0) {
                response.data.failed.forEach((item: { row: number; errors: string[] }) => {
                    const errorMessages = item.errors.join(', ');
                    toast.error(`Row ${item.row}: ${errorMessages}`);
                });
            } else {
                toast.success("Milestones imported successfully");
                setIsImportModalOpen(false);
                setSelectedFile(null);
                getMilestones();
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to import milestones");
        } finally {
            setIsUploading(false);
        }
    };

    const renderCell = (item: any, columnKey: string) => {
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
                // onClick={() =>
                //     type === "issues"
                //         ? navigate(`/vas/issues?project_id=${item.id}`)
                //         : type === "tasks"
                //             ? navigate(`/vas/tasks?project_id=${item.id}`)
                //             : type === "subtasks"
                //                 ? navigate(`/vas/tasks?subtasks=true&project_id=${item.id}`)
                //                 : type === "milestones"
                //                     ? navigate(`/vas/projects/${item.id}/milestones`)
                //                     : null
                // }
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
                return `M-${item.id}`;
            case "status": {
                const colors = statusColorMap[item.status as keyof typeof statusColorMap] || statusColorMap.open;

                return (
                    <FormControl
                        variant="standard"
                        sx={{ width: 148 }}
                    >
                        <Select
                            value={item.status}
                            onChange={(e) =>
                                handleStatusChange(item.id, e.target.value as string)
                            }
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
                );
            }
            case "tasks": {
                const completed = item.completed_tasks || 0;
                const total = item.total_tasks || 0;
                return renderProgressBar(completed, total, "bg-[#b4e7ff]");
            }
            case "issues": {
                const completed = item.completed_issues || 0;
                const total = item.total_issues || 0;
                return renderProgressBar(completed, total, "bg-[#b4e7ff]");
            }
            case "owner":
                return item.owner_name ? item.owner_name : "-";
            case "start_date":
            case "end_date":
                return item[columnKey] ? new Date(item[columnKey]).toLocaleDateString() : "-";
            case "completion_percent":
                return <div className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
                        {item.completed_tasks}
                    </span>
                    <div className="relative w-[8rem] bg-gray-200 rounded-full h-4 overflow-hidden flex items-center !justify-center">
                        <div
                            className={`absolute top-0 left-0 h-6 bg-[#b4e7ff] rounded-full transition-all duration-300`}
                            style={{ width: `${item.completion_percent}%` }}
                        ></div>
                        <span className="relative z-10 text-xs font-semibold text-gray-800">
                            {Math.round(item.completion_percent)}%
                        </span>
                    </div>
                    <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
                        {item.total_tasks}
                    </span>
                </div>
            default:
                return item[columnKey] || "-";
        }
    };

    const leftActions = (
        <>
            <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={() => setShowActionPanel(true)}
            >
                <Plus className="w-4 h-4 mr-2" />
                Action
            </Button>
        </>
    );

    const rightActions = (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
                <span className="text-[#C72030] font-medium flex items-center gap-2">
                    <ChartNoAxesColumn className="w-4 h-4 rotate-180 text-[#C72030]" />
                    {selectedView}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                    <div className="py-2">
                        <button
                            onClick={() => {
                                setSelectedView("Gantt");
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                        >
                            <div className="w-4 flex justify-center">
                                <ChartNoAxesGantt className="rotate-180 text-[#C72030]" />
                            </div>
                            <span className="text-gray-700">Gantt</span>
                        </button>
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
    );

    const renderActions = (item: any) => (
        <div className="flex items-center justify-center gap-2">
            <Button
                size="sm"
                variant="ghost"
                className="p-1"
                onClick={() => window.location.pathname.startsWith("/vas/projects") ? navigate(`/vas/projects/${id}/milestones/${item.id}`) : navigate(`/mobile-projects/${id}/milestones/${item.id}`)}
            >
                <Eye className="w-4 h-4" />
            </Button>
            <Button
                size="sm"
                variant="ghost"
                className="p-1"
                onClick={() => window.location.pathname.startsWith("/vas/projects") ? navigate(`/vas/projects/${id}/milestones/${item.id}/tasks`) : navigate(`/mobile-projects/${id}/milestones/${item.id}/tasks`)}
            >
                <LogOut className="w-4 h-4" />
            </Button>
        </div>
    );

    const renderEditableCell = (columnKey, value, onChange) => {
        if (columnKey === "owner") {
            return (
                <Select
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{ minWidth: 120 }}
                >
                    <MenuItem value="">
                        <em>Select owner</em>
                    </MenuItem>
                    {
                        owners.map((owner) => (
                            <MenuItem key={owner.id} value={owner.id}>
                                {owner.full_name}
                            </MenuItem>
                        ))
                    }
                </Select>
            );
        }
        if (columnKey === "start_date") {
            return (
                <TextField
                    type="date"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                />
            );
        }
        if (columnKey === "end_date") {
            return (
                <TextField
                    type="date"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                />
            );
        }
        return null;
    }

    return (
        <div className="px-6">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="px-0 mb-2"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>
            <EnhancedTable
                data={data}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
                rightActions={rightActions}
                storageKey="milestone-table"
                onSort={handleColumnSort}
                loading={loading}
                // onFilterClick={() => { }}
                canAddRow={true}
                readonlyColumns={["id", "tasks"]}
                onAddRow={(newRowData) => {
                    handleSubmit(newRowData)
                }}
                renderEditableCell={renderEditableCell}
                newRowPlaceholder="Click to add new milestone"
            />

            {showActionPanel && (
                <SelectionPanel
                    onAdd={() => setOpenDialog(true)}
                    onImport={() => setIsImportModalOpen(true)}
                    onClearSelection={() => setShowActionPanel(false)}
                />
            )}

            <CommonImportModal
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                open={isImportModalOpen}
                onOpenChange={setIsImportModalOpen}
                title="Import Milestones"
                entityType="milestones"
                onSampleDownload={handleSampleDownload}
                onImport={handleImport}
                isUploading={isUploading}
            />
        </div>
    )
}

export default MilestoneList
