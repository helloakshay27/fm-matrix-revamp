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
import { forwardRef } from "react";

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

const ProjectCreateModal = ({ openDialog, handleCloseDialog, handleSubmit }) => {
    return (
        <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
            <DialogContent
                className="w-[30rem] fixed right-0 top-0 h-full rounded-none bg-[#fff]"
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
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: fieldStyles }}
                                sx={{ mt: 1 }}
                            />
                        </div>

                        <div className="flex justify-between my-4">
                            {["createChannel", "createTemplate"].map((name) => (
                                <div key={name} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={name}
                                        className="mx-2 my-0.5"
                                    />
                                    <label htmlFor={name} className="text-sm">
                                        Create a {name === "createChannel" ? "Channel" : "Template"}
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
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="">
                                        <em>Select Owner</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className="flex gap-2 mt-4 text-[12px]">
                            {["startDate", "endDate"].map((field) => (
                                <div key={field} className="w-full space-y-2">
                                    <TextField
                                        label={field === "startDate" ? "Start Date" : "End Date"}
                                        type="date"
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
                                        displayEmpty
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="">
                                            <em>Select Team</em>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            <div className="flex gap-4">
                                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                                    <InputLabel shrink>Project Type*</InputLabel>
                                    <Select
                                        label="Project Type*"
                                        name="projectType"
                                        displayEmpty
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="">
                                            <em>Select Project Type</em>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                                    <InputLabel shrink>Priority*</InputLabel>
                                    <Select
                                        label="Priority*"
                                        name="priority"
                                        displayEmpty
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="">
                                            <em>Select Priority</em>
                                        </MenuItem>
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
                                        displayEmpty
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="">
                                            <em>Select Tags</em>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            <div className="flex items-center justify-center gap-3">
                                <button
                                    type="button"
                                    className="border-2 border-red-500 px-4 py-2 text-black w-[100px]"
                                >
                                    Save
                                </button>
                                <button
                                    type="submit"
                                    className="border-2 border-red-500 px-4 py-2 text-black w-max"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ProjectCreateModal