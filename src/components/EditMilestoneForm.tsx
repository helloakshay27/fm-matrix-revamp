import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { fetchMilestones, updateMilestoneStatus } from "@/store/slices/projectMilestoneSlice";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

interface EditMilestoneFormProps {
    owners: any[];
    handleClose: () => void;
    milestoneData: {
        id?: string;
        title?: string;
        description?: string;
        owner_id?: string;
        start_date?: string;
        end_date?: string;
        duration?: string;
        depends_on_id?: string;
    };
    onUpdate?: () => void;
}

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

const EditMilestoneForm = ({ owners, handleClose, milestoneData, onUpdate }: EditMilestoneFormProps) => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const location = useLocation();
    const { id } = useParams();

    const { data: project } = useAppSelector(state => state.createProject)

    const [milestones, setMilestones] = useState([])
    const [formData, setFormData] = useState({
        milestoneTitle: milestoneData.title || "",
        description: milestoneData.description || "",
        owner: milestoneData.owner_id || "",
        startDate: milestoneData.start_date.split("T")[0] || "",
        endDate: milestoneData.end_date.split("T")[0] || "",
        duration: milestoneData.duration || "",
        dependsOn: milestoneData.depends_on_id || "",
    });

    const quillRef = useRef<HTMLDivElement>(null);
    const quillEditorRef = useRef<Quill | null>(null);

    // Initialize Quill editor
    useEffect(() => {
        if (quillRef.current && !quillEditorRef.current) {
            quillEditorRef.current = new Quill(quillRef.current, {
                theme: "snow",
                placeholder: "Type description...",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        ["blockquote"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link"],
                        ["clean"],
                    ],
                },
            });

            // Set initial description if exists
            if (formData.description) {
                quillEditorRef.current.root.innerHTML = formData.description;
            }

            // Handle text changes
            quillEditorRef.current.on("text-change", () => {
                const htmlContent = quillEditorRef.current?.root.innerHTML;
                setFormData((prev) => ({ ...prev, description: htmlContent || "" }));
            });
        }
    }, []);

    useEffect(() => {
        const getMilestones = async () => {
            try {
                const response = await dispatch(fetchMilestones({ token, baseUrl, id: project?.id ? project.id : id })).unwrap();
                setMilestones(response)
            } catch (error) {
                console.log(error)
            }
        }

        getMilestones()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // TODO: Replace with actual API call when available
            const payload = {
                milestone: {
                    title: formData.milestoneTitle,
                    description: formData.description || '',
                    owner_id: formData.owner,
                    start_date: formData.startDate,
                    end_date: formData.endDate,
                    depends_on_id: formData.dependsOn,
                },
            }

            await dispatch(updateMilestoneStatus({ token, baseUrl, id: milestoneData.id, payload })).unwrap();
            toast.success("Milestone updated successfully");
            if (onUpdate) {
                onUpdate();
            }
            handleClose();
        } catch (error) {
            console.log(error)
            toast.error(String(error) || "Failed to update milestone")
        }
    };

    return (
        <>
            <form className="h-full" onSubmit={handleSubmit}>
                <div className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3">
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

                    <div className="mt-4 space-y-2">
                        <Typography variant="subtitle2" className="font-medium">
                            Description
                        </Typography>
                        <div
                            ref={quillRef}
                            style={{
                                border: "1px solid rgba(0, 0, 0, 0.23)",
                                borderRadius: "4px",
                                minHeight: "150px",
                            }}
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
                                />
                            </div>
                        ))}

                        <div className="w-[500px] space-y-2">
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
                        >
                            Update
                        </Button>
                    </div>
                </div>
            </form>
            <style>{`
        .ql-toolbar {
            border-top: 1px solid rgba(0, 0, 0, 0.23) !important;
            border-left: 1px solid rgba(0, 0, 0, 0.23) !important;
            border-right: 1px solid rgba(0, 0, 0, 0.23) !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
            border-radius: 4px 4px 0 0;
            background-color: #fafafa;
            margin: 0 !important;
            padding: 5px !important;
        }

        .ql-container {
            border-bottom: 1px solid rgba(0, 0, 0, 0.23) !important;
            border-left: 1px solid rgba(0, 0, 0, 0.23) !important;
            border-right: 1px solid rgba(0, 0, 0, 0.23) !important;
            border-radius: 0 0 4px 4px;
            font-family: "Roboto", "Helvetica", "Arial", sans-serif;
            margin: 0 !important;
        }

        .ql-editor {
            padding: 12px 14px;
            font-size: 14px;
            line-height: 1.5;
            min-height: 150px;
        }

        .ql-editor.ql-blank::before {
            color: rgba(0, 0, 0, 0.6);
            font-style: normal;
        }

        .ql-toolbar button:hover {
            color: #01569E;
        }

        .ql-toolbar button.ql-active {
            color: #01569E;
        }
        `}</style>
        </>
    )
}

export default EditMilestoneForm
