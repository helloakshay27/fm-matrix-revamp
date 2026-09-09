import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';
import type { Site } from '../data/constants';

interface ApiSite {
  id: number;
  name: string;
  company_id?: number;
  company_name?: string;
}

/** The endpoint has three known response shapes across the app — accept all of them. */
function readList<T>(data: unknown, ...keys: string[]): T[] {
  if (Array.isArray(data)) return data as T[];
  const d = (data ?? {}) as Record<string, unknown>;
  for (const k of keys) if (Array.isArray(d[k])) return d[k] as T[];
  return [];
}

function normalise(raw: ApiSite[]): Site[] {
  return raw
    .filter((s) => s && s.id != null)
    .map((s) => ({
      id: String(s.id),
      name: s.name ?? `Site ${s.id}`,
      companyId: s.company_id != null ? String(s.company_id) : undefined,
      companyName: s.company_name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Sites scoped to the logged-in user's selected organisation.
 * Reads `selectedOrgId` / `organization_id` / `org_id` from localStorage and
 * passes it to `/pms/sites.json` so only the relevant sites come back.
 *
 * Falls back to `allowed_sites` if the scoped list is empty or unavailable.
 */
export async function fetchAllSites(): Promise<Site[]> {
  const userId =
    localStorage.getItem('userId') ??
    sessionStorage.getItem('userId') ??
    (() => {
      try {
        return JSON.parse(localStorage.getItem('user') ?? 'null')?.id ?? null;
      } catch {
        return null;
      }
    })();

  // Try allowed_sites for the current user first so they see all sites they have access to
  if (userId) {
    try {
      const res = await apiClient.get(`${ENDPOINTS.ALLOWED_SITES}?user_id=${userId}`);
      const sites = normalise(readList<ApiSite>(res.data, 'sites', 'data'));
      if (sites.length) return sites;
    } catch {
      // fall through to org-scoped sites below
    }
  }

  // Fallback: org-scoped sites
  const orgId =
    localStorage.getItem('selectedOrgId') ??
    localStorage.getItem('organization_id') ??
    localStorage.getItem('org_id');

  try {
    const url = orgId
      ? `${ENDPOINTS.SITES}?organization_id=${orgId}`
      : `${ENDPOINTS.SITES}`;
    const res = await apiClient.get(url);
    return normalise(readList<ApiSite>(res.data, 'sites', 'data'));
  } catch {
    // Do not omit `site_id` after a scope lookup fails: that would turn a
    // scoped dashboard request into a tenant-wide analytics request.
    throw new Error('Unable to load the sites permitted for this dashboard.');
  }
}

interface ApiCompany {
  id: number;
  name?: string;
  company_name?: string;
}

/**
 * Company names for the Regional tier. Sites carry a `company_id` but not always a name,
 * so this fills the labels in. Failure is non-fatal — the tier falls back to `Company {id}`.
 */
export async function fetchCompanyNames(): Promise<Record<string, string>> {
  try {
    const res = await apiClient.get(ENDPOINTS.ALLOWED_COMPANIES);
    const list = readList<ApiCompany>(res.data, 'companies', 'data');
    const out: Record<string, string> = {};
    for (const c of list) {
      if (c?.id != null) out[String(c.id)] = c.company_name ?? c.name ?? `Company ${c.id}`;
    }
    return out;
  } catch {
    return {};
  }
}
