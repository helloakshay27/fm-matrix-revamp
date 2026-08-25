import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Loader2,
  Table2,
  Search,
  Save,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers,
  Eye,
  ListTree,
  RotateCcw,
} from "lucide-react";
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
  done: "#108c72",
};

const inputStyle = {
  borderColor: T.primaryBord,
  color: T.textMain,
  background: T.cardBg,
};

const STEPS = [
  { key: "source", label: "Data Source", icon: Database },
  { key: "models", label: "Models", icon: Table2 },
  { key: "applicable", label: "Applicable Models", icon: Layers },
  { key: "preview", label: "Preview", icon: Eye },
] as const;

/** The subset of a data source this tab needs. */
export interface ConfigTabSource {
  id: number;
  datasource_name: string | null;
  /**
   * "internal" | "external". Set on the data source form and sent straight
   * through as the pull_schema payload's "type", so every model catalogued from
   * this source is tagged with what the source itself is. Older records predate
   * the field and come back null — those are external.
   */
  type?: string | null;
}

/** A table on the source database, as reported by schema_preview. */
interface SchemaTable {
  /** Real table name — what the backend stores as lock_model_name. */
  name: string;
  /** Human label the pull would assign (or the one it already has). */
  displayName: string;
  columnCount: number;
  /** Already pulled into the catalogue on a previous save. */
  catalogued: boolean;
  /** Set when catalogued — the row DELETE targets when this is unticked. */
  availableModelId: number | null;
}

/** A catalogued model, from the available_models dropdown. */
interface AvailableModel {
  id: number;
  displayName: string;
  lockModelName: string;
}

/** A model enabled for the tenant. `id` is the ApplicableModel row's own id. */
interface ApplicableRow {
  id: number;
  availableModelId: number;
  displayName: string;
  lockModelName: string;
}

interface AttributeRow {
  id: number;
  displayName: string;
  attributeName: string;
}

const authHeaders = () => ({
  Authorization: getAuthHeader(),
  Accept: "application/json",
});

const readJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

/** Prefers the server's own message over a bare status code. */
const errorText = (body: any, fallback: string) =>
  body?.message ||
  body?.error ||
  (Array.isArray(body?.errors) && body.errors.length
    ? body.errors.join(", ")
    : null) ||
  fallback;

const asArray = (body: any, ...keys: string[]): any[] => {
  if (Array.isArray(body)) return body;
  for (const key of keys) if (Array.isArray(body?.[key])) return body[key];
  return [];
};

/** Runs `task` over `items` a few at a time — a preview can span many models. */
const inBatches = async <T, R>(
  items: T[],
  size: number,
  task: (item: T) => Promise<R>
): Promise<R[]> => {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += size) {
    results.push(...(await Promise.all(items.slice(i, i + size).map(task))));
  }
  return results;
};

interface DataSourceConfigurationTabProps {
  sources: ConfigTabSource[];
  sourcesLoading?: boolean;
}

export const DataSourceConfigurationTab = ({
  sources,
  sourcesLoading,
}: DataSourceConfigurationTabProps) => {
  const [step, setStep] = useState(0);
  const [selectedId, setSelectedId] = useState<string>("");

  // Step 2 — tables on the source database.
  const [tables, setTables] = useState<SchemaTable[]>([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [tablesError, setTablesError] = useState<string | null>(null);
  const [pickedTables, setPickedTables] = useState<Set<string>>(new Set());
  const [tableSearch, setTableSearch] = useState("");
  const [savingModels, setSavingModels] = useState(false);

  // Step 3 — catalogued models, and which are enabled for the tenant.
  const [models, setModels] = useState<AvailableModel[]>([]);
  const [applicable, setApplicable] = useState<ApplicableRow[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [pickedModels, setPickedModels] = useState<Set<number>>(new Set());
  const [modelSearch, setModelSearch] = useState("");
  const [applying, setApplying] = useState(false);

  // Step 4 — each applicable model with its attributes.
  const [preview, setPreview] = useState<
    { model: ApplicableRow; attributes: AttributeRow[] }[]
  >([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [completed, setCompleted] = useState(false);

  // Which data source each section's data was loaded for. A step only fetches
  // when its marker does not match the selected source, so stepping Back shows
  // what is already there — including ticks not saved yet — instead of
  // refetching and discarding them. A mutation clears the markers it
  // invalidates, so the next visit to that step reloads.
  const [tablesFor, setTablesFor] = useState<string | null>(null);
  const [modelsFor, setModelsFor] = useState<string | null>(null);
  const [previewFor, setPreviewFor] = useState<string | null>(null);

  // Every response is checked against this before it is applied, so a slow
  // request for a source the user has since switched away from cannot land on
  // top of the new source's data.
  const activeSourceRef = useRef<string>("");

  const selectedSource = useMemo(
    () => sources.find((s) => String(s.id) === selectedId),
    [sources, selectedId]
  );

  /** What the pull is tagged with. Null on legacy records — those are external. */
  const sourceType = selectedSource?.type || "external";

  // ── Step 2 data ─────────────────────────────────────────────────────────
  // schema_preview reports already_catalogued/available_model_id per table, so
  // the previously-saved selection comes straight off this one call.
  const loadTables = useCallback(async (id: string) => {
    setTablesLoading(true);
    setTablesError(null);

    try {
      const response = await fetch(
        getFullUrl(`/datasources/${id}/schema_preview.json?columns=false`),
        { headers: authHeaders() }
      );
      const body = await readJson(response);

      if (!response.ok || body?.success === false) {
        throw new Error(
          errorText(body, `Failed to load tables (${response.status})`)
        );
      }

      const parsed: SchemaTable[] = asArray(body, "tables").map((row: any) => ({
        name: String(row?.table_name ?? "").trim(),
        displayName:
          String(row?.display_name ?? "").trim() ||
          String(row?.table_name ?? "").trim(),
        columnCount: Number(row?.column_count ?? 0),
        catalogued: Boolean(row?.already_catalogued),
        availableModelId: row?.available_model_id ?? null,
      }));

      if (activeSourceRef.current !== id) return;
      setTables(parsed.filter((t) => t.name));
      setPickedTables(
        new Set(parsed.filter((t) => t.catalogued).map((t) => t.name))
      );
    } catch (e: any) {
      if (activeSourceRef.current !== id) return;
      setTablesError(e?.message || "Failed to load tables");
    } finally {
      if (activeSourceRef.current === id) {
        setTablesLoading(false);
        // Marked even on failure, so the step does not retry in a loop — the
        // error panel's "Try again" is the way back in.
        setTablesFor(id);
      }
    }
  }, []);

  // ── Step 3 data ─────────────────────────────────────────────────────────
  // The catalogue for this source, plus the rows already enabled for the tenant
  // so they come up pre-ticked.
  //
  // tenant_models is filtered by datasource only. The company/organization on a
  // row is stamped server-side from the signed-in user at enable time, so
  // filtering here by a client-held company id would risk hiding rows this very
  // screen just created.
  const loadModels = useCallback(async (id: string) => {
    setModelsLoading(true);
    setModelsError(null);

    try {
      const [modelsResponse, applicableResponse] = await Promise.all([
        fetch(
          getFullUrl(
            `/rule_engine/available_models/dropdown.json?datasource_id=${id}`
          ),
          { headers: authHeaders() }
        ),
        fetch(
          getFullUrl(
            `/rule_engine/applicable_models/tenant_models.json?datasource_id=${id}`
          ),
          { headers: authHeaders() }
        ),
      ]);

      const modelsBody = await readJson(modelsResponse);
      if (!modelsResponse.ok) {
        throw new Error(
          errorText(
            modelsBody,
            `Failed to load models (${modelsResponse.status})`
          )
        );
      }

      const applicableBody = await readJson(applicableResponse);
      if (!applicableResponse.ok) {
        throw new Error(
          errorText(
            applicableBody,
            `Failed to load applicable models (${applicableResponse.status})`
          )
        );
      }

      const catalogued: AvailableModel[] = asArray(
        modelsBody,
        "models",
        "available_models",
        "data"
      )
        .map((row: any) => ({
          id: Number(row?.id),
          lockModelName: String(row?.lock_model_name ?? "").trim(),
          displayName:
            String(row?.display_name ?? "").trim() ||
            String(row?.lock_model_name ?? "").trim(),
        }))
        .filter((m) => Number.isFinite(m.id));

      const enabled: ApplicableRow[] = asArray(
        applicableBody,
        "models",
        "tenant_models",
        "data"
      )
        .map((row: any) => ({
          id: Number(row?.id),
          availableModelId: Number(row?.available_model_id),
          lockModelName: String(row?.lock_model_name ?? "").trim(),
          displayName:
            String(row?.display_name ?? "").trim() ||
            String(row?.lock_model_name ?? "").trim(),
        }))
        .filter((m) => Number.isFinite(m.id));

      if (activeSourceRef.current !== id) return;
      setModels(catalogued);
      setApplicable(enabled);
      setPickedModels(new Set(enabled.map((m) => m.availableModelId)));
    } catch (e: any) {
      if (activeSourceRef.current !== id) return;
      setModelsError(e?.message || "Failed to load models");
      setModels([]);
      setApplicable([]);
      setPickedModels(new Set());
    } finally {
      if (activeSourceRef.current === id) {
        setModelsLoading(false);
        setModelsFor(id);
      }
    }
  }, []);

  // ── Step 4 data ─────────────────────────────────────────────────────────
  const loadPreview = useCallback(async (rows: ApplicableRow[], id: string) => {
    setPreviewLoading(true);
    setPreviewError(null);

    try {
      const built = await inBatches(rows, 6, async (model) => {
        const response = await fetch(
          getFullUrl(
            `/rule_engine/available_attributes/dropdown.json?available_model_id=${model.availableModelId}`
          ),
          { headers: authHeaders() }
        );
        const body = await readJson(response);
        if (!response.ok) {
          throw new Error(
            errorText(body, `Failed to load attributes (${response.status})`)
          );
        }

        const attributes: AttributeRow[] = asArray(body, "attributes", "data")
          .map((row: any) => ({
            id: Number(row?.id),
            attributeName: String(row?.attribute_name ?? "").trim(),
            displayName:
              String(row?.display_name ?? "").trim() ||
              String(row?.attribute_name ?? "").trim(),
          }))
          .filter((a) => a.attributeName || a.displayName);

        return { model, attributes };
      });

      if (activeSourceRef.current !== id) return;
      setPreview(built);
    } catch (e: any) {
      if (activeSourceRef.current !== id) return;
      setPreviewError(e?.message || "Failed to load preview");
      setPreview([]);
    } finally {
      if (activeSourceRef.current === id) {
        setPreviewLoading(false);
        setPreviewFor(id);
      }
    }
  }, []);

  // Picking a different source invalidates every downstream step. The ref is
  // updated here rather than in its own effect so it is already current by the
  // time the loading effect below runs.
  useEffect(() => {
    activeSourceRef.current = selectedId;
    setTables([]);
    setPickedTables(new Set());
    setTablesError(null);
    setTablesFor(null);
    setModels([]);
    setApplicable([]);
    setPickedModels(new Set());
    setModelsError(null);
    setModelsFor(null);
    setPreview([]);
    setPreviewError(null);
    setPreviewFor(null);
    setTableSearch("");
    setModelSearch("");
    setCompleted(false);
  }, [selectedId]);

  // A step fetches only when it holds nothing for the selected source. Stepping
  // Back therefore keeps what is on screen — unsaved ticks included — and a
  // mutation clearing the relevant marker is what makes the next visit reload.
  useEffect(() => {
    if (!selectedId) return;
    if (step === 1 && tablesFor !== selectedId) loadTables(selectedId);
    if (step === 2 && modelsFor !== selectedId) loadModels(selectedId);
    if (step === 3 && previewFor !== selectedId)
      loadPreview(applicable, selectedId);
  }, [
    step,
    selectedId,
    tablesFor,
    modelsFor,
    previewFor,
    applicable,
    loadTables,
    loadModels,
    loadPreview,
  ]);

  // ── Step 2 save: catalogue what was ticked, delete what was unticked ─────
  const saveModels = async () => {
    if (!selectedId) return;

    // Only genuinely new tables are pulled — a table already in the catalogue is
    // left alone rather than sent through pull_schema a second time.
    const toAdd = tables
      .filter((t) => pickedTables.has(t.name) && !t.catalogued)
      .map((t) => t.name);

    // Unticked but previously catalogued. Deleting the available model takes its
    // attributes and its applicable-model rows with it (both are `dependent:` on
    // RuleEngine::AvailableModel), so no extra cleanup call is needed here.
    const toDelete = tables.filter(
      (t) => t.catalogued && !pickedTables.has(t.name) && t.availableModelId
    );

    if (toAdd.length === 0 && toDelete.length === 0) {
      toast.info("No changes to save");
      return;
    }

    setSavingModels(true);
    try {
      let added = 0;
      if (toAdd.length > 0) {
        const response = await fetch(
          getFullUrl(`/datasources/${selectedId}/pull_schema.json`),
          {
            method: "POST",
            headers: {
              Authorization: getAuthHeader(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ type: sourceType, tables: toAdd }),
          }
        );
        const body = await readJson(response);
        if (!response.ok || body?.success === false) {
          throw new Error(
            errorText(body, `Failed to add models (${response.status})`)
          );
        }
        added = Number(body?.models_created ?? toAdd.length);
      }

      // Sequential: each delete cascades attributes and applicable models, and a
      // burst of those against a remote database is worth avoiding.
      const failed: string[] = [];
      for (const table of toDelete) {
        const response = await fetch(
          getFullUrl(
            `/rule_engine/available_models/${table.availableModelId}.json`
          ),
          { method: "DELETE", headers: authHeaders() }
        );
        if (!response.ok) failed.push(table.displayName);
      }

      const parts: string[] = [];
      if (added > 0) parts.push(`${added} model(s) added`);
      if (toDelete.length - failed.length > 0) {
        parts.push(`${toDelete.length - failed.length} removed`);
      }
      if (parts.length > 0) toast.success(parts.join(", "));
      if (failed.length > 0) {
        toast.error(`Could not remove: ${failed.join(", ")}`);
      }

      // The catalogue changed, so both later steps are stale.
      setModelsFor(null);
      setPreviewFor(null);
      setCompleted(false);
      await loadTables(selectedId);
    } catch (e: any) {
      toast.error(e?.message || "Failed to save models");
    } finally {
      setSavingModels(false);
    }
  };

  // ── Step 3 apply: enable what was ticked, delete what was unticked ───────
  const applyModels = async () => {
    if (!selectedId) return;

    const enabledIds = new Set(applicable.map((m) => m.availableModelId));

    // Already-applicable models are skipped rather than re-enabled.
    const toEnable = [...pickedModels].filter((id) => !enabledIds.has(id));
    const toDisable = applicable.filter(
      (m) => !pickedModels.has(m.availableModelId)
    );

    if (toEnable.length === 0 && toDisable.length === 0) {
      toast.info("No changes to apply");
      return;
    }

    setApplying(true);
    try {
      let enabled = 0;
      if (toEnable.length > 0) {
        const response = await fetch(
          getFullUrl("/rule_engine/applicable_models/enable_models.json"),
          {
            method: "POST",
            headers: {
              Authorization: getAuthHeader(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ available_model_ids: toEnable }),
          }
        );
        const body = await readJson(response);
        if (!response.ok || body?.success === false) {
          throw new Error(
            errorText(body, `Failed to apply models (${response.status})`)
          );
        }
        enabled = Number(body?.enabled_count ?? toEnable.length);
      }

      const failed: string[] = [];
      for (const model of toDisable) {
        const response = await fetch(
          getFullUrl(`/rule_engine/applicable_models/${model.id}.json`),
          { method: "DELETE", headers: authHeaders() }
        );
        if (!response.ok) failed.push(model.displayName);
      }

      const parts: string[] = [];
      if (enabled > 0) parts.push(`${enabled} model(s) made applicable`);
      if (toDisable.length - failed.length > 0) {
        parts.push(`${toDisable.length - failed.length} removed`);
      }
      if (parts.length > 0) toast.success(parts.join(", "));
      if (failed.length > 0) {
        toast.error(`Could not remove: ${failed.join(", ")}`);
      }

      // The applicable set changed, so the preview is stale.
      setPreviewFor(null);
      setCompleted(false);
      await loadModels(selectedId);
    } catch (e: any) {
      toast.error(e?.message || "Failed to apply models");
    } finally {
      setApplying(false);
    }
  };

  // ── Finish ──────────────────────────────────────────────────────────────
  // Everything is already persisted by this point — Save catalogued the models
  // and Applicable enabled them. Done closes the wizard out; it has nothing
  // left to write.
  const finish = () => {
    const attributeCount = preview.reduce(
      (total, row) => total + row.attributes.length,
      0
    );
    setCompleted(true);
    toast.success(
      `Configuration complete — ${preview.length} model(s), ${attributeCount} attribute(s) ready for rules`
    );
  };

  const startAnother = () => {
    setCompleted(false);
    setSelectedId("");
    setStep(0);
  };

  // ── Derived ─────────────────────────────────────────────────────────────
  const visibleTables = useMemo(() => {
    const q = tableSearch.trim().toLowerCase();
    if (!q) return tables;
    return tables.filter(
      (t) =>
        t.displayName.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)
    );
  }, [tables, tableSearch]);

  const visibleModels = useMemo(() => {
    const q = modelSearch.trim().toLowerCase();
    if (!q) return models;
    return models.filter(
      (m) =>
        m.displayName.toLowerCase().includes(q) ||
        m.lockModelName.toLowerCase().includes(q)
    );
  }, [models, modelSearch]);

  const modelChanges = useMemo(() => {
    const add = tables.filter(
      (t) => pickedTables.has(t.name) && !t.catalogued
    ).length;
    const remove = tables.filter(
      (t) => t.catalogued && !pickedTables.has(t.name) && t.availableModelId
    ).length;
    return { add, remove, total: add + remove };
  }, [tables, pickedTables]);

  const applicableChanges = useMemo(() => {
    const enabledIds = new Set(applicable.map((m) => m.availableModelId));
    const add = [...pickedModels].filter((id) => !enabledIds.has(id)).length;
    const remove = applicable.filter(
      (m) => !pickedModels.has(m.availableModelId)
    ).length;
    return { add, remove, total: add + remove };
  }, [applicable, pickedModels]);

  const toggleTable = (name: string) =>
    setPickedTables((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const toggleModel = (id: number) =>
    setPickedModels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allTablesPicked =
    visibleTables.length > 0 &&
    visibleTables.every((t) => pickedTables.has(t.name));

  const allModelsPicked =
    visibleModels.length > 0 &&
    visibleModels.every((m) => pickedModels.has(m.id));

  // Acts on the rows in view, so it stays predictable under a search filter.
  const toggleAllTables = () =>
    setPickedTables((prev) => {
      const next = new Set(prev);
      visibleTables.forEach((t) =>
        allTablesPicked ? next.delete(t.name) : next.add(t.name)
      );
      return next;
    });

  const toggleAllModels = () =>
    setPickedModels((prev) => {
      const next = new Set(prev);
      visibleModels.forEach((m) =>
        allModelsPicked ? next.delete(m.id) : next.add(m.id)
      );
      return next;
    });

  const canGoNext = step === 0 ? Boolean(selectedId) : step < STEPS.length - 1;
  const busy = savingModels || applying;

  return (
    <div className="space-y-5">
      {/* ── Stepper ── */}
      <div className="flex items-center overflow-x-auto pb-1">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          const reachable = i <= step || Boolean(selectedId);
          const Icon = s.icon;
          return (
            <div
              key={s.key}
              className="flex items-center"
              style={{ flex: i < STEPS.length - 1 ? 1 : "none" }}
            >
              <button
                type="button"
                onClick={() => reachable && !busy && setStep(i)}
                disabled={!reachable || busy}
                className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-1 py-1 disabled:cursor-default"
                style={{ cursor: reachable && !busy ? "pointer" : "default" }}
              >
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold"
                  style={{
                    background: done
                      ? T.done
                      : active
                        ? T.primary
                        : T.primaryBg,
                    color: done || active ? "#ffffff" : T.textMuted,
                    border:
                      done || active ? "none" : `1.5px solid ${T.primaryBord}`,
                  }}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span
                  className="hidden text-[12.5px] sm:inline"
                  style={{
                    fontWeight: active ? 700 : 600,
                    color: active ? T.textMain : done ? T.done : T.textMuted,
                  }}
                >
                  {s.label}
                </span>
                <Icon
                  className="h-4 w-4 sm:hidden"
                  style={{ color: active ? T.textMain : T.textMuted }}
                />
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className="mx-3 h-0.5 flex-1 rounded"
                  style={{ background: done ? T.done : T.primaryBord }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step 1: Data Source ── */}
      {step === 0 && (
        <div className="space-y-4">
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

          {selectedSource ? (
            <div
              className="flex flex-wrap items-center gap-2 rounded-xl border px-4 py-3"
              style={{ borderColor: T.primaryBord, background: T.primaryBg }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: T.textMain }}
              >
                {selectedSource.datasource_name ||
                  `Data source #${selectedSource.id}`}
              </span>
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize"
                style={{ background: T.cardBg, color: T.primary }}
              >
                {sourceType}
              </span>
              <span className="text-xs" style={{ color: T.textMuted }}>
                Models pulled from this source are catalogued as{" "}
                <strong>{sourceType}</strong>.
              </span>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-12 text-center"
              style={{ borderColor: T.primaryBord }}
            >
              <Database className="h-8 w-8" style={{ color: T.primaryBord }} />
              <p className="text-sm font-medium" style={{ color: T.textMain }}>
                Select a data source
              </p>
              <p className="text-xs" style={{ color: T.textMuted }}>
                Everything after this step is scoped to the source you pick.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Step 2: Models ── */}
      {step === 1 && (
        <StepPanel
          title="Models"
          subtitle="Tick the tables to catalogue as models. Unticking one that was saved before deletes it, along with its attributes and applicable models."
          search={tableSearch}
          onSearchChange={setTableSearch}
          searchPlaceholder="Search tables..."
          showToolbar={tables.length > 0}
          onToggleAll={toggleAllTables}
          allSelected={allTablesPicked}
          countLabel={`${pickedTables.size} selected`}
          actionLabel="Save"
          actionIcon={<Save className="h-3.5 w-3.5" />}
          actionBusyLabel="Saving..."
          onAction={saveModels}
          busy={savingModels}
          actionDisabled={modelChanges.total === 0}
          changeHint={
            modelChanges.total > 0
              ? `${modelChanges.add} to add, ${modelChanges.remove} to remove`
              : "No pending changes"
          }
          loading={tablesLoading}
          loadingLabel="Loading tables..."
          error={tablesError}
          onRetry={() => loadTables(selectedId)}
          empty={visibleTables.length === 0}
          emptyLabel={
            tables.length === 0 ? "No tables found" : "No matching tables"
          }
        >
          {visibleTables.map((table) => (
            <Row
              key={table.name}
              checked={pickedTables.has(table.name)}
              onToggle={() => toggleTable(table.name)}
              disabled={savingModels}
              displayName={table.displayName}
              originalName={table.name}
              meta={`${table.columnCount} column${table.columnCount === 1 ? "" : "s"}`}
              badge={table.catalogued ? "Added" : undefined}
            />
          ))}
        </StepPanel>
      )}

      {/* ── Step 3: Applicable Models ── */}
      {step === 2 && (
        <StepPanel
          title="Applicable Models"
          subtitle="Models catalogued from this data source. Tick the ones rules may be built on; unticking one removes it for this tenant."
          search={modelSearch}
          onSearchChange={setModelSearch}
          searchPlaceholder="Search models..."
          showToolbar={models.length > 0}
          onToggleAll={toggleAllModels}
          allSelected={allModelsPicked}
          countLabel={`${pickedModels.size} selected`}
          actionLabel="Applicable"
          actionIcon={<Check className="h-3.5 w-3.5" />}
          actionBusyLabel="Applying..."
          onAction={applyModels}
          busy={applying}
          actionDisabled={applicableChanges.total === 0}
          changeHint={
            applicableChanges.total > 0
              ? `${applicableChanges.add} to add, ${applicableChanges.remove} to remove`
              : "No pending changes"
          }
          loading={modelsLoading}
          loadingLabel="Loading models..."
          error={modelsError}
          onRetry={() => loadModels(selectedId)}
          empty={visibleModels.length === 0}
          emptyLabel={
            models.length === 0
              ? "No models catalogued yet — add some in the previous step"
              : "No matching models"
          }
        >
          {visibleModels.map((model) => {
            const isApplicable = applicable.some(
              (a) => a.availableModelId === model.id
            );
            return (
              <Row
                key={model.id}
                checked={pickedModels.has(model.id)}
                onToggle={() => toggleModel(model.id)}
                disabled={applying}
                displayName={model.displayName}
                originalName={model.lockModelName}
                badge={isApplicable ? "Applicable" : undefined}
              />
            );
          })}
        </StepPanel>
      )}

      {/* ── Step 4: Preview ── */}
      {step === 3 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3
                className="text-sm font-semibold"
                style={{ color: T.textMain }}
              >
                Preview
              </h3>
              <p className="mt-0.5 text-xs" style={{ color: T.textMuted }}>
                Every applicable model and the attributes rules can read from it
                {selectedSource?.datasource_name
                  ? `, for ${selectedSource.datasource_name}.`
                  : "."}
              </p>
            </div>
            <button
              onClick={() => loadPreview(applicable, selectedId)}
              disabled={previewLoading}
              className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-60"
              style={{ borderColor: T.primary, color: T.primary }}
            >
              <RotateCcw
                className={`h-3.5 w-3.5 ${previewLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {completed && (
            <div
              className="flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3"
              style={{ borderColor: "#bde5d8", background: "#eefaf5" }}
            >
              <CheckCircle2
                className="h-5 w-5 shrink-0"
                style={{ color: T.done }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold" style={{ color: T.done }}>
                  Configuration complete
                </p>
                <p className="text-xs" style={{ color: T.textMuted }}>
                  {selectedSource?.datasource_name || "This data source"} is
                  ready — its applicable models can now be used to build rules.
                </p>
              </div>
              <button
                onClick={startAnother}
                className="shrink-0 rounded-xl border px-3 py-2 text-xs font-medium transition-colors"
                style={{ borderColor: T.primaryBord, color: T.textMuted }}
              >
                Configure another data source
              </button>
            </div>
          )}

          {previewLoading ? (
            <Centered>
              <Loader2
                className="h-6 w-6 animate-spin"
                style={{ color: T.primary }}
              />
              <p className="text-xs" style={{ color: T.textMuted }}>
                Loading preview...
              </p>
            </Centered>
          ) : previewError ? (
            <Dashed>
              <p className="text-sm font-medium text-red-600">{previewError}</p>
              <button
                onClick={() => loadPreview(applicable, selectedId)}
                className="mt-1 rounded-xl px-4 py-2 text-sm font-medium text-white"
                style={{ background: T.primary }}
              >
                Try again
              </button>
            </Dashed>
          ) : preview.length === 0 ? (
            <Dashed>
              <ListTree className="h-8 w-8" style={{ color: T.primaryBord }} />
              <p className="text-sm font-medium" style={{ color: T.textMain }}>
                No applicable models yet
              </p>
              <p className="text-xs" style={{ color: T.textMuted }}>
                Go back a step and mark some models as applicable.
              </p>
            </Dashed>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {preview.map(({ model, attributes }) => (
                <div
                  key={model.id}
                  className="overflow-hidden rounded-xl border"
                  style={{ borderColor: T.primaryBord }}
                >
                  <div
                    className="flex items-baseline justify-between gap-2 px-4 py-3"
                    style={{ background: T.primaryBg }}
                  >
                    <div className="min-w-0">
                      <p
                        className="truncate text-sm font-semibold"
                        style={{ color: T.textMain }}
                      >
                        {model.displayName}
                      </p>
                      {model.lockModelName !== model.displayName && (
                        <p
                          className="truncate text-[11px]"
                          style={{ color: T.textMuted }}
                        >
                          {model.lockModelName}
                        </p>
                      )}
                    </div>
                    <span
                      className="shrink-0 text-[11px] font-medium"
                      style={{ color: T.textMuted }}
                    >
                      {attributes.length} attr
                    </span>
                  </div>

                  {attributes.length === 0 ? (
                    <p
                      className="px-4 py-3 text-xs"
                      style={{ color: T.textMuted }}
                    >
                      No attributes catalogued.
                    </p>
                  ) : (
                    <ul
                      className="max-h-64 divide-y overflow-y-auto"
                      style={{ borderColor: T.borderLgt }}
                    >
                      {attributes.map((attribute) => (
                        <li
                          key={attribute.id}
                          className="flex items-baseline justify-between gap-3 px-4 py-2"
                        >
                          <span
                            className="min-w-0 truncate text-[13px]"
                            style={{ color: T.textMain }}
                          >
                            {attribute.displayName}
                          </span>
                          {attribute.attributeName !==
                            attribute.displayName && (
                            <span
                              className="shrink-0 text-[11px]"
                              style={{ color: T.textMuted }}
                            >
                              {attribute.attributeName}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Step navigation ── */}
      <div
        className="flex items-center justify-between gap-2 border-t pt-4"
        style={{ borderColor: T.primaryBord }}
      >
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || busy}
          className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          style={{ borderColor: T.primaryBord, color: T.textMuted }}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        {step === STEPS.length - 1 ? (
          <button
            type="button"
            onClick={finish}
            disabled={
              busy || previewLoading || preview.length === 0 || completed
            }
            title={
              preview.length === 0
                ? "Mark at least one model applicable first"
                : undefined
            }
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ background: completed ? T.done : T.primary }}
            onMouseEnter={(e) => {
              if (!busy && !completed && preview.length > 0) {
                e.currentTarget.style.background = T.primaryHov;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = completed ? T.done : T.primary;
            }}
          >
            <Check className="h-4 w-4" />
            {completed ? "Completed" : "Done"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canGoNext || busy}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ background: T.primary }}
            onMouseEnter={(e) => {
              if (canGoNext && !busy)
                e.currentTarget.style.background = T.primaryHov;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = T.primary;
            }}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ── Shared bits ───────────────────────────────────────────────────────────

const Centered = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-12">
    {children}
  </div>
);

const Dashed = ({ children }: { children: React.ReactNode }) => (
  <div
    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-12 text-center"
    style={{ borderColor: T.primaryBord }}
  >
    {children}
  </div>
);

/**
 * One selectable row. `displayName` is the label a rule author reads;
 * `originalName` is the value actually sent to and stored by the API, kept
 * visible so the two are never confused.
 */
const Row = ({
  checked,
  onToggle,
  disabled,
  displayName,
  originalName,
  meta,
  badge,
}: {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  displayName: string;
  originalName: string;
  meta?: string;
  badge?: string;
}) => (
  <label
    className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-[#f6f4ee]"
    style={{ borderColor: T.borderLgt }}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={onToggle}
      disabled={disabled}
      className="h-4 w-4 shrink-0 cursor-pointer accent-[#DA7756]"
    />
    <span className="min-w-0 flex-1">
      <span
        className="block truncate text-sm font-medium"
        style={{ color: T.textMain }}
      >
        {displayName}
      </span>
      {originalName !== displayName && (
        <span
          className="block truncate text-[11px]"
          style={{ color: T.textMuted }}
        >
          {originalName}
        </span>
      )}
    </span>
    {meta && (
      <span
        className="hidden shrink-0 text-xs sm:inline"
        style={{ color: T.textMuted }}
      >
        {meta}
      </span>
    )}
    {badge && (
      <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
        {badge}
      </span>
    )}
  </label>
);

/** Toolbar + list scaffold shared by the Models and Applicable Models steps. */
const StepPanel = ({
  title,
  subtitle,
  search,
  onSearchChange,
  searchPlaceholder,
  showToolbar,
  onToggleAll,
  allSelected,
  countLabel,
  actionLabel,
  actionIcon,
  actionBusyLabel,
  onAction,
  busy,
  actionDisabled,
  changeHint,
  loading,
  loadingLabel,
  error,
  onRetry,
  empty,
  emptyLabel,
  children,
}: {
  title: string;
  subtitle: string;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  showToolbar: boolean;
  onToggleAll: () => void;
  allSelected: boolean;
  countLabel: string;
  actionLabel: string;
  actionIcon: React.ReactNode;
  actionBusyLabel: string;
  onAction: () => void;
  busy: boolean;
  actionDisabled: boolean;
  changeHint: string;
  loading: boolean;
  loadingLabel: string;
  error: string | null;
  onRetry: () => void;
  empty: boolean;
  emptyLabel: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold" style={{ color: T.textMain }}>
          {title}
        </h3>
        <p className="mt-0.5 text-xs" style={{ color: T.textMuted }}>
          {subtitle}
        </p>
      </div>

      {showToolbar && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-52">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: T.textMuted }}
            />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border py-2 pl-10 pr-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
          <button
            onClick={onRetry}
            disabled={busy || loading}
            title="Reload from the data source — discards unsaved ticks"
            aria-label="Refresh"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors disabled:opacity-60"
            style={{ borderColor: T.primary, color: T.primary }}
          >
            <RotateCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={onToggleAll}
            disabled={busy}
            className="whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-60"
            style={{ borderColor: T.primary, color: T.primary }}
          >
            {allSelected ? "Clear all" : "Select all"}
          </button>
          <span
            className="whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-medium"
            style={{
              borderColor: T.primaryBord,
              background: T.primaryBg,
              color: T.textMuted,
            }}
          >
            {countLabel}
          </span>
          <button
            onClick={onAction}
            disabled={busy || actionDisabled}
            title={changeHint}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-medium text-white transition-colors disabled:opacity-60"
            style={{ background: T.primary }}
            onMouseEnter={(e) => {
              if (!busy && !actionDisabled) {
                e.currentTarget.style.background = T.primaryHov;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = T.primary;
            }}
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              actionIcon
            )}
            {busy ? actionBusyLabel : actionLabel}
          </button>
        </div>
      )}
    </div>

    {showToolbar && !loading && !error && (
      <p className="text-xs" style={{ color: T.textMuted }}>
        {changeHint}
      </p>
    )}

    {loading ? (
      <Centered>
        <Loader2
          className="h-6 w-6 animate-spin"
          style={{ color: T.primary }}
        />
        <p className="text-xs" style={{ color: T.textMuted }}>
          {loadingLabel}
        </p>
      </Centered>
    ) : error ? (
      <Dashed>
        <p className="text-sm font-medium text-red-600">{error}</p>
        <button
          onClick={onRetry}
          className="mt-1 rounded-xl px-4 py-2 text-sm font-medium text-white"
          style={{ background: T.primary }}
        >
          Try again
        </button>
      </Dashed>
    ) : empty ? (
      <Dashed>
        <Table2 className="h-8 w-8" style={{ color: T.primaryBord }} />
        <p className="text-sm font-medium" style={{ color: T.textMain }}>
          {emptyLabel}
        </p>
      </Dashed>
    ) : (
      <div
        className="max-h-[26rem] divide-y overflow-y-auto rounded-xl border"
        style={{ borderColor: T.primaryBord }}
      >
        {children}
      </div>
    )}
  </div>
);

export default DataSourceConfigurationTab;
