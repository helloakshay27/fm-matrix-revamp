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
  orgId: localStorage.getItem("org_id") || "",
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
