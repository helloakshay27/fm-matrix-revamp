import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Plus, X, ChevronDown, Trash2 } from "lucide-react";
import { useState } from "react";

const columns: ColumnConfig[] = [
    {
        key: 'groupName',
        label: 'Project Group Name',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'members',
        label: 'Project Group Members',
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
]

const usersOptions = [
    { id: 1, name: 'Sarah Mitchell', initials: 'S', color: '#D1B4E8' },
    { id: 2, name: 'Uriah Johnson', initials: 'U', color: '#E8B4D1' },
    { id: 3, name: 'John Davis', initials: 'J', color: '#E8D1B4' },
    { id: 4, name: 'Alice Chen', initials: 'A', color: '#B4D1E8' },
    { id: 5, name: 'Bob Smith', initials: 'B', color: '#D1E8B4' },
    { id: 6, name: 'Charlie Brown', initials: 'C', color: '#E8B4B4' },
];

const ProjectGroups = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showMembersDropdown, setShowMembersDropdown] = useState(false);
    const [groups, setGroups] = useState([
        {
            id: 1,
            groupName: 'Test 23',
            memberIds: [1, 2, 3],
            isActive: true,
        },
    ]);

    const openAddDialog = () => {
        setIsEditMode(false);
        setGroupName('');
        setSelectedMembers([]);
        setEditingId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: any) => {
        setIsEditMode(true);
        setGroupName(item.groupName);
        setSelectedMembers(item.memberIds);
        setEditingId(item.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setGroupName('');
        setSelectedMembers([]);
        setEditingId(null);
        setShowMembersDropdown(false);
    };

    const handleSubmit = () => {
        if (!groupName.trim()) {
            alert('Please enter group name');
            return;
        }
        if (selectedMembers.length === 0) {
            alert('Please select at least one member');
            return;
        }

        if (isEditMode && editingId) {
            setGroups(groups.map(group =>
                group.id === editingId
                    ? { ...group, groupName, memberIds: selectedMembers }
                    : group
            ));
        } else {
            const newGroup = {
                id: Math.max(...groups.map(g => g.id), 0) + 1,
                groupName,
                memberIds: selectedMembers,
                isActive: true,
            };
            setGroups([...groups, newGroup]);
        }

        closeDialog();
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this group?')) {
            setGroups(groups.filter(group => group.id !== id));
        }
    };

    const handleToggleStatus = (id: number) => {
        setGroups(groups.map(group =>
            group.id === id
                ? { ...group, isActive: !group.isActive }
                : group
        ));
    };

    const toggleMemberSelection = (memberId: number) => {
        setSelectedMembers(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const renderActions = (item: any) => {
        return (
            <div className="flex gap-2 items-center">
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
            case 'members':
                return (
                    <div className="flex">
                        {item.memberIds.map((memberId: number, index: number) => {
                            const user = usersOptions.find(u => u.id === memberId);
                            return user ? (
                                <div
                                    key={memberId}
                                    className="w-8 h-8 rounded-full flex items-center !justify-center text-white text-xs font-semibold border-2 border-white"
                                    style={{
                                        backgroundColor: user.color,
                                        marginLeft: index > 0 ? '-12px' : '0'
                                    }}
                                    title={user.name}
                                >
                                    {user.initials}
                                </div>
                            ) : null;
                        })}
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
                data={groups}
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
                                {isEditMode ? 'Edit Project Group' : 'New Project Group'} <span className="text-red-500">*</span>
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
                            {/* Group Name */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Project Group Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="Enter project group name here..."
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400"
                                    autoFocus
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && selectedMembers.length > 0) {
                                            handleSubmit();
                                        }
                                    }}
                                />
                            </div>

                            {/* Members Dropdown */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Select Members <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMembersDropdown(!showMembersDropdown)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:border-blue-500"
                                    >
                                        <span className={selectedMembers.length > 0 ? 'text-base' : 'text-gray-400'}>
                                            {selectedMembers.length > 0
                                                ? `${selectedMembers.length} selected`
                                                : 'Select Users'}
                                        </span>
                                        <ChevronDown size={20} className="text-gray-400" />
                                    </button>
                                    {showMembersDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded shadow-lg z-10 max-h-64 overflow-y-auto">
                                            {usersOptions.map(user => (
                                                <label
                                                    key={user.id}
                                                    className="flex items-center px-4 py-3 hover:bg-gray-100 border-b last:border-b-0 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMembers.includes(user.id)}
                                                        onChange={() => toggleMemberSelection(user.id)}
                                                        className="w-4 h-4 rounded border-gray-300 cursor-pointer mr-3"
                                                    />
                                                    <span>{user.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Selected Members Preview */}
                            {selectedMembers.length > 0 && (
                                <div className="pt-2">
                                    <p className="text-sm text-gray-600 mb-2">Selected Members:</p>
                                    <div className="flex">
                                        {selectedMembers.map((memberId, index) => {
                                            const user = usersOptions.find(u => u.id === memberId);
                                            return user ? (
                                                <div
                                                    key={memberId}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                                                    style={{
                                                        backgroundColor: user.color,
                                                        marginLeft: index > 0 ? '-12px' : '0'
                                                    }}
                                                    title={user.name}
                                                >
                                                    {user.initials}
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}

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

export default ProjectGroups