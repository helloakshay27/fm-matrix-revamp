import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Plus, X, Trash2 } from "lucide-react";
import { useState } from "react";

const columns: ColumnConfig[] = [
    {
        key: 'typeName',
        label: 'Issues Type Name',
        sortable: true,
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
        key: 'description',
        label: 'Description',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const ProjectIssueTypes = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [typeName, setTypeName] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [issueTypes, setIssueTypes] = useState([
        {
            id: 1,
            typeName: 'Critical',
            createdOn: '04/07/2025',
            description: 'SHOW STOPPER',
        },
        {
            id: 2,
            typeName: 'enhancement module',
            createdOn: '01/07/2025',
            description: 'Enhancement',
        },
        {
            id: 3,
            typeName: 'data correction',
            createdOn: '01/07/2025',
            description: 'Data Correction',
        },
        {
            id: 4,
            typeName: 'new requirement',
            createdOn: '01/07/2025',
            description: 'New Requirement',
        },
        {
            id: 5,
            typeName: 'bug',
            createdOn: '01/07/2025',
            description: 'Bug',
        },
    ]);

    const openAddDialog = () => {
        setIsEditMode(false);
        setTypeName('');
        setDescription('');
        setEditingId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: any) => {
        setIsEditMode(true);
        setTypeName(item.typeName);
        setDescription(item.description);
        setEditingId(item.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setTypeName('');
        setDescription('');
        setEditingId(null);
    };

    const handleSubmit = () => {
        if (!typeName.trim()) {
            alert('Please enter issue type name');
            return;
        }
        if (!description.trim()) {
            alert('Please enter description');
            return;
        }

        if (isEditMode && editingId) {
            setIssueTypes(issueTypes.map(issue =>
                issue.id === editingId
                    ? { ...issue, typeName, description }
                    : issue
            ));
        } else {
            const newIssueType = {
                id: Math.max(...issueTypes.map(i => i.id), 0) + 1,
                typeName,
                description,
                createdOn: new Date().toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                }),
            };
            setIssueTypes([...issueTypes, newIssueType]);
        }

        closeDialog();
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this issue type?')) {
            setIssueTypes(issueTypes.filter(issue => issue.id !== id));
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
                data={issueTypes}
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
                                {isEditMode ? 'Edit Issues Type' : 'New Issues Type'} <span className="text-red-500">*</span>
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
                                    Issues Type Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={typeName}
                                    onChange={(e) => setTypeName(e.target.value)}
                                    placeholder="Enter Issues type name here..."
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400"
                                    autoFocus
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter Description here..."
                                    rows={4}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400 resize-none"
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

export default ProjectIssueTypes