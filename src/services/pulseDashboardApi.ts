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

// ── Users ─────────────────────────────────────────────────────────────────────

export interface UsersKpi {
  total_users: number; admins: number; occupants: number;
  occupant_admins: number; org_admins: number;
  male: number; female: number; new_users: number;
}

export const fetchUsersKpi = (f: PulseFilters) =>
  get<UsersKpi>("/users_kpi.json", toParams(f));

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

export interface EventsByCategory {
  categories: { category: string | null; total_events: number; total_registrations: number }[];
}

export const fetchEventsByCategory = (f: PulseFilters) =>
  get<EventsByCategory>("/events_by_category.json", toParams(f));

export interface TopEvents {
  top_events: {
    event_id: number; event_name: string; site_name: string;
    from_time: string; to_time: string; is_paid: boolean;
    total_registrations: number; attended: number;
  }[];
}

export const fetchTopEvents = (f: PulseFilters) =>
  get<TopEvents>("/top_events.json", toParams(f));

// ── Notices ───────────────────────────────────────────────────────────────────

export interface NoticeboardKpi {
  total: number; active: number; inactive: number; important: number;
  expired: number; expiring_soon: number; show_on_home: number; shared: number;
}

export const fetchNoticeboardKpi = (f: PulseFilters) =>
  get<NoticeboardKpi>("/noticeboard_kpi.json", toParams(f));

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
