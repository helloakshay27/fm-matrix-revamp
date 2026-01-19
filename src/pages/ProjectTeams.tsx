import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Plus, X, Trash } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { Dialog, DialogContent, Slide, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProjectTeams, createProjectTeam, updateProjectTeam, deleteProjectTeam } from "@/store/slices/projectTeamsSlice";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import MuiMultiSelect from "@/components/MuiMultiSelect";
import { toast } from "sonner";
import axios from "axios";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

const columns: ColumnConfig[] = [
    {
        key: 'title',
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

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [teamName, setTeamName] = useState('');
    const [selectedLead, setSelectedLead] = useState<number | null>(null);
    const [selectedMembers, setSelectedMembers] = useState<{ value: number; label: string }[]>([]);
    const [submitting, setSubmitting] = useState(false)
    const [users, setUsers] = useState([])

    const getUsers = async () => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setUsers(response.data.users)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        dispatch(fetchProjectTeams());
        getUsers()
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
        const leadId = item.team_lead_id || item.lead_id || (item.lead && item.lead.id);
        setSelectedLead(leadId);

        let memberIds: number[] = [];
        if (item.user_ids) {
            memberIds = item.user_ids;
        } else if (item.member_ids) {
            memberIds = item.member_ids;
        } else if (item.members && Array.isArray(item.members)) {
            memberIds = item.members.map((m: any) => m.id);
        } else if (item.project_team_members && Array.isArray(item.project_team_members)) {
            memberIds = item.project_team_members.map((m: any) => m.user.id);
        }

        // Convert to MuiMultiSelect format
        const membersForSelect = memberIds.map(id => {
            const user = users.find((u: any) => u.id === id);
            return { value: id, label: user?.full_name || `User ${id}` };
        });
        setSelectedMembers(membersForSelect);

        setEditingId(item.id);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setTeamName('');
        setSelectedLead(null);
        setSelectedMembers([]);
        setEditingId(null);
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

        try {
            setSubmitting(true)

            // Construct payload as requested
            const payload = {
                project_team: {
                    name: teamName,
                    team_lead_id: selectedLead,
                    user_ids: Array.from(
                        new Set([
                            selectedLead, // include team lead
                            ...selectedMembers.map(member => member.value),
                        ])
                    ), // Extract IDs from MuiMultiSelect format
                },
            };

            if (isEditMode && editingId) {
                await dispatch(updateProjectTeam({ id: editingId, data: payload })).unwrap();
                dispatch(fetchProjectTeams());
                toast.success('Team updated successfully');
            } else {
                await dispatch(createProjectTeam(payload)).unwrap();
                dispatch(fetchProjectTeams());
                toast.success('Team created successfully');
            }

            closeDialog();
        } catch (error) {
            console.log(error)
            toast.error('Failed to save team');
        } finally {
            setSubmitting(false)
        }


    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this team?')) {
            await dispatch(deleteProjectTeam(id)).unwrap();
            dispatch(fetchProjectTeams());
        }
    };

    const handleMultiSelectChange = (values: any) => {
        setSelectedMembers(values);
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
                {/* <Button
                    size="sm"
                    variant="ghost"
                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(item.id)}
                >
                    <Trash className="w-4 h-4" />
                </Button> */}
            </div>
        )
    };

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case 'lead_name':
                if (item.team_lead?.name) return item.team_lead.name;
                return 'N/A';
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
                                <TextField
                                    label="Team Name*"
                                    name="teamName"
                                    placeholder="Enter Team Name"
                                    fullWidth
                                    variant="outlined"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ sx: fieldStyles }}
                                    sx={{ mt: 1 }}
                                />
                            </div>

                            {/* Team Lead */}
                            <div className="mt-4 space-y-2">
                                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                                    <InputLabel shrink>Team Lead*</InputLabel>
                                    <Select
                                        label="Team Lead*"
                                        name="teamLead"
                                        value={selectedLead || ''}
                                        onChange={(e) => setSelectedLead(e.target.value as number)}
                                        displayEmpty
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="">
                                            <em>Select Team Lead</em>
                                        </MenuItem>
                                        {
                                            users.map((user: any) => (
                                                <MenuItem key={user.id} value={user.id}>
                                                    {user.full_name}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Team Members */}
                            <div className="mt-4 space-y-2">
                                <MuiMultiSelect
                                    label="Team Members*"
                                    options={users
                                        .filter((user: any) => user.id !== selectedLead)
                                        .map((user: any) => ({ value: user.id, label: user.full_name, id: user.id }))}
                                    value={selectedMembers}
                                    onChange={handleMultiSelectChange}
                                    placeholder="Select Team Members"
                                />
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
                                    disabled={submitting}
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