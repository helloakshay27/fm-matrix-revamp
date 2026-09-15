import axios from "axios";

// Mirrors the per-feature axios client pattern used in
// pulse_notifications/api/customNotificationsApi.ts — baseURL resolved from
// the tenant's stored baseUrl so this works across environments (UAT/prod).
const GATE_INTEGRATION_BASE_URL = `https://${localStorage.getItem("baseUrl")}`;

export const gateIntegrationClient = axios.create({
  baseURL: GATE_INTEGRATION_BASE_URL,
});

gateIntegrationClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
