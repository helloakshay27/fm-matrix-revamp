import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
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

const AddMilestoneForm = ({ owners, projects, handleClose, className = "max-w-[90%] mx-auto", prefillData, isConversion = false }: any) => {
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
    const [formData, setFormData] = useState({
        milestoneTitle: prefillData?.title?.replace(/@\[(.*?)\]\(\d+\)/g, '@$1')
            .replace(/#\[(.*?)\]\(\d+\)/g, '#$1') || '',
        owner: "",
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateDates = () => {
        if (!formData.startDate || !formData.endDate) return true;

        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        const projStart = new Date(projectStartDate);
        const projEnd = new Date(projectEndDate);

        if (startDate < projStart) {
            toast.error("Start date must be within project duration.");
            return false;
        }
        if (endDate > projEnd) {
            toast.error("End date must be within project duration.");
            return false;
        }
        if (endDate < startDate) {
            toast.error("End date must be after start date.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (isConversion && !formData.projectId) {
            toast.error("Please select a project.");
            return;
        }
        if (!formData.milestoneTitle) {
            toast.error("Milestone title is required.");
            return;
        }
        if (!formData.owner) {
            toast.error("Milestone owner is required.");
            return;
        }
        if (!formData.startDate) {
            toast.error("Start date is required.");
            return;
        }
        if (!formData.endDate) {
            toast.error("End date is required.");
            return;
        }

        // Validate dates are within project duration
        if (!validateDates()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                milestone: {
                    title: formData.milestoneTitle,
                    owner_id: formData.owner,
                    start_date: formData.startDate,
                    end_date: formData.endDate,
                    depends_on_id: formData.dependsOn,
                    status: "open",
                    project_management_id: isConversion
                        ? formData.projectId
                        : (location.pathname.includes("/milestones")
                            ? id
                            : (project?.id as string | number) || (projectData?.id as string | number)),
                },
            }

            await dispatch(createMilestone({ token, baseUrl, data: payload })).unwrap();
            toast.success("Milestone created successfully");
            handleClose();
        } catch (error) {
            console.log(error)
            toast.error((error as any)?.message || "Error creating milestone")
        } finally {
            setIsSubmitting(false)
        }
    };

    return (
        <form className="h-full" onSubmit={handleSubmit}>
            <div className={`h-[calc(100%-4rem)] overflow-y-auto pr-3 ${className}`}>
                {isConversion && (
                    <div className="flex flex-col gap-4 my-4">
                        <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                            <InputLabel shrink>Select Project*</InputLabel>
                            <Select
                                label="Select Project*"
                                name="projectId"
                                displayEmpty
                                sx={fieldStyles}
                                value={formData.projectId}
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>Select Project</em>
                                </MenuItem>
                                {projects?.map((project) => (
                                    <MenuItem key={project.id} value={project.id}>
                                        {project.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                )}

                <div className="mt-4 space-y-2">
                    <TextField
                        label="Milestone Title"
                        name="milestoneTitle"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                        value={formData.milestoneTitle}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col gap-4 my-4">
                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                        <InputLabel shrink>Milestone Owner</InputLabel>
                        <Select
                            label="Milestone Owner"
                            name="owner"
                            displayEmpty
                            sx={fieldStyles}
                            value={formData.owner}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>Select Milestone Owner</em>
                            </MenuItem>
                            {owners?.map((owner) => (
                                <MenuItem key={owner.id} value={owner.id}>
                                    {owner.full_name}
                                </MenuItem>
                            ))}
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
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
                                sx={{ mt: 1 }}
                                value={formData[field]}
                                onChange={handleChange}
                                inputProps={{
                                    min: projectStartDate,
                                    max: projectEndDate,
                                }}
                            />
                        </div>
                    ))}

                    <div className="w-[300px] space-y-2">
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

                <div className="flex flex-col gap-4 my-4">
                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                        <InputLabel shrink>Depends On</InputLabel>
                        <Select
                            label="Depends On"
                            name="dependsOn"
                            displayEmpty
                            sx={fieldStyles}
                            value={formData.dependsOn}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>Select Dependency</em>
                            </MenuItem>
                            {milestones?.map((milestone) => (
                                <MenuItem key={milestone.id} value={milestone.id}>
                                    {milestone.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="flex items-center justify-center">
                    <Button
                        type="submit"
                        size="lg"
                        className="bg-[#C72030] hover:bg-[#C72030] text-white"
                        disabled={isSubmitting}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default AddMilestoneForm