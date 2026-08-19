import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";

const PULSE_BASE_URL = "https://pulse-uat-api.panchshil.com";

const pulseClient = axios.create({ baseURL: PULSE_BASE_URL });

// Mirror the same token injection pattern used in ticketAnalyticsAPI / assetAnalyticsAPI:
// - Authorization header (Bearer)
// - access_token query param (some pulse endpoints require this)
pulseClient.interceptors.request.use((config) => {
  const token = API_CONFIG.TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Append access_token to every request's params
    config.params = { ...config.params, access_token: token };
  }
  return config;
});

export interface PulseFilters {
  siteIds: number[];
  fromDate: string;
  toDate: string;
}

function toParams(f: PulseFilters): Record<string, string> {
  const p: Record<string, string> = { from_date: f.fromDate, to_date: f.toDate };
  if (f.siteIds.length > 0) p.site_ids = f.siteIds.join(",");
  return p;
}

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const res = await pulseClient.get<T>(path, { params });
  return res.data;
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

export interface SiteFilterResponse {
  company_id: number;
  firstname: string;
  lastname: string;
  sites: { site_id: number; site_name: string }[];
}

export const fetchSitesFilter = () =>
  get<SiteFilterResponse>("/dashboard_sites_filter.json");

// ── Customers ─────────────────────────────────────────────────────────────────

export interface EntityKpi {
  total: number; active: number; inactive: number;
  with_leases: number; with_domains: number;
  leases_expired: number; leases_expiring: number;
  free_parking: number; paid_parking: number;
}

export const fetchEntityKpi = (f: PulseFilters) =>
  get<EntityKpi>("/entity_kpi.json", toParams(f));

export interface EntitiesBySite {
  sites: { site_id: number; site_name: string; total: number; active: number; inactive: number }[];
}

export const fetchEntitiesBySite = (f: PulseFilters) =>
  get<EntitiesBySite>("/entities_by_site.json", toParams(f));

export interface EntityListResponse {
  entities: {
    entity_id: number; name: string; customer_type: string; active: string;
    email: string; mobile: string; site_name: string;
    leases: { lease_start_date: string; lease_end_date: string; free_parking: number; paid_parking: number }[];
    domains: string[];
  }[];
  pagination: { current_page: number; total_count: number; total_pages: number; per_page: number };
}

export const fetchEntityList = (f: PulseFilters, page: number) =>
  get<EntityListResponse>("/entity_list.json", { ...toParams(f), page: String(page) });

export interface EntityBreakdown {
  breakdown: { name: string; user_count: number; active_user_count: number; inactive_user_count: number }[];
}

export const fetchEntityBreakdown = (f: PulseFilters) =>
  get<EntityBreakdown>("/entity_breakdown.json", toParams(f));

export interface TenantsOverview {
  filters: { site_ids: number[]; from_date: string | null; to_date: string | null };
  kpis: { total_customers: number; active_customers: number; inactive_customers: number };
  monthly_growth: {
    growth_percentage: number;
    trend: "up" | "down";
    current_period_total: number;
    previous_period_total: number;
    labels: string[];
    data: number[];
    points: { month: string; label: string; count: number }[];
  };
}

export const fetchTenantsOverview = (f: PulseFilters) =>
  get<TenantsOverview>("/tenants_overview.json", toParams(f));

export interface TenantsDetailsSummary {
  total_tenants: number;
  total_users: number;
  tenants_with_users: number;
  average_users_per_tenant: number;
}

export interface TenantEntry {
  id: number;
  name: string;
  users_count: number;
}

export interface TenantsDetailsResponse {
  filters: { site_ids: number[] };
  summary: TenantsDetailsSummary;
  top_tenants: (TenantEntry & { rank: number })[];
  tenants: TenantEntry[];
}

// Unlike the other Pulse endpoints this one takes `site_id` (singular) and
// no date range — it's a snapshot of current tenants, not a period report.
export const fetchTenantsDetails = (f: PulseFilters) =>
  get<TenantsDetailsResponse>(
    "/tenants_details",
    f.siteIds.length > 0 ? { site_id: f.siteIds.join(",") } : undefined
  );

export interface TenantTableEntry {
  serial: number;
  id: number;
  name: string;
  domain: string | null;
  domains: string[];
  type: string | null;
  site_id: number;
  site_name: string;
  active: boolean;
  status: string;
}

export interface TenantTableResponse {
  filters: { site_ids: number[] };
  pagination: { current_page: number; per_page: number; total_count: number; total_pages: number };
  tenants: TenantTableEntry[];
}

// Also `site_id` (singular) + paginated, no date range — backs the
// Entity Management Directory table.
export const fetchTenantTable = (f: PulseFilters, page: number, perPage = 20) =>
  get<TenantTableResponse>("/tenant_table", {
    ...(f.siteIds.length > 0 ? { site_id: f.siteIds.join(",") } : {}),
    page: String(page),
    per_page: String(perPage),
  });


// ── Users ─────────────────────────────────────────────────────────────────────

export interface UsersKpi {
  total_users: number; admins: number; occupants: number;
  occupant_admins: number; org_admins: number;
  male: number; female: number; new_users: number;
}

export const fetchUsersKpi = (f: PulseFilters) =>
  get<UsersKpi>("/users_kpi.json", toParams(f));

export interface UsersOverviewKpis {
  total_users: number;
  admin_users: number;
  occupant_users: number;
  occupant_admin_users: number;
  organization_admin_users: number;
  total_users_growth: number;
  total_users_trend: "up" | "down" | "flat";
  total_users_growth_percentage: number;
  admin_users_growth: number;
  admin_users_trend: "up" | "down" | "flat";
  admin_users_growth_percentage: number;
}

export interface UsersGrowthTrendPoint {
  month: string;
  label: string;
  users: number;
  admins: number;
  occupants: number;
}

export interface UserTypeBreakdownEntry {
  user_type: string | null;
  count: number;
  percentage: number;
}

export interface GenderBreakdownEntry {
  gender: string;
  label: string;
  count: number;
  percentage: number;
}

export interface UsersOverview {
  filters: { site_ids: number[]; from_date: string | null; to_date: string | null };
  kpis: UsersOverviewKpis;
  growth_trend: {
    current_period_users: number;
    previous_period_users: number;
    current_period_admins: number;
    previous_period_admins: number;
    labels: string[];
    series: { users: number[]; admins: number[]; occupants: number[] };
    points: UsersGrowthTrendPoint[];
  };
  user_type_breakdown: UserTypeBreakdownEntry[];
  gender_distribution: {
    males: number;
    females: number;
    unspecified: number;
    breakdown: GenderBreakdownEntry[];
  };
}

// Also `site_id` (singular) rather than `site_ids` — mirrors the other
// recently-added Pulse endpoints.
export const fetchUsersOverview = (f: PulseFilters) => {
  const params: Record<string, string> = { from_date: f.fromDate, to_date: f.toDate };
  if (f.siteIds.length > 0) params.site_id = f.siteIds.join(",");
  return get<UsersOverview>("/users_overview", params);
};

export interface UsersBySite {
  sites: {
    site_id: number; site_name: string; total: number;
    admins: number; occupants: number; occupant_admins: number;
    male: number; female: number;
  }[];
}

export const fetchUsersBySite = (f: PulseFilters) =>
  get<UsersBySite>("/users_by_site.json", toParams(f));

export interface PulseUsersResponse {
  users: {
    user_id: number; user_name: string; user_type: string;
    email: string; mobile: string; alternate_mobile: string | null; status: string;
  }[];
  pagination: { current_page: number; total_count: number; total_pages: number; per_page: number };
}

export const fetchPulseUsers = (f: PulseFilters, page: number, userType?: string) =>
  get<PulseUsersResponse>("/pulse_users.json", {
    ...toParams(f),
    page: String(page),
    ...(userType ? { user_type: userType } : {}),
  });

export interface UserDetailEntry {
  serial: number;
  id: number;
  name: string;
  firstname: string;
  lastname: string | null;
  email: string;
  user_type: string | null;
  site_id: number;
  site_name: string;
}

export interface UsersDetailsResponse {
  filters: { site_ids: number[] };
  pagination: { current_page: number; per_page: number; total_count: number; total_pages: number };
  users: UserDetailEntry[];
}

// Also `site_id` (singular), paginated, no user_type filter param — backs
// the User Details table.
export const fetchUsersDetails = (f: PulseFilters, page: number, perPage = 20) =>
  get<UsersDetailsResponse>("/users_details", {
    ...(f.siteIds.length > 0 ? { site_id: f.siteIds.join(",") } : {}),
    page: String(page),
    per_page: String(perPage),
  });

// ── Amenities ─────────────────────────────────────────────────────────────────

export interface AmenitiesKpi {
  total_bookings: number; confirmed: number; pending: number;
  cancelled: number; failed: number; bookable: number;
  request_type: number; total_revenue: number;
  wallet_payments: number; online_payments: number;
}

export const fetchAmenitiesKpi = (f: PulseFilters) =>
  get<AmenitiesKpi>("/amenities_kpi.json", toParams(f));

export interface AmenitiesUtilization {
  facilities: {
    facility_id: number; facility_name: string; site_name: string;
    fac_type: string; total: number; confirmed: number;
    pending: number; cancelled: number; revenue: number;
  }[];
}

export const fetchAmenitiesUtilization = (f: PulseFilters) =>
  get<AmenitiesUtilization>("/amenities_utilization.json", toParams(f));

export interface AmenitiesListResponse {
  amenities: {
    facility_id: number; facility_name: string; fac_type: string;
    max_people: number; min_people: number; complementary: string;
    prepaid: string; postpaid: string; active: string;
  }[];
  pagination: { current_page: number; total_count: number; total_pages: number; per_page: number };
}

export const fetchAmenitiesList = (f: PulseFilters, page: number) =>
  get<AmenitiesListResponse>("/amenities_list.json", { ...toParams(f), page: String(page) });

export interface AmenityBreakdown {
  breakdown: { name: string; total_count: number; request_count: number; bookable_count: number }[];
}

export const fetchAmenityBreakdown = (f: PulseFilters) =>
  get<AmenityBreakdown>("/amenity_breakdown.json", toParams(f));

export interface FacilitiesOverview {
  filters: { site_ids: number[]; from_date: string | null; to_date: string | null };
  kpis: {
    total_bookings: number;
    active_facilities: number;
    total_revenue: number;
  };
  booking_status: {
    total: number;
    breakdown: { status: string; count: number; percentage: number }[];
  };
  payment_channels: {
    total: number;
    breakdown: { payment_method: string; count: number; percentage: number }[];
  };
  revenue_by_facility: { name: string; revenue: number }[];
}

// Also `site_id` (singular) rather than `site_ids` — mirrors the other
// recently-added Pulse endpoints.
export const fetchFacilitiesOverview = (f: PulseFilters) => {
  const params: Record<string, string> = { from_date: f.fromDate, to_date: f.toDate };
  if (f.siteIds.length > 0) params.site_id = f.siteIds.join(",");
  return get<FacilitiesOverview>("/facilities_overview", params);
};

export interface FacilityUtilizationTrendPoint {
  month: string;
  label: string;
  new: number;
  returning: number;
  bookable: number;
  requestable: number;
  total: number;
}

export interface FacilityUtilizationEntry {
  name: string;
  bookings: number;
  booked_slots: number;
  configured_slots: number;
  utilisation_percentage: number;
}

export interface FacilityUtilizationOverview {
  filters: { site_ids: number[]; from_date: string | null; to_date: string | null };
  summary: {
    current_period_bookings: number;
    previous_period_bookings: number;
    growth_percentage: number;
    trend: "up" | "down" | "flat";
  };
  labels: string[];
  utilisation_trend: {
    growth_percentage: number;
    trend: "up" | "down" | "flat";
    series: { new: number[]; returning: number[] };
  };
  bookable_vs_requestable: {
    growth_percentage: number;
    trend: "up" | "down" | "flat";
    series: { bookable: number[]; requestable: number[] };
  };
  utilisation_by_facility: {
    window_days: number;
    facilities: FacilityUtilizationEntry[];
  };
  points: FacilityUtilizationTrendPoint[];
}

// Also `site_id` (singular), no date range in this sample but the response
// shape carries from_date/to_date same as the other overview endpoints.
export const fetchFacilityUtilization = (f: PulseFilters) => {
  const params: Record<string, string> = { from_date: f.fromDate, to_date: f.toDate };
  if (f.siteIds.length > 0) params.site_id = f.siteIds.join(",");
  return get<FacilityUtilizationOverview>("/facility_utilization", params);
};

export interface FacilityBookingEntry {
  serial: number;
  id: number;
  facility_name: string;
  facility_type: string;
  current_status: string;
  booking_date: string;
  duration_minutes: number;
  user_id: number;
  user_name: string;
  entity_id: number;
  tenant: string;
  amount_full: number;
  amount_paid: number;
  site_id: number;
  site_name: string;
}

export interface FacilitiesDetailsResponse {
  filters: { site_ids: number[]; from_date: string | null; to_date: string | null };
  pagination: { current_page: number; per_page: number; total_count: number; total_pages: number };
  bookings: FacilityBookingEntry[];
}

// Also `site_id` (singular), paginated — backs the Facility Booking Logs table.
export const fetchFacilitiesDetails = (f: PulseFilters, page: number, perPage = 20) => {
  const params: Record<string, string> = {
    from_date: f.fromDate,
    to_date: f.toDate,
    page: String(page),
    per_page: String(perPage),
  };
  if (f.siteIds.length > 0) params.site_id = f.siteIds.join(",");
  return get<FacilitiesDetailsResponse>("/facilities_details", params);
};

// ── Events ────────────────────────────────────────────────────────────────────

export interface EventsKpi {
  total_events: number; upcoming_events: number; past_events: number;
  complementary_events: number; paid_events: number;
  requestable_events: number; pending_requests: number; total_registrations: number;
}

export const fetchEventsKpi = (f: PulseFilters) =>
  get<EventsKpi>("/events_kpi.json", toParams(f));

export interface EventsRegistrationsKpi {
  total_registrations: number; approved: number; pending: number;
  rejected: number; attended: number; paid_registrations: number; attendance_rate: number;
}

export const fetchEventsRegistrationsKpi = (f: PulseFilters) =>
  get<EventsRegistrationsKpi>("/events_registrations_kpi.json", toParams(f));

export interface EventsOverviewTrendPoint {
  month: string;
  label: string;
  approved: number;
  rejected: number;
  pending: number;
  total: number;
}

export interface EventsOverview {
  filters: { site_ids: number[]; from_date: string | null; to_date: string | null };
  event_status: {
    total_events: number;
    upcoming_events: number;
    past_events: number;
    complimentary_events: number;
    paid_events: number;
  };
  registration_metrics: {
    approved: number;
    pending: number;
    rejected: number;
    attended: number;
    paid_registrations: number;
    total_registrations: number;
    total_capacity: number;
    registration_rate: number;
    approval_rate: number;
  };
  registration_trend: {
    current_period_registrations: number;
    previous_period_registrations: number;
    growth: number;
    growth_percentage: number;
    trend: "up" | "down" | "flat";
    labels: string[];
    series: { approved: number[]; rejected: number[]; pending: number[]; total: number[] };
    points: EventsOverviewTrendPoint[];
  };
}

// Also `site_id` (singular) — mirrors the other recently-added Pulse endpoints.
export const fetchEventsOverview = (f: PulseFilters) => {
  const params: Record<string, string> = { from_date: f.fromDate, to_date: f.toDate };
  if (f.siteIds.length > 0) params.site_id = f.siteIds.join(",");
  return get<EventsOverview>("/events_overview", params);
};

export interface EventsByCategory {
  categories: { category: string | null; total_events: number; total_registrations: number }[];
}

export const fetchEventsByCategory = (f: PulseFilters) =>
  get<EventsByCategory>("/events_by_category.json", toParams(f));

export interface EventsBreakup {
  filters: { site_ids: number[]; from_date: string | null; to_date: string | null };
  revenue_by_event: {
    total_revenue: number;
    events: { name: string; revenue: number }[];
  };
  category_breakdown: { category: string; count: number; percentage: number }[];
}

// Also `site_id` (singular) — mirrors the other recently-added Pulse endpoints.
export const fetchEventsBreakup = (f: PulseFilters) => {
  const params: Record<string, string> = { from_date: f.fromDate, to_date: f.toDate };
  if (f.siteIds.length > 0) params.site_id = f.siteIds.join(",");
  return get<EventsBreakup>("/events_breakup", params);
};

export interface TopEvents {
  top_events: {
    event_id: number; event_name: string; site_name: string;
    from_time: string; to_time: string; is_paid: boolean;
    total_registrations: number; attended: number;
  }[];
}

export const fetchTopEvents = (f: PulseFilters) =>
  get<TopEvents>("/top_events.json", toParams(f));

export interface EventDetailEntry {
  serial: number;
  id: number;
  title: string;
  description: string;
  category: string | null;
  location: string;
  from_time: string;
  to_time: string;
  is_paid: boolean;
  complimentary: boolean;
  capacity: number;
  registrations: number;
  site_id: number;
  site_name: string;
}

export interface EventsDetailsResponse {
  filters: { site_ids: number[]; from_date: string | null; to_date: string | null };
  pagination: { current_page: number; per_page: number; total_count: number; total_pages: number };
  events: EventDetailEntry[];
}

// Also `site_id` (singular), paginated — backs the events directory table.
export const fetchEventsDetails = (f: PulseFilters, page: number, perPage = 20) => {
  const params: Record<string, string> = {
    from_date: f.fromDate,
    to_date: f.toDate,
    page: String(page),
    per_page: String(perPage),
  };
  if (f.siteIds.length > 0) params.site_id = f.siteIds.join(",");
  return get<EventsDetailsResponse>("/events_details", params);
};

// ── Notices ───────────────────────────────────────────────────────────────────

export interface NoticeboardKpi {
  total: number; active: number; inactive: number; important: number;
  expired: number; expiring_soon: number; show_on_home: number; shared: number;
}

export const fetchNoticeboardKpi = (f: PulseFilters) =>
  get<NoticeboardKpi>("/noticeboard_kpi.json", toParams(f));

export interface NoticeboardOverview {
  filters: { site_ids: number[]; from_date: string | null; to_date: string | null };
  kpis: {
    total_notices: number;
    active_notices: number;
    inactive_notices: number;
    expired_notices: number;
    important_notices: number;
  };
  weekly_active_broadcast: {
    total: number;
    days: { date: string; count: number }[];
  };
}

// Also `site_id` (singular) — mirrors the other recently-added Pulse endpoints.
export const fetchNoticeboardOverview = (f: PulseFilters) => {
  const params: Record<string, string> = { from_date: f.fromDate, to_date: f.toDate };
  if (f.siteIds.length > 0) params.site_id = f.siteIds.join(",");
  return get<NoticeboardOverview>("/noticeboard_overview", params);
};

export interface NoticeboardBySite {
  sites: {
    site_id: number; site_name: string; total: number;
    active_count: number; important_count: number; expired_count: number;
  }[];
}

export const fetchNoticeboardBySite = (f: PulseFilters) =>
  get<NoticeboardBySite>("/noticeboard_by_site.json", toParams(f));

export interface NoticeboardListResponse {
  notices: {
    notice_id: number; heading: string; status: string;
    is_important: boolean; active: boolean; expire_time: string;
    is_expired: boolean; sites: { site_name: string }[]; created_by: string;
  }[];
  pagination: { current_page: number; total_count: number; total_pages: number; per_page: number };
}

export const fetchNoticeboardList = (f: PulseFilters, page: number) =>
  get<NoticeboardListResponse>("/noticeboard_list.json", { ...toParams(f), page: String(page) });

export interface NoticeboardDetailEntry {
  serial: number;
  id: number;
  notice_heading: string;
  notice_text: string;
  created_at: string;
  is_important: boolean;
  site_id: number;
  site_name: string;
}

export interface NoticeboardDetailsResponse {
  filters: { site_ids: number[]; from_date: string | null; to_date: string | null };
  pagination: { current_page: number; per_page: number; total_count: number; total_pages: number };
  notices: NoticeboardDetailEntry[];
}

// Also `site_id` (singular), paginated — backs the Official Noticeboard Feed table.
export const fetchNoticeboardDetails = (f: PulseFilters, page: number, perPage = 20) => {
  const params: Record<string, string> = {
    from_date: f.fromDate,
    to_date: f.toDate,
    page: String(page),
    per_page: String(perPage),
  };
  if (f.siteIds.length > 0) params.site_id = f.siteIds.join(",");
  return get<NoticeboardDetailsResponse>("/noticeboard_details", params);
};

// ── Community ─────────────────────────────────────────────────────────────────

export interface CommunityKpis {
  total_communities: number; active_communities: number; inactive_communities: number;
}

export const fetchCommunityKpis = (f: PulseFilters) =>
  get<CommunityKpis>("/community_kpis.json", toParams(f));

export interface TopCommunities {
  top_communities: { community_id: number; name: string; member_count: number }[];
}

export const fetchTopCommunities = (f: PulseFilters) =>
  get<TopCommunities>("/top_communities.json", toParams(f));

export interface CommunityGrowthTrend {
  months: string[];
  communities: { name: string; data: number[] }[];
}

export const fetchCommunityGrowthTrend = (f: PulseFilters) =>
  get<CommunityGrowthTrend>("/community_growth_trend.json", toParams(f));

export interface CommunityBreakdown {
  breakdown: {
    name: string; total_count: number; approved_count: number;
    pending_count: number; rejected_count: number;
  }[];
}

export const fetchCommunityBreakdown = (f: PulseFilters) =>
  get<CommunityBreakdown>("/community_breakdown.json", toParams(f));

export interface CommunityOverview {
  filters: { company_id: number; from_date: string | null; to_date: string | null };
  kpis: {
    total_communities: number;
    active_communities: number;
    inactive_communities: number;
    total_members: number;
  };
  new_members_this_month: {
    month: string;
    label: string;
    count: number;
    previous_month_count: number;
    growth: number;
    growth_percentage: number;
    trend: "up" | "down" | "flat";
  };
  top_communities: {
    rank: number;
    community_id: number;
    name: string;
    active: boolean;
    members_count: number;
    percentage: number;
  }[];
  member_growth_trend: {
    growth_percentage: number;
    trend: "up" | "down" | "flat";
    current_period_members: number;
    previous_period_members: number;
    labels: string[];
    data: number[];
    points: { month: string; label: string; members: number }[];
    series: {
      community_id: number;
      name: string;
      active: boolean;
      category: string | null;
      community_type: string | null;
      members_count: number;
      data: number[];
      total: number;
      previous_period_total: number;
      growth_percentage: number;
    }[];
  };
}

// Company-scoped, not site-scoped like the other Pulse endpoints — no
// site_id param, just an optional from_date/to_date range.
export const fetchCommunityOverview = (f: PulseFilters) =>
  get<CommunityOverview>("/community_overview", { from_date: f.fromDate, to_date: f.toDate });

export interface CommunityEngagementBreakdownEntry {
  community_id: number;
  community_name: string;
  active: boolean;
  total_members: number;
  status_wise_breakdown: {
    approved: number;
    exited: number;
    pending: number;
    rejected: number;
  };
}

export interface CommunityParticipationTrendPoint {
  month: string;
  label: string;
  total_participants: number;
  active_contributors: number;
  engagement_rate: number;
}

export interface CommunityEngagement {
  filters: { company_id: number; from_date: string | null; to_date: string | null };
  statuses: string[];
  status_totals: { approved: number; exited: number; pending: number; rejected: number };
  community_breakdown: CommunityEngagementBreakdownEntry[];
  participation_trend: {
    labels: string[];
    series: { total_participants: number[]; active_contributors: number[] };
    points: CommunityParticipationTrendPoint[];
  };
  engagement: {
    total_participants: number;
    approved_memberships: number;
    engaged_members: number;
    not_engaged_members: number;
    engagement_rate: number;
    total_posts: number;
  };
}

// Also company-scoped, no site_id param.
export const fetchCommunityEngagement = (f: PulseFilters) =>
  get<CommunityEngagement>("/community_engagement", { from_date: f.fromDate, to_date: f.toDate });

// ── Carpool ───────────────────────────────────────────────────────────────────

export interface RideOverviewResponse {
  filters: { site_ids: number[]; from_date: string | null; to_date: string | null };
  kpis: {
    total_rides: number;
    rides_in_range: number;
    total_drivers: number;
    total_passengers: number;
    completed_rides: number;
    cancelled_rides: number;
    seats_offered: number;
    seats_filled: number;
    seats_utilization: number;
  };
  rides_trend: {
    growth_percentage: number;
    trend: "up" | "down";
    current_period_rides: number;
    previous_period_rides: number;
    labels: string[];
    series: { rides_offered: number[]; requests_received: number[]; seats_filled: number[] };
    points: {
      month: string;
      label: string;
      rides_offered: number;
      requests_received: number;
      seats_filled: number;
    }[];
  };
  peak_hours: {
    morning_rides: number;
    evening_rides: number;
    peak_hour: { hour: number; label: string; period: "morning" | "evening"; rides: number; requests: number };
    hours: { hour: number; label: string; period: "morning" | "evening"; rides: number; requests: number }[];
  };
  ride_completion: {
    completed: number;
    cancelled: number;
    decided_rides: number;
    completion_rate: number;
    cancellation_rate: number;
    status_breakdown: { status: string; count: number; percentage: number }[];
  };
  ride_match: {
    matched_requests: number;
    total_requests: number;
    success_rate: number;
    current_month_rate: number;
    previous_month_rate: number;
    change: number;
    trend: "up" | "down";
    labels: string[];
    data: number[];
  };
}

export const fetchCarpoolRideOverview = (f: PulseFilters) =>
  get<RideOverviewResponse>("/ride_overview.json", toParams(f));

export interface RideRoutesTrafficResponse {
  filters: { site_ids: number[]; from_date: string | null; to_date: string | null; precision: number; limit: number };
  summary: { total_rides: number; total_routes: number; total_nodes: number };
  nodes: {
    id: string;
    label: string;
    latitude: number;
    longitude: number;
    rides_out: number;
    rides_in: number;
    total_rides: number;
  }[];
  routes: {
    from: string;
    to: string;
    from_label: string;
    to_label: string;
    from_latitude: number;
    from_longitude: number;
    to_latitude: number;
    to_longitude: number;
    rides: number;
    completed_rides: number;
    cancelled_rides: number;
    seats_offered: number;
    passengers: number;
    share: number;
    intensity: "high" | "med" | "low";
  }[];
}

export const fetchCarpoolRideRoutesTraffic = (f: PulseFilters, limit = 20) =>
  get<RideRoutesTrafficResponse>("/ride_routes_traffics", { ...toParams(f), limit: String(limit) });

export interface TopDriversResponse {
  filters: { site_ids: number[] };
  pagination: { current_page: number; per_page: number; total_count: number; total_pages: number };
  ride_statuses: string[];
  drivers: {
    serial: number;
    driver_id: number;
    name: string;
    total_rides: number;
    completed_rides: number;
    cancelled_rides: number;
    status_wise_rides: Record<string, number>;
    passengers_carried: number;
    seats_offered: number;
    seats_requested: number;
    requests_received: number;
    seat_utilization: number;
  }[];
}

export const fetchTopDrivers = (f: PulseFilters, page = 1, perPage = 10) =>
  get<TopDriversResponse>("/top_drivers.json", { ...toParams(f), page: String(page), per_page: String(perPage) });

export interface RideDetailsResponse {
  filters: { site_ids: number[]; from_date: string | null; to_date: string | null };
  pagination: { current_page: number; per_page: number; total_count: number; total_pages: number };
  rides: {
    serial: number;
    id: number;
    status: string;
    site_id: number;
    site_name: string;
    driver_id: number;
    driver_name: string;
    vehicle_id: number;
    vehicle_name: string;
    registration_number: string;
    fuel_type: string;
    start_location: string;
    end_location: string;
    start_time: string;
  }[];
}

export const fetchRideDetails = (f: PulseFilters, page = 1, perPage = 20) =>
  get<RideDetailsResponse>("/ride_details.json", { ...toParams(f), page: String(page), per_page: String(perPage) });

export interface ReportDetailsResponse {
  filters: { site_ids: number[]; from_date: string | null; to_date: string | null };
  pagination: { current_page: number; per_page: number; total_count: number; total_pages: number };
  reports: {
    serial: number;
    id: number;
    issue_type: string;
    description: string;
    status: string;
    reported_on: string;
    active: boolean;
    ride_id: number;
    ride_status: string;
    rider_name: string;
    start_location: string;
    end_location: string;
    site_id: number | null;
    site_name: string | null;
    reporter_id: number;
    reporter_name: string;
    reported_user_id: number;
    reported_user_name: string;
  }[];
}

export const fetchReportDetails = (f: PulseFilters, page = 1, perPage = 20) =>
  get<ReportDetailsResponse>("/report_details.json", { ...toParams(f), page: String(page), per_page: String(perPage) });
