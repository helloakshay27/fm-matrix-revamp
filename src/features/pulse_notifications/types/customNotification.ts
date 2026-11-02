export type NotificationStatus =
  | "pending_approval"
  | "approved"
  | "rejected"
  | "scheduled"
  | "sent"
  | "expired"
  | "draft";

export type NotificationPriority = "low" | "medium" | "high";

export type NotificationType =
  | "normal"
  | "road_block"
  | "animation"
  | "video"
  | "image"
  | "other";

export type NotificationTargetableType = "PmsSite" | "Community" | "User";

export interface CustomNotificationTargetAttribute {
  id?: number;
  targetable_type: NotificationTargetableType;
  targetable_id: number;
  _destroy?: boolean;
}

export type AudienceScope = "all" | "custom";

export interface NotificationTargetSelection {
  id: number;
  name: string;
  // The custom_notification_targets row id(s) for this target, when this
  // selection came from an existing notification being edited. The backend
  // can have more than one target row pointing at the same targetable_id
  // (confirmed duplicates seen in practice) — one is kept (its id sent back
  // as `id` so the backend updates it instead of creating a new row) and any
  // extra ids are sent back with `_destroy: true` to clean up the duplicates.
  // Absent for new selections.
  targetRecordIds?: number[];
}

export interface CreateCustomNotificationPayload {
  custom_notification: {
    title: string;
    message: string;
    ntype: NotificationType | string;
    priority: NotificationPriority | string;
    company_id: number;
    audience_scope: AudienceScope;
    custom_notification_targets_attributes?: CustomNotificationTargetAttribute[];
    // null / "" removes the image; leave out on update to keep it. Never sent
    // together with a new banner_image file.
    banner_image_url?: string | null;
    // The complete list of files that should stay attached. Leave out to keep
    // the current files; [] removes all.
    attachment_ids?: number[];
  };
}

// Image files sent with create/update as multipart form data.
export interface NotificationFiles {
  bannerImage?: File | null; // custom_notification[banner_image]
  images?: File[]; // custom_notification[images][]
}

export interface SaveCustomNotificationVariables {
  payload: CreateCustomNotificationPayload;
  files?: NotificationFiles;
}

// Create and update return the detail object itself, not wrapped in
// `custom_notification`.
export type CreateCustomNotificationResponse = CustomNotificationDetail;

export type CustomNotificationFormPayload = CreateCustomNotificationPayload["custom_notification"];

export interface NotificationAttachment {
  id: number;
  name: string;
  url: string;
  content_type: string | null;
  size: number | null;
}

export type NotificationUploadKind = "image" | "attachment";

// POST /custom_notifications/upload.json
export interface UploadNotificationFileResponse {
  id: number;
  url: string;
  file_name: string;
  content_type: string;
  size: number;
  kind: NotificationUploadKind;
}

// GET /custom_notifications/:id.json — confirmed response shape (2026-08-24).
// The update endpoint (PUT) is still unconfirmed; assumed to accept the same
// `{ custom_notification: {...} }` body as create.
export interface CustomNotificationTargetDetail {
  id: number;
  targetable_type: NotificationTargetableType;
  targetable_id: number;
  targetable_value: string | null;
}

export interface CustomNotificationDetail extends CustomNotification {
  message: string;
  banner_image_url: string | null;
  deep_link_type: string | null;
  deep_link_value: string | null;
  audience_scope: AudienceScope;
  company_id: number;
  submitted_at: string | null;
  submitted_by_id: number | null;
  approved_at: string | null;
  approved_by_id: number | null;
  rejected_at: string | null;
  rejected_by_id: number | null;
  rejection_reason: string | null;
  cancelled_at: string | null;
  cancelled_by_id: number | null;
  targets: CustomNotificationTargetDetail[];
  // Always an array on the detail endpoint; optional until the backend is live.
  attachments?: NotificationAttachment[];
}

export interface CustomNotification {
  id: number;
  title: string;
  ntype: NotificationType | string;
  status: NotificationStatus | string;
  priority: NotificationPriority | string;
  created_by_id: number;
  created_at: string;
  scheduled_at: string | null;
  sent_at: string | null;
  expires_at: string | null;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  read_count: number;
  cooling_off_ends_at: string | null;
  cooling_off_active: boolean;
}

export interface CustomNotificationsMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
}

export interface CustomNotificationsResponse {
  custom_notifications: CustomNotification[];
  meta: CustomNotificationsMeta;
}

export interface NotificationTypeOption {
  value: string;
  label: string;
}

export interface NotificationTypesResponse {
  module_types: NotificationTypeOption[];
}

export interface CustomNotificationsQueryParams {
  status?: NotificationStatus | string;
  page?: number;
  per_page?: number;
}

// POST /custom_notifications/audience_preview — confirmed via curl.
export interface AudiencePreviewPayload {
  audience_scope: AudienceScope;
  company_id: number;
  ntype: NotificationType | string;
  targets: CustomNotificationTargetAttribute[];
}

export interface AudiencePreviewSample {
  id: number;
  name: string;
}

export interface AudiencePreviewResponse {
  total_recipients: number;
  sample: AudiencePreviewSample[];
}

// GET /custom_notifications/:id/recipients — confirmed via curl.
export interface NotificationRecipient {
  id: number;
  user_id: number;
  user_name: string;
  status: string;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  failure_reason: string | null;
}

export interface NotificationRecipientsMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
}

export interface NotificationRecipientsResponse {
  recipients: NotificationRecipient[];
  meta: NotificationRecipientsMeta;
}

// GET /custom_notification_approvers.json?pms_site_id= — confirmed via curl.
export interface CustomNotificationApprover {
  id: number;
  pms_site_id: number;
  user_id: number;
  user_name: string;
}

export interface CustomNotificationApproversResponse {
  pms_site_id: string;
  site_specific_approvers: CustomNotificationApprover[];
  effective_approver_ids: number[];
  using_global_default: boolean;
}

// POST /custom_notification_approvers.json — request confirmed via curl; the
// response shape has not been confirmed, so it's assumed to be the created
// approver row (same shape as one entry of site_specific_approvers).
export interface CreateCustomNotificationApproverPayload {
  pms_site_id: number;
  user_id: number;
}
