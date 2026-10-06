import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TrainerSetupForm, emptyTrainerSetupForm } from "./TrainerSetupForm";
import { buildTrainerFormData, buildTrainerRequest } from "./trainerSetupApi";
import { apiClient } from "@/utils/apiClient";

export const TrainerSetupAdd = () => {
  const navigate = useNavigate();

  return (
    <TrainerSetupForm
      pageTitle="Trainer Setup"
      backLabel="Back to Trainer Setup List"
      initialValues={emptyTrainerSetupForm}
      submitLabel="Submit"
      submittingLabel="Submitting..."
      onBack={() => navigate("/club-management/trainer-setup")}
      onSubmit={async (payload, files) => {
        const trainer = buildTrainerRequest(payload);

        try {
          const hasAttachments = Boolean(files.image || files.certificate || files.contract);
          if (hasAttachments) {
            await apiClient.post("/pms/admin/trainers.json", buildTrainerFormData(trainer, files));
          } else {
            await apiClient.post("/pms/admin/trainers.json", { trainer });
          }
          toast.success("Trainer created successfully!");
          navigate("/club-management/trainer-setup");
        } catch (error) {
          console.error("Failed to create trainer", error);
          toast.error("Failed to create trainer");
        }
      }}
    />
  );
};

export default TrainerSetupAdd;
