/**
 * Cache Manager Utility
 *
 * Handles service worker cleanup from previous PWA setup
 * Does NOT interfere with normal browser caching
 */

/**
 * Unregister all service workers (from old PWA setup)
 */
export const unregisterServiceWorkers = async (): Promise<void> => {
  if ("serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length > 0) {
        for (const registration of registrations) {
          await registration.unregister();
          console.warn("Service worker unregistered:", registration.scope);
        }
      }
    } catch (error) {
      console.error("Failed to unregister service workers:", error);
    }
  }
};

/**
 * Clear only service worker caches (not browser cache)
 */
export const clearServiceWorkerCaches = async (): Promise<void> => {
  if ("caches" in window) {
    try {
      const cacheNames = await caches.keys();
      // Only clear workbox/service worker caches, not all caches
      const swCaches = cacheNames.filter(
        (name) =>
          name.includes("workbox") ||
          name.includes("precache") ||
          name.includes("runtime")
      );

      if (swCaches.length > 0) {
        await Promise.all(
          swCaches.map((cacheName) => {
            console.warn("Deleting service worker cache:", cacheName);
            return caches.delete(cacheName);
          })
        );
      }
    } catch (error) {
      console.error("Failed to clear service worker caches:", error);
    }
  }
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
 * Manual cache cleanup button (for user-initiated clear)
 * Only clears service worker caches and reloads
 */
export const manualCacheCleanup = async (): Promise<void> => {
  try {
    console.warn("🧹 Manual cache cleanup initiated...");

    // Unregister service workers
    await unregisterServiceWorkers();

    // Clear only service worker caches
    await clearServiceWorkerCaches();

    alert("Service worker cache cleared! Page will reload.");

    // Simple reload
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    console.error("Failed to clear cache:", error);
    alert("Error clearing cache. Please try hard refresh (Ctrl+Shift+R)");
  }
};
