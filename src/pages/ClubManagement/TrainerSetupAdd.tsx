import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { addTrainer } from "./trainerSetupMockData";
import { TrainerSetupForm, emptyTrainerSetupForm } from "./TrainerSetupForm";

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
      onSubmit={(payload) => {
        const created = addTrainer(payload);
        toast.success("Trainer created successfully!");
        navigate(`/club-management/trainer-setup/details/${created.id}`);
      }}
    />
  );
};

export default TrainerSetupAdd;
