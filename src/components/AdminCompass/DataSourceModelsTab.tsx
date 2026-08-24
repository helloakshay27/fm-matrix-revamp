import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Table2, Search, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getFullUrl, getAuthHeader } from "@/config/apiConfig";

// Admin Compass design tokens — matches the Rule Engine / Data Source pages.
const T = {
  primary: "#DA7756",
  primaryHov: "#c9673f",
  primaryBg: "#fdf9f7",
  primaryBord: "#e8e3de",
  cardBg: "#ffffff",
  textMain: "#1a1a1a",
  textMuted: "#6b7280",
  borderLgt: "#ebebeb",
};

const inputStyle = {
  borderColor: T.primaryBord,
  color: T.textMain,
  background: T.cardBg,
};

/** The subset of a data source this tab needs. */
export interface ModelsTabSource {
  id: number;
  datasource_name: string | null;
  /**
   * Drives the pull_schema payload's "type". The datasource GET response does
   * not send this key yet, so "external" is used until it does.
   */
  type?: string | null;
}

interface SchemaTable {
  /** Real table name — this is what pull_schema expects. */
  name: string;
  /** Human label from the API when it sends one. */
  displayName: string;
}

/**
 * Reads the table list out of the schema_preview response. The exact shape is
 * unconfirmed, so both a bare array and the common wrapper keys are accepted,
 * and entries may be plain strings or objects.
 */
const parseTables = (body: any): SchemaTable[] => {
  const raw: any[] = Array.isArray(body)
    ? body
    : body?.tables ?? body?.schema ?? body?.data ?? [];

  const seen = new Set<string>();
  const tables: SchemaTable[] = [];

  for (const entry of raw) {
    if (typeof entry === "string") {
      if (!entry || seen.has(entry)) continue;
      seen.add(entry);
      tables.push({ name: entry, displayName: entry });
      continue;
    }

    const name = String(
      entry?.name ?? entry?.table_name ?? entry?.table ?? ""
    ).trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);

    const displayName = String(
      entry?.display_name ?? entry?.displayName ?? entry?.label ?? name
    ).trim();

    tables.push({ name, displayName: displayName || name });
  }

  return tables;
};

/**
 * Strips everything but letters and digits: "project_managements" and
 * "ProjectManagements" both become "projectmanagements".
 */
const canon = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Same, minus a trailing "s", so a singular model matches a plural table. */
const canonSingular = (value: string) => canon(value).replace(/s$/, "");

/**
 * Collects the table identifiers out of the available_models dropdown response,
 * canonicalised for matching.
 *
 * The endpoint returns a bare array of
 *   { id, display_name, lock_model_name }
 * where lock_model_name is the real table name — and it is not always derivable
 * from display_name ("Adjustments" -> "spree_adjustments", "Functions" ->
 * "api_functions"), so that key is what actually matters. display_name and the
 * other keys are kept as fallbacks in case the shape shifts.
 */
const parsePulledNames = (body: any): Set<string> => {
  const raw: any[] = Array.isArray(body)
    ? body
    : body?.models ?? body?.available_models ?? body?.data ?? [];

  const names = new Set<string>();
  const add = (value: unknown) => {
    const text = String(value ?? "").trim();
    if (!text) return;
    names.add(canon(text));
    names.add(canonSingular(text));
  };

  for (const entry of raw) {
    if (typeof entry === "string") {
      add(entry);
      continue;
    }
    add(entry?.lock_model_name);
    add(entry?.display_name);
    add(entry?.table_name);
    add(entry?.name);
    add(entry?.value);
    add(entry?.model);
    add(entry?.model_name);
    add(entry?.label);
  }
  return names;
};

interface DataSourceModelsTabProps {
  sources: ModelsTabSource[];
  sourcesLoading?: boolean;
}

export const DataSourceModelsTab = ({
  sources,
  sourcesLoading,
}: DataSourceModelsTabProps) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [tables, setTables] = useState<SchemaTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pulling, setPulling] = useState(false);
  const [search, setSearch] = useState("");
  const [pulledNames, setPulledNames] = useState<Set<string>>(new Set());
  // Non-blocking: the table list still renders when this request fails.
  const [pulledError, setPulledError] = useState<string | null>(null);

  const selectedSource = useMemo(
    () => sources.find((s) => String(s.id) === selectedId),
    [sources, selectedId]
  );

  const loadSchema = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    setTables([]);
    setSelected(new Set());
    setPulledNames(new Set());
    setPulledError(null);

    const headers = {
      Authorization: getAuthHeader(),
      Accept: "application/json",
    };

    try {
      // Both run together: the full table list, plus the models already pulled
      // for this data source so their rows come up pre-ticked. A failure to
      // read the pulled list is non-fatal — the table list still renders.
      const [schemaResponse, pulledResult] = await Promise.all([
        fetch(
          getFullUrl(`/datasources/${id}/schema_preview.json?columns=false`),
          { headers }
        ),
        fetch(
          getFullUrl(
            `/rule_engine/available_models/dropdown.json?datasource_id=${id}`
          ),
          { headers }
        )
          .then(async (r) =>
            r.ok
              ? { body: await r.json(), error: null }
              : { body: null, error: `HTTP ${r.status}` }
          )
          .catch((e: any) => ({
            body: null,
            error: e?.message || "request failed",
          })),
      ]);

      if (pulledResult.error) {
        setPulledError(pulledResult.error);
      }
      const pulled = parsePulledNames(pulledResult.body);

      if (!schemaResponse.ok) {
        throw new Error(`Failed to load tables (${schemaResponse.status})`);
      }

      const parsed = parseTables(await schemaResponse.json());
      setTables(parsed);

      // Matched on canonical forms so "project_managements" still lines up
      // with a "ProjectManagement" style model name from the dropdown.
      const alreadyPulled = parsed
        .filter(
          (t) => pulled.has(canon(t.name)) || pulled.has(canonSingular(t.name))
        )
        .map((t) => t.name);

      // If the dropdown returned data but nothing matched, the response shape
      // is not one of the ones parsePulledNames handles. Say so loudly rather
      // than rendering an all-unchecked list that looks correct.
      if (pulled.size > 0 && alreadyPulled.length === 0) {
        console.warn(
          "[Models] available_models returned data but no table names matched " +
            "the schema_preview list. Check the response shape.",
          { pulledBody: pulledResult.body, schemaTables: parsed.map((t) => t.name) }
        );
      }

      setPulledNames(new Set(alreadyPulled));
      setSelected(new Set(alreadyPulled));
    } catch (e: any) {
      setError(e?.message || "Failed to load tables");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setTables([]);
      setSelected(new Set());
      setPulledNames(new Set());
      setError(null);
      return;
    }
    loadSchema(selectedId);
  }, [selectedId, loadSchema]);

  /**
   * POST /datasources/:id/pull_schema.json with the full current selection —
   * the payload carries the whole list, not a delta.
   */
  const pullSchema = async (tableNames: string[]) => {
    if (!selectedId) return;
    setPulling(true);
    try {
      const response = await fetch(
        getFullUrl(`/datasources/${selectedId}/pull_schema.json`),
        {
          method: "POST",
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: selectedSource?.type || "external",
            tables: tableNames,
          }),
        }
      );

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          body?.message ||
            body?.error ||
            `Failed to pull schema (${response.status})`
        );
      }

      // The response's own count wins when it sends one, since the server may
      // pull more than the tables ticked here.
      const pulledCount =
        body?.table_count ??
        body?.tables_count ??
        body?.count ??
        body?.pulled_count ??
        tableNames.length;

      toast.success(`Pulled ${pulledCount} table(s) from database`);
    } catch (e: any) {
      toast.error(e?.message || "Failed to pull schema");
    } finally {
      setPulling(false);
    }
  };

  const toggleTable = (name: string) => {
    const next = new Set(selected);
    if (next.has(name)) {
      next.delete(name);
    } else {
      next.add(name);
    }
    setSelected(next);
  };

  const visibleTables = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tables;
    return tables.filter(
      (t) =>
        t.displayName.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)
    );
  }, [tables, search]);

  const allVisibleSelected =
    visibleTables.length > 0 &&
    visibleTables.every((t) => selected.has(t.name));

  // Acts on the rows currently in view, so it stays predictable while a search
  // filter is applied.
  const toggleAllVisible = () => {
    const next = new Set(selected);
    if (allVisibleSelected) {
      visibleTables.forEach((t) => next.delete(t.name));
    } else {
      visibleTables.forEach((t) => next.add(t.name));
    }
    setSelected(next);
  };


  return (
    <div className="space-y-4">
      {/* Data source picker */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <label
            className="mb-1.5 block text-xs font-medium"
            style={{ color: T.textMain }}
          >
            Data Source
          </label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={sourcesLoading}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none disabled:opacity-60"
            style={inputStyle}
          >
            <option value="">
              {sourcesLoading
                ? "Loading data sources..."
                : sources.length === 0
                  ? "No data sources available"
                  : "Select a data source"}
            </option>
            {sources.map((source) => (
              <option key={source.id} value={String(source.id)}>
                {source.datasource_name || `Data source #${source.id}`}
              </option>
            ))}
          </select>
        </div>

        {tables.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: T.textMuted }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tables..."
                className="w-full rounded-xl border py-2 pl-10 pr-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
            <button
              onClick={toggleAllVisible}
              disabled={pulling || visibleTables.length === 0}
              className="whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-60"
              style={{ borderColor: T.primary, color: T.primary }}
            >
              {allVisibleSelected ? "Clear all" : "Select all"}
            </button>
            <span
              className="whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-medium"
              style={{
                borderColor: T.primaryBord,
                background: T.primaryBg,
                color: T.textMuted,
              }}
            >
              {selected.size} selected
            </span>
            <button
              onClick={() => pullSchema([...selected])}
              disabled={pulling || selected.size === 0}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-medium text-white transition-colors disabled:opacity-60"
              style={{ background: T.primary }}
              onMouseEnter={(e) => {
                if (!pulling && selected.size > 0) {
                  e.currentTarget.style.background = T.primaryHov;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.primary;
              }}
            >
              {pulling ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {pulling ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Table list */}
      {!selectedId ? (
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-12 text-center"
          style={{ borderColor: T.primaryBord }}
        >
          <Table2 className="h-8 w-8" style={{ color: T.primaryBord }} />
          <p className="text-sm font-medium" style={{ color: T.textMain }}>
            Select a data source
          </p>
          <p className="text-xs" style={{ color: T.textMuted }}>
            Its tables will show up here for you to pick from.
          </p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12">
          <Loader2
            className="h-6 w-6 animate-spin"
            style={{ color: T.primary }}
          />
          <p className="text-xs" style={{ color: T.textMuted }}>
            Loading tables...
          </p>
        </div>
      ) : error ? (
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-12 text-center"
          style={{ borderColor: T.primaryBord }}
        >
          <p className="text-sm font-medium text-red-600">{error}</p>
          <button
            onClick={() => loadSchema(selectedId)}
            className="mt-1 rounded-xl px-4 py-2 text-sm font-medium text-white"
            style={{ background: T.primary }}
          >
            Try again
          </button>
        </div>
      ) : visibleTables.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-12 text-center"
          style={{ borderColor: T.primaryBord }}
        >
          <Table2 className="h-8 w-8" style={{ color: T.primaryBord }} />
          <p className="text-sm font-medium" style={{ color: T.textMain }}>
            {tables.length === 0 ? "No tables found" : "No matching tables"}
          </p>
        </div>
      ) : (
        <>
          {pulledError ? (
            <div
              className="mb-3 flex items-start gap-2 rounded-xl border px-3 py-2 text-xs"
              style={{
                borderColor: "#f5d9a8",
                background: "#fdf6e7",
                color: "#8a5a00",
              }}
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Could not read already-pulled models ({pulledError}) — nothing is
                pre-selected.
              </span>
            </div>
          ) : (
            <p className="mb-3 text-xs" style={{ color: T.textMuted }}>
              {pulledNames.size > 0
                ? `${pulledNames.size} of ${tables.length} table(s) already pulled and pre-selected.`
                : `No tables pulled yet for this data source (${tables.length} available).`}
            </p>
          )}

        <div
          className="divide-y rounded-xl border"
          style={{ borderColor: T.primaryBord }}
        >
          {visibleTables.map((table) => {
            const checked = selected.has(table.name);
            return (
              <label
                key={table.name}
                className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-[#f6f4ee]"
                style={{ borderColor: T.borderLgt }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleTable(table.name)}
                  className="h-4 w-4 shrink-0 cursor-pointer accent-[#DA7756]"
                />
                <span
                  className="min-w-0 flex-1 truncate text-sm font-medium"
                  style={{ color: T.textMain }}
                >
                  {table.displayName}
                </span>
                {table.displayName !== table.name && (
                  <span
                    className="hidden shrink-0 text-xs sm:inline"
                    style={{ color: T.textMuted }}
                  >
                    {table.name}
                  </span>
                )}
                {pulledNames.has(table.name) && (
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                    Pulled
                  </span>
                )}
              </label>
            );
          })}
        </div>
        </>
      )}

    </div>
  );
};

export default DataSourceModelsTab;
