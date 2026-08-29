import { useCallback, useEffect, useState } from "react";
import {
  X,
  Database,
  Boxes,
  ListTree,
  Loader2,
  RotateCcw,
  Check,
  Server,
  User as UserIcon,
  Hash,
  Key,
  Link2,
} from "lucide-react";
import {
  fetchDatasourceStructure,
  type DatasourceStructure,
  type StructureModel,
} from "@/services/ruleEngineAPI";
import { T } from "@/components/AdminCompass/ruleEngineTheme";

interface Props {
  datasourceId: number | null;
  onClose: () => void;
}

/**
 * Read-only detail view for one data source.
 *
 * It renders whichever shape the source was configured with, because the two
 * are genuinely different pictures:
 *
 *   module-wise -> Bucket, its models, and each model's attributes
 *   whole-source -> the models directly, with their attributes
 *
 * `bucketed` from the API decides, so this can never disagree with the
 * configuration wizard or the rule builder.
 */
const DataSourceDetailsSheet = ({ datasourceId, onClose }: Props) => {
  const [data, setData] = useState<DatasourceStructure | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openModels, setOpenModels] = useState<Set<number>>(new Set());

  const load = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchDatasourceStructure(id));
    } catch (e: any) {
      setError(e?.message || "Failed to load data source");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (datasourceId) {
      setOpenModels(new Set());
      load(datasourceId);
    }
  }, [datasourceId, load]);

  if (!datasourceId) return null;

  const source = data?.datasource ?? {};

  const toggleModel = (id: number) =>
    setOpenModels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const ModelRow = ({ model }: { model: StructureModel }) => {
    const open = openModels.has(model.id);
    return (
      <div className="px-3 py-2.5">
        <button
          type="button"
          onClick={() => toggleModel(model.id)}
          className="flex w-full items-center gap-2 text-left"
        >
          <ListTree
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: T.textMuted }}
          />
          <span
            className="truncate text-[12.5px] font-semibold"
            style={{ color: T.textMain }}
          >
            {model.displayName}
          </span>
          <span className="truncate text-[11px]" style={{ color: T.textMuted }}>
            {model.lockModelName}
          </span>
          {model.applicable && (
            <span
              className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
              style={{ background: T.done }}
            >
              applicable
            </span>
          )}
          <span
            className="ml-auto shrink-0 text-[11px]"
            style={{ color: T.textMuted }}
          >
            {model.attributesCount} attr
            {model.attributesCount === 1 ? "" : "s"}
          </span>
        </button>

        {open && model.attributes.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1 pl-5">
            {model.attributes.map((attribute) => {
              // 🔑 primary, 🔗 foreign. A declared constraint is shown solid;
              // one inferred from the *_id convention is dashed, because a
              // guess must not read as a fact.
              const inferred = attribute.relationshipSource === "inferred";
              const isKey = attribute.isPrimaryKey || attribute.isForeignKey;
              return (
                <span
                  key={attribute.id}
                  title={
                    attribute.isForeignKey && attribute.referencesTable
                      ? `${attribute.attributeName} → ${attribute.referencesTable}.${attribute.referencesColumn}` +
                        (inferred
                          ? " (inferred from naming)"
                          : " (declared constraint)")
                      : `${attribute.attributeName}${attribute.dataType ? ` · ${attribute.dataType}` : ""}`
                  }
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px]"
                  style={{
                    background: attribute.isPrimaryKey
                      ? "#fef3c7"
                      : attribute.isForeignKey
                        ? "#e0f2fe"
                        : T.primaryBg,
                    color: isKey ? T.textMain : T.textMuted,
                    border: attribute.isForeignKey
                      ? `1px ${inferred ? "dashed" : "solid"} #7dd3fc`
                      : attribute.isPrimaryKey
                        ? "1px solid #fcd34d"
                        : "1px solid transparent",
                  }}
                >
                  {attribute.isPrimaryKey && <Key className="h-2.5 w-2.5" />}
                  {attribute.isForeignKey && <Link2 className="h-2.5 w-2.5" />}
                  {attribute.displayName}
                  {attribute.isForeignKey && attribute.referencesTable && (
                    <span style={{ color: T.textMuted }}>
                      → {attribute.referencesTable}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative flex h-full w-full max-w-2xl flex-col overflow-hidden shadow-xl"
        style={{ background: T.cardBg }}
        role="dialog"
        aria-label="Data source details"
      >
        {/* Header */}
        <div
          className="flex items-start gap-3 border-b px-5 py-4"
          style={{ borderColor: T.borderLgt, background: T.primaryBg }}
        >
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
            style={{ background: T.cardBg }}
          >
            <Database className="h-5 w-5" style={{ color: T.primary }} />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              className="truncate text-[17px] font-bold"
              style={{ color: T.textMain }}
            >
              {source.datasource_name || `Data source #${datasourceId}`}
            </h2>
            <p className="text-[12.5px]" style={{ color: T.textMuted }}>
              {data
                ? data.bucketed
                  ? "Module-wise segregation — models grouped into buckets"
                  : "Whole data source — models used directly"
                : "Loading..."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" style={{ color: T.textMuted }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading && (
            <div
              className="flex items-center gap-2 py-10 text-[13px]"
              style={{ color: T.textMuted }}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading data source...
            </div>
          )}

          {!loading && error && (
            <div className="py-10 text-center">
              <p className="mb-2 text-[13px]" style={{ color: "#b91c1c" }}>
                {error}
              </p>
              <button
                type="button"
                onClick={() => load(datasourceId)}
                className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold"
                style={{ color: T.primary }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retry
              </button>
            </div>
          )}

          {!loading && !error && data && (
            <div className="space-y-4">
              {/* Connection facts */}
              <div
                className="grid gap-x-4 gap-y-2 rounded-xl border p-4 sm:grid-cols-2"
                style={{ borderColor: T.borderLgt }}
              >
                {[
                  { icon: Server, label: "Host", value: source.host },
                  {
                    icon: Database,
                    label: "Database",
                    value: source.database_name,
                  },
                  { icon: Hash, label: "Connecter", value: source.connecter },
                  { icon: Hash, label: "Port", value: source.port },
                  {
                    icon: Hash,
                    label: "Project code",
                    value: source.project_code,
                  },
                  {
                    icon: UserIcon,
                    label: "Created by",
                    value: source.created_by_name,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon
                      className="h-3.5 w-3.5 shrink-0"
                      style={{ color: T.textMuted }}
                    />
                    <span
                      className="text-[11.5px]"
                      style={{ color: T.textMuted }}
                    >
                      {label}
                    </span>
                    <span
                      className="ml-auto truncate text-[12.5px] font-semibold"
                      style={{ color: T.textMain }}
                    >
                      {value || "—"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Counts */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ...(data.bucketed
                    ? [
                        {
                          label: "Buckets",
                          value: data.counts.buckets,
                        },
                        {
                          label: "Applicable",
                          value: data.counts.applicable_buckets,
                        },
                      ]
                    : [
                        { label: "Models", value: data.counts.models },
                        {
                          label: "Applicable",
                          value: data.counts.applicable_models,
                        },
                      ]),
                  { label: "Models", value: data.counts.models },
                  { label: "Attributes", value: data.counts.attributes },
                ].map((stat, i) => (
                  <div
                    key={`${stat.label}-${i}`}
                    className="rounded-xl border px-3 py-2"
                    style={{
                      borderColor: T.borderLgt,
                      background: T.primaryBg,
                    }}
                  >
                    <p
                      className="text-[18px] font-bold leading-tight"
                      style={{ color: T.textMain }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-[11px]" style={{ color: T.textMuted }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── Module-wise: bucket -> models -> attributes ── */}
              {data.bucketed &&
                data.buckets.map((bucket) => (
                  <div
                    key={bucket.id}
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
                      {bucket.applicable && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                          style={{ background: T.done }}
                        >
                          <Check className="h-2.5 w-2.5" />
                          applicable
                        </span>
                      )}
                      <span
                        className="ml-auto text-[11.5px]"
                        style={{ color: T.textMuted }}
                      >
                        {bucket.modelsCount} model
                        {bucket.modelsCount === 1 ? "" : "s"}
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
                          <ModelRow key={model.id} model={model} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}

              {/* Bucketed source can still hold models filed under nothing. */}
              {data.bucketed && data.unbucketedModels.length > 0 && (
                <div
                  className="rounded-xl border"
                  style={{ borderColor: T.borderLgt }}
                >
                  <div
                    className="px-3 py-2 text-[12.5px] font-semibold"
                    style={{ color: T.textMuted, background: "#fafaf8" }}
                  >
                    Not in any bucket ({data.unbucketedModels.length})
                  </div>
                  <div
                    className="divide-y"
                    style={{ borderColor: T.borderLgt }}
                  >
                    {data.unbucketedModels.map((model) => (
                      <ModelRow key={model.id} model={model} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Whole-source: models -> attributes ── */}
              {!data.bucketed && (
                <div
                  className="rounded-xl border"
                  style={{ borderColor: T.primaryBord }}
                >
                  <div
                    className="flex items-center gap-2 rounded-t-xl px-3 py-2"
                    style={{ background: T.primaryBg }}
                  >
                    <ListTree
                      className="h-4 w-4 shrink-0"
                      style={{ color: T.primary }}
                    />
                    <span
                      className="text-[13px] font-bold"
                      style={{ color: T.textMain }}
                    >
                      Models
                    </span>
                    <span
                      className="ml-auto text-[11.5px]"
                      style={{ color: T.textMuted }}
                    >
                      tap a model to see its attributes
                    </span>
                  </div>

                  {data.models.length === 0 ? (
                    <p
                      className="px-3 py-4 text-center text-[12.5px]"
                      style={{ color: T.textMuted }}
                    >
                      Nothing catalogued yet — pull this data source's schema
                      from the Configuration tab.
                    </p>
                  ) : (
                    <div
                      className="divide-y"
                      style={{ borderColor: T.borderLgt }}
                    >
                      {data.models.map((model) => (
                        <ModelRow key={model.id} model={model} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataSourceDetailsSheet;
