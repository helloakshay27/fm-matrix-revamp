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
 * KRA kis cheez se linked hai — job description ke saath ho to `job`, warna
 * `general`. JD linked hone par explicit `kraType` se bhi upar yahi rule chalta
 * hai, taki purani rows update par sahi type me chali jayein.
 */
const kraTypeFor = (form = {}) => {
  if (toNum(form.jdId) !== undefined) return "job";
  return form.kraType || "general";
};

/** Chuni gayi assignee ids (form me array ho ya single). */
const assigneeIdsOf = (form = {}) => {
  const many = Array.isArray(form.assigneeIds)
    ? form.assigneeIds.map(toNum).filter((id) => id !== undefined)
    : [];
  if (many.length) return many;
  const single = toNum(form.assigneeId);
  return single !== undefined ? [single] : [];
};

/**
 * Assignee fields — `assignee_ids` ek asli JSON array jata hai (wahi shape jo
 * KPI API me jata hai: `assignee_ids: [286725, 189037, 305677]`), aur
 * `assignee_id` me pehla member, kyunki API single assignee bhi rakhta hai.
 */
const assigneePayload = (form = {}) => {
  const ids = assigneeIdsOf(form);
  if (!ids.length) return {};
  return { assignee_id: ids[0], assignee_ids: ids };
};

/** Sirf bhare hue fields bhejte hain — khali/undefined skip. */
const compact = (payload = {}) =>
  Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

/**
 * POST {BASE_URL}/kras.json?access_token=…   body: JSON
 *   { kra_type, resource_type, resource_id, title, description, weightage,
 *     status, job_description_id, assignee_id, assignee_ids: [...],
 *     effective_from, effective_to }
 */
export const createKra = async (form = {}) => {
  const { baseUrl, token } = getApiContext();
  if (!baseUrl || !token) return null;
  const body = {
    ...compact({
      kra_type: kraTypeFor(form),
      resource_type: form.resourceType || "Pms::Department",
      resource_id: toNum(form.resourceId),
      title: form.title,
      description: form.desc || form.description,
      weightage: toNum(form.weightage),
      status: form.status || "active",
      job_description_id: toNum(form.jdId),
      effective_from: form.effectiveFrom,
      effective_to: form.effectiveTo,
    }),
    ...assigneePayload(form),
  };
  try {
    const res = await axios.post(buildApiUrl("/kras.json"), body, {
      headers: apiHeaders(),
    });
    const json = res.data;
    const row = firstDefined(json?.data?.kra, json?.kra, json?.data, json);
    return row && typeof row === "object" ? normalizeKra(row) : null;
  } catch (err) {
    throw new Error(readAxiosError(err));
  }
};

/**
 * PATCH {BASE_URL}/kras/:id.json?access_token=…   body: JSON
 * Partial update — title, description, weightage, status, job_description_id,
 * assignee_id + assignee_ids (array), effective_from / effective_to.
 */
export const updateKra = async (id, form = {}) => {
  const { baseUrl, token } = getApiContext();
  if (!baseUrl || !token) return null;
  const body = {
    ...compact({
      kra_type: kraTypeFor(form),
      resource_type: form.resourceType || "Pms::Department",
      resource_id: toNum(form.resourceId),
      title: form.title,
      description: form.desc || form.description,
      weightage: toNum(form.weightage),
      status: form.status || "active",
      job_description_id: toNum(form.jdId),
      effective_from: form.effectiveFrom,
      effective_to: form.effectiveTo,
    }),
    ...assigneePayload(form),
  };
  try {
    const res = await axios.patch(buildApiUrl(`/kras/${id}.json`), body, {
      headers: apiHeaders(),
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

/**
 * PATCH {BASE_URL}/kras/:id.json?access_token=…   body: JSON
 *   { "assignee_id": 286725, "assignee_ids": [286725, 189037, 305677] }
 *
 * Sirf assignee update karta hai — baaki fields (title, weightage, dates…)
 * bheje hi nahi jate, taki galti se overwrite na hon. `assignee_ids` array me
 * saare members (KPI API jaisa hi shape), aur `assignee_id` me pehla, kyunki
 * API single assignee bhi rakhta hai. Khali list = assignee hata do.
 */
export const updateKraAssignees = async (id, assigneeIds = []) => {
  const { baseUrl, token } = getApiContext();
  if (!baseUrl || !token) return null;
  const ids = (assigneeIds || [])
    .map((value) => toNum(value))
    .filter((value) => value !== undefined);
  const body = {
    assignee_id: ids.length ? ids[0] : null,
    assignee_ids: ids,
  };
  try {
    const res = await axios.patch(buildApiUrl(`/kras/${id}.json`), body, {
      headers: apiHeaders(),
    });
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
