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

const normalizeUser = (row) => {
  const nested = row?.user && typeof row.user === "object" ? row.user : {};
  const id = toNum(firstDefined(row?.id, row?.user_id, nested?.id));
  const firstName = firstDefined(row?.first_name, row?.firstname, nested?.first_name, nested?.firstname);
  const lastName = firstDefined(row?.last_name, row?.lastname, nested?.last_name, nested?.lastname);
  const fullNameFromParts = [firstName, lastName]
    .filter((part) => typeof part === "string" && part.trim())
    .join(" ");
  const email = firstDefined(
    row?.email,
    row?.official_email,
    row?.work_email,
    nested?.email,
    nested?.official_email,
    nested?.work_email
  );
  const name = String(
    firstDefined(
      row?.full_name,
      row?.employee_name,
      row?.display_name,
      row?.name,
      nested?.full_name,
      nested?.name,
      fullNameFromParts,
      email,
      id ? `User ${id}` : ""
    ) || ""
  ).trim();

  if (id === undefined || !name) return null;
  return {
    id,
    name,
    email: email ? String(email) : "",
    departmentId: toNum(firstDefined(row?.department_id, row?.dept_id, nested?.department_id)),
  };
};

const sortByName = (users) => {
  const deduped = new Map(users.map((user) => [user.id, user]));
  return Array.from(deduped.values()).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
};

/**
 * GET {BASE_URL}/pms/users/get_escalate_to_users.json?access_token=…
 * Source for the "Assignee Person" pickers in the KPI modals.
 */
export const fetchEscalateToUsers = async () => {
  const { baseUrl, token } = getApiContext();
  if (!baseUrl || !token) return null;

  const res = await fetch(buildApiUrl("/pms/users/get_escalate_to_users.json"), {
    method: "GET",
    headers: apiHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json().catch(() => []);
  return sortByName(
    unwrapRows(json, "users", "escalate_to_users").map(normalizeUser).filter(Boolean)
  );
};

export const fetchUsersByOrganization = async () => {
  const { baseUrl, token, orgId } = getApiContext();
  if (!baseUrl || !token) return null;

  const query = orgId ? `?organization_id=${encodeURIComponent(orgId)}` : "";
  const res = await fetch(`${baseUrl}/api/users${query}`, {
    method: "GET",
    headers: apiHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json().catch(() => []);
  return sortByName(
    unwrapRows(json, "users", "fm_users").map(normalizeUser).filter(Boolean)
  );
};
