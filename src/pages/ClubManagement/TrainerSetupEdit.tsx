import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getTrainerById, updateTrainer } from "./trainerSetupMockData";
import { TrainerSetupForm, emptyTrainerSetupForm, type TrainerSetupFormState } from "./TrainerSetupForm";

export const TrainerSetupEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<TrainerSetupFormState | null>(null);

  useEffect(() => {
    if (!id) return;
    const existing = getTrainerById(id);
    if (!existing) {
      toast.error("Trainer not found");
      navigate("/club-management/trainer-setup");
      return;
    }
    setInitialValues({
      name: existing.name,
      specialization: existing.specialization,
      experience: existing.experience,
      ratePerSession: existing.ratePerSession,
      contactNumber: existing.contactNumber,
      status: existing.status,
      bio: existing.bio,
    });
  }, [id, navigate]);

  if (!initialValues) return null;

  return (
    <TrainerSetupForm
      pageTitle="Edit Trainer Setup"
      backLabel="Back to Trainer Setup List"
      initialValues={initialValues ?? emptyTrainerSetupForm}
      submitLabel="Update"
      submittingLabel="Updating..."
      onBack={() => navigate("/club-management/trainer-setup")}
      onSubmit={(payload) => {
        if (!id) return;
        updateTrainer(id, payload);
        toast.success("Trainer updated successfully!");
        navigate(`/club-management/trainer-setup/details/${id}`);
      }}
    />
  );
};

export default TrainerSetupEdit;
