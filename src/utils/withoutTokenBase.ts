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
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const email = urlParams.get("email");
      const organizationId = urlParams.get("organization_id");

      // Store token in session storage if available
      if (token) {
        sessionStorage.setItem("token", token);
      }

      if (!email || !organizationId) {
        throw new Error("Email or organization_id not found in URL");
      }

      // Determine API URL based on hostname
      const hostname = window.location.hostname;
      const isOmanSite = hostname.includes("oig.gophygital.work");
      const isViSite =
        hostname.includes("vi-web.gophygital.work") ||
        hostname.includes("web.gophygital.work");
      const isFmSite =
        hostname.includes("fm-uat.gophygital.work") ||
        hostname.includes("fm.gophygital.work");

      let apiUrl = "";

      if (isOmanSite || isFmSite) {
        apiUrl = `https://uat.lockated.com/api/users/get_organizations_by_email.json?email=${email}`;
      } else if (isViSite) {
        apiUrl = `https://live-api.gophygital.work/api/users/get_organizations_by_email.json?email=${email}`;
      } else {
        // Default fallback
        apiUrl = `https://uat.lockated.com/api/users/get_organizations_by_email.json?email=${email}`;
      }

      // Call organizations API with the email from URL
      const response = await axios.get(apiUrl);
      const { organizations } = response.data;

      if (organizations && organizations.length > 0) {
        // Find the organization matching the organization_id from URL
        const selectedOrg = organizations.find(
          (org: Organization) => org.id === parseInt(organizationId)
        );

        if (selectedOrg && selectedOrg.backend_domain) {
          // Set baseURL from the organization's backend_domain
          config.baseURL = selectedOrg.backend_domain;
          console.log("Base URL set to:", selectedOrg.backend_domain);
        } else {
          // Fallback URL if organization not found or no backend_domain
          config.baseURL = "https://fm-uat-api.lockated.com/";
          console.warn(
            "Organization not found or no backend_domain, using fallback URL"
          );
        }
      } else {
        // Fallback URL if no organizations found
        config.baseURL = "https://fm-uat-api.lockated.com/";
        console.warn("No organizations found, using fallback URL");
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      // Fallback URL in case of error
      config.baseURL = "https://fm-uat-api.lockated.com/";
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
