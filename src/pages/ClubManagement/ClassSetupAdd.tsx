import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { addClass } from "./classSetupMockData";
import { ClassSetupForm, emptyClassSetupForm } from "./ClassSetupForm";
import { useClubManagementEvents } from "@/components/PostHogClubManagementEvents";

export const ClassSetupAdd = () => {
  const navigate = useNavigate();
  const cmEvents = useClubManagementEvents();

  return (
    <ClassSetupForm
      pageTitle="Class Setup"
      backLabel="Back to Class Setup List"
      initialValues={emptyClassSetupForm}
      submitLabel="Submit"
      submittingLabel="Submitting..."
      onBack={() => navigate("/club-management/class-setup")}
      onSubmit={(payload) => {
        const created = addClass(payload);
        cmEvents.created("Class Setup", created.id, "class_setup_add");
        toast.success("Class created successfully!");
        navigate(`/club-management/class-setup/details/${created.id}`);
      }}
    />
  );
};

export default ClassSetupAdd;
