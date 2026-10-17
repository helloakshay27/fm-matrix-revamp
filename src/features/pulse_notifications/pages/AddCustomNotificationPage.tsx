import { ArrowLeft } from "lucide-react";
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
      <div className="px-6 pt-4 sm:pt-6">
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
            <button
              type="button"
              onClick={() => navigate("/pulse/notifications")}
              className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span>Notification List</span>
            <span>{">"}</span>
            <span className="text-gray-900 font-medium">Create New Notification</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">NEW NOTIFICATION</h1>
        </div>
      </div>
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
