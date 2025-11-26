import {
    Dialog,
    DialogContent,
    Slide,
    Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";
import EditMilestoneForm from "./EditMilestoneForm";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

interface EditMilestoneModalProps {
    openDialog: boolean;
    handleCloseDialog: () => void;
    owners: any[];
    milestoneData: {
        id?: string;
        title?: string;
        responsible_person?: string;
        start_date?: string;
        end_date?: string;
        duration?: string;
        depends_on?: string;
    };
    onUpdate?: () => void;
}

const EditMilestoneModal = ({ 
    openDialog, 
    handleCloseDialog, 
    owners, 
    milestoneData,
    onUpdate 
}: EditMilestoneModalProps) => {
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
                    Edit Milestone
                </Typography>

                <hr className="border border-[#E95420] my-4" />
                <EditMilestoneForm 
                    owners={owners} 
                    handleClose={handleClose} 
                    milestoneData={milestoneData}
                    onUpdate={onUpdate}
                />
            </DialogContent>
        </Dialog>
    );
};

export default EditMilestoneModal;
