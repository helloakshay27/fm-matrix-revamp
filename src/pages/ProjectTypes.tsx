import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Plus, X, Trash2 } from "lucide-react";
import { useState } from "react";

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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [typeName, setTypeName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [projectTypes, setProjectTypes] = useState([
        {
            id: 1,
            typeName: 'Real EState',
            isActive: true,
            createdOn: '04/07/2025',
            createdBy: 'Tejas Chaudhary',
        },
        {
            id: 2,
            typeName: 'residential',
            isActive: true,
            createdOn: '01/07/2025',
            createdBy: 'Tejas Chaudhary',
        },
        {
            id: 3,
            typeName: 'commercial',
            isActive: true,
            createdOn: '01/07/2025',
            createdBy: 'Tejas Chaudhary',
        },
    ]);

    const openAddDialog = () => {
        setIsEditMode(false);
        setTypeName('');
        setEditingId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: any) => {
        setIsEditMode(true);
        setTypeName(item.typeName);
        setEditingId(item.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setTypeName('');
        setEditingId(null);
    };

    const handleSubmit = () => {
        if (!typeName.trim()) {
            alert('Please enter project type name');
            return;
        }

        if (isEditMode && editingId) {
            setProjectTypes(projectTypes.map(type =>
                type.id === editingId
                    ? { ...type, typeName }
                    : type
            ));
        } else {
            const newType = {
                id: Math.max(...projectTypes.map(t => t.id), 0) + 1,
                typeName,
                isActive: true,
                createdOn: new Date().toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                }),
                createdBy: 'Current User',
            };
            setProjectTypes([...projectTypes, newType]);
        }

        closeDialog();
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this project type?')) {
            setProjectTypes(projectTypes.filter(type => type.id !== id));
        }
    };

    const handleToggleStatus = (id: number) => {
        setProjectTypes(projectTypes.map(type =>
            type.id === id
                ? { ...type, isActive: !type.isActive }
                : type
        ));
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
            case 'status':
                return (
                    <div className="flex items-center gap-2">
                        <span className="text-sm">{item.isActive ? 'Inactive' : 'Inactive'}</span>
                        <button
                            onClick={() => handleToggleStatus(item.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.isActive ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.isActive ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                        <span className="text-sm">{item.isActive ? 'Active' : 'Inactive'}</span>
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