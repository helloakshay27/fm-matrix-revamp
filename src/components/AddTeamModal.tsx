import { forwardRef, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { X, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProjectTeams, createProjectTeam } from "@/store/slices/projectTeamsSlice";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { toast } from "sonner";



interface AddTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTeamCreated?: () => void;
}

export const AddTeamModal = ({ isOpen, onClose, onTeamCreated }: AddTeamModalProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { users: fmUsers } = useSelector((state: RootState) => {
        const sliceData = (state.fmUsers as any);
        return { users: sliceData.data?.users || sliceData.users || [] };
    });

    const [teamName, setTeamName] = useState('');
    const [selectedLead, setSelectedLead] = useState<number | null>(null);
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [showLeadDropdown, setShowLeadDropdown] = useState(false);
    const [showMembersDropdown, setShowMembersDropdown] = useState(false);
    const [leadSearch, setLeadSearch] = useState('');
    const [memberSearch, setMemberSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const leadContainerRef = useRef<HTMLDivElement | null>(null);
    const membersContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchFMUsers());
        }
    }, [isOpen, dispatch]);

    const closeDialog = () => {
        setTeamName('');
        setSelectedLead(null);
        setSelectedMembers([]);
        setShowLeadDropdown(false);
        setShowMembersDropdown(false);
        setLeadSearch('');
        setMemberSearch('');
        onClose();
    };

    const handleSubmit = async () => {
        if (!teamName.trim()) {
            toast.error('Please enter team name');
            return;
        }
        if (!selectedLead) {
            toast.error('Please select a team lead');
            return;
        }
        if (selectedMembers.length === 0) {
            toast.error('Please select at least one team member');
            return;
        }

        const payload = {
            project_team: {
                name: teamName,
                team_lead_id: selectedLead,
                user_ids: selectedMembers,
            },
        };

        try {
            setLoading(true);
            await dispatch(createProjectTeam(payload)).unwrap();
            toast.success('Team created successfully');
            dispatch(fetchProjectTeams());
            if (onTeamCreated) {
                onTeamCreated();
            }
            closeDialog();
        } catch (error) {
            console.error("Error creating team:", error);
            toast.error("Failed to create team");
        } finally {
            setLoading(false);
        }
    };

    const toggleMemberSelection = (memberId: number) => {
        setSelectedMembers(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (showLeadDropdown && leadContainerRef.current && !leadContainerRef.current.contains(e.target as Node)) {
                setShowLeadDropdown(false);
            }
            if (showMembersDropdown && membersContainerRef.current && !membersContainerRef.current.contains(e.target as Node)) {
                setShowMembersDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showLeadDropdown, showMembersDropdown]);

    const filteredLeadUsers = (fmUsers || []).filter((u: any) =>
        u.full_name?.toLowerCase().includes(leadSearch.toLowerCase())
    );
    const filteredMemberUsers = (fmUsers || []).filter((u: any) =>
        u.full_name?.toLowerCase().includes(memberSearch.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
            <DialogContent
                className="bg-[#fff] text-sm"
                sx={{
                    padding: "24px !important"
                }}
            >
                <h3 className="text-[16px] font-medium text-center mb-4">
                    Add Team
                </h3>
                <button
                    onClick={closeDialog}
                    className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>
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

                <div className="mt-4 space-y-2">
                    <label className="block text-sm font-medium">
                        Team Lead<span className="text-red-500">*</span>
                    </label>
                    <div className="relative" ref={leadContainerRef}>
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
                                <div className="p-2 border-b">
                                    <input
                                        type="text"
                                        value={leadSearch}
                                        onChange={(e) => setLeadSearch(e.target.value)}
                                        placeholder="Search..."
                                        className="w-full px-3 py-2 border rounded text-sm"
                                    />
                                </div>
                                {filteredLeadUsers && filteredLeadUsers.map((user: any) => (
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

                <div className="mt-4 space-y-2">
                    <label className="block text-sm font-medium">
                        Team Members<span className="text-red-500">*</span>
                    </label>
                    <div className="relative" ref={membersContainerRef}>
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
                                <div className="p-2 border-b">
                                    <input
                                        type="text"
                                        value={memberSearch}
                                        onChange={(e) => setMemberSearch(e.target.value)}
                                        placeholder="Search..."
                                        className="w-full px-3 py-2 border rounded text-sm"
                                    />
                                </div>
                                {filteredMemberUsers && filteredMemberUsers.map((user: any) => (
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
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Team'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddTeamModal;
