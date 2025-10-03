import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Edit, Eye, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [projects, setProjects] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        status: "",
        type: "",
        manager: "",
        start_date: "",
        end_date: "",
        priority: "",
    });

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            title: "",
            status: "",
            type: "",
            manager: "",
            start_date: "",
            end_date: "",
            priority: "",
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // Handle form submission (e.g., dispatch an action to add the project)
        console.log("Form submitted:", formData);
        handleCloseDialog();
    };

    const renderActions = (item: any) => (
        <div className="flex items-center justify-center gap-2">
            <Button size="sm" variant="ghost" className="p-1" onClick={() => navigate(`${item.id}`)}>
                <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="p-1">
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
            default:
                return item[columnKey] || "-";
        }
    };

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
                data={[
                    {
                        id: 1,
                        title: "Project A",
                        status: "Active",
                        type: "Type A",
                        manager: "John Doe",
                        milestonesCompleted: 9,
                        milestonesTotal: 19,
                        tasksCompleted: 9,
                        tasksTotal: 19,
                        issues: 5,
                        start_date: "2022-01-01",
                        end_date: "2022-12-31",
                        priority: "High",
                    },
                ]}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
                storageKey="projects-table"
                onFilterClick={() => { }}
            />
        </div>
    );
}

export default ProjectTasksPage