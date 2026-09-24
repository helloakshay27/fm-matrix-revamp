import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateTrainer, mapTrainerApiData } from "./trainerSetupMockData";
import { TrainerSetupForm, emptyTrainerSetupForm, type TrainerSetupFormState } from "./TrainerSetupForm";
import { apiClient } from "@/utils/apiClient";

// Existing mock records predate the availability/slot/roster fields, so fall back to the
// blank form's defaults for anything missing rather than crash on undefined.

export const TrainerSetupEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<TrainerSetupFormState | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchTrainer = async () => {
      try {
        const response = await apiClient.get(`/pms/admin/trainers/${id}.json`);
        const existing = mapTrainerApiData(response.data);
        if (!existing.id) throw new Error("Trainer not found");
        setInitialValues({
          name: existing.name,
          email: existing.email ?? emptyTrainerSetupForm.email,
          specialization: existing.specialization,
          experience: existing.experience,
          ratePerSession: existing.ratePerSession,
          contactNumber: existing.contactNumber,
          status: existing.status,
          bio: existing.bio,
          slot: existing.slot ?? emptyTrainerSetupForm.slot,
          roster: existing.roster ?? emptyTrainerSetupForm.roster,
          availabilitySlots: existing.availabilitySlots ?? emptyTrainerSetupForm.availabilitySlots,
          bookableSlotsPerDay: existing.bookableSlotsPerDay ?? emptyTrainerSetupForm.bookableSlotsPerDay,
          bookingAllowedBefore: existing.bookingAllowedBefore ?? emptyTrainerSetupForm.bookingAllowedBefore,
          advanceBooking: existing.advanceBooking ?? emptyTrainerSetupForm.advanceBooking,
          canCancelBefore: existing.canCancelBefore ?? emptyTrainerSetupForm.canCancelBefore,
          facilityBookedTimes: existing.facilityBookedTimes ?? emptyTrainerSetupForm.facilityBookedTimes,
        });
      } catch (error) {
        console.error("Failed to load trainer", error);
        toast.error("Trainer not found");
        navigate("/club-management/trainer-setup");
      }
    };
    fetchTrainer();
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
