import axios from "axios";
import { getBaseUrl, getToken } from "@/utils/auth";
import type { PulseFilters } from "@/services/pulseDashboardApi";

// Unlike pulseDashboardApi's fixed PULSE_BASE_URL, the carpool backend host is
// read from localStorage (same value the rest of the app logs in against),
// so it's resolved per-request rather than baked into a single baseURL.
const carpoolClient = axios.create();

carpoolClient.interceptors.request.use((config) => {
  const token = getToken();
  config.baseURL = getBaseUrl() ?? "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.params = { ...config.params, access_token: token };
  }
  return config;
});

function toParams(f: PulseFilters): Record<string, string> {
  const p: Record<string, string> = { from_date: f.fromDate, to_date: f.toDate };
  if (f.siteIds.length > 0) p.site_ids = f.siteIds.join(",");
  return p;
}

async function get<T = unknown>(path: string, params?: Record<string, string>): Promise<T> {
  const res = await carpoolClient.get<T>(path, { params });
  return res.data;
}

// Response shapes for these six endpoints aren't confirmed against a live
// backend yet, so every fetcher returns the raw payload and the section
// component (PulseCarpool.tsx) normalizes it defensively at render time.

export const fetchCarpoolKpi = (f: PulseFilters) =>
  get("/carpool_kpi.json", toParams(f));

export const fetchCarpoolTrend = (f: PulseFilters) =>
  get("/carpool_trend.json", toParams(f));

export const fetchCarpoolTrust = (f: PulseFilters) =>
  get("/carpool_trust.json", toParams(f));

export const fetchCarpoolTopDrivers = (f: PulseFilters) =>
  get("/carpool_top_drivers.json", toParams(f));

export const fetchCarpoolRidesList = (f: PulseFilters, page: number) =>
  get("/carpool_rides_list.json", { ...toParams(f), page: String(page) });

export const fetchCarpoolReportedRidesList = (f: PulseFilters, page: number) =>
  get("/carpool_reported_rides_list.json", { ...toParams(f), page: String(page) });
