import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ClassSetupForm, type ClassSetupFormState } from "./ClassSetupForm";
import type { ClassSetup } from "./classSetupMockData";
import { useClubManagementEvents } from "@/components/PostHogClubManagementEvents";

// "group"/"private", "pilates"/"yoga" -> "Group"/"Private", "Pilates"/"Yoga" -
// matches CLASS_TYPES/ACTIVITY_TYPES exactly so the Select shows the right option.
const titleCase = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "");

export const ClassSetupEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const cmEvents = useClubManagementEvents();
  const [initialValues, setInitialValues] = useState<ClassSetupFormState | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchClass = async () => {
      try {
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const res = await axios.get(`https://${baseUrl}/pms/admin/club_classes/${id}.json`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const c = res.data?.club_class ?? res.data;

        setInitialValues({
          className: c.name ?? "",
          classType: titleCase(c.session_type),
          activityType: titleCase(c.activity_type),
          amountPerPerson: "",
          minParticipants: String(c.min_capacity ?? ""),
          maxCapacity: String(c.max_capacity ?? ""),
          location: c.location ?? "",
          duration: c.duration_minutes != null ? String(c.duration_minutes) : "",
          trainer: (c.trainers ?? c.trainer_ids ?? []).map((trainer: any) =>
            String(typeof trainer === "object" ? trainer.value : trainer)
          ),
          status: String(c.status).toLowerCase() === "active" ? "Active" : "Inactive",
          startTime: "",
          endTime: "",
          description: "",
        });
      } catch (err) {
        console.error("Failed to fetch class", err);
        toast.error("Class not found");
        navigate("/club-management/class-setup");
      }
    };
    fetchClass();
  }, [id, navigate]);

  if (!initialValues) return null;

  const handleSubmit = async (payload: Omit<ClassSetup, "id" | "trainers"> & { selectedTrainers: { name: string; value: number }[] }, attachedFiles: File[]) => {
    if (!id) return;
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const url = `https://${baseUrl}/pms/admin/club_classes/${id}.json`;

      const classFields: Record<string, unknown> = {
        name: payload.className,
        session_type: String(payload.classType).toLowerCase(),
        activity_type: String(payload.activityType).toLowerCase(),
        max_capacity: payload.maxCapacity,
        min_capacity: payload.minParticipants,
        duration_minutes: parseInt(String(payload.duration), 10) || 0,
        status: String(payload.status).toLowerCase(),
        bundle_eligible: true,
        trainers: payload.selectedTrainers,
        location: payload.location,
      };

      if (attachedFiles.length > 0) {
        const formData = new FormData();
        Object.entries(classFields).forEach(([key, value]) => {
          if (key === "trainers" && Array.isArray(value)) {
            value.forEach((trainer, index) => {
              formData.append(`club_class[trainers][${index}][name]`, trainer.name);
              formData.append(`club_class[trainers][${index}][value]`, String(trainer.value));
            });
          } else if (Array.isArray(value)) {
            value.forEach((item) => formData.append(`club_class[${key}][]`, String(item)));
          } else {
            formData.append(`club_class[${key}]`, String(value));
          }
        });
        attachedFiles.forEach((file) => {
          formData.append("club_class[images][]", file);
        });
        await axios.put(url, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.put(
          url,
          { club_class: classFields },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      cmEvents.updated("Class Setup", id, "class_setup_edit");
      toast.success("Class updated successfully!");
      navigate("/club-management/class-setup");
    } catch (err) {
      toast.error("Failed to update class");
    }
  };

  return (
    <ClassSetupForm
      pageTitle="Edit Class Setup"
      backLabel="Back to Class Setup List"
      initialValues={initialValues}
      submitLabel="Update"
      submittingLabel="Updating..."
      onBack={() => navigate("/club-management/class-setup")}
      onSubmit={handleSubmit}
    />
  );
};

export default ClassSetupEdit;
