// PWA Utilities for specific routes only (login and ops-console OTP pages)

export const PWA_ROUTES = [
  "/login-page",
  "/ops-console/settings/account/user-list-otp",
  "/ops-console/settings/account/user-list-otp/detail",
];

export const isPWARoute = (pathname: string, search: string = ""): boolean => {
  // Check if it's login page with fm_admin_login query param
  if (pathname === "/login-page" && search.includes("fm_admin_login")) {
    return true;
  }

  // Check if it's ops-console user list OTP routes
  if (pathname.startsWith("/ops-console/settings/account/user-list-otp")) {
    return true;
  }

  return false;
};

export const registerServiceWorker = async (): Promise<void> => {
  if ("serviceWorker" in navigator) {
    try {
      console.log("[PWA] Registering service worker...");

      // First, unregister all existing service workers and clear caches
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }

      // Clear all caches
      await clearAllCaches();

      const registration = await navigator.serviceWorker.register(
        "/service-worker.js",
        {
          scope: "/",
        }
      );

      console.log(
        "[PWA] Service Worker registered successfully:",
        registration
      );
      console.log("[PWA] Scope:", registration.scope);
      console.log("[PWA] Active:", registration.active);

      // Check for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          console.log("[PWA] New service worker found, installing...");
          newWorker.addEventListener("statechange", () => {
            console.log("[PWA] Service worker state changed:", newWorker.state);
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("[PWA] New content available, reloading...");
              window.location.reload();
            }
          });
        }
      });
    } catch (error) {
      console.error("[PWA] Service Worker registration failed:", error);
    }
  }
};

export const unregisterServiceWorker = async (): Promise<void> => {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log("All service workers unregistered");
  }
};

// Clear all caches
export const clearAllCaches = async (): Promise<void> => {
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((cacheName) => {
        console.log("Deleting cache:", cacheName);
        return caches.delete(cacheName);
      })
    );
    console.log("All caches cleared");
  }
};

// Check if app is running in standalone mode (installed PWA)
export const isStandalone = (): boolean => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
};

// Prompt user to install PWA (only for supported routes)
export const promptPWAInstall = (): void => {
  let deferredPrompt: any = null;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Check if we're on a PWA route before showing prompt
    if (isPWARoute(window.location.pathname)) {
      showInstallPrompt(deferredPrompt);
    }
  });
};

const showInstallPrompt = async (deferredPrompt: any) => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    deferredPrompt = null;
  }
};
