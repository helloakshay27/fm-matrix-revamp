/**
 * PostHog super-properties — stamped on EVERY event this web app sends.
 *
 * Registered once at init (see `main.tsx`), so they reach `$pageview` and all ~20
 * per-module event helpers without each one having to remember them.
 *
 * `client` and `is_test` are the two mandatory query filters defined in §6.1/§6.7 of the
 * Chart Calculation & Instrumentation Reference. Several apps report into this one PostHog
 * project (project 1 on posthog.lockated.com) — the Vi my Workspace Flutter app, a separate
 * Resident app, and this React web app. Without these two properties on every event, any
 * query silently mixes all of them together plus everyone's debug builds.
 */

/**
 * Hostname → `client`.
 *
 * Web values are deliberately suffixed `-web` so they never collide with the Flutter apps'
 * own client values: the Vi mobile app sends `client = 'vi'`, so a query for `client = 'vi'`
 * must return the mobile app alone. This app's Vi deployment reports as `vi-web`.
 */
// ORDER IS SIGNIFICANT — first match wins, and the entries overlap. `vi-web.gophygital.work`
// contains the substring `web.gophygital.work`, so the Vi row must stay above the FM row or
// every Vi visit gets relabelled `fm-matrix-web`.
const CLIENT_BY_HOST: [test: (h: string) => boolean, client: string][] = [
  [(h) => h.includes('vi-web.gophygital.work'), 'vi-web'],
  [(h) => h.includes('oig.gophygital.work'), 'oman-web'],
  [
    (h) =>
      h.includes('pulse.lockated.com') ||
      h.includes('pulse.gophygital.work') ||
      h.includes('pulse-uat.panchshil.com') ||
      h.includes('pulse.panchshil.com'),
    'pulse-web',
  ],
  [(h) => h.includes('club.lockated.com') || h.includes('recess-club.panchshil.com'), 'club-web'],
  [(h) => h === 'localhost' || h === '127.0.0.1', 'local-web'],
  [
    (h) =>
      h === 'fm-matrix.lockated.com' ||
      h.includes('web.gophygital.work') ||
      h.includes('lockated.gophygital.work') ||
      h === 'dev-fm-matrix.lockated.com',
    'fm-matrix-web',
  ],
];

/** Unrecognised hosts report as the primary product rather than as an unfilterable blank. */
const DEFAULT_CLIENT = 'fm-matrix-web';

export function resolveClient(hostname: string = window.location.hostname): string {
  for (const [matches, client] of CLIENT_BY_HOST) {
    if (matches(hostname)) return client;
  }
  return DEFAULT_CLIENT;
}

/**
 * True for anything that is not a real production visit — the dev server and local builds.
 * Analytics queries filter on `is_test = false`; getting this wrong in the safe direction
 * (marking real traffic as test) loses data, so it keys off the build mode plus localhost
 * rather than guessing from the hostname alone.
 */
export function resolveIsTest(hostname: string = window.location.hostname): boolean {
  if (import.meta.env.DEV) return true;
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

/**
 * Route → `screen`.
 *
 * §6.1 makes `screen` the primary grouping dimension for every module breakdown. On the
 * Flutter app it is set by hand at each call site because there is no automatic screen
 * tracking; on the web the route already *is* the screen, so deriving it is both accurate
 * and impossible to forget.
 *
 * Record identifiers are collapsed to `:id`, so a screen stays one screen instead of
 * fragmenting into a row per ticket — `/maintenance/ticket/details/848710` and
 * `/maintenance/ticket/details/865510` are the same screen, viewed twice.
 */
export function normalizeRoute(pathname: string = window.location.pathname): string {
  const collapsed = pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      if (/^\d+$/.test(segment)) return ':id';
      // UUID, with or without hyphens
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) return ':id';
      if (/^[0-9a-f]{24,32}$/i.test(segment)) return ':id';
      // Mixed identifiers that are mostly digits, e.g. "PO-88213"
      if (/^[A-Za-z]{1,4}[-_]?\d{3,}$/.test(segment)) return ':id';
      return segment.toLowerCase();
    })
    .join('/');
  return collapsed ? `/${collapsed}` : '/';
}

/**
 * The signed-in user's role, for the A8 Adoption-by-Role card.
 *
 * Without this the roles endpoint has almost nothing to group by: on the Vi tenant it returned
 * total_users = 2 for a range where adoption_engagement counted 151 active users, because only
 * a couple of people's events carried a `user_role` at all. Sending it as a super-property
 * classifies every event from every signed-in user instead.
 *
 * `user_role_name` is written by permissionService from /pms/users/get_user_role.json;
 * `lock_role.name` on the stored user is the fallback for accounts that resolve a role at login
 * but never hit that endpoint. Undefined when neither is known — better an unclassified event
 * than one stamped with a guess.
 */
function resolveUserRole(): string | undefined {
  const stored = localStorage.getItem('user_role_name');
  if (stored) return stored;
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return undefined;
    return JSON.parse(raw)?.lock_role?.name ?? undefined;
  } catch {
    // A corrupt or partially-written user blob must not take analytics down with it.
    return undefined;
  }
}

/** Tenant company label (§6.1, Tenant group) — set once the user has picked a company. */
function resolveClientCompany(): string | undefined {
  return (
    localStorage.getItem('selectedCompany') ??
    localStorage.getItem('company_name') ??
    undefined
  );
}

export interface PostHogSuperProperties {
  client: string;
  is_test: boolean;
  platform: 'web';
  release_version: string;
  client_company?: string;
  user_role?: string;
}

export function getPostHogSuperProperties(): PostHogSuperProperties {
  return {
    client: resolveClient(),
    is_test: resolveIsTest(),
    platform: 'web',
    release_version: (import.meta.env.VITE_APP_VERSION as string) ?? 'dev',
    client_company: resolveClientCompany(),
    user_role: resolveUserRole(),
  };
}
