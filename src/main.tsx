import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/product-pages.css";
import { initColorPatch } from "./utils/colorPatch.ts";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { BrowserRouter as Router } from "react-router-dom";
// import { registerServiceWorker } from "./utils/pwa.ts";

// Register service worker for PWA
// registerServiceWorker();

// Apply Lockated Brand Theme and color patch only on fm-matrix.lockated.com
if (window.location.hostname === "fm-matrix.lockated.com" || window.location.hostname === "localhost") {
  import("./styles/theme.css"); // Lockated Brand Theme - Edit this file for global color changes
  // Initialise runtime color patcher — overrides MUI inline styles and any
  // legacy #C72030 / #C62828 colors injected via sx props or inline styles.
  initColorPatch();
}

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
