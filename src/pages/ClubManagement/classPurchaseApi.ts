// API layer for the Class Purchase and Class Booking modules - both real endpoints
// (/pms/admin/class_purchases, /pms/admin/class_bookings) plus their shared dropdown
// sources (classes, packages, trainers, users). Kept side-by-side since a booking is
// always created against an existing purchase and both share the same class/user context.

import { apiClient } from "@/utils/apiClient";

// ---------------------------------------------------------------------------
// Dropdown sources
// ---------------------------------------------------------------------------

export interface ClubClassOption {
  id: string;
  name: string;
}

export async function fetchClubClasses(): Promise<ClubClassOption[]> {
  const res = await apiClient.get("/pms/admin/club_classes.json");
  const data = res.data;
  const list = Array.isArray(data) ? data : data?.club_classes ?? data?.data ?? [];
  return list.map((c: any) => ({ id: String(c.id), name: c.name ?? `Class ${c.id}` }));
}

export interface PackageOption {
  id: string;
  name: string;
  packageType: string;
  credits: number;
  validityDays: number;
  priceMember: number;
  priceHotelGuest: number;
  priceNonMember: number;
  cgstRate: number;
  sgstRate: number;
}

export async function fetchPackagesForClass(classId: string): Promise<PackageOption[]> {
  const res = await apiClient.get("/pms/admin/packages.json", {
    params: { "q[club_class_id_eq]": classId },
  });
  const data = res.data;
  const list = Array.isArray(data) ? data : data?.packages ?? data?.data ?? [];
  return list.map((p: any) => ({
    id: String(p.id),
    name: p.name ?? `Package ${p.id}`,
    packageType: p.package_type ?? "",
    credits: p.credits ?? 0,
    validityDays: p.validity_days ?? 0,
    priceMember: Number(p.price_member ?? 0),
    priceHotelGuest: Number(p.price_hotel_guest ?? 0),
    priceNonMember: Number(p.price_non_member ?? 0),
    cgstRate: Number(p.cgst_rate ?? 0),
    sgstRate: Number(p.sgst_rate ?? 0),
  }));
}

export interface TrainerOption {
  id: string;
  name: string;
}

export async function fetchTrainersForClass(): Promise<TrainerOption[]> {
  const res = await apiClient.get("/pms/admin/club_classes/trainer_list.json");
  const data = res.data;
  const list = Array.isArray(data) ? data : data?.trainers ?? data?.data ?? [];
  return list.map((t: any) => ({
    id: String(t.value ?? t.id),
    name: t.name ?? t.full_name ?? `Trainer ${t.id}`,
  }));
}

export interface UserOption {
  id: string;
  name: string;
  email: string;
  mobile: string;
}

const mapOccupantUser = (u: any): UserOption => ({
  id: String(u.id),
  name: `${u.firstname ?? ""} ${u.lastname ?? ""}`.trim() || u.email || `User ${u.id}`,
  email: u.email ?? "",
  mobile: u.mobile ?? "",
});

// Same occupant-users endpoint the Membership module's "select member" dropdowns use.
// Kept for callers that don't distinguish buyer type.
export async function fetchUsers(): Promise<UserOption[]> {
  const res = await apiClient.get("/pms/account_setups/occupant_users.json");
  const list = Array.isArray(res.data?.occupant_users) ? res.data.occupant_users : [];
  return list.map(mapOccupantUser);
}

// Matches AmenityBookingAdd's "Members" list - same endpoint, filtered to occupants.
export async function fetchOccupantUsers(): Promise<UserOption[]> {
  const res = await apiClient.get("/pms/account_setups/occupant_users.json", {
    params: { "q[lock_user_permissions_user_type_eq]": "pms_occupant", active: true },
  });
  const list = Array.isArray(res.data?.occupant_users) ? res.data.occupant_users : [];
  return list.map(mapOccupantUser);
}

// Matches AmenityBookingAdd's "Guest" list - same endpoint, filtered to guests.
export async function fetchGuestUsers(): Promise<UserOption[]> {
  const res = await apiClient.get("/pms/account_setups/occupant_users.json", {
    params: { "q[lock_user_permissions_user_type_eq]": "pms_guest", active: true },
  });
  const list = Array.isArray(res.data?.occupant_users) ? res.data.occupant_users : [];
  return list.map(mapOccupantUser);
}

// Matches AmenityBookingAdd's "Staff" list - a different endpoint entirely (FM users).
export async function fetchStaffUsers(): Promise<UserOption[]> {
  const res = await apiClient.get("/pms/users/get_escalate_to_users.json");
  const list = Array.isArray(res.data?.users) ? res.data.users : res.data?.fm_users ?? [];
  return list.map((u: any) => ({
    id: String(u.id),
    name: u.full_name || `${u.firstname ?? ""} ${u.lastname ?? ""}`.trim() || u.email || `User ${u.id}`,
    email: u.email ?? "",
    mobile: u.mobile ?? "",
  }));
}

// ---------------------------------------------------------------------------
// Class Purchases
// ---------------------------------------------------------------------------

export type PurchasePaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PurchaseStatus = "active" | "expired" | "cancelled";

export interface ClassPurchaseListItem {
  id: string;
  userId: string;
  userName: string;
  classId: string;
  className: string;
  packageId: string;
  packageName: string;
  packageType: string;
  totalSessions: number;
  remainingSessions: number;
  validityStartDate: string;
  validityEndDate: string;
  subtotal: number;
  discount: number;
  cgst: number;
  sgst: number;
  gst: number;
  total: number;
  paymentStatus: PurchasePaymentStatus;
  status: PurchaseStatus;
  invoiceNumber: string | null;
}

const mapClassPurchase = (p: any): ClassPurchaseListItem => ({
  id: String(p.id),
  userId: String(p.user_id ?? ""),
  userName: p.user_name ?? "",
  classId: String(p.club_class?.id ?? ""),
  className: p.club_class?.name ?? "",
  packageId: String(p.package?.id ?? ""),
  packageName: p.package?.name ?? "",
  packageType: p.package?.package_type ?? "",
  totalSessions: p.total_sessions ?? 0,
  remainingSessions: p.remaining_sessions ?? 0,
  validityStartDate: p.validity_start_date ?? "",
  validityEndDate: p.validity_end_date ?? "",
  subtotal: Number(p.subtotal ?? 0),
  discount: Number(p.discount ?? 0),
  cgst: Number(p.cgst ?? 0),
  sgst: Number(p.sgst ?? 0),
  gst: Number(p.gst ?? 0),
  total: Number(p.total ?? 0),
  paymentStatus: (p.payment_status ?? "pending") as PurchasePaymentStatus,
  status: (p.status ?? "active") as PurchaseStatus,
  invoiceNumber: p.invoice_number ?? null,
});

export interface ClassPurchaseListParams {
  page?: number;
  status?: PurchaseStatus | "";
  paymentStatus?: PurchasePaymentStatus | "";
  userId?: string;
  clubClassId?: string;
  search?: string;
}

export interface ClassPurchaseListResult {
  items: ClassPurchaseListItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export async function fetchClassPurchases(params: ClassPurchaseListParams): Promise<ClassPurchaseListResult> {
  const query: Record<string, string | number> = { page: params.page ?? 1, per_page: 20 };
  if (params.status) query["q[status_eq]"] = params.status;
  if (params.paymentStatus) query["q[payment_status_eq]"] = params.paymentStatus;
  if (params.userId) query["q[user_id_eq]"] = params.userId;
  if (params.clubClassId) query["q[club_class_id_eq]"] = params.clubClassId;
  if (params.search) query["q[user_name_cont]"] = params.search;

  const res = await apiClient.get("/pms/admin/class_purchases.json", { params: query });
  const data = res.data;
  const list = Array.isArray(data) ? data : data?.class_purchases ?? [];
  const pagination = data?.pagination ?? {};

  return {
    items: list.map(mapClassPurchase),
    totalCount: pagination.total_count ?? list.length,
    currentPage: pagination.current_page ?? params.page ?? 1,
    totalPages: pagination.total_pages ?? 1,
  };
}

export interface ClassMemberDetail {
  id: string;
  userId: string;
  userName: string;
  relationshipToBuyer: string;
}

export interface ClassPurchaseDetail extends ClassPurchaseListItem {
  cgstRate: number;
  sgstRate: number;
  members: ClassMemberDetail[];
}

export async function fetchClassPurchase(id: string): Promise<ClassPurchaseDetail> {
  const res = await apiClient.get(`/pms/admin/class_purchases/${id}.json`);
  const p = res.data?.class_purchase ?? res.data;
  return {
    ...mapClassPurchase(p),
    cgstRate: Number(p.cgst_rate ?? 0),
    sgstRate: Number(p.sgst_rate ?? 0),
    members: Array.isArray(p.class_members)
      ? p.class_members.map((m: any) => ({
          id: String(m.id),
          userId: String(m.user_id ?? ""),
          userName: m.user_name ?? "",
          relationshipToBuyer: m.relationship_to_buyer ?? "",
        }))
      : [],
  };
}

export interface CreateClassPurchasePayload {
  userId: string;
  clubClassId: string;
  packageId: string;
  discount: number;
  validityStartDate: string;
  validityEndDate: string;
  members: { userId: string; relationshipToBuyer: string }[];
}

export async function createClassPurchase(payload: CreateClassPurchasePayload) {
  const res = await apiClient.post("/pms/admin/class_purchases.json", {
    class_purchase: {
      user_id: Number(payload.userId),
      club_class_id: Number(payload.clubClassId),
      package_id: Number(payload.packageId),
      discount: payload.discount,
      validity_start_date: payload.validityStartDate,
      validity_end_date: payload.validityEndDate,
      class_members_attributes: payload.members.map((m) => ({
        user_id: Number(m.userId),
        relationship_to_buyer: m.relationshipToBuyer,
      })),
    },
  });
  return mapClassPurchase(res.data?.class_purchase ?? res.data);
}

export interface UpdateClassPurchasePayload {
  userId: string;
  clubClassId: string;
  packageId: string;
  discount: number;
  validityStartDate: string;
  validityEndDate: string;
}

// Full-form edit - PATCH /pms/admin/class_purchases/:id.json with the same
// class_purchase fields createClassPurchase sends, minus class_members_attributes.
export async function updateClassPurchase(id: string, payload: UpdateClassPurchasePayload) {
  const res = await apiClient.patch(`/pms/admin/class_purchases/${id}.json`, {
    class_purchase: {
      user_id: Number(payload.userId),
      club_class_id: Number(payload.clubClassId),
      package_id: Number(payload.packageId),
      discount: payload.discount,
      validity_start_date: payload.validityStartDate,
      validity_end_date: payload.validityEndDate,
    },
  });
  return mapClassPurchase(res.data?.class_purchase ?? res.data);
}

export async function payClassPurchase(id: string) {
  const res = await apiClient.post(`/pms/admin/class_purchases/${id}/pay.json`);
  return res.data;
}

export async function updateClassPurchaseStatus(
  id: string,
  patch: Partial<{
    status: PurchaseStatus;
    paymentStatus: PurchasePaymentStatus;
    validityStartDate: string;
    validityEndDate: string;
    discount: number;
  }>
) {
  const body: Record<string, unknown> = {};
  if (patch.status) body.status = patch.status;
  if (patch.paymentStatus) body.payment_status = patch.paymentStatus;
  if (patch.validityStartDate) body.validity_start_date = patch.validityStartDate;
  if (patch.validityEndDate) body.validity_end_date = patch.validityEndDate;
  if (patch.discount !== undefined) body.discount = patch.discount;

  const res = await apiClient.patch(`/pms/admin/class_purchases/${id}.json`, { class_purchase: body });
  return res.data;
}

export async function extendClassPurchaseValidity(id: string, newTill: string, reason: string) {
  const res = await apiClient.post(`/pms/admin/class_purchases/${id}/extend_validity.json`, {
    new_till: newTill,
    reason,
  });
  return res.data;
}

export async function cancelClassPurchase(id: string) {
  const res = await apiClient.post(`/pms/admin/class_purchases/${id}/cancel.json`);
  return res.data;
}

export function classPurchaseInvoicePdfUrl(id: string): string {
  return `/pms/admin/class_purchases/${id}/show_pdf.json`;
}

// ---------------------------------------------------------------------------
// Class Bookings
// ---------------------------------------------------------------------------

export type BookingStatus = "booked" | "attended" | "no_show" | "cancelled" | "rescheduled";

export interface ClassBookingListItem {
  id: string;
  status: BookingStatus;
  bookingDate: string;
  startTime: string;
  endTime: string;
  slotTimeIds: number[];
  remainingCredits: number;
  userName: string;
  trainerId: string;
  trainerName: string;
  clubClassId: string;
  className: string;
  baseAmount: number;
  cgst: number;
  sgst: number;
  landedAmount: number;
}

const mapClassBooking = (b: any): ClassBookingListItem => ({
  id: String(b.id),
  status: (b.status ?? "booked") as BookingStatus,
  bookingDate: b.booking_date ?? "",
  startTime: b.start_time ?? "",
  endTime: b.end_time ?? "",
  slotTimeIds: Array.isArray(b.slot_time_ids) ? b.slot_time_ids : [],
  remainingCredits: b.remaining_credits ?? 0,
  userName: b.user_name ?? "",
  // The wireframe's sample JSON only shows the denormalized names, but a reschedule needs
  // the trainer/class ids to re-query available_slot_times - read them defensively from
  // whichever shape the API actually sends (flat id, or a nested trainer/club_class object).
  trainerId: String(b.trainer_id ?? b.trainer?.id ?? ""),
  trainerName: b.trainer_name ?? b.trainer?.name ?? "",
  clubClassId: String(b.club_class_id ?? b.club_class?.id ?? ""),
  className: b.class_name ?? b.club_class?.name ?? "",
  baseAmount: Number(b.base_amount ?? 0),
  cgst: Number(b.cgst ?? 0),
  sgst: Number(b.sgst ?? 0),
  landedAmount: Number(b.landed_amount ?? 0),
});

export interface ClassBookingListParams {
  page?: number;
  status?: BookingStatus | "";
  userId?: string;
  clubClassId?: string;
  trainerId?: string;
  classPurchaseId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ClassBookingListResult {
  items: ClassBookingListItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export async function fetchClassBookings(params: ClassBookingListParams): Promise<ClassBookingListResult> {
  const query: Record<string, string | number> = { page: params.page ?? 1 };
  if (params.status) query["q[status_eq]"] = params.status;
  if (params.userId) query["q[user_id_eq]"] = params.userId;
  if (params.clubClassId) query["q[club_class_id_eq]"] = params.clubClassId;
  if (params.trainerId) query["q[trainer_id_eq]"] = params.trainerId;
  if (params.classPurchaseId) query["q[class_purchase_id_eq]"] = params.classPurchaseId;
  if (params.dateFrom) query["q[booking_date_gteq]"] = params.dateFrom;
  if (params.dateTo) query["q[booking_date_lteq]"] = params.dateTo;
  if (params.search) query["q[user_name_cont]"] = params.search;

  const res = await apiClient.get("/pms/admin/class_bookings.json", { params: query });
  const data = res.data;
  const list = Array.isArray(data) ? data : data?.class_bookings ?? [];
  const pagination = data?.pagination ?? {};

  return {
    items: list.map(mapClassBooking),
    totalCount: pagination.total_count ?? list.length,
    currentPage: pagination.current_page ?? params.page ?? 1,
    totalPages: pagination.total_pages ?? 1,
  };
}

export interface ClassBookingDetail extends ClassBookingListItem {
  cancelledAt: string | null;
  cancelledReason: string | null;
  attendance: { status: string } | null;
}

export async function fetchClassBooking(id: string): Promise<ClassBookingDetail> {
  const res = await apiClient.get(`/pms/admin/class_bookings/${id}.json`);
  const b = res.data?.class_booking ?? res.data;
  return {
    ...mapClassBooking(b),
    cancelledAt: b.cancelled_at ?? null,
    cancelledReason: b.cancelled_reason ?? null,
    attendance: b.class_attendance ?? null,
  };
}

export interface CreateClassBookingPayload {
  userId: string;
  clubClassId: string;
  trainerId: string;
  classPurchaseId: string;
  bookingDate: string;
  slotTimeIds: number[];
  discount?: number;
}

export async function createClassBooking(payload: CreateClassBookingPayload) {
  const res = await apiClient.post("/pms/admin/class_bookings.json", {
    class_booking: {
      user_id: Number(payload.userId),
      club_class_id: Number(payload.clubClassId),
      trainer_id: Number(payload.trainerId),
      class_purchase_id: Number(payload.classPurchaseId),
      booking_date: payload.bookingDate,
      slot_time_ids: payload.slotTimeIds,
      discount: payload.discount ?? 0,
    },
  });
  return mapClassBooking(res.data?.class_booking ?? res.data);
}

export async function cancelClassBooking(id: string, reason: string) {
  const res = await apiClient.post(`/pms/admin/class_bookings/${id}/cancel.json`, { reason });
  return res.data;
}

export async function rescheduleClassBooking(
  id: string,
  bookingDate: string,
  startTime: string,
  endTime: string
) {
  const res = await apiClient.post(`/pms/admin/class_bookings/${id}/reschedule.json`, {
    booking_date: bookingDate,
    start_time: startTime,
    end_time: endTime,
  });
  return mapClassBooking(res.data?.class_booking ?? res.data);
}

export interface SlotTimeOption {
  id: number;
  label: string;
  available: number;
}

export async function fetchAvailableSlotTimes(
  trainerId: string,
  date: string,
  clubClassId: string
): Promise<SlotTimeOption[]> {
  const res = await apiClient.get(`/pms/admin/trainers/${trainerId}/available_slot_times.json`, {
    params: { date, club_class_id: clubClassId },
  });
  const data = res.data;
  const list = Array.isArray(data) ? data : data?.slot_times ?? data?.data ?? [];
  return list.map((s: any) => ({
    id: Number(s.id),
    label: s.label ?? s.timing ?? s.time ?? `Slot ${s.id}`,
    available: s.available ?? 0,
  }));
}

// Purchases usable as the source for a new booking: paid, active, with sessions left.
export async function fetchUsablePurchasesForUser(userId: string): Promise<ClassPurchaseListItem[]> {
  const result = await fetchClassPurchases({ userId, paymentStatus: "paid", status: "active" });
  return result.items.filter((p) => p.remainingSessions > 0);
}
