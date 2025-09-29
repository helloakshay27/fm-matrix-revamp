import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import ProjectGroupModal from "@/components/ProjectGroupModal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { useAppDispatch } from "@/store/hooks";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { fetchProjectGroups, updateProjectGroups } from "@/store/slices/projectGroupSlice";
import { format } from "date-fns";
import { Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const columns: ColumnConfig[] = [
    {
        key: 'name',
        label: 'Group Name',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'members',
        label: 'Group Members',
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

const ProjectGroup = () => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [record, setRecord] = useState({})
    const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});
    const [users, setUsers] = useState([])

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await dispatch(fetchProjectGroups({ baseUrl, token })).unwrap();
            setGroups(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    const fetchUsers = async () => {
        try {
            const response = await dispatch(fetchFMUsers()).unwrap();
            setUsers(response.users);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData();
        fetchUsers();
    }, []);

    const handleCheckboxChange = async (item: any) => {
        const newStatus = !item.active;
        const itemId = item.id;

        if (updatingStatus[itemId]) return;

        try {
            setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));

            await dispatch(
                updateProjectGroups({
                    baseUrl,
                    token,
                    id: itemId,
                    data: {
                        active: newStatus,
                    },
                })
            ).unwrap();

            setGroups((prevData: any[]) =>
                prevData.map((row) =>
                    row.id === itemId ? { ...row, active: newStatus } : row
                )
            );

            toast.success(`Group ${newStatus ? "activated" : "deactivated"} successfully`);
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
                data={groups}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
                loading={loading}
            />

            <ProjectGroupModal
                fetchData={fetchData}
                openDialog={openDialog}
                handleCloseDialog={() => setOpenDialog(false)}
                isEditing={isEditing}
                record={record}
                users={users}
            />
        </div>
    )
}

export default ProjectGroup