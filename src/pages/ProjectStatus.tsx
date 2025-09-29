import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import ProjectStatusModal from "@/components/ProjectStatusModal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { useAppDispatch } from "@/store/hooks";
import { fetchProjectStatuses, updateProjectStatuses } from "@/store/slices/projectStatusSlice";
import { format } from "date-fns";
import { Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const columns: ColumnConfig[] = [
    {
        key: 'name',
        label: 'Status Name',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'color',
        label: 'Color',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'created_at',
        label: 'Created On',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'active',
        label: 'Active',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const ProjectStatus = () => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [statuses, setStatuses] = useState([])
    const [loading, setLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [record, setRecord] = useState({})
    const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await dispatch(fetchProjectStatuses({ baseUrl, token })).unwrap();
            setStatuses(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleCheckboxChange = async (item: any) => {
        const newStatus = !item.active;
        const itemId = item.id;

        if (updatingStatus[itemId]) return;

        try {
            setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));

            await dispatch(
                updateProjectStatuses({
                    baseUrl,
                    token,
                    id: itemId,
                    data: {
                        active: newStatus,
                    },
                })
            ).unwrap();

            setStatuses((prevData: any[]) =>
                prevData.map((row) =>
                    row.id === itemId ? { ...row, active: newStatus } : row
                )
            );

            toast.success(`Organization ${newStatus ? "activated" : "deactivated"} successfully`);
        } catch (error) {
            console.error("Error updating active status:", error);
            toast.error(error || "Failed to update active status. Please try again.");
        } finally {
            setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
        }
    };

    const renderActions = (item) => {
        return (
            <div className="flex gap-2 justify-center">
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => {
                        setIsEditing(true);
                        setOpenDialog(true);
                        setRecord(item);
                    }}
                >
                    <Edit className="w-4 h-4" />
                </Button>
            </div>
        );
    };

    const renderCell = (item, columnKey: string) => {
        switch (columnKey) {
            case 'created_at':
                return (
                    <span>{format(item.created_at, 'dd/MM/yyyy')}</span>
                )
            case 'active':
                return (
                    <Switch
                        checked={item.active}
                        onCheckedChange={() =>
                            handleCheckboxChange(item)
                        }
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        disabled={updatingStatus[item.id]}
                    />
                );
            default:
                return item[columnKey] || '-';
        }
    };

    const leftActions = (
        <Button
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={() => setOpenDialog(true)}
        >
            <Plus className="w-4 h-4 mr-2" />
            Add
        </Button>
    );

    return (
        <div className="p-6">
            <EnhancedTable
                data={statuses}
                columns={columns}
                leftActions={leftActions}
                renderActions={renderActions}
                renderCell={renderCell}
                loading={loading}
            />

            <ProjectStatusModal
                openDialog={openDialog}
                handleCloseDialog={() => setOpenDialog(false)}
                isEditing={isEditing}
                record={record}
            />
        </div>
    )
}

export default ProjectStatus