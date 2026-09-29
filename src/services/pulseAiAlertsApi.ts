import axios from "axios";
import { getBaseUrl, getToken } from "@/utils/auth";
import type { PulseFilters } from "@/services/pulseDashboardApi";

// Same host-from-localStorage pattern as carpoolAnalyticsApi.ts.
const alertsClient = axios.create();

alertsClient.interceptors.request.use((config) => {
  const token = getToken();
  config.baseURL = getBaseUrl() ?? "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.params = { ...config.params, access_token: token };
  }
  return config;
});

export type AlertSeverity = "critical" | "warning" | "info";

export interface PulseAiAlert {
  module: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  action: string;
  metric: string;
}

export interface PulseAiAlertsResponse {
  code: number;
  total: number;
  alerts: PulseAiAlert[];
  alerts_by_module: Record<string, PulseAiAlert[]>;
}

function toParams(f: PulseFilters): Record<string, string> {
  const p: Record<string, string> = { from_date: f.fromDate, to_date: f.toDate };
  if (f.siteIds.length > 0) p.site_ids = f.siteIds.join(",");
  return p;
}

export const fetchPulseAiAlerts = (f: PulseFilters) =>
  alertsClient
    .get<PulseAiAlertsResponse>("/pulse_ai_alerts.json", { params: toParams(f) })
    .then((res) => res.data);
