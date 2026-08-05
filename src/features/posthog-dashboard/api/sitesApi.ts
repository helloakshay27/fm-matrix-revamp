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
 * Every site on the tenant. `?all_sites=true` is what the rest of the app uses to get the
 * unscoped list (plain `/pms/sites.json` is scoped to the session's company and can come
 * back empty). Fetched directly rather than through the shared `site` Redux slice so this
 * page never overwrites the app-wide site switcher's list.
 *
 * If the unscoped list is unavailable we fall back to `allowed_sites` so the dropdown is
 * still usable, even though that list is narrower than "all sites".
 */
export async function fetchAllSites(): Promise<Site[]> {
  try {
    const res = await apiClient.get(`${ENDPOINTS.SITES}?all_sites=true`);
    const sites = normalise(readList<ApiSite>(res.data, 'sites', 'data'));
    if (sites.length) return sites;
  } catch {
    // fall through to the scoped list below
  }

  try {
    const res = await apiClient.get(ENDPOINTS.SITES);
    const sites = normalise(readList<ApiSite>(res.data, 'sites', 'data'));
    if (sites.length) return sites;
  } catch {
    // fall through to allowed_sites below
  }

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

  if (!userId) return [];
  try {
    const res = await apiClient.get(`${ENDPOINTS.ALLOWED_SITES}?user_id=${userId}`);
    return normalise(readList<ApiSite>(res.data, 'sites', 'data'));
  } catch {
    // Never throw: an empty list just means the dashboard reports tenant-wide numbers.
    return [];
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
