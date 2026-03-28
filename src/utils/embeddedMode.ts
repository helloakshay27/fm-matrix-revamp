import axios from "axios";
import { normalizeBaseUrl, saveBaseUrl } from "@/utils/auth";

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

    // Priority 1: Use backend_url from API response
    if (backend_url) {
      const formattedUrl = normalizeBaseUrl(backend_url);

      // Cache the result
      cachedBaseUrl = formattedUrl;
      cachedOrgId = orgId;

      // Save to localStorage using auth utility (handles normalization)
      saveBaseUrl(formattedUrl);

      console.warn("✅ Base URL resolved from backend_url:", formattedUrl);
      return formattedUrl;
    }

    // Priority 2: Find organization and use its backend_domain
    if (organizations && organizations.length > 0) {
      const selectedOrg = organizations.find(
        (org: Organization) => org.id === parseInt(orgId)
      );

      if (selectedOrg?.backend_domain) {
        const formattedUrl = normalizeBaseUrl(selectedOrg.backend_domain);

        // Cache the result
        cachedBaseUrl = formattedUrl;
        cachedOrgId = orgId;

        // Save to localStorage using auth utility
        saveBaseUrl(formattedUrl);

        console.warn("✅ Base URL resolved from organization:", formattedUrl);
        return formattedUrl;
      }

      // Priority 3: Use first organization's backend_domain
      const firstOrg = organizations[0];
      if (firstOrg?.backend_domain) {
        const formattedUrl = normalizeBaseUrl(firstOrg.backend_domain);

        cachedBaseUrl = formattedUrl;
        cachedOrgId = orgId;
        saveBaseUrl(formattedUrl);

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

/**
 * Append embedded parameters to a URL/path
 * This ensures embedded=true is added to all navigation when in embedded mode
 */
export const appendEmbeddedParams = (path: string): string => {
  if (!hasEmbeddedSession() && !isEmbeddedMode()) {
    return path;
  }

  try {
    // Handle both full URLs and relative paths
    const isFullUrl = path.startsWith("http");
    const url = isFullUrl
      ? new URL(path)
      : new URL(path, window.location.origin);

    // Only add if not already present
    if (!url.searchParams.has("embedded")) {
      url.searchParams.set("embedded", "true");
    }

    return isFullUrl
      ? url.toString()
      : `${url.pathname}${url.search}${url.hash}`;
  } catch {
    // Fallback for invalid URLs - simple string append
    if (path.includes("embedded=true")) {
      return path;
    }
    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}embedded=true`;
  }
};

/**
 * Initialize global navigation interceptor for embedded mode
 * This patches history.pushState and history.replaceState to automatically
 * add embedded=true to all navigation when in embedded mode
 */
export const initializeEmbeddedNavigation = (): void => {
  // Only initialize if in embedded mode
  if (!hasEmbeddedSession() && !isEmbeddedMode()) {
    return;
  }

  console.warn("🔌 Initializing embedded navigation interceptor");

  // Store original methods
  const originalPushState = history.pushState.bind(history);
  const originalReplaceState = history.replaceState.bind(history);

  // Patch pushState
  history.pushState = function (
    state: unknown,
    unused: string,
    url?: string | URL | null
  ) {
    if (url) {
      const urlString = url.toString();
      // Don't modify external URLs or already embedded URLs
      if (
        !urlString.startsWith("http") ||
        urlString.includes(window.location.origin)
      ) {
        const modifiedUrl = appendEmbeddedParams(urlString);
        return originalPushState(state, unused, modifiedUrl);
      }
    }
    return originalPushState(state, unused, url);
  };

  // Patch replaceState
  history.replaceState = function (
    state: unknown,
    unused: string,
    url?: string | URL | null
  ) {
    if (url) {
      const urlString = url.toString();
      // Don't modify external URLs or already embedded URLs
      if (
        !urlString.startsWith("http") ||
        urlString.includes(window.location.origin)
      ) {
        const modifiedUrl = appendEmbeddedParams(urlString);
        return originalReplaceState(state, unused, modifiedUrl);
      }
    }
    return originalReplaceState(state, unused, url);
  };

  // Handle link clicks globally
  document.addEventListener(
    "click",
    (e) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor && anchor.href) {
        const href = anchor.getAttribute("href");

        // Only handle internal links
        if (
          href &&
          !href.startsWith("http") &&
          !href.startsWith("mailto:") &&
          !href.startsWith("tel:")
        ) {
          // Check if it's a react-router link (data-discover attribute or no target)
          if (!anchor.target || anchor.target === "_self") {
            // Let React Router handle it, the history patch will add embedded=true
            return;
          }
        }
      }
    },
    true
  );

  console.warn("✅ Embedded navigation interceptor initialized");
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
  appendEmbeddedParams,
  initializeEmbeddedNavigation,
};
