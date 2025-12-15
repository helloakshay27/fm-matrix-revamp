import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProjectRoles, createProjectRole, updateProjectRole, deleteProjectRole } from "@/store/slices/projectRoleSlice";

const columns: ColumnConfig[] = [
    {
        key: 'title',
        label: 'Roles',
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

const ProjectRoles = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { roles, loading } = useSelector((state: RootState) => state.projectRole);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchProjectRoles());
    }, [dispatch]);

    const openAddDialog = () => {
        setIsEditMode(false);
        setRoleName('');
        setEditingId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: any) => {
        setIsEditMode(true);
        setRoleName(item.name); // Using 'name' from API response
        setEditingId(item.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setRoleName('');
        setEditingId(null);
    };

    const handleSubmit = async () => {
        if (!roleName.trim()) {
            return; // Add toast here properly in next steps
        }

        const payload = {
            name: roleName,
            display_name: roleName,
            active: 1
        };

        if (isEditMode && editingId) {
            await dispatch(updateProjectRole({ id: editingId, data: payload })).unwrap();
            dispatch(fetchProjectRoles()); // Refresh list
        } else {
            await dispatch(createProjectRole(payload)).unwrap();
            dispatch(fetchProjectRoles()); // Refresh list
        }

        closeDialog();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            await dispatch(deleteProjectRole(id)).unwrap();
            dispatch(fetchProjectRoles()); // Refresh list
        }
    };

    const renderActions = (item: any) => {
        return (
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => openEditDialog(item)}
                >
                    <Edit className="w-4 h-4" />
                </Button>
                {/* <Button
                    size="sm"
                    variant="ghost"
                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(item.id)}
                >
                    <X className="w-4 h-4" />
                </Button> */}
            </div>
        )
    };

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case 'title':
                return item.name;
            case 'active':
                return item.active ? 'Yes' : 'No';
            case 'created_at':
                return item.created_at ? new Date(item.created_at).toLocaleDateString() : '-';
            default:
                return item[columnKey] || "-";
        }
    }

    const leftActions = (
        <>
            <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={openAddDialog}
            >
                <Plus className="w-4 h-4 mr-2" />
                Add
            </Button>
        </>
    )

    return (
        <div className="p-6">
            <EnhancedTable
                data={roles}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
                pagination={true}
                pageSize={10}
                loading={loading}
            />

            {/* Dialog Box */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">
                                {isEditMode ? 'Edit Role' : 'New Role'} <span className="text-red-500">*</span>
                            </h2>
                            <button
                                onClick={closeDialog}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                    placeholder="Enter role name here..."
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400"
                                    autoFocus
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSubmit();
                                        }
                                    }}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={closeDialog}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-[#C72030] hover:bg-[#A01020] text-white"
                                    onClick={handleSubmit}
                                >
                                    {isEditMode ? 'Update' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProjectRoles