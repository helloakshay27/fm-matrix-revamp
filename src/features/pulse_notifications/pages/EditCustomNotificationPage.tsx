import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useCustomNotificationDetailQuery } from "../hooks/useCustomNotificationDetailQuery";
import { useUpdateCustomNotificationMutation } from "../hooks/useUpdateCustomNotificationMutation";
import { useAudienceSitesQuery } from "../hooks/useAudienceSitesQuery";
import { useAudienceCommunitiesQuery } from "../hooks/useAudienceCommunitiesQuery";
import { useAudienceUsersQuery } from "../hooks/useAudienceUsersQuery";
import { CustomNotificationForm } from "../components/CustomNotificationForm";
import { getApiErrorMessage } from "../utils/apiErrorMessage";
import { resolveNotificationTargets } from "../utils/resolveNotificationTargets";
import type { CustomNotificationFormPayload } from "../types/customNotification";

const EditCustomNotificationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const notificationId = id ? parseInt(id, 10) : NaN;
  const hasValidId = !Number.isNaN(notificationId);

  const userIdRaw = localStorage.getItem("userId");
  const userId = userIdRaw ? parseInt(userIdRaw, 10) : NaN;

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useCustomNotificationDetailQuery(hasValidId ? notificationId : null);

  if (detailError) {
    console.error("[EditCustomNotificationPage] fetchCustomNotificationDetail failed:", detailError);
  }

  // Fetched here (not just inside the inline lists) so target ids from the
  // detail response can be resolved to display names up front. The form's
  // initialValues only ever seed once (its internal state is plain useState),
  // so the page must wait for these to finish loading before mounting it —
  // otherwise the form permanently locks in the "Site #9"/"User #11" id
  // fallback from whichever render happened to fire first.
  const { data: sites, isLoading: isSitesLoading } = useAudienceSitesQuery(
    Number.isNaN(userId) ? null : userId
  );
  const { data: communities, isLoading: isCommunitiesLoading } = useAudienceCommunitiesQuery();
  const { data: users, isLoading: isUsersLoading } = useAudienceUsersQuery();
  const isAudienceLoading = isSitesLoading || isCommunitiesLoading || isUsersLoading;

  const updateNotification = useUpdateCustomNotificationMutation(notificationId);

  const initialValues = useMemo(() => {
    const notification = detailData;
    if (!notification) return undefined;

    const targets = notification.targets ?? [];
    const siteNames = new Map((sites ?? []).map((s) => [s.id, s.name]));
    const communityNames = new Map((communities ?? []).map((c) => [c.id, c.name]));
    const userNames = new Map((users ?? []).map((u) => [u.id, u.full_name]));

    return {
      title: notification.title,
      message: notification.message,
      ntype: notification.ntype,
      priority: notification.priority,
      audienceScope: notification.audience_scope,
      selectedSites: resolveNotificationTargets(targets, "PmsSite", siteNames, "Site"),
      selectedCommunities: resolveNotificationTargets(targets, "Community", communityNames, "Community"),
      selectedUsers: resolveNotificationTargets(targets, "User", userNames, "User"),
    };
  }, [detailData, sites, communities, users]);

  const handleSubmit = async (payload: CustomNotificationFormPayload) => {
    try {
      await updateNotification.mutateAsync({ custom_notification: payload });
      toast.success("Notification updated successfully!");
      navigate("/pulse/notifications");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to update notification"));
    }
  };

  if (!hasValidId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-brand-error">Invalid notification.</p>
      </div>
    );
  }

  if (isDetailLoading || isAudienceLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading notification...</p>
      </div>
    );
  }

  if (isDetailError || !initialValues) {
    const detail = isDetailError
      ? getApiErrorMessage(detailError, "Unable to reach the server.")
      : "The server responded, but not in the shape this page expects.";

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-brand-error">Failed to load notification.</p>
          {detail && <p className="mt-1 text-xs text-gray-500">{detail}</p>}
        </div>
      </div>
    );
  }

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
            <span className="text-gray-900 font-medium">Edit Notification</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">EDIT NOTIFICATION</h1>
        </div>
      </div>
      <CustomNotificationForm
        submitLabel="Save Changes"
        submittingLabel="Saving..."
        isSubmitting={updateNotification.isPending}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/pulse/notifications")}
      />
    </div>
  );
};

export default EditCustomNotificationPage;
