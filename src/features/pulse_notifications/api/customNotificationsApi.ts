import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
import type {
  AudiencePreviewPayload,
  AudiencePreviewResponse,
  CreateCustomNotificationApproverPayload,
  CreateCustomNotificationPayload,
  CreateCustomNotificationResponse,
  CustomNotificationApprover,
  CustomNotificationApproversResponse,
  CustomNotificationDetail,
  CustomNotificationsQueryParams,
  CustomNotificationsResponse,
  NotificationFiles,
  NotificationRecipientsResponse,
  NotificationTypesResponse,
  NotificationUploadKind,
  UploadNotificationFileResponse,
} from "../types/customNotification";

const PULSE_BASE_URL = `https://${localStorage.getItem("baseUrl")}`;

const pulseNotificationsClient = axios.create({ baseURL: PULSE_BASE_URL });

// Mirrors the token injection pattern used in pulseDashboardApi.ts.
pulseNotificationsClient.interceptors.request.use((config) => {
  const token = API_CONFIG.TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Confirmed via curl — no .json suffix.
export const fetchNotificationTypes = async (): Promise<NotificationTypesResponse> => {
  const { data } = await pulseNotificationsClient.get<NotificationTypesResponse>(
    "/custom_notifications/ntypes.json"
  );
  return data;
};

// Confirmed via curl — .json suffix included.
export const fetchCustomNotificationApprovers = async (
  pmsSiteId: number
): Promise<CustomNotificationApproversResponse> => {
  const { data } = await pulseNotificationsClient.get<CustomNotificationApproversResponse>(
    "/custom_notification_approvers.json",
    { params: { pms_site_id: pmsSiteId } }
  );
  return data;
};

// Confirmed via curl (request body only — response shape unconfirmed).
export const createCustomNotificationApprover = async (
  payload: CreateCustomNotificationApproverPayload
): Promise<CustomNotificationApprover> => {
  const { data } = await pulseNotificationsClient.post<CustomNotificationApprover>(
    "/custom_notification_approvers.json",
    payload
  );
  return data;
};

// Confirmed via curl.
export const deleteCustomNotificationApprover = async (id: number): Promise<void> => {
  await pulseNotificationsClient.delete(`/custom_notification_approvers/${id}.json`);
};

export const fetchCustomNotifications = async (
  params: CustomNotificationsQueryParams
): Promise<CustomNotificationsResponse> => {
  const { data } = await pulseNotificationsClient.get<CustomNotificationsResponse>(
    "/custom_notifications.json",
    { params }
  );
  return data;
};

// Rails form encoding: a[b] for objects, a[0][c] for lists of objects, a[]
// for lists of plain values. null becomes a blank value; an empty list becomes
// one blank a[] field (multipart cannot send an empty list).
function appendField(form: FormData, key: string, value: unknown): void {
  if (value === undefined) return;
  if (value === null) {
    form.append(key, "");
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      form.append(`${key}[]`, "");
      return;
    }
    value.forEach((item, index) => {
      const isObject = typeof item === "object" && item !== null;
      appendField(form, isObject ? `${key}[${index}]` : `${key}[]`, item);
    });
  } else if (typeof value === "object") {
    Object.entries(value).forEach(([name, item]) => appendField(form, `${key}[${name}]`, item));
  } else {
    form.append(key, String(value));
  }
}

// Images go as files in the create/update request itself. Without any file the
// plain JSON body is sent as before. Content-Type is left unset for FormData so
// the browser adds the multipart boundary.
function buildSaveBody(
  payload: CreateCustomNotificationPayload,
  files?: NotificationFiles
): CreateCustomNotificationPayload | FormData {
  const hasFiles = !!files?.bannerImage || (files?.images?.length ?? 0) > 0;
  if (!hasFiles) return payload;

  const form = new FormData();
  appendField(form, "custom_notification", payload.custom_notification);
  if (files?.bannerImage) form.append("custom_notification[banner_image]", files.bannerImage);
  files?.images?.forEach((image) => form.append("custom_notification[images][]", image));
  return form;
}

// Two-step upload for documents: the returned id goes in attachment_ids.
export const uploadCustomNotificationFile = async (
  file: File,
  kind: NotificationUploadKind
): Promise<UploadNotificationFileResponse> => {
  const form = new FormData();
  form.append("file", file);
  form.append("kind", kind);
  const { data } = await pulseNotificationsClient.post<UploadNotificationFileResponse>(
    "/custom_notifications/upload.json",
    form
  );
  return data;
};

export const createCustomNotification = async (
  payload: CreateCustomNotificationPayload,
  files?: NotificationFiles
): Promise<CreateCustomNotificationResponse> => {
  const { data } = await pulseNotificationsClient.post<CreateCustomNotificationResponse>(
    "/custom_notifications.json",
    buildSaveBody(payload, files)
  );
  return data;
};

export const fetchCustomNotificationDetail = async (
  id: number
): Promise<CustomNotificationDetail> => {
  const { data } = await pulseNotificationsClient.get<CustomNotificationDetail>(
    `/custom_notifications/${id}.json`
  );
  return data;
};

// Unconfirmed — see the caveat on CustomNotificationDetail in types/customNotification.ts.
export const updateCustomNotification = async (
  id: number,
  payload: CreateCustomNotificationPayload,
  files?: NotificationFiles
): Promise<CreateCustomNotificationResponse> => {
  const { data } = await pulseNotificationsClient.put<CreateCustomNotificationResponse>(
    `/custom_notifications/${id}.json`,
    buildSaveBody(payload, files)
  );
  return data;
};

// The confirmed curl for this action route had no .json suffix, but the
// user explicitly asked for it to be added anyway (Rails member routes
// typically accept an optional format suffix on any action).
export const submitCustomNotificationForApproval = async (
  id: number
): Promise<CustomNotificationDetail> => {
  const { data } = await pulseNotificationsClient.post<CustomNotificationDetail>(
    `/custom_notifications/${id}/submit_for_approval.json`
  );
  return data;
};

export const approveCustomNotification = async (
  id: number
): Promise<CustomNotificationDetail> => {
  const { data } = await pulseNotificationsClient.post<CustomNotificationDetail>(
    `/custom_notifications/${id}/approve.json`
  );
  return data;
};

export const rejectCustomNotification = async (
  id: number,
  rejectionReason: string
): Promise<CustomNotificationDetail> => {
  const { data } = await pulseNotificationsClient.post<CustomNotificationDetail>(
    `/custom_notifications/${id}/reject.json`,
    { rejection_reason: rejectionReason }
  );
  return data;
};

export const sendCustomNotificationNow = async (
  id: number
): Promise<CustomNotificationDetail> => {
  const { data } = await pulseNotificationsClient.post<CustomNotificationDetail>(
    `/custom_notifications/${id}/send_now.json`
  );
  return data;
};

// Confirmed via curl — .json suffix included.
export const resendCustomNotification = async (
  id: number
): Promise<CustomNotificationDetail> => {
  const { data } = await pulseNotificationsClient.post<CustomNotificationDetail>(
    `/custom_notifications/${id}/resend.json`
  );
  return data;
};

export const scheduleCustomNotification = async (
  id: number,
  scheduledAt: string,
  expiresAt: string
): Promise<CustomNotificationDetail> => {
  const { data } = await pulseNotificationsClient.post<CustomNotificationDetail>(
    `/custom_notifications/${id}/schedule.json`,
    { scheduled_at: scheduledAt, expires_at: expiresAt }
  );
  return data;
};

// Confirmed via curl — .json suffix included this time.
export const cancelCustomNotification = async (
  id: number
): Promise<CustomNotificationDetail> => {
  const { data } = await pulseNotificationsClient.post<CustomNotificationDetail>(
    `/custom_notifications/${id}/cancel.json`
  );
  return data;
};

// Confirmed via curl — no .json suffix, and not scoped under /:id (it's a
// standalone endpoint that previews recipients for an arbitrary audience
// selection, not a specific existing notification).
export const fetchAudiencePreview = async (
  payload: AudiencePreviewPayload
): Promise<AudiencePreviewResponse> => {
  const { data } = await pulseNotificationsClient.post<AudiencePreviewResponse>(
    "/custom_notifications/audience_preview.json",
    payload
  );
  return data;
};

// Confirmed via curl — no .json suffix.
export const fetchNotificationRecipients = async (
  id: number,
  page: number,
  perPage: number
): Promise<NotificationRecipientsResponse> => {
  const { data } = await pulseNotificationsClient.get<NotificationRecipientsResponse>(
    `/custom_notifications/${id}/recipients.json`,
    { params: { page, per_page: perPage } }
  );
  return data;
};
