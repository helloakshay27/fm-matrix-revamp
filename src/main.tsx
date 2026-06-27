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
import { PostHogTicketCreate } from "./components/PostHogTicketCreate.tsx";
// import { registerServiceWorker } from "./utils/pwa.ts";

// Register service worker for PWA
// registerServiceWorker();

// Apply Lockated Brand Theme and color patch on live and local environments
if (
  window.location.hostname === "fm-matrix.lockated.com" ||
  window.location.hostname === "lockated.gophygital.work" ||
  window.location.hostname === "localhost"
) {
  import("./styles/theme.css"); // Lockated Brand Theme - Edit this file for global color changes
  // Initialise runtime color patcher — overrides MUI inline styles and any
  // legacy #C72030 / #C62828 colors injected via sx props or inline styles.
  initColorPatch();
}

const posthogOptions = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  defaults: "2026-01-30",
} as const;

createRoot(document.getElementById("root")!).render(
  <PostHogProvider
    apiKey={import.meta.env.VITE_POSTHOG_PROJECT_TOKEN}
    options={posthogOptions}
  >
    <Provider store={store}>
      <Router>
        <PostHogPageView />
        <PostHogTicketCreate />
        <App />
      </Router>
    </Provider>
  </PostHogProvider>
);
