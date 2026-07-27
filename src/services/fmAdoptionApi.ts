import axios from "axios";

// FM Adoption Analytics API — see FM_ADOPTION_API_CURLS.md at repo root.
// No auth header, no `team` param — team is fixed server-side. `url` is
// fixed to the FM Matrix tenant host; this service only exposes date + site.
const FM_ADOPTION_BASE_URL = "https://posthog-api.lockated.com";
const FM_ADOPTION_TENANT_URL = "fm-matrix.lockated.com";

const client = axios.create({ baseURL: FM_ADOPTION_BASE_URL });

export interface FmAdoptionFilters {
  siteIds: string[];
  fromDate: string; // YYYY-MM-DD
  toDate: string; // YYYY-MM-DD
}

function toParams(f: FmAdoptionFilters): Record<string, string> {
  const p: Record<string, string> = {
    url: FM_ADOPTION_TENANT_URL,
    from: f.fromDate,
    to: f.toDate,
  };
  if (f.siteIds.length > 0) p.site_id = f.siteIds.join(",");
  return p;
}

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const res = await client.get<T>(path, { params });
  return res.data;
}

interface Meta {
  metric: string;
  filters: { url: string; site_id: string[]; device_type: string[]; from: string; to: string };
  generated_at: string;
}

export interface OverviewResponse {
  meta: Meta;
  tiles: {
    active_users: number;
    screen_views: number;
    sessions: number;
    views_per_session: number;
    avg_session_seconds: number;
    bounce_rate: number;
    recently_online: number;
  };
  device_split: { device: string; sessions: number }[];
}

export const fetchOverview = (f: FmAdoptionFilters) =>
  get<OverviewResponse>("/fm/adoption/overview", toParams(f));

export interface TimeseriesResponse {
  meta: Meta;
  series: { day: string; users: number; views: number; sessions: number }[];
}

export const fetchTimeseries = (f: FmAdoptionFilters) =>
  get<TimeseriesResponse>("/fm/adoption/timeseries", toParams(f));

export interface EngagementResponse {
  meta: Meta;
  stickiness: { value: number; avg_dau: number; mau: number };
  module_breadth: { in_use: number; total: number };
}

export const fetchEngagement = (f: FmAdoptionFilters) =>
  get<EngagementResponse>("/fm/adoption/engagement", toParams(f));

export interface ModulesResponse {
  meta: Meta;
  modules: { module: string; events: number; users: number }[];
}

export const fetchModules = (f: FmAdoptionFilters) =>
  get<ModulesResponse>("/fm/adoption/modules", toParams(f));

export interface EventsResponse {
  meta: Meta;
  events: { name: string; events: number; users: number }[];
}

export const fetchEvents = (f: FmAdoptionFilters) =>
  get<EventsResponse>("/fm/adoption/events", toParams(f));

export interface SitesResponse {
  meta: Meta;
  sites: { site_id: string; site_name: string; company_name: string; users: number; sessions: number; events: number }[];
}

export const fetchSites = (f: FmAdoptionFilters) =>
  get<SitesResponse>("/fm/adoption/sites", toParams(f));

export interface RolesResponse {
  meta: Meta;
  roles: { role: string; users: number; events: number }[];
}

export const fetchRoles = (f: FmAdoptionFilters) =>
  get<RolesResponse>("/fm/adoption/roles", toParams(f));
