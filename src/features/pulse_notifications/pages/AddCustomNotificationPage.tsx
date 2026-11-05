import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateCustomNotificationMutation } from "../hooks/useCreateCustomNotificationMutation";
import { CustomNotificationForm } from "../components/CustomNotificationForm";
import { getApiErrorMessage } from "../utils/apiErrorMessage";
import type {
  CustomNotificationFormPayload,
  NotificationFiles,
} from "../types/customNotification";

const AddCustomNotificationPage = () => {
  const navigate = useNavigate();
  const createNotification = useCreateCustomNotificationMutation();

  const handleSubmit = async (
    payload: CustomNotificationFormPayload,
    files: NotificationFiles
  ) => {
    try {
      await createNotification.mutateAsync({
        payload: { custom_notification: payload },
        files,
      });
      toast.success("Notification created successfully!");
      navigate("/pulse/notifications");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to create notification"));
    }
  };

  return (
    <CustomNotificationForm
      headerTitle="Add Notification"
      headerSubtitle="Compose a push notification and choose who should receive it."
      submitLabel="Submit"
      submittingLabel="Submitting..."
      isSubmitting={createNotification.isPending}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/pulse/notifications")}
    />
  );
};

export default AddCustomNotificationPage;
