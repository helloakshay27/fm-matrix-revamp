import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TrainerSetupForm, emptyTrainerSetupForm } from "./TrainerSetupForm";
import { apiClient } from "@/utils/apiClient";

const appendTrainerField = (formData: FormData, key: string, value: string | number) => {
  formData.append(`trainer[${key}]`, String(value));
};

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
        const firstSlot = payload.availabilitySlots?.[0];
        const facilitySlot = {
          start_hour: Number(firstSlot?.startTime.hour ?? 0),
          start_min: Number(firstSlot?.startTime.minute ?? 0),
          end_hour: Number(firstSlot?.endTime.hour ?? 0),
          end_min: Number(firstSlot?.endTime.minute ?? 0),
          breakminutes: 60,
          wrap_time: 0,
        };
        const trainer = {
          name: payload.name,
          mobile: payload.contactNumber,
          email: payload.email,
          specialization: payload.specialization,
          trainer_type: "in_house",
          status: payload.status.toLowerCase(),
          user_roaster_id: localStorage.getItem("user_roaster_id") ?? "",
          user_shift_id: localStorage.getItem("user_shift_id") ?? "",
          facility_slot_attributes: facilitySlot,
        };

        try {
          const hasAttachments = Boolean(files.image || files.certificate || files.contract);
          if (hasAttachments) {
            const formData = new FormData();
            Object.entries(trainer).forEach(([key, value]) => {
              if (key === "facility_slot_attributes") {
                Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                  appendTrainerField(formData, `facility_slot_attributes][${nestedKey}`, nestedValue as number);
                });
              } else {
                appendTrainerField(formData, key, value as string);
              }
            });
            if (files.image) formData.append("trainer[image]", files.image);
            if (files.certificate) formData.append("trainer[certificate]", files.certificate);
            if (files.contract) formData.append("trainer[contract]", files.contract);
            await apiClient.post("/pms/admin/trainers.json", formData);
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
