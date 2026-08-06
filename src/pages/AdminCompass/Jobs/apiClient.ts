// @ts-nocheck
/* ═══════════════════════════════════════════════════
   Shared request plumbing for the Jobs module.
   Base URL / token / org id all come from localStorage, written at login and
   organization-select time.
   ═══════════════════════════════════════════════════ */

export const getApiBaseUrl = () => {
  let url = localStorage.getItem("baseUrl") ?? "";
  url = url.trim().replace(/\/+$/, "");
  if (url && !/^https?:\/\//.test(url)) url = `https://${url}`;
  return url;
};

export const getApiContext = () => ({
  baseUrl: getApiBaseUrl(),
  token: localStorage.getItem("token") || "",
  orgId:
    localStorage.getItem("org_id") ||
    localStorage.getItem("organization_id") ||
    (() => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return String(user?.organization_id || user?.org_id || user?.company_id || "");
      } catch {
        return "";
      }
    })(),
});

/**
 * Builds `{baseUrl}{path}?access_token=…&…params`, skipping null/undefined
 * params. `access_token` is always first so it matches the documented URLs.
 */
export const buildApiUrl = (path, params = {}) => {
  const { baseUrl, token } = getApiContext();
  const search = new URLSearchParams({ access_token: token });
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  return `${baseUrl}${path}?${search.toString()}`;
};

export const apiHeaders = () => {
  const { token } = getApiContext();
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Ye API 20 rows/page bhejti hai (`pagination.total_pages`). List tabs sara
 * filtering client-side karte hain, isliye sirf page 1 laane par rows chup-chaap
 * gayab ho jaati hain. Ye helper saare pages laakar ek array me jodta hai.
 */
export const fetchAllPages = async (path, params = {}, ...rowKeys) => {
  const rows = [];
  let page = 1;
  // Runaway loop se bachne ke liye upper bound.
  const MAX_PAGES = 50;
  for (; page <= MAX_PAGES; page += 1) {
    const res = await fetch(buildApiUrl(path, { ...params, page }), {
      headers: apiHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    rows.push(...unwrapRows(json, ...rowKeys));
    const totalPages = Number(json?.pagination?.total_pages);
    const nextPage = Number(json?.pagination?.next_page);
    if (!Number.isFinite(totalPages) || page >= totalPages) break;
    if (!Number.isFinite(nextPage) || nextPage <= page) break;
  }
  return rows;
};

/** Pulls the row array out of the several envelope shapes this API uses. */
export const unwrapRows = (json, ...keys) => {
  if (Array.isArray(json)) return json;
  for (const key of ["data", ...keys]) {
    if (Array.isArray(json?.[key])) return json[key];
    if (Array.isArray(json?.data?.[key])) return json.data[key];
  }
  return [];
};

export const firstDefined = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
};
