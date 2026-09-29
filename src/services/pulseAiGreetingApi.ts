import axios from "axios";
import { getBaseUrl, getToken } from "@/utils/auth";

// Same host-from-localStorage pattern as carpoolAnalyticsApi.ts / pulseAiAlertsApi.ts.
const greetingClient = axios.create();

greetingClient.interceptors.request.use((config) => {
  const token = getToken();
  config.baseURL = getBaseUrl() ?? "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.params = { ...config.params, access_token: token };
  }
  return config;
});

export type PartOfDay = "morning" | "afternoon" | "evening" | "night";

export interface PulseAiGreetingResponse {
  code: number;
  user_name: string;
  part_of_day: PartOfDay;
  greeting: string;
  quote: string;
}

export const fetchPulseAiGreeting = () =>
  greetingClient.get<PulseAiGreetingResponse>("/pulse_ai_greeting.json").then((res) => res.data);
