import {
    Dialog,
    DialogContent,
    Slide,
    Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";
import AddMilestoneForm from "./AddMilestoneForm";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const AddMilestoneModal = ({ openDialog, handleCloseDialog, owners }) => {
    const handleClose = () => {
        handleCloseDialog();
    }

    return (
        <Dialog open={openDialog} onClose={handleClose} TransitionComponent={Transition}>
            <DialogContent
                className="w-[30rem] fixed right-0 top-0 h-full rounded-none bg-[#fff]"
                style={{ margin: 0 }}
                sx={{
                    padding: "0 !important",
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
                <AddMilestoneForm owners={owners} handleClose={handleClose} />
            </DialogContent>
        </Dialog>
    );
};

export default AddMilestoneModal;