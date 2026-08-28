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
  Boxes,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { getFullUrl, getAuthHeader } from "@/config/apiConfig";
import {
  fetchBuckets,
  createBucket,
  deleteBucket,
  assignBucketModels,
  enableBuckets,
  fetchTenantBuckets,
  fetchBucket,
  type TenantBucket,
} from "@/services/ruleEngineAPI";
import { T, inputStyle } from "@/components/AdminCompass/ruleEngineTheme";
import { SelectShell, selectClass } from "@/components/AdminCompass/ruleEngineUi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Buckets sits between the source and its models because that is the order the
// product-segregation flow runs in: pick a source, define the product modules,
// then file the pulled models under them.
//
// The step is OPTIONAL. Skipping it leaves every model unbucketed and the rest
// of the wizard behaves exactly as it did before buckets existed.
/**
 * Two segregation modes, each with its own step sequence.
 *
 *   whole  — the data source IS the boundary. Catalogue its tables, enable the
 *            models, done. This is the original flow, unchanged.
 *   module — one data source carries several products, so its models are split
 *            into buckets and a whole BUCKET is what gets made applicable.
 *
 * A data source is "module-wise" precisely when it has buckets, which is also
 * how the rule builder decides whether to show a bucket picker — no extra
 * column, and the two screens can never disagree.
 */
const ALL_STEPS = {
  source: { key: "source", label: "Data Source", icon: Database },
  buckets: { key: "buckets", label: "Buckets", icon: Boxes },
  models: { key: "models", label: "Models", icon: Table2 },
  applicable: { key: "applicable", label: "Applicable Models", icon: Layers },
  applicableBuckets: {
    key: "applicable",
    label: "Applicable Buckets",
    icon: Layers,
  },
  preview: { key: "preview", label: "Preview", icon: Eye },
} as const;

type SegregationMode = "whole" | "module";
type StepKey = "source" | "buckets" | "models" | "applicable" | "preview";

const STEPS_BY_MODE: Record<
  SegregationMode,
  readonly { key: StepKey; label: string; icon: typeof Database }[]
> = {
  whole: [
    ALL_STEPS.source,
    ALL_STEPS.models,
    ALL_STEPS.applicable,
    ALL_STEPS.preview,
  ],
  module: [
    ALL_STEPS.source,
    ALL_STEPS.buckets,
    ALL_STEPS.models,
    ALL_STEPS.applicableBuckets,
    ALL_STEPS.preview,
  ],
};

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

/** A bucket on the selected data source, as this tab needs it. */
interface BucketRow {
  id: number;
  name: string;
  active: boolean;
  modelsCount: number;
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
  /** Bucket that already owns this table, if any. A model belongs to exactly one. */
  bucketId: number | null;
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
  // Which segregation the user picked for this data source. Drives the whole
  // step sequence, so it is chosen right after the source and before anything
  // downstream loads.
  const [mode, setMode] = useState<SegregationMode>("whole");
  // True once the mode has been derived from a source that already has buckets:
  // a source with buckets is module-wise by definition, so the toggle shows that
  // and switching back to whole-source is only offered when it holds none.
  const [modeLocked, setModeLocked] = useState(false);
  const STEPS = STEPS_BY_MODE[mode];
  // Steps are matched by key, not by index — the two modes have different
  // sequences, so an index means nothing on its own.
  const stepKey: StepKey = STEPS[step]?.key ?? "source";
  const [selectedId, setSelectedId] = useState<string>("");

  // Buckets — optional product-module groupings over this source's models.
  const [buckets, setBuckets] = useState<BucketRow[]>([]);
  const [bucketsLoading, setBucketsLoading] = useState(false);
  const [bucketsError, setBucketsError] = useState<string | null>(null);
  const [bucketsFor, setBucketsFor] = useState<string | null>(null);
  const [newBucketName, setNewBucketName] = useState("");
  const [bucketBusy, setBucketBusy] = useState(false);
  // Delete confirm dialog — trash icon seedhe delete nahi karta.
  const [pendingDelete, setPendingDelete] = useState<BucketRow | null>(null);
  const [appliedBucketIds, setAppliedBucketIds] = useState<Set<number>>(
    new Set()
  );
  const [appliedFor, setAppliedFor] = useState<string | null>(null);
  // Module-wise preview: each applicable bucket with its models and their
  // attributes, which is exactly what /datasources/tenant_buckets.json plus one
  // bucket fetch per bucket returns.
  const [bucketPreview, setBucketPreview] = useState<
    {
      bucketId: number;
      name: string;
      models: {
        displayName: string;
        lockModelName: string;
        attributes: AttributeRow[];
      }[];
    }[]
  >([]);

  // Step 2 — tables on the source database.
  const [tables, setTables] = useState<SchemaTable[]>([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [tablesError, setTablesError] = useState<string | null>(null);
  const [pickedTables, setPickedTables] = useState<Set<string>>(new Set());
  // Module-wise: one pick set PER BUCKET, so switching the bucket you are
  // assigning to keeps every other bucket's selection intact and one Save
  // creates the lot. Keyed by bucket id.
  const [picksByBucket, setPicksByBucket] = useState<
    Record<number, Set<string>>
  >({});
  // Which bucket the Models step is currently assigning to.
  const [assignBucketId, setAssignBucketId] = useState<number | null>(null);
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

  // The available_model ids catalogued for a source. Read back from the server
  // rather than from `tables`, because pull_schema is what mints the ids and the
  // local rows do not have them until the next reload.
  const fetchCataloguedModelIds = async (id: string): Promise<number[]> => {
    const response = await fetch(
      getFullUrl(`/rule_engine/available_models.json?datasource_id=${id}`),
      { headers: authHeaders() }
    );
    const body = await readJson(response);
    if (!response.ok) {
      throw new Error(errorText(body, "Failed to read catalogued models"));
    }
    const rows = Array.isArray(body)
      ? body
      : (body?.available_models ?? body?.data ?? []);
    return (Array.isArray(rows) ? rows : [])
      .map((r: any) => Number(r?.id))
      .filter((n: number) => Number.isFinite(n));
  };

  // ── Buckets data ────────────────────────────────────────────────────────
  const loadBuckets = useCallback(async (id: string) => {
    setBucketsLoading(true);
    setBucketsError(null);
    try {
      const rows = await fetchBuckets(id);
      // A response for a source the user has since switched away from must not
      // land on top of the new source's data.
      if (activeSourceRef.current !== id) return;
      setBuckets(
        rows.map((b) => ({
          id: b.id,
          name: b.name,
          active: b.active,
          modelsCount: b.modelsCount,
        }))
      );
    } catch (e: any) {
      if (activeSourceRef.current !== id) return;
      setBucketsError(e?.message || "Failed to load buckets");
    } finally {
      if (activeSourceRef.current === id) {
        setBucketsLoading(false);
        setBucketsFor(id);
      }
    }
  }, []);

  const addBucket = async () => {
    const name = newBucketName.trim();
    if (!selectedId || !name) return;

    setBucketBusy(true);
    try {
      const created = await createBucket({
        datasourceId: Number(selectedId),
        name,
      });
      setNewBucketName("");
      // The Models step defaults to this one, so a freshly created bucket is
      // what you land on when you move forward.
      setAssignBucketId(created.id);
      toast.success(`Bucket "${created.name}" created`);
      await loadBuckets(selectedId);
    } catch (e: any) {
      toast.error(e?.message || "Failed to create bucket");
    } finally {
      setBucketBusy(false);
    }
  };

  // Buckets already published to this tenant — an applicable row per bucket.
  const loadAppliedBuckets = useCallback(async (id: string) => {
    try {
      const rows = await fetchTenantBuckets(id);
      if (activeSourceRef.current !== id) return;
      setAppliedBucketIds(new Set(rows.map((r) => r.bucketId)));
    } catch {
      if (activeSourceRef.current === id) setAppliedBucketIds(new Set());
    } finally {
      if (activeSourceRef.current === id) setAppliedFor(id);
    }
  }, []);

  // Publishes one bucket: a single applicable row covering every model filed
  // under it, so models added to the bucket later are included automatically.
  const applyBucket = async (bucket: BucketRow) => {
    setApplying(true);
    try {
      const { errors } = await enableBuckets([bucket.id]);
      if (errors.length > 0) {
        toast.error(errors.join(", "));
      } else {
        toast.success(`"${bucket.name}" is now applicable`);
      }
      setPreviewFor(null);
      setCompleted(false);
      await loadAppliedBuckets(selectedId);
    } catch (e: any) {
      toast.error(e?.message || "Failed to make bucket applicable");
    } finally {
      setApplying(false);
    }
  };

  const removeBucket = async () => {
    const bucket = pendingDelete;
    if (!bucket) return;
    setBucketBusy(true);
    try {
      await deleteBucket(bucket.id);
      if (assignBucketId === bucket.id) setAssignBucketId(null);
      toast.success(
        `Bucket "${bucket.name}" deleted — its models stay catalogued`
      );
      setPendingDelete(null);
      // Models were unfiled, so both later steps are stale.
      setModelsFor(null);
      setPreviewFor(null);
      await loadBuckets(selectedId);
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete bucket");
    } finally {
      setBucketBusy(false);
    }
  };

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
        bucketId: row?.bucket_id ?? null,
      }));

      if (activeSourceRef.current !== id) return;
      setTables(parsed.filter((t) => t.name));
      setPickedTables(
        new Set(parsed.filter((t) => t.catalogued).map((t) => t.name))
      );
      // Each bucket starts with the tables already filed under it, so revisiting
      // the step shows the saved assignment rather than an empty selection.
      const seeded: Record<number, Set<string>> = {};
      parsed.forEach((table) => {
        if (table.catalogued && table.bucketId) {
          (seeded[table.bucketId] ||= new Set<string>()).add(table.name);
        }
      });
      setPicksByBucket(seeded);
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

  // ── Preview data, module-wise ───────────────────────────────────────────
  // One fetch for the published buckets, then one per bucket with
  // attributes=true so every model's columns come back nested — no attribute
  // call per model.
  const loadBucketPreview = useCallback(async (id: string) => {
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const published = await fetchTenantBuckets(id);
      const built = await inBatches(
        published,
        4,
        async (tenantBucket: TenantBucket) => {
          const full = await fetchBucket(tenantBucket.bucketId, true);
          return {
            bucketId: tenantBucket.bucketId,
            name: tenantBucket.name,
            models: full.models.map((m) => ({
              displayName: m.displayName,
              lockModelName: m.lockModelName,
              attributes: (m.attributes ?? []).map((a) => ({
                id: a.id,
                attributeName: a.attributeName,
                displayName: a.displayName,
              })),
            })),
          };
        }
      );
      if (activeSourceRef.current !== id) return;
      setBucketPreview(built);
    } catch (e: any) {
      if (activeSourceRef.current !== id) return;
      setPreviewError(e?.message || "Failed to load preview");
      setBucketPreview([]);
    } finally {
      if (activeSourceRef.current === id) {
        setPreviewLoading(false);
        setPreviewFor(id);
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
    setBuckets([]);
    setBucketsError(null);
    setBucketsFor(null);
    setNewBucketName("");
    setAppliedBucketIds(new Set());
    setAppliedFor(null);
    setBucketPreview([]);
    setStep(0);
    setModeLocked(false);
    setTables([]);
    setPickedTables(new Set());
    setPicksByBucket({});
    setAssignBucketId(null);
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

  // A data source that already has buckets IS module-wise — reflect that in the
  // toggle instead of letting the user start in "whole" and silently contradict
  // what the rule builder will do with the same source.
  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    fetchBuckets(selectedId)
      .then((list) => {
        if (cancelled || activeSourceRef.current !== selectedId) return;
        if (list.length > 0) {
          setMode("module");
          setModeLocked(true);
          setBuckets(
            list.map((b) => ({
              id: b.id,
              name: b.name,
              active: b.active,
              modelsCount: b.modelsCount,
            }))
          );
          setBucketsFor(selectedId);
        }
      })
      .catch(() => {
        /* No buckets is the ordinary case; the toggle stays on "whole". */
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  // Default the Models step to the first bucket so it is never in a state where
  // ticking does nothing.
  useEffect(() => {
    if (mode !== "module") return;
    if (assignBucketId && buckets.some((b) => b.id === assignBucketId)) return;
    setAssignBucketId(buckets[0]?.id ?? null);
  }, [mode, buckets, assignBucketId]);

  // A step fetches only when it holds nothing for the selected source. Stepping
  // Back therefore keeps what is on screen — unsaved ticks included — and a
  // mutation clearing the relevant marker is what makes the next visit reload.
  useEffect(() => {
    if (!selectedId) return;
    if (stepKey === "buckets" && bucketsFor !== selectedId)
      loadBuckets(selectedId);
    if (stepKey === "models" && tablesFor !== selectedId)
      loadTables(selectedId);
    // Both: the applied set AND the bucket list, because the model counts shown
    // here are stale the moment the Models step files anything.
    if (stepKey === "applicable" && mode === "module") {
      if (bucketsFor !== selectedId) loadBuckets(selectedId);
      if (appliedFor !== selectedId) loadAppliedBuckets(selectedId);
    }
    if (
      stepKey === "applicable" &&
      mode === "whole" &&
      modelsFor !== selectedId
    )
      loadModels(selectedId);
    if (stepKey === "preview" && mode === "module" && previewFor !== selectedId)
      loadBucketPreview(selectedId);
    if (stepKey === "preview" && mode === "whole" && previewFor !== selectedId)
      loadPreview(applicable, selectedId);
  }, [
    step,
    stepKey,
    mode,
    loadAppliedBuckets,
    appliedFor,
    loadBucketPreview,
    selectedId,
    bucketsFor,
    loadBuckets,
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

    // Module-wise: one pull per bucket, all in this single Save, so configuring
    // three buckets and saving once creates and files the lot. A table whose
    // bucket changed is re-pulled too -- the pull matches on
    // (datasource_id, lock_model_name) and updates in place, so it MOVES rather
    // than duplicating.
    const pullsByBucket: { bucketId: number; tables: string[] }[] =
      mode === "module"
        ? Object.entries(picksByBucket)
            .map(([bucketIdKey, names]) => {
              const bucketId = Number(bucketIdKey);
              const wanted = tables.filter(
                (t) =>
                  names.has(t.name) &&
                  (!t.catalogued || t.bucketId !== bucketId)
              );
              return { bucketId, tables: wanted.map((t) => t.name) };
            })
            .filter((entry) => entry.tables.length > 0)
        : [];

    // Every table ticked under ANY bucket, for working out what was removed.
    const pickedAcrossBuckets = new Set<string>();
    Object.values(picksByBucket).forEach((names) =>
      names.forEach((name) => pickedAcrossBuckets.add(name))
    );
    const effectivePicks =
      mode === "module" ? pickedAcrossBuckets : pickedTables;

    // Only genuinely new tables are pulled — a table already in the catalogue is
    // left alone rather than sent through pull_schema a second time.
    const toAdd = tables
      .filter((t) => effectivePicks.has(t.name) && !t.catalogued)
      .map((t) => t.name);

    // Unticked but previously catalogued. Deleting the available model takes its
    // attributes and its applicable-model rows with it (both are `dependent:` on
    // RuleEngine::AvailableModel), so no extra cleanup call is needed here.
    const toDelete = tables.filter(
      (t) => t.catalogued && !effectivePicks.has(t.name) && t.availableModelId
    );

    if (
      toAdd.length === 0 &&
      toDelete.length === 0 &&
      pullsByBucket.length === 0
    ) {
      toast.info("No changes to save");
      return;
    }

    setSavingModels(true);
    try {
      const pull = async (tableNames: string[], bucketId: number | null) => {
        const response = await fetch(
          getFullUrl(`/datasources/${selectedId}/pull_schema.json`),
          {
            method: "POST",
            headers: {
              Authorization: getAuthHeader(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: sourceType,
              tables: tableNames,
              // The pull files these models under the bucket itself, so there is
              // never a window where they exist unbucketed.
              ...(bucketId ? { bucket_id: bucketId } : {}),
            }),
          }
        );
        const body = await readJson(response);
        if (!response.ok || body?.success === false) {
          throw new Error(
            errorText(body, `Failed to add models (${response.status})`)
          );
        }
        return Number(body?.models_created ?? tableNames.length);
      };

      let added = 0;
      let filed = 0;
      if (mode === "module") {
        // One pull per bucket — every bucket you configured is written by this
        // single Save, in bucket order.
        for (const entry of pullsByBucket) {
          added += await pull(entry.tables, entry.bucketId);
          filed += entry.tables.length;
        }
      } else if (toAdd.length > 0) {
        added = await pull(toAdd, null);
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
      if (mode === "module" && filed > 0) {
        parts.push(`${filed} filed across ${pullsByBucket.length} bucket(s)`);
      }
      if (toDelete.length - failed.length > 0) {
        parts.push(`${toDelete.length - failed.length} removed`);
      }
      if (parts.length > 0) toast.success(parts.join(", "));
      if (failed.length > 0) {
        toast.error(`Could not remove: ${failed.join(", ")}`);
      }

      // Buckets were written by the pulls above, so the bucket list is stale.
      if (mode === "module") setBucketsFor(null);

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
    const rows = previewRows;
    const attributeCount = rows.reduce(
      (total, row) => total + row.attributes.length,
      0
    );
    setCompleted(true);
    toast.success(
      `Configuration complete — ${rows.length} model(s), ${attributeCount} attribute(s) ready for rules`
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

  // In module mode the ticks belong to the bucket being assigned to; in whole
  // mode there is one flat set. Everything below reads THIS, so the two flows
  // share the same toolbar, search and Save.
  const activePicks = useMemo<Set<string>>(() => {
    if (mode !== "module") return pickedTables;
    if (!assignBucketId) return new Set<string>();
    return picksByBucket[assignBucketId] ?? new Set<string>();
  }, [mode, pickedTables, assignBucketId, picksByBucket]);

  // Table name -> the OTHER bucket that has it ticked. A model belongs to
  // exactly one bucket, so ticking it here has to move it, and the row says so
  // rather than letting it silently vanish from the first bucket.
  const claimedElsewhere = useMemo<Record<string, number>>(() => {
    if (mode !== "module") return {};
    const map: Record<string, number> = {};
    Object.entries(picksByBucket).forEach(([bucketIdKey, names]) => {
      const bucketId = Number(bucketIdKey);
      if (bucketId === assignBucketId) return;
      names.forEach((name) => {
        map[name] = bucketId;
      });
    });
    return map;
  }, [mode, picksByBucket, assignBucketId]);

  const modelChanges = useMemo(() => {
    if (mode === "module") {
      // Across every bucket, not just the one on screen -- Save writes them all.
      const picked = new Map<string, number>();
      Object.entries(picksByBucket).forEach(([bucketIdKey, names]) =>
        names.forEach((name) => picked.set(name, Number(bucketIdKey)))
      );
      const add = tables.filter(
        (t) =>
          picked.has(t.name) &&
          (!t.catalogued || t.bucketId !== picked.get(t.name))
      ).length;
      const remove = tables.filter(
        (t) => t.catalogued && !picked.has(t.name) && t.availableModelId
      ).length;
      return { add, remove, total: add + remove };
    }
    const add = tables.filter(
      (t) => pickedTables.has(t.name) && !t.catalogued
    ).length;
    const remove = tables.filter(
      (t) => t.catalogued && !pickedTables.has(t.name) && t.availableModelId
    ).length;
    return { add, remove, total: add + remove };
  }, [tables, pickedTables, mode, picksByBucket]);

  const applicableChanges = useMemo(() => {
    const enabledIds = new Set(applicable.map((m) => m.availableModelId));
    const add = [...pickedModels].filter((id) => !enabledIds.has(id)).length;
    const remove = applicable.filter(
      (m) => !pickedModels.has(m.availableModelId)
    ).length;
    return { add, remove, total: add + remove };
  }, [applicable, pickedModels]);

  const toggleTable = (name: string) => {
    if (mode !== "module") {
      setPickedTables((prev) => {
        const next = new Set(prev);
        if (next.has(name)) next.delete(name);
        else next.add(name);
        return next;
      });
      return;
    }
    if (!assignBucketId) return;

    setPicksByBucket((prev) => {
      const next: Record<number, Set<string>> = {};
      Object.entries(prev).forEach(([k, v]) => (next[Number(k)] = new Set(v)));
      const mine = next[assignBucketId] ?? new Set<string>();

      if (mine.has(name)) {
        mine.delete(name);
      } else {
        // One bucket per model: claiming it here releases it everywhere else.
        Object.keys(next).forEach((k) => next[Number(k)].delete(name));
        mine.add(name);
      }
      next[assignBucketId] = mine;
      return next;
    });
  };

  const toggleModel = (id: number) =>
    setPickedModels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allTablesPicked =
    visibleTables.length > 0 &&
    visibleTables.every((t) => activePicks.has(t.name));

  const allModelsPicked =
    visibleModels.length > 0 &&
    visibleModels.every((m) => pickedModels.has(m.id));

  // Acts on the rows in view, so it stays predictable under a search filter.
  const toggleAllTables = () => {
    if (mode !== "module") {
      setPickedTables((prev) => {
        const next = new Set(prev);
        visibleTables.forEach((t) =>
          allTablesPicked ? next.delete(t.name) : next.add(t.name)
        );
        return next;
      });
      return;
    }
    if (!assignBucketId) return;

    setPicksByBucket((prev) => {
      const next: Record<number, Set<string>> = {};
      Object.entries(prev).forEach(([k, v]) => (next[Number(k)] = new Set(v)));
      const mine = next[assignBucketId] ?? new Set<string>();
      visibleTables.forEach((t) => {
        if (allTablesPicked) {
          mine.delete(t.name);
        } else {
          Object.keys(next).forEach((k) => next[Number(k)].delete(t.name));
          mine.add(t.name);
        }
      });
      next[assignBucketId] = mine;
      return next;
    });
  };

  const toggleAllModels = () =>
    setPickedModels((prev) => {
      const next = new Set(prev);
      visibleModels.forEach((m) =>
        allModelsPicked ? next.delete(m.id) : next.add(m.id)
      );
      return next;
    });

  const previewRows =
    mode === "module"
      ? bucketPreview.flatMap((bucket) => bucket.models)
      : preview;

  const canGoNext =
    stepKey === "source" ? Boolean(selectedId) : step < STEPS.length - 1;
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
      {stepKey === "source" && (
        <div className="space-y-4">
          <div className="w-full sm:max-w-sm">
            <label
              className="mb-1.5 block text-xs font-medium"
              style={{ color: T.textMain }}
            >
              Data Source
            </label>
            <SelectShell>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                disabled={sourcesLoading}
                className={selectClass}
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
            </SelectShell>
          </div>

          {/* ── Segregation mode ── the fork in the road, right under the
              source it applies to. Everything after this point follows from it. */}
          {selectedSource && (
            <div
              className="rounded-xl border p-4"
              style={{ borderColor: T.borderLgt, background: T.cardBg }}
            >
              <p
                className="mb-1 text-[13px] font-bold"
                style={{ color: T.textMain }}
              >
                How should this data source be segregated?
              </p>
              <p className="mb-3 text-[12px]" style={{ color: T.textMuted }}>
                {modeLocked
                  ? "This data source already has buckets, so it is module-wise. Delete every bucket to switch it back."
                  : "Pick once — it decides the remaining steps."}
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  {
                    key: "whole" as const,
                    title: "Apply segregation",
                    blurb:
                      "The whole data source. Catalogue its tables, make the models applicable, done.",
                    steps: "Models → Applicable Models → Preview",
                    icon: Database,
                  },
                  {
                    key: "module" as const,
                    title: "Apply module-wise segregation",
                    blurb:
                      "One data source, several products. Group its models into buckets and publish a whole bucket.",
                    steps: "Buckets → Models → Applicable Buckets → Preview",
                    icon: Boxes,
                  },
                ].map((option) => {
                  const picked = mode === option.key;
                  // A source that already has buckets cannot claim to be whole-source.
                  const blocked = modeLocked && option.key === "whole";
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => {
                        if (blocked || busy) return;
                        setMode(option.key);
                        setStep(0);
                      }}
                      disabled={blocked || busy}
                      className="rounded-xl border p-3 text-left disabled:opacity-50"
                      style={{
                        borderColor: picked ? T.primary : T.primaryBord,
                        background: picked ? T.primaryBg : T.cardBg,
                        borderWidth: picked ? 2 : 1,
                      }}
                    >
                      <span className="mb-1 flex items-center gap-2">
                        <Icon
                          className="h-4 w-4 shrink-0"
                          style={{ color: picked ? T.primary : T.textMuted }}
                        />
                        <span
                          className="text-[13px] font-bold"
                          style={{ color: T.textMain }}
                        >
                          {option.title}
                        </span>
                        {picked && (
                          <Check
                            className="ml-auto h-4 w-4"
                            style={{ color: T.primary }}
                          />
                        )}
                      </span>
                      <span
                        className="block text-[12px] leading-snug"
                        style={{ color: T.textMuted }}
                      >
                        {option.blurb}
                      </span>
                      <span
                        className="mt-2 block text-[11px] font-semibold"
                        style={{ color: picked ? T.primary : T.textMuted }}
                      >
                        {option.steps}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
      {/* ── Step 2: Buckets (optional) ── */}
      {stepKey === "buckets" && (
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: T.borderLgt, background: T.cardBg }}
        >
          <div className="mb-1 flex items-center gap-2">
            <Boxes className="h-4 w-4" style={{ color: T.primary }} />
            <h3 className="text-[15px] font-bold" style={{ color: T.textMain }}>
              Buckets
            </h3>
            <span
              className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
              style={{ background: T.primaryBg, color: T.textMuted }}
            >
              Optional
            </span>
          </div>
          <p className="mb-4 text-[12.5px]" style={{ color: T.textMuted }}>
            Group this source&apos;s models into product modules — a PATM
            database holding Maintenance, Attendance and Manpower tables becomes
            three buckets instead of one flat list. Create them here — the next
            step is where you pick which tables go into each one.{" "}
            <strong style={{ color: T.textMain }}>
              Skip this step entirely
            </strong>{" "}
            if the data source is a single product — the models stay unbucketed
            and the rest of the wizard is unchanged.
          </p>

          {/* Create */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <input
              value={newBucketName}
              onChange={(e) => setNewBucketName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addBucket();
              }}
              placeholder="New bucket name, e.g. Maintenance"
              disabled={bucketBusy}
              className="h-9 flex-1 rounded-lg border px-3 text-[13px] outline-none focus:ring-2 focus:ring-[#DA7756]/30 sm:max-w-xs"
              style={inputStyle}
            />
            <button
              type="button"
              onClick={addBucket}
              disabled={bucketBusy || !newBucketName.trim()}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[12.5px] font-semibold text-white disabled:opacity-50"
              style={{ background: T.primary }}
            >
              {bucketBusy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              Create
            </button>
          </div>

          {bucketsLoading && (
            <div
              className="flex items-center gap-2 py-6 text-[13px]"
              style={{ color: T.textMuted }}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading buckets...
            </div>
          )}

          {!bucketsLoading && bucketsError && (
            <div className="py-6 text-center">
              <p className="mb-2 text-[13px]" style={{ color: "#b91c1c" }}>
                {bucketsError}
              </p>
              <button
                type="button"
                onClick={() => loadBuckets(selectedId)}
                className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold"
                style={{ color: T.primary }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retry
              </button>
            </div>
          )}

          {!bucketsLoading && !bucketsError && buckets.length === 0 && (
            <p
              className="py-6 text-center text-[13px]"
              style={{ color: T.textMuted }}
            >
              No buckets on this data source yet — create one above, or continue
              without bucketing.
            </p>
          )}

          {!bucketsLoading && !bucketsError && buckets.length > 0 && (
            <div className="space-y-1.5">
              {buckets.map((bucket) => {
                return (
                  <div
                    key={bucket.id}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
                    style={{
                      borderColor: T.borderLgt,
                      background: T.cardBg,
                    }}
                  >
                    <Boxes
                      className="h-4 w-4 shrink-0"
                      style={{ color: T.textMuted }}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-[13px] font-semibold"
                        style={{ color: T.textMain }}
                      >
                        {bucket.name}
                      </p>
                      <p
                        className="text-[11.5px]"
                        style={{ color: T.textMuted }}
                      >
                        {bucket.modelsCount} model
                        {bucket.modelsCount === 1 ? "" : "s"}
                        {bucket.active ? "" : " · inactive"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(bucket)}
                      disabled={bucketBusy}
                      title="Delete bucket (its models stay catalogued)"
                      className="shrink-0 rounded-md p-1.5 disabled:opacity-40"
                      style={{ color: T.textMuted }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Which bucket the ticks below belong to. Switching keeps every other
          bucket's selection — one Save writes them all. */}
      {stepKey === "models" && mode === "module" && (
        <div
          className="rounded-xl border p-3"
          style={{ borderColor: T.primaryBord, background: T.primaryBg }}
        >
          <p
            className="mb-2 text-[12.5px] font-semibold"
            style={{ color: T.textMain }}
          >
            Assigning tables to
          </p>
          {buckets.length === 0 ? (
            <p className="text-[12.5px]" style={{ color: T.textMuted }}>
              No buckets yet — go back and create one first.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-1.5">
                {buckets.map((bucket) => {
                  const picked = assignBucketId === bucket.id;
                  const count = picksByBucket[bucket.id]?.size ?? 0;
                  return (
                    <button
                      key={bucket.id}
                      type="button"
                      onClick={() => setAssignBucketId(bucket.id)}
                      disabled={savingModels}
                      className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12.5px] font-semibold disabled:opacity-50"
                      style={{
                        borderColor: picked ? T.primary : T.primaryBord,
                        background: picked ? T.primary : T.cardBg,
                        color: picked ? "#ffffff" : T.textMain,
                        borderWidth: picked ? 2 : 1,
                      }}
                    >
                      <Boxes className="h-3.5 w-3.5" />
                      {bucket.name}
                      <span
                        className="rounded-full px-1.5 text-[10.5px] font-bold"
                        style={{
                          background: picked
                            ? "rgba(255,255,255,0.25)"
                            : T.primaryBg,
                          color: picked ? "#ffffff" : T.textMuted,
                        }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11.5px]" style={{ color: T.textMuted }}>
                {assignBucketId
                  ? "Switching buckets keeps the other buckets' selections. Save once and every bucket is written."
                  : "Pick a bucket above, then tick its tables below."}
              </p>
            </>
          )}
        </div>
      )}

      {stepKey === "models" && (
        <StepPanel
          title="Models"
          subtitle="Tick the tables to catalogue as models. Unticking one that was saved before deletes it, along with its attributes and applicable models."
          search={tableSearch}
          onSearchChange={setTableSearch}
          searchPlaceholder="Search tables..."
          showToolbar={tables.length > 0}
          onToggleAll={toggleAllTables}
          allSelected={allTablesPicked}
          countLabel={
            mode === "module"
              ? `${activePicks.size} selected in this bucket`
              : `${pickedTables.size} selected`
          }
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
          {visibleTables.map((table) => {
            const owner = claimedElsewhere[table.name];
            const ownerName = owner
              ? buckets.find((b) => b.id === owner)?.name
              : undefined;
            return (
              <Row
                key={table.name}
                checked={activePicks.has(table.name)}
                onToggle={() => toggleTable(table.name)}
                disabled={
                  savingModels || (mode === "module" && !assignBucketId)
                }
                displayName={table.displayName}
                originalName={table.name}
                meta={`${table.columnCount} column${table.columnCount === 1 ? "" : "s"}`}
                // A model belongs to exactly one bucket, so a table held by
                // another bucket says so — ticking it here moves it.
                badge={
                  ownerName
                    ? `In ${ownerName}`
                    : table.catalogued
                      ? "Added"
                      : undefined
                }
              />
            );
          })}
        </StepPanel>
      )}

      {/* ── Step 3: Applicable Models ── */}
      {/* ── Applicable Buckets (module-wise) ── the bucket IS the unit here, so
          this lists bucket names, not the models inside them. */}
      {stepKey === "applicable" && mode === "module" && (
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: T.borderLgt, background: T.cardBg }}
        >
          <div className="mb-1 flex items-center gap-2">
            <Layers className="h-4 w-4" style={{ color: T.primary }} />
            <h3 className="text-[15px] font-bold" style={{ color: T.textMain }}>
              Applicable Buckets
            </h3>
          </div>
          <p className="mb-4 text-[12.5px]" style={{ color: T.textMuted }}>
            Make a bucket applicable and every model filed under it becomes
            available to rules in one row — including models you add to the
            bucket later.
          </p>

          {buckets.length === 0 ? (
            <p
              className="py-6 text-center text-[13px]"
              style={{ color: T.textMuted }}
            >
              No buckets yet — go back to the Buckets step and create one.
            </p>
          ) : (
            <div className="space-y-1.5">
              {buckets.map((bucket) => {
                const applied = appliedBucketIds.has(bucket.id);
                return (
                  <div
                    key={bucket.id}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
                    style={{
                      borderColor: applied ? T.done : T.borderLgt,
                      background: applied ? "#f2fbf8" : T.cardBg,
                    }}
                  >
                    <Boxes
                      className="h-4 w-4 shrink-0"
                      style={{ color: applied ? T.done : T.textMuted }}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-[13px] font-semibold"
                        style={{ color: T.textMain }}
                      >
                        {bucket.name}
                      </p>
                      <p
                        className="text-[11.5px]"
                        style={{
                          color:
                            bucket.modelsCount === 0 ? "#b45309" : T.textMuted,
                        }}
                      >
                        {bucket.modelsCount === 0
                          ? "No models assigned — go back to Models and tick tables for this bucket"
                          : `${bucket.modelsCount} model${bucket.modelsCount === 1 ? "" : "s"}`}
                        {bucket.active ? "" : " · inactive"}
                      </p>
                    </div>
                    {applied ? (
                      <span
                        className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={{ background: T.done, color: "#ffffff" }}
                      >
                        <Check className="h-3 w-3" />
                        Applicable
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => applyBucket(bucket)}
                        disabled={applying || bucket.modelsCount === 0}
                        title={
                          bucket.modelsCount === 0
                            ? "Assign models to this bucket first"
                            : undefined
                        }
                        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[12px] font-semibold text-white disabled:opacity-40"
                        style={{ background: T.primary }}
                      >
                        {applying ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Layers className="h-3.5 w-3.5" />
                        )}
                        Make applicable
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {stepKey === "applicable" && mode === "whole" && (
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
      {/* ── Preview (module-wise) ── bucket name, its applicable models, and
          each model's attributes. */}
      {stepKey === "preview" && mode === "module" && (
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: T.borderLgt, background: T.cardBg }}
        >
          <div className="mb-1 flex items-center gap-2">
            <Eye className="h-4 w-4" style={{ color: T.primary }} />
            <h3 className="text-[15px] font-bold" style={{ color: T.textMain }}>
              Preview
            </h3>
          </div>
          <p className="mb-4 text-[12.5px]" style={{ color: T.textMuted }}>
            What rule authors will see for this data source: each applicable
            bucket, the models inside it, and the attributes those models
            expose.
          </p>

          {previewLoading && (
            <div
              className="flex items-center gap-2 py-6 text-[13px]"
              style={{ color: T.textMuted }}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading preview...
            </div>
          )}

          {!previewLoading && previewError && (
            <div className="py-6 text-center">
              <p className="mb-2 text-[13px]" style={{ color: "#b91c1c" }}>
                {previewError}
              </p>
              <button
                type="button"
                onClick={() => loadBucketPreview(selectedId)}
                className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold"
                style={{ color: T.primary }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retry
              </button>
            </div>
          )}

          {!previewLoading && !previewError && bucketPreview.length === 0 && (
            <p
              className="py-6 text-center text-[13px]"
              style={{ color: T.textMuted }}
            >
              No applicable buckets yet — make one applicable in the previous
              step.
            </p>
          )}

          {!previewLoading && !previewError && bucketPreview.length > 0 && (
            <div className="space-y-3">
              {bucketPreview.map((bucket) => (
                <div
                  key={bucket.bucketId}
                  className="rounded-xl border"
                  style={{ borderColor: T.primaryBord }}
                >
                  <div
                    className="flex items-center gap-2 rounded-t-xl px-3 py-2"
                    style={{ background: T.primaryBg }}
                  >
                    <Boxes
                      className="h-4 w-4 shrink-0"
                      style={{ color: T.primary }}
                    />
                    <span
                      className="text-[13px] font-bold"
                      style={{ color: T.textMain }}
                    >
                      {bucket.name}
                    </span>
                    <span
                      className="ml-auto text-[11.5px]"
                      style={{ color: T.textMuted }}
                    >
                      {bucket.models.length} model
                      {bucket.models.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  {bucket.models.length === 0 ? (
                    <p
                      className="px-3 py-3 text-[12.5px]"
                      style={{ color: T.textMuted }}
                    >
                      No models filed under this bucket.
                    </p>
                  ) : (
                    <div
                      className="divide-y"
                      style={{ borderColor: T.borderLgt }}
                    >
                      {bucket.models.map((model) => (
                        <div key={model.lockModelName} className="px-3 py-2.5">
                          <div className="mb-1 flex items-center gap-2">
                            <ListTree
                              className="h-3.5 w-3.5 shrink-0"
                              style={{ color: T.textMuted }}
                            />
                            <span
                              className="text-[12.5px] font-semibold"
                              style={{ color: T.textMain }}
                            >
                              {model.displayName}
                            </span>
                            <span
                              className="text-[11px]"
                              style={{ color: T.textMuted }}
                            >
                              {model.lockModelName}
                            </span>
                            <span
                              className="ml-auto text-[11px]"
                              style={{ color: T.textMuted }}
                            >
                              {model.attributes.length} attribute
                              {model.attributes.length === 1 ? "" : "s"}
                            </span>
                          </div>
                          {model.attributes.length > 0 && (
                            <div className="flex flex-wrap gap-1 pl-5">
                              {model.attributes.map((attribute) => (
                                <span
                                  key={attribute.id}
                                  className="rounded-md px-1.5 py-0.5 text-[11px]"
                                  style={{
                                    background: T.primaryBg,
                                    color: T.textMuted,
                                  }}
                                  title={attribute.attributeName}
                                >
                                  {attribute.displayName}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {stepKey === "preview" && mode === "whole" && (
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
        {/* Pehle step ("Data Source") par peeche jaane ki jagah hi nahi hai —
            wahan disabled Back dikhane ke bajaye button render hi nahi karte.
            Khaali span sirf isliye hai ki justify-between Next/Done ko right
            me rakhe. */}
        {stepKey === "source" ? (
          <span aria-hidden />
        ) : (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            style={{ borderColor: T.primaryBord, color: T.textMuted }}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        )}

        {step === STEPS.length - 1 ? (
          <button
            type="button"
            onClick={finish}
            disabled={
              busy || previewLoading || previewRows.length === 0 || completed
            }
            title={
              previewRows.length === 0
                ? "Mark at least one model applicable first"
                : undefined
            }
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ background: completed ? T.done : T.primary }}
            onMouseEnter={(e) => {
              if (!busy && !completed && previewRows.length > 0) {
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

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(next) => {
          if (!next && !bucketBusy) setPendingDelete(null);
        }}
      >
        <AlertDialogContent style={{ fontFamily: T.font }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete bucket?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name
                ? `"${pendingDelete.name}" will be removed. Its models stay catalogued — only the grouping goes away.`
                : "This bucket will be removed. Its models stay catalogued."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bucketBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                removeBucket();
              }}
              disabled={bucketBusy}
              style={{ background: T.primary }}
            >
              {bucketBusy ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
              className="w-full rounded-xl border py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#DA7756]/30"
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
