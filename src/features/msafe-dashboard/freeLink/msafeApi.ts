import { getAuthHeader, getFullUrl } from '@/config/apiConfig';
import { ExternalAuthError, getExternalApiBaseUrl } from './externalAuthService';
import {
  authenticateFreeLink,
  failFreeLink,
  refreshFreeLinkIfDue,
  useFreeLinkStore,
} from './freeLinkStore';

/**
 * The single place the M-Safe dashboard gets its token, API host and company from.
 * Every dashboard request must go through these helpers.
 *
 * - Free-link mode: values come only from the external session. There is deliberately no
 *   fallback to localStorage, so a stale or normal-login token can never be sent.
 * - Normal mode: values come from localStorage, as before.
 */
const isFreeLink = () => useFreeLinkStore.getState().orgId !== null;
const externalSession = () => useFreeLinkStore.getState().session;

export function getMsafeBaseUrl(): string {
  if (isFreeLink()) return externalSession()?.apiBaseUrl ?? '';
  const fromLS = localStorage.getItem('baseUrl') || '';
  const host = fromLS.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return host ? `https://${host}` : 'https://live-api.gophygital.work';
}

export function getMsafeCompanyId(): string {
  if (isFreeLink()) return externalSession()?.companyId ?? '';
  return localStorage.getItem('selectedCompanyId') || localStorage.getItem('company_id') || '145';
}

export function getMsafeToken(): string {
  if (isFreeLink()) return externalSession()?.accessToken ?? '';
  return localStorage.getItem('token') || '';
}

/** Throws when no token is available in normal mode (same contract as getAuthHeader). */
export function getMsafeAuthHeader(): string {
  return isFreeLink() ? `Bearer ${getMsafeToken()}` : getAuthHeader();
}

/**
 * URL and company for the Vi Audit, Incident and Inspection dashboards. Without an external
 * session they resolve exactly as those dashboards did before: no default host or company.
 */
export function getViApiUrl(path: string): string {
  return isFreeLink() ? `${getMsafeBaseUrl()}${path}` : getFullUrl(path);
}

export function getViCompanyId(): string {
  if (isFreeLink()) return getMsafeCompanyId();
  return localStorage.getItem('selectedCompanyId') || localStorage.getItem('company_id') || '';
}

/**
 * A request made with the saved login. If the API that external login belongs to answers 401,
 * that login has expired: record it so the access gate switches to external sign-in. Other API
 * hosts belong to other organizations and are left alone. localStorage is not changed.
 */
async function fetchWithSavedLogin(url: string, init: RequestInit): Promise<Response> {
  const savedToken = localStorage.getItem('token');
  const response = await fetch(url, init);
  if (response.status === 401 && savedToken && url.startsWith(`${getExternalApiBaseUrl()}/`) && !isFreeLink()) {
    useFreeLinkStore.setState({ rejectedToken: savedToken });
  }
  return response;
}

/**
 * `fetch` for dashboard APIs. In free-link mode it renews a token that is about to expire,
 * sets it on the request and, on a 401, signs in again once and retries.
 */
export async function msafeFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const { orgId } = useFreeLinkStore.getState();
  if (orgId === null) return fetchWithSavedLogin(url, init);

  // Covers a timer delayed by a sleeping device or a background tab.
  await refreshFreeLinkIfDue();
  const session = externalSession();
  if (!session) throw new ExternalAuthError('SESSION_REJECTED');

  const send = (token: string) => {
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${token}`);
    return fetch(url, { ...init, headers });
  };

  const response = await send(session.accessToken);
  if (response.status !== 401) return response;

  // No session means sign-in has already failed, or the user left the dashboard, while this
  // request was in flight. Signing in again here would repeat the login.
  const current = externalSession();
  if (useFreeLinkStore.getState().orgId !== orgId || !current) return response;

  // Another request may already have refreshed the token while this one was in flight.
  const fresh =
    current.accessToken !== session.accessToken ? current : await authenticateFreeLink(orgId);

  const retried = await send(fresh.accessToken);
  if (retried.status === 401 && useFreeLinkStore.getState().orgId === orgId) {
    failFreeLink(new ExternalAuthError('SESSION_REJECTED'));
  }
  return retried;
}
