// @ts-nocheck
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
