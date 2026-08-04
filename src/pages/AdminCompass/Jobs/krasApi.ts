// @ts-nocheck
import axios from "axios";
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

export const normalizeKra = (row) => {
  const nested = row?.kra && typeof row.kra === "object" ? row.kra : {};
  const id = firstDefined(row?.id, row?.kra_id, nested?.id);
  const title = String(
    firstDefined(row?.title, row?.name, row?.kra_name, nested?.title, nested?.name) ?? ""
  ).trim();
  if (!id || !title) return null;

  return {
    ...row,
    id,
    title,
    desc: String(firstDefined(row?.description, row?.desc, nested?.description) ?? "").trim(),
    weightage: toNum(firstDefined(row?.weight, row?.weightage, nested?.weightage)) ?? 0,
    departmentId: toNum(firstDefined(row?.department_id, row?.department?.id, nested?.department_id)),
    jdId: firstDefined(row?.job_description_id, row?.job_description?.id, nested?.job_description_id),
    status: String(firstDefined(row?.status, nested?.status, "active")).toLowerCase(),
  };
};

export const fetchKras = async ({
  departmentId,
  jobDescriptionId,
  assigneeId,
  search,
  status = "active",
  kraType = "job",
} = {}) => {
  const { baseUrl, token } = getApiContext();
  if (!baseUrl || !token) return null;
  const res = await fetch(buildApiUrl("/kras.json", {
    department_id: departmentId,
    job_description_id: jobDescriptionId,
    assignee_id: assigneeId,
    kra_type: kraType,
    status,
    search,
  }), { headers: apiHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json().catch(() => []);
  return unwrapRows(json, "kras").map(normalizeKra).filter(Boolean);
};

/**
 * GET {BASE_URL}/kras.json?access_token=…
 * Unfiltered list — used by the "Linked KRA" pickers in the Add/Edit KPI
 * modals, which must offer every KRA regardless of JD/department/assignee.
 */
export const fetchAllKras = async () => {
  const { baseUrl, token } = getApiContext();
  if (!baseUrl || !token) return null;
  const res = await fetch(buildApiUrl("/kras.json"), { headers: apiHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json().catch(() => []);
  return unwrapRows(json, "kras").map(normalizeKra).filter(Boolean);
};

/**
 * POST {BASE_URL}/kras.json?access_token=…   body: form-urlencoded
 *   kra_type, resource_type, resource_id, title, description, weightage,
 *   status + job_description_id, assignee_id, effective_from, effective_to
 */
export const createKra = async (form = {}) => {
  const { baseUrl, token } = getApiContext();
  if (!baseUrl || !token) return null;
  const params = new URLSearchParams();
  const put = (key, value) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  };
  put("kra_type", form.kraType || "general");
  put("resource_type", form.resourceType || "Pms::Department");
  put("resource_id", toNum(form.resourceId));
  put("title", form.title);
  put("description", form.desc || form.description);
  put("weightage", toNum(form.weightage));
  put("status", form.status || "active");
  put("job_description_id", toNum(form.jdId));
  put("assignee_id", toNum(form.assigneeId));
  put("effective_from", form.effectiveFrom);
  put("effective_to", form.effectiveTo);
  try {
    const res = await axios.post(buildApiUrl("/kras.json"), params, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });
    const json = res.data;
    const row = firstDefined(json?.data?.kra, json?.kra, json?.data, json);
    return row && typeof row === "object" ? normalizeKra(row) : null;
  } catch (err) {
    throw new Error(readAxiosError(err));
  }
};

/**
 * PATCH {BASE_URL}/kras/:id.json?access_token=…   body: form-urlencoded
 * Partial update of title, description, weightage, status, job_description_id,
 * assignee_id, effective_from / effective_to.
 */
export const updateKra = async (id, form = {}) => {
  const { baseUrl, token } = getApiContext();
  if (!baseUrl || !token) return null;
  const params = new URLSearchParams();
  const put = (key, value) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  };
  put("kra_type", form.kraType || "general");
  put("resource_type", form.resourceType || "Pms::Department");
  put("resource_id", toNum(form.resourceId));
  put("title", form.title);
  put("description", form.desc || form.description);
  put("weightage", toNum(form.weightage));
  put("status", form.status || "active");
  put("job_description_id", toNum(form.jdId));
  put("assignee_id", toNum(form.assigneeId));
  put("effective_from", form.effectiveFrom);
  put("effective_to", form.effectiveTo);
  try {
    const res = await axios.patch(buildApiUrl(`/kras/${id}.json`), params, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });
    const json = res.data;
    const row = firstDefined(json?.data?.kra, json?.kra, json?.data, json);
    return row && typeof row === "object" ? normalizeKra(row) : null;
  } catch (err) {
    throw new Error(readAxiosError(err));
  }
};

/**
 * PATCH {BASE_URL}/kras/:id.json?access_token=…   body: status=active|inactive
 * Sent as application/x-www-form-urlencoded (matches the documented curl).
 */
export const updateKraStatus = async (id, status) => {
  const { baseUrl, token } = getApiContext();
  if (!baseUrl || !token) return null;
  try {
    const res = await axios.patch(
      buildApiUrl(`/kras/${id}.json`),
      new URLSearchParams({ status: String(status) }),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const json = res.data;
    const row = firstDefined(json?.data?.kra, json?.kra, json?.data, json);
    return row && typeof row === "object" ? normalizeKra(row) : null;
  } catch (err) {
    throw new Error(readAxiosError(err));
  }
};

/** Extracts a readable message from an axios error response. */
const readAxiosError = (err) => {
  const data = err?.response?.data;
  if (data && typeof data === "object") {
    const message = firstDefined(
      data?.message,
      data?.error,
      Array.isArray(data?.errors) ? data.errors.join(", ") : undefined,
      typeof data?.errors === "object"
        ? Object.entries(data.errors)
            .map(([k, v]) => `${k} ${Array.isArray(v) ? v.join(", ") : v}`)
            .join("; ")
        : undefined
    );
    if (message) return message;
  }
  return err?.message || `HTTP ${err?.response?.status || 500}`;
};
