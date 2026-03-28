import axios from "axios";

// Organization type for API response
interface Organization {
  id: number;
  name: string;
  backend_domain: string;
  frontend_domain: string;
  active: boolean;
}

// Embedded mode configuration
interface EmbeddedConfig {
  isEmbedded: boolean;
  orgId: string | null;
  accessToken: string | null;
  userId: string | null;
}

// Cache for resolved base URL to avoid repeated API calls
let cachedBaseUrl: string | null = null;
let cachedOrgId: string | null = null;

/**
 * Get embedded mode configuration from URL parameters
 */
export const getEmbeddedConfig = (): EmbeddedConfig => {
  const urlParams = new URLSearchParams(window.location.search);

  return {
    isEmbedded: urlParams.get("embedded") === "true",
    orgId: urlParams.get("org_id") || urlParams.get("organization_id"),
    accessToken: urlParams.get("access_token") || urlParams.get("token"),
    userId: urlParams.get("user_id"),
  };
};

/**
 * Check if current session is in embedded mode
 */
export const isEmbeddedMode = (): boolean => {
  const config = getEmbeddedConfig();
  return config.isEmbedded || !!(config.orgId && config.accessToken);
};

/**
 * Store embedded mode data in session storage
 */
export const storeEmbeddedData = (config: EmbeddedConfig): void => {
  if (config.isEmbedded) {
    sessionStorage.setItem("embedded_mode", "true");
  }
  if (config.orgId) {
    sessionStorage.setItem("embedded_org_id", config.orgId);
    localStorage.setItem("org_id", config.orgId);
  }
  if (config.accessToken) {
    sessionStorage.setItem("embedded_token", config.accessToken);
    localStorage.setItem("token", config.accessToken);
  }
  if (config.userId) {
    sessionStorage.setItem("embedded_user_id", config.userId);
    localStorage.setItem("user_id", config.userId);
  }
};

/**
 * Get stored embedded token (from URL or session storage)
 */
export const getEmbeddedToken = (): string | null => {
  const config = getEmbeddedConfig();
  return config.accessToken || sessionStorage.getItem("embedded_token");
};

/**
 * Get stored embedded org_id (from URL or session storage)
 */
export const getEmbeddedOrgId = (): string | null => {
  const config = getEmbeddedConfig();
  return config.orgId || sessionStorage.getItem("embedded_org_id");
};

/**
 * Check if embedded data is stored in session
 */
export const hasEmbeddedSession = (): boolean => {
  return !!(
    sessionStorage.getItem("embedded_mode") ||
    sessionStorage.getItem("embedded_token") ||
    sessionStorage.getItem("embedded_org_id")
  );
};

/**
 * Resolve base URL dynamically based on org_id
 * This makes an API call to get the organization's backend_domain
 */
export const resolveBaseUrlByOrgId = async (orgId: string): Promise<string> => {
  // Return cached URL if org_id matches
  if (cachedBaseUrl && cachedOrgId === orgId) {
    console.warn("📦 Using cached base URL for org_id:", orgId, cachedBaseUrl);
    return cachedBaseUrl;
  }

  const hostname = window.location.hostname;

  // Determine API endpoint based on hostname
  let apiUrl = "";
  if (
    hostname.includes("vi-web.gophygital.work") ||
    hostname.includes("web.gophygital.work") ||
    hostname.includes("lockated.gophygital.work")
  ) {
    apiUrl = `https://live-api.gophygital.work/api/users/get_organizations_by_email.json?org_id=${orgId}`;
  } else if (hostname.includes("dev-fm-matrix.lockated.com")) {
    apiUrl = `https://dev-api.lockated.com/api/users/get_organizations_by_email.json?org_id=${orgId}`;
  } else if (
    hostname.includes("fm-matrix.lockated.com") ||
    hostname.includes("fm-uat.gophygital.work") ||
    hostname.includes("fm.gophygital.work")
  ) {
    apiUrl = `https://fm-uat-api.lockated.com/api/users/get_organizations_by_email.json?org_id=${orgId}`;
  } else if (
    hostname.includes("pulse.lockated.com") ||
    hostname.includes("pulse.panchshil.com") ||
    hostname.includes("pulse.gophygital.work")
  ) {
    apiUrl = `https://pulse-api.lockated.com/api/users/get_organizations_by_email.json?org_id=${orgId}`;
  } else if (hostname === "localhost" || hostname === "127.0.0.1") {
    // Default to live-api for localhost development
    apiUrl = `https://live-api.gophygital.work/api/users/get_organizations_by_email.json?org_id=${orgId}`;
  } else {
    // Default fallback
    apiUrl = `https://fm-uat-api.lockated.com/api/users/get_organizations_by_email.json?org_id=${orgId}`;
  }

  try {
    console.warn("🔍 Resolving base URL for org_id:", orgId, "from:", apiUrl);
    const response = await axios.get(apiUrl);
    const { organizations, backend_url } = response.data;

    // Helper function to normalize URL - removes duplicate protocols and ensures proper format
    const normalizeUrl = (url: string): string => {
      if (!url) return "";
      // Remove any duplicate https:// or http:// patterns
      let normalized = url.replace(/^(https?:\/\/)+/i, "");
      // Also handle cases like "https//" (missing colon)
      normalized = normalized.replace(/^https\/\//i, "");
      normalized = normalized.replace(/^http\/\//i, "");
      // Ensure https:// prefix
      return `https://${normalized}`;
    };

    // Priority 1: Use backend_url from API response
    if (backend_url) {
      const formattedUrl = normalizeUrl(backend_url);

      // Cache the result
      cachedBaseUrl = formattedUrl;
      cachedOrgId = orgId;

      // Also save to localStorage for other components
      localStorage.setItem("baseUrl", formattedUrl);

      console.warn("✅ Base URL resolved from backend_url:", formattedUrl);
      return formattedUrl;
    }

    // Priority 2: Find organization and use its backend_domain
    if (organizations && organizations.length > 0) {
      const selectedOrg = organizations.find(
        (org: Organization) => org.id === parseInt(orgId)
      );

      if (selectedOrg?.backend_domain) {
        const formattedUrl = normalizeUrl(selectedOrg.backend_domain);

        // Cache the result
        cachedBaseUrl = formattedUrl;
        cachedOrgId = orgId;

        // Also save to localStorage
        localStorage.setItem("baseUrl", formattedUrl);

        console.warn("✅ Base URL resolved from organization:", formattedUrl);
        return formattedUrl;
      }

      // Priority 3: Use first organization's backend_domain
      const firstOrg = organizations[0];
      if (firstOrg?.backend_domain) {
        const formattedUrl = normalizeUrl(firstOrg.backend_domain);

        cachedBaseUrl = formattedUrl;
        cachedOrgId = orgId;
        localStorage.setItem("baseUrl", formattedUrl);

        console.warn("✅ Base URL resolved from first org:", formattedUrl);
        return formattedUrl;
      }
    }

    // Fallback
    const fallbackUrl = "https://pulse-api.lockated.com";
    console.warn("⚠️ Using fallback base URL:", fallbackUrl);
    return fallbackUrl;
  } catch (error) {
    console.error("❌ Error resolving base URL:", error);
    const fallbackUrl = "https://pulse-api.lockated.com";
    return fallbackUrl;
  }
};

/**
 * Initialize embedded mode - should be called early in app lifecycle
 */
export const initializeEmbeddedMode = async (): Promise<void> => {
  const config = getEmbeddedConfig();

  if (config.isEmbedded || (config.orgId && config.accessToken)) {
    console.warn("🚀 Initializing embedded mode:", config);

    // Store embedded data
    storeEmbeddedData(config);

    // Resolve and cache base URL
    if (config.orgId) {
      await resolveBaseUrlByOrgId(config.orgId);
    }
  }
};

/**
 * Clear embedded mode data
 */
export const clearEmbeddedMode = (): void => {
  sessionStorage.removeItem("embedded_mode");
  sessionStorage.removeItem("embedded_token");
  sessionStorage.removeItem("embedded_org_id");
  sessionStorage.removeItem("embedded_user_id");
  cachedBaseUrl = null;
  cachedOrgId = null;
};

export default {
  getEmbeddedConfig,
  isEmbeddedMode,
  storeEmbeddedData,
  getEmbeddedToken,
  getEmbeddedOrgId,
  hasEmbeddedSession,
  resolveBaseUrlByOrgId,
  initializeEmbeddedMode,
  clearEmbeddedMode,
};
