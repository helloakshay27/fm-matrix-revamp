import { useEffect, useState, forwardRef } from 'react';
import axios from 'axios';
import { getFullUrl } from '@/config/apiConfig';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { fetchFMUsers } from '@/store/slices/fmUserSlice';
import AddMilestoneForm from './AddMilestoneForm';
import ProjectTaskCreateModal from './ProjectTaskCreateModal';
import { FormControl, InputLabel, MenuItem, Select, TextField, Dialog, DialogTitle, DialogContent, Slide } from "@mui/material";
import { createProject } from "@/store/slices/projectManagementSlice";
import { Button } from "./ui/button";

const Transition = forwardRef(function Transition(props: any, ref: any) {
    return <Slide direction="left" ref={ref} {...props} />;
});

interface ConvertModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    prefillData: {
        title?: string;
        project?: number;
        projectName?: string;
        task?: number;
        taskName?: string;
        description?: string;
    };
    opportunityId: number | string;
}

const ConvertModal = ({
    isModalOpen,
    setIsModalOpen,
    prefillData,
    opportunityId,
}: ConvertModalProps) => {
    const [selectedType, setSelectedType] = useState('Project');
    const token = localStorage.getItem('token');
    const dispatch = useAppDispatch();
    const [owners, setOwners] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [projectTypes, setProjectTypes] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [isLoadingOwners, setIsLoadingOwners] = useState(false);

    // For Project Form
    const [projectFormData, setProjectFormData] = useState({
        title: "",
        isChannel: false,
        isTemplate: false,
        description: "",
        owner: "",
        startDate: "",
        endDate: "",
        team: "",
        type: "",
        priority: "",
        tags: []
    });
    const [isLoadingProject, setIsLoadingProject] = useState(false);

    // For ProjectCreateModal
    const [openProjectDialog, setOpenProjectDialog] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            fetchOwners();
            fetchTeams();
            fetchProjectTypes();
            fetchTags();
            setProjectFormData({
                title: prefillData?.title || "",
                isChannel: false,
                isTemplate: false,
                description: prefillData?.description || "",
                owner: "",
                startDate: "",
                endDate: "",
                team: "",
                type: "",
                priority: "",
                tags: []
            });
        }
    }, [isModalOpen]);

    const fetchOwners = async () => {
        setIsLoadingOwners(true);
        try {
            await dispatch(fetchFMUsers()).unwrap();
            const owners = await axios.get(getFullUrl('/fm_users.json'), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOwners(owners.data || []);
        } catch (error) {
            console.error('Error fetching owners:', error);
        } finally {
            setIsLoadingOwners(false);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await axios.get(getFullUrl('/project_teams.json'), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTeams(response.data || []);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    const fetchProjectTypes = async () => {
        try {
            const response = await axios.get(getFullUrl('/project_types.json'), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjectTypes(response.data || []);
        } catch (error) {
            console.error('Error fetching project types:', error);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await axios.get(getFullUrl('/company_tags.json'), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTags(response.data || []);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedType('Project');
    };

    const updateOpportunityWithConversion = async (conversionData: any) => {
        try {
            const payload = {
                opportunity: {
                    status: 'in_progress',
                    ...conversionData,
                },
            };

            await axios.put(getFullUrl(`/opportunities/${opportunityId}.json`), payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Opportunity converted successfully!');

            // Refresh the page after 1 second
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error updating opportunity:', error);
            toast.error('Failed to update opportunity status');
        }
    };

    const handleProjectSuccess = () => {
        setOpenProjectDialog(false);
        closeModal();
    };

    const handleTaskSuccess = () => {
        closeModal();
    };

    const handleProjectFormChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setProjectFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const validateProjectForm = () => {
        toast.dismiss();
        if (!projectFormData.title) {
            toast.error("Please enter title");
            return false;
        }
        if (!projectFormData.owner) {
            toast.error("Please select owner");
            return false;
        }
        if (!projectFormData.endDate) {
            toast.error("Please select end date");
            return false;
        }
        if (!projectFormData.team) {
            toast.error("Please select team");
            return false;
        }
        if (!projectFormData.type) {
            toast.error("Please select type");
            return false;
        }
        if (!projectFormData.priority) {
            toast.error("Please select priority");
            return false;
        }
        return true;
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateProjectForm()) {
            return;
        }

        setIsLoadingProject(true);
        const baseUrl = localStorage.getItem('baseUrl');

        const payload = {
            project_management: {
                title: projectFormData.title,
                description: projectFormData.description,
                start_date: projectFormData.startDate,
                end_date: projectFormData.endDate,
                status: "active",
                owner_id: projectFormData.owner,
                priority: projectFormData.priority,
                active: true,
                is_template: projectFormData.isTemplate,
                create_channel: projectFormData.isChannel,
                project_team_id: projectFormData.team,
                project_type_id: projectFormData.type,
            },
            task_tag_ids: projectFormData.tags
        };

        try {
            await dispatch(createProject({ token, baseUrl, data: payload })).unwrap();
            toast.success("Project created successfully");
            handleProjectSuccess();
        } catch (error: any) {
            console.error("Error creating project:", error);
            toast.error(error.message || "Failed to create project");
        } finally {
            setIsLoadingProject(false);
        }
    };

    if (!isModalOpen) return null;

    return (
        <Dialog
            open={isModalOpen}
            onClose={closeModal}
            TransitionComponent={Transition}
            transitionDuration={{ enter: 500, exit: 300 }}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    height: '100%',
                    width: '50%',
                    borderRadius: 0,
                    margin: 0,
                    maxHeight: '100%',
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 600, fontSize: '16px', color: '#1B1B1B', textAlign: 'center', borderBottom: '2px solid #E95420', py: 2 }}>
                Convert Opportunity
            </DialogTitle>

            <DialogContent sx={{ p: 3, overflowY: 'auto', maxHeight: 'calc(100% - 100px)' }}>
                {/* Radio Buttons */}
                <div className="mb-6">
                    <div className="flex items-center gap-5">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="convertType"
                                value="Project"
                                checked={selectedType === 'Project'}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-4 h-4 cursor-pointer"
                            />
                            <span className="text-[14px] font-medium">Convert to Project</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="convertType"
                                value="Milestone"
                                checked={selectedType === 'Milestone'}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-4 h-4 cursor-pointer"
                            />
                            <span className="text-[14px] font-medium">Convert to Milestone</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="convertType"
                                value="Task"
                                checked={selectedType === 'Task'}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-4 h-4 cursor-pointer"
                            />
                            <span className="text-[14px] font-medium">Convert to Task</span>
                        </label>
                    </div>
                </div>

                {/* Forms based on selection */}
                <div>
                    {selectedType === 'Project' && (
                        <form onSubmit={handleProjectSubmit} className="space-y-4">
                            <div className="mt-4 space-y-2">
                                <TextField
                                    label="Project Title"
                                    name="title"
                                    placeholder="Enter Project Title"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={projectFormData.title}
                                    onChange={handleProjectFormChange}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mt: 1 }}
                                />
                            </div>

                            <div className="flex justify-between my-4">
                                {[
                                    { id: "createChannel", name: "isChannel", label: "Channel" },
                                    { id: "createTemplate", name: "isTemplate", label: "Template" }
                                ].map(({ id, name, label }) => (
                                    <div key={id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={id}
                                            name={name}
                                            checked={projectFormData[name as keyof typeof projectFormData] as boolean}
                                            onChange={handleProjectFormChange}
                                            className="mx-2 my-0.5"
                                        />
                                        <label htmlFor={id} className="text-sm">
                                            Create a {label}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 space-y-2">
                                <TextField
                                    label="Description*"
                                    name="description"
                                    placeholder=""
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    multiline
                                    minRows={2}
                                    value={projectFormData.description}
                                    onChange={handleProjectFormChange}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            height: "auto !important",
                                            padding: "2px !important",
                                            display: "flex",
                                        },
                                        "& .MuiInputBase-input": {
                                            resize: "none !important",
                                        },
                                    }}
                                />
                            </div>

                            <div className="flex items-start gap-4 mt-3">
                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel shrink>Select Owner*</InputLabel>
                                    <Select
                                        label="Select Owner*"
                                        name="owner"
                                        value={projectFormData.owner}
                                        onChange={handleProjectFormChange}
                                        displayEmpty
                                    >
                                        <MenuItem value="">
                                            <em>Select Owner</em>
                                        </MenuItem>
                                        {
                                            owners.map((owner) => (
                                                <MenuItem key={owner.id} value={owner.id}>
                                                    {owner.full_name}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </div>

                            <div className="flex gap-2 mt-4 text-[12px]">
                                {["startDate", "endDate"].map((field) => (
                                    <div key={field} className="w-full space-y-2">
                                        <TextField
                                            label={field === "startDate" ? "Start Date" : "End Date"}
                                            type="date"
                                            name={field}
                                            value={projectFormData[field as keyof typeof projectFormData]}
                                            onChange={handleProjectFormChange}
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ mt: 1 }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-4 my-5">
                                <div>
                                    <FormControl fullWidth variant="outlined" size="small" sx={{ mt: 1 }}>
                                        <InputLabel shrink>Select Team*</InputLabel>
                                        <Select
                                            label="Select Team*"
                                            name="team"
                                            value={projectFormData.team}
                                            onChange={handleProjectFormChange}
                                            displayEmpty
                                        >
                                            <MenuItem value="">
                                                <em>Select Team</em>
                                            </MenuItem>
                                            {
                                                teams.map((team) => (
                                                    <MenuItem key={team.id} value={team.id}>
                                                        {team.name}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className="flex gap-4">
                                    <FormControl fullWidth variant="outlined" size="small">
                                        <InputLabel shrink>Project Type*</InputLabel>
                                        <Select
                                            label="Project Type*"
                                            name="type"
                                            value={projectFormData.type}
                                            onChange={handleProjectFormChange}
                                            displayEmpty
                                        >
                                            <MenuItem value="">
                                                <em>Select Project Type</em>
                                            </MenuItem>
                                            {
                                                projectTypes.map((type) => (
                                                    <MenuItem key={type.id} value={type.id}>
                                                        {type.name}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth variant="outlined" size="small">
                                        <InputLabel shrink>Priority*</InputLabel>
                                        <Select
                                            label="Priority*"
                                            name="priority"
                                            value={projectFormData.priority}
                                            onChange={handleProjectFormChange}
                                            displayEmpty
                                        >
                                            <MenuItem value="">
                                                <em>Select Priority</em>
                                            </MenuItem>
                                            <MenuItem value="high">High</MenuItem>
                                            <MenuItem value="medium">Medium</MenuItem>
                                            <MenuItem value="low">Low</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                <div>
                                    <FormControl fullWidth variant="outlined" size="small">
                                        <InputLabel shrink>Tags*</InputLabel>
                                        <Select
                                            label="Tags*"
                                            name="tags"
                                            multiple
                                            value={projectFormData.tags}
                                            onChange={handleProjectFormChange}
                                            displayEmpty
                                        >
                                            <MenuItem value="">
                                                <em>Select Tags</em>
                                            </MenuItem>
                                            {
                                                tags.map((tag) => (
                                                    <MenuItem key={tag.id} value={tag.id}>
                                                        {tag.name}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={closeModal}
                                        className="px-6"
                                        disabled={isLoadingProject}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleProjectSubmit}
                                        disabled={isLoadingProject}
                                        className="bg-[#C72030] hover:bg-red-700"
                                    >
                                        {isLoadingProject ? 'Creating...' : 'Create Project'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}

                    {selectedType === 'Milestone' && (
                        <div>
                            <AddMilestoneForm
                                owners={owners}
                                handleClose={closeModal}
                            />
                        </div>
                    )}

                    {selectedType === 'Task' && (
                        <ProjectTaskCreateModal
                            isEdit={false}
                            onCloseModal={handleTaskSuccess}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConvertModal;
