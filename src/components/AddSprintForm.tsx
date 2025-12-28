import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useAppDispatch } from "@/store/hooks";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createSprint, fetchSprints } from "@/store/slices/sprintSlice";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

// Unified calculateDuration function
const calculateDuration = (startDate: string, endDate: string) => {
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
            if (endDay < startDay) return 'Invalid: End date before start date';

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
        if (endDay < startDay) return 'Invalid: End date before start date';

        const days = Math.floor((endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return `${days}d : 0h : 0m`;
    }
};

interface SprintFormData {
    title: string;
    ownerId: string;
    startDate: string;
    endDate: string;
    priority: string;
}

interface AddSprintFormProps {
    owners: any[];
    handleClose: () => void;
    onSubmit?: (data: any) => void;
}

interface SavedSprint {
    id: number;
    formData: SprintFormData;
}

const AddSprintForm = ({ owners, handleClose, onSubmit }: AddSprintFormProps) => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token") || "";
    const baseUrl = localStorage.getItem("baseUrl") || "";

    const { loading: createLoading } = useSelector(
        (state: RootState) => state.createSprint
    );

    const [nextId, setNextId] = useState(1);
    const [formData, setFormData] = useState<SprintFormData>({
        title: "",
        ownerId: "",
        startDate: "",
        endDate: "",
        priority: "",
    });
    const [savedSprints, setSavedSprints] = useState<SavedSprint[]>([]);
    const [isDelete, setIsDelete] = useState(false);
    const isSubmittingRef = useRef(false);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (name: string, value: any) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDeleteSprint = (id: number) => {
        setSavedSprints(savedSprints.filter((sprint) => sprint.id !== id));
    };

    const createSprintPayload = (data: SprintFormData) => ({
        sprint: {
            name: data.title,
            owner_id: data.ownerId,
            start_date: data.startDate,
            end_date: data.endDate,
            priority: data.priority,
        },
    });

    const resetForm = () => {
        setFormData({
            title: "",
            ownerId: "",
            startDate: "",
            endDate: "",
            priority: "",
        });
    };

    const handleAddSprints = async (e: any) => {
        e.preventDefault();

        if (isDelete) {
            setIsDelete(false);
            resetForm();
            return;
        }

        if (
            !formData.title ||
            !formData.ownerId ||
            !formData.startDate ||
            !formData.endDate ||
            !formData.priority
        ) {
            toast.error("Please fill all required fields.");
            return;
        }

        const payload = createSprintPayload(formData);

        try {
            await dispatch(createSprint({ token, baseUrl, data: payload })).unwrap();
            toast.success("Sprint created successfully.");

            // Save to local state
            setSavedSprints([...savedSprints, { id: nextId, formData }]);
            setNextId(nextId + 1);

            // Reset form for new entry
            resetForm();

            // Refresh sprint list
            await dispatch(fetchSprints({ token, baseUrl })).unwrap();
        } catch (error) {
            console.error("Error creating sprint:", error);
            toast.error("Error creating sprint.");
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (isSubmittingRef.current) return;

        const isFormEmpty =
            !formData.title &&
            !formData.ownerId &&
            !formData.startDate &&
            !formData.endDate &&
            !formData.priority;

        if (isDelete && isFormEmpty) {
            handleClose();
            return;
        }

        if (
            !isDelete &&
            (!formData.title ||
                !formData.ownerId ||
                !formData.startDate ||
                !formData.endDate ||
                !formData.priority)
        ) {
            toast.error("Please fill all required fields.");
            return;
        }

        isSubmittingRef.current = true;

        const payload = createSprintPayload(formData);

        try {
            if (!isDelete) {
                await dispatch(createSprint({ token, baseUrl, data: payload })).unwrap();
            }
            toast.success("Sprint created successfully.");
            await dispatch(fetchSprints({ token, baseUrl }));
            handleClose();
        } catch (error) {
            console.error("Error submitting sprint:", error);
            toast.error("Error submitting sprint.");
        } finally {
            isSubmittingRef.current = false;
        }
    };

    const isFormEmpty =
        !formData.title &&
        !formData.ownerId &&
        !formData.startDate &&
        !formData.endDate &&
        !formData.priority;

    return (
        <form className="h-full" onSubmit={handleSubmit}>
            <div className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3">
                {/* Display saved sprints (read-only) */}
                {savedSprints.map((sprint) => (
                    <div
                        key={sprint.id}
                        className="flex flex-col relative justify-start gap-4 w-full bottom-0 py-3 bg-white mb-6 border-b border-gray-200"
                    >
                        <DeleteOutlinedIcon
                            onClick={() => handleDeleteSprint(sprint.id)}
                            className="absolute top-3 right-3 text-red-600 cursor-pointer"
                        />
                        <div className="mt-2 space-y-2">
                            <label className="block text-sm font-medium">Sprint Title</label>
                            <input
                                type="text"
                                value={sprint.formData.title}
                                className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[12px] bg-gray-100"
                                disabled
                            />
                        </div>
                        <div className="flex items-start gap-4 mt-1 text-[12px]">
                            <div className="w-1/3 space-y-2">
                                <label className="block">Start Date</label>
                                <input
                                    type="date"
                                    value={sprint.formData.startDate}
                                    className="w-full border outline-none border-gray-300 p-2 text-[12px] bg-gray-100"
                                    disabled
                                />
                            </div>
                            <div className="w-1/3 space-y-2">
                                <label className="block">End Date</label>
                                <input
                                    type="date"
                                    value={sprint.formData.endDate}
                                    className="w-full border outline-none border-gray-300 p-2 text-[12px] bg-gray-100"
                                    disabled
                                />
                            </div>
                            <div className="w-1/3 space-y-2">
                                <label className="block">Duration</label>
                                <input
                                    type="text"
                                    value={calculateDuration(sprint.formData.startDate, sprint.formData.endDate)}
                                    className="w-full bg-gray-200 border outline-none border-gray-300 p-2 text-[12px]"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Active form for new sprint */}
                {!isDelete && (
                    <div className="flex flex-col relative justify-start gap-4 w-full bottom-0 py-3 bg-white mb-10">
                        {savedSprints.length > 0 && (
                            <DeleteOutlinedIcon
                                onClick={() => {
                                    resetForm();
                                    setIsDelete(true);
                                }}
                                className="absolute top-3 right-3 text-red-600 cursor-pointer"
                            />
                        )}
                        <div className="mt-2 space-y-2">
                            <label className="block">
                                Sprint Title <span className="text-red-600">*</span>
                            </label>
                            <TextField
                                name="title"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
                                sx={{ mt: 1 }}
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter Sprint Title"
                            />
                        </div>

                        <div className="flex flex-col gap-4 my-4">
                            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                                <InputLabel shrink>Sprint Owner *</InputLabel>
                                <Select
                                    label="Sprint Owner"
                                    name="ownerId"
                                    displayEmpty
                                    sx={fieldStyles}
                                    value={formData.ownerId}
                                    onChange={(e) => handleSelectChange("ownerId", e.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>Select Owner</em>
                                    </MenuItem>
                                    {owners?.map((owner) => (
                                        <MenuItem key={owner.id} value={owner.id}>
                                            {owner.full_name || `${owner.firstname} ${owner.lastname}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="flex gap-2 mt-4 text-[12px]">
                            <div className="w-1/3 space-y-2">
                                <label className="block">
                                    Start Date <span className="text-red-600">*</span>
                                </label>
                                <TextField
                                    type="date"
                                    name="startDate"
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ sx: fieldStyles }}
                                    sx={{ mt: 1 }}
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    inputProps={{
                                        min: new Date().toISOString().split('T')[0]
                                    }}
                                />
                            </div>

                            <div className="w-1/3 space-y-2">
                                <label className="block">
                                    End Date <span className="text-red-600">*</span>
                                </label>
                                <TextField
                                    type="date"
                                    name="endDate"
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ sx: fieldStyles }}
                                    sx={{ mt: 1 }}
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    inputProps={{
                                        min: formData.startDate || new Date().toISOString().split('T')[0]
                                    }}
                                />
                            </div>

                            <div className="w-1/3 space-y-2">
                                <label className="block">Duration</label>
                                <TextField
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
                                <InputLabel shrink>Priority *</InputLabel>
                                <Select
                                    label="Priority"
                                    name="priority"
                                    displayEmpty
                                    sx={fieldStyles}
                                    value={formData.priority}
                                    onChange={(e) => handleSelectChange("priority", e.target.value)}
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
                    </div>
                )}

                <div className="flex items-center justify-center gap-4 w-full bottom-0 py-4 bg-white mt-10">
                    <Button
                        type="submit"
                        size="lg"
                        className="bg-[#C72030] hover:bg-[#C72030] text-white"
                        disabled={createLoading}
                    >
                        {createLoading ? "Submitting..." : "Submit"}
                    </Button>

                    {isFormEmpty && !isDelete ? (
                        <Button
                            type="button"
                            size="lg"
                            variant="outline"
                            className="border-[#C72030] text-black hover:bg-gray-50"
                            onClick={() => {
                                if (savedSprints.length === 0) {
                                    resetForm();
                                    handleClose();
                                } else {
                                    handleClose();
                                }
                            }}
                            disabled={createLoading}
                        >
                            Cancel
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            size="lg"
                            variant="outline"
                            className="border-[#C72030] text-black hover:bg-gray-50"
                            onClick={handleAddSprints}
                            disabled={createLoading}
                        >
                            Save & Add New
                        </Button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default AddSprintForm;
