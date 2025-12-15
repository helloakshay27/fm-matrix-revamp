import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Plus, X, ChevronDown, Trash } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { Dialog, DialogContent, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProjectTeams, createProjectTeam, updateProjectTeam, deleteProjectTeam } from "@/store/slices/projectTeamsSlice";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const columns: ColumnConfig[] = [
    {
        key: 'title', // mapped from item.name or item.title in logic
        label: 'Team Name',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'lead_name',
        label: 'Team Lead',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'members_names',
        label: 'Team Members (TL+Members)',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const ProjectTeams = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { teams, loading } = useSelector((state: RootState) => state.projectTeams);
    const { users: fmUsers } = useSelector((state: RootState) => {
        // Safe access for createApiSlice structure (data.users) or standard slice (users directly)
        const sliceData = (state.fmUsers as any);
        return { users: sliceData.data?.users || sliceData.users || [] };
    });

    console.log(teams)

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [teamName, setTeamName] = useState('');
    const [selectedLead, setSelectedLead] = useState<number | null>(null);
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [showLeadDropdown, setShowLeadDropdown] = useState(false);
    const [showMembersDropdown, setShowMembersDropdown] = useState(false);

    useEffect(() => {
        dispatch(fetchProjectTeams());
        dispatch(fetchFMUsers());
    }, [dispatch]);

    const openAddDialog = () => {
        setIsEditMode(false);
        setTeamName('');
        setSelectedLead(null);
        setSelectedMembers([]);
        setEditingId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: any) => {
        setIsEditMode(true);
        setTeamName(item.name || item.title);
        // Map response logic.
        // If API returns team_lead_id, use that. If it returns nested object, map it.
        // Given the payload requirement, the response likely has team_lead_id / user_ids or similar.
        // Fallback to previous logic just in case.
        const leadId = item.team_lead_id || item.lead_id || (item.lead && item.lead.id);
        setSelectedLead(leadId);

        let memberIds: number[] = [];
        if (item.user_ids) {
            memberIds = item.user_ids;
        } else if (item.member_ids) {
            memberIds = item.member_ids;
        } else if (item.members && Array.isArray(item.members)) {
            memberIds = item.members.map((m: any) => m.id);
        }
        setSelectedMembers(memberIds);

        setEditingId(item.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setTeamName('');
        setSelectedLead(null);
        setSelectedMembers([]);
        setEditingId(null);
        setShowLeadDropdown(false);
        setShowMembersDropdown(false);
    };

    const handleSubmit = async () => {
        if (!teamName.trim()) {
            alert('Please enter team name');
            return;
        }
        if (!selectedLead) {
            alert('Please select a team lead');
            return;
        }
        if (selectedMembers.length === 0) {
            alert('Please select at least one team member');
            return;
        }

        // Construct payload as requested
        const payload = {
            project_team: {
                name: teamName,
                team_lead_id: selectedLead,
                user_ids: selectedMembers, // selectedMembers is already an array of IDs
            },
        };

        if (isEditMode && editingId) {
            await dispatch(updateProjectTeam({ id: editingId, data: payload })).unwrap();
            dispatch(fetchProjectTeams());
        } else {
            await dispatch(createProjectTeam(payload)).unwrap();
            dispatch(fetchProjectTeams());
        }

        closeDialog();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this team?')) {
            await dispatch(deleteProjectTeam(id)).unwrap();
            dispatch(fetchProjectTeams());
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
                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(item.id)}
                >
                    <Trash className="w-4 h-4" />
                </Button>
            </div>
        )
    };

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case 'lead_name':
                if (item.team_lead?.name) return item.team_lead.name;
                return 'N/A';
            // case 'members_names':
            //     if (Array.isArray(item.project_team_members)) {
            //         const names = item.project_team_members.map((m: any) => m.user.name).filter(Boolean);
            //         if (names.length > 0) return names.join(', ');
            //     }
            //     return '-';
            case 'members_names':
                if (Array.isArray(item.project_team_members)) {
                    const names = item.project_team_members
                        .map((m: any) => m.user.name)
                        .filter(Boolean);

                    if (names.length === 0) return "-";

                    const limit = 2; // change limit if needed

                    if (names.length > limit) {
                        return `${names.slice(0, limit).join(", ")}…`;
                    }

                    return names.join(", ");
                }
                return "-";
            case 'title':
                return item.name || item.title;
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
                data={teams}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
                pagination={true}
                pageSize={10}
                loading={loading}
            />

            {/* Dialog Modal */}
            <Dialog open={isDialogOpen} onClose={closeDialog} TransitionComponent={Transition}>
                <DialogContent
                    className="w-[35rem] h-full fixed right-0 top-0 rounded-none bg-[#fff] text-sm"
                    style={{ margin: 0 }}
                    sx={{
                        padding: "0 !important"
                    }}
                >
                    <h3 className="text-[14px] font-medium text-center mt-8">
                        {isEditMode ? 'Edit Team' : 'Add Team'}
                    </h3>
                    <button
                        onClick={closeDialog}
                        className="absolute top-[26px] right-8 cursor-pointer text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>

                    <hr className="border border-[#E95420] mt-4" />

                    <div className="overflow-y-auto" style={{ height: 'calc(100vh - 110px)' }}>
                        <div className="max-w-[90%] mx-auto pr-3">
                            {/* Team Name */}
                            <div className="mt-6 space-y-2">
                                <label className="block text-sm font-medium">
                                    Team Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    placeholder="Enter Team Name"
                                    className="w-full px-4 py-1.5 border-2 border-gray-300 rounded focus:outline-none placeholder-gray-400 text-base"
                                />
                            </div>

                            {/* Team Lead Dropdown */}
                            <div className="mt-4 space-y-2">
                                <label className="block text-sm font-medium">
                                    Team Lead<span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowLeadDropdown(!showLeadDropdown)}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:border-blue-500"
                                    >
                                        <span className={selectedLead ? 'text-base' : 'text-gray-400'}>
                                            {selectedLead
                                                ? fmUsers.find((user: any) => user.id === selectedLead)?.full_name
                                                : 'Select team Lead'}
                                        </span>
                                        <ChevronDown size={20} className="text-gray-400" />
                                    </button>
                                    {showLeadDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
                                            {fmUsers && fmUsers.map((user: any) => (
                                                <button
                                                    key={user.id}
                                                    onClick={() => {
                                                        setSelectedLead(user.id);
                                                        setShowLeadDropdown(false);
                                                    }}
                                                    className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0"
                                                >
                                                    {user.full_name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Team Members Dropdown */}
                            <div className="mt-4 space-y-2">
                                <label className="block text-sm font-medium">
                                    Team Members<span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMembersDropdown(!showMembersDropdown)}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:border-blue-500"
                                    >
                                        <span className={selectedMembers.length > 0 ? 'text-base' : 'text-gray-400'}>
                                            {selectedMembers.length > 0
                                                ? `${selectedMembers.length} selected`
                                                : 'Select Team Members'}
                                        </span>
                                        <ChevronDown size={20} className="text-gray-400" />
                                    </button>
                                    {showMembersDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded shadow-lg z-10 max-h-64 overflow-y-auto">
                                            {fmUsers && fmUsers.map((user: any) => (
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

                            {/* Action Buttons */}
                            <div className="flex justify-center gap-3 mb-6 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={closeDialog}
                                    className="px-6"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-[#C72030] hover:bg-[#A01020] text-white px-6"
                                    onClick={handleSubmit}
                                >
                                    {isEditMode ? 'Update' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ProjectTeams