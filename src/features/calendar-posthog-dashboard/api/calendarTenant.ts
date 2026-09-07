/**
 * Calendar analytics — which tenant the `url` query param reports on.
 *
 * ⚠️ `url` IS NOT A BACKEND BASE URL.
 * ------------------------------------
 * Three different hosts are in play and they are easy to confuse:
 *
 *   1. The app's REST backend        — `getBaseUrl()` from utils/auth, e.g.
 *                                      `lockated-api.gophygital.work`. Tickets, calendar
 *                                      events, everything the app reads and writes.
 *   2. The analytics service         — `https://posthog-api.lockated.com`, a separate API
 *                                      (see ANALYTICS_BASE_URL in adoptionApi.ts).
 *   3. The tenant `url` param        — THIS FILE. The FRONTEND hostname whose PostHog events
 *                                      to report on, because that is what the browser stamps
 *                                      on every event.
 *
 * Passing the backend host here returns nothing, which is worth knowing rather than guessing:
 * measured 2026-09-04 over a 30-day window against `/fm/adoption/traffic_session`,
 *
 *   lockated-api.gophygital.work      0 users          ← backend; PostHog never sees it
 *   dev-fm-matrix.lockated.com        0 users
 *   fm-matrix.lockated.com          315 users
 *   lockated.gophygital.work      1,037 users
 *   web.gophygital.work           3,360 users
 *
 * WHY THE DEFAULT IS `lockated.gophygital.work`
 * ---------------------------------------------
 * Because that is where the calendar module is actually used. Same date window, via
 * `/fm/adoption/modules?module=employee`:
 *
 *   lockated.gophygital.work    calendar → 41 users, 75 events, 54 sessions
 *   fm-matrix.lockated.com      calendar →  1 user,   1 event,   1 session
 *   web.gophygital.work         calendar →  absent (no rows)
 *
 * A dashboard about the calendar pointed at the host with one user would look broken while
 * the real usage sat somewhere else. Note this differs from `config/fmAdoptionTenant.ts`,
 * which pins FM Matrix to `fm-matrix.lockated.com`; that file is left untouched.
 */

/** Hosts that are never a valid analytics tenant — dev servers and desktop shells. */
const NON_TENANT_HOSTS = ['localhost', '127.0.0.1', ''];

/**
 * Where the calendar module's traffic actually lives. Also the fallback when this is served
 * from localhost or an Electron shell, so local development shows a populated dashboard
 * instead of an empty one.
 */
const DEFAULT_TENANT = 'lockated.gophygital.work';

function resolveCalendarTenant(): string {
  const fromEnv = (import.meta.env.VITE_CALENDAR_ADOPTION_TENANT_URL as string | undefined)?.trim();
  if (fromEnv) return fromEnv;

  const host = (typeof window !== 'undefined' && window.location.hostname) || '';

  /* Served from a real deployment: report on the host the viewer is actually on, so the
     dashboard is self-consistent with the app around it rather than reporting on a
     different deployment's traffic. */
  if (!NON_TENANT_HOSTS.includes(host) && host.includes('.')) return host;

  return DEFAULT_TENANT;
}

/** Tenant host sent as the `url` query param on every calendar analytics request. */
export const CALENDAR_TENANT_URL = resolveCalendarTenant();
