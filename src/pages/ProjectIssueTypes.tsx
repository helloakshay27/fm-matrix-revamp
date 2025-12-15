import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Plus, X, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

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
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const userId = JSON.parse(localStorage.getItem('user'))?.id || '';

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [typeName, setTypeName] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [issueTypes, setIssueTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch issue types on component mount
    useEffect(() => {
        fetchIssueTypes();
    }, []);

    const fetchIssueTypes = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`https://${baseUrl}/issue_types.json`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data || [];
            const mappedData = data.map((item: any) => ({
                id: item.id,
                typeName: item.name,
                createdOn: new Date(item.created_at).toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                }),
                description: item.description,
            }));

            setIssueTypes(mappedData);
        } catch (error) {
            console.error('Error fetching issue types:', error);
            toast.error('Failed to fetch issue types');
            setIssueTypes([]);
        } finally {
            setIsLoading(false);
        }
    };

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
        const trimmedType = typeName.trim();
        const trimmedDescription = description.trim();

        if (!trimmedType) {
            toast.error('Please enter issue type name');
            return;
        }
        if (!trimmedDescription) {
            toast.error('Please enter description');
            return;
        }

        if (isEditMode && editingId) {
            updateIssueType(trimmedType, trimmedDescription);
        } else {
            createIssueType(trimmedType, trimmedDescription);
        }
    };

    const createIssueType = async (trimmedType: string, trimmedDescription: string) => {
        try {
            setIsSubmitting(true);
            const payload = {
                issue_type: {
                    name: trimmedType,
                    description: trimmedDescription,
                    created_by_id: userId,
                }
            };

            const response = await axios.post(`https://${baseUrl}/issue_types.json`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201 || response.status === 200) {
                toast.success('Issue type created successfully');
                closeDialog();
                fetchIssueTypes();
            }
        } catch (error) {
            console.error('Error creating issue type:', error);
            toast.error('Failed to create issue type');
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateIssueType = async (trimmedType: string, trimmedDescription: string) => {
        try {
            setIsSubmitting(true);
            const payload = {
                issue_type: {
                    name: trimmedType,
                    description: trimmedDescription,
                }
            };

            const response = await axios.put(`https://${baseUrl}/issue_types/${editingId}.json`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success('Issue type updated successfully');
                closeDialog();
                fetchIssueTypes();
            }
        } catch (error) {
            console.error('Error updating issue type:', error);
            toast.error('Failed to update issue type');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this issue type?')) {
            deleteIssueType(id);
        }
    };

    const deleteIssueType = async (id: number) => {
        try {
            const response = await axios.delete(`https://${baseUrl}/issue_types/${id}.json`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success('Issue type deleted successfully');
                fetchIssueTypes();
            }
        } catch (error) {
            console.error('Error deleting issue type:', error);
            toast.error('Failed to delete issue type');
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