import axios from "axios";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";

// Organization type for API response
interface Organization {
  id: number;
  name: string;
  backend_domain: string;
  frontend_domain: string;
  active: boolean;
}

// Create configured axios instance
export const baseClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

baseClient.interceptors.request.use(
  async (config) => {
    try {
      // Extract URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const email = urlParams.get("email");
      const organizationId = urlParams.get("organization_id");
      const orgId = urlParams.get("org_id");

      // Store token in session storage if available
      if (token) {
        sessionStorage.setItem("token", token);
        console.log("✅ Token stored in session storage");
      }

      // Determine site type based on hostname
      const hostname = window.location.hostname;
      const isOmanSite = hostname.includes("oig.gophygital.work");
      const isViSite =
        hostname.includes("vi-web.gophygital.work") ||
        hostname.includes("web.gophygital.work");
      const isFmSite =
        hostname.includes("fm-uat.gophygital.work") ||
        hostname.includes("fm.gophygital.work") ||
        hostname.includes("fm-matrix.lockated.com");

      // Build API URL based on site type and available parameters
      let apiUrl = "";

      if (isOmanSite || isFmSite) {
        // FM/Oman sites: prefer org_id, fallback to email
        if (orgId) {
          apiUrl = `https://fm-uat-api.lockated.com/api/users/get_organizations_by_email.json?org_id=${orgId}`;
          console.log("🔍 Using org_id for FM/Oman site:", orgId);
        } else if (email) {
          apiUrl = `https://uat.lockated.com/api/users/get_organizations_by_email.json?email=${email}`;
          console.log("🔍 Using email for FM/Oman site:", email);
        } else {
          throw new Error(
            "Either org_id or email is required for FM/Oman sites"
          );
        }
      } else if (isViSite) {
        // VI sites: use email
        if (orgId) {
          apiUrl = `https://live-api.gophygital.work/api/users/get_organizations_by_email.json?org_id=${orgId}`;
          console.log("🔍 Using org_id for VI site:", orgId);
        } else if (email) {
          apiUrl = `https://live-api.gophygital.work/api/users/get_organizations_by_email.json?email=${email}`;
          console.log("🔍 Using email for VI site:", email);
        } else {
          throw new Error(
            "Either org_id or email is required for VI sites"
          );
        }
      } else {
        // Default fallback: prefer org_id, fallback to email
        if (orgId) {
          apiUrl = `https://fm-uat-api.lockated.com/api/users/get_organizations_by_email.json?org_id=${orgId}`;
          console.log("🔍 Using org_id for default fallback:", orgId);
        } else if (email) {
          apiUrl = `https://uat.lockated.com/api/users/get_organizations_by_email.json?email=${email}`;
          console.log("🔍 Using email for default fallback:", email);
        } else {
          throw new Error("Either org_id or email is required");
        }
      }

      // Fetch organizations from API
      console.log("📡 Fetching organizations from:", apiUrl);
      const response = await axios.get(apiUrl);
      const { organizations, backend_url } = response.data;

      // Priority 1: Use backend_url from API response (highest priority)
      if (backend_url) {
        config.baseURL = backend_url;
        console.log(
          "✅ Base URL set from API response backend_url:",
          backend_url
        );
        return config;
      }

      // Priority 2: Find organization by organizationId and use its backend_domain
      if (organizations && organizations.length > 0) {
        if (organizationId) {
          const selectedOrg = organizations.find(
            (org: Organization) => org.id === parseInt(organizationId)
          );

          if (selectedOrg && selectedOrg.backend_domain) {
            config.baseURL = selectedOrg.backend_domain;
            console.log(
              "✅ Base URL set from organization backend_domain:",
              selectedOrg.backend_domain
            );
            return config;
          } else if (selectedOrg) {
            console.warn(
              "⚠️ Organization found but no backend_domain available"
            );
          } else {
            console.warn(
              "⚠️ Organization with ID",
              organizationId,
              "not found in response"
            );
          }
        }

        // Priority 3: Use first organization's backend_domain if available
        const firstOrg = organizations[0];
        if (firstOrg.backend_domain) {
          config.baseURL = firstOrg.backend_domain;
          console.log(
            "✅ Base URL set from first organization backend_domain:",
            firstOrg.backend_domain
          );
          return config;
        }
      }

      // Priority 4: Fallback URL
      config.baseURL = "https://fm-uat-api.lockated.com/";
      console.warn("⚠️ Using fallback URL:", config.baseURL);
    } catch (error) {
      console.error("❌ Error in request interceptor:", error);
      // Always set a fallback URL on error
      config.baseURL = "https://fm-uat-api.lockated.com/";
      console.warn("⚠️ Using fallback URL due to error:", config.baseURL);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* 
baseClient.interceptors.request.use(
  (config) => {
    // Get current frontend base URL
    const baseUrl = window.location.origin + '/';
    
    // Dynamically set backend API URL based on frontend URL
    let backendUrl: string;
    if (baseUrl === 'https://fm-matrix.lockated.com/') {
      backendUrl = 'https://fm-uat-api.lockated.com/';
    } else if (baseUrl === 'https://oig.gophygital.work/') {
      backendUrl = 'https://oig.gophygital.work/';
    } else {
      // Default fallback to OIG API
      backendUrl = 'https://fm-uat-api.lockated.com/';
    }
    
    config.baseURL = backendUrl;
    // config.baseURL = "https://fm-uat-api.lockated.com"
    // Dynamically set auth header from localStorage
    // config.headers.Authorization = getAuthHeader()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
*/

// Response interceptor for error handling
baseClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default baseClient;
