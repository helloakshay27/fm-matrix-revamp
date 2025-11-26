import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useAppDispatch } from "@/store/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

interface AddSprintFormProps {
    owners: any[];
    handleClose: () => void;
    onSubmit?: (data: any) => void;
}

const AddSprintForm = ({ owners, handleClose, onSubmit }: AddSprintFormProps) => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const [formData, setFormData] = useState({
        sprintTitle: "",
        sprintOwner: "",
        startDate: "",
        endDate: "",
        duration: "",
        priority: "",
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
                sprint: {
                    title: formData.sprintTitle,
                    owner_id: formData.sprintOwner,
                    start_date: formData.startDate,
                    end_date: formData.endDate,
                    priority: formData.priority,
                    status: "active",
                },
            }

            // TODO: Replace with actual API call when available
            // await dispatch(createSprint({ token, baseUrl, data: payload })).unwrap();
            
            if (onSubmit) {
                onSubmit(payload);
            }
            
            toast.success("Sprint created successfully");
            handleClose();
        } catch (error) {
            console.log(error)
            toast.error(String(error) || "Failed to create sprint")
        }
    };

    return (
        <form className="h-full" onSubmit={handleSubmit}>
            <div className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3">
                <div className="mt-4 space-y-2">
                    <TextField
                        label="Sprint Title"
                        name="sprintTitle"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                        value={formData.sprintTitle}
                        onChange={handleChange}
                        placeholder="Enter Sprint Title"
                    />
                </div>

                <div className="flex flex-col gap-4 my-4">
                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                        <InputLabel shrink>Sprint Owner</InputLabel>
                        <Select
                            label="Sprint Owner"
                            name="sprintOwner"
                            displayEmpty
                            sx={fieldStyles}
                            value={formData.sprintOwner}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>Select Owner</em>
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
                        <InputLabel shrink>Priority</InputLabel>
                        <Select
                            label="Priority"
                            name="priority"
                            displayEmpty
                            sx={fieldStyles}
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>Select...</em>
                            </MenuItem>
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="low">Low</MenuItem>
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

export default AddSprintForm
