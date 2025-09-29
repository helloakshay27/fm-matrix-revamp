import axios from 'axios'
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig'

// Create configured axios instance
export const baseClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

baseClient.interceptors.request.use(
  (config) => {
    const { hostname } = window.location;
    const orgsRaw = localStorage.getItem('baseUrl');
    console.log("akshay", orgsRaw);
    let backendUrl = 'https://fm-uat-api.lockated.com/';

    const sessionBaseUrl = sessionStorage.getItem('baseUrl');
    console.log("baseURl", sessionBaseUrl);
    if (sessionBaseUrl) {
      backendUrl = `https://${sessionBaseUrl}/`;
    } else if (orgsRaw) {
      try {
        const organizations = JSON.parse(orgsRaw);
        const matchedOrg = organizations.find((org: any) => {
          if (!org.front_domain || !org.front_subdomain) return false;
          return hostname === `${org.front_subdomain}.${org.front_domain}`;
        });
        if (matchedOrg && matchedOrg.domain && matchedOrg.sub_domain) {
          backendUrl = `https://${matchedOrg.sub_domain}.${matchedOrg.domain}/`;
        }
      } catch (e) {
        // fallback to default
      }
    }

    config.baseURL = backendUrl;
    return config;
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
baseClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default baseClient