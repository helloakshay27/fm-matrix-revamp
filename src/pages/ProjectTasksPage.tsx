import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useAppDispatch } from "@/store/hooks";
import { createProjectTask, fetchProjectTasks } from "@/store/slices/projectTasksSlice";
import { Edit, Eye, Plus, X } from "lucide-react";
import { useEffect, useState, forwardRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MenuItem, Select, TextField, Dialog, DialogContent, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { toast } from "sonner";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import ProjectTaskCreateModal from "@/components/ProjectTaskCreateModal";

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

const ProjectTasksPage = () => {
    const { id, mid } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [tasks, setTasks] = useState([])
    const [users, setUsers] = useState([])
    const [openTaskModal, setOpenTaskModal] = useState(false);

    const fetchData = async () => {
        try {
            const response = await dispatch(fetchProjectTasks({ token, baseUrl, id: mid })).unwrap();
            setTasks(response.task_managements)
        } catch (error) {
            console.log(error);
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
        fetchData();
        getUsers();
    }, [])

    const handleOpenDialog = () => {
        setOpenTaskModal(true);
    };

    const handleCloseModal = () => {
        setOpenTaskModal(false);
        fetchData();
    };

    const handleSubmit = async (data) => {
        console.log(data)
        const payload = {
            task_management: {
                title: data.title,
                expected_start_date: data.start_date,
                target_date: data.end_date,
                status: data.status,
                priority: data.priority,
                active: true,
                responsible_person_id: data.responsible,
                ...(id && { project_management_id: id }),
                ...(mid && { milestone_id: mid })
            }
        }
        try {
            await dispatch(createProjectTask({ token, baseUrl, data: payload })).unwrap();
            toast.success("Project created successfully");
            fetchData();
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    };

    const renderActions = (item: any) => (
        <div className="flex items-center justify-center gap-2">
            <Button
                size="sm"
                variant="ghost"
                className="p-1"
                onClick={() => navigate(`/maintenance/projects/${id}/milestones/${mid}/tasks/${item.id}`)}
                title="View Task Details"
            >
                <Eye className="w-4 h-4" />
            </Button>
            <Button
                size="sm"
                variant="ghost"
                className="p-1"
                title="Edit Task"
            >
                <Edit className="w-4 h-4" />
            </Button>
        </div>
    );

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "milestones": {
                const completed = item.milestonesCompleted || 0;
                const total = item.milestonesTotal || 0;
                const progress = total > 0 ? (completed / total) * 100 : 0;

                return (
                    <div className="relative w-[8rem] bg-gray-200 rounded-full h-3">
                        <div
                            className="absolute top-0 left-0 h-3 bg-[#84edba] rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-black">
                            {progress.toFixed(2)}%
                        </div>
                    </div>
                );
            }
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
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-black">
                            {progress.toFixed(2)}%
                        </div>
                    </div>
                );
            }
            case "status": {
                return item.status.charAt(0).toUpperCase() + item.status.slice(1)
            }
            case "responsible": {
                return item.responsible_person?.name || "-";
            }
            case "predecessor": {
                return item.predecessor_task.length
            }
            case "successor": {
                return item.successor_task.length
            }
            default:
                return item[columnKey] || "-";
        }
    };

    const renderEditableCell = (columnKey, value, onChange) => {
        if (columnKey === "status") {
            return (
                <Select
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{ minWidth: 120 }}
                >
                    <MenuItem value="">
                        <em>Select status</em>
                    </MenuItem>
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
                    sx={{ minWidth: 120 }}
                >
                    <MenuItem value="">
                        <em>Select Responsible Person</em>
                    </MenuItem>
                    {
                        users.map((user: any) => (
                            <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>
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
        if (columnKey === "priority") {
            return (
                <Select
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{ minWidth: 120 }}
                >
                    <MenuItem value="">
                        <em>Select priority</em>
                    </MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                </Select>
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

    return (
        <div className="p-6">
            <EnhancedTable
                data={tasks}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
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

            {/* Task Create Modal with Animation */}
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
                        <h3 className="text-[14px] font-medium text-center mt-8">Create Project Task</h3>
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

export default ProjectTasksPage