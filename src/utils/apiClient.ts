import axios, { AxiosRequestHeaders } from "axios";
import { API_CONFIG, getAuthHeader, getFullUrl } from "@/config/apiConfig";
import {
  getEmbeddedConfig,
  isEmbeddedMode,
  getEmbeddedToken,
  getEmbeddedOrgId,
  resolveBaseUrlByOrgId,
  storeEmbeddedData,
} from "@/utils/embeddedMode";

// Create configured axios instance (do not set a global Content-Type)
export const apiClient = axios.create({});

// Request interceptor to dynamically set baseURL and auth header
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Check for embedded mode first
      const embeddedConfig = getEmbeddedConfig();
      const embeddedOrgId = getEmbeddedOrgId();
      const embeddedToken = getEmbeddedToken();

      // If embedded mode with org_id, resolve base URL dynamically
      if ((embeddedConfig.isEmbedded || embeddedOrgId) && embeddedOrgId) {
        console.warn(
          "🔌 Embedded mode detected in apiClient, org_id:",
          embeddedOrgId
        );

        // Store embedded data if not already stored
        if (embeddedConfig.accessToken) {
          storeEmbeddedData(embeddedConfig);
        }

        // Resolve base URL dynamically based on org_id
        const resolvedBaseUrl = await resolveBaseUrlByOrgId(embeddedOrgId);
        config.baseURL = resolvedBaseUrl;

        // Use embedded token for authorization
        const headers: AxiosRequestHeaders =
          (config.headers as AxiosRequestHeaders) ||
          ({} as AxiosRequestHeaders);

        if (embeddedToken) {
          headers.Authorization = `Bearer ${embeddedToken}`;
        } else {
          headers.Authorization = getAuthHeader();
        }
        config.headers = headers;

        console.warn("✅ apiClient using embedded baseURL:", resolvedBaseUrl);
      } else {
        // Standard flow - use localStorage baseURL
        config.baseURL = API_CONFIG.BASE_URL;

        // Dynamically set auth header from localStorage
        const headers: AxiosRequestHeaders =
          (config.headers as AxiosRequestHeaders) ||
          ({} as AxiosRequestHeaders);
        headers.Authorization = getAuthHeader();
        config.headers = headers;
      }

      // If sending FormData, let the browser set the Content-Type with boundary
      if (config.data instanceof FormData) {
        // Let the browser/axios set proper multipart boundary. Remove any preset Content-Type.
        if ((config.headers as AxiosRequestHeaders)["Content-Type"]) {
          delete (config.headers as AxiosRequestHeaders)["Content-Type"];
        }
      }

      return config;
    } catch (error) {
      console.error("❌ Error in apiClient interceptor:", error);
      // Fallback to standard config
      config.baseURL = API_CONFIG.BASE_URL;
      const headers: AxiosRequestHeaders =
        (config.headers as AxiosRequestHeaders) || ({} as AxiosRequestHeaders);
      headers.Authorization = getAuthHeader();
      config.headers = headers;
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    console.error("API Error:", error.response?.data || error.message);

    // Handle authentication errors - logout globally
    if (error.response?.status === 401) {
      console.warn("401 Unauthorized - Logging out globally");

      // Clear all auth data
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to login page
      window.location.href = "/login";

      return Promise.reject(new Error("Session expired. Please login again."));
    }

    // Handle network errors - logout globally
    if (error.message === "Network Error" || !error.response) {
      console.warn("Network Error - Logging out globally");

      // Clear all auth data
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to login page
      window.location.href = "/login";

      return Promise.reject(
        new Error(
          "Network error. Please check your connection and login again."
        )
      );
    }

    return Promise.reject(error);
  }
);

export const apiClientUtil = {
  put: async <T>(endpoint: string, data: any): Promise<T> => {
    const baseUrl = API_CONFIG.BASE_URL;
    if (!baseUrl || baseUrl === "https://fm-uat-api.lockated.com/") {
      throw new Error(
        "API base URL is not configured. Please set VITE_API_BASE_URL in your .env file or ensure it is set in localStorage."
      );
    }

    // Determine backend URL based on base URL
    let backendUrl: string;
    if (baseUrl === "https://fm-matrix.lockated.com/") {
      backendUrl = "https://fm-matrix.lockated.com/";
    } else if (baseUrl === "https://oig.gophygital.work/") {
      backendUrl = "https://oig.gophygital.work/";
    } else {
      backendUrl = baseUrl; // fallback to original base URL
    }

    const url = `${backendUrl}${endpoint.startsWith("/") ? endpoint.slice(1) : endpoint}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

export default apiClient;
