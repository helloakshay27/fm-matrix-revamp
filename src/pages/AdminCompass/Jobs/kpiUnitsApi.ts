// @ts-nocheck
/* ═══════════════════════════════════════════════════
   API — KPI units persistence via extra_fields
   Units live in one organisation-scoped extra_field group. `bulk_upsert`
   rewrites the `values` array, so every write sends the complete list.
   Caveat: bulk_upsert only upserts `item_1..item_N` — when the new list is
   SHORTER it leaves the trailing rows behind, so a removed unit comes back on
   the next GET (and repeated removals pile up duplicates). Every save therefore
   re-reads the group and deletes whatever the upsert failed to prune.
   Nothing about the units is hardcoded in the frontend.
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

const rowName = (row) =>
  String(
    firstDefined(row?.field_value, row?.value, row?.field_name) ?? ""
  ).trim();

/** Raw group rows in server order, keeping the id needed for pruning. */
const fetchKpiUnitRows = async () => {
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
  return unwrapRows(json, "extra_fields")
    .map((row) => ({
      id: row?.id,
      name: rowName(row),
      isDefault: isDefaultUnitRow(row),
    }))
    .filter((row) => row.name);
};

/**
 * Returns [{ name, isDefault }] with defaults first, or null when there is no
 * org/auth context. An empty array means "group not seeded yet" — distinct from
 * a failed request, which throws. Duplicate names left behind by earlier
 * un-pruned saves are collapsed so the list stays readable.
 */
export const fetchKpiUnits = async () => {
  const rows = await fetchKpiUnitRows();
  if (rows === null) return null;
  const seen = new Set();
  const units = [];
  rows.forEach((row) => {
    const key = row.name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    units.push({ name: row.name, isDefault: row.isDefault });
  });
  // Defaults first, preserving server order within each group.
  return [
    ...units.filter((u) => u.isDefault),
    ...units.filter((u) => !u.isDefault),
  ];
};

const deleteExtraFieldRow = async (id) => {
  const res = await fetch(buildApiUrl(`/extra_fields/${id}.json`), {
    method: "DELETE",
    headers: apiHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
};

/**
 * Deletes rows the upsert left behind: anything whose value is not in the
 * intended list, plus duplicates of a value that appears once. Throws if a
 * stale row survives, so the caller can roll back and report the failure
 * instead of showing a delete that silently reappears.
 */
const pruneStaleRows = async (intendedNames) => {
  const rows = await fetchKpiUnitRows();
  if (rows === null) return;
  const remaining = intendedNames.map((name) => name.toLowerCase());
  const stale = [];
  rows.forEach((row) => {
    const idx = remaining.indexOf(row.name.toLowerCase());
    if (idx === -1) stale.push(row);
    else remaining.splice(idx, 1);
  });
  if (!stale.length) return;
  const undeletable = stale.filter((row) => row.id === undefined || row.id === null);
  await Promise.all(stale.filter((row) => row.id != null).map((row) => deleteExtraFieldRow(row.id)));
  if (undeletable.length)
    throw new Error(
      `server kept ${undeletable.length} stale row(s) with no id to delete`
    );
};

/** Whole-group upsert — pass the complete [{ name }] list, defaults included. */
export const saveKpiUnits = async (units) => {
  const { baseUrl, token, orgId } = getApiContext();
  if (!baseUrl || !token) throw new Error("Missing base URL or auth token");
  if (!orgId) throw new Error("No organization selected");
  const names = units.map((u) => u.name);
  const res = await fetch(buildApiUrl("/extra_fields/bulk_upsert.json"), {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify({
      extra_field: {
        resource_type: "Organization",
        resource_id: Number(orgId),
        group_name: KPI_UNITS_GROUP,
        values: names,
      },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json().catch(() => ({}));
  await pruneStaleRows(names);
  return json;
};
