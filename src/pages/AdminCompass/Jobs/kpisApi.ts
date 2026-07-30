// @ts-nocheck
/* ═══════════════════════════════════════════════════
   API — KPIs
   GET    {BASE_URL}/kpis.json?access_token=…&q[name_cont]=…&q[department_id_eq]=…
                                &kra_id=…&job_description_id=…
   POST   {BASE_URL}/kpis.json?access_token=…            { kpi: {…} }
   PATCH  {BASE_URL}/kpis/:id.json?access_token=…        { kpi: {…partial} }
   ═══════════════════════════════════════════════════ */
import {
  getApiContext,
  buildApiUrl,
  apiHeaders,
  unwrapRows,
  firstDefined,
} from "./apiClient";

const toNum = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

/** API sends "monthly"; the pickers use "Monthly". */
const titleCase = (value) => {
  const text = String(value ?? "").trim();
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const assigneeList = (row) => {
  const raw = firstDefined(row?.assignees, row?.assigned_users, row?.users);
  if (!Array.isArray(raw)) return { ids: [], names: [] };
  return {
    ids: raw
      .map((a) => toNum(typeof a === "object" ? firstDefined(a?.id, a?.user_id) : a))
      .filter((id) => id !== undefined),
    names: raw
      .map((a) =>
        String(
          typeof a === "object"
            ? firstDefined(a?.name, a?.full_name, a?.user_name) ?? ""
            : ""
        ).trim()
      )
      .filter(Boolean),
  };
};

/** Server row → the shape the KPI tab already renders. */
export const normalizeKpi = (row) => {
  const assignees = assigneeList(row);
  const active = firstDefined(row?.active, row?.is_active);
  const status =
    active !== undefined
      ? active === true || String(active).toLowerCase() === "true"
        ? "active"
        : "inactive"
      : String(firstDefined(row?.status, "active")).toLowerCase();
  const dataSource = String(firstDefined(row?.data_source, row?.dataSource) ?? "").trim();
  return {
    id: firstDefined(row?.id, row?.kpi_id),
    name: String(firstDefined(row?.name, row?.title) ?? "").trim(),
    unit: String(firstDefined(row?.unit, row?.kpi_unit) ?? "").trim(),
    freq: titleCase(firstDefined(row?.frequency, row?.freq, row?.target_frequency)),
    target: firstDefined(row?.target_value, row?.target) ?? "",
    weightage: toNum(firstDefined(row?.weight, row?.weightage)) ?? 0,
    measurementType: String(
      firstDefined(row?.measurement_type, row?.measurementType, "positive")
    ).toLowerCase(),
    dataSource,
    module: String(firstDefined(row?.module_name, row?.module) ?? "").trim(),
    departmentId: toNum(firstDefined(row?.department_id, row?.department?.id)),
    departmentName: String(
      firstDefined(row?.department_name, row?.department?.name) ?? ""
    ).trim(),
    kraId: firstDefined(row?.kra_id, row?.kra?.id),
    kraName: String(firstDefined(row?.kra_name, row?.kra?.title, row?.kra?.name) ?? "").trim(),
    jdId: firstDefined(row?.job_description_id, row?.job_description?.id),
    jdTitleFromApi: String(
      firstDefined(row?.job_description_title, row?.job_description?.title) ?? ""
    ).trim(),
    assigneeIds: assignees.ids.length
      ? assignees.ids
      : (Array.isArray(row?.assignee_ids) ? row.assignee_ids.map(toNum).filter(Boolean) : []),
    assigneeNames: assignees.names,
    // Explicit when the server sends it, otherwise inferred from data_source.
    updateType: String(
      firstDefined(row?.update_type, row?.updateType, dataSource ? "automatic" : "manual")
    ).toLowerCase(),
    status,
    // Kept so a status PATCH can reuse whichever key the row actually carries.
    hasActiveFlag: active !== undefined,
  };
};

/**
 * UI form → `kpi` payload. Only defined values are included, so the same helper
 * builds a full POST body and a partial PATCH body.
 */
export const toKpiPayload = (form = {}) => {
  const kpi = {};
  const put = (key, value) => {
    if (value !== undefined && value !== null && value !== "") kpi[key] = value;
  };
  put("name", form.name?.trim?.() ?? form.name);
  put("unit", form.unit);
  put("frequency", form.freq ? String(form.freq).toLowerCase() : undefined);
  put("target_value", toNum(form.target));
  put("weight", toNum(form.weightage));
  put("measurement_type", form.measurementType);
  put("data_source", form.dataSource);
  put("module_name", form.module);
  put("department_id", toNum(form.departmentId));
  put("kra_id", toNum(form.kraId));
  if (Array.isArray(form.assigneeIds) && form.assigneeIds.length)
    kpi.assignee_ids = form.assigneeIds.map(toNum).filter((id) => id !== undefined);
  return kpi;
};

/** Returns normalized KPIs, or null when there is no auth/base-url context. */
export const fetchKpis = async ({
  search,
  departmentId,
  kraId,
  jobDescriptionId,
} = {}) => {
  const { baseUrl, token } = getApiContext();
  if (!baseUrl || !token) return null;
  const url = buildApiUrl("/kpis.json", {
    "q[name_cont]": search,
    "q[department_id_eq]": departmentId,
    kra_id: kraId,
    job_description_id: jobDescriptionId,
  });
  const res = await fetch(url, { headers: apiHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return unwrapRows(json, "kpis").map(normalizeKpi);
};

export const createKpi = async (form) => {
  const res = await fetch(buildApiUrl("/kpis.json"), {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify({ kpi: toKpiPayload(form) }),
  });
  if (!res.ok) throw new Error(await readError(res));
  const json = await res.json().catch(() => ({}));
  const row = firstDefined(json?.data?.kpi, json?.kpi, json?.data, json);
  return row && typeof row === "object" ? normalizeKpi(row) : null;
};

export const updateKpi = async (id, patch) => {
  const res = await fetch(buildApiUrl(`/kpis/${id}.json`), {
    method: "PATCH",
    headers: apiHeaders(),
    body: JSON.stringify({ kpi: patch }),
  });
  if (!res.ok) throw new Error(await readError(res));
  const json = await res.json().catch(() => ({}));
  const row = firstDefined(json?.data?.kpi, json?.kpi, json?.data, json);
  return row && typeof row === "object" ? normalizeKpi(row) : null;
};

/** Surfaces the server's validation message instead of a bare status code. */
const readError = async (res) => {
  try {
    const json = await res.json();
    const message = firstDefined(
      json?.message,
      json?.error,
      Array.isArray(json?.errors) ? json.errors.join(", ") : undefined,
      typeof json?.errors === "object"
        ? Object.entries(json.errors)
            .map(([k, v]) => `${k} ${Array.isArray(v) ? v.join(", ") : v}`)
            .join("; ")
        : undefined
    );
    if (message) return String(message);
  } catch {
    /* fall through to the status code */
  }
  return `HTTP ${res.status}`;
};
