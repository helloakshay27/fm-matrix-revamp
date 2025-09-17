// import {
//     Dialog,
//     DialogContent,
//     FormControl,
//     InputLabel,
//     MenuItem,
//     Select,
//     Slide,
//     TextField,
// } from "@mui/material";
// import { TransitionProps } from "@mui/material/transitions";
// import { forwardRef } from "react";
// import { Button } from "./ui/button";

// const Transition = forwardRef(function Transition(
//     props: TransitionProps & { children: React.ReactElement },
//     ref: React.Ref<unknown>
// ) {
//     return <Slide direction="left" ref={ref} {...props} />;
// });

// const fieldStyles = {
//     height: { xs: 28, sm: 36, md: 45 },
//     "& .MuiInputBase-input, & .MuiSelect-select": {
//         padding: { xs: "8px", sm: "10px", md: "12px" },
//     },
// };

// const AddMilestoneModal = ({ openDialog, handleCloseDialog, handleSubmit }) => {
//     return (
//         <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
//             <DialogContent
//                 className="w-[30rem] fixed right-0 top-0 h-full rounded-none bg-[#fff]"
//                 style={{ margin: 0 }}
//                 sx={{
//                     padding: "0 !important"
//                 }}
//             >
//                 <form className="h-full" onSubmit={handleSubmit}>
//                     <div className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3">
//                         <div className="mt-4 space-y-2">
//                             <TextField
//                                 label="Milestone Title"
//                                 name="milestoneTitle"
//                                 fullWidth
//                                 variant="outlined"
//                                 InputLabelProps={{ shrink: true }}
//                                 InputProps={{ sx: fieldStyles }}
//                                 sx={{ mt: 1 }}
//                             />
//                         </div>

//                         <div className="flex flex-col gap-4 my-4">
//                             <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//                                 <InputLabel shrink>Milestone Owner</InputLabel>
//                                 <Select
//                                     label="Milestone Owner"
//                                     name="milestoneOwner"
//                                     displayEmpty
//                                     sx={fieldStyles}
//                                 >
//                                     <MenuItem value="">
//                                         <em>Select Milestone Owner</em>
//                                     </MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </div>

//                         <div className="flex gap-2 mt-4 text-[12px]">
//                             {["startDate", "endDate"].map((field) => (
//                                 <div key={field} className="w-full space-y-2">
//                                     <TextField
//                                         label={field === 'startDate' ? "Start Date" : "End Date"}
//                                         type="date"
//                                         fullWidth
//                                         variant="outlined"
//                                         InputLabelProps={{ shrink: true }}
//                                         InputProps={{ sx: fieldStyles }}
//                                         sx={{ mt: 1 }}
//                                     />
//                                 </div>
//                             ))}

//                             <div className="w-[300px] space-y-2">
//                                 <TextField
//                                     label="Duration"
//                                     name="duration"
//                                     disabled
//                                     fullWidth
//                                     variant="outlined"
//                                     InputLabelProps={{ shrink: true }}
//                                     InputProps={{ sx: fieldStyles }}
//                                     sx={{ mt: 1 }}
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex flex-col gap-4 my-4">
//                             <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//                                 <InputLabel shrink>Depends On</InputLabel>
//                                 <Select
//                                     label="Depends On"
//                                     name="dependsOn"
//                                     displayEmpty
//                                     sx={fieldStyles}
//                                 >
//                                     <MenuItem value="">
//                                         <em>Select Dependancy</em>
//                                     </MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </div>
//                         <div className="flex items-center justify-center">
//                             <Button
//                                 type="submit"
//                                 size="lg"
//                                 className="bg-[#C72030] hover:bg-[#C72030] text-white"

//                             >
//                                 Submit
//                             </Button>
//                         </div>
//                     </div>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }

// export default AddMilestoneModal



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
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";
import { Button } from "./ui/button";

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

const AddMilestoneModal = ({ openDialog, handleCloseDialog, handleSubmit }) => {
    return (
        <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
            <DialogContent
                className="w-[30rem] fixed right-0 top-0 h-full rounded-none bg-[#fff]"
                style={{ margin: 0 }}
                sx={{
                    padding: "0 !important"
                }}
            >
                <Typography
                    variant="h6"
                    align="center"
                    fontSize={"18px"}
                    sx={{ mt: 2, mb: 2 }}
                >
                    Add Milestone
                </Typography>

                <hr className="border border-[#E95420] my-4" />
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
                            />
                        </div>

                        <div className="flex flex-col gap-4 my-4">
                            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                                <InputLabel shrink>Milestone Owner</InputLabel>
                                <Select
                                    label="Milestone Owner"
                                    name="milestoneOwner"
                                    displayEmpty
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="">
                                        <em>Select Milestone Owner</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className="flex gap-2 mt-4 text-[12px]">
                            {["startDate", "endDate"].map((field) => (
                                <div key={field} className="w-full space-y-2">
                                    <TextField
                                        label={field === 'startDate' ? "Start Date" : "End Date"}
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
                                    name="duration"
                                    disabled
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ sx: fieldStyles }}
                                    sx={{ mt: 1 }}
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
                                >
                                    <MenuItem value="">
                                        <em>Select Dependancy</em>
                                    </MenuItem>
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
            </DialogContent>
        </Dialog>
    )
}

export default AddMilestoneModal