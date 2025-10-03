import {
    Dialog as MuiDialog,
    DialogTitle as MuiDialogTitle,
    DialogContent as MuiDialogContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Box,
    FormLabel,
    Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { X } from "lucide-react";
import { Button } from "./ui/button";

const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
        padding: { xs: "8px", sm: "10px", md: "12px" },
    },
};

interface User {
    id: string;
    full_name: string;
    employee_type: string;
}

interface FormData {
    description: string;
    priority: string;
    assignTo: string;
    deadline: string;
    estHours: string;
    estMinutes: string;
    observers: string[];
    focusMode: boolean;
}

interface CreateChatTaskProps {
    openTaskModal: boolean;
    setOpenTaskModal: (open: boolean) => void;
    onCreateTask?: (data: FormData & { message_id?: string }) => void;
    message?: { id: string; body: string };
}

const CreateChatTask = ({
    openTaskModal,
    setOpenTaskModal,
    onCreateTask,
    message,
}: CreateChatTaskProps) => {
    const dispatch = useAppDispatch();
    const [users, setUsers] = useState<User[]>([]);
    const [formData, setFormData] = useState<FormData>({
        description: "",
        priority: "",
        assignTo: "",
        deadline: "",
        estHours: "",
        estMinutes: "",
        observers: [],
        focusMode: false,
    });

    const fetchInternalUsers = async () => {
        try {
            const response = await dispatch(fetchFMUsers()).unwrap();
            setUsers(response.users.filter((user: User) => user.employee_type === "internal"));
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    useEffect(() => {
        fetchInternalUsers();

        if (message?.body) {
            setFormData((prev) => ({ ...prev, description: message.body }));
        }
    }, [message]);

    const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        const submissionData = {
            ...formData,
            message_id: message?.id,
        };

        onCreateTask?.(submissionData);
        setFormData({
            description: "",
            priority: "",
            assignTo: "",
            deadline: "",
            estHours: "",
            estMinutes: "",
            observers: [],
            focusMode: false,
        });
        setOpenTaskModal(false);
    };

    return (
        <MuiDialog
            open={openTaskModal}
            onClose={() => setOpenTaskModal(false)}
            maxWidth="md"
            fullWidth
        >
            <MuiDialogContent
                className="w-full max-h-[90vh] overflow-y-auto bg-white"
                sx={{ width: "100%" }}
            >
                <div className="flex items-center justify-between">
                    <MuiDialogTitle
                        sx={{
                            fontSize: "18px",
                            fontWeight: 550,
                            color: "#000000",
                            padding: "12px 0px",
                        }}
                    >
                        NEW TASK
                    </MuiDialogTitle>
                    <button
                        onClick={() => setOpenTaskModal(false)}
                        className="p-1 rounded-md transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 gap-6">
                        <TextField
                            label="Description"
                            placeholder="Enter description"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                "&.MuiFormControl-root:has(.MuiInputBase-multiline)": {
                                    margin: "0 !important",
                                },
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
                                "& .MuiInputBase-input": { resize: "none !important" },
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                            <InputLabel shrink>Priority*</InputLabel>
                            <Select
                                value={formData.priority}
                                onChange={(e) => handleChange("priority", e.target.value as string)}
                                label="Priority"
                                notched
                            >
                                <MenuItem value="high">High</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="low">Low</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                            <InputLabel shrink>Assign To*</InputLabel>
                            <Select
                                value={formData.assignTo}
                                onChange={(e) => handleChange("assignTo", e.target.value as string)}
                                label="Assign To"
                                notched
                            >
                                <MenuItem value="">Select Assign To</MenuItem>
                                {users.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.full_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Deadline"
                            type="date"
                            fullWidth
                            variant="outlined"
                            value={formData.deadline}
                            onChange={(e) => handleChange("deadline", e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: fieldStyles }}
                        />

                        <div className="sm:col-span-1 flex gap-2">
                            <TextField
                                label="Est Time (hours)"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={formData.estHours}
                                onChange={(e) => handleChange("estHours", e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
                            />
                            <TextField
                                label="Est Time (minutes)"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={formData.estMinutes}
                                onChange={(e) => handleChange("estMinutes", e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="sm:col-span-3">
                            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                                <InputLabel shrink>Observer</InputLabel>
                                <Select
                                    multiple
                                    value={formData.observers}
                                    onChange={(e) => handleChange("observers", e.target.value as string[])}
                                    renderValue={(selected) => (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: 4,
                                                maxHeight: 50,
                                                overflowY: "auto",
                                            }}
                                        >
                                            {selected.map((id) => {
                                                const user = users.find((u) => u.id === id);
                                                return (
                                                    <Chip
                                                        key={id}
                                                        label={user?.full_name || id}
                                                        size="small"
                                                    />
                                                );
                                            })}
                                        </div>
                                    )}
                                    notched
                                >
                                    {users.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.full_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <FormLabel component="legend" sx={{ minWidth: "80px" }}>
                                Focus Mode
                            </FormLabel>
                            <Switch
                                checked={formData.focusMode}
                                onChange={(e) => handleChange("focusMode", (e.target as HTMLInputElement).checked)}
                                color="error"
                            />
                        </Box>
                    </div>

                    <div className="flex justify-center gap-2 mt-4">
                        <Button variant="outline" onClick={() => setOpenTaskModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>Create Task</Button>
                    </div>
                </div>
            </MuiDialogContent>
        </MuiDialog>
    );
};

export default CreateChatTask;