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

export const normalizeJobDescription = (row) => {
  const nested = row?.job_description && typeof row.job_description === "object"
    ? row.job_description
    : {};
  const id = firstDefined(row?.id, row?.job_description_id, nested?.id);
  const title = String(
    firstDefined(
      row?.job_title,
      row?.title,
      row?.name,
      row?.designation,
      nested?.job_title,
      nested?.title,
      nested?.name
    ) ?? ""
  ).trim();
  const department = firstDefined(row?.department, nested?.department);
  const departmentId = toNum(
    firstDefined(row?.department_id, row?.dept_id, department?.id, nested?.department_id)
  );
  const departmentName = String(
    firstDefined(row?.department_name, row?.dept_name, department?.name, nested?.department_name) ?? ""
  ).trim();

  if (!id || !title) return null;
  return {
    ...row,
    id,
    title,
    dept: departmentName || row?.dept || "",
    departmentId,
    departmentName,
  };
};

export const fetchJobDescriptions = async ({ search } = {}) => {
  const { baseUrl, token } = getApiContext();
  if (!baseUrl || !token) return null;
  const rows = await fetch(buildApiUrl("/job_descriptions", { search }), {
    headers: apiHeaders(),
  }).then(async (res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return unwrapRows(await res.json().catch(() => []), "job_descriptions", "jobs");
  });
  return rows.map(normalizeJobDescription).filter(Boolean);
};
