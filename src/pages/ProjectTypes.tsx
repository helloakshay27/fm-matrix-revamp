import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import ProjectTypeModal from "@/components/ProjectTypeModal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { useAppDispatch } from "@/store/hooks";
import { fetchProjectTypes, updateProjectTypes } from "@/store/slices/projectTypeSlice";
import { format } from "date-fns";
import { Edit2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const columns: ColumnConfig[] = [
    {
        key: 'name',
        label: 'Project Type',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'created_by',
        label: 'Created By',
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

const ProjectTypes = () => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [types, setTypes] = useState([])
    const [loading, setLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [record, setRecord] = useState({})
    const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await dispatch(fetchProjectTypes({ baseUrl, token })).unwrap();
            setTypes(response);
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
                updateProjectTypes({
                    baseUrl,
                    token,
                    id: itemId,
                    data: {
                        active: newStatus,
                    },
                })
            ).unwrap();

            setTypes((prevData: any[]) =>
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
                    <Edit2 className="w-4 h-4" />
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
                data={types}
                columns={columns}
                leftActions={leftActions}
                renderCell={renderCell}
                renderActions={renderActions}
            />
            <ProjectTypeModal
                openDialog={openDialog}
                handleCloseDialog={() => setOpenDialog(false)}
            />
        </div>
    )
}

export default ProjectTypes