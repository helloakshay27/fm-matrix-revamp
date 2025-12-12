import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Plus, X, Trash2 } from "lucide-react";
import { useState } from "react";

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
        sortable: true,
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [statusName, setStatusName] = useState('');
    const [selectedColor, setSelectedColor] = useState('#FF0000');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [statuses, setStatuses] = useState([
        {
            id: 1,
            statusName: 'Overdue',
            color: '#B8860B',
            status: 'Active',
            createdOn: '04/11/2025',
        },
        {
            id: 2,
            statusName: 'Completed',
            color: '#4CAF50',
            status: 'Active',
            createdOn: '01/07/2025',
        },
        {
            id: 3,
            statusName: 'On Hold',
            color: '#FFC107',
            status: 'Active',
            createdOn: '01/07/2025',
        },
        {
            id: 4,
            statusName: 'In Progress',
            color: '#2196F3',
            status: 'Active',
            createdOn: '01/07/2025',
        },
        {
            id: 5,
            statusName: 'Open',
            color: '#F44336',
            status: 'Active',
            createdOn: '01/07/2025',
        },
    ]);

    const openAddDialog = () => {
        setIsEditMode(false);
        setStatusName('');
        setSelectedColor('#FF0000');
        setEditingId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: any) => {
        setIsEditMode(true);
        setStatusName(item.statusName);
        setSelectedColor(item.color);
        setEditingId(item.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setStatusName('');
        setSelectedColor('#FF0000');
        setEditingId(null);
    };

    const handleSubmit = () => {
        if (!statusName.trim()) {
            alert('Please enter a status name');
            return;
        }

        if (isEditMode && editingId) {
            // Update existing status
            setStatuses(statuses.map(st =>
                st.id === editingId
                    ? { ...st, statusName, color: selectedColor }
                    : st
            ));
        } else {
            // Add new status
            const newStatus = {
                id: Math.max(...statuses.map(s => s.id), 0) + 1,
                statusName,
                color: selectedColor,
                status: 'Active',
                createdOn: new Date().toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                }),
            };
            setStatuses([...statuses, newStatus]);
        }

        closeDialog();
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this status?')) {
            setStatuses(statuses.filter(status => status.id !== id));
        }
    };

    const handleToggleStatus = (id: number) => {
        setStatuses(statuses.map(st =>
            st.id === id
                ? { ...st, status: st.status === 'Active' ? 'Inactive' : 'Active' }
                : st
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
            case 'color':
                return (
                    <div
                        className="w-32 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: item.color }}
                    ></div>
                );
            case 'status':
                return (
                    <div className="flex items-center gap-2">
                        <span className="text-sm">{item.status === 'Inactive' ? 'Inactive' : 'Inactive'}</span>
                        <button
                            onClick={() => handleToggleStatus(item.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.status === 'Active' ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                        <span className="text-sm">{item.status}</span>
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
                data={statuses}
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