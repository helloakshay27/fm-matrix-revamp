import { forwardRef } from "react";
import { Dialog, DialogTitle, DialogContent, Slide } from "@mui/material";
import { X } from "lucide-react";
import ProjectTaskCreateModal from "./ProjectTaskCreateModal";

const Transition = forwardRef(function Transition(props: any, ref: any) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface TodoConvertModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  prefillData: {
    title?: string;
    description?: string;
    responsible_person?: {
      id: string;
    };
    target_date?: string;
  };
  todoId: number | string;
  onSuccess?: () => void;
}

const TodoConvertModal = ({
  isModalOpen,
  setIsModalOpen,
  prefillData,
  todoId,
  onSuccess,
}: TodoConvertModalProps) => {
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleTaskSuccess = (taskId: number) => {
    // Here we might want to do something with the todo, like delete it or mark it converted
    // For now, we'll just close the modal and call onSuccess
    if (onSuccess) {
      onSuccess();
    }
    closeModal();
  };

  if (!isModalOpen) return null;

  return (
    <Dialog
      open={isModalOpen}
      onClose={closeModal}
      TransitionComponent={Transition}
      transitionDuration={{ enter: 500, exit: 300 }}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          position: "fixed",
          right: 0,
          top: 0,
          height: "100%",
          width: "50%",
          borderRadius: 0,
          margin: 0,
          maxHeight: "100%",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "16px",
          color: "#1B1B1B",
          textAlign: "center",
          borderBottom: "2px solid #E95420",
          py: 2,
          position: "relative",
        }}
      >
        Convert Todo to Task
        <X
          className="absolute top-4 right-6 cursor-pointer text-gray-500 hover:text-gray-800"
          onClick={closeModal}
          size={20}
        />
      </DialogTitle>

      <DialogContent
        sx={{ p: 3, overflowY: "auto", maxHeight: "calc(100% - 60px)" }}
      >
        <div className="mt-4">
          <ProjectTaskCreateModal
            isEdit={false}
            onCloseModal={closeModal}
            className="mx-0 w-full"
            prefillData={prefillData}
            onSuccess={handleTaskSuccess}
            // We don't pass opportunityId as this is a Todo conversion
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TodoConvertModal;
