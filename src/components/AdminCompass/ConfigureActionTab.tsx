import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Zap,
  Plus,
  Trash2,
  Loader2,
  RotateCcw,
  Check,
  Boxes,
  Database,
  AlertTriangle,
  Code2,
  Wand2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchCustomActionKinds,
  fetchCustomActions,
  createCustomAction,
  deleteCustomAction,
  registerCustomAction,
  fetchCallableMethods,
  registerCodeFunction,
  askCustomActionAgent,
  fetchBuckets,
  fetchTenantBuckets,
  type CustomAction,
  type CustomActionKind,
  type CallableMethod,
  type Bucket,
} from "@/services/ruleEngineAPI";
import { getFullUrl, getAuthHeader } from "@/config/apiConfig";

const T = {
  // Baaki Rule Engine tabs (Data Source, Configuration, Rules) #DA7756 use
  // karte hain. Yahan #C4B89D (sidebar ka sand color) tha — uspar white text
  // ka contrast itna kam hai ki har primary button disabled jaisa dikhta tha.
  primary: "#DA7756",
  primaryBg: "#fdf9f7",
  primaryBord: "#e8e3de",
  textMain: "#1a1a1a",
  textMuted: "#6b7280",
  borderLgt: "#eceae4",
  cardBg: "#ffffff",
  done: "#16a34a",
  warn: "#b45309",
  danger: "#b91c1c",
};

const inputStyle = {
  borderColor: T.primaryBord,
  background: T.cardBg,
  color: T.textMain,
} as const;

interface DataSourceOption {
  id: number;
  datasource_name?: string | null;
}

interface ModelOption {
  id: number;
  displayName: string;
  lockModelName: string;
  type: string;
  bucketId: number | null;
  /** False when the catalogue row has no Ruby class behind it — a log or join
   *  table pulled from the app's own database. Such a model can never be
   *  introspected or executed against, so it is offered as disabled. */
  resolvable: boolean;
  modelClassName: string | null;
}

interface Props {
  sources: DataSourceOption[];
  sourcesLoading: boolean;
}

/**
 * Configure Action — the screen that makes an action a database row instead of
 * a deploy.
 *
 * Two ways to give a rule something to do, side by side, because they solve
 * different problems:
 *
 *   Code method   — register an existing PUBLIC Ruby method. Anything the
 *                   codebase already does well. Public only: Action#execute
 *                   uses public_send, so a private method fails silently.
 *   Custom action — a `kind` plus a config, interpreted at run time. No deploy.
 */
const ConfigureActionTab = ({ sources, sourcesLoading }: Props) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [tab, setTab] = useState<"custom" | "code">("custom");

  const [kinds, setKinds] = useState<CustomActionKind[]>([]);
  const [actions, setActions] = useState<CustomAction[]>([]);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [models, setModels] = useState<ModelOption[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // ── New custom action form ───────────────────────────────────────────────
  const [name, setName] = useState("");
  const [kind, setKind] = useState("increment_field");
  const [bucketId, setBucketId] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [config, setConfig] = useState<Record<string, string>>({});

  // ── Ask AI ───────────────────────────────────────────────────────────────
  // Previews only. The agent proposes a config; nothing is written until the
  // proposal has been read and accepted.
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiResult, setAiResult] = useState<Awaited<
    ReturnType<typeof askCustomActionAgent>
  > | null>(null);

  const askAi = async () => {
    if (!aiPrompt.trim())
      return toast.error("Describe what the action should do");
    if (!selectedId) return toast.error("Pick a data source first");
    setAiBusy(true);
    setAiResult(null);
    try {
      const result = await askCustomActionAgent({
        prompt: aiPrompt.trim(),
        datasourceId: Number(selectedId),
        bucketId: bucketId ? Number(bucketId) : null,
        persist: false,
      });
      setAiResult(result);
      if (!result.success)
        toast.error(result.errors[0] ?? "The agent could not build that");
    } catch (e: any) {
      toast.error(e?.message || "Ask AI failed");
    } finally {
      setAiBusy(false);
    }
  };

  // Drops the proposal into the form below, so it can be reviewed and edited
  // before anything is created.
  const applyAiProposal = () => {
    const proposed = aiResult?.payload;
    if (!proposed) return;
    setName(proposed.name);
    setKind(proposed.kind);
    const flat: Record<string, string> = {};
    Object.entries(proposed.config ?? {}).forEach(([key, value]) => {
      flat[key] =
        value && typeof value === "object"
          ? Object.entries(value as Record<string, any>)
              .map(([k, v]) => `${k}=${v}`)
              .join(", ")
          : String(value ?? "");
    });
    setConfig(flat);
    if (proposed.availableModelId)
      setModelId(String(proposed.availableModelId));
    setAiResult(null);
    setAiPrompt("");
    toast.success("Loaded into the form — review it, then Create");
  };

  // ── Code method registration ─────────────────────────────────────────────
  const [methodModelId, setMethodModelId] = useState<string>("");
  const [methods, setMethods] = useState<CallableMethod[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(false);

  const selectedKind = useMemo(
    () => kinds.find((k) => k.kind === kind),
    [kinds, kind]
  );

  const load = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const [kindList, actionList, bucketList] = await Promise.all([
        fetchCustomActionKinds(),
        fetchCustomActions({ datasourceId: id }),
        fetchBuckets(id),
      ]);
      setKinds(kindList);
      setActions(actionList);
      setBuckets(bucketList);

      // Models come from the applicable set — an action is only useful against
      // something the tenant may actually build rules on.
      const response = await fetch(
        getFullUrl(
          `/rule_engine/applicable_models/tenant_models.json?datasource_id=${id}`
        ),
        {
          headers: {
            Authorization: getAuthHeader(),
            Accept: "application/json",
          },
        }
      );
      const body = await response.json().catch(() => null);
      const rows = Array.isArray(body) ? body : (body?.tenant_models ?? []);
      setModels(
        rows
          .map((row: any) => ({
            id: Number(row?.available_model_id ?? row?.id),
            displayName: String(row?.display_name ?? "").trim(),
            lockModelName: String(row?.lock_model_name ?? "").trim(),
            type: String(row?.type ?? ""),
            bucketId: row?.bucket_id ?? null,
            resolvable: row?.resolvable !== false,
            modelClassName: row?.model_class_name ?? null,
          }))
          .filter((m: ModelOption) => Number.isFinite(m.id))
      );
    } catch (e: any) {
      setError(e?.message || "Failed to load actions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedId) load(selectedId);
  }, [selectedId, load]);

  // Only internal models can be introspected — an external model is a table in
  // another database, with no Ruby class behind it.
  const internalModels = useMemo(
    () => models.filter((m) => m.type === "internal"),
    [models]
  );

  const loadMethods = async (id: string) => {
    setMethodsLoading(true);
    try {
      const { instanceMethods, classMethods } = await fetchCallableMethods(id);
      setMethods([...instanceMethods, ...classMethods]);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load methods");
      setMethods([]);
    } finally {
      setMethodsLoading(false);
    }
  };

  const submitCustomAction = async () => {
    if (!name.trim()) return toast.error("Name is required");
    if (!selectedId) return toast.error("Pick a data source");

    const missing = (selectedKind?.requiredConfigKeys ?? []).filter(
      (key) => !String(config[key] ?? "").trim()
    );
    if (missing.length > 0) {
      return toast.error(`Missing: ${missing.join(", ")}`);
    }

    setBusy(true);
    try {
      // `match` is entered as "field=value" pairs and sent as an object, which
      // is what CustomActionRunner reads to find the related record.
      const parsed: Record<string, any> = { ...config };
      if (parsed.match) {
        parsed.match = String(parsed.match)
          .split(",")
          .reduce((acc: Record<string, string>, pair) => {
            const [k, v] = pair.split("=").map((x) => x.trim());
            if (k && v) acc[k] = v;
            return acc;
          }, {});
      }
      if (parsed.values) {
        parsed.values = String(parsed.values)
          .split(",")
          .reduce((acc: Record<string, string>, pair) => {
            const [k, v] = pair.split("=").map((x) => x.trim());
            if (k && v) acc[k] = v;
            return acc;
          }, {});
      }

      await createCustomAction({
        name: name.trim(),
        kind,
        datasourceId: Number(selectedId),
        bucketId: bucketId ? Number(bucketId) : null,
        availableModelId: modelId ? Number(modelId) : null,
        config: parsed,
      });
      toast.success(`"${name.trim()}" created`);
      setName("");
      setConfig({});
      await load(selectedId);
    } catch (e: any) {
      toast.error(e?.message || "Failed to create action");
    } finally {
      setBusy(false);
    }
  };

  const publish = async (action: CustomAction) => {
    setBusy(true);
    try {
      await registerCustomAction(action.id, action.availableModelId);
      toast.success(`"${action.name}" is now available to rules`);
      await load(selectedId);
    } catch (e: any) {
      toast.error(e?.message || "Failed to register");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (action: CustomAction) => {
    setBusy(true);
    try {
      await deleteCustomAction(action.id);
      toast.success(`"${action.name}" deleted`);
      await load(selectedId);
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete");
    } finally {
      setBusy(false);
    }
  };

  const registerMethod = async (method: CallableMethod) => {
    if (!methodModelId) return;
    setBusy(true);
    try {
      await registerCodeFunction({
        availableModelId: Number(methodModelId),
        functionName: method.name,
      });
      toast.success(`${method.name} registered`);
      await loadMethods(methodModelId);
    } catch (e: any) {
      toast.error(e?.message || "Failed to register method");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Data source picker */}
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: T.borderLgt, background: T.cardBg }}
      >
        <div className="mb-1 flex items-center gap-2">
          <Zap className="h-4 w-4" style={{ color: T.primary }} />
          <h3 className="text-[15px] font-bold" style={{ color: T.textMain }}>
            Configure Action
          </h3>
        </div>
        <p className="mb-3 text-[12.5px]" style={{ color: T.textMuted }}>
          What a rule can DO. Register an existing method, or build a custom
          action from configuration — no deploy.
        </p>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          disabled={sourcesLoading}
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none disabled:opacity-60"
          style={inputStyle}
        >
          <option value="">
            {sourcesLoading ? "Loading..." : "Select a data source"}
          </option>
          {sources.map((source) => (
            <option key={source.id} value={String(source.id)}>
              {source.datasource_name || `Data source #${source.id}`}
            </option>
          ))}
        </select>
      </div>

      {!selectedId && (
        <p
          className="rounded-xl border p-6 text-center text-[13px]"
          style={{ borderColor: T.borderLgt, color: T.textMuted }}
        >
          Pick a data source to configure its actions.
        </p>
      )}

      {selectedId && loading && (
        <div
          className="flex items-center gap-2 rounded-xl border p-6 text-[13px]"
          style={{ borderColor: T.borderLgt, color: T.textMuted }}
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading actions...
        </div>
      )}

      {selectedId && !loading && error && (
        <div
          className="rounded-xl border p-6 text-center"
          style={{ borderColor: T.borderLgt }}
        >
          <p className="mb-2 text-[13px]" style={{ color: T.danger }}>
            {error}
          </p>
          <button
            type="button"
            onClick={() => load(selectedId)}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold"
            style={{ color: T.primary }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}

      {selectedId && !loading && !error && (
        <>
          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { key: "custom" as const, label: "Custom actions", icon: Wand2 },
              { key: "code" as const, label: "Code methods", icon: Code2 },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[12.5px] font-semibold"
                style={{
                  borderColor: tab === key ? T.primary : T.primaryBord,
                  background: tab === key ? T.primary : T.cardBg,
                  color: tab === key ? "#ffffff" : T.textMain,
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* ── Custom actions ── */}
          {tab === "custom" && (
            <>
              {/* ── Ask AI ── proposes a config from the real catalogue. Never
                  writes: the proposal lands in the form below for review. */}
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: T.primaryBord, background: T.primaryBg }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" style={{ color: T.primary }} />
                  <p
                    className="text-[13px] font-bold"
                    style={{ color: T.textMain }}
                  >
                    Ask AI
                  </p>
                </div>
                <p className="mb-3 text-[12px]" style={{ color: T.textMuted }}>
                  Describe the action in plain words. The agent reads this data
                  source's models and columns and proposes a configuration —
                  nothing is created until you review it.
                </p>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !aiBusy) askAi();
                    }}
                    placeholder="credit 10 points to the wallet belonging to that user"
                    className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={askAi}
                    disabled={aiBusy || !aiPrompt.trim() || !selectedId}
                    className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-4 text-[13px] font-semibold text-white disabled:opacity-40"
                    style={{ background: T.primary }}
                  >
                    {aiBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Ask AI
                  </button>
                </div>

                {aiResult && (
                  <div
                    className="mt-3 rounded-xl border p-3"
                    style={{
                      borderColor: aiResult.success ? T.done : "#fecaca",
                      background: T.cardBg,
                    }}
                  >
                    {aiResult.payload && (
                      <>
                        <p
                          className="text-[13px] font-bold"
                          style={{ color: T.textMain }}
                        >
                          {aiResult.payload.name}
                          <span
                            className="ml-2 rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
                            style={{
                              background: T.primaryBg,
                              color: T.textMuted,
                            }}
                          >
                            {aiResult.payload.kind}
                          </span>
                          {aiResult.payload.writesData && (
                            <span
                              className="ml-1 inline-flex items-center gap-1 text-[10.5px] font-semibold"
                              style={{ color: T.warn }}
                            >
                              <AlertTriangle className="h-3 w-3" />
                              writes data
                            </span>
                          )}
                        </p>
                        <pre
                          className="mt-2 overflow-x-auto rounded-lg p-2 text-[11px]"
                          style={{
                            background: T.primaryBg,
                            color: T.textMuted,
                          }}
                        >
                          {JSON.stringify(aiResult.payload.config, null, 2)}
                        </pre>
                      </>
                    )}

                    {aiResult.explanation && (
                      <p
                        className="mt-2 text-[12px]"
                        style={{ color: T.textMuted }}
                      >
                        {aiResult.explanation}
                        {aiResult.confidence && (
                          <span
                            className="ml-1 font-semibold"
                            style={{
                              color:
                                aiResult.confidence === "high"
                                  ? T.done
                                  : T.warn,
                            }}
                          >
                            ({aiResult.confidence} confidence)
                          </span>
                        )}
                      </p>
                    )}

                    {aiResult.errors.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {aiResult.errors.map((err) => (
                          <li
                            key={err}
                            className="text-[12px]"
                            style={{ color: T.danger }}
                          >
                            • {err}
                          </li>
                        ))}
                      </ul>
                    )}

                    {aiResult.success && (
                      <button
                        type="button"
                        onClick={applyAiProposal}
                        className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[12px] font-semibold text-white"
                        style={{ background: T.done }}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Use this — load into the form
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div
                className="rounded-xl border p-4"
                style={{ borderColor: T.borderLgt, background: T.cardBg }}
              >
                <p
                  className="mb-3 text-[13px] font-bold"
                  style={{ color: T.textMain }}
                >
                  New custom action
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span
                      className="mb-1 block text-[11.5px]"
                      style={{ color: T.textMuted }}
                    >
                      Name
                    </span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Credit 10 points"
                      className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                      style={inputStyle}
                    />
                  </label>

                  <label className="block">
                    <span
                      className="mb-1 block text-[11.5px]"
                      style={{ color: T.textMuted }}
                    >
                      Kind
                    </span>
                    <select
                      value={kind}
                      onChange={(e) => {
                        setKind(e.target.value);
                        setConfig({});
                      }}
                      className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                      style={inputStyle}
                    >
                      {kinds.map((k) => (
                        <option key={k.kind} value={k.kind}>
                          {k.kind}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span
                      className="mb-1 block text-[11.5px]"
                      style={{ color: T.textMuted }}
                    >
                      Bucket (optional)
                    </span>
                    <select
                      value={bucketId}
                      onChange={(e) => setBucketId(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                      style={inputStyle}
                    >
                      <option value="">Whole data source</option>
                      {buckets.map((b) => (
                        <option key={b.id} value={String(b.id)}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span
                      className="mb-1 block text-[11.5px]"
                      style={{ color: T.textMuted }}
                    >
                      Tie to model (optional)
                    </span>
                    <select
                      value={modelId}
                      onChange={(e) => setModelId(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                      style={inputStyle}
                    >
                      <option value="">Any model in scope</option>
                      {models.map((m) => (
                        <option key={m.id} value={String(m.id)}>
                          {m.displayName}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {selectedKind && (
                  <>
                    <p
                      className="mt-3 text-[11.5px]"
                      style={{ color: T.textMuted }}
                    >
                      {selectedKind.description}
                    </p>
                    {selectedKind.writesData && (
                      <p
                        className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-semibold"
                        style={{ color: T.warn }}
                      >
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Writes to your data. Internal models only.
                      </p>
                    )}

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {selectedKind.requiredConfigKeys.map((key) => (
                        <label key={key} className="block">
                          <span
                            className="mb-1 block text-[11.5px]"
                            style={{ color: T.textMuted }}
                          >
                            {key}
                          </span>
                          <input
                            value={config[key] ?? ""}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                            placeholder={PLACEHOLDERS[key] ?? ""}
                            className="w-full rounded-xl border px-3 py-2 font-mono text-[12.5px] outline-none"
                            style={inputStyle}
                          />
                        </label>
                      ))}
                      <label className="block sm:col-span-2">
                        <span
                          className="mb-1 block text-[11.5px]"
                          style={{ color: T.textMuted }}
                        >
                          match (optional) — how to find the related record
                        </span>
                        <input
                          value={config.match ?? ""}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              match: e.target.value,
                            }))
                          }
                          placeholder="user_id={{user_id}}"
                          className="w-full rounded-xl border px-3 py-2 font-mono text-[12.5px] outline-none"
                          style={inputStyle}
                        />
                      </label>
                    </div>

                    <p
                      className="mt-2 text-[11px]"
                      style={{ color: T.textMuted }}
                    >
                      Use <code>{"{{field}}"}</code> for a value off the
                      triggering record, <code>{"{{target.field}}"}</code> for
                      the record being written to. Arithmetic works:{" "}
                      <code>{"{{quantity}} * {{unit_price}} * 0.1"}</code>
                    </p>
                  </>
                )}

                <button
                  type="button"
                  onClick={submitCustomAction}
                  disabled={busy || !name.trim()}
                  className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-xl px-4 text-[13px] font-semibold text-white disabled:opacity-40"
                  style={{ background: T.primary }}
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Create action
                </button>
              </div>

              <div
                className="rounded-xl border p-4"
                style={{ borderColor: T.borderLgt, background: T.cardBg }}
              >
                <p
                  className="mb-3 text-[13px] font-bold"
                  style={{ color: T.textMain }}
                >
                  Custom actions ({actions.length})
                </p>
                {actions.length === 0 ? (
                  <p
                    className="py-4 text-center text-[12.5px]"
                    style={{ color: T.textMuted }}
                  >
                    None yet.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {actions.map((action) => (
                      <div
                        key={action.id}
                        className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
                        style={{
                          borderColor: action.registered ? T.done : T.borderLgt,
                          background: action.registered ? "#f2fbf8" : T.cardBg,
                        }}
                      >
                        <Wand2
                          className="h-4 w-4 shrink-0"
                          style={{
                            color: action.registered ? T.done : T.textMuted,
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate text-[13px] font-semibold"
                            style={{ color: T.textMain }}
                          >
                            {action.name}
                          </p>
                          <p
                            className="text-[11.5px]"
                            style={{ color: T.textMuted }}
                          >
                            {action.kind}
                            {action.bucketName && ` · ${action.bucketName}`}
                            {action.modelName && ` · ${action.modelName}`}
                            {action.writesData && " · writes data"}
                          </p>
                        </div>
                        {action.registered ? (
                          <span
                            className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                            style={{ background: T.done }}
                          >
                            <Check className="h-3 w-3" />
                            Registered
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => publish(action)}
                            disabled={busy}
                            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[12px] font-semibold text-white disabled:opacity-40"
                            style={{ background: T.primary }}
                          >
                            Register
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => remove(action)}
                          disabled={busy}
                          className="rounded-lg p-1.5 hover:bg-[#f6f4ee]"
                          aria-label={`Delete ${action.name}`}
                        >
                          <Trash2
                            className="h-4 w-4"
                            style={{ color: T.danger }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Code methods ── */}
          {tab === "code" && (
            <div
              className="rounded-xl border p-4"
              style={{ borderColor: T.borderLgt, background: T.cardBg }}
            >
              <p
                className="mb-1 text-[13px] font-bold"
                style={{ color: T.textMain }}
              >
                Register a code method
              </p>
              <p className="mb-3 text-[12.5px]" style={{ color: T.textMuted }}>
                Public methods only — a rule invokes them with public_send, so a
                private method would fail silently at run time.
                {internalModels.some((m) => !m.resolvable) && (
                  <>
                    {" "}
                    Models marked <em>no Ruby class</em> are catalogued tables
                    with no model behind them (log or join tables); nothing can
                    be registered against them.
                  </>
                )}
              </p>

              <select
                value={methodModelId}
                onChange={(e) => {
                  setMethodModelId(e.target.value);
                  if (e.target.value) loadMethods(e.target.value);
                  else setMethods([]);
                }}
                className="mb-3 w-full rounded-xl border px-3 py-2 text-sm outline-none"
                style={inputStyle}
              >
                <option value="">
                  {internalModels.length === 0
                    ? "No internal models on this data source"
                    : "Select a model"}
                </option>
                {internalModels.map((m) => (
                  <option
                    key={m.id}
                    value={String(m.id)}
                    disabled={!m.resolvable}
                  >
                    {m.displayName} ({m.lockModelName})
                    {m.resolvable
                      ? m.modelClassName && m.modelClassName !== m.lockModelName
                        ? ` → ${m.modelClassName}`
                        : ""
                      : " — no Ruby class"}
                  </option>
                ))}
              </select>

              {methodsLoading && (
                <div
                  className="flex items-center gap-2 py-4 text-[13px]"
                  style={{ color: T.textMuted }}
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Reading methods...
                </div>
              )}

              {!methodsLoading && methodModelId && methods.length === 0 && (
                <p
                  className="py-4 text-center text-[12.5px]"
                  style={{ color: T.textMuted }}
                >
                  No public methods defined on this model.
                </p>
              )}

              {!methodsLoading && methods.length > 0 && (
                <div className="max-h-96 space-y-1.5 overflow-y-auto">
                  {methods.map((method) => (
                    <div
                      key={`${method.name}-${method.classMethod}`}
                      className="flex items-center gap-3 rounded-lg border px-3 py-2"
                      style={{
                        borderColor: method.risky ? "#fecaca" : T.borderLgt,
                        background: method.risky ? "#fef2f2" : T.cardBg,
                      }}
                    >
                      <Code2
                        className="h-3.5 w-3.5 shrink-0"
                        style={{ color: method.risky ? T.danger : T.textMuted }}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate font-mono text-[12.5px] font-semibold"
                          style={{ color: T.textMain }}
                        >
                          {method.classMethod ? "self." : ""}
                          {method.name}
                          {method.parameters.length > 0 &&
                            `(${method.parameters.map((p) => p.name).join(", ")})`}
                        </p>
                        {method.risky && (
                          <p
                            className="inline-flex items-center gap-1 text-[11px] font-semibold"
                            style={{ color: T.danger }}
                          >
                            <AlertTriangle className="h-3 w-3" />
                            Destructive — registering this lets a rule call it
                          </p>
                        )}
                      </div>
                      {method.registered ? (
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold text-white"
                          style={{ background: T.done }}
                        >
                          registered
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => registerMethod(method)}
                          disabled={busy}
                          className="shrink-0 rounded-lg px-2.5 py-1 text-[11.5px] font-semibold text-white disabled:opacity-40"
                          style={{ background: T.primary }}
                        >
                          Register
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Hints per config key, so the form explains itself without a manual.
const PLACEHOLDERS: Record<string, string> = {
  target_model: "Wallet",
  field: "complimentary_points",
  value: "{{status}} or an expression",
  amount: "10 or {{points}} * 0.1",
  values: "amount=10, transaction_type=credit",
  url: "https://example.com/hook",
  method: "POST",
  to: "{{email}}",
  subject: "Points credited",
};

export default ConfigureActionTab;
