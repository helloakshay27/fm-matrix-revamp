import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { createMilestone, fetchMilestones } from "@/store/slices/projectMilestoneSlice";

interface Project {
    id: string | number;
    start_date?: string;
    end_date?: string;
    [key: string]: any;
}

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

const calculateDuration = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return '';

    const start = new Date(startDate);
    const end = new Date(endDate);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    // If start date is today
    if (startDay.getTime() === today.getTime()) {
        // If end date is also today
        if (endDay.getTime() === today.getTime()) {
            // Calculate from now to end of today (11:59:59 PM)
            const endOfToday = new Date(today);
            endOfToday.setHours(23, 59, 59, 999);

            const msToEnd = endOfToday.getTime() - now.getTime();
            const totalMins = Math.floor(msToEnd / (1000 * 60));
            const hrs = Math.floor(totalMins / 60);
            const mins = totalMins % 60;
            return `0d : ${hrs}h : ${mins}m`;
        } else {
            // End date is in the future
            if (endDay.getTime() < startDay.getTime()) return 'Invalid: End date before start date';

            const daysDiff = Math.floor((endDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            // Calculate remaining hours and minutes from now to end of today (midnight)
            const endOfToday = new Date(today);
            endOfToday.setHours(23, 59, 59, 999);

            const msToday = endOfToday.getTime() - now.getTime();
            const totalMinutes = Math.floor(msToday / (1000 * 60));
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            return `${daysDiff}d : ${hours}h : ${minutes}m`;
        }
    } else {
        // For future dates, calculate days only
        if (endDay.getTime() < startDay.getTime()) return 'Invalid: End date before start date';

        const days = Math.floor((endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return `${days}d : 0h : 0m`;
    }
};

// Milestone Modal Component for displaying saved and new milestones
const AddMilestoneModal = ({
    users,
    formData,
    setFormData,
    setIsDelete,
    isReadOnly = false,
    milestoneOptions,
    hasSavedMilestones,
    projectStartDate,
    projectEndDate,
    opportunityId,
    projects = [],
    showProjectSelector = false,
}: any) => {
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (name: string, value: any) => {
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="flex flex-col relative justify-start gap-4 w-full bottom-0 bg-white py-3">
            {!isReadOnly && hasSavedMilestones && (
                <div className="absolute right-2 top-2">
                    <DeleteOutlinedIcon
                        className="text-red-600 cursor-pointer"
                        onClick={() => {
                            setFormData({});
                            setIsDelete(true);
                        }}
                    />
                </div>
            )}
            {showProjectSelector && (
                <div className="flex items-start gap-4 mt-3">
                    <div className="w-full flex flex-col justify-between">
                        <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                            <InputLabel shrink>Select Project*</InputLabel>
                            <Select
                                label="Select Project*"
                                name="projectId"
                                displayEmpty
                                sx={fieldStyles}
                                value={formData.projectId || ''}
                                onChange={(e) => handleSelectChange('projectId', e.target.value)}
                                disabled={isReadOnly}
                            >
                                <MenuItem value="">
                                    <em>Select Project</em>
                                </MenuItem>
                                {projects?.map((proj: any) => (
                                    <MenuItem key={proj.id} value={proj.id}>
                                        {proj.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
            )}

            <div className="mt-4 space-y-2">
                <TextField
                    label={<>Milestone Title<span className="text-red-500">*</span></>}
                    name="milestoneTitle"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                    value={formData.milestoneTitle || ''}
                    onChange={handleInputChange}
                    disabled={isReadOnly}
                />
            </div>

            <div className="flex items-start gap-4 mt-3">
                <div className="w-1/2 flex flex-col justify-between">
                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                        <InputLabel shrink>Milestone Owner<span className="text-red-500">*</span></InputLabel>
                        <Select
                            label="Milestone Owner*"
                            name="owner"
                            displayEmpty
                            sx={fieldStyles}
                            value={formData.owner || ''}
                            onChange={(e) => handleSelectChange('owner', e.target.value)}
                            disabled={isReadOnly}
                        >
                            <MenuItem value="">
                                <em>Select Owner</em>
                            </MenuItem>
                            {users?.map((user: any) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.full_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div className="flex items-start gap-4 mt-4 text-[12px]">
                <div className="w-1/3 space-y-2">
                    <TextField
                        label={<>Start Date<span className="text-red-500">*</span></>}
                        type="date"
                        name="startDate"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                        value={formData.startDate || ''}
                        onChange={handleInputChange}
                        inputProps={{
                            min: new Date().toISOString().split('T')[0] || projectStartDate,
                            max: projectEndDate,
                        }}
                        disabled={isReadOnly}
                    />
                </div>

                <div className="w-1/3 space-y-2">
                    <TextField
                        label={<>End Date<span className="text-red-500">*</span></>}
                        type="date"
                        name="endDate"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                        value={formData.endDate || ''}
                        onChange={handleInputChange}
                        inputProps={{
                            min: formData.startDate || projectStartDate,
                            max: projectEndDate,
                        }}
                        disabled={isReadOnly}
                    />
                </div>

                <div className="w-[200px] space-y-2">
                    <TextField
                        label="Duration"
                        name="duration"
                        disabled
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                        value={calculateDuration(formData.startDate, formData.endDate)}
                    />
                </div>
            </div>

            <div className="flex items-start gap-4 mt-3">
                <div className="w-1/2 flex flex-col justify-between">
                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                        <InputLabel shrink>Depends On</InputLabel>
                        <Select
                            label="Depends On"
                            name="dependsOn"
                            displayEmpty
                            sx={fieldStyles}
                            value={formData.dependsOn || ''}
                            onChange={(e) => handleSelectChange('dependsOn', e.target.value)}
                            disabled={isReadOnly}
                        >
                            <MenuItem value="">
                                <em>Select Dependency</em>
                            </MenuItem>
                            {Array.isArray(milestoneOptions) && milestoneOptions.map((m: any) => (
                                <MenuItem key={m.id} value={m.id}>
                                    {m.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
        </div>
    );
};

const AddMilestoneForm = ({ owners, projects, handleClose, className = "max-w-[90%] mx-auto", prefillData, isConversion = false, opportunityId, onSuccess }: any) => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const location = useLocation();
    const { id } = useParams<{ id: string }>();

    const { data: project } = useAppSelector(state => state.createProject) as { data: Project | null }

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [milestones, setMilestones] = useState([])
    const [projectStartDate, setProjectStartDate] = useState("");
    const [projectEndDate, setProjectEndDate] = useState("");
    const [projectData, setProjectData] = useState<Project | null>(null);
    const [nextId, setNextId] = useState(1);
    const [isDelete, setIsDelete] = useState(false);
    const [savedMilestones, setSavedMilestones] = useState<any[]>([]);
    const isSubmittingRef = useRef(false);
    const [formData, setFormData] = useState({
        milestoneTitle: prefillData?.title?.replace(/@\[(.*?)\]\(\d+\)/g, '@$1')
            .replace(/#\[(.*?)\]\(\d+\)/g, '#$1') || '',
        owner: prefillData?.responsible_person?.id || "",
        startDate: "",
        endDate: "",
        duration: "",
        dependsOn: "",
        projectId: "",
    });

    useEffect(() => {
        const getMilestones = async () => {
            try {
                const projectId = project?.id ? String(project.id) : (id || "");
                const response = await dispatch(fetchMilestones({ token, baseUrl, id: projectId })).unwrap();
                setMilestones(response)
            } catch (error) {
                console.log(error)
            }
        }

        const fetchProjectData = async () => {
            if (project?.start_date && project?.end_date) {
                const startDate = new Date(project.start_date).toISOString().split('T')[0];
                const endDate = new Date(project.end_date).toISOString().split('T')[0];
                setProjectStartDate(startDate);
                setProjectEndDate(endDate);
                setProjectData(project);
            } else if (id) {
                try {
                    const response = await fetch(`https://${baseUrl}/project_managements/${id}.json`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.ok) {
                        const fetchedProject: Project = await response.json();
                        setProjectData(fetchedProject);

                        if (fetchedProject?.start_date && fetchedProject?.end_date) {
                            const startDate = new Date(fetchedProject.start_date).toISOString().split('T')[0];
                            const endDate = new Date(fetchedProject.end_date).toISOString().split('T')[0];
                            setProjectStartDate(startDate);
                            setProjectEndDate(endDate);
                        }
                    }
                } catch (error) {
                    console.log('Error fetching project:', error);
                }
            }
        }

        fetchProjectData();
        getMilestones();
    }, [project?.id, project?.start_date, project?.end_date, id, token, baseUrl])

    // Fetch project dates when project is selected in conversion mode
    useEffect(() => {
        if (isConversion && formData.projectId) {
            fetchProjectDataById(formData.projectId);
        }
    }, [formData.projectId, isConversion]);

    const fetchProjectDataById = async (projectId: string) => {
        try {
            const response = await fetch(`https://${baseUrl}/project_managements/${projectId}.json`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const fetchedProject: Project = await response.json();
                setProjectData(fetchedProject);

                if (fetchedProject?.start_date && fetchedProject?.end_date) {
                    const startDate = new Date(fetchedProject.start_date).toISOString().split('T')[0];
                    const endDate = new Date(fetchedProject.end_date).toISOString().split('T')[0];
                    setProjectStartDate(startDate);
                    setProjectEndDate(endDate);
                }

                // Fetch milestones for the selected project
                const milestonesResponse = await dispatch(fetchMilestones({ token, baseUrl, id: projectId })).unwrap();
                setMilestones(milestonesResponse);
            }
        } catch (error) {
            console.log('Error fetching project:', error);
        }
    };

    const validateForm = (data: any) => {
        toast.dismiss();
        if (!data.milestoneTitle) {
            toast.error('Milestone title is required.');
            return false;
        }
        if (!data.owner) {
            toast.error('Select milestone owner.');
            return false;
        }
        if (opportunityId && !data.projectId) {
            toast.error('Select a project.');
            return false;
        }
        if (!data.startDate) {
            toast.error('Milestone start date is required.');
            return false;
        }
        if (!data.endDate) {
            toast.error('Milestone end date is required.');
            return false;
        }
        if (data.startDate < projectStartDate || data.startDate > projectEndDate) {
            toast.error('Start date must be within project duration.');
            return false;
        }
        if (data.endDate < projectStartDate || data.endDate > projectEndDate) {
            toast.error('End date must be within project duration.');
            return false;
        }
        return true;
    };

    const createMilestonePayload = (data: any) => {
        const milestonePayload: any = {
            milestone: {
                title: data.milestoneTitle,
                status: 'open',
                owner_id: data.owner,
                start_date: data.startDate,
                end_date: data.endDate,
                depends_on_id: data.dependsOn,
                project_management_id: opportunityId
                    ? data.projectId
                    : location.pathname.includes('/milestones')
                        ? id
                        : project?.id,
            },
        };

        if (opportunityId) {
            milestonePayload.milestone.opportunity_id = opportunityId;
        }

        return milestonePayload;
    };

    const handleAddMilestone = async (e: any) => {
        e.preventDefault();
        if (isDelete) {
            setIsDelete(false);
            return;
        }
        toast.dismiss();

        if (!validateForm(formData)) return;
        if (isSubmittingRef.current) return;

        isSubmittingRef.current = true;
        const payload = createMilestonePayload(formData);

        try {
            await dispatch(createMilestone({ token, baseUrl, data: payload })).unwrap();
            toast.success('Milestone created successfully.');
            setSavedMilestones([...savedMilestones, { id: nextId, formData: { ...formData } }]);
            setFormData({
                milestoneTitle: '',
                owner: '',
                startDate: '',
                endDate: '',
                duration: '',
                dependsOn: '',
                projectId: '',
            });
            setNextId(nextId + 1);
            const projectId = project?.id ? String(project.id) : (id || "");
            await dispatch(fetchMilestones({ token, baseUrl, id: projectId })).unwrap();
        } catch (error) {
            console.log(error);
            toast.error('Error creating milestone.');
        } finally {
            isSubmittingRef.current = false;
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (isSubmittingRef.current) return;

        const isFormEmpty =
            !formData.milestoneTitle && !formData.owner && !formData.startDate && !formData.endDate;

        if (isDelete && isFormEmpty) {
            setSavedMilestones([]);
            handleClose();
            return;
        }

        toast.dismiss();

        if (!isDelete && !validateForm(formData)) return;
        if (isSubmittingRef.current) return;

        isSubmittingRef.current = true;
        const payload = createMilestonePayload(formData);

        try {
            if (!isDelete) {
                const response = await dispatch(createMilestone({ token, baseUrl, data: payload })).unwrap();

                // If onSuccess callback is provided (from ConvertModal), call it
                if (onSuccess && response?.id) {
                    onSuccess(response.id);
                    return;
                }
            }
            toast.dismiss();
            toast.success('Milestone created successfully.');
            const projectId = project?.id ? String(project.id) : (id || "");
            await dispatch(fetchMilestones({ token, baseUrl, id: projectId })).unwrap();
            setSavedMilestones([]);
            handleClose();
            window.location.reload();
        } catch (error) {
            console.log(error);
            const errorData = (error as any)?.response?.data;
            if (errorData) {
                Object.keys(errorData).forEach((key) => {
                    toast.error(`${key} ${errorData[key]}`);
                });
            } else {
                toast.error('Error creating milestone.');
            }
        } finally {
            isSubmittingRef.current = false;
            setIsDelete(false);
        }
    };

    const isFormEmpty =
        !formData.milestoneTitle && !formData.owner && !formData.startDate && !formData.endDate;

    return (
        <form className="pb-12 h-full text-[12px]" onSubmit={handleSubmit}>
            <div className={`h-[calc(100%-4rem)] overflow-y-auto pr-3 ${className}`}>
                {savedMilestones.map((m) => (
                    <AddMilestoneModal
                        key={m.id}
                        users={owners}
                        formData={m.formData}
                        setFormData={() => { }}
                        isReadOnly={true}
                        milestoneOptions={milestones}
                        hasSavedMilestones={savedMilestones.length > 0}
                        projectStartDate={project?.start_date || projectData?.start_date}
                        projectEndDate={project?.end_date || projectData?.end_date}
                        opportunityId={opportunityId}
                        projects={projects}
                        showProjectSelector={!!opportunityId}
                    />
                ))}
                {!isDelete && (
                    <AddMilestoneModal
                        users={owners}
                        formData={formData}
                        setFormData={setFormData}
                        setIsDelete={setIsDelete}
                        isReadOnly={false}
                        milestoneOptions={milestones}
                        hasSavedMilestones={savedMilestones.length > 0}
                        projectStartDate={project?.start_date || projectData?.start_date}
                        projectEndDate={project?.end_date || projectData?.end_date}
                        opportunityId={opportunityId}
                        projects={projects}
                        showProjectSelector={!!opportunityId}
                    />
                )}

                <div className="flex items-center justify-center gap-4 w-full bottom-0 bg-white mt-16">
                    <Button
                        type="submit"
                        size="lg"
                        className="bg-[#C72030] hover:bg-[#C72030] text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Add Milestone'}
                    </Button>

                    {isFormEmpty ? (
                        <Button
                            type="button"
                            size="lg"
                            variant="outline"
                            className="border-2 border-[#C72030] text-black w-max"
                            disabled={isSubmitting}
                            onClick={() => {
                                if (savedMilestones.length === 0) {
                                    setFormData({
                                        milestoneTitle: '',
                                        owner: '',
                                        startDate: '',
                                        endDate: '',
                                        duration: '',
                                        dependsOn: '',
                                        projectId: '',
                                    });
                                    handleClose();
                                } else {
                                    setSavedMilestones([]);
                                    handleClose();
                                }
                            }}
                        >
                            Cancel
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            size="lg"
                            variant="outline"
                            className="border-2 border-[#C72030] text-black w-max"
                            disabled={isSubmitting}
                            onClick={handleAddMilestone}
                        >
                            Save & Add New
                        </Button>
                    )}
                </div>
            </div>
        </form>
    )
}

export default AddMilestoneForm