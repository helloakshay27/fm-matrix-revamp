import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Plus, X } from "lucide-react";
import { useState } from "react";

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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [roles, setRoles] = useState([
        {
            id: 1,
            title: 'Project Manager',
            created_at: '2023-10-01',
            active: 'Yes',
        }
    ]);

    const openAddDialog = () => {
        setIsEditMode(false);
        setRoleName('');
        setEditingId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: any) => {
        setIsEditMode(true);
        setRoleName(item.title);
        setEditingId(item.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setRoleName('');
        setEditingId(null);
    };

    const handleSubmit = () => {
        if (!roleName.trim()) {
            alert('Please enter a role name');
            return;
        }

        if (isEditMode && editingId) {
            // Update existing role
            setRoles(roles.map(role =>
                role.id === editingId
                    ? { ...role, title: roleName }
                    : role
            ));
        } else {
            // Add new role
            const newRole = {
                id: Math.max(...roles.map(r => r.id), 0) + 1,
                title: roleName,
                created_at: new Date().toISOString().split('T')[0],
                active: 'Yes',
            };
            setRoles([...roles, newRole]);
        }

        closeDialog();
    };

    const handleDelete = (id: number) => {
        setRoles(roles.filter(role => role.id !== id));
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

            </div>
        )
    };

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
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