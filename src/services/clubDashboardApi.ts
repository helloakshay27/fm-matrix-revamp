// Branch Manager dashboard APIs for the Club Management module.
// Backs src/pages/ClubManagement/dashboard - see
// "The Recess Club — Dashboard v6 APIs (Branch Manager)" Postman collection.
//
// Auth + base URL are handled automatically by `apiClient` (Bearer token from
// localStorage via its request interceptor) - callers never set headers.
import { apiClient } from "@/utils/apiClient";
import { format, subYears } from "date-fns";

export interface DateRangeParams {
  from_date?: string;
  to_date?: string;
}

// Every date-scoped endpoint here defaults to the trailing one year unless a caller overrides it.
export function defaultDateRange(): Required<DateRangeParams> {
  const now = new Date();
  return {
    from_date: format(subYears(now, 1), "yyyy-MM-dd"),
    to_date: format(now, "yyyy-MM-dd"),
  };
}

function qs(params: object): string {
  const sp = new URLSearchParams();
  Object.entries(params as Record<string, string | number | undefined>).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      sp.append(key, String(value));
    }
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// ───────────────────────── Branch Overview ─────────────────────────

export interface MemberOverview {
  active_members: number;
  inactive_members: number;
}
export async function getMemberOverview(params: DateRangeParams): Promise<MemberOverview> {
  const res = await apiClient.get(`/club_management_dashboard/member_overview.json${qs(params)}`);
  return res.data.data;
}

export interface GroupMembershipRow {
  group_name: string;
  plan: string;
  members: number;
  payment_frequency: string;
  expiry: string;
  status: string;
}
export interface GroupMemberships {
  groups_count: number;
  members_count: number;
  groups: GroupMembershipRow[];
}
export async function getGroupMemberships(status = "active"): Promise<GroupMemberships> {
  const res = await apiClient.get(`/club_management_dashboard/group_memberships.json${qs({ status })}`);
  return res.data.data;
}

export interface GuestOverview {
  guests: number;
  active: number;
  inactive: number;
  new_this_month: number;
}
export async function getGuestOverview(params: DateRangeParams): Promise<GuestOverview> {
  const res = await apiClient.get(`/club_management_dashboard/guest_overview.json${qs(params)}`);
  return res.data.data;
}

export interface StaffOverview {
  staff: number;
  active: number;
  inactive: number;
  on_duty_today: number;
}
export async function getStaffOverview(params: DateRangeParams): Promise<StaffOverview> {
  const res = await apiClient.get(`/club_management_dashboard/staff_overview.json${qs(params)}`);
  return res.data.data;
}

// ───────────────────────── Payments ─────────────────────────

export interface BillingOverview {
  billed: number;
  collection: number;
  pending: number;
  overdue: number;
}
export async function getBillingOverview(params: DateRangeParams): Promise<BillingOverview> {
  const res = await apiClient.get(`/club_management_dashboard/billing_overview.json${qs(params)}`);
  return res.data.data;
}

// The Postman collection's note claimed this was a flat object with no `data` wrapper, but the
// real endpoint actually returns { data: { payment_methods: {...} } } - confirmed against a live
// response. Unwrap it the same way as every other endpoint here.
export type PaymentMethodMix = Record<string, number>;
export async function getPaymentMethods(params: DateRangeParams): Promise<PaymentMethodMix> {
  const res = await apiClient.get(`/club_management_dashboard/payment_methods.json${qs(params)}`);
  return res.data.data.payment_methods;
}

export interface CancellationRateTrendPoint {
  month: string;
  total_bookings: number;
  cancelled_bookings: number;
  cancellation_rate: number;
}
export async function getCancellationRateTrend(params: DateRangeParams): Promise<CancellationRateTrendPoint[]> {
  const res = await apiClient.get(`/club_management_dashboard/cancellation_rate_trend.json${qs(params)}`);
  return res.data.cancellation_rate_trend;
}

export interface OverdueInvoiceRow {
  account: string;
  amount: number;
  aged: string;
  action: string;
}
export async function getOverdueInvoices(params: DateRangeParams): Promise<OverdueInvoiceRow[]> {
  const res = await apiClient.get(`/club_management_dashboard/overdue_invoices.json${qs(params)}`);
  return res.data.data.overdue_invoices;
}

export interface PendingPaymentRow {
  member: string;
  type: string;
  context: string;
  for: string;
  amount: number;
  since: string;
  action: string;
}
export async function getPendingPayments(params: DateRangeParams): Promise<PendingPaymentRow[]> {
  const res = await apiClient.get(`/club_management_dashboard/pending_payments.json${qs(params)}`);
  return res.data.data.pending_payments;
}

// ───────────────────────── Membership ─────────────────────────

export async function getActiveMembersCount(params: DateRangeParams): Promise<number> {
  const res = await apiClient.get(`/club_management_dashboard/active_members.json${qs(params)}`);
  return res.data.data.active_members;
}

export interface NewJoinVsExpiryPoint {
  month: string;
  new: number;
  expired: number;
}
export async function getNewJoinVsExpiries(params: DateRangeParams): Promise<NewJoinVsExpiryPoint[]> {
  const res = await apiClient.get(`/club_management_dashboard/new_join_vs_expiries.json${qs(params)}`);
  return res.data.data.new_join_vs_expiries;
}

export interface MembershipByPaymentPlan {
  yearly: number;
  half_yearly: number;
  quarterly: number;
  monthly: number;
}
export async function getMembershipByPaymentPlan(params: DateRangeParams): Promise<MembershipByPaymentPlan> {
  const res = await apiClient.get(`/club_management_dashboard/membership_by_payment_plan.json${qs(params)}`);
  return res.data;
}

export interface PlanDistributionEntry {
  plan: string;
  count: number;
  percentage: number;
}
export async function getPlanDistribution(params: DateRangeParams): Promise<PlanDistributionEntry[]> {
  const res = await apiClient.get(`/club_management_dashboard/plan_distribution.json${qs(params)}`);
  return res.data.data.plan_distribution;
}

export interface MembershipDaysRemainingRow {
  member_name: string;
  plan: string;
  days_left: number;
  free_bookings: number | string;
  status: string;
}
export async function getActiveMembershipDaysRemaining(params: DateRangeParams): Promise<MembershipDaysRemainingRow[]> {
  const res = await apiClient.get(`/club_management_dashboard/active_membership_days_remaining.json${qs(params)}`);
  return res.data.active_memberships_days_remaining;
}

export async function getUpcomingRenewalsCount(params: DateRangeParams): Promise<number> {
  const res = await apiClient.get(`/club_management_dashboard/upcoming_renewals.json${qs(params)}`);
  return res.data.data.upcoming_renewals;
}

export interface UpcomingRenewalRow {
  member_name: string;
  plan: string;
  expiry: string;
  phone: string;
}
export async function getUpcomingRenewalsList(params: DateRangeParams): Promise<UpcomingRenewalRow[]> {
  const res = await apiClient.get(`/club_management_dashboard/upcoming_renewals_list.json${qs(params)}`);
  return res.data.data.upcoming_renewals_list;
}

// ───────────────────────── Amenities & Bookings ─────────────────────────

export interface BookingSummary {
  total_bookings: number;
  member: number;
  guest: number;
  staff: number;
}
export async function getBookingSummary(params: DateRangeParams & { range?: string; months?: number }): Promise<BookingSummary> {
  const res = await apiClient.get(`/amenities_club_dashboard/booking_summary.json${qs(params)}`);
  return res.data.booking_summary;
}

export interface AvailableSlotsByDay {
  date: string;
  hours: number[];
  facilities: {
    facility_id: number;
    facility_name: string;
    slots: { hour: number; available: number; status: "full" | "last_slot" | "limited" | "open" }[];
  }[];
}
export async function getAvailableSlotsByDay(date: string): Promise<AvailableSlotsByDay> {
  const res = await apiClient.get(`/amenities_club_dashboard/available_slots_by_day.json${qs({ date })}`);
  return res.data.available_slots_by_day;
}

export interface DailyUtilisation {
  day: string;
  average_utilisation: number;
}
export async function getWeekdayVsWeekendUtilisation(params: DateRangeParams): Promise<DailyUtilisation[]> {
  const res = await apiClient.get(`/amenities_club_dashboard/weekday_vs_weekend_utilisation.json${qs(params)}`);
  return res.data.weekday_vs_weekend_utilisation.daily_utilisation;
}

export interface LeadTimeBucket {
  bucket: string;
  count: number;
}
export async function getBookingLeadTimeDistribution(params: DateRangeParams): Promise<LeadTimeBucket[]> {
  const res = await apiClient.get(`/amenities_club_dashboard/booking_lead_time_distribution.json${qs(params)}`);
  return res.data.booking_lead_time_distribution;
}

export interface MonthlyAmenityBreakdown {
  month: string;
  total_bookings: number;
  amenities: { amenity: string; booking_count: number; percentage: number }[];
}
export async function getMonthlyBookingPercentageByAmenity(params: DateRangeParams): Promise<MonthlyAmenityBreakdown[]> {
  const res = await apiClient.get(`/amenities_club_dashboard/monthly_booking_percentage_by_amenity.json${qs(params)}`);
  return res.data.data.monthly_booking_percentage_by_amenity;
}

export interface CancellationRateByAmenityRow {
  amenity: string;
  cancellation_rate: number;
}
export async function getCancellationRateByAmenity(params: DateRangeParams): Promise<CancellationRateByAmenityRow[]> {
  const res = await apiClient.get(`/amenities_club_dashboard/cancellation_rate_by_amenity.json${qs(params)}`);
  return res.data.data.cancellation_rate_by_amenity;
}

// ───────────────────────── Capacity & Blocks ─────────────────────────

export interface CapacityOverview {
  total_amenities: number;
  active_amenities: number;
  available_today: number;
  blocked_slot_days_mtm: number;
  advance_window: string | null;
}
export async function getCapacityOverview(): Promise<CapacityOverview> {
  const res = await apiClient.get(`/amenities_club_dashboard/capacity_overview.json`);
  return res.data.capacity_overview;
}

export interface AmenityUtilisationRow {
  amenity_name: string;
  average_utilization_percentage: number;
}
export async function getAmenityUtilizationAnalysis(params: DateRangeParams): Promise<AmenityUtilisationRow[]> {
  const res = await apiClient.get(`/amenities_club_dashboard/amenity_utilization_analysis.json${qs(params)}`);
  return res.data.amenities;
}

export interface BlockedByAmenityRow {
  amenity: string;
  type: string;
  blocked_days: number;
  blocked_slots: number;
  reason: string;
  status: string;
}
export async function getBlockedByAmenity(params: DateRangeParams): Promise<BlockedByAmenityRow[]> {
  const res = await apiClient.get(`/amenities_club_dashboard/blocked_by_amenity.json${qs(params)}`);
  return res.data.blocked_by_amenity;
}

export interface BlockedSlotsByAmenityRow {
  amenity: string;
  blocked_slots: number;
  peak_impact: string;
  reason: string;
  status: string;
}
export async function getBlockedSlotsByAmenity(params: DateRangeParams): Promise<BlockedSlotsByAmenityRow[]> {
  const res = await apiClient.get(`/amenities_club_dashboard/blocked_slots_by_amenity.json${qs(params)}`);
  return res.data.blocked_slots;
}

export interface CancelledBookingRow {
  member: string;
  type: string;
  amenity: string;
  slot: string;
  reason: string;
}
export async function getCancelledBookings(params: DateRangeParams): Promise<CancelledBookingRow[]> {
  const res = await apiClient.get(`/amenities_club_dashboard/cancelled_bookings.json${qs(params)}`);
  return res.data.cancelled_bookings;
}

// ───────────────────────── Tickets ─────────────────────────

export async function getOpenTicketsCount(params: DateRangeParams): Promise<number> {
  const res = await apiClient.get(`/club_management_dashboard/open_tickets_count.json${qs(params)}`);
  return res.data.data.open_tickets_count;
}

export interface TicketAgeBucket {
  age_bucket: string;
  ticket_count: number;
}
export async function getOpenTicketsByAge(): Promise<TicketAgeBucket[]> {
  const res = await apiClient.get(`/amenities_club_dashboard/open_tickets_by_age.json`);
  return res.data.open_tickets_by_age;
}

export interface TicketCategoryRow {
  category: string;
  ticket_count: number;
}
export async function getTicketCategoryDistribution(): Promise<TicketCategoryRow[]> {
  const res = await apiClient.get(`/amenities_club_dashboard/open_tickets_by_category.json`);
  return res.data.ticket_category_distribution;
}

// ───────────────────────── Events ─────────────────────────

export interface EventFillRateRow {
  event: string;
  date: string;
  type: string;
  fill_rate: string;
  seats: string;
}
export async function getRegistrationFillRateUpcomingEvents(params: DateRangeParams): Promise<EventFillRateRow[]> {
  const res = await apiClient.get(`/amenities_club_dashboard/registration_fill_rate_upcoming_events.json${qs(params)}`);
  return res.data.registration_fill_rate_upcoming_events;
}

export interface EventRegistrationTrendRow {
  event: string;
  percentage: string;
}
export async function getEventRegistrationTrend(params: DateRangeParams): Promise<EventRegistrationTrendRow[]> {
  const res = await apiClient.get(`/amenities_club_dashboard/event_registration_trend.json${qs(params)}`);
  return res.data.event_registration_trend;
}
