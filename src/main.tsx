import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { BrowserRouter as Router } from "react-router-dom";
import { initCacheCleanup } from "./utils/cacheManager";

// Initialize aggressive cache cleanup on every page load
initCacheCleanup().catch(console.error);

// Clear cache on page unload (before leaving)
window.addEventListener("beforeunload", () => {
  if ("caches" in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    });
  }
});

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
