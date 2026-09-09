/**
 * Rule Engine API — applicable models, attributes, rules, conditions, actions.
 *
 * Naming is the thing to keep straight, because three ids are in play and the
 * backend is picky about which goes where:
 *
 *   AvailableModel   — the catalogue row for a table   (available_model_id)
 *   ApplicableModel  — that model enabled for a tenant (applicable model id)
 *   lock_model_name  — the real class/table name
 *
 * A condition stores the APPLICABLE model id in `condition_selected_model`
 * (Executor#applicable_rules matches on applicable-model ids), while an action
 * stores the AVAILABLE model id in `action_selected_model` plus the applicable
 * id in `rule_engine_applicable_model_id`. Crossing these produces a rule that
 * saves cleanly and never fires.
 *
 * Display names are for the UI only; every value written back is the original
 * `attribute_name` / `lock_model_name`.
 */
import { getFullUrl, getAuthHeader } from "@/config/apiConfig";

// ── Operators ─────────────────────────────────────────────────────────────
// RuleEngine::Condition declares `enum operator: { equals: 0, not_equals: 1,
// greater_than: 2, less_than: 3 }` and Executor#compare returns false for
// anything else, so these four are the whole set. Do not add to this list
// without adding the matching branch in lib/rule_engine/executor.rb.
export const OPERATORS = [
  { value: "equals", label: "equals", symbol: "=" },
  { value: "not_equals", label: "not equals", symbol: "≠" },
  { value: "greater_than", label: "greater than", symbol: ">" },
  { value: "less_than", label: "less than", symbol: "<" },
] as const;

export const operatorSymbol = (value: string) =>
  OPERATORS.find((o) => o.value === value)?.symbol ?? value;

/**
 * Executor#conditions_met? partitions on `condition_type` — everything that is
 * not "OR" counts as AND. All ANDs must pass and at least one OR must pass.
 */
export const CONDITION_TYPES = [
  { value: "AND", label: "AND — all must match" },
  { value: "OR", label: "OR — any may match" },
] as const;

/**
 * Filters which rules run for a given trigger:
 * Executor#applicable_rules does `where(action_type: [@action_type, nil])`.
 */
export const ACTION_TYPES = [
  { value: "created", label: "On create" },
  { value: "updated", label: "On update" },
] as const;

// ── Types ─────────────────────────────────────────────────────────────────

/** A model enabled for the tenant — the only model picker in this UI. */
export interface ApplicableModel {
  /** ApplicableModel id — goes into a condition's condition_selected_model. */
  id: number;
  /** AvailableModel id — goes into an action's action_selected_model, and is
   *  what the attributes endpoint is keyed on. */
  availableModelId: number;
  displayName: string;
  /** Real class/table name — goes into an action's lock_model_name. */
  lockModelName: string;
  type: string | null;
  /** The data source this model was pulled from. Null for internal models. */
  datasourceId: number | null;
  active: boolean;
}

/** Just enough of a data source to label it in a picker. */
export interface DataSourceOption {
  id: number;
  name: string;
}

/**
 * A product-module grouping over one data source's models — "Maintenance",
 * "Attendance" inside a PATM database.
 *
 * Buckets are OPTIONAL and sit alongside the plain model flow, they do not
 * replace it. Use them only when one data source carries several products; when
 * the data source is the product, the data source is already the boundary.
 */
export interface Bucket {
  id: number;
  name: string;
  datasourceId: number | null;
  active: boolean;
  modelsCount: number;
  datasourceName: string | null;
  createdByName: string | null;
}

/** A model filed under a bucket. */
export interface BucketModel {
  /** AvailableModel id — what the attributes endpoint is keyed on. */
  availableModelId: number;
  displayName: string;
  lockModelName: string;
  type: string | null;
  datasourceId: number | null;
  bucketId: number | null;
  attributesCount: number;
  /** Only present when the bucket was fetched with attributes: true. */
  attributes?: AttributeOption[];
}

/** A bucket published to the tenant, with the models inside it. */
export interface TenantBucket {
  /** ApplicableModel id — the row scoping this bucket to the tenant. */
  id: number;
  bucketId: number;
  name: string;
  datasourceId: number | null;
  active: boolean;
  models: BucketModel[];
}

export interface AttributeOption {
  id: number;
  /** Original column name — this is what a condition stores. */
  attributeName: string;
  displayName: string;
}

/** A registered action on a model — a RuleEngine::AvailableFunction row. */
export interface FunctionOption {
  id: number;
  /** Real Ruby method the action calls. */
  functionName: string;
  displayName: string;
}

export interface RuleCondition {
  id?: number;
  conditionAttribute: string;
  operator: string;
  compareValue: string;
  /** ApplicableModel id. */
  conditionSelectedModel: number | null;
  conditionType: string;
  actionType: string;
  /** Read-only label the rules API sends back. */
  modelName?: string;
}

export interface RuleAction {
  id?: number;
  lockModelName: string;
  /**
   * Method invoked on the model. Mirrors the picked function's name — the
   * backend re-validates it against the AvailableFunction whitelist at run time.
   */
  actionMethod: string;
  /**
   * The AvailableFunction picked. Sent so Action#set_method_name can fill
   * action_method server-side, which keeps the two from drifting apart.
   */
  availableFunctionId: number | null;
  /** Set when the picked function is a custom action rather than a code method. */
  customActionId: number | null;
  /** AvailableModel id. */
  actionSelectedModel: number | null;
  applicableModelId: number | null;
  parameters: string[];
}

/** Which segregation a rule was built under. */
export type RuleScopeType = "model" | "bucket";

export interface Rule {
  id: number;
  name: string;
  description: string;
  active: boolean;
  modelId: number | null;
  /** Set when the rule was built against a whole bucket rather than one model. */
  bucketId: number | null;
  scopeType: RuleScopeType;
  bucketName: string | null;
  companyId: number | null;
  userId: number | null;
  createdAt: string | null;
  conditions: RuleCondition[];
  actions: RuleAction[];
}

// ── Fetch plumbing ────────────────────────────────────────────────────────

const headers = (json = false) => {
  const base: Record<string, string> = {
    Authorization: getAuthHeader(),
    Accept: "application/json",
  };
  if (json) base["Content-Type"] = "application/json";
  return base;
};

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

const request = async (
  path: string,
  init?: RequestInit,
  fallback = "Request failed"
) => {
  const response = await fetch(getFullUrl(path), init);
  // DELETE endpoints answer 204 with no body.
  const body = response.status === 204 ? null : await readJson(response);
  if (!response.ok) {
    throw new Error(errorText(body, `${fallback} (${response.status})`));
  }
  return body;
};

const asArray = (body: any, ...keys: string[]): any[] => {
  if (Array.isArray(body)) return body;
  for (const key of keys) if (Array.isArray(body?.[key])) return body[key];
  return [];
};

const str = (value: unknown) => String(value ?? "").trim();

const num = (value: unknown): number | null =>
  value === null || value === undefined || value === "" ? null : Number(value);

// ── Catalogue reads ───────────────────────────────────────────────────────

/** GET /datasources.json — names for the data source picker. */
export const fetchDataSources = async (): Promise<DataSourceOption[]> => {
  const body = await request(
    "/datasources.json",
    { headers: headers() },
    "Failed to load data sources"
  );

  return asArray(body, "datasources", "data")
    .map((row: any) => ({
      id: Number(row?.id),
      name: str(row?.datasource_name) || `Data source #${row?.id}`,
    }))
    .filter((d) => Number.isFinite(d.id));
};

/**
 * GET /rule_engine/available_models/:id.json
 *
 * One catalogue row, for resolving which data source a model belongs to. The
 * rules API returns only `model_id`, so opening an existing rule needs this to
 * work out which data source to preselect — without it the only alternative is
 * pulling the whole unfiltered model list.
 */
export const fetchAvailableModelDatasource = async (
  availableModelId: number
): Promise<number | null> => {
  const body = await request(
    `/rule_engine/available_models/${availableModelId}.json`,
    { headers: headers() },
    "Failed to resolve the model's data source"
  );
  return num(body?.datasource_id);
};

/**
 * GET /rule_engine/applicable_models/tenant_models.json?datasource_id=
 *
 * The model dropdown. Sourced from the applicable models — what this tenant may
 * actually build rules on — not from the raw catalogue.
 *
 * Callers pass a datasourceId so the list is scoped to one source. Omitting it
 * returns every applicable model, which the canvas deliberately never does.
 */
export const fetchApplicableModels = async (
  datasourceId?: number | string
): Promise<ApplicableModel[]> => {
  const query = datasourceId ? `?datasource_id=${datasourceId}` : "";
  const body = await request(
    `/rule_engine/applicable_models/tenant_models.json${query}`,
    { headers: headers() },
    "Failed to load models"
  );

  return asArray(body, "models", "tenant_models", "data")
    .map((row: any) => ({
      id: Number(row?.id),
      availableModelId: Number(row?.available_model_id),
      lockModelName: str(row?.lock_model_name),
      displayName: str(row?.display_name) || str(row?.lock_model_name),
      type: row?.type ?? null,
      datasourceId: num(row?.datasource_id),
      active: row?.active !== false,
    }))
    .filter(
      (m) => Number.isFinite(m.id) && Number.isFinite(m.availableModelId)
    );
};

// ── Buckets ───────────────────────────────────────────────────────────────
// The product-segregation flow: data source → bucket → assign models → enable
// the bucket → build rules on it. Entirely optional; a data source that is a
// single product never touches any of this.

const mapBucketModel = (row: any): BucketModel => ({
  availableModelId: Number(row?.available_model_id ?? row?.id),
  displayName: str(row?.display_name) || str(row?.lock_model_name),
  lockModelName: str(row?.lock_model_name),
  type: row?.type ?? null,
  datasourceId: num(row?.datasource_id),
  bucketId: num(row?.bucket_id),
  attributesCount: Number(row?.attributes_count ?? 0),
  attributes: Array.isArray(row?.attributes)
    ? row.attributes.map((a: any) => ({
        id: Number(a?.id),
        attributeName: str(a?.attribute_name),
        displayName: str(a?.display_name) || str(a?.attribute_name),
      }))
    : undefined,
});

const mapBucket = (row: any): Bucket => ({
  id: Number(row?.id),
  name: str(row?.name),
  datasourceId: num(row?.datasource_id),
  active: row?.active !== false,
  modelsCount: Number(row?.models_count ?? 0),
  datasourceName: row?.datasource_name ?? null,
  createdByName: row?.created_by_name ?? null,
});

/** GET /datasources/buckets.json?datasource_id= — buckets on one data source. */
export const fetchBuckets = async (
  datasourceId?: number | string
): Promise<Bucket[]> => {
  const query = datasourceId ? `?datasource_id=${datasourceId}` : "";
  const body = await request(
    `/datasources/buckets.json${query}`,
    { headers: headers() },
    "Failed to load buckets"
  );
  return asArray(body, "buckets", "data")
    .map(mapBucket)
    .filter((b) => Number.isFinite(b.id));
};

/**
 * GET /datasources/buckets/:id.json?attributes=true
 *
 * One bucket with its models. `withAttributes` nests every model's attributes
 * too — that is the shape the rule-engine preview reads.
 */
export const fetchBucket = async (
  bucketId: number | string,
  withAttributes = false
): Promise<Bucket & { models: BucketModel[] }> => {
  const body = await request(
    `/datasources/buckets/${bucketId}.json${withAttributes ? "?attributes=true" : ""}`,
    { headers: headers() },
    "Failed to load bucket"
  );
  return {
    ...mapBucket(body),
    models: asArray(body?.models).map(mapBucketModel),
  };
};

/** POST /datasources/buckets.json */
export const createBucket = async (payload: {
  datasourceId: number;
  name: string;
  active?: boolean;
}): Promise<Bucket> => {
  const body = await request(
    "/datasources/buckets.json",
    {
      method: "POST",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({
        bucket: {
          datasource_id: payload.datasourceId,
          name: payload.name,
          active: payload.active ?? true,
        },
      }),
    },
    "Failed to create bucket"
  );
  return mapBucket(body);
};

/** PATCH /datasources/buckets/:id.json — name/active only; the data source is fixed. */
export const updateBucket = async (
  bucketId: number,
  payload: { name?: string; active?: boolean }
): Promise<Bucket> => {
  const body = await request(
    `/datasources/buckets/${bucketId}.json`,
    {
      method: "PATCH",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({ bucket: payload }),
    },
    "Failed to update bucket"
  );
  return mapBucket(body);
};

/** DELETE /datasources/buckets/:id.json — unfiles its models, never deletes them. */
export const deleteBucket = (bucketId: number) =>
  request(
    `/datasources/buckets/${bucketId}.json`,
    { method: "DELETE", headers: headers() },
    "Failed to delete bucket"
  );

/**
 * POST /datasources/buckets/:id/assign_models.json
 *
 * Files models under the bucket. `replace` (default true) makes the bucket hold
 * exactly the ids given. Ids from another data source come back in
 * rejected_available_model_ids rather than being silently dropped.
 */
export const assignBucketModels = async (
  bucketId: number,
  availableModelIds: number[],
  replace = true
): Promise<{
  assignedCount: number;
  rejected: number[];
  models: BucketModel[];
}> => {
  const body = await request(
    `/datasources/buckets/${bucketId}/assign_models.json`,
    {
      method: "POST",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({
        available_model_ids: availableModelIds,
        replace,
      }),
    },
    "Failed to assign models to bucket"
  );
  return {
    assignedCount: Number(body?.assigned_count ?? 0),
    rejected: asArray(body?.rejected_available_model_ids).map(Number),
    models: asArray(body?.models).map(mapBucketModel),
  };
};

/**
 * GET /datasources/tenant_buckets.json?datasource_id=
 *
 * The rule-author view: buckets enabled for this tenant, each with its models.
 * Bucket-flow counterpart of fetchApplicableModels — pick a bucket, then pick a
 * model inside it, then feed that model's availableModelId to fetchAttributes.
 */
export const fetchTenantBuckets = async (
  datasourceId?: number | string
): Promise<TenantBucket[]> => {
  const query = datasourceId ? `?datasource_id=${datasourceId}` : "";
  const body = await request(
    `/datasources/tenant_buckets.json${query}`,
    { headers: headers() },
    "Failed to load buckets"
  );
  return asArray(body, "buckets", "tenant_buckets", "data")
    .map((row: any) => ({
      id: Number(row?.id),
      bucketId: Number(row?.bucket_id),
      name: str(row?.name) || str(row?.bucket_name),
      datasourceId: num(row?.datasource_id),
      active: row?.active !== false,
      models: asArray(row?.models).map(mapBucketModel),
    }))
    .filter((b) => Number.isFinite(b.bucketId));
};

/**
 * POST /rule_engine/applicable_models/enable_models.json { bucket_ids: [...] }
 *
 * Publishes whole buckets to the tenant — one applicable row per bucket, with
 * available_model_id left null, exposing every model inside it at once.
 */
export const enableBuckets = async (
  bucketIds: number[]
): Promise<{
  enabledCount: number;
  createdCount: number;
  errors: string[];
}> => {
  const body = await request(
    "/rule_engine/applicable_models/enable_models.json",
    {
      method: "POST",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({ bucket_ids: bucketIds }),
    },
    "Failed to enable buckets"
  );
  return {
    enabledCount: Number(body?.enabled_count ?? 0),
    createdCount: Number(body?.created_count ?? 0),
    errors: asArray(body?.errors).map(String),
  };
};

/** GET /rule_engine/available_attributes/dropdown.json?available_model_id= */
export const fetchAttributes = async (
  availableModelId: number
): Promise<AttributeOption[]> => {
  const body = await request(
    `/rule_engine/available_attributes/dropdown.json?available_model_id=${availableModelId}`,
    { headers: headers() },
    "Failed to load attributes"
  );

  return asArray(body, "attributes", "data")
    .map((row: any) => ({
      id: Number(row?.id),
      attributeName: str(row?.attribute_name),
      displayName: str(row?.display_name) || str(row?.attribute_name),
    }))
    .filter((a) => a.attributeName);
};

/** The actions a model exposes, for the action picker. */
export const fetchFunctions = async (
  availableModelId: number
): Promise<FunctionOption[]> => {
  const body = await request(
    `/rule_engine/available_functions/dropdown.json?available_model_id=${availableModelId}`,
    { headers: headers() },
    "Failed to load actions"
  );

  return asArray(body, "functions", "data")
    .map((row: any) => ({
      id: Number(row?.id),
      functionName: str(row?.function_name),
      displayName: str(row?.display_name) || str(row?.function_name),
    }))
    .filter((f) => f.functionName);
};

// ── Rules ─────────────────────────────────────────────────────────────────

const parseCondition = (row: any): RuleCondition => ({
  id: row?.id ?? undefined,
  conditionAttribute: str(row?.condition_attribute),
  operator: str(row?.operator) || "equals",
  compareValue: str(row?.compare_value),
  conditionSelectedModel: num(row?.condition_selected_model),
  conditionType: str(row?.condition_type).toUpperCase() === "OR" ? "OR" : "AND",
  actionType: str(row?.action_type) || "created",
  modelName: row?.model_name ?? undefined,
});

const parseAction = (row: any): RuleAction => ({
  id: row?.id ?? undefined,
  lockModelName: str(row?.lock_model_name),
  actionMethod: str(row?.action_method),
  availableFunctionId: row?.rule_engine_available_function_id ?? null,
  customActionId: row?.custom_action_id ?? null,
  actionSelectedModel: num(row?.action_selected_model),
  applicableModelId: num(row?.rule_engine_applicable_model_id),
  // json column; older rows may hold something other than an array.
  parameters: Array.isArray(row?.parameters) ? row.parameters.map(String) : [],
});

const parseRule = (row: any): Rule => ({
  id: Number(row?.id),
  name: str(row?.name),
  description: str(row?.description),
  active: Boolean(row?.active),
  modelId: num(row?.model_id),
  bucketId: num(row?.bucket_id),
  scopeType: (row?.scope_type === "bucket"
    ? "bucket"
    : "model") as RuleScopeType,
  bucketName: row?.bucket_name ?? null,
  companyId: num(row?.company_id),
  userId: num(row?.user_id),
  createdAt: row?.created_at ?? null,
  conditions: asArray(row?.conditions).map(parseCondition),
  actions: asArray(row?.actions).map(parseAction),
});

export const fetchRules = async (): Promise<Rule[]> => {
  const body = await request(
    "/rule_engine/rules.json",
    { headers: headers() },
    "Failed to load rules"
  );
  return asArray(body, "rules", "data")
    .map(parseRule)
    .filter((r) => Number.isFinite(r.id));
};

export const fetchRule = async (id: number): Promise<Rule> => {
  const body = await request(
    `/rule_engine/rules/${id}.json`,
    { headers: headers() },
    "Failed to load rule"
  );
  return parseRule(body);
};

export interface RuleDraft {
  name: string;
  description: string;
  active: boolean;
  /** AvailableModel id — RuleEngine::Rule#available_model is keyed on model_id. */
  modelId: number | null;
  /** Bucket id when the rule was built in the product-segregation flow.
   *  Sent alongside modelId: the bucket records which module the rule belongs
   *  to, modelId still records which table its conditions read. */
  bucketId?: number | null;
  conditions: RuleCondition[];
  actions: RuleAction[];
  /** Rows removed since load — sent back as _destroy. */
  removedConditionIds?: number[];
  removedActionIds?: number[];
}

/**
 * Create and update both go through the nested-attributes form, so a rule and
 * its whole body travel in one request.
 *
 * company_id / organization_id / user_id are intentionally absent — the
 * controller stamps them from the signed-in user and no longer permits them.
 */
const buildPayload = (draft: RuleDraft) => ({
  rule_engine_rule: {
    name: draft.name,
    description: draft.description,
    active: draft.active,
    model_id: draft.modelId,
    bucket_id: draft.bucketId ?? null,
    rule_engine_conditions_attributes: [
      ...draft.conditions.map((condition) => ({
        ...(condition.id ? { id: condition.id } : {}),
        condition_attribute: condition.conditionAttribute,
        operator: condition.operator,
        compare_value: condition.compareValue,
        condition_selected_model: condition.conditionSelectedModel,
        condition_type: condition.conditionType,
        action_type: condition.actionType,
      })),
      ...(draft.removedConditionIds ?? []).map((id) => ({
        id,
        _destroy: true,
      })),
    ],
    rule_engine_actions_attributes: [
      ...draft.actions.map((action) => ({
        ...(action.id ? { id: action.id } : {}),
        lock_model_name: action.lockModelName,
        action_method: action.actionMethod,
        rule_engine_available_function_id: action.availableFunctionId,
        custom_action_id: action.customActionId,
        action_selected_model: action.actionSelectedModel,
        rule_engine_applicable_model_id: action.applicableModelId,
        parameters: action.parameters,
      })),
      ...(draft.removedActionIds ?? []).map((id) => ({ id, _destroy: true })),
    ],
  },
});

export const createRule = async (draft: RuleDraft): Promise<Rule> => {
  const body = await request(
    "/rule_engine/rules.json",
    {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(buildPayload(draft)),
    },
    "Failed to create rule"
  );
  return parseRule(body);
};

export const updateRule = async (
  id: number,
  draft: RuleDraft
): Promise<Rule> => {
  const body = await request(
    `/rule_engine/rules/${id}.json`,
    {
      method: "PUT",
      headers: headers(true),
      body: JSON.stringify(buildPayload(draft)),
    },
    "Failed to update rule"
  );
  return parseRule(body);
};

export const deleteRule = (id: number) =>
  request(
    `/rule_engine/rules/${id}.json`,
    { method: "DELETE", headers: headers() },
    "Failed to delete rule"
  );

// ── Conditions / actions, addressed directly ──────────────────────────────
// The canvas saves through the rule's nested attributes, so these are here for
// reading a rule's rows back and for deleting one outside a full save.

/** GET /rule_engine/conditions.json?rule_engine_rule_id= */
export const fetchConditions = async (
  ruleId: number
): Promise<RuleCondition[]> => {
  const body = await request(
    `/rule_engine/conditions.json?rule_engine_rule_id=${ruleId}`,
    { headers: headers() },
    "Failed to load conditions"
  );
  return asArray(body, "conditions", "data").map(parseCondition);
};

/** GET /rule_engine/actions.json?rule_engine_rule_id= */
export const fetchActions = async (ruleId: number): Promise<RuleAction[]> => {
  const body = await request(
    `/rule_engine/actions.json?rule_engine_rule_id=${ruleId}`,
    { headers: headers() },
    "Failed to load actions"
  );
  return asArray(body, "actions", "data").map(parseAction);
};

export const deleteCondition = (id: number) =>
  request(
    `/rule_engine/conditions/${id}.json`,
    { method: "DELETE", headers: headers() },
    "Failed to delete condition"
  );

export const deleteAction = (id: number) =>
  request(
    `/rule_engine/actions/${id}.json`,
    { method: "DELETE", headers: headers() },
    "Failed to delete action"
  );

/* ── Datasource structure ─────────────────────────────────────────────────
   The whole catalogue behind one datasource, shaped by how it was configured:
   `bucketed` true means read `buckets`, false means read `models`. Backs the
   datasource detail view. */

export interface StructureAttribute {
  id: number;
  displayName: string;
  attributeName: string;
  dataType: string | null;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  referencesTable: string | null;
  referencesColumn: string | null;
  /** 'declared' = a real FOREIGN KEY constraint. 'inferred' = guessed from the
   *  *_id naming convention. Shown differently — a guess is not a fact. */
  relationshipSource: "declared" | "inferred" | null;
}

export interface StructureModel {
  id: number;
  availableModelId: number;
  displayName: string;
  lockModelName: string;
  attributesCount: number;
  attributes: StructureAttribute[];
  applicable: boolean;
  bucketName: string | null;
}

export interface StructureBucket {
  id: number;
  name: string;
  active: boolean;
  applicable: boolean;
  modelsCount: number;
  createdByName: string | null;
  models: StructureModel[];
}

export interface DatasourceStructure {
  datasource: Record<string, any>;
  bucketed: boolean;
  mode: "module" | "whole";
  counts: {
    buckets: number;
    models: number;
    unbucketed_models: number;
    attributes: number;
    applicable_buckets: number;
    applicable_models: number;
  };
  buckets: StructureBucket[];
  unbucketedModels: StructureModel[];
  models: StructureModel[];
}

const toStructureModel = (row: any): StructureModel => ({
  id: Number(row?.id),
  availableModelId: Number(row?.available_model_id ?? row?.id),
  displayName: String(row?.display_name ?? "").trim(),
  lockModelName: String(row?.lock_model_name ?? "").trim(),
  attributesCount: Number(row?.attributes_count ?? 0),
  attributes: Array.isArray(row?.attributes)
    ? row.attributes.map((a: any) => ({
        id: Number(a?.id),
        displayName: String(a?.display_name ?? "").trim(),
        attributeName: String(a?.attribute_name ?? "").trim(),
        dataType: a?.data_type ?? null,
        isPrimaryKey: Boolean(a?.is_primary_key),
        isForeignKey: Boolean(a?.is_foreign_key),
        referencesTable: a?.references_table ?? null,
        referencesColumn: a?.references_column ?? null,
        relationshipSource:
          a?.relationship_source === "declared"
            ? "declared"
            : a?.relationship_source === "inferred"
              ? "inferred"
              : null,
      }))
    : [],
  applicable: Boolean(row?.applicable),
  bucketName: row?.bucket_name ?? null,
});

/** GET /datasources/:id/structure.json */
export const fetchDatasourceStructure = async (
  datasourceId: number | string,
  withAttributes = true
): Promise<DatasourceStructure> => {
  const body = await request(
    `/datasources/${datasourceId}/structure.json?attributes=${withAttributes}`,
    { headers: headers() },
    "Failed to load data source structure"
  );
  return {
    datasource: body?.datasource ?? {},
    bucketed: Boolean(body?.bucketed),
    mode: body?.mode === "module" ? "module" : "whole",
    counts: body?.counts ?? {
      buckets: 0,
      models: 0,
      unbucketed_models: 0,
      attributes: 0,
      applicable_buckets: 0,
      applicable_models: 0,
    },
    buckets: (Array.isArray(body?.buckets) ? body.buckets : []).map(
      (b: any): StructureBucket => ({
        id: Number(b?.id),
        name: String(b?.name ?? "").trim(),
        active: b?.active !== false,
        applicable: Boolean(b?.applicable),
        modelsCount: Number(b?.models_count ?? 0),
        createdByName: b?.created_by_name ?? null,
        models: (Array.isArray(b?.models) ? b.models : []).map(
          toStructureModel
        ),
      })
    ),
    unbucketedModels: (Array.isArray(body?.unbucketed_models)
      ? body.unbucketed_models
      : []
    ).map(toStructureModel),
    models: (Array.isArray(body?.models) ? body.models : []).map(
      toStructureModel
    ),
  };
};

/* ── Custom actions ───────────────────────────────────────────────────────
   Actions defined as data instead of Ruby. A custom action is created against
   a datasource (optionally narrowed to a bucket or a single model), then
   REGISTERED — which puts it into rule_engine_available_functions so the rule
   builder offers it beside the code-level methods. */

export interface CustomActionKind {
  kind: string;
  description: string;
  requiredConfigKeys: string[];
  writesData: boolean;
}

export interface CustomAction {
  id: number;
  name: string;
  kind: string;
  description: string | null;
  config: Record<string, any>;
  datasourceId: number | null;
  bucketId: number | null;
  availableModelId: number | null;
  datasourceName: string | null;
  bucketName: string | null;
  modelName: string | null;
  createdByName: string | null;
  active: boolean;
  registered: boolean;
  writesData: boolean;
  requiredConfigKeys: string[];
}

const mapCustomAction = (row: any): CustomAction => ({
  id: Number(row?.id),
  name: str(row?.name),
  kind: str(row?.kind),
  description: row?.description ?? null,
  config: row?.config ?? {},
  datasourceId: num(row?.datasource_id),
  bucketId: num(row?.bucket_id),
  availableModelId: num(row?.rule_engine_available_model_id),
  datasourceName: row?.datasource_name ?? null,
  bucketName: row?.bucket_name ?? null,
  modelName: row?.model_name ?? null,
  createdByName: row?.created_by_name ?? null,
  active: row?.active !== false,
  registered: Boolean(row?.registered),
  writesData: Boolean(row?.writes_data),
  requiredConfigKeys: Array.isArray(row?.required_config_keys)
    ? row.required_config_keys.map(String)
    : [],
});

/** GET /rule_engine/custom_actions/kinds.json — drives the Configure Action form. */
export const fetchCustomActionKinds = async (): Promise<CustomActionKind[]> => {
  const body = await request(
    "/rule_engine/custom_actions/kinds.json",
    { headers: headers() },
    "Failed to load action kinds"
  );
  return asArray(body, "kinds").map((k: any) => ({
    kind: str(k?.kind),
    description: str(k?.description),
    requiredConfigKeys: Array.isArray(k?.required_config_keys)
      ? k.required_config_keys.map(String)
      : [],
    writesData: Boolean(k?.writes_data),
  }));
};

/** GET /rule_engine/custom_actions.json */
export const fetchCustomActions = async (
  filters: {
    datasourceId?: number | string;
    bucketId?: number | string;
    availableModelId?: number | string;
  } = {}
): Promise<CustomAction[]> => {
  const query = new URLSearchParams();
  if (filters.datasourceId)
    query.set("datasource_id", String(filters.datasourceId));
  if (filters.bucketId) query.set("bucket_id", String(filters.bucketId));
  if (filters.availableModelId)
    query.set("available_model_id", String(filters.availableModelId));
  const suffix = query.toString() ? `?${query}` : "";
  const body = await request(
    `/rule_engine/custom_actions.json${suffix}`,
    { headers: headers() },
    "Failed to load custom actions"
  );
  return asArray(body, "custom_actions").map(mapCustomAction);
};

/** POST /rule_engine/custom_actions.json */
export const createCustomAction = async (payload: {
  name: string;
  kind: string;
  description?: string;
  datasourceId?: number | null;
  bucketId?: number | null;
  availableModelId?: number | null;
  config: Record<string, any>;
}): Promise<CustomAction> => {
  const body = await request(
    "/rule_engine/custom_actions.json",
    {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify({
        custom_action: {
          name: payload.name,
          kind: payload.kind,
          description: payload.description,
          datasource_id: payload.datasourceId,
          bucket_id: payload.bucketId,
          rule_engine_available_model_id: payload.availableModelId,
          config: payload.config,
        },
      }),
    },
    "Failed to create custom action"
  );
  return mapCustomAction(body);
};

/** DELETE /rule_engine/custom_actions/:id.json */
export const deleteCustomAction = async (id: number): Promise<void> => {
  await request(
    `/rule_engine/custom_actions/${id}.json`,
    { method: "DELETE", headers: headers() },
    "Failed to delete custom action"
  );
};

/** POST /rule_engine/custom_actions/:id/register.json */
export const registerCustomAction = async (
  id: number,
  availableModelId?: number | null
): Promise<void> => {
  await request(
    `/rule_engine/custom_actions/${id}/register.json`,
    {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify({ available_model_id: availableModelId }),
    },
    "Failed to register custom action"
  );
};

/* ── Code methods ─────────────────────────────────────────────────────────
   Public methods a model exposes. Public only: RuleEngine::Action#execute uses
   public_send, so anything else fails at run time inside a rescue. */

export interface CallableMethod {
  name: string;
  classMethod: boolean;
  risky: boolean;
  registered: boolean;
  parameters: { name: string; kind: string; required: boolean }[];
}

/** GET /rule_engine/available_functions/callable_methods.json */
export const fetchCallableMethods = async (
  availableModelId: number | string
): Promise<{
  instanceMethods: CallableMethod[];
  classMethods: CallableMethod[];
}> => {
  const body = await request(
    `/rule_engine/available_functions/callable_methods.json?available_model_id=${availableModelId}`,
    { headers: headers() },
    "Failed to load callable methods"
  );
  const map = (rows: any): CallableMethod[] =>
    (Array.isArray(rows) ? rows : []).map((m: any) => ({
      name: str(m?.name),
      classMethod: Boolean(m?.class_method),
      risky: Boolean(m?.risky),
      registered: Boolean(m?.registered),
      parameters: Array.isArray(m?.parameters)
        ? m.parameters.map((p: any) => ({
            name: str(p?.name),
            kind: str(p?.kind),
            required: Boolean(p?.required),
          }))
        : [],
    }));
  return {
    instanceMethods: map(body?.instance_methods),
    classMethods: map(body?.class_methods),
  };
};

/** POST /rule_engine/available_functions/register.json */
export const registerCodeFunction = async (payload: {
  availableModelId: number;
  functionName: string;
  displayName?: string;
}): Promise<void> => {
  await request(
    "/rule_engine/available_functions/register.json",
    {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify({
        available_model_id: payload.availableModelId,
        function_name: payload.functionName,
        display_name: payload.displayName,
      }),
    },
    "Failed to register function"
  );
};

/** GET /rule_engine/available_functions/for_model.json — the action dropdown. */
export interface RuleFunction {
  id: number;
  functionName: string;
  displayName: string;
  functionType: "code" | "custom";
  /** Present for a custom action — what the Action row links to directly. */
  customActionId: number | null;
  writesData: boolean;
  parametersSpec: { name: string; kind: string; required: boolean }[];
}

export const fetchFunctionsForModel = async (
  availableModelId: number | string
): Promise<RuleFunction[]> => {
  const body = await request(
    `/rule_engine/available_functions/for_model.json?available_model_id=${availableModelId}`,
    { headers: headers() },
    "Failed to load actions"
  );
  return asArray(body, "functions").map((f: any) => ({
    id: Number(f?.id),
    functionName: str(f?.function_name),
    displayName: str(f?.display_name) || str(f?.function_name),
    functionType: f?.function_type === "custom" ? "custom" : "code",
    customActionId: f?.custom_action?.id ?? null,
    writesData: Boolean(f?.custom_action?.writes_data),
    parametersSpec: Array.isArray(f?.parameters_spec)
      ? f.parameters_spec.map((p: any) => ({
          name: str(p?.name),
          kind: str(p?.kind),
          required: Boolean(p?.required),
        }))
      : [],
  }));
};

/* ── Ask AI ───────────────────────────────────────────────────────────────
   Natural language in, a configured record out. Both endpoints re-validate
   whatever the model returns against the real catalogue, so a proposal that
   comes back `success: false` carries the reasons in `errors`. */

export interface AgentResult<T> {
  success: boolean;
  /** false = proposal only, nothing was written. */
  persisted: boolean;
  explanation: string;
  confidence: string;
  errors: string[];
  payload: T | null;
}

const mapAgent = <T>(
  body: any,
  key: string,
  map: (row: any) => T
): AgentResult<T> => ({
  success: Boolean(body?.success),
  persisted: Boolean(body?.persisted),
  explanation: str(body?.explanation),
  confidence: str(body?.confidence),
  errors: Array.isArray(body?.errors) ? body.errors.map(String) : [],
  payload: body?.[key] ? map(body[key]) : null,
});

/** POST /rule_engine/custom_actions/agent.json */
export const askCustomActionAgent = async (payload: {
  prompt: string;
  datasourceId: number | string;
  bucketId?: number | null;
  persist?: boolean;
}): Promise<AgentResult<CustomAction>> => {
  const body = await request(
    "/rule_engine/custom_actions/agent.json",
    {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify({
        prompt: payload.prompt,
        datasource_id: payload.datasourceId,
        bucket_id: payload.bucketId,
        persist: payload.persist ?? false,
      }),
    },
    "The AI agent could not build that action"
  );
  return mapAgent(body, "custom_action", mapCustomAction);
};

export interface AgentRuleDraft {
  name: string;
  description: string | null;
  modelId: number | null;
  conditions: {
    conditionAttribute: string;
    operator: string;
    compareValue: string | null;
    conditionType: string;
    actionType: string;
    conditionSelectedModel: number | null;
  }[];
  actions: {
    lockModelName: string | null;
    actionMethod: string | null;
    availableFunctionId: number | null;
    customActionId: number | null;
    applicableModelId: number | null;
    parameters: string[];
  }[];
}

/** POST /rule_engine/rules/agent.json — defaults to preview, nothing written. */
export const askRuleAgent = async (payload: {
  prompt: string;
  datasourceId: number | string;
  bucketId?: number | null;
  persist?: boolean;
}): Promise<AgentResult<AgentRuleDraft>> => {
  const body = await request(
    "/rule_engine/rules/agent.json",
    {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify({
        prompt: payload.prompt,
        datasource_id: payload.datasourceId,
        bucket_id: payload.bucketId,
        persist: payload.persist ?? false,
      }),
    },
    "The AI agent could not build that rule"
  );
  return mapAgent(
    body,
    "rule",
    (row: any): AgentRuleDraft => ({
      name: str(row?.name),
      description: row?.description ?? null,
      modelId: num(row?.model_id),
      conditions: (Array.isArray(row?.conditions) ? row.conditions : []).map(
        (c: any) => ({
          conditionAttribute: str(c?.condition_attribute),
          operator: str(c?.operator),
          compareValue: c?.compare_value ?? null,
          conditionType: str(c?.condition_type) || "AND",
          actionType: str(c?.action_type) || "created",
          conditionSelectedModel: num(c?.condition_selected_model),
        })
      ),
      actions: (Array.isArray(row?.actions) ? row.actions : []).map(
        (a: any) => ({
          lockModelName: a?.lock_model_name ?? null,
          actionMethod: a?.action_method ?? null,
          availableFunctionId: num(a?.rule_engine_available_function_id),
          customActionId: num(a?.custom_action_id),
          applicableModelId: num(a?.rule_engine_applicable_model_id),
          parameters: Array.isArray(a?.parameters)
            ? a.parameters.map(String)
            : [],
        })
      ),
    })
  );
};
