import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Bell,
  Share2,
  History,
  BarChart3,
  Link2,
  Send,
  CalendarClock,
  Users,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCustomNotificationDetailQuery } from "../hooks/useCustomNotificationDetailQuery";
import { useSubmitForApprovalMutation } from "../hooks/useSubmitForApprovalMutation";
import { useApproveCustomNotificationMutation } from "../hooks/useApproveCustomNotificationMutation";
import { useRejectCustomNotificationMutation } from "../hooks/useRejectCustomNotificationMutation";
import { useSendNowMutation } from "../hooks/useSendNowMutation";
import { useScheduleNotificationMutation } from "../hooks/useScheduleNotificationMutation";
import { useCancelNotificationMutation } from "../hooks/useCancelNotificationMutation";
import { useResendNotificationMutation } from "../hooks/useResendNotificationMutation";
import { useAudienceSitesQuery } from "../hooks/useAudienceSitesQuery";
import { useAudienceCommunitiesQuery } from "../hooks/useAudienceCommunitiesQuery";
import { useAudienceUsersQuery } from "../hooks/useAudienceUsersQuery";
import { NotificationPriorityBadge } from "../components/NotificationPriorityBadge";
import { ApproveNotificationDialog } from "../components/ApproveNotificationDialog";
import { RejectNotificationDialog } from "../components/RejectNotificationDialog";
import { SendNowNotificationDialog } from "../components/SendNowNotificationDialog";
import { ScheduleNotificationDialog } from "../components/ScheduleNotificationDialog";
import { CancelNotificationDialog } from "../components/CancelNotificationDialog";
import { ResendNotificationDialog } from "../components/ResendNotificationDialog";
import { AudiencePreviewPanel } from "../components/AudiencePreviewPanel";
import { NotificationRecipientsPanel } from "../components/NotificationRecipientsPanel";
import { getApiErrorMessage } from "../utils/apiErrorMessage";
import { resolveNotificationTargets } from "../utils/resolveNotificationTargets";
import {
  formatNotificationDate,
  formatNotificationStatusLabel,
  formatNotificationTypeLabel,
} from "../utils/notificationFormatters";

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof Bell;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-brand-bg p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center">
            <Icon className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <div className="mt-1 text-sm text-gray-900">{value ?? "—"}</div>
    </div>
  );
}

const ViewCustomNotificationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const notificationId = id ? parseInt(id, 10) : NaN;
  const hasValidId = !Number.isNaN(notificationId);

  const userIdRaw = localStorage.getItem("userId");
  const userId = userIdRaw ? parseInt(userIdRaw, 10) : NaN;

  const {
    data: notification,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useCustomNotificationDetailQuery(hasValidId ? notificationId : null);

  const submitForApproval = useSubmitForApprovalMutation(notificationId);
  const approveNotification =
    useApproveCustomNotificationMutation(notificationId);
  const rejectNotification =
    useRejectCustomNotificationMutation(notificationId);
  const sendNow = useSendNowMutation(notificationId);
  const scheduleNotification = useScheduleNotificationMutation(notificationId);
  const cancelNotification = useCancelNotificationMutation(notificationId);
  const resendNotification = useResendNotificationMutation(notificationId);

  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showSendNowDialog, setShowSendNowDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showResendDialog, setShowResendDialog] = useState(false);

  const handleSubmitForApproval = async () => {
    try {
      await submitForApproval.mutateAsync();
      toast.success("Notification submitted for approval");
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error, "Failed to submit notification for approval")
      );
    }
  };

  const handleApprove = async () => {
    setShowApproveDialog(false);
    try {
      await approveNotification.mutateAsync();
      toast.success("Notification approved");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to approve notification"));
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please enter a reason for rejection");
      return;
    }
    try {
      await rejectNotification.mutateAsync(rejectionReason.trim());
      toast.success("Notification rejected");
      setShowRejectDialog(false);
      setRejectionReason("");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to reject notification"));
    }
  };

  const handleSendNow = async () => {
    setShowSendNowDialog(false);
    try {
      await sendNow.mutateAsync();
      toast.success("Notification sent");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to send notification"));
    }
  };

  const handleSchedule = async (scheduledAt: string, expiresAt: string) => {
    try {
      await scheduleNotification.mutateAsync({ scheduledAt, expiresAt });
      toast.success("Notification scheduled");
      setShowScheduleDialog(false);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to schedule notification"));
    }
  };

  const handleCancel = async () => {
    setShowCancelDialog(false);
    try {
      await cancelNotification.mutateAsync();
      toast.success("Notification cancelled");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to cancel notification"));
    }
  };

  const handleResend = async () => {
    setShowResendDialog(false);
    try {
      await resendNotification.mutateAsync();
      toast.success("Notification resent");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to resend notification"));
    }
  };

  const { data: sites } = useAudienceSitesQuery(
    Number.isNaN(userId) ? null : userId
  );
  const { data: communities } = useAudienceCommunitiesQuery();
  const { data: users } = useAudienceUsersQuery();

  const audience = useMemo(() => {
    const targets = notification?.targets ?? [];
    const siteNames = new Map((sites ?? []).map((s) => [s.id, s.name]));
    const communityNames = new Map(
      (communities ?? []).map((c) => [c.id, c.name])
    );
    const userNames = new Map((users ?? []).map((u) => [u.id, u.full_name]));

    return {
      sites: resolveNotificationTargets(targets, "PmsSite", siteNames, "Site"),
      communities: resolveNotificationTargets(
        targets,
        "Community",
        communityNames,
        "Community"
      ),
      users: resolveNotificationTargets(targets, "User", userNames, "User"),
    };
  }, [notification, sites, communities, users]);

  if (!hasValidId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-brand-error">Invalid notification.</p>
      </div>
    );
  }

  if (isDetailLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading notification...</p>
      </div>
    );
  }

  if (isDetailError || !notification) {
    const detail = isDetailError
      ? getApiErrorMessage(detailError, "Unable to reach the server.")
      : "The server responded, but not in the shape this page expects.";

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-brand-error">
            Failed to load notification.
          </p>
          {detail && <p className="mt-1 text-xs text-gray-500">{detail}</p>}
        </div>
      </div>
    );
  }

  const hasCustomAudience =
    audience.sites.length > 0 ||
    audience.communities.length > 0 ||
    audience.users.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-6">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/pulse/notifications")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Notification Details
              </h1>
              <p className="text-sm text-gray-500">
                Read-only view of this notification.
              </p>
            </div>
          </div>

          {notification.status === "draft" && (
            <Button
              onClick={handleSubmitForApproval}
              disabled={submitForApproval.isPending}
              className="!bg-brand hover:!bg-brand-hover !text-white gap-2"
            >
              <Send className="w-4 h-4" />
              {submitForApproval.isPending
                ? "Submitting..."
                : "Send for Approval"}
            </Button>
          )}

          {notification.status === "pending_approval" && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(true)}
                disabled={
                  rejectNotification.isPending || approveNotification.isPending
                }
                className="!border-brand-error !text-brand-error hover:!bg-brand-error/10 gap-2"
              >
                Reject
              </Button>
              <Button
                onClick={() => setShowApproveDialog(true)}
                disabled={
                  approveNotification.isPending || rejectNotification.isPending
                }
              >
                {approveNotification.isPending ? "Approving..." : "Approve"}
              </Button>
            </div>
          )}

          {notification.status === "approved" && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowScheduleDialog(true)}
                disabled={sendNow.isPending || scheduleNotification.isPending}
                className="!border-brand !text-brand hover:!bg-brand-selected gap-2"
              >
                <CalendarClock className="w-4 h-4" />
                Schedule
              </Button>
              <Button
                onClick={() => setShowSendNowDialog(true)}
                disabled={sendNow.isPending || scheduleNotification.isPending}
                className="!bg-brand hover:!bg-brand-hover !text-white gap-2"
              >
                <Send className="w-4 h-4" />
                {sendNow.isPending ? "Sending..." : "Send Now"}
              </Button>
            </div>
          )}

          {notification.sent_at && notification.status !== "cancelled" && (
            <Button
              variant="outline"
              onClick={() => setShowResendDialog(true)}
              disabled={resendNotification.isPending}
              className="!border-brand !text-brand hover:!bg-brand-selected gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {resendNotification.isPending ? "Resending..." : "Resend"}
            </Button>
          )}

          {(notification.scheduled_at || notification.sent_at) &&
            notification.status !== "cancelled" && (
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(true)}
                disabled={cancelNotification.isPending}
                className="!border-brand-error !text-brand-error hover:!bg-brand-error/10 gap-2"
              >
                {cancelNotification.isPending ? "Cancelling..." : "Cancel"}
              </Button>
            )}
        </div>
      </div>

      <div className="flex-1 w-full mx-auto px-6 pb-6">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full bg-white border border-gray-200">
            <TabsTrigger
              value="details"
              className="group w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="audience"
              className="group w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              Audience
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 pt-4">
            {/* Details */}
            <SectionCard
              icon={Bell}
              title="Details"
              subtitle="Basic information shown to the recipient"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Field label="Title" value={notification.title} />
                </div>
                <div className="md:col-span-2">
                  <Field label="Message" value={notification.message} />
                </div>
                <Field
                  label="Notification Type"
                  value={formatNotificationTypeLabel(notification.ntype)}
                />
                <Field
                  label="Priority"
                  value={
                    <NotificationPriorityBadge priority={notification.priority} />
                  }
                />
                <Field
                  label="Status"
                  value={
                    <StatusBadge
                      className="rounded-[10px]"
                      status={notification.status}
                    >
                      {formatNotificationStatusLabel(notification.status)}
                    </StatusBadge>
                  }
                />
                <Field
                  label="Created At"
                  value={formatNotificationDate(notification.created_at)}
                />
              </div>
            </SectionCard>

            {/* Redirection */}
            {(notification.deep_link_type || notification.deep_link_value) && (
              <SectionCard
                icon={Link2}
                title="Redirection"
                subtitle="Where tapping this notification takes the user"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field
                    label="Deep Link Type"
                    value={notification.deep_link_type}
                  />
                  <Field
                    label="Deep Link Value"
                    value={notification.deep_link_value}
                  />
                </div>
              </SectionCard>
            )}

            {/* Delivery Stats */}
            <SectionCard
              icon={BarChart3}
              title="Delivery"
              subtitle="Recipient and delivery tracking"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Field
                  label="Total Recipients"
                  value={notification.total_recipients}
                />
                <Field label="Sent" value={notification.sent_count} />
                <Field label="Failed" value={notification.failed_count} />
                <Field label="Read" value={notification.read_count} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Field
                  label="Scheduled At"
                  value={formatNotificationDate(notification.scheduled_at)}
                />
                <Field
                  label="Sent At"
                  value={formatNotificationDate(notification.sent_at)}
                />
                <Field
                  label="Expiry Date & Time"
                  value={formatNotificationDate(notification.expires_at)}
                />
                <Field
                  label="Cooling-Off Ends At"
                  value={
                    notification.cooling_off_active
                      ? formatNotificationDate(notification.cooling_off_ends_at)
                      : "Ended"
                  }
                />
              </div>
            </SectionCard>

            {/* Approval History */}
            <SectionCard
              icon={History}
              title="Approval History"
              subtitle="Submission, approval, and rejection trail"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  label="Submitted At"
                  value={formatNotificationDate(notification.submitted_at)}
                />
                <Field
                  label="Submitted By"
                  value={
                    notification.submitted_by_id
                      ? `User #${notification.submitted_by_id}`
                      : "—"
                  }
                />
                <Field
                  label="Approved At"
                  value={formatNotificationDate(notification.approved_at)}
                />
                <Field
                  label="Approved By"
                  value={
                    notification.approved_by_id
                      ? `User #${notification.approved_by_id}`
                      : "—"
                  }
                />
                <Field
                  label="Rejected At"
                  value={formatNotificationDate(notification.rejected_at)}
                />
                <Field
                  label="Rejected By"
                  value={
                    notification.rejected_by_id
                      ? `User #${notification.rejected_by_id}`
                      : "—"
                  }
                />
                <div className="md:col-span-2">
                  <Field
                    label="Rejection Reason"
                    value={notification.rejection_reason}
                  />
                </div>
                <Field
                  label="Cancelled At"
                  value={formatNotificationDate(notification.cancelled_at)}
                />
                <Field
                  label="Cancelled By"
                  value={
                    notification.cancelled_by_id
                      ? `User #${notification.cancelled_by_id}`
                      : "—"
                  }
                />
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6 pt-4">
            {/* Audience */}
            <SectionCard
              icon={Share2}
              title="Audience"
              subtitle="Who receives this notification"
            >
              <div className="space-y-4">
                <Field
                  label="Audience Scope"
                  value={
                    notification.audience_scope === "all"
                      ? "All Users"
                      : "Custom Audience"
                  }
                />

                {notification.audience_scope === "custom" && !hasCustomAudience && (
                  <p className="text-sm text-gray-500">
                    No specific targets recorded.
                  </p>
                )}

                {audience.sites.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Sites
                    </span>
                    {audience.sites.map((site) => (
                      <Badge
                        key={site.id}
                        variant="outline"
                        className="border-brand/30 bg-brand-selected text-brand"
                      >
                        {site.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {audience.communities.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Community
                    </span>
                    {audience.communities.map((community) => (
                      <Badge
                        key={community.id}
                        variant="outline"
                        className="border-brand/30 bg-brand-selected text-brand"
                      >
                        {community.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {audience.users.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Users
                    </span>
                    {audience.users.map((user) => (
                      <Badge
                        key={user.id}
                        variant="outline"
                        className="border-brand/30 bg-brand-selected text-brand"
                      >
                        {user.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Dynamic: Audience Preview (not yet sent) vs Recipients (sent) */}
            <SectionCard
              icon={Users}
              title={notification.sent_at ? "Recipients" : "Audience Preview"}
              subtitle={
                notification.sent_at
                  ? "Delivery status for each recipient"
                  : "Estimated recipients based on the current audience selection"
              }
            >
              {notification.sent_at ? (
                <NotificationRecipientsPanel notificationId={notificationId} />
              ) : (
                <AudiencePreviewPanel notification={notification} />
              )}
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>

      <ApproveNotificationDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        onConfirm={handleApprove}
        isSubmitting={approveNotification.isPending}
      />

      <RejectNotificationDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        reason={rejectionReason}
        onReasonChange={setRejectionReason}
        onConfirm={handleReject}
        isSubmitting={rejectNotification.isPending}
      />

      <SendNowNotificationDialog
        open={showSendNowDialog}
        onOpenChange={setShowSendNowDialog}
        onConfirm={handleSendNow}
        isSubmitting={sendNow.isPending}
      />

      <ScheduleNotificationDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        onConfirm={handleSchedule}
        isSubmitting={scheduleNotification.isPending}
      />

      <CancelNotificationDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={handleCancel}
        isSubmitting={cancelNotification.isPending}
      />

      <ResendNotificationDialog
        open={showResendDialog}
        onOpenChange={setShowResendDialog}
        onConfirm={handleResend}
        isSubmitting={resendNotification.isPending}
      />
    </div>
  );
};

export default ViewCustomNotificationPage;
