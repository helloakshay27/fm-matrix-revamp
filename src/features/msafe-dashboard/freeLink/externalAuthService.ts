/**
 * Calls `/api/users/external_login` for the password-free M-Safe dashboard link.
 *
 * The service-account credentials are hardcoded in the request below, so anyone who can load the
 * site can read them. The account must therefore be limited, in the API, to read-only M-Safe data.
 */
const VI_PROD_API = 'https://vi-prod-api.gophygital.work';
const VI_UAT_API = 'https://vi-uat-api.gophygital.work';

/** The API server belonging to each Vi site. */
const API_BY_SITE: Record<string, string> = {
  'vi-web.gophygital.work': VI_PROD_API,
  'vi-uat.gophygital.work': VI_UAT_API,
};

/**
 * Where external login and the dashboard APIs go. The Vi sites always use their own server.
 * Elsewhere (such as localhost) the saved login's Vi server is used, and UAT if there is none,
 * so that local testing does not reach live data by accident.
 */
export function getExternalApiBaseUrl(): string {
  const siteApi = API_BY_SITE[window.location.hostname];
  if (siteApi) return siteApi;

  // The saved value may or may not include the protocol or a path.
  const saved = (localStorage.getItem('baseUrl') || '').replace(/^https?:\/\//, '').split('/')[0];
  return [VI_PROD_API, VI_UAT_API].find((api) => api === `https://${saved}`) ?? VI_UAT_API;
}

/** The organization the credentials belong to; other `org_id` values are refused. */
export const EXTERNAL_ORG_ID = '34';
/** `company_id` sent with every dashboard API call. */
const COMPANY_ID = '145';
const REQUEST_TIMEOUT_MS = 20_000;

const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;
/** The token is renewed this long before it expires. */
const REFRESH_MARGIN_MS = 5 * 60 * 1000;

export interface ExternalSession {
  orgId: string;
  accessToken: string;
  /** API host that issued the token — every dashboard call must go here. */
  apiBaseUrl: string;
  companyId: string;
  /** Epoch ms from which the token should be renewed. */
  refreshAt: number;
  /** Epoch ms after which the token must not be used. */
  expiresAt: number;
}

export type ExternalAuthErrorCode =
  | 'MISSING_ORG_ID'
  | 'INVALID_ORG'
  | 'RATE_LIMITED'
  | 'LOGIN_FAILED'
  | 'INVALID_TOKEN'
  | 'NETWORK'
  | 'SESSION_REJECTED';

const MESSAGES: Record<ExternalAuthErrorCode, string> = {
  MISSING_ORG_ID: 'This dashboard link is missing its organization ID. Please check the link.',
  INVALID_ORG: 'This organization does not have access to the dashboard link.',
  RATE_LIMITED: 'Too many sign-in attempts. Please wait a minute and try again.',
  LOGIN_FAILED: 'We could not sign you in to the dashboard. Please try again shortly.',
  INVALID_TOKEN: 'The sign-in service did not return a valid access token.',
  NETWORK: 'Unable to reach the sign-in service. Check your connection and try again.',
  SESSION_REJECTED: 'Your dashboard session was rejected by the server. Please try again.',
};

export class ExternalAuthError extends Error {
  constructor(public readonly code: ExternalAuthErrorCode) {
    super(MESSAGES[code]);
    this.name = 'ExternalAuthError';
  }
}

/**
 * How long the token is valid from now. Uses the JWT's own claims when present, otherwise
 * 24 hours. `exp - iat` is preferred because it is unaffected by a wrong device clock.
 */
function tokenLifetimeMs(token: string, receivedAt: number): number {
  try {
    const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp, iat } = JSON.parse(atob(encoded));
    if (typeof exp === 'number') {
      const lifetime = typeof iat === 'number' ? (exp - iat) * 1000 : exp * 1000 - receivedAt;
      if (lifetime > 0) return lifetime;
    }
  } catch {
    // Not a readable JWT.
  }
  return TOKEN_LIFETIME_MS;
}

export async function requestExternalSession(orgId: string): Promise<ExternalSession> {
  if (orgId !== EXTERNAL_ORG_ID) throw new ExternalAuthError('INVALID_ORG');

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const requestedAt = Date.now();
  const apiBaseUrl = getExternalApiBaseUrl();

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/api/users/external_login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vimsafedashboard@lockated.com',
        password: '123456',
        encrypted_organization: 'DD4571165CD3D5EA9C4652F54A7F1101',
      }),
      cache: 'no-store',
      signal: controller.signal,
    });
  } catch {
    throw new ExternalAuthError('NETWORK');
  } finally {
    window.clearTimeout(timeout);
  }

  if (response.status === 429) throw new ExternalAuthError('RATE_LIMITED');
  if (!response.ok) throw new ExternalAuthError('LOGIN_FAILED');

  const payload = await response.json().catch(() => null);
  if (!payload || (payload.code && Number(payload.code) !== 200)) {
    throw new ExternalAuthError('LOGIN_FAILED');
  }

  const token = payload.access_token;
  if (typeof token !== 'string' || !token.trim()) throw new ExternalAuthError('INVALID_TOKEN');

  const lifetime = tokenLifetimeMs(token, requestedAt);

  return {
    orgId,
    accessToken: token,
    apiBaseUrl,
    companyId: COMPANY_ID,
    refreshAt: requestedAt + lifetime - Math.min(REFRESH_MARGIN_MS, lifetime / 10),
    expiresAt: requestedAt + lifetime,
  };
}
