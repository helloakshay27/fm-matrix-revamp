// PWA Utilities for Occupant Users routes

export const PWA_ROUTES = [
  "/master/user/occupant-users",
  "/master/user/occupant-users/view",
];

export const isPWARoute = (pathname: string): boolean => {
  return PWA_ROUTES.some((route) => pathname.includes(route));
};

export const registerServiceWorker = async (): Promise<void> => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js",
        {
          scope: "/",
        }
      );

      console.log("Service Worker registered:", registration);

      // Check for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("New content available, please refresh.");
            }
          });
        }
      });
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
};

export const unregisterServiceWorker = async (): Promise<void> => {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
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
