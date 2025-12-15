import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "./enhanced-table/EnhancedTable"
import { Button } from "./ui/button";
import { ChartNoAxesColumn, ChartNoAxesGantt, ChevronDown, Eye, List, LogOut, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createMilestone, fetchMilestones } from "@/store/slices/projectMilestoneSlice";
import { useNavigate, useParams } from "react-router-dom";
import { MenuItem, Select, TextField } from "@mui/material";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { toast } from "sonner";

const columns: ColumnConfig[] = [
    {
        key: "id",
        label: "ID",
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
        key: "tasks",
        label: "Tasks",
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

const MilestoneList = ({ selectedView, setSelectedView, setOpenDialog }) => {
    const { id } = useParams()

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([])
    const [owners, setOwners] = useState([])

    const getMilestones = async () => {
        try {
            const response = await dispatch(fetchMilestones({ token, baseUrl, id })).unwrap();
            setData(response)
        } catch (error) {
            console.log(error)
        }
    }

    const getOwners = async () => {
        try {
            const response = await dispatch(fetchFMUsers()).unwrap();
            setOwners(response.users);
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    }

    useEffect(() => {
        getMilestones();
        getOwners();
    }, [])

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

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "status":
                return (
                    <span>
                        {
                            item.status
                                ? item.status
                                    .split("_")
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ")
                                : ""
                        }
                    </span>
                )
            case "tasks": {
                const completed = item.tasksCompleted || 0;
                const total = item.tasksTotal || 0;
                const progress = total > 0 ? (completed / total) * 100 : 0;

                return (
                    <div className="relative w-[8rem] bg-gray-200 rounded-full h-3">
                        <div
                            className="absolute top-0 left-0 h-3 bg-[#e9e575] rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                        <div className="absolute inset-0 flex !items-center !justify-center text-xs font-medium text-black">
                            {progress.toFixed(2)}%
                        </div>
                    </div>
                );
            }
            case "start_date":
            case "end_date":
                return item[columnKey] ? new Date(item[columnKey]).toLocaleDateString() : "-";
            default:
                return item[columnKey] || "-";
        }
    };

    const leftActions = (
        <>
            <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={() => setOpenDialog(true)}
            >
                <Plus className="w-4 h-4 mr-2" />
                Add
            </Button>
        </>
    );

    const rightActions = (
        <div className="relative">
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
                onClick={() => navigate(`/vas/projects/${id}/milestones/${item.id}`)}
            >
                <Eye className="w-4 h-4" />
            </Button>
            <Button
                size="sm"
                variant="ghost"
                className="p-1"
                onClick={() => navigate(`/vas/projects/${id}/milestones/${item.id}/tasks`)}
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
        <div className="mx-4">
            <EnhancedTable
                data={data}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
                rightActions={rightActions}
                storageKey="projects-table"
                onFilterClick={() => { }}
                canAddRow={true}
                readonlyColumns={["id", "tasks", "status"]}
                onAddRow={(newRowData) => {
                    handleSubmit(newRowData)
                }}
                renderEditableCell={renderEditableCell}
                newRowPlaceholder="Click to add new milestone"
            />
        </div>
    )
}

export default MilestoneList