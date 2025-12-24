import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Plus, X, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProjectStatuses, createProjectStatus, updateProjectStatus, deleteProjectStatus } from "@/store/slices/projectStatusSlice";

const columns: ColumnConfig[] = [
    {
        key: 'statusName',
        label: 'Status Name',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'color',
        label: 'Color',
        sortable: false,
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
        label: 'Created On',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const ProjectStatus = () => {
    const dispatch = useDispatch<AppDispatch>();
    // @ts-ignore - store typing might lag slightly in IDE but slice is updated
    const { projectStatuses, loading } = useSelector((state: RootState) => state.projectStatus);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [statusName, setStatusName] = useState('');
    const [selectedColor, setSelectedColor] = useState('#FF0000');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchProjectStatuses());
    }, [dispatch]);

    const openAddDialog = () => {
        setIsEditMode(false);
        setStatusName('');
        setSelectedColor('#FF0000');
        setEditingId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: any) => {
        setIsEditMode(true);
        setStatusName(item.status);
        setSelectedColor(item.color_code);
        setEditingId(item.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setStatusName('');
        setSelectedColor('#FF0000');
        setEditingId(null);
    };

    const handleSubmit = async () => {
        const trimmedName = statusName.trim();
        if (!trimmedName) {
            alert('Please enter a status name');
            return;
        }

        const payload = {
            status: trimmedName,
            color_code: selectedColor,
            active: true,
        };

        if (isEditMode && editingId) {
            await dispatch(updateProjectStatus({ id: editingId, data: payload })).unwrap();
            dispatch(fetchProjectStatuses());
        } else {
            await dispatch(createProjectStatus(payload)).unwrap();
            dispatch(fetchProjectStatuses());
        }

        closeDialog();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this status?')) {
            await dispatch(deleteProjectStatus(id)).unwrap();
        }
    };

    const handleToggleStatus = async (id: number) => {
        const item = projectStatuses.find((s: any) => s.id === id);
        if (!item) return;

        const currentActive = item.active !== undefined ? item.active : item.isActive;
        const newActive = !currentActive;

        const payload = {
            status: item.status,
            color_code: item.color_code,
            active: newActive,
        };

        try {
            await dispatch(updateProjectStatus({ id, data: payload })).unwrap();
            dispatch(fetchProjectStatuses());
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
            case 'statusName':
                return item.status || '-';
            case 'color':
                return (
                    <div
                        className="w-32 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: item.color_code }}
                    ></div>
                );
            case 'createdOn':
                return item.created_at ? new Date(item.created_at).toLocaleDateString() : (item.createdOn || '-');
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
                data={projectStatuses}
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
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">
                                {isEditMode ? 'Edit Status' : 'New Status'}
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
                            {/* Status Name */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Status Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={statusName}
                                    onChange={(e) => setStatusName(e.target.value)}
                                    placeholder="Enter Status Name"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400"
                                    autoFocus
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSubmit();
                                        }
                                    }}
                                />
                            </div>

                            {/* Color Picker */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Pick Color
                                </label>
                                <div className="flex gap-3 items-center">
                                    <input
                                        type="color"
                                        value={selectedColor}
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                        className="w-16 h-12 rounded cursor-pointer border-2 border-gray-300"
                                    />
                                    <div
                                        className="flex-1 h-12 rounded border-2 border-gray-300"
                                        style={{ backgroundColor: selectedColor }}
                                    ></div>
                                </div>
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

export default ProjectStatus