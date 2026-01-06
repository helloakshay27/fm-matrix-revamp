/**
 * Service Worker Diagnostic Tool
 *
 * Add this to browser console to diagnose cache issues:
 *
 * Usage:
 * 1. Open DevTools Console (F12)
 * 2. Paste this entire file
 * 3. Run: checkServiceWorkerStatus()
 */

export async function checkServiceWorkerStatus() {
  console.log("🔍 Service Worker Diagnostic Report");
  console.log("====================================\n");

  // Check if Service Worker API is available
  if (!("serviceWorker" in navigator)) {
    console.log("❌ Service Worker API not supported in this browser");
    return;
  }

  // Check for active service workers
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    if (registrations.length === 0) {
      console.log("✅ No service workers registered");
    } else {
      console.log(`⚠️  Found ${registrations.length} service worker(s):`);
      registrations.forEach((reg, index) => {
        console.log(`\n  Service Worker #${index + 1}:`);
        console.log(`  - Scope: ${reg.scope}`);
        console.log(`  - State: ${reg.active?.state || "none"}`);
        console.log(`  - Waiting: ${reg.waiting ? "Yes" : "No"}`);
        console.log(`  - Installing: ${reg.installing ? "Yes" : "No"}`);
      });
    }
  } catch (error) {
    console.error("❌ Error checking service workers:", error);
  }

  // Check cache storage
  if ("caches" in window) {
    try {
      const cacheNames = await caches.keys();

      if (cacheNames.length === 0) {
        console.log("\n✅ No caches found");
      } else {
        console.log(`\n⚠️  Found ${cacheNames.length} cache(s):`);

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          console.log(`  - ${cacheName}: ${keys.length} entries`);
        }
      }
    } catch (error) {
      console.error("❌ Error checking caches:", error);
    }
  }

  // Check localStorage for cache-related flags
  console.log("\n📦 LocalStorage Cache Flags:");
  const cacheCleanupDone = localStorage.getItem("cache_cleanup_done");
  if (cacheCleanupDone) {
    const timestamp = parseInt(cacheCleanupDone);
    const date = new Date(timestamp);
    console.log(`  - Last cache cleanup: ${date.toLocaleString()}`);
  } else {
    console.log("  - No cleanup record found");
  }

  // Network fetch test
  console.log("\n🌐 Testing API Cache Behavior:");
  try {
    const testUrl = window.location.origin + "/api/test?_cb=" + Date.now();
    const response = await fetch(testUrl, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });

    const cacheStatus =
      response.headers.get("x-cache") ||
      response.headers.get("cf-cache-status") ||
      "unknown";

    console.log(`  - Cache Status: ${cacheStatus}`);
    console.log(`  - Response from: ${response.type}`);
  } catch (error) {
    console.log("  - Could not test API (endpoint may not exist)");
  }

  console.log("\n====================================");
  console.log("💡 Recommendations:");

  const hasServiceWorkers =
    (await navigator.serviceWorker.getRegistrations()).length > 0;
  const hasCaches = "caches" in window && (await caches.keys()).length > 0;

  if (hasServiceWorkers || hasCaches) {
    console.log("⚠️  Service workers or caches detected!");
    console.log('   Solution: Use the "Clear Cache" button in profile menu');
    console.log("   Or run: clearAllCachesNow()");
  } else {
    console.log("✅ No cache issues detected");
  }

  console.log("\n📝 Available Commands:");
  console.log("  - clearAllCachesNow() - Clear all caches and service workers");
  console.log("  - forceHardReload() - Force reload without cache");
}

export async function clearAllCachesNow() {
  console.log("🧹 Clearing all caches...");

  // Unregister service workers
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log("✅ Service worker unregistered:", registration.scope);
    }
  }

  // Clear caches
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
      console.log("✅ Cache deleted:", cacheName);
    }
  }

  // Clear localStorage flag
  localStorage.removeItem("cache_cleanup_done");

  console.log("\n✅ All caches cleared!");
  console.log("🔄 Reloading page in 2 seconds...");

  setTimeout(() => {
    window.location.reload();
  }, 2000);
}

export function forceHardReload() {
  console.log("🔄 Forcing hard reload...");
  window.location.reload();
}

// Auto-run diagnostic if this file is loaded in console
if (typeof window !== "undefined") {
  console.log("📊 Service Worker Diagnostic Tool Loaded");
  console.log("Run: checkServiceWorkerStatus() to diagnose cache issues");
  console.log("Run: clearAllCachesNow() to clear all caches");
}
