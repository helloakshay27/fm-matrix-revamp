import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/product-pages.css";
import "./styles/feature-system.css";
import { initColorPatch } from "./utils/colorPatch.ts";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { BrowserRouter as Router } from "react-router-dom";
import { PostHogProvider } from "@posthog/react";
import { PostHogPageView } from "./components/PostHogPageView.tsx";
import posthog from "posthog-js";
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
posthog.init(import.meta.env.VITE_POSTHOG_PROJECT_TOKEN, {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  autocapture: false,
  capture_pageview: false, // handled manually by PostHogPageView
  disable_session_recording: true,
});

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
