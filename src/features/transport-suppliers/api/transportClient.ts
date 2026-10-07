import axios from "axios";

export const transportClient = axios.create();

// Base URL and token are resolved per request so a tenant/login switch
// without a full reload still hits the right environment.
transportClient.interceptors.request.use((config) => {
  const baseUrl = localStorage.getItem("baseUrl");
  config.baseURL = `https://${baseUrl}`;
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
