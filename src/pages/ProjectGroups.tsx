import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Plus, X, ChevronDown, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProjectGroups, createProjectGroup, updateProjectGroup, deleteProjectGroup } from "@/store/slices/projectGroupSlice";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { toast } from "sonner"; // Assuming sonner is used, or alert

const columns: ColumnConfig[] = [
    {
        key: 'name',
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

const ProjectGroups = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data: projectGroupsData, loading: projectGroupsLoading } = useSelector((state: RootState) => state.fetchProjectGroups);
    const { data: fmUsersData } = useSelector((state: RootState) => state.fmUsers);

    // Auth / User context (mocking or getting from localStorage as per request)
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showMembersDropdown, setShowMembersDropdown] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const groups = projectGroupsData || [];
    // Flatten users list from FMUser response
    const usersOptions = fmUsersData?.users || [];

    useEffect(() => {
        if (baseUrl && token) {
            dispatch(fetchProjectGroups({ baseUrl, token }));
            dispatch(fetchFMUsers());
        }
    }, [dispatch, baseUrl, token]);

    const openAddDialog = () => {
        setIsEditMode(false);
        setGroupName('');
        setSelectedMembers([]);
        setEditingId(null);
        setIsActive(true);
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: any) => {
        setIsEditMode(true);
        setGroupName(item.name);
        setSelectedMembers(item.user_ids || []);
        setEditingId(item.id);
        setIsActive(item.active);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setGroupName('');
        setSelectedMembers([]);
        setEditingId(null);
        setShowMembersDropdown(false);
    };

    const handleSubmit = async () => {
        if (!groupName.trim()) {
            toast.error('Please enter group name');
            return;
        }
        if (selectedMembers.length === 0) {
            toast.error('Please select at least one member');
            return;
        }

        const payload = {
            project_group: {
                name: groupName.trim(),
                created_by_id: currentUser.id,
                user_ids: selectedMembers,
                active: isActive,
            }
        };

        try {
            if (isEditMode && editingId) {
                await dispatch(updateProjectGroup({ baseUrl, token, id: editingId, payload })).unwrap();
                toast.success('Project Group updated successfully');
            } else {
                await dispatch(createProjectGroup({ baseUrl, token, payload })).unwrap();
                toast.success('Project Group created successfully');
            }
            dispatch(fetchProjectGroups({ baseUrl, token }));
            closeDialog();
        } catch (error: any) {
            toast.error(error || 'An error occurred');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this group?')) {
            try {
                await dispatch(deleteProjectGroup({ baseUrl, token, id })).unwrap();
                toast.success('Project Group deleted successfully');
                dispatch(fetchProjectGroups({ baseUrl, token }));
            } catch (error: any) {
                alert(error || 'Failed to delete group');
            }
        }
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
                const memberIds = item.user_ids || [];
                return (
                    <div className="flex">
                        {memberIds.map((memberId: number, index: number) => {
                            const user = usersOptions.find(u => u.id === memberId);
                            // Generate a consistent color based on char code or id
                            const color = user ? `hsl(${(user.id * 137) % 360}, 70%, 80%)` : '#ccc';
                            return user ? (
                                <div
                                    key={memberId}
                                    className="w-8 h-8 rounded-full flex items-center !justify-center text-slate-700 text-xs font-semibold border-2 border-white"
                                    style={{
                                        backgroundColor: color,
                                        marginLeft: index > 0 ? '-12px' : '0'
                                    }}
                                    title={user.full_name}
                                >
                                    {user.full_name?.charAt(0).toUpperCase()}
                                </div>
                            ) : null;
                        })}
                    </div>
                );
            case 'status':
                return (
                    <span className={`px-2 py-1 rounded-full text-xs ${item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.active ? 'Active' : 'Inactive'}
                    </span>
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
                loading={projectGroupsLoading}
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
                                                    <span>{user.full_name}</span>
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
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMembers.map((memberId, index) => {
                                            const user = usersOptions.find(u => u.id === memberId);
                                            const color = user ? `hsl(${(user.id * 137) % 360}, 70%, 80%)` : '#ccc';
                                            return user ? (
                                                <div
                                                    key={memberId}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 text-xs font-semibold border-2 border-white"
                                                    style={{
                                                        backgroundColor: color,
                                                        marginLeft: index > 0 && index < 10 ? '-12px' : '0' // Overlap slightly but handle wrapping 
                                                    }}
                                                    title={user.full_name}
                                                >
                                                    {user.full_name?.charAt(0).toUpperCase()}
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Active Status Checkbox (Optional but good for edit) */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="active-status"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="active-status" className="text-sm font-medium cursor-pointer">Active</label>
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

export default ProjectGroups