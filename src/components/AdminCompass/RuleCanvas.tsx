import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  Zap,
  GitBranch,
  Play,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  ACTION_TYPES,
  CONDITION_TYPES,
  OPERATORS,
  createRule,
  fetchApplicableModels,
  fetchAttributes,
  fetchFunctions,
  fetchFunctionsForModel,
  askRuleAgent,
  fetchAvailableModelDatasource,
  fetchDataSources,
  fetchTenantBuckets,
  fetchRule,
  operatorSymbol,
  updateRule,
  type ApplicableModel,
  type AttributeOption,
  type FunctionOption,
  type RuleFunction,
  type DataSourceOption,
  type TenantBucket,
  type Rule,
  type RuleAction,
  type RuleCondition,
} from "@/services/ruleEngineAPI";

// Admin Compass design tokens — matches the Rule Engine / Data Source pages.
const T = {
  primary: "#DA7756",
  primaryHov: "#c9673f",
  primaryBg: "#fdf9f7",
  primaryBord: "#e8e3de",
  pageBg: "#f6f4ee",
  cardBg: "#ffffff",
  textMain: "#1a1a1a",
  textMuted: "#6b7280",
  borderLgt: "#ebebeb",
  trigger: "#6b9bcc",
  condition: "#edc488",
  action: "#798c5e",
  danger: "#e7848e",
};

const inputStyle = {
  borderColor: T.primaryBord,
  color: T.textMain,
  background: T.cardBg,
};

// ── Canvas geometry ───────────────────────────────────────────────────────
// Nodes are laid out deterministically: the trigger on the left, conditions in
// a column, actions in a column to their right. The backend has no column for
// node coordinates, so positions are derived on every load rather than
// persisted — dragging is a working convenience, not saved state.
const NODE_W = 260;
const NODE_H = 132;
const COL_GAP = 150;
const ROW_GAP = 40;
const ORIGIN_X = 60;
const ORIGIN_Y = 60;

const COL_X = {
  trigger: ORIGIN_X,
  condition: ORIGIN_X + NODE_W + COL_GAP,
  action: ORIGIN_X + (NODE_W + COL_GAP) * 2,
};

type NodeKind = "trigger" | "condition" | "action";

interface CanvasNode {
  /** Stable client-side key. Server ids live on the underlying row. */
  key: string;
  kind: NodeKind;
  x: number;
  y: number;
}

const stackY = (index: number) => ORIGIN_Y + index * (NODE_H + ROW_GAP);

/** Fresh rows for the "add node" buttons. */
const blankCondition = (
  applicableModelId: number | null,
  actionType: string
): RuleCondition => ({
  conditionAttribute: "",
  operator: "equals",
  compareValue: "",
  conditionSelectedModel: applicableModelId,
  conditionType: "AND",
  actionType,
});

const blankAction = (model: ApplicableModel | null): RuleAction => ({
  lockModelName: model?.lockModelName ?? "",
  actionMethod: "",
  availableFunctionId: null,
  customActionId: null,
  actionSelectedModel: model?.availableModelId ?? null,
  applicableModelId: model?.id ?? null,
  parameters: [],
});

interface RuleCanvasProps {
  /** Omit to start a new rule. */
  ruleId?: number | null;
  onBack: () => void;
  onSaved?: (rule: Rule) => void;
}

export const RuleCanvas = ({ ruleId, onBack, onSaved }: RuleCanvasProps) => {
  // ── Rule state ──
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [modelId, setModelId] = useState<number | null>(null); // AvailableModel id
  const [conditions, setConditions] = useState<RuleCondition[]>([]);
  const [actions, setActions] = useState<RuleAction[]>([]);
  const [removedConditionIds, setRemovedConditionIds] = useState<number[]>([]);
  const [removedActionIds, setRemovedActionIds] = useState<number[]>([]);
  const [savedId, setSavedId] = useState<number | null>(ruleId ?? null);

  // ── Catalogue ──
  const [models, setModels] = useState<ApplicableModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [attributes, setAttributes] = useState<AttributeOption[]>([]);
  const [attributesLoading, setAttributesLoading] = useState(false);
  const [datasources, setDatasources] = useState<DataSourceOption[]>([]);
  const [datasourcesLoading, setDatasourcesLoading] = useState(true);
  // "" until a source is picked. Nothing about the data source is stored on the
  // rule — it only scopes which models can be chosen.
  const [datasourceId, setDatasourceId] = useState<string>("");

  // Buckets published to this tenant on the chosen data source. Optional: when
  // no bucket is picked the model list comes from tenant_models exactly as
  // before. Picking one narrows the models to that product module, and the rule
  // records which bucket it was built under.
  const [buckets, setBuckets] = useState<TenantBucket[]>([]);
  const [bucketsLoading, setBucketsLoading] = useState(false);
  const [bucketId, setBucketId] = useState<number | null>(null);
  // An existing rule's data source is resolved from its model exactly once.
  // Guards that from re-running and fighting a manual change.
  const datasourceDerived = useRef(false);

  const [loading, setLoading] = useState(Boolean(ruleId));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Canvas view ──
  const [selected, setSelected] = useState<string>("trigger");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragOffsets, setDragOffsets] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const surfaceRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<
    | {
        type: "pan";
        startX: number;
        startY: number;
        originX: number;
        originY: number;
      }
    | {
        type: "node";
        key: string;
        startX: number;
        startY: number;
        originX: number;
        originY: number;
      }
    | null
  >(null);

  /** The model the rule is written against, resolved from the AvailableModel id. */
  // With a bucket picked, the models come from inside it. Their `id` is the
  // BUCKET's applicable-row id -- one row covers the whole bucket -- which is
  // what a condition must store in condition_selected_model for the executor to
  // match it.
  const bucketModels = useMemo(() => {
    const bucket = buckets.find((b) => b.bucketId === bucketId);
    if (!bucket) return [];
    return bucket.models.map((m) => ({
      id: bucket.id,
      availableModelId: m.availableModelId,
      displayName: m.displayName,
      lockModelName: m.lockModelName,
      type: m.type,
      datasourceId: m.datasourceId,
      active: bucket.active,
    }));
  }, [buckets, bucketId]);

  // A data source that has buckets was configured module-wise, so the bucket is
  // a REQUIRED step here and the model list stays empty until one is picked.
  // A source with no buckets is whole-source and behaves exactly as before.
  const isModuleWise = buckets.length > 0;

  // Registered actions for the selected model: its own code methods plus the
  // custom actions registered against it or its bucket. This is what the Method
  // field offers -- typing a name by hand only failed at run time, silently,
  // because an unregistered method is refused inside the executor's rescue.
  const [functions, setFunctions] = useState<RuleFunction[]>([]);
  const [functionsLoading, setFunctionsLoading] = useState(false);

  // ── Ask AI ─────────────────────────────────────────────────────────────
  // Preview only. Creating a rule immediately back-fills across every matching
  // record, so the agent proposes and the canvas is populated for review; the
  // existing Save is what actually writes.
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiNote, setAiNote] = useState<string | null>(null);

  const askAi = async () => {
    if (!aiPrompt.trim()) return toast.error("Describe the rule you want");
    if (!datasourceId) return toast.error("Pick a data source first");
    setAiBusy(true);
    setAiNote(null);
    try {
      const result = await askRuleAgent({
        prompt: aiPrompt.trim(),
        datasourceId,
        bucketId: bucketId ? Number(bucketId) : null,
        persist: false,
      });
      if (!result.success || !result.payload) {
        setAiNote(
          result.errors.join(" · ") || "The agent could not build that rule"
        );
        toast.error(result.errors[0] ?? "Could not build that rule");
        return;
      }

      const draft = result.payload;
      setName(draft.name);
      if (draft.description) setDescription(draft.description);
      if (draft.modelId) setModelId(draft.modelId);
      setConditions(
        draft.conditions.map((c) => ({
          conditionAttribute: c.conditionAttribute,
          operator: c.operator,
          compareValue: c.compareValue ?? "",
          conditionSelectedModel: c.conditionSelectedModel,
          conditionType: c.conditionType,
          actionType: c.actionType,
        })) as RuleCondition[]
      );
      setActions(
        draft.actions.map((a) => ({
          lockModelName: a.lockModelName ?? "",
          actionMethod: a.actionMethod ?? "",
          availableFunctionId: a.availableFunctionId,
          customActionId: a.customActionId,
          actionSelectedModel: draft.modelId,
          applicableModelId: a.applicableModelId,
          parameters: a.parameters,
        })) as RuleAction[]
      );
      setAiNote(
        `${result.explanation} (${result.confidence} confidence). Nothing saved yet — review and hit Save.`
      );
      toast.success("Draft loaded — review it, then Save");
      setAiPrompt("");
    } catch (e: any) {
      setAiNote(e?.message || "Ask AI failed");
      toast.error(e?.message || "Ask AI failed");
    } finally {
      setAiBusy(false);
    }
  };
  const visibleModels = isModuleWise ? bucketModels : models;

  useEffect(() => {
    const selected = visibleModels.find((m) => m.availableModelId === modelId);
    if (!selected) {
      setFunctions([]);
      return;
    }
    let cancelled = false;
    setFunctionsLoading(true);
    fetchFunctionsForModel(selected.availableModelId)
      .then((rows) => {
        if (!cancelled) setFunctions(rows);
      })
      .catch(() => {
        if (!cancelled) setFunctions([]);
      })
      .finally(() => {
        if (!cancelled) setFunctionsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [modelId, visibleModels]);

  const selectedModel = useMemo(
    () => visibleModels.find((m) => m.availableModelId === modelId) ?? null,
    [visibleModels, modelId]
  );

  // ── Load catalogue + rule ───────────────────────────────────────────────
  // The pickers form a strict chain: data source → model → attributes. Each
  // step fires only once the one before it has a value, so nothing is fetched
  // speculatively and a list can never show rows from another source.
  //
  // Step 1 — data sources, the only thing loaded up front.
  useEffect(() => {
    let cancelled = false;
    fetchDataSources()
      .then((list) => {
        if (!cancelled) setDatasources(list);
      })
      .catch((e: any) => {
        if (!cancelled)
          toast.error(e?.message || "Failed to load data sources");
      })
      .finally(() => {
        if (!cancelled) setDatasourcesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ruleId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchRule(ruleId)
      .then((rule) => {
        if (cancelled) return;
        setName(rule.name);
        setDescription(rule.description);
        setActive(rule.active);
        setModelId(rule.modelId);
        setBucketId(rule.bucketId ?? null);
        setConditions(rule.conditions);
        setActions(rule.actions);
        setSavedId(rule.id);
      })
      .catch((e: any) => {
        if (!cancelled) setError(e?.message || "Failed to load rule");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ruleId]);

  // Opening an existing rule: the rules API returns only model_id, so one
  // lookup resolves which data source that model came from. Without it the
  // picker would sit empty on a rule that already has a model.
  useEffect(() => {
    if (datasourceDerived.current || !modelId) return;
    datasourceDerived.current = true;

    let cancelled = false;
    fetchAvailableModelDatasource(modelId)
      .then((resolved) => {
        if (!cancelled && resolved != null) setDatasourceId(String(resolved));
      })
      .catch((e: any) => {
        if (!cancelled)
          toast.error(e?.message || "Could not resolve the rule's data source");
      });
    return () => {
      cancelled = true;
    };
  }, [modelId]);

  // Buckets on the chosen data source. Empty is the normal case for a
  // single-product source, and the picker hides itself when so.
  useEffect(() => {
    if (!datasourceId) {
      setBuckets([]);
      setBucketsLoading(false);
      return;
    }
    let cancelled = false;
    setBucketsLoading(true);
    fetchTenantBuckets(datasourceId)
      .then((list) => {
        if (!cancelled) setBuckets(list);
      })
      // A source with no buckets is ordinary, not an error worth a toast.
      .catch(() => {
        if (!cancelled) setBuckets([]);
      })
      .finally(() => {
        if (!cancelled) setBucketsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [datasourceId]);

  // Step 2 — models, scoped to the chosen data source. Never called without
  // one, so the list only ever holds models from that source.
  useEffect(() => {
    if (!datasourceId) {
      setModels([]);
      setModelsLoading(false);
      return;
    }

    let cancelled = false;
    setModelsLoading(true);
    fetchApplicableModels(datasourceId)
      .then((list) => {
        if (!cancelled) setModels(list);
      })
      .catch((e: any) => {
        if (!cancelled) {
          setModels([]);
          toast.error(e?.message || "Failed to load models");
        }
      })
      .finally(() => {
        if (!cancelled) setModelsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [datasourceId]);

  // Step 3 — attributes for the chosen model. Conditions read columns off that
  // model, so switching it invalidates the list.
  useEffect(() => {
    if (!modelId) {
      setAttributes([]);
      return;
    }
    let cancelled = false;
    setAttributesLoading(true);
    fetchAttributes(modelId)
      .then((list) => {
        if (!cancelled) setAttributes(list);
      })
      .catch((e: any) => {
        if (!cancelled) {
          setAttributes([]);
          toast.error(e?.message || "Failed to load attributes");
        }
      })
      .finally(() => {
        if (!cancelled) setAttributesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [modelId]);

  // ── Node graph ──────────────────────────────────────────────────────────
  const nodes = useMemo<CanvasNode[]>(() => {
    const list: CanvasNode[] = [
      { key: "trigger", kind: "trigger", x: COL_X.trigger, y: ORIGIN_Y },
    ];
    conditions.forEach((_, i) =>
      list.push({
        key: `condition-${i}`,
        kind: "condition",
        x: COL_X.condition,
        y: stackY(i),
      })
    );
    actions.forEach((_, i) =>
      list.push({
        key: `action-${i}`,
        kind: "action",
        x: COL_X.action,
        y: stackY(i),
      })
    );
    return list.map((node) => {
      const offset = dragOffsets[node.key];
      return offset
        ? { ...node, x: node.x + offset.x, y: node.y + offset.y }
        : node;
    });
  }, [conditions, actions, dragOffsets]);

  const nodeAt = useCallback(
    (key: string) => nodes.find((n) => n.key === key),
    [nodes]
  );

  /** Trigger → every condition, and every condition → every action. */
  const edges = useMemo(() => {
    const list: { from: CanvasNode; to: CanvasNode; key: string }[] = [];
    const trigger = nodeAt("trigger");
    if (!trigger) return list;

    const conditionNodes = nodes.filter((n) => n.kind === "condition");
    const actionNodes = nodes.filter((n) => n.kind === "action");

    conditionNodes.forEach((c) =>
      list.push({ from: trigger, to: c, key: `t-${c.key}` })
    );

    // With no conditions the trigger wires straight to the actions, which is
    // also how the executor behaves — though it needs at least one condition to
    // ever fire (conditions_met? returns false on an empty set).
    const sources = conditionNodes.length > 0 ? conditionNodes : [trigger];
    sources.forEach((s) =>
      actionNodes.forEach((a) =>
        list.push({ from: s, to: a, key: `${s.key}-${a.key}` })
      )
    );

    return list;
  }, [nodes, nodeAt]);

  const canvasSize = useMemo(() => {
    const maxX = Math.max(...nodes.map((n) => n.x + NODE_W), 900) + 120;
    const maxY = Math.max(...nodes.map((n) => n.y + NODE_H), 400) + 120;
    return { width: maxX, height: maxY };
  }, [nodes]);

  // ── Drag / pan ──────────────────────────────────────────────────────────
  const onSurfaceMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragRef.current = {
      type: "pan",
      startX: e.clientX,
      startY: e.clientY,
      originX: pan.x,
      originY: pan.y,
    };
  };

  const onNodeMouseDown = (e: React.MouseEvent, key: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setSelected(key);
    const offset = dragOffsets[key] ?? { x: 0, y: 0 };
    dragRef.current = {
      type: "node",
      key,
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = (e.clientX - drag.startX) / zoom;
      const dy = (e.clientY - drag.startY) / zoom;

      if (drag.type === "pan") {
        setPan({ x: drag.originX + dx * zoom, y: drag.originY + dy * zoom });
      } else {
        setDragOffsets((prev) => ({
          ...prev,
          [drag.key]: { x: drag.originX + dx, y: drag.originY + dy },
        }));
      }
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [zoom]);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setDragOffsets({});
  };

  // ── Mutations ───────────────────────────────────────────────────────────
  const patchCondition = (index: number, patch: Partial<RuleCondition>) =>
    setConditions((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...patch } : c))
    );

  const patchAction = (index: number, patch: Partial<RuleAction>) =>
    setActions((prev) =>
      prev.map((a, i) => (i === index ? { ...a, ...patch } : a))
    );

  const addCondition = () => {
    if (!selectedModel) {
      toast.error("Pick a model on the trigger first");
      return;
    }
    const actionType = conditions[0]?.actionType || "created";
    setConditions((prev) => [
      ...prev,
      blankCondition(selectedModel.id, actionType),
    ]);
    setSelected(`condition-${conditions.length}`);
  };

  const addAction = () => {
    if (!selectedModel) {
      toast.error("Pick a model on the trigger first");
      return;
    }
    setActions((prev) => [...prev, blankAction(selectedModel)]);
    setSelected(`action-${actions.length}`);
  };

  // Existing rows are queued for _destroy on the next save; unsaved ones just
  // drop out of local state.
  const removeCondition = (index: number) => {
    const row = conditions[index];
    if (row?.id) setRemovedConditionIds((prev) => [...prev, row.id!]);
    setConditions((prev) => prev.filter((_, i) => i !== index));
    setSelected("trigger");
  };

  const removeAction = (index: number) => {
    const row = actions[index];
    if (row?.id) setRemovedActionIds((prev) => [...prev, row.id!]);
    setActions((prev) => prev.filter((_, i) => i !== index));
    setSelected("trigger");
  };

  // The model list is replaced wholesale by the next fetch, so the current
  // model is cleared — keeping it would leave the rule pointing at something
  // the picker can no longer show.
  const changeDatasource = (nextId: string) => {
    datasourceDerived.current = true;
    if (nextId === datasourceId) return;
    setDatasourceId(nextId);
    setBucketId(null);
    if (modelId) changeModel(null);
  };

  // The model list is replaced when the bucket changes, so the current model is
  // cleared for the same reason changing the data source clears it.
  const changeBucket = (nextId: number | null) => {
    if (nextId === bucketId) return;
    setBucketId(nextId);
    if (modelId) changeModel(null);
  };

  // Switching the rule's model repoints every condition and action at it —
  // leaving them on the old model would save rows that can never match.
  const changeModel = (availableModelId: number | null) => {
    setModelId(availableModelId);
    const model =
      visibleModels.find((m) => m.availableModelId === availableModelId) ??
      null;
    setConditions((prev) =>
      prev.map((c) => ({
        ...c,
        conditionSelectedModel: model?.id ?? null,
        conditionAttribute: "",
      }))
    );
    setActions((prev) =>
      prev.map((a) => ({
        ...a,
        lockModelName: model?.lockModelName ?? "",
        actionSelectedModel: model?.availableModelId ?? null,
        applicableModelId: model?.id ?? null,
      }))
    );
  };

  // ── Validation + save ───────────────────────────────────────────────────
  const problems = useMemo(() => {
    const list: string[] = [];
    if (!name.trim()) list.push("Rule needs a name");
    if (isModuleWise && !bucketId) list.push("Rule needs a bucket");
    if (!modelId) list.push("Rule needs a model");
    if (conditions.length === 0) {
      // Executor#conditions_met? returns false for an empty set, so a rule with
      // no conditions never fires — worth blocking rather than saving dead.
      list.push("Add at least one condition — a rule with none never fires");
    }
    conditions.forEach((c, i) => {
      if (!c.conditionAttribute)
        list.push(`Condition ${i + 1}: pick an attribute`);
      if (!c.compareValue.trim())
        list.push(`Condition ${i + 1}: needs a value`);
    });
    actions.forEach((a, i) => {
      // A registered action is required: an unregistered method name is refused
      // by RuleEngine::Action at run time, inside a rescue, so it would fail
      // silently rather than telling anyone.
      if (!a.availableFunctionId) list.push(`Action ${i + 1}: needs an action`);
    });
    return list;
  }, [name, modelId, isModuleWise, bucketId, conditions, actions]);

  const save = async () => {
    if (problems.length > 0) {
      toast.error(problems[0]);
      return;
    }
    setSaving(true);
    try {
      const draft = {
        name: name.trim(),
        description: description.trim(),
        active,
        modelId,
        bucketId,
        conditions,
        actions,
        removedConditionIds,
        removedActionIds,
      };

      const rule = savedId
        ? await updateRule(savedId, draft)
        : await createRule(draft);

      setSavedId(rule.id);
      setConditions(rule.conditions);
      setActions(rule.actions);
      setRemovedConditionIds([]);
      setRemovedActionIds([]);
      toast.success(savedId ? "Rule updated" : "Rule created");
      onSaved?.(rule);
    } catch (e: any) {
      toast.error(e?.message || "Failed to save rule");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24">
        <Loader2
          className="h-6 w-6 animate-spin"
          style={{ color: T.primary }}
        />
        <p className="text-xs" style={{ color: T.textMuted }}>
          Loading rule...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-24 text-center"
        style={{ borderColor: T.primaryBord }}
      >
        <p className="text-sm font-medium text-red-600">{error}</p>
        <button
          onClick={onBack}
          className="mt-1 rounded-xl px-4 py-2 text-sm font-medium text-white"
          style={{ background: T.primary }}
        >
          Back to rules
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-13rem)] min-h-[520px] flex-col gap-3">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
          style={{ borderColor: T.primaryBord, color: T.textMuted }}
        >
          <ChevronLeft className="h-4 w-4" />
          Rules
        </button>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Rule name"
          className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm font-medium outline-none sm:max-w-xs"
          style={inputStyle}
        />

        <button
          onClick={addCondition}
          className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors"
          style={{ borderColor: T.condition, color: "#8a5a00" }}
        >
          <Plus className="h-3.5 w-3.5" />
          Condition
        </button>
        <button
          onClick={addAction}
          className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors"
          style={{ borderColor: T.action, color: T.action }}
        >
          <Plus className="h-3.5 w-3.5" />
          Action
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(2)))}
            className="flex h-9 w-9 items-center justify-center rounded-xl border"
            style={{ borderColor: T.primaryBord, color: T.textMuted }}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span
            className="w-12 text-center text-xs font-medium"
            style={{ color: T.textMuted }}
          >
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.1).toFixed(2)))}
            className="flex h-9 w-9 items-center justify-center rounded-xl border"
            style={{ borderColor: T.primaryBord, color: T.textMuted }}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={resetView}
            className="flex h-9 w-9 items-center justify-center rounded-xl border"
            style={{ borderColor: T.primaryBord, color: T.textMuted }}
            aria-label="Reset view"
            title="Reset view"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={save}
          disabled={saving}
          title={problems[0]}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60"
          style={{ background: T.primary }}
          onMouseEnter={(e) => {
            if (!saving) e.currentTarget.style.background = T.primaryHov;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = T.primary;
          }}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : savedId ? "Update rule" : "Save rule"}
        </button>
      </div>

      {problems.length > 0 && (
        <div
          className="rounded-xl border px-3 py-2 text-xs"
          style={{
            borderColor: "#f5d9a8",
            background: "#fdf6e7",
            color: "#8a5a00",
          }}
        >
          {problems[0]}
          {problems.length > 1 && ` (+${problems.length - 1} more)`}
        </div>
      )}

      <div className="flex min-h-0 flex-1 gap-3">
        {/* ── Canvas ── */}
        <div
          ref={surfaceRef}
          onMouseDown={onSurfaceMouseDown}
          className="relative min-w-0 flex-1 overflow-hidden rounded-[20px] border"
          style={{
            borderColor: T.primaryBord,
            background: T.pageBg,
            backgroundImage: `radial-gradient(${T.primaryBord} 1px, transparent 1px)`,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
            cursor: "grab",
          }}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
              width: canvasSize.width,
              height: canvasSize.height,
              position: "relative",
            }}
          >
            {/* Edges sit under the nodes */}
            <svg
              width={canvasSize.width}
              height={canvasSize.height}
              className="pointer-events-none absolute inset-0"
            >
              {edges.map((edge) => {
                const x1 = edge.from.x + NODE_W;
                const y1 = edge.from.y + NODE_H / 2;
                const x2 = edge.to.x;
                const y2 = edge.to.y + NODE_H / 2;
                const mid = (x1 + x2) / 2;
                return (
                  <path
                    key={edge.key}
                    d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={T.primaryBord}
                    strokeWidth={2}
                  />
                );
              })}
            </svg>

            {nodes.map((node) => {
              const isSelected = selected === node.key;
              const index = Number(node.key.split("-")[1]);
              const accent =
                node.kind === "trigger"
                  ? T.trigger
                  : node.kind === "condition"
                    ? T.condition
                    : T.action;

              return (
                <div
                  key={node.key}
                  onMouseDown={(e) => onNodeMouseDown(e, node.key)}
                  className="absolute overflow-hidden rounded-2xl border-2 shadow-sm"
                  style={{
                    left: node.x,
                    top: node.y,
                    width: NODE_W,
                    height: NODE_H,
                    background: T.cardBg,
                    borderColor: isSelected ? T.primary : T.primaryBord,
                    boxShadow: isSelected
                      ? "0 8px 24px rgba(218,119,86,0.22)"
                      : "0 4px 12px rgba(26,26,26,0.06)",
                    cursor: "grab",
                  }}
                >
                  <div
                    className="flex items-center gap-2 px-3 py-2"
                    style={{ background: `${accent}22` }}
                  >
                    {node.kind === "trigger" ? (
                      <Zap className="h-3.5 w-3.5" style={{ color: accent }} />
                    ) : node.kind === "condition" ? (
                      <GitBranch
                        className="h-3.5 w-3.5"
                        style={{ color: accent }}
                      />
                    ) : (
                      <Play className="h-3.5 w-3.5" style={{ color: accent }} />
                    )}
                    <span
                      className="flex-1 truncate text-[11px] font-bold uppercase tracking-wide"
                      style={{ color: T.textMain }}
                    >
                      {node.kind === "trigger"
                        ? "Trigger"
                        : node.kind === "condition"
                          ? `Condition ${index + 1}`
                          : `Action ${index + 1}`}
                    </span>
                    {node.kind !== "trigger" && (
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() =>
                          node.kind === "condition"
                            ? removeCondition(index)
                            : removeAction(index)
                        }
                        className="rounded p-0.5"
                        aria-label="Delete node"
                      >
                        <X
                          className="h-3.5 w-3.5"
                          style={{ color: T.textMuted }}
                        />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 px-3 py-2">
                    <NodeBody
                      kind={node.kind}
                      index={index}
                      name={name}
                      model={selectedModel}
                      condition={conditions[index]}
                      action={actions[index]}
                      attributes={attributes}
                      active={active}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Inspector ── */}
        <div
          className="hidden w-80 shrink-0 overflow-y-auto rounded-[20px] border p-4 lg:block"
          style={{ borderColor: T.primaryBord, background: T.cardBg }}
        >
          {selected === "trigger" ? (
            <TriggerInspector
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              active={active}
              setActive={setActive}
              modelId={modelId}
              onModelChange={changeModel}
              models={visibleModels}
              modelsLoading={modelsLoading}
              buckets={buckets}
              bucketsLoading={bucketsLoading}
              isModuleWise={isModuleWise}
              aiPrompt={aiPrompt}
              onAiPromptChange={setAiPrompt}
              onAskAi={askAi}
              aiBusy={aiBusy}
              aiNote={aiNote}
              bucketId={bucketId}
              onBucketChange={changeBucket}
              datasourceId={datasourceId}
              onDatasourceChange={changeDatasource}
              datasourceOptions={datasources}
              datasourcesLoading={datasourcesLoading}
              actionType={conditions[0]?.actionType || "created"}
              onActionTypeChange={(value) =>
                setConditions((prev) =>
                  prev.map((c) => ({ ...c, actionType: value }))
                )
              }
            />
          ) : selected.startsWith("condition-") ? (
            <ConditionInspector
              index={Number(selected.split("-")[1])}
              condition={conditions[Number(selected.split("-")[1])]}
              attributes={attributes}
              attributesLoading={attributesLoading}
              model={selectedModel}
              onChange={patchCondition}
              onRemove={removeCondition}
            />
          ) : selected.startsWith("action-") ? (
            <ActionInspector
              index={Number(selected.split("-")[1])}
              action={actions[Number(selected.split("-")[1])]}
              model={selectedModel}
              functions={functions}
              functionsLoading={functionsLoading}
              onChange={patchAction}
              onRemove={removeAction}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

// ── Node body ─────────────────────────────────────────────────────────────

const NodeBody = ({
  kind,
  index,
  name,
  model,
  condition,
  action,
  attributes,
  active,
}: {
  kind: NodeKind;
  index: number;
  name: string;
  model: ApplicableModel | null;
  condition?: RuleCondition;
  action?: RuleAction;
  attributes: AttributeOption[];
  active: boolean;
}) => {
  if (kind === "trigger") {
    return (
      <>
        <p
          className="truncate text-sm font-semibold"
          style={{ color: T.textMain }}
        >
          {name || "Untitled rule"}
        </p>
        <p className="truncate text-xs" style={{ color: T.textMuted }}>
          {model ? model.displayName : "No model selected"}
        </p>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
            active
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>
      </>
    );
  }

  if (kind === "condition" && condition) {
    const label =
      attributes.find((a) => a.attributeName === condition.conditionAttribute)
        ?.displayName || condition.conditionAttribute;
    return (
      <>
        <span
          className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ background: `${T.condition}33`, color: "#8a5a00" }}
        >
          {condition.conditionType}
        </span>
        <p
          className="truncate text-sm font-semibold"
          style={{ color: T.textMain }}
        >
          {label || "Pick an attribute"}
        </p>
        <p className="truncate text-xs" style={{ color: T.textMuted }}>
          {operatorSymbol(condition.operator)}{" "}
          {condition.compareValue || <em>no value</em>}
        </p>
      </>
    );
  }

  if (kind === "action" && action) {
    return (
      <>
        <p
          className="truncate text-sm font-semibold"
          style={{ color: T.textMain }}
        >
          {action.actionMethod || "Set a method"}
        </p>
        <p className="truncate text-xs" style={{ color: T.textMuted }}>
          {action.lockModelName || "No model"}
        </p>
        {action.parameters.length > 0 && (
          <p className="truncate text-[11px]" style={{ color: T.textMuted }}>
            {action.parameters.length} parameter(s)
          </p>
        )}
      </>
    );
  }

  return null;
};

// ── Inspectors ────────────────────────────────────────────────────────────

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="mb-3 flex flex-col gap-1.5">
    <label className="text-xs font-medium" style={{ color: T.textMain }}>
      {label}
    </label>
    {children}
    {hint && (
      <span className="text-[11px]" style={{ color: T.textMuted }}>
        {hint}
      </span>
    )}
  </div>
);

const InspectorTitle = ({
  title,
  onRemove,
}: {
  title: string;
  onRemove?: () => void;
}) => (
  <div className="mb-3 flex items-center justify-between">
    <h4 className="text-sm font-semibold" style={{ color: T.textMain }}>
      {title}
    </h4>
    {onRemove && (
      <button
        onClick={onRemove}
        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs"
        style={{ color: T.danger }}
      >
        <Trash2 className="h-3.5 w-3.5" />
        Remove
      </button>
    )}
  </div>
);

const TriggerInspector = ({
  name,
  setName,
  description,
  setDescription,
  active,
  setActive,
  modelId,
  onModelChange,
  models,
  modelsLoading,
  buckets,
  bucketsLoading,
  isModuleWise,
  bucketId,
  onBucketChange,
  datasourceId,
  onDatasourceChange,
  datasourceOptions,
  datasourcesLoading,
  actionType,
  onActionTypeChange,
  aiPrompt,
  onAiPromptChange,
  onAskAi,
  aiBusy,
  aiNote,
}: {
  name: string;
  setName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  active: boolean;
  setActive: (v: boolean) => void;
  modelId: number | null;
  onModelChange: (v: number | null) => void;
  models: ApplicableModel[];
  buckets: TenantBucket[];
  bucketsLoading: boolean;
  isModuleWise: boolean;
  bucketId: number | null;
  onBucketChange: (v: number | null) => void;
  modelsLoading: boolean;
  datasourceId: string;
  onDatasourceChange: (v: string) => void;
  datasourceOptions: DataSourceOption[];
  datasourcesLoading: boolean;
  actionType: string;
  onActionTypeChange: (v: string) => void;
  aiPrompt: string;
  onAiPromptChange: (v: string) => void;
  onAskAi: () => void;
  aiBusy: boolean;
  aiNote: string | null;
}) => (
  <div>
    {/* ── Ask AI ── proposes a whole rule from the tenant's catalogue and its
        REGISTERED actions. Populates the canvas; Save is still what writes. */}
    <div
      className="mb-4 rounded-xl border p-3"
      style={{ borderColor: T.primaryBord, background: T.pageBg }}
    >
      <div className="mb-1 flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5" style={{ color: T.primary }} />
        <span className="text-[12.5px] font-bold" style={{ color: T.textMain }}>
          Ask AI
        </span>
      </div>
      <p className="mb-2 text-[11.5px]" style={{ color: T.textMuted }}>
        Describe the rule. Nothing is saved until you review and hit Save.
      </p>
      <div className="flex gap-1.5">
        <input
          value={aiPrompt}
          onChange={(e) => onAiPromptChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !aiBusy) onAskAi();
          }}
          placeholder="when a user is created, run test_user"
          disabled={!datasourceId}
          className="min-w-0 flex-1 rounded-xl border px-2.5 py-1.5 text-[12.5px] outline-none disabled:opacity-60"
          style={inputStyle}
        />
        <button
          type="button"
          onClick={onAskAi}
          disabled={aiBusy || !aiPrompt.trim() || !datasourceId}
          className="inline-flex shrink-0 items-center gap-1 rounded-xl px-3 text-[12px] font-semibold text-white disabled:opacity-40"
          style={{ background: T.primary }}
        >
          {aiBusy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          Ask
        </button>
      </div>
      {aiNote && (
        <p className="mt-2 text-[11.5px]" style={{ color: T.textMuted }}>
          {aiNote}
        </p>
      )}
    </div>

    <InspectorTitle title="Trigger" />

    <Field label="Rule name">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
        style={inputStyle}
      />
    </Field>

    <Field label="Description">
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none"
        style={inputStyle}
      />
    </Field>

    <Field label="Data source" hint="Pick one to load its models.">
      <select
        value={datasourceId}
        onChange={(e) => onDatasourceChange(e.target.value)}
        disabled={datasourcesLoading}
        className="w-full rounded-xl border px-3 py-2 text-sm outline-none disabled:opacity-60"
        style={inputStyle}
      >
        <option value="">
          {datasourcesLoading
            ? "Loading data sources..."
            : datasourceOptions.length === 0
              ? "No data sources available"
              : "Select a data source"}
        </option>
        {datasourceOptions.map((option) => (
          <option key={option.id} value={String(option.id)}>
            {option.name}
          </option>
        ))}
      </select>
    </Field>

    {/* Only shown when the data source actually has buckets published to this
        tenant. A single-product source has none, and the form stays exactly as
        it was before buckets existed. */}
    {datasourceId && (bucketsLoading || isModuleWise) && (
      <Field
        label="Bucket"
        hint="This data source is segregated module-wise — pick the module, then a model inside it."
      >
        <select
          value={bucketId ?? ""}
          onChange={(e) =>
            onBucketChange(e.target.value ? Number(e.target.value) : null)
          }
          disabled={bucketsLoading}
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none disabled:opacity-60"
          style={inputStyle}
        >
          <option value="">
            {bucketsLoading ? "Loading buckets..." : "Select a bucket"}
          </option>
          {buckets.map((bucket) => (
            <option key={bucket.bucketId} value={bucket.bucketId}>
              {bucket.name} ({bucket.models.length})
            </option>
          ))}
        </select>
      </Field>
    )}

    {/* Stays disabled until a data source is chosen — the models endpoint is
        not called before then, so there is nothing to offer. */}
    <Field
      label="Model"
      hint="Models made applicable for this tenant in Data Source → Configuration."
    >
      <select
        value={modelId ?? ""}
        onChange={(e) =>
          onModelChange(e.target.value ? Number(e.target.value) : null)
        }
        disabled={!datasourceId || modelsLoading || (isModuleWise && !bucketId)}
        className="w-full rounded-xl border px-3 py-2 text-sm outline-none disabled:opacity-60"
        style={inputStyle}
      >
        <option value="">
          {!datasourceId
            ? "Select a data source first"
            : isModuleWise && !bucketId
              ? "Select a bucket first"
              : modelsLoading
                ? "Loading models..."
                : models.length === 0
                  ? bucketId
                    ? "No models in this bucket"
                    : "No applicable models for this data source"
                  : "Select a model"}
        </option>
        {models.map((model) => (
          <option key={model.id} value={model.availableModelId}>
            {model.displayName}
          </option>
        ))}
      </select>
    </Field>

    <Field label="Runs on" hint="Stored on each condition as action_type.">
      <select
        value={actionType}
        onChange={(e) => onActionTypeChange(e.target.value)}
        className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
        style={inputStyle}
      >
        {ACTION_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </Field>

    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={active}
        onChange={(e) => setActive(e.target.checked)}
        className="h-4 w-4 cursor-pointer accent-[#DA7756]"
      />
      <span className="text-sm" style={{ color: T.textMain }}>
        Rule is active
      </span>
    </label>
  </div>
);

const ConditionInspector = ({
  index,
  condition,
  attributes,
  attributesLoading,
  model,
  onChange,
  onRemove,
}: {
  index: number;
  condition?: RuleCondition;
  attributes: AttributeOption[];
  attributesLoading: boolean;
  model: ApplicableModel | null;
  onChange: (index: number, patch: Partial<RuleCondition>) => void;
  onRemove: (index: number) => void;
}) => {
  if (!condition) return null;

  return (
    <div>
      <InspectorTitle
        title={`Condition ${index + 1}`}
        onRemove={() => onRemove(index)}
      />

      <Field
        label="Model"
        hint="Follows the rule's model — change it on the trigger."
      >
        <input
          value={model?.displayName ?? "—"}
          readOnly
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
          style={{ ...inputStyle, background: T.pageBg, color: T.textMuted }}
        />
      </Field>

      <Field label="Attribute" hint="Saved as the original column name.">
        <select
          value={condition.conditionAttribute}
          onChange={(e) =>
            onChange(index, { conditionAttribute: e.target.value })
          }
          disabled={attributesLoading || attributes.length === 0}
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none disabled:opacity-60"
          style={inputStyle}
        >
          <option value="">
            {!model
              ? "Select a model first"
              : attributesLoading
                ? "Loading attributes..."
                : attributes.length === 0
                  ? "No attributes for this model"
                  : "Select an attribute"}
          </option>
          {attributes.map((attribute) => (
            <option key={attribute.id} value={attribute.attributeName}>
              {attribute.displayName}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Operator">
        <select
          value={condition.operator}
          onChange={(e) => onChange(index, { operator: e.target.value })}
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
          style={inputStyle}
        >
          {OPERATORS.map((operator) => (
            <option key={operator.value} value={operator.value}>
              {operator.symbol} {operator.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Value"
        hint="Compared after casting to the attribute's own type."
      >
        <input
          value={condition.compareValue}
          onChange={(e) => onChange(index, { compareValue: e.target.value })}
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
          style={inputStyle}
        />
      </Field>

      <Field
        label="Join"
        hint="All ANDs must match; at least one OR must match."
      >
        <select
          value={condition.conditionType}
          onChange={(e) => onChange(index, { conditionType: e.target.value })}
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
          style={inputStyle}
        >
          {CONDITION_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
};

const ActionInspector = ({
  index,
  action,
  model,
  functions,
  functionsLoading,
  onChange,
  onRemove,
}: {
  index: number;
  action?: RuleAction;
  model: ApplicableModel | null;
  functions: RuleFunction[];
  functionsLoading: boolean;
  onChange: (index: number, patch: Partial<RuleAction>) => void;
  onRemove: (index: number) => void;
}) => {
  if (!action) return null;

  const selectedFunction =
    functions.find((f) => f.id === action.availableFunctionId) ?? null;

  const setParameter = (i: number, value: string) =>
    onChange(index, {
      parameters: action.parameters.map((p, pi) => (pi === i ? value : p)),
    });

  return (
    <div>
      <InspectorTitle
        title={`Action ${index + 1}`}
        onRemove={() => onRemove(index)}
      />

      <Field
        label="Model"
        hint="Follows the rule's model — change it on the trigger."
      >
        <input
          value={model?.displayName ?? "—"}
          readOnly
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
          style={{ ...inputStyle, background: T.pageBg, color: T.textMuted }}
        />
      </Field>

      <Field
        label="Method"
        hint={
          functionsLoading
            ? "Loading registered actions..."
            : functions.length === 0
              ? "Nothing registered on this model yet — register a method or custom action under Configure Action."
              : `Only registered actions can run. Called on ${action.lockModelName || "the model"}.`
        }
      >
        <select
          value={action.availableFunctionId ?? ""}
          onChange={(e) => {
            const id = e.target.value ? Number(e.target.value) : null;
            const picked = functions.find((f) => f.id === id) ?? null;
            onChange(index, {
              availableFunctionId: id,
              // action_method still carries the method for a code function; a
              // custom action's slug is set by the backend, so it is not typed
              // (or even seen) here.
              actionMethod:
                picked && picked.functionType === "code"
                  ? picked.functionName
                  : "",
              customActionId: picked?.customActionId ?? null,
              // Seed the parameter slots from what the method actually takes,
              // so the Parameters field stops being a guess.
              parameters:
                picked && picked.parametersSpec.length > 0
                  ? picked.parametersSpec.map(() => "")
                  : [],
            });
          }}
          disabled={functionsLoading || functions.length === 0}
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none disabled:opacity-60"
          style={inputStyle}
        >
          <option value="">
            {functionsLoading
              ? "Loading..."
              : functions.length === 0
                ? "No registered actions"
                : "Select an action"}
          </option>
          {functions.map((fn) => (
            <option key={fn.id} value={fn.id}>
              {fn.displayName}
              {fn.functionType === "custom" ? "  · custom" : ""}
              {fn.writesData ? "  · writes data" : ""}
            </option>
          ))}
        </select>
      </Field>

      {selectedFunction && selectedFunction.parametersSpec.length > 0 && (
        <p className="-mt-2 text-[11.5px]" style={{ color: T.textMuted }}>
          Expects:{" "}
          {selectedFunction.parametersSpec
            .map((p) => `${p.name}${p.required ? "" : "?"}`)
            .join(", ")}
        </p>
      )}

      <Field
        label="Parameters"
        hint='Passed positionally. "context:user" is swapped for the run context value.'
      >
        <div className="flex flex-col gap-2">
          {action.parameters.map((parameter, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <input
                value={parameter}
                onChange={(e) => setParameter(i, e.target.value)}
                className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
                style={inputStyle}
              />
              <button
                onClick={() =>
                  onChange(index, {
                    parameters: action.parameters.filter((_, pi) => pi !== i),
                  })
                }
                className="rounded-lg p-1.5"
                aria-label="Remove parameter"
              >
                <X className="h-4 w-4" style={{ color: T.textMuted }} />
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              onChange(index, { parameters: [...action.parameters, ""] })
            }
            className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed px-3 py-2 text-xs font-medium"
            style={{ borderColor: T.primaryBord, color: T.textMuted }}
          >
            <Plus className="h-3.5 w-3.5" />
            Add parameter
          </button>
        </div>
      </Field>
    </div>
  );
};

export default RuleCanvas;
