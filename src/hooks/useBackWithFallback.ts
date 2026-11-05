import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Back navigation that never dead-ends.
 *
 * When the app is entered on a page by a full page load (typed or pasted URL,
 * bookmark, new tab, a link that reloads the app), there is no in-app page
 * behind it, so a plain `navigate(-1)` / the browser Back button leaves the app
 * or does nothing. This hook puts `fallbackPath` behind such a page:
 *
 *  - The browser Back button goes to `fallbackPath`. The history becomes
 *    [fallbackPath, current page] (done once, on mount).
 *  - `goBack()` for an on-page Back button goes one step back, or to
 *    `fallbackPath` if the page has not been seeded.
 *
 * Pages reached by in-app (client-side) navigation are left alone: Back still
 * returns to wherever the user came from. A reload (F5) does not re-seed.
 */
export function useBackWithFallback(fallbackPath: string) {
  const navigate = useNavigate();
  const location = useLocation();
  // React Router gives the first entry of a session the key "default".
  const isFirstEntry = location.key === "default";
  const seeded = useRef(false);

  useEffect(() => {
    // The ref keeps React 18 StrictMode's double effect run from seeding twice.
    if (!isFirstEntry || seeded.current) return;
    seeded.current = true;

    const current = `${location.pathname}${location.search}${location.hash}`;
    if (current === fallbackPath) return;

    // Both calls are batched into one render, so the page stays mounted.
    navigate(fallbackPath, { replace: true });
    navigate(current, { state: location.state });
    // Runs once on mount; the values above are the entry's initial location.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = useCallback(() => {
    if (isFirstEntry) {
      navigate(fallbackPath, { replace: true });
    } else {
      navigate(-1);
    }
  }, [isFirstEntry, navigate, fallbackPath]);

  return goBack;
}
