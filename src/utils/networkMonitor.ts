import { toast } from "sonner";

// Pages call the API three ways (raw fetch, the shared apiClient, plain axios
// instances), so wrapping each call site would mean hundreds of edits. Instead
// we patch the two browser primitives they all end up on — window.fetch and
// XMLHttpRequest (which axios uses) — once at startup.

// How long a request may run before we tell the user the network is slow
const SLOW_REQUEST_MS = 5000;

const SLOW_TOAST_ID = "network-slow";
const OFFLINE_TOAST_ID = "network-offline";
const ERROR_TOAST_ID = "network-error";

const SLOW_MESSAGE =
  "Your network seems slow. This is taking longer than usual, please wait...";
const OFFLINE_TITLE = "You're Offline";
const OFFLINE_MESSAGE =
  "It looks like your computer isn't connected to the internet. Please check your Wi-Fi, Ethernet, or network settings and try again.";
const BACK_ONLINE_MESSAGE = "You are back online.";
const NETWORK_ERROR_MESSAGE =
  "Unable to reach the server. Please check your internet connection and try again.";
const TIMEOUT_MESSAGE =
  "The request timed out due to a slow network. Please try again.";
const SERVER_TIMEOUT_MESSAGE =
  "The server is taking too long to respond. Please try again.";

// Analytics traffic is invisible to the user, so it shouldn't raise toasts
const IGNORED_URL_PARTS = [
  import.meta.env.VITE_POSTHOG_HOST,
  "posthog",
].filter(Boolean) as string[];

const isIgnored = (url: string): boolean =>
  IGNORED_URL_PARTS.some((part) => url.includes(part));

const isOffline = (): boolean =>
  typeof navigator !== "undefined" && navigator.onLine === false;

// ---------------------------------------------------------------------------
// Is it the user's network, or just a slow backend?
//
// A request can be slow because the server takes long to answer. That is not
// a network problem, so we only show the "slow network" toast once we've
// confirmed the connection itself is slow:
//   1. Network Information API (Chrome/Edge/Electron): coarse but free.
//   2. Otherwise, time a tiny same-origin static file. Static files don't hit
//      the backend, so a fast probe means the network is fine and the delay is
//      on the server side.
// ---------------------------------------------------------------------------

// A tiny static file served by the frontend host, not the API
const PROBE_PATH = "/robots.txt";
// If that tiny file takes longer than this, the connection is slow.
// Loading it costs about one round trip; on a healthy connection that's
// well under 200ms, while Slow 4G is ~550ms and Slow 3G ~2s.
const PROBE_SLOW_MS = 500;

// What counts as "slow" when the browser reports connection quality.
// Covers 2G, 3G / Slow 3G and Slow 4G (which reports as "4g" but with a
// high round-trip time or low bandwidth).
const SLOW_EFFECTIVE_TYPES = ["slow-2g", "2g", "3g"];
const SLOW_RTT_MS = 400;
const SLOW_DOWNLINK_MBPS = 2;
// Reuse a verdict for a while so many slow requests don't each fire a probe
const VERDICT_TTL_MS = 15000;

type NetworkInformationLike = {
  effectiveType?: string;
  rtt?: number;
  downlink?: number;
  saveData?: boolean;
};

const getConnection = (): NetworkInformationLike | undefined =>
  (navigator as Navigator & { connection?: NetworkInformationLike }).connection;

/** true = slow, false = fine, null = the API can't tell us */
const connectionSaysSlow = (): boolean | null => {
  const connection = getConnection();
  if (!connection || !connection.effectiveType) return null;
  // 2G, 3G and Slow 3G
  if (SLOW_EFFECTIVE_TYPES.includes(connection.effectiveType)) return true;
  // Slow 4G: labelled "4g" but with high latency or low bandwidth
  if (typeof connection.rtt === "number" && connection.rtt >= SLOW_RTT_MS) {
    return true;
  }
  if (
    typeof connection.downlink === "number" &&
    connection.downlink > 0 &&
    connection.downlink < SLOW_DOWNLINK_MBPS
  ) {
    return true;
  }
  return false;
};

// Set in patchFetch so the probe bypasses our own tracking
let rawFetch: typeof window.fetch | null = null;

const probeNetworkIsSlow = async (): Promise<boolean> => {
  // Electron file:// builds have no HTTP origin to probe
  if (!rawFetch || !/^https?:$/.test(window.location.protocol)) return false;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_SLOW_MS);
  try {
    await rawFetch(`${window.location.origin}${PROBE_PATH}?_nm=${Date.now()}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    return false;
  } catch (error) {
    // Aborted by our timer → the tiny file was too slow → slow network.
    // Any other quick failure tells us nothing, so don't blame the network.
    return error instanceof DOMException && error.name === "AbortError";
  } finally {
    clearTimeout(timer);
  }
};

let verdict: { slow: boolean; at: number } | null = null;
let verdictPending: Promise<boolean> | null = null;

const isNetworkSlow = (): Promise<boolean> => {
  if (verdict && Date.now() - verdict.at < VERDICT_TTL_MS) {
    return Promise.resolve(verdict.slow);
  }
  if (verdictPending) return verdictPending;

  verdictPending = (async () => {
    // Only trust the API when it says "slow"; its "fast" is a rough estimate
    // and can be stale, so confirm with the probe in that case.
    const slow = connectionSaysSlow() === true || (await probeNetworkIsSlow());
    verdict = { slow, at: Date.now() };
    return slow;
  })().finally(() => {
    verdictPending = null;
  });
  return verdictPending;
};

// Shared across requests so several slow requests show a single toast
let slowRequestsInFlight = 0;

/** Starts the slow-request timer; returns a function that ends tracking. */
const trackRequest = (): (() => void) => {
  let isSlow = false;
  let finished = false;

  const timer = setTimeout(() => {
    isSlow = true;
    slowRequestsInFlight += 1;
    // The offline toast already explains the delay
    if (isOffline()) return;
    // Only blame the network when it really is slow — a slow backend isn't
    isNetworkSlow().then((slow) => {
      if (slow && !finished && !isOffline()) {
        toast.warning(SLOW_MESSAGE, { id: SLOW_TOAST_ID, duration: Infinity });
      }
    });
  }, SLOW_REQUEST_MS);

  return () => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    if (isSlow) {
      slowRequestsInFlight -= 1;
      if (slowRequestsInFlight <= 0) {
        slowRequestsInFlight = 0;
        toast.dismiss(SLOW_TOAST_ID);
      }
    }
  };
};

const showOfflineToast = () => {
  toast.error(OFFLINE_TITLE, {
    id: OFFLINE_TOAST_ID,
    description: OFFLINE_MESSAGE,
    duration: Infinity,
  });
};

const reportNetworkFailure = () => {
  if (isOffline()) {
    showOfflineToast();
    return;
  }
  toast.error(NETWORK_ERROR_MESSAGE, { id: ERROR_TOAST_ID });
};

const getRequestUrl = (input: RequestInfo | URL): string => {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
};

const patchFetch = () => {
  const originalFetch = window.fetch.bind(window);
  rawFetch = originalFetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    if (isIgnored(getRequestUrl(input))) return originalFetch(input, init);

    const finish = trackRequest();
    try {
      return await originalFetch(input, init);
    } catch (error) {
      // A cancelled request is intentional, not a network problem
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        reportNetworkFailure();
      }
      throw error;
    } finally {
      finish();
    }
  };
};

const patchXhr = () => {
  const requestUrls = new WeakMap<XMLHttpRequest, string>();
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (
    this: XMLHttpRequest,
    ...args: Parameters<XMLHttpRequest["open"]>
  ) {
    requestUrls.set(this, String(args[1]));
    return (originalOpen as (...a: unknown[]) => void).apply(this, args);
  } as XMLHttpRequest["open"];

  XMLHttpRequest.prototype.send = function (
    this: XMLHttpRequest,
    body?: Document | XMLHttpRequestBodyInit | null
  ) {
    if (!isIgnored(requestUrls.get(this) || "")) {
      const finish = trackRequest();
      this.addEventListener("loadend", finish);
      this.addEventListener("error", reportNetworkFailure);
      this.addEventListener("timeout", () => {
        // A timeout can be a slow server too — only call it a network issue
        // when the network check agrees.
        isNetworkSlow().then((slow) => {
          toast.error(slow ? TIMEOUT_MESSAGE : SERVER_TIMEOUT_MESSAGE, {
            id: ERROR_TOAST_ID,
          });
        });
      });
    }
    return originalSend.call(this, body);
  };
};

const watchConnection = () => {
  window.addEventListener("offline", showOfflineToast);
  window.addEventListener("online", () => {
    // Same id, so the offline toast turns into the "back online" one
    toast.success(BACK_ONLINE_MESSAGE, {
      id: OFFLINE_TOAST_ID,
      // Clear the offline body copy, which sonner keeps when updating by id
      description: undefined,
      duration: 3000,
    });
  });
  if (isOffline()) showOfflineToast();
};

let installed = false;

/**
 * Shows toasts app-wide when requests are slow, fail because the server
 * can't be reached, or the device goes offline/online.
 */
export const installNetworkMonitor = () => {
  if (installed || typeof window === "undefined") return;
  installed = true;

  try {
    patchFetch();
    patchXhr();
    watchConnection();
  } catch (error) {
    // Never let the monitor block the app from rendering
    console.error("[networkMonitor] failed to install:", error);
  }
};
