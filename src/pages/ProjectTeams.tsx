import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Plus, X, ChevronDown } from "lucide-react";
import { forwardRef, useState } from "react";
import { Dialog, DialogContent, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const columns: ColumnConfig[] = [
    {
        key: 'title',
        label: 'Team Name',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'lead',
        label: 'Team Lead',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'members',
        label: 'Team Members (TL+Members)',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const teamLeadsOptions = [
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Davis' },
    { id: 4, name: 'Diana Wilson' },
];

const teamMembersOptions = [
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Davis' },
    { id: 4, name: 'Diana Wilson' },
    { id: 5, name: 'Eve Martinez' },
    { id: 6, name: 'Frank Garcia' },
];

const ProjectTeams = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [teamName, setTeamName] = useState('');
    const [selectedLead, setSelectedLead] = useState<number | null>(null);
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [showLeadDropdown, setShowLeadDropdown] = useState(false);
    const [showMembersDropdown, setShowMembersDropdown] = useState(false);
    const [teams, setTeams] = useState([
        {
            id: 1,
            title: "Project Team Alpha",
            lead: "Alice Johnson",
            members: "Alice Johnson, Bob Smith, Charlie Davis"
        }
    ]);

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
        setTeamName(item.title);
        const lead = teamLeadsOptions.find(l => l.name === item.lead);
        setSelectedLead(lead?.id || null);
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

    const handleSubmit = () => {
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

        const leadName = teamLeadsOptions.find(l => l.id === selectedLead)?.name || '';
        const memberNames = selectedMembers
            .map(id => teamMembersOptions.find(m => m.id === id)?.name)
            .filter(Boolean)
            .join(', ');

        if (isEditMode && editingId) {
            setTeams(teams.map(team =>
                team.id === editingId
                    ? { ...team, title: teamName, lead: leadName, members: memberNames }
                    : team
            ));
        } else {
            const newTeam = {
                id: Math.max(...teams.map(t => t.id), 0) + 1,
                title: teamName,
                lead: leadName,
                members: memberNames,
            };
            setTeams([...teams, newTeam]);
        }

        closeDialog();
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
                data={teams}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
                pagination={true}
                pageSize={10}
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
                                    placeholder="Enter Matrix Title"
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
                                                ? teamLeadsOptions.find(l => l.id === selectedLead)?.name
                                                : 'Select team Lead'}
                                        </span>
                                        <ChevronDown size={20} className="text-gray-400" />
                                    </button>
                                    {showLeadDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded shadow-lg z-10">
                                            {teamLeadsOptions.map(lead => (
                                                <button
                                                    key={lead.id}
                                                    onClick={() => {
                                                        setSelectedLead(lead.id);
                                                        setShowLeadDropdown(false);
                                                    }}
                                                    className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0"
                                                >
                                                    {lead.name}
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
                                            {teamMembersOptions.map(member => (
                                                <label
                                                    key={member.id}
                                                    className="flex items-center px-4 py-3 hover:bg-gray-100 border-b last:border-b-0 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMembers.includes(member.id)}
                                                        onChange={() => toggleMemberSelection(member.id)}
                                                        className="w-4 h-4 rounded border-gray-300 cursor-pointer mr-3"
                                                    />
                                                    <span>{member.name}</span>
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