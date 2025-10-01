import {
    Dialog,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Slide,
    TextField,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { X } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { createProject } from "@/store/slices/projectManagementSlice";

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

const ProjectCreateModal = ({ openDialog, handleCloseDialog, owners, teams, projectTypes, tags }) => {
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        title: "",
        isChannel: false,
        isTemplate: false,
        description: "",
        owner: "",
        startDate: "",
        endDate: "",
        duration: "",
        team: "",
        type: "",
        priority: "",
        tags: []
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            project_management: {
                title: formData.title,
                description: formData.description,
                start_date: formData.startDate,
                end_date: formData.endDate,
                status: "active",
                owner_id: formData.owner,
                priority: formData.priority,
                active: true,
                is_template: formData.isTemplate,
                create_channel: formData.isChannel,
                project_team_id: formData.team,
                project_type_id: formData.type,
            },
            task_tag_ids: formData.tags
        };
        try {
            await dispatch(createProject({ token, baseUrl, data: payload })).unwrap();
            toast.success("Project created successfully");
            handleCloseDialog();
        } catch (error) {
            console.error("Error creating project:", error);
            toast.error(error.message || "Failed to create project");
        }
    };

    return (
        <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
            <DialogContent
                className="w-[30rem] fixed right-0 top-0 rounded-none bg-[#fff]"
                style={{ margin: 0 }}
                sx={{
                    padding: "0 !important"
                }}
            >
                <h3 className="text-[14px] font-medium text-center mt-8">New Project</h3>
                <X
                    className="absolute top-[26px] right-8 cursor-pointer"
                    onClick={handleCloseDialog}
                />

                <hr className="border border-[#E95420] mt-4" />
                <form className="h-full" onSubmit={handleSubmit}>
                    <div className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3">
                        <div className="mt-4 space-y-2">
                            <TextField
                                label="Project Title"
                                name="title"
                                placeholder="Enter Project Title"
                                fullWidth
                                variant="outlined"
                                value={formData.title}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
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
                                        checked={formData[name]}
                                        onChange={handleChange}
                                        className="mx-2 my-0.5"
                                    />
                                    <label htmlFor={id} className="text-sm">
                                        Create a {label}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 space-y-2 h-[100px]">
                            <TextField
                                label="Description*"
                                name="description"
                                placeholder=""
                                fullWidth
                                variant="outlined"
                                multiline
                                minRows={2}
                                value={formData.description}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        height: "auto !important",
                                        padding: "2px !important",
                                        display: "flex",
                                    },
                                    "& .MuiInputBase-input[aria-hidden='true']": {
                                        flex: 0,
                                        width: 0,
                                        height: 0,
                                        padding: "0 !important",
                                        margin: 0,
                                        display: "none",
                                    },
                                    "& .MuiInputBase-input": {
                                        resize: "none !important",
                                    },
                                }}
                            />
                        </div>

                        <div className="flex items-start gap-4 mt-3">
                            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                                <InputLabel shrink>Select Owner*</InputLabel>
                                <Select
                                    label="Select Owner*"
                                    name="owner"
                                    value={formData.owner}
                                    onChange={handleChange}
                                    displayEmpty
                                    sx={fieldStyles}
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
                                        value={formData[field]}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{ sx: fieldStyles }}
                                        sx={{ mt: 1 }}
                                    />
                                </div>
                            ))}

                            <div className="w-[300px] space-y-2">
                                <TextField
                                    label="Duration"
                                    name="duration"
                                    value={formData.duration}
                                    fullWidth
                                    disabled
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ sx: fieldStyles }}
                                    sx={{ mt: 1 }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 my-5">
                            <div>
                                <div className="flex justify-end">
                                    <label
                                        className="text-[12px] text-[red] cursor-pointer"
                                    >
                                        <i>Create new team</i>
                                    </label>
                                </div>
                                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                                    <InputLabel shrink>Select Team*</InputLabel>
                                    <Select
                                        label="Select Team*"
                                        name="team"
                                        value={formData.team}
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={fieldStyles}
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
                                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                                    <InputLabel shrink>Project Type*</InputLabel>
                                    <Select
                                        label="Project Type*"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={fieldStyles}
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
                                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                                    <InputLabel shrink>Priority*</InputLabel>
                                    <Select
                                        label="Priority*"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={fieldStyles}
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
                                <div
                                    className="text-[12px] text-[red] text-right cursor-pointer mt-2"
                                >
                                    <i>Create new tag</i>
                                </div>
                                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                                    <InputLabel shrink>Tags*</InputLabel>
                                    <Select
                                        label="Tags*"
                                        name="tags"
                                        multiple
                                        value={formData.tags}
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={fieldStyles}
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

                            <div className="flex justify-center gap-3 mb-4">
                                <Button
                                    variant="outline"
                                    onClick={handleCloseDialog}
                                    className="px-6"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-green-500 hover:bg-green-600 text-white px-6"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ProjectCreateModal