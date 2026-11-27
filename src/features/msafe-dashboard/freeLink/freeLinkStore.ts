import { create } from 'zustand';
import { ExternalAuthError, requestExternalSession, type ExternalSession } from './externalAuthService';

/**
 * Auth state for the password-free M-Safe dashboard link (`/msafedashboard?org_id=34`).
 *
 * Held in memory only, on purpose: the token is never written to localStorage/sessionStorage,
 * so it can't overwrite a normal login or leak into the rest of the app. A page reload simply
 * signs in again.
 *
 * The token expires (24 hours), so it is renewed shortly before that without unmounting the
 * dashboard.
 */
interface FreeLinkState {
  /** Non-null while the free-link dashboard is mounted. */
  orgId: string | null;
  status: 'loading' | 'ready' | 'error';
  session: ExternalSession | null;
  error: ExternalAuthError | null;
  /** A saved login token that a dashboard API answered 401 to, outside external sign-in. */
  rejectedToken: string | null;
}

const INITIAL_STATE: FreeLinkState = {
  orgId: null,
  status: 'loading',
  session: null,
  error: null,
  rejectedToken: null,
};

export const useFreeLinkStore = create<FreeLinkState>(() => INITIAL_STATE);

/** Wait after a failed renewal, and the shortest delay between timed renewals. */
const RETRY_DELAY_MS = 60_000;

// One in-flight login per org, shared by re-renders, remounts and parallel 401s.
let pending: { orgId: string; promise: Promise<ExternalSession> } | null = null;

function login(orgId: string): Promise<ExternalSession> {
  if (pending?.orgId === orgId) return pending.promise;

  const promise = requestExternalSession(orgId).finally(() => {
    if (pending?.promise === promise) pending = null;
  });
  pending = { orgId, promise };
  return promise;
}

export function failFreeLink(error: ExternalAuthError): void {
  cachedSession = null;
  useFreeLinkStore.setState({ status: 'error', session: null, error });
}

/**
 * Signs in (or re-signs in) for the active org and publishes the result to the store.
 * With `keepValidSession`, a failure keeps an unexpired token in use and retries later.
 */
export async function authenticateFreeLink(
  orgId: string,
  { keepValidSession = false } = {},
): Promise<ExternalSession> {
  try {
    const session = await login(orgId);
    // The user may have left the dashboard while the request was running.
    if (useFreeLinkStore.getState().orgId === orgId) {
      useFreeLinkStore.setState({ status: 'ready', session, error: null });
    }
    return session;
  } catch (err) {
    const error =
      err instanceof ExternalAuthError ? err : new ExternalAuthError('LOGIN_FAILED');
    const state = useFreeLinkStore.getState();
    if (state.orgId === orgId) {
      if (keepValidSession && state.session && Date.now() < state.session.expiresAt) {
        useFreeLinkStore.setState({
          session: { ...state.session, refreshAt: Date.now() + RETRY_DELAY_MS },
        });
      } else {
        failFreeLink(error);
      }
    }
    throw error;
  }
}

/** Renews the token if it is close to, or past, its expiry. Safe to call at any time. */
export async function refreshFreeLinkIfDue(): Promise<void> {
  const { orgId, session } = useFreeLinkStore.getState();
  if (orgId === null || !session || Date.now() < session.refreshAt) return;
  await authenticateFreeLink(orgId, { keepValidSession: true }).catch(() => {
    // Either the current token is still usable, or the store now holds the error.
  });
}

// The last usable session, kept in memory while the user moves between the dashboards.
let cachedSession: ExternalSession | null = null;

// Keeps one timer matched to the current session; it is cleared when the session goes away.
let refreshTimer: ReturnType<typeof setTimeout> | undefined;

useFreeLinkStore.subscribe((state, previous) => {
  if (state.session === previous.session) return;
  clearTimeout(refreshTimer);
  if (!state.session) return;
  cachedSession = state.session;
  const delay = Math.max(state.session.refreshAt - Date.now(), RETRY_DELAY_MS);
  // The extra second stops a slightly early timer from finding nothing due yet.
  refreshTimer = setTimeout(refreshFreeLinkIfDue, delay + 1000);
});

export function startFreeLink(orgId: string): void {
  useFreeLinkStore.setState({ ...INITIAL_STATE, orgId });
  if (cachedSession?.orgId === orgId && Date.now() < cachedSession.refreshAt) {
    useFreeLinkStore.setState({ status: 'ready', session: cachedSession });
    return;
  }
  authenticateFreeLink(orgId).catch(() => {
    // Already recorded in the store; the gate renders the error screen.
  });
}

export function endFreeLink(): void {
  useFreeLinkStore.setState(INITIAL_STATE);
}
