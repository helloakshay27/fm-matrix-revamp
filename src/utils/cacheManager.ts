/**
 * Cache Manager Utility
 *
 * Handles aggressive caching issues from PWA/Service Workers
 * and provides utilities to clear browser cache
 */

/**
 * Unregister all service workers
 * This is useful when you want to disable PWA functionality
 */
export const unregisterServiceWorkers = async (): Promise<void> => {
  if ("serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.warn("Service worker unregistered:", registration.scope);
      }
    } catch (error) {
      console.error("Failed to unregister service workers:", error);
    }
  }
};

/**
 * Clear all caches
 * This removes all cached assets from the browser
 */
export const clearAllCaches = async (): Promise<void> => {
  if ("caches" in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          console.warn("Deleting cache:", cacheName);
          return caches.delete(cacheName);
        })
      );
    } catch (error) {
      console.error("Failed to clear caches:", error);
    }
  }
};

/**
 * Force reload without cache
 * This bypasses the browser cache for the current page
 */
export const hardReload = (): void => {
  // Use location.replace to force a fresh load
  window.location.href = window.location.href + "?_t=" + Date.now();
};

/**
 * Check if service workers are registered
 */
export const hasActiveServiceWorker = async (): Promise<boolean> => {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    return registrations.length > 0;
  }
  return false;
};

/**
 * Initialize cache cleanup on app load
 * Call this in your main.tsx or App.tsx
 *
 * AGGRESSIVE MODE: Clears cache on EVERY page load
 */
export const initCacheCleanup = async (): Promise<void> => {
  try {
    // Always clear caches on every load
    console.warn("🧹 Clearing cache on page load...");

    // Check if we need to clean up service workers
    const hasServiceWorker = await hasActiveServiceWorker();

    if (hasServiceWorker) {
      console.warn("⚠️ Active service worker detected. Unregistering...");
      await unregisterServiceWorkers();
    }

    // Always clear all caches
    await clearAllCaches();

    console.warn("✓ Cache cleared successfully");
  } catch (error) {
    console.error("Failed to clear cache:", error);
  }
};

/**
 * Add cache-busting query parameter to API requests
 */
export const addCacheBuster = (url: string): string => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_cb=${Date.now()}`;
};

/**
 * Manual cache cleanup (for admin/settings page)
 * Aggressively clears everything and forces reload
 */
export const manualCacheCleanup = async (): Promise<void> => {
  try {
    console.warn("🧹 Manual cache cleanup initiated...");

    // Unregister all service workers
    await unregisterServiceWorkers();

    // Clear all caches
    await clearAllCaches();

    // Clear all localStorage except essential auth data
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    const userType = localStorage.getItem("userType");

    localStorage.clear();

    // Restore essential data
    if (token) localStorage.setItem("token", token);
    if (baseUrl) localStorage.setItem("baseUrl", baseUrl);
    if (userType) localStorage.setItem("userType", userType);

    // Clear sessionStorage
    sessionStorage.clear();

    alert("Cache cleared successfully! Page will reload with fresh data.");

    // Force hard reload with cache bypass
    setTimeout(() => {
      window.location.href =
        window.location.pathname + "?_refresh=" + Date.now();
    }, 500);
  } catch (error) {
    console.error("Failed to clear cache:", error);
    alert("Error clearing cache. Please try hard refresh (Ctrl+Shift+R)");
  }
};
