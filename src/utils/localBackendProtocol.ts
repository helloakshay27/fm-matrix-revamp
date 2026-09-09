/**
 * Downgrades `https://localhost[:port]/...` requests to `http://` in local dev.
 *
 * Every legacy page builds its API calls as `` `https://${baseUrl}/...` `` — that convention is
 * hardcoded in ~570 files (services, pages, modals), not funneled through one shared client.
 * A local Rails/Puma dev server (e.g. `rails s` on :3000) only serves plain HTTP — no TLS cert
 * configured — so pointing `baseUrl` at "localhost:3000" for local backend testing makes every
 * one of those https:// requests fail the TLS handshake. Rather than editing ~570 call sites
 * (see downloadTracking.ts for the same "why not a hundred edits" reasoning applied to
 * downloads), this patches the two browser primitives every one of them ultimately goes
 * through — `fetch` (raw `fetch()` calls) and `XMLHttpRequest` (axios's default browser
 * adapter, including custom `axios.create()` instances, plus any raw XHR usage).
 *
 * Scope is deliberately narrow: only requests whose host is literally "localhost" are touched.
 * No real tenant's `baseUrl` is ever "localhost", so this can't misfire against a live tenant
 * API, and it only installs in dev builds (`import.meta.env.DEV`) — never in production.
 */

const LOCALHOST_HTTPS = /^https:\/\/localhost(:\d+)?\//i;

const toHttp = (url: string): string =>
  LOCALHOST_HTTPS.test(url) ? url.replace(/^https:/i, "http:") : url;

let installed = false;

export function installLocalBackendHttpDowngrade(): void {
  if (installed || !import.meta.env.DEV) return;
  installed = true;

  // Raw fetch() calls
  const originalFetch = window.fetch.bind(window);
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    try {
      if (typeof input === "string" && LOCALHOST_HTTPS.test(input)) {
        return originalFetch(toHttp(input), init);
      }
      if (input instanceof URL && LOCALHOST_HTTPS.test(input.href)) {
        return originalFetch(toHttp(input.href), init);
      }
      if (typeof Request !== "undefined" && input instanceof Request && LOCALHOST_HTTPS.test(input.url)) {
        return originalFetch(new Request(toHttp(input.url), input), init);
      }
    } catch (err) {
      console.warn("[local-backend] fetch downgrade failed, using original request", err);
    }
    return originalFetch(input as RequestInfo, init);
  }) as typeof window.fetch;

  // axios's default browser adapter (and any raw XHR usage) goes through XMLHttpRequest.open —
  // this covers every axios instance, including axios.create()'d ones, without touching each call site.
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function patchedOpen(
    this: XMLHttpRequest,
    method: string,
    url: string | URL,
    ...rest: unknown[]
  ) {
    try {
      const rewritten =
        typeof url === "string"
          ? toHttp(url)
          : LOCALHOST_HTTPS.test(url.href)
            ? new URL(toHttp(url.href))
            : url;
      // @ts-expect-error - variadic overload of the native XHR#open signature
      return originalOpen.call(this, method, rewritten, ...rest);
    } catch (err) {
      console.warn("[local-backend] XHR downgrade failed, using original request", err);
      // @ts-expect-error - variadic overload of the native XHR#open signature
      return originalOpen.call(this, method, url, ...rest);
    }
  };
}
