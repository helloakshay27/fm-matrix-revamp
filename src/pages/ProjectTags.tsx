import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Plus, X, ChevronDown, Trash2 } from "lucide-react";
import { useState } from "react";

const columns: ColumnConfig[] = [
    {
        key: 'tagName',
        label: 'Tag Name',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'tagType',
        label: 'Tag Type',
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
    {
        key: 'status',
        label: 'Status',
        sortable: false,
        draggable: true,
        defaultVisible: true,
    },
]

const tagTypeOptions = [
    { id: 1, name: 'Product Tag' },
    { id: 2, name: 'Client Tag' },
];

const ProjectTags = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [tagName, setTagName] = useState('');
    const [selectedTagType, setSelectedTagType] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showTagTypeDropdown, setShowTagTypeDropdown] = useState(false);
    const [tags, setTags] = useState([
        {
            id: 1,
            tagName: 'Run Cycle',
            tagType: 'Product Tag',
            createdOn: '22/11/2025',
            isActive: true,
        },
        {
            id: 2,
            tagName: 'Recess club tag',
            tagType: 'Client Tag',
            createdOn: '21/11/2025',
            isActive: true,
        },
        {
            id: 3,
            tagName: 'Project & Task',
            tagType: 'Product Tag',
            createdOn: '10/11/2025',
            isActive: true,
        },
        {
            id: 4,
            tagName: 'ERP',
            tagType: 'Client Tag',
            createdOn: '09/09/2025',
            isActive: true,
        },
        {
            id: 5,
            tagName: 'HRMS',
            tagType: 'Client Tag',
            createdOn: '03/07/2025',
            isActive: true,
        },
        {
            id: 6,
            tagName: 'New Tag',
            tagType: 'Client Tag',
            createdOn: '02/07/2025',
            isActive: true,
        },
    ]);

    const openAddDialog = () => {
        setIsEditMode(false);
        setTagName('');
        setSelectedTagType('');
        setEditingId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: any) => {
        setIsEditMode(true);
        setTagName(item.tagName);
        setSelectedTagType(item.tagType);
        setEditingId(item.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setTagName('');
        setSelectedTagType('');
        setEditingId(null);
        setShowTagTypeDropdown(false);
    };

    const handleSubmit = () => {
        if (!tagName.trim()) {
            alert('Please enter tag name');
            return;
        }
        if (!selectedTagType) {
            alert('Please select tag type');
            return;
        }

        if (isEditMode && editingId) {
            setTags(tags.map(tag =>
                tag.id === editingId
                    ? { ...tag, tagName, tagType: selectedTagType }
                    : tag
            ));
        } else {
            const newTag = {
                id: Math.max(...tags.map(t => t.id), 0) + 1,
                tagName,
                tagType: selectedTagType,
                createdOn: new Date().toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                }),
                isActive: true,
            };
            setTags([...tags, newTag]);
        }

        closeDialog();
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this tag?')) {
            setTags(tags.filter(tag => tag.id !== id));
        }
    };

    const handleToggleStatus = (id: number) => {
        setTags(tags.map(tag =>
            tag.id === id
                ? { ...tag, isActive: !tag.isActive }
                : tag
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
                data={tags}
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
                                {isEditMode ? 'Edit Tag' : 'New Tag'} <span className="text-red-500">*</span>
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
                            {/* Tag Name */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Tag Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tagName}
                                    onChange={(e) => setTagName(e.target.value)}
                                    placeholder="Tag Name"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400"
                                    autoFocus
                                />
                            </div>

                            {/* Tag Type Dropdown */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Tag Type <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowTagTypeDropdown(!showTagTypeDropdown)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:border-blue-500"
                                    >
                                        <span className={selectedTagType ? 'text-base' : 'text-gray-400'}>
                                            {selectedTagType || 'Tag Type'}
                                        </span>
                                        <ChevronDown size={20} className="text-gray-400" />
                                    </button>
                                    {showTagTypeDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded shadow-lg z-10">
                                            {tagTypeOptions.map(type => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => {
                                                        setSelectedTagType(type.name);
                                                        setShowTagTypeDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 border-b last:border-b-0 ${selectedTagType === type.name
                                                            ? 'bg-red-600 text-white'
                                                            : 'hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {type.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
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

export default ProjectTags