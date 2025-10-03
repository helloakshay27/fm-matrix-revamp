import {
    Dialog,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Slide,
    TextField,
    Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createMilestone } from "@/store/slices/projectMilestoneSlice";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

const AddMilestoneForm = ({ owners, handleClose }) => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const location = useLocation();
    const { id } = useParams();

    const { data: project } = useAppSelector(state => state.createProject)

    const [formData, setFormData] = useState({
        milestoneTitle: "",
        owner: "",
        startDate: "",
        endDate: "",
        duration: "",
        dependsOn: "",
    });

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
            const payload = {
                milestone: {
                    title: formData.milestoneTitle,
                    owner_id: formData.owner,
                    start_date: formData.startDate,
                    end_date: formData.endDate,
                    depends_on_id: formData.dependsOn,
                    project_management_id: location.pathname.includes("/milestones")
                        ? id
                        : project?.id,
                },
            }

            await dispatch(createMilestone({ token, baseUrl, data: payload })).unwrap();
            toast.success("Milestone created successfully");
            handleClose();
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    };

    return (
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
                            {owners.map((owner) => (
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
                            value={formData.duration}
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
                            {/* Add dependency options here if available */}
                        </Select>
                    </FormControl>
                </div>
                <div className="flex items-center justify-center">
                    <Button
                        type="submit"
                        size="lg"
                        className="bg-[#C72030] hover:bg-[#C72030] text-white"
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default AddMilestoneForm