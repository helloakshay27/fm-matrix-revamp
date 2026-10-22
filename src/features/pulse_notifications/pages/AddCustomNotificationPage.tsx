import { PulsePageHeader } from "@/pages/pulse/components/PulsePageHeader";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateCustomNotificationMutation } from "../hooks/useCreateCustomNotificationMutation";
import { CustomNotificationForm } from "../components/CustomNotificationForm";
import { getApiErrorMessage } from "../utils/apiErrorMessage";
import type { CustomNotificationFormPayload } from "../types/customNotification";

const AddCustomNotificationPage = () => {
  const navigate = useNavigate();
  const createNotification = useCreateCustomNotificationMutation();

  const handleSubmit = async (payload: CustomNotificationFormPayload) => {
    try {
      await createNotification.mutateAsync({ custom_notification: payload });
      toast.success("Notification created successfully!");
      navigate("/pulse/notifications");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to create notification"));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-6 pt-6"><PulsePageHeader title="New Notification" parent={{ label: "Notifications", to: "/pulse/notifications" }} /></div>
      <CustomNotificationForm
        submitLabel="Submit"
        submittingLabel="Submitting..."
        isSubmitting={createNotification.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/pulse/notifications")}
      />
    </div>
  );
};

export default AddCustomNotificationPage;
