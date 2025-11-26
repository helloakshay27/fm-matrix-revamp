import {
    Dialog,
    DialogContent,
    Slide,
    Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";
import AddSprintForm from "./AddSprintForm";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

interface AddSprintModalProps {
    openDialog: boolean;
    handleCloseDialog: () => void;
    owners: any[];
    onSubmit?: (data: any) => void;
}

const AddSprintModal = ({ openDialog, handleCloseDialog, owners, onSubmit }: AddSprintModalProps) => {
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
                    New Sprints
                </Typography>

                <hr className="border border-[#E95420] my-4" />
                <AddSprintForm owners={owners} handleClose={handleClose} onSubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    );
};

export default AddSprintModal;
