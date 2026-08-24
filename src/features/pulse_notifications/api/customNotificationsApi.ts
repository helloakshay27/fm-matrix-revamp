import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
import type {
  AudiencePreviewPayload,
  AudiencePreviewResponse,
  CreateCustomNotificationPayload,
  CreateCustomNotificationResponse,
  CustomNotificationDetail,
  CustomNotificationsQueryParams,
  CustomNotificationsResponse,
  NotificationRecipientsResponse,
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

export const fetchCustomNotifications = async (
  params: CustomNotificationsQueryParams
): Promise<CustomNotificationsResponse> => {
  const { data } = await pulseNotificationsClient.get<CustomNotificationsResponse>(
    "/custom_notifications.json",
    { params }
  );
  return data;
};

export const createCustomNotification = async (
  payload: CreateCustomNotificationPayload
): Promise<CreateCustomNotificationResponse> => {
  const { data } = await pulseNotificationsClient.post<CreateCustomNotificationResponse>(
    "/custom_notifications.json",
    payload
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
  payload: CreateCustomNotificationPayload
): Promise<CreateCustomNotificationResponse> => {
  const { data } = await pulseNotificationsClient.put<CreateCustomNotificationResponse>(
    `/custom_notifications/${id}.json`,
    payload
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
