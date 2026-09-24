import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { emptyClassSetupForm, ClassSetupForm } from "./ClassSetupForm";
import type { ClassSetup } from "./classSetupMockData";
import { useClubManagementEvents } from "@/components/PostHogClubManagementEvents";

export const ClassSetupAdd = () => {
  const navigate = useNavigate();
  const cmEvents = useClubManagementEvents();

  const handleSubmit = async (payload: Omit<ClassSetup, "id" | "trainers">, attachedFiles: File[]) => {
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const url = `https://${baseUrl}/pms/admin/club_classes.json`;

      const classFields: Record<string, unknown> = {
        name: payload.className,
        session_type: String(payload.classType).toLowerCase(),
        activity_type: String(payload.activityType).toLowerCase(),
        max_capacity: payload.maxCapacity,
        min_capacity: payload.minParticipants,
        duration_minutes: parseInt(String(payload.duration), 10) || 0,
        status: String(payload.status).toLowerCase(),
        bundle_eligible: true,
        trainer_ids: payload.trainer,
        location: payload.location,
      };

      let response;
      if (attachedFiles.length > 0) {
        const formData = new FormData();
        Object.entries(classFields).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item) => formData.append(`club_class[${key}][]`, String(item)));
          } else {
            formData.append(`club_class[${key}]`, String(value));
          }
        });
        attachedFiles.forEach((file) => {
          formData.append("club_class[images][]", file);
        });

        response = await axios.post(url, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post(
          url,
          { club_class: classFields },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      cmEvents.created("Class Setup", response.data?.id, "class_setup_add");
      toast.success("Class created successfully!");
      // List/Details still read from the in-memory mock store (not yet wired to
      // this real API), so a freshly-created class won't appear there - land back
      // on the list instead of a details page that can't find it.
      navigate("/club-management/class-setup");
    } catch (err) {
      toast.error("Failed to create class");
    }
  };

  return (
    <ClassSetupForm
      pageTitle="Class Setup"
      backLabel="Back to Class Setup List"
      initialValues={emptyClassSetupForm}
      submitLabel="Submit"
      submittingLabel="Submitting..."
      onBack={() => navigate("/club-management/class-setup")}
      onSubmit={handleSubmit}
    />
  );
};

export default ClassSetupAdd;
