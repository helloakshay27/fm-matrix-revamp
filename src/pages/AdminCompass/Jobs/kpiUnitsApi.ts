// @ts-nocheck
/* ═══════════════════════════════════════════════════
   API — KPI units persistence via extra_fields
   Units live in one organisation-scoped extra_field group. `bulk_upsert`
   replaces the whole `values` array in a single call, so every write sends the
   complete list. Nothing about the units is hardcoded in the frontend.
   ═══════════════════════════════════════════════════ */
import {
  getApiContext,
  buildApiUrl,
  apiHeaders,
  unwrapRows,
  firstDefined,
} from "./apiClient";

export const KPI_UNITS_GROUP = "kpi_units_configuration";

// Whether a returned extra_field row is a seeded default (locked, badged
// "Default") or a user-added unit (removable). Read straight off the row so no
// unit list has to be hardcoded here.
export const isDefaultUnitRow = (row) => {
  const flag = row?.is_default ?? row?.default ?? row?.isDefault;
  if (flag !== undefined && flag !== null)
    return flag === true || String(flag).toLowerCase() === "true";
  // Fallback: some seeds tag defaults through field_name instead of a boolean.
  return /^(default|defaults)$/i.test(String(row?.field_name ?? "").trim());
};

/**
 * Returns [{ name, isDefault }] with defaults first, or null when there is no
 * org/auth context. An empty array means "group not seeded yet" — distinct from
 * a failed request, which throws.
 */
export const fetchKpiUnits = async () => {
  const { baseUrl, token, orgId } = getApiContext();
  if (!baseUrl || !token || !orgId) return null;
  const url = buildApiUrl("/extra_fields.json", {
    resource_type: "Organization",
    resource_id: orgId,
    group_name: KPI_UNITS_GROUP,
  });
  const res = await fetch(url, { headers: apiHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const rows = unwrapRows(json, "extra_fields");
  const units = rows
    .map((row) => ({
      name: String(
        firstDefined(row?.field_value, row?.value, row?.field_name) ?? ""
      ).trim(),
      isDefault: isDefaultUnitRow(row),
    }))
    .filter((unit) => unit.name);
  // Defaults first, preserving server order within each group.
  return [
    ...units.filter((u) => u.isDefault),
    ...units.filter((u) => !u.isDefault),
  ];
};

/** Whole-group upsert — pass the complete [{ name }] list, defaults included. */
export const saveKpiUnits = async (units) => {
  const { baseUrl, token, orgId } = getApiContext();
  if (!baseUrl || !token) throw new Error("Missing base URL or auth token");
  if (!orgId) throw new Error("No organization selected");
  const res = await fetch(buildApiUrl("/extra_fields/bulk_upsert.json"), {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify({
      extra_field: {
        resource_type: "Organization",
        resource_id: Number(orgId),
        group_name: KPI_UNITS_GROUP,
        values: units.map((u) => u.name),
      },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json().catch(() => ({}));
};
