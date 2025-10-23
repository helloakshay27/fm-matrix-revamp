import axios from "axios";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";

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
      const token = urlParams.get('token');
      sessionStorage.setItem("token", token);
      if (!token) {
        throw new Error('No token found in URL');
      }

      // Call allowed companies API with the token from URL
      const response = await axios.get(`https://fm-matrix.lockated.com/allowed_companies.json?token=${token}`);
      const { selected_company } = response.data;

      if (selected_company && selected_company.org_backend_url) {
        config.baseURL = `https://${selected_company.org_backend_url}/`;
      } else {
        // Fallback URL if no selected company is found
        config.baseURL = 'https://fm-matrix.lockated.com/';
      }
    } catch (error) {
      console.error('Error fetching allowed companies:', error);
      // Fallback URL in case of error
      config.baseURL = 'https://fm-matrix.lockated.com/';
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
