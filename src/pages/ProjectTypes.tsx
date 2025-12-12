import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Plus, X, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProjectTypes, createProjectTypes, updateProjectTypes, deleteProjectTypes } from "@/store/slices/projectTypeSlice";

const columns: ColumnConfig[] = [
    {
        key: 'typeName',
        label: 'Project Type Name',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'status',
        label: 'Status',
        sortable: false,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'createdOn',
        label: 'CreatedOn',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'createdBy',
        label: 'Created By',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const ProjectTypes = () => {
    const dispatch = useDispatch<AppDispatch>();
    // @ts-ignore - store typing might lag slightly in IDE but slice is updated
    const { projectTypes, loading } = useSelector((state: RootState) => state.projectTypes);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [typeName, setTypeName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchProjectTypes());
    }, [dispatch]);

    const openAddDialog = () => {
        setIsEditMode(false);
        setTypeName('');
        setEditingId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: any) => {
        setIsEditMode(true);
        setTypeName(item.name || item.typeName);
        setEditingId(item.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setTypeName('');
        setEditingId(null);
    };

    const handleSubmit = async () => {
        const trimmedType = typeName.trim();
        if (!trimmedType) {
            alert('Please enter project type name');
            return;
        }

        // Safe extraction of user ID from localStorage
        let userId = '';
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                userId = user.id || '';
            }
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
        }

        const payload = {
            name: trimmedType,
            created_by_id: userId,
            active: true,
        };

        if (isEditMode && editingId) {
            await dispatch(updateProjectTypes({ id: editingId, data: payload })).unwrap();
            dispatch(fetchProjectTypes());
        } else {
            await dispatch(createProjectTypes(payload)).unwrap();
            dispatch(fetchProjectTypes());
        }

        closeDialog();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this project type?')) {
            await dispatch(deleteProjectTypes(id)).unwrap();
        }
    };

    const handleToggleStatus = async (id: number) => {
        const item = projectTypes.find((t: any) => t.id === id);
        if (!item) return;

        const currentActive = item.active !== undefined ? item.active : item.isActive;
        const newActive = !currentActive;

        const payload = {
            name: item.name || item.typeName,
            created_by_id: item.created_by_id,
            active: newActive
        };

        try {
            await dispatch(updateProjectTypes({ id, data: payload })).unwrap();
            dispatch(fetchProjectTypes());
        } catch (error) {
            console.error("Failed to toggle status", error);
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
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1 text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(item.id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        )
    };

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case 'typeName':
                return item.name || item.typeName || '-';
            case 'createdOn':
                return item.created_at ? new Date(item.created_at).toLocaleDateString() : (item.createdOn || '-');
            case 'createdBy':
                return item.created_by?.name || item.createdBy || '-';
            case 'status':
                const isActive = item.active !== undefined ? item.active : item.isActive;
                return (
                    <div className="flex items-center gap-2">
                        <span className="text-sm">{isActive ? 'Active' : 'Inactive'}</span>
                        <div
                            onClick={() => handleToggleStatus(item.id)}
                            className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </div>
                    </div>
                );
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
                data={projectTypes}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
                pagination={true}
                pageSize={10}
                loading={loading}
            />

            {/* Dialog Modal */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-semibold">
                                {isEditMode ? 'Edit Project Type' : 'New Project Type'} <span className="text-red-500">*</span>
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
                            {/* Type Name */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Project Type Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={typeName}
                                    onChange={(e) => setTypeName(e.target.value)}
                                    placeholder="Enter project type name here..."
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
                            <div className="flex gap-3 justify-end pt-4">
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

export default ProjectTypes