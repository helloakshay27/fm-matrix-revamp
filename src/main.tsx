import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/product-pages.css";
import { initColorPatch } from "./utils/colorPatch.ts";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { BrowserRouter as Router } from "react-router-dom";
import { PostHogProvider } from "@posthog/react";
import { PostHogPageView } from "./components/PostHogPageView.tsx";
import posthog from "posthog-js";
import { getPostHogSuperProperties } from "./utils/posthogContext.ts";
import { attachPostHogDebugLogger } from "./utils/posthogDebug.ts";
import { installDownloadTracking } from "./utils/downloadTracking.ts";
// import { registerServiceWorker } from "./utils/pwa.ts";

// Register service worker for PWA
// registerServiceWorker();

// Apply Lockated Brand Theme and color patch on live and local environments
// if (
//   window.location.hostname === "fm-matrix.lockated.com" ||
//   window.location.hostname === "lockated.gophygital.work" ||
//   window.location.hostname === "localhost"
// ) {
import("./styles/theme.css"); // Lockated Brand Theme - Edit this file for global color changes
// Initialise runtime color patcher — overrides MUI inline styles and any
// legacy #C72030 / #C62828 colors injected via sx props or inline styles.
initColorPatch();
// }

// Initialize posthog BEFORE React renders so posthog.capture() calls inside
// useEffect hooks are never made on an uninitialized instance. When using
// apiKey + options directly in PostHogProvider, posthog.init() is called in a
// useEffect (after render), so child components that call posthog.capture()
// during their own mount effects race against init and events get dropped.
const posthogToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

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
  posthog.init(posthogToken, {
    api_host: posthogHost,
    autocapture: false,
    capture_pageview: false, // handled manually by PostHogPageView
    disable_session_recording: true,
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
