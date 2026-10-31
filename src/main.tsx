import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/product-pages.css";
import "./styles/feature-system.css";
import { initColorPatch } from "./utils/colorPatch.ts";
import { hasEmbeddedSession, isEmbeddedMode } from "./utils/embeddedMode.ts";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { BrowserRouter as Router } from "react-router-dom";
import { PostHogProvider } from "@posthog/react";
import { PostHogPageView } from "./components/PostHogPageView.tsx";
import posthog from "posthog-js";
import { getPostHogSuperProperties } from "./utils/posthogContext.ts";
import { attachPostHogDebugLogger } from "./utils/posthogDebug.ts";
import { installDownloadTracking } from "./utils/downloadTracking.ts";
import { installNetworkMonitor } from "./utils/networkMonitor.ts";
// import { registerServiceWorker } from "./utils/pwa.ts";

// Register service worker for PWA
// registerServiceWorker();

// Every page in this app is lazy-loaded, and Vite fingerprints each chunk
// with a content hash that changes on every deploy. A tab left open across a
// deploy still holds the old chunk URLs, so navigating to a route not yet
// loaded this session requests a chunk that no longer exists on the server —
// the import rejects and, with nothing to catch it, React unmounts to a
// blank page. Vite dispatches this event specifically for that case; reload
// once to pick up the new build. The session flag stops a reload loop if the
// server is actually down rather than just serving a newer build, and clears
// itself after the app has been running a while so a later real deploy can
// still trigger a reload.
const RELOAD_ONCE_KEY = "vite-preload-error-reloaded";
window.addEventListener("vite:preloadError", () => {
  if (sessionStorage.getItem(RELOAD_ONCE_KEY)) {
    console.error(
      "[vite] Dynamic import failed again after a reload — not reloading again."
    );
    return;
  }
  sessionStorage.setItem(RELOAD_ONCE_KEY, "1");
  window.location.reload();
});
setTimeout(() => sessionStorage.removeItem(RELOAD_ONCE_KEY), 10_000);

// App-wide toasts for slow requests, unreachable server and offline/online —
// see utils/networkMonitor.ts for why this patches fetch/XHR globally.
installNetworkMonitor();

// Apply Lockated Brand Theme and color patch on live and local environments
if (
  window.location.hostname === "fm-matrix.lockated.com" ||
  // window.location.hostname === "lockated.gophygital.work" ||
  window.location.hostname === "localhost"
  || window.location.hostname === "club.lockated.com"
  // Shown inside a host product's page (Business Genie): the brand theme is what colours the buttons (fm-button-brand reads
  // --color-primary, which only theme.css defines), so it loads whatever address serves the app — without it every "Add" is
  // white text on nothing.
  || isEmbeddedMode()
  || hasEmbeddedSession()
) {
import("./styles/theme.css"); // Lockated Brand Theme - Edit this file for global color changes
// Initialise runtime color patcher — overrides MUI inline styles and any
// legacy #C72030 / #C62828 colors injected via sx props or inline styles.
initColorPatch();
}

// Initialize posthog BEFORE React renders so posthog.capture() calls inside
// useEffect hooks are never made on an uninitialized instance. When using
// apiKey + options directly in PostHogProvider, posthog.init() is called in a
// useEffect (after render), so child components that call posthog.capture()
// during their own mount effects race against init and events get dropped.
const posthogToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

// VAPT (cookie not HttpOnly / far-future expiry): builds before the localStorage-only
// persistence below left a `ph_<token>_posthog` cookie (1-year expiry, JS-set so never
// HttpOnly) in users' browsers. Remove it on load. The identity it holds is copied into
// localStorage first (only when localStorage has none), so existing users keep the same
// PostHog distinct_id instead of being split into a new anonymous person.
function removeLegacyPostHogCookie(token: string) {
  try {
    const cookieName = `ph_${token}_posthog`;
    const existing = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(`${cookieName}=`));

    if (existing) {
      try {
        if (!localStorage.getItem(cookieName)) {
          const value = decodeURIComponent(existing.slice(cookieName.length + 1));
          JSON.parse(value); // only migrate a well-formed PostHog payload
          localStorage.setItem(cookieName, value);
        }
      } catch {
        // Unreadable cookie or storage unavailable - fall through and just delete it.
      }
    }

    // A cookie can only be removed with the domain it was set on. PostHog sets it on the
    // host or on a parent domain (e.g. .gophygital.work), so expire it on every candidate.
    // slice(0, -1) skips the bare TLD, which browsers reject as a cookie domain.
    const hostParts = window.location.hostname.split(".");
    const domains = [
      "", // host-only cookie
      ...hostParts.slice(0, -1).map((_, i) => `; domain=.${hostParts.slice(i).join(".")}`),
    ];
    domains.forEach((domain) => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    });
  } catch {
    // Never let analytics cleanup block the app from rendering.
  }
}

// posthog.init(undefined) does not throw — it returns a client that silently
// drops every capture(). That failure mode is indistinguishable from "the
// instrumentation is broken", so say so loudly instead of guessing later.
if (!posthogToken || posthogToken === "phc_replace_me") {
  console.error(
    "[PostHog] VITE_POSTHOG_PROJECT_TOKEN is not set — analytics is DISABLED " +
      "and every event will be dropped. Set it in .env and restart the dev server " +
      "(Vite inlines VITE_* at build time)."
  );
} else {
  removeLegacyPostHogCookie(posthogToken);

  posthog.init(posthogToken, {
    api_host: posthogHost,
    autocapture: false,
    capture_pageview: false, // handled manually by PostHogPageView
    disable_session_recording: true,
    // localStorage-only: the default 'localStorage+cookie' persistence sets a
    // `ph_..._posthog` cookie holding the anonymous device_id. That cookie is
    // written by this client-side SDK via document.cookie, so it can never carry
    // HttpOnly (browsers refuse HttpOnly on JS-set cookies by design) - dropping
    // it entirely avoids the cookie-flags finding instead of leaving it half-fixed.
    persistence: "localStorage",
  });

  // Several apps share this PostHog project — the Vi my Workspace Flutter app, a separate
  // Resident app, and this web app. `client` and `is_test` are the mandatory filters every
  // query needs to tell them apart (§6.1/§6.7 of the instrumentation reference); registering
  // them as super-properties stamps them on $pageview and on every per-module event helper
  // without each one having to remember. See utils/posthogContext.ts.
  posthog.register(getPostHogSuperProperties());

  // Logs every captured event to the console on the dev server, or anywhere once
  // `localStorage.ph_debug = '1'` is set. One listener covers every event module.
  attachPostHogDebugLogger(posthog);

  // Catch-all for file downloads that no call site reports explicitly - see
  // utils/downloadTracking.ts for why this is a patch and not 150 edits.
  installDownloadTracking(posthog);
}

createRoot(document.getElementById("root")!).render(
  <PostHogProvider client={posthog}>
    <Provider store={store}>
      <Router>
        <PostHogPageView />
        <App />
      </Router>
    </Provider>
  </PostHogProvider>
);
